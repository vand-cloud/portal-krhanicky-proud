/* eslint-disable no-console */
// Uploads the concept images generated (nano-banana-2) for the akce that had
// no photo, and sets them as heroImage on the matching catalogEntry. Concept
// art derived loosely from each event description -- generic and atmospheric,
// nothing invented or specific (exhibitions show blurred, indistinct works).
// Idempotent-ish: image assets are cached in a manifest so re-runs reuse them.
//
// Reads:
//   <scratchpad>/gen-images/results.json  (slug -> media_path)
//   <scratchpad>/gen-prompts.json         (slug -> alt)
//   <scratchpad>/akce-noimg.json          (slug -> real Sanity _id)
//
// Run: node_modules/.bin/tsx scripts/upload-akce-images-2026-07-13.ts
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SP = "/private/tmp/claude-501/-Users-simon-Projekty-0-CLAUDE-CODE/baf1eba7-6c99-47d0-9142-0a00989abe02/scratchpad/catalog-migration";

const env = Object.fromEntries(
  readFileSync(resolve(ROOT, ".env.local"), "utf8")
    .split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,"")]; }),
);
const client = createClient({ projectId: "4nb8kl4e", dataset: "production", apiVersion: "2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn: false });

type Res = { slug: string; media_path: string | null };
type Prompt = { slug: string; alt: string };
type Akce = { id: string; slug: string };

const results: Res[] = JSON.parse(readFileSync(`${SP}/gen-images/results.json`, "utf8"));
const prompts: Prompt[] = JSON.parse(readFileSync(`${SP}/gen-prompts.json`, "utf8"));
const akce: Akce[] = JSON.parse(readFileSync(`${SP}/akce-noimg.json`, "utf8"));

const altBySlug = Object.fromEntries(prompts.map((p) => [p.slug, p.alt]));
const idBySlug = Object.fromEntries(akce.map((a) => [a.slug, a.id]));

const MANIFEST = resolve(__dirname, "akce-image-manifest-2026-07-13.json");
const manifest: Record<string, string> = existsSync(MANIFEST)
  ? JSON.parse(readFileSync(MANIFEST, "utf8"))
  : {};

async function assetFor(slug: string, path: string): Promise<string> {
  if (manifest[slug]) return manifest[slug];
  const buf = readFileSync(path);
  const asset = await client.assets.upload("image", buf, { filename: `${slug}.png` });
  manifest[slug] = asset._id;
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  return asset._id;
}

async function run() {
  const usable = results.filter((r) => r.media_path);
  console.log(`Uploading ${usable.length} images...`);
  let done = 0, skipped = 0;
  const t = client.transaction();
  for (const r of usable) {
    const id = idBySlug[r.slug];
    const alt = altBySlug[r.slug];
    if (!id) { console.warn(`  ! no Sanity id for slug ${r.slug}, skipping`); skipped++; continue; }
    const assetId = await assetFor(r.slug, r.media_path!);
    t.patch(id, (p) => p.set({
      heroImage: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt },
    }));
    done++;
  }
  await t.commit();
  console.log(`OK: ${done} heroImages set, ${skipped} skipped.`);
}
run().catch((e) => { console.error(e); process.exit(1); });
