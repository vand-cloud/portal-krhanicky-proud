/* eslint-disable no-console */
// One-off read: dumps the full content of the 39 mista/gastro catalogEntry
// documents created by the Firecrawl refresh (2026-09-10) so the review agent
// can decide approved vs. pending on complete data.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/dump-new-mista-gastro.ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const SCRATCH =
  "/private/tmp/claude-501/-Users-simon-Projekty-0-CLAUDE-CODE/1617a7fd-72e6-4160-b9ee-65823f7eb73c/scratchpad/krhanicky-proud-refresh";

const env = Object.fromEntries(
  readFileSync(resolve(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const client = createClient({
  projectId: "4nb8kl4e",
  dataset: "production",
  apiVersion: "2026-04-27",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

type ManifestItem = { _id: string; title: string; sourceUrl: string; confidenceNote: string };

async function main() {
  const manifest: ManifestItem[] = JSON.parse(
    readFileSync(resolve(SCRATCH, "manifest-mista-gastro.json"), "utf8"),
  );
  const ids = manifest.map((m) => m._id);

  const docs = await client.fetch(
    `*[_type == "catalogEntry" && _id in $ids]{
      _id, title, entryType, status, trustLevel,
      "category": category->name, "categorySlug": category->slug.current, subcategory,
      description, address, gps, hours, price,
      sourceUrl, sourceLabel, sourceCheckedAt,
      contactEmail, contactPhone, website,
      "tags": tags[]->name,
      "hasHeroImage": defined(heroImage.asset),
      "heroAlt": heroImage.alt
    } | order(entryType asc, title asc)`,
    { ids },
  );

  const byId = new Map(manifest.map((m) => [m._id, m]));
  const merged = docs.map((d: Record<string, unknown>) => ({
    ...d,
    confidenceNote: byId.get(d._id as string)?.confidenceNote ?? null,
  }));

  writeFileSync(resolve(SCRATCH, "full-mista-gastro.json"), JSON.stringify(merged, null, 2));

  const missing = ids.filter((id) => !docs.some((d: { _id: string }) => d._id === id));
  console.log(`manifest ids: ${ids.length}`);
  console.log(`fetched docs: ${docs.length}`);
  if (missing.length) console.log(`MISSING: ${missing.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
