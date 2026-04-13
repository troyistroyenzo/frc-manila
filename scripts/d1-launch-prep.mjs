// D1 Launch Prep — run once before launch
// Usage: node scripts/d1-launch-prep.mjs
// Requires: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN in .env.local

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envLines = readFileSync(envPath, "utf8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const dbId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !dbId || !token) {
  console.error("Missing env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN");
  process.exit(1);
}

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;

async function d1(sql) {
  const res = await fetch(D1_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params: [] }),
  });
  const data = await res.json();
  if (!data.success) {
    const msg = data.errors?.[0]?.message ?? "unknown error";
    // Ignore "duplicate column" errors — column already exists
    if (msg.includes("duplicate column")) {
      console.log(`  ✓ (already exists) ${sql}`);
      return;
    }
    throw new Error(msg);
  }
  const changed = data.result?.[0]?.meta?.changes ?? "—";
  console.log(`  ✓ ${sql} (rows affected: ${changed})`);
}

console.log("\n🚀 FRC Manila D1 Launch Prep\n");

console.log("1. Adding phone columns...");
await d1("ALTER TABLE collaborations ADD COLUMN phone TEXT");
await d1("ALTER TABLE volunteer_applications ADD COLUMN phone TEXT");

console.log("\n2. Clearing test data...");
await d1("DELETE FROM collaborations");
await d1("DELETE FROM volunteer_applications");
await d1("DELETE FROM waitlist");

console.log("\n✅ Done. D1 is clean and schema is ready for launch.\n");
