import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email to clean, e.g., npx tsx clean-user.ts user@example.com");
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(`\n=== Cleaning user with email: ${email} ===`);

    // Find the user first to get their ID
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (user) {
      console.log(`Found user: ID=${user.id}, Email=${user.email}. Deleting...`);
      
      // Let's delete related entities first manually to make sure they are gone
      // (in case database constraints do not cascade properly)
      
      const deletedSessions = await prisma.session.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedSessions.count} related sessions.`);

      const deletedAccounts = await prisma.account.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedAccounts.count} related accounts.`);

      const deletedWorkouts = await prisma.workout.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedWorkouts.count} related workouts.`);

      const deletedWorkoutLogs = await prisma.workoutLog.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedWorkoutLogs.count} related workout logs.`);

      const deletedRunningStats = await prisma.runningStat.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedRunningStats.count} related running stats.`);

      const deletedNutritionPlans = await prisma.nutritionPlan.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedNutritionPlans.count} related nutrition plans.`);

      const deletedWeightEntries = await prisma.weightEntry.deleteMany({
        where: { userId: user.id }
      });
      console.log(`Deleted ${deletedWeightEntries.count} related weight entries.`);

      // Finally, delete the User
      const deletedUser = await prisma.user.delete({
        where: { id: user.id }
      });
      console.log(`Deleted User record successfully.`);
    } else {
      console.log(`No user record found for email: ${email}`);
    }

    // Now let's clean any orphaned records that might be floating around
    console.log("\n=== Cleaning Orphaned Records ===");
    
    // Find all users again to check orphan references
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const userIds = allUsers.map(u => u.id);

    // Delete orphaned accounts
    const orphanAccounts = await prisma.account.deleteMany({
      where: {
        NOT: {
          userId: { in: userIds }
        }
      }
    });
    console.log(`Cleaned ${orphanAccounts.count} orphaned accounts.`);

    // Delete orphaned sessions
    const orphanSessions = await prisma.session.deleteMany({
      where: {
        NOT: {
          userId: { in: userIds }
        }
      }
    });
    console.log(`Cleaned ${orphanSessions.count} orphaned sessions.`);

    console.log("\nDatabase clean completed successfully!");

  } catch (e) {
    console.error("Error occurred during database cleaning:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
