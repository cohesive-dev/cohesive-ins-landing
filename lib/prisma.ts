import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";

// Prisma 7 requires a driver adapter. We use the node-postgres adapter,
// pointing at DATABASE_URL.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

let cached: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (cached) return cached;
  cached = globalForPrisma.prisma ?? createPrismaClient();
  // Avoid exhausting the connection pool during dev hot-reloads.
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = cached;
  }
  return cached;
}

// Lazy proxy: the client (and its DATABASE_URL requirement) is only created on
// first use. Importing this module must never throw — `next build` imports
// route modules while collecting page data, and Vercel preview builds run
// without DATABASE_URL.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
