/* eslint-disable no-console */
// One-off read: dumps the full field set of the 25 newly created `akce`
// catalogEntry documents (Firecrawl refresh 2026-09-10) so the review agent
// can judge each one against the approval criteria.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/dump-new-akce.ts
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

async function main() {
  const manifest = JSON.parse(
    readFileSync(resolve(SCRATCH, "manifest-akce.json"), "utf8"),
  ) as Array<{ _id: string }>;
  const ids = manifest.map((m) => m._id);

  const docs = await client.fetch(
    `*[_type == "catalogEntry" && _id in $ids]{
      _id, title, description, entryType,
      "category": category->name, "categorySlug": category->slug.current,
      subcategory, address, geo, startedAt, endedAt,
      sourceUrl, sourceLabel, contactEmail, contactPhone, contactWeb,
      organizer, status, trustLevel, price, tags,
      "heroImage": heroImage.asset->url,
      "heroImageAlt": heroImage.alt
    } | order(startedAt asc)`,
    { ids },
  );

  writeFileSync(resolve(SCRATCH, "full-akce.json"), JSON.stringify(docs, null, 2));
  console.log(`fetched: ${docs.length} / ${ids.length}`);
  const missing = ids.filter((id) => !docs.some((d: { _id: string }) => d._id === id));
  if (missing.length) console.log("MISSING:", missing);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
