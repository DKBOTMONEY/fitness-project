import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function importExercises() {
  console.log("Fetching exercises from wger API (Limit: 200)...");
  
  // Fetch from wger exerciseinfo which includes equipment and images
  const response = await fetch("https://wger.de/api/v2/exerciseinfo/?language=2&limit=200");
  const data = await response.json();
  
  console.log(`Found ${data.results.length} exercises. Syncing to Local DB...`);

  let count = 0;
  for (const item of data.results) {
    try {
      // Find English translation (language ID 2) or first available
      const translation = item.translations?.find((t: any) => t.language === 2) || item.translations?.[0];
      
      const name = translation?.name || item.name || "Unnamed Exercise";
      const description = (translation?.description || item.description || "").replace(/<[^>]*>?/gm, '');

      // Determine category based on equipment
      const equipmentIds = item.equipment ? item.equipment.map((e: any) => e.id) : [];
      let category = "Weight Machines";
      
      if (equipmentIds.includes(7) || equipmentIds.length === 0) {
        category = "Bodyweight";
      } else if (equipmentIds.some((id: number) => [1, 2, 3, 10, 8].includes(id))) {
        category = "Free Weights";
      }

      // Get first image if available and ensure it's an absolute URL
      let imageUrl = item.images && item.images.length > 0 ? item.images[0].image : null;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://wger.de${imageUrl}`;
      }

      await prisma.exercise.upsert({
        where: { externalId: item.id },
        update: {
          name: name,
          category: category,
          description: description,
          image: imageUrl,
          equipment: item.equipment ? item.equipment.map((e: any) => e.name).join(", ") : "None",
        },
        create: {
          externalId: item.id,
          name: name,
          category: category,
          description: description,
          image: imageUrl,
          equipment: item.equipment ? item.equipment.map((e: any) => e.name).join(", ") : "None",
        },
      });
      count++;
      process.stdout.write(`\r- Synced: ${count}/${data.results.length} (${name.substring(0, 20)}...)`);
    } catch (e) {
      console.error(`\nFailed to import exercise ID ${item.id}:`, e);
    }
  }

  console.log(`\nSuccessfully synced ${count} exercises to Local DB!`);
}

importExercises()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
