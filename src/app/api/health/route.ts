import { databaseReady, db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

import { seedDatabase } from "@/db/seedData";

export async function GET() {
  try {
    await databaseReady;
    await db.execute(sql`select 1`);
    // Ensure initial data exists
    await seedDatabase();
    return Response.json({ ok: true, status: "operational", service: "CyberGuard API" });
  } catch (error) {
    console.error("Health check error:", error);
    return Response.json({ ok: false, error: "Health check failed" }, { status: 500 });
  }
}
