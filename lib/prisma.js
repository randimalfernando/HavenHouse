import { PrismaClient } from "@prisma/client";
const g = globalThis;
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis;

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

