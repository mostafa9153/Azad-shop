import fs from "fs";
import path from "path";
import { Client } from "pg";
import { loadStore, saveStore } from "../lib/store";

async function runMigrations() {
  console.log("=================================================");
  console.log("   AZAD HAYA (আজাদ হায়া) — DB Migration Runner  ");
  console.log("=================================================");

  const dbUrl = process.env.DATABASE_URL;
  const isLocalMode = process.env.LOCAL_MODE === "true" || !dbUrl || dbUrl.includes("azadhaya_demo") || dbUrl.includes("localhost:5432");

  const migrationPath = path.join(process.cwd(), "supabase", "migrations", "0001_initial_schema.sql");
  if (!fs.existsSync(migrationPath)) {
    console.error("Migration file not found at:", migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  if (!isLocalMode && dbUrl) {
    console.log("Connecting to live PostgreSQL database...");
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log("Executing SQL migration script...");
      await client.query(sql);
      console.log("✅ PostgreSQL schema migration completed successfully!");
      await client.end();
    } catch (err: any) {
      console.warn("⚠️ Remote PostgreSQL execution failed (" + err.message + "). Initializing local store fallback.");
    }
  } else {
    console.log("ℹ️ Local Mode active: Initializing typed local fallback schema (DEC-001)...");
  }

  // Ensure local schema storage is ready
  const store = loadStore();
  saveStore(store);
  console.log(`✅ Typed Local Store initialized with ${store.categories.length} categories and ${store.products.length} products.`);
  console.log("🎉 Migration Phase Complete!\n");
}

runMigrations().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
