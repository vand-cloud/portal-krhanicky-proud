/* eslint-disable no-console */
// One-shot migration of the akce/mista/gastro/obchody/sluzby/spolky catalog
// (previously hardcoded in content/entries.ts) into Sanity, so Ivan can
// manage the whole thing from Studio. Source data is read from
// ./catalog-migration-2026-07-12-source-snapshot.ts, a frozen snapshot of
// the pre-migration content/entries.ts -- the live file lost its
// events[]/directory[]/entries export in this migration (data now comes
// from Sanity via lib/sanity/catalog.ts), so this snapshot is the only
// remaining place those arrays are read from.
//
// Idempotent: createOrReplace with deterministic _ids everywhere, and image
// uploads are cached in catalog-image-manifest.json so re-runs don't create
// duplicate assets.
//
// Run: node_modules/.bin/tsx scripts/migrate-catalog-2026-07-12.ts
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import {
  entries,
  categoryDefs,
  subcategoryDefs,
  tagDefs,
} from "./catalog-migration-2026-07-12-source-snapshot";
import type { Entry } from "./catalog-migration-2026-07-12-source-snapshot";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

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

// ── Alt text, generated separately (vision pass over all 56 photos) ────────
const altTexts: Record<string, string> = JSON.parse(
  readFileSync(resolve(__dirname, "catalog-image-alt-texts-2026-07-12.json"), "utf8"),
);

// Assets that turned out to be mismatched with their entry after a post-
// migration review (e.g. evt-konopiste-ruzova-zahrada-2026.webp is actually
// a historical photo of Giza, not the Konopiště rose garden). Excluded here
// so a re-run doesn't resurrect a manually-corrected production doc; the
// underlying file in public/brand/photos/ is left untouched (harmless,
// just unused) rather than deleted, since the mismatch may be a wrong-file
// mixup elsewhere worth investigating later, not a broken asset.
const EXCLUDED_IMAGES = new Set<string>([
  "/brand/photos/evt-konopiste-ruzova-zahrada-2026.webp",
]);

// ── Image upload manifest (path -> Sanity asset _id), avoids re-uploading on reruns ──
const MANIFEST_PATH = resolve(__dirname, "catalog-image-manifest.json");
const manifest: Record<string, string> = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
  : {};

async function uploadImage(heroImagePath: string): Promise<string> {
  if (manifest[heroImagePath]) return manifest[heroImagePath];
  const filePath = resolve(ROOT, "public", heroImagePath.replace(/^\//, ""));
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: heroImagePath.split("/").pop(),
  });
  manifest[heroImagePath] = asset._id;
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  return asset._id;
}

// ── Pre-flight validation ───────────────────────────────────────────────────
function validate() {
  const catKey = (type: string, slug: string) => `${type}::${slug}`;
  const catSet = new Set(categoryDefs.map((c) => catKey(c.type, c.slug)));
  const subKey = (type: string, category: string, slug: string) => `${type}::${category}::${slug}`;
  const subSet = new Set(subcategoryDefs.map((s) => subKey(s.type, s.category, s.slug)));
  const tagSet = new Set(tagDefs.map((t) => t.slug));

  const errors: string[] = [];
  for (const e of entries) {
    if (!catSet.has(catKey(e.type, e.category))) {
      errors.push(`${e.id}: unknown category "${e.category}" for type "${e.type}"`);
    }
    if (e.subcategory && !subSet.has(subKey(e.type, e.category, e.subcategory))) {
      errors.push(`${e.id}: unknown subcategory "${e.subcategory}" for ${e.type}/${e.category}`);
    }
    for (const t of e.tags ?? []) {
      if (!tagSet.has(t)) errors.push(`${e.id}: unknown tag "${t}"`);
    }
    if (e.heroImage && !(e.heroImage in altTexts)) {
      errors.push(`${e.id}: heroImage "${e.heroImage}" has no alt text in manifest`);
    }
  }
  if (errors.length) {
    console.error(`Pre-flight validation failed (${errors.length} issue(s)):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`Pre-flight validation OK: ${entries.length} entries, ${categoryDefs.length} categories, ${subcategoryDefs.length} subcategories, ${tagDefs.length} tags.`);
}

// ── Key helpers ──────────────────────────────────────────────────────────
let _k = 0;
const key = () => `k${_k++}`;

async function run() {
  validate();

  // 1. Tags
  {
    const t = client.transaction();
    for (const tag of tagDefs) {
      t.createOrReplace({
        _id: `catalogTag-${tag.slug}`,
        _type: "catalogTag",
        name: tag.label,
        slug: { _type: "slug", current: tag.slug },
        group: tag.group,
        applicableForms: tag.applicableForms,
      });
    }
    await t.commit();
    console.log(`OK: ${tagDefs.length} catalogTag published.`);
  }

  // 2. Categories (with inline subcategories)
  {
    const t = client.transaction();
    for (const cat of categoryDefs) {
      const subs = subcategoryDefs.filter((s) => s.type === cat.type && s.category === cat.slug);
      t.createOrReplace({
        _id: `catalogCategory-${cat.type}-${cat.slug}`,
        _type: "catalogCategory",
        name: cat.label,
        slug: { _type: "slug", current: cat.slug },
        type: cat.type,
        subcategories: subs.map((s) => ({
          _type: "object",
          _key: key(),
          title: s.label,
          slug: { _type: "slug", current: s.slug },
        })),
      });
    }
    await t.commit();
    console.log(`OK: ${categoryDefs.length} catalogCategory published.`);
  }

  // 3. Images (sequential -- asset upload isn't transactional, manifest guards reruns)
  const uniqueImages = [...new Set(entries.map((e) => e.heroImage).filter(Boolean))].filter(
    (img) => !EXCLUDED_IMAGES.has(img as string),
  ) as string[];
  for (const img of uniqueImages) {
    await uploadImage(img);
  }
  console.log(`OK: ${uniqueImages.length} images uploaded/cached (manifest: ${MANIFEST_PATH}).`);

  // 4. Entries
  {
    const t = client.transaction();
    for (const e of entries as Entry[]) {
      const doc: Record<string, unknown> = {
        _id: `catalogEntry-${e.id}`,
        _type: "catalogEntry",
        title: e.title,
        slug: { _type: "slug", current: e.slug },
        entryType: e.type,
        category: { _type: "reference", _ref: `catalogCategory-${e.type}-${e.category}` },
        subcategory: e.subcategory,
        tags: (e.tags ?? []).map((slug) => ({ _type: "reference", _key: key(), _ref: `catalogTag-${slug}` })),
        description: e.description,
        address: e.address,
        inVillage: e.inVillage ?? false,
        featured: e.featured ?? false,
        website: e.website,
        social: e.social,
        startedAt: e.startedAt,
        endedAt: e.endedAt,
        hours: e.hours,
        price: e.price,
        parking: e.parking,
        organizer: e.organizer,
        contactEmail: e.contactEmail,
        contactPhone: e.contactPhone,
        status: e.status,
        trustLevel: e.trustLevel,
      };
      if (e.lat != null && e.lng != null) {
        doc.location = { _type: "geopoint", lat: e.lat, lng: e.lng };
      }
      if (e.heroImage && !EXCLUDED_IMAGES.has(e.heroImage)) {
        doc.heroImage = {
          _type: "image",
          asset: { _type: "reference", _ref: manifest[e.heroImage] },
          alt: altTexts[e.heroImage],
        };
      }
      if (e.relatedEntries?.length) {
        doc.relatedEntries = e.relatedEntries.map((id) => ({
          _type: "reference",
          _key: key(),
          _ref: `catalogEntry-${id}`,
        }));
      }
      // Strip undefined so Sanity doesn't choke on explicit undefined values.
      for (const k of Object.keys(doc)) {
        if (doc[k] === undefined) delete doc[k];
      }
      t.createOrReplace(doc as never);
    }
    await t.commit();
    console.log(`OK: ${entries.length} catalogEntry published.`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
