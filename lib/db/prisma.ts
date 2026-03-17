// Prisma client singleton for database access
// This file is ONLY used when REPOSITORY_MODE="production"

import { PrismaClient } from "@prisma/client"

if (process.env.REPOSITORY_MODE === "production" && !process.env.DATABASE_URL) {
  throw new Error(
    "❌ Cannot initialize Prisma: DATABASE_URL is required when REPOSITORY_MODE=production\n" +
      "   Please set DATABASE_URL environment variable or switch to demo mode",
  )
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
