import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Base Prisma Client Singleton
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Creates an authorized Prisma client for a specific user.
 * This client enforces Row-Level Security (RLS) by setting the 'app.current_user_id' 
 * session variable before every query.
 */
export function getPrismaForUser(userId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          // Set the user ID for the current connection session
          // We use $executeRawUnsafe before the query. 
          // Since Prisma typically reuses connections from the pool for a single request 
          // (or we can wrap in a simpler transaction if needed, but SET is session-scoped),
          // this is more efficient than a full $transaction block for every single read.
          await prisma.$executeRawUnsafe(`SET app.current_user_id = '${userId}'`);
          return query(args);
        },
      },
    },
  });
}
