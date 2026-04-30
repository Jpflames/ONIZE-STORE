/* eslint-disable no-console */

const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");

function loadDotEnvIfNeeded() {
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    const p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadDotEnvIfNeeded();

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2025-02-19";
const token = process.env.SANITY_API_TOKEN;

const clerkUserId = process.argv[2];
if (!clerkUserId) {
  console.error("Usage: node scripts/debugAddresses.js <clerkUserId>");
  process.exit(2);
}

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
  process.exit(2);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

async function main() {
  const query =
    '*[_type=="address" && clerkUserId == $clerkUserId] | order(_createdAt desc){_id, fullName, addressType, line1, city, country, isDefault, _createdAt}';
  const res = await client.fetch(query, { clerkUserId });
  console.log(`addresses(${clerkUserId}) =`, res.length);
  console.log(res);
}

main().catch((err) => {
  console.error("ERROR:", err?.message || err);
  if (err?.response?.body) console.error("RESPONSE:", err.response.body);
  process.exit(1);
});

