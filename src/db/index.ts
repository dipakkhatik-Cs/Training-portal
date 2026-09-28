import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { join } from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __cyberGuardPglite?: PGlite;
};

export const pool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ?? new Pool({ connectionString: databaseUrl })
  : null;

const localClient = databaseUrl
  ? null
  : globalForDb.__cyberGuardPglite ?? new PGlite(join(process.cwd(), ".cyberguard-db"));

if (process.env.NODE_ENV !== "production" && localClient) {
  globalForDb.__cyberGuardPglite = localClient;
}

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

const localDb = localClient ? drizzlePglite(localClient) : null;

export const db = databaseUrl ? drizzleNodePostgres(pool!) : localDb!;

export const databaseReady = databaseUrl
  ? Promise.resolve()
  : (async () => {
      await migrate(localDb!, { migrationsFolder: join(process.cwd(), "drizzle") });
      const { seedDatabase } = await import("./seedData");
      await seedDatabase();
    })();
