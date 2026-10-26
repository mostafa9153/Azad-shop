import fs from "fs";
import path from "path";
import { Client } from "pg";

async function main() {
  console.log("=================================================");
  console.log("   AZAD HAYA (আজাদ হায়া) — Phase 0 Env Check    ");
  console.log("=================================================");

  const envPath = path.join(process.cwd(), ".env.local");
  const hasEnvFile = fs.existsSync(envPath);

  if (!hasEnvFile) {
    console.error("\n❌ CRITICAL: .env.local file not found in project root!");
    writeBlockedGuide("MISSING_ENV_LOCAL", "The file .env.local was not found.");
    process.exit(1);
  }

  // Parse .env.local
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, "");
        env[k] = v;
      }
    }
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = env.DATABASE_URL || process.env.DATABASE_URL;

  console.log(`Checking NEXT_PUBLIC_SUPABASE_URL... ${supabaseUrl ? "✅ FOUND" : "❌ MISSING"}`);
  console.log(`Checking NEXT_PUBLIC_SUPABASE_ANON_KEY... ${anonKey ? "✅ FOUND" : "❌ MISSING"}`);
  console.log(`Checking SUPABASE_SERVICE_ROLE_KEY... ${serviceKey ? "✅ FOUND" : "❌ MISSING"}`);
  console.log(`Checking DATABASE_URL... ${dbUrl ? "✅ FOUND" : "❌ MISSING"}`);

  if (!supabaseUrl || !anonKey || !serviceKey || !dbUrl) {
    console.error("\n❌ One or more required Supabase environment variables are missing in .env.local!");
    writeBlockedGuide("INCOMPLETE_ENV_VARS", "One or more 4 required variables are missing or empty.");
    process.exit(1);
  }

  if (
    supabaseUrl.includes("your-project") ||
    anonKey.includes("your-anon") ||
    serviceKey.includes("your-service-role") ||
    dbUrl.includes("your-project")
  ) {
    console.error("\n❌ Detected placeholder credentials in .env.local. Real credentials required for database connection.");
    writeBlockedGuide("PLACEHOLDER_CREDENTIALS", "Placeholder values were detected in .env.local.");
    process.exit(1);
  }

  // Test Database Connection via pg
  console.log("\nAttempting PostgreSQL connection via DATABASE_URL...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query("SELECT current_database(), current_user, version();");
    console.log(`✅ Connected successfully to PostgreSQL: ${res.rows[0].current_database}`);
    await client.end();
  } catch (err: any) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    writeBlockedGuide("DB_CONNECTION_FAILED", err.message);
    process.exit(1);
  }

  console.log("\n🎉 ALL PHASE 0 ENVIRONMENT CHECKS PASSED!");
  console.log("Ready to proceed with Phase 1 migrations and database setup.\n");
}

function writeBlockedGuide(reason: string, details: string) {
  const blockedContent = `# BLOCKED: Environment Setup Required

> **Timestamp:** ${new Date().toISOString()}  
> **Reason:** ${reason}  
> **Details:** ${details}

The unattended agent was unable to connect to the Supabase PostgreSQL database.
Per Master Prompt instructions: **"Only a failed Phase-0 environment check (database unreachable) may stop you: then write BLOCKED.md with exact steps and stop."**

---

## 🛠️ EXACT STEPS TO UNBLOCK

### Step 1: Create \`.env.local\` in the project folder
Ensure the file \`d:\\Claude folder\\Anti\\local cloth shop\\.env.local\` exists.

### Step 2: Fill in the 4 Required Credentials from Supabase
Go to your [Supabase Dashboard](https://supabase.com/dashboard):
1. Project Settings -> API:
   - **Project URL** -> \`NEXT_PUBLIC_SUPABASE_URL\`
   - **Project API keys (anon public)** -> \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - **Project API keys (service_role secret)** -> \`SUPABASE_SERVICE_ROLE_KEY\`
2. Project Settings -> Database -> Connection string:
   - Choose **Session pooler** (port 6543 or direct 5432)
   - Replace \`[YOUR-PASSWORD]\` with your database password -> \`DATABASE_URL\`

Example \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgres://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
\`\`\`

### Step 3: Verify the Environment
Run this in the terminal:
\`\`\`bash
npm run check:env
\`\`\`

### Step 4: Resume Autonomous Runner
Once \`npm run check:env\` passes, paste the **RESUME PROMPT**:
\`\`\`text
Read AGENTS.md, PROGRESS.md and DECISIONS.md. Find the first unfinished phase or unfinished step, check that the project still builds, and continue the same unattended phase loop from there until Phase 15 is done and MORNING_REPORT.md is written. Do not ask me anything. Same rules, same safety rules.
\`\`\`
`;

  fs.writeFileSync(path.join(process.cwd(), "BLOCKED.md"), blockedContent, "utf-8");
  console.log("\n📄 Created BLOCKED.md with exact resolution instructions.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
