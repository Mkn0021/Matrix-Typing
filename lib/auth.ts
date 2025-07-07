import { NextAuthOptions } from "next-auth";
import type { Account, Profile as NextAuthProfile, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { session } from '@/lib/session'
import { User , BaseUser } from "@/types/user";

// Extend Profile type for Google
interface GoogleProfile extends NextAuthProfile {
  picture?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },

        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                email: { label: "Email", type: "email", optional: true },
                password: { label: "Password", type: "password" },
                signup: { label: "Signup", type: "text", optional: true },
            },
            async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
                if (!credentials?.username || !credentials?.password) throw new Error("Username and password are required");

                try {
                    const isSignup = credentials.signup === "true";
                    const existingUser = await prisma.user.findUnique({ where: { username: credentials.username } });
                    if (isSignup) {
                        if (existingUser) throw new Error("Username already taken");

                        const passwordHash = await bcrypt.hash(credentials.password, 10);
                        const newUser = await prisma.user.create({
                            data: {
                                username: credentials.username,
                                email: credentials.email,
                                passwordHash,
                            },
                        });
                        return newUser;
                    } else {
                        // Login flow
                        if (!existingUser) throw new Error("User not found");
                        if (!existingUser.passwordHash) throw new Error("This account uses Google sign-in. Please use Google to log in.");
                        const isValid = await bcrypt.compare(credentials.password, existingUser.passwordHash);
                        if (!isValid) throw new Error("Invalid password");
                        return existingUser;
                    }
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth",
        error: "/auth",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn(params: { account: Account | null; profile?: NextAuthProfile | null; user?: NextAuthUser | null }): Promise<boolean> {
            const { account, profile, user } = params;

            if (account?.provider === "google") {
                if (!profile?.email) {
                    throw new Error("Email is required for Google sign-in");
                }
                const googleProfile = profile as GoogleProfile;

                try {
                    await prisma.user.upsert({
                        where: { email: googleProfile.email },
                        create: {
                            email: googleProfile.email!,
                            username: googleProfile.name || googleProfile.email!.split('@')[0],
                            passwordHash: "", // Google users have no password
                            image: googleProfile.picture || googleProfile.image || null,
                        },
                        update: {
                            username: googleProfile.name || googleProfile.email!.split('@')[0],
                            image: googleProfile.picture || googleProfile.image || null,
                        },
                    });
                } catch (error) {
                    console.error("Error during Google sign-in upsert:", error);
                    return false;
                }
                return true;
            }
            if (account?.provider === "credentials") {
                // Only allow login if user exists
                if (!user) return false;
                return true;
            }
            return true;
        },
        session,
        async jwt(params: { token: JWT; user?: NextAuthUser | null }): Promise<JWT> {
            const { token, user } = params;
            // Always fetch user from DB for latest info
            let dbUser : BaseUser | null = null;

            if (user?.email) {
                dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true,
                        level: true,
                        country: true,
                        rank: true,
                    },
                });
            } else if (token && token.email) {
                dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        image: true,
                        level: true,
                        country: true,
                        rank: true,
                    },
                });
            }
            if (dbUser) {
                token.id = dbUser.id;
                token.username = dbUser.username;
                token.email = dbUser.email;
                token.image = dbUser.image;
                token.level = dbUser.level;
                token.country = dbUser.country;
                token.rank = dbUser.rank;

                // Fetch user stats for bestWpm, bestAccuracy, totalTests, streak
                const stats = await prisma.typingStats.findMany({
                    where: { userId: dbUser.id },
                    orderBy: { createdAt: 'desc' },
                });


                let bestWpm = 0;
                let bestAccuracy = 0;
                let streak = 0;
                let currentStreak = 0;
                let lastDate: string | null = null;

                for (const stat of stats) {
                    if (stat.wpm > bestWpm) bestWpm = stat.wpm;
                    if (stat.accuracy > bestAccuracy) bestAccuracy = stat.accuracy;

                    const statDate = new Date(stat.createdAt).toISOString().slice(0, 10);
                    if (lastDate === null) {
                        currentStreak = 1;
                    } else {
                        const prev = new Date(lastDate);
                        const curr = new Date(statDate);
                        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
                        if (diff === 1) {
                            currentStreak++;
                        } else if (diff > 1) {
                            break;
                        }
                    }
                    lastDate = statDate;
                }
                streak = currentStreak;

                
                token.bestWpm = bestWpm;
                token.bestAccuracy = bestAccuracy;
                token.totalTests = stats.length;
                token.streak = streak;
            }
            return token;
        },
    },
};