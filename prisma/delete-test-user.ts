import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  const email = "boomdevil94@gmail.com";
  
  try {
    await client.connect();
    
    // Delete from user table (cascading delete should handle sessions/accounts if set up)
    const res = await client.query('DELETE FROM "user" WHERE email = $1 RETURNING *', [email]);

    if (res.rowCount && res.rowCount > 0) {
        console.log(`✅ User with email ${email} has been deleted from Database.`);
    } else {
        console.log(`❌ User with email ${email} not found.`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    await client.end();
  }
}

main();
