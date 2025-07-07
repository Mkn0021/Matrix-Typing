import NextAuth from "next-auth";
import type { PublicUser } from "@/types/user";
import type { JWT as DefaultJWT } from "next-auth/jwt";



declare module "next-auth" {
    interface Session {
        user: PublicUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends PublicUser { }
}
