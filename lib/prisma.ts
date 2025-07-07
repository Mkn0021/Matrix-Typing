import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Prevent multiple instances in dev (hot reload issue)
const prisma = global.prisma ?? (global.prisma = new PrismaClient());


export default prisma;
