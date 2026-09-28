import "dotenv/config";
import { databaseReady, pool } from "./index";
import { seedDatabase } from "./seedData";

async function main() {
  await databaseReady;
  await seedDatabase();
  await pool?.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
