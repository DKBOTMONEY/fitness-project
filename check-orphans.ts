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
    console.log("=== Checking Database Integrity ===");
    
    // 1. Get all Users
    const users = await prisma.user.findMany();
    console.log(`Total Users found: ${users.length}`);
    users.forEach(u => {
      console.log(`- User ID: ${u.id}, Email: ${u.email}, Name: ${u.name}`);
    });

    // 2. Get all Accounts
    const accounts = await prisma.account.findMany();
    console.log(`\nTotal Accounts found: ${accounts.length}`);
    for (const acc of accounts) {
      const userExists = users.some(u => u.id === acc.userId);
      console.log(`- Account ID: ${acc.id}, Provider: ${acc.providerId}, UserID: ${acc.userId}, UserExists: ${userExists ? "YES" : "NO (ORPHAN!)"}`);
    }

    // 3. Get all Sessions
    const sessions = await prisma.session.findMany();
    console.log(`\nTotal Sessions found: ${sessions.length}`);
    for (const sess of sessions) {
      const userExists = users.some(u => u.id === sess.userId);
      console.log(`- Session ID: ${sess.id}, UserID: ${sess.userId}, UserExists: ${userExists ? "YES" : "NO (ORPHAN!)"}`);
    }

    // 4. Verification Table
    const verifications = await prisma.verification.findMany();
    console.log(`\nTotal Verifications: ${verifications.length}`);
    verifications.forEach(v => {
      console.log(`- Verification ID: ${v.id}, Identifier (Email/IP): ${v.identifier}`);
    });

  } catch (e) {
    console.error("Error occurred:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
