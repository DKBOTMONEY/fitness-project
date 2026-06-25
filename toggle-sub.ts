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
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!user) {
      console.log("❌ No users found in database.");
      return;
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);
    console.log(`📊 Current subscription status: ${user.subscriptionStatus}`);

    let nextStatus = "ACTIVE";
    let nextEndDate: Date | null = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (user.subscriptionStatus === "ACTIVE") {
      nextStatus = "EXPIRED";
      nextEndDate = null;
    } else if (user.subscriptionStatus === "EXPIRED") {
      nextStatus = "TRIAL";
      // Force trial expiration by setting user creation date to 40 days ago
      await prisma.user.update({
        where: { id: user.id },
        data: {
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
        }
      });
      console.log(`⏱️ Shifted user creation date back 40 days to simulate trial expiration.`);
      nextEndDate = null;
    } else {
      nextStatus = "ACTIVE";
      // Reset creation date back to now
      await prisma.user.update({
        where: { id: user.id },
        data: {
          createdAt: new Date()
        }
      });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: nextStatus,
        subscriptionEndDate: nextEndDate
      }
    });

    console.log(`✅ Updated subscription status to: ${updated.subscriptionStatus}`);
    if (updated.subscriptionStatus === "TRIAL") {
      console.log(`👉 In TRIAL state, since user createdAt is 40 days ago, this will trigger the Blocker.`);
    }

  } catch (e) {
    console.error("❌ Error toggling subscription:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
