import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const tables = ['user', 'session', 'account', 'workout', 'exercise'];
    for (const table of tables) {
        try {
            const count = await (prisma as any)[table].count();
            console.log(`Table ${table} count:`, count);
        } catch (e) {
            console.log(`Table ${table} not found or error:`, (e as Error).message);
        }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();