import { getServerSession } from 'next-auth'
import type { Session } from "next-auth";
import type { PublicUser } from "@/types/user";
import type { JWT } from "next-auth/jwt";

export const session = async ({ session, token }: { session: Session, token: JWT }): Promise<Session> => {
    session.user.id = token.id;
    session.user.username = token.username;
    session.user.image = token.image;
    session.user.level = token.level;
    session.user.country = token.country;
    session.user.rank = token.rank;
    session.user.bestWpm = token.bestWpm;
    session.user.bestAccuracy = token.bestAccuracy;
    session.user.totalTests = token.totalTests;
    session.user.streak = token.streak;
    return session;
};

export const getUserSession = async (): Promise<PublicUser | null> => {
    const authUserSession = await getServerSession({
        callbacks: {
            session,
        },
    });
    return authUserSession?.user ?? null;
};