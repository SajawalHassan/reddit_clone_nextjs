import { PrismaClient } from "@prisma/client";

// To not make multiple instances of prisma during development through hot reload.

declare global {
  var prisma: PrismaClient;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
