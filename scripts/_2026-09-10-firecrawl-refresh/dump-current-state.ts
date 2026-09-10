/* eslint-disable no-console */
// One-off read: dumps current catalogCategory / catalogTag / catalogEntry
// (light fields only, for dedup + category-mapping context) to JSON files
// so the Firecrawl catalog-refresh agents (2026-09-10) have accurate ground
// truth on what already exists before proposing new entries.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/dump-current-state.ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const OUT = __dirname;

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
  const categories = await client.fetch(
    `*[_type == "catalogCategory"]{_id, name, "slug": slug.current, type, subcategories[]{title, "slug": slug.current}}`,
  );
  const tags = await client.fetch(
    `*[_type == "catalogTag"]{_id, name, "slug": slug.current, group, applicableForms}`,
  );
  const entries = await client.fetch(
    `*[_type == "catalogEntry"]{_id, title, entryType, "category": category->name, subcategory, address, sourceUrl, status, trustLevel}`,
  );

  writeFileSync(resolve(OUT, "categories.json"), JSON.stringify(categories, null, 2));
  writeFileSync(resolve(OUT, "tags.json"), JSON.stringify(tags, null, 2));
  writeFileSync(resolve(OUT, "existing-entries.json"), JSON.stringify(entries, null, 2));

  console.log(`categories: ${categories.length}`);
  console.log(`tags: ${tags.length}`);
  console.log(`existing entries: ${entries.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
