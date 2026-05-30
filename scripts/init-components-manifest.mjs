#!/usr/bin/env node
/**
 * One-shot generator — scans installed UI primitives, matches them
 * against the ds catalog at https://ds.anfilov.cz, hashes the local
 * source, and writes `components.json`.
 *
 * Run from the client root:
 *   node scripts/init-components-manifest.mjs
 *
 * Idempotent — re-runs overwrite components.json with current state.
 * Safe to run before each release as a sanity check.
 *
 * Scope (today): primitives only (`components/ui/*.tsx`). Sections in
 * `components/sections/` are business-specific (Obec, Proud, etc.) —
 * they don't have ds-catalog equivalents and stay outside the manifest.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = join(__dirname, "..");
const UI_DIR = join(CLIENT_ROOT, "components", "ui");
const MANIFEST_PATH = join(CLIENT_ROOT, "components.json");
const DS_URL = process.env.DS_URL ?? "https://ds.anfilov.cz";

/** Mirror of apps/ds/lib/snapshot.ts `normalizeSource`. Keep in sync. */
function normalizeSource(source) {
  const lf = source.replace(/\r\n?/g, "\n");
  const trimmed = lf
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n");
  return trimmed.replace(/\n+$/, "\n");
}

function hashSource(source) {
  const digest = createHash("sha256").update(normalizeSource(source)).digest("hex");
  return `sha256-${digest}`;
}

/** PascalCase filename → kebab slug (Button.tsx → "button"). */
function slugFromFilename(filename) {
  const base = filename.replace(/\.tsx$/, "");
  return base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

async function fetchRegistryIndex() {
  const res = await fetch(`${DS_URL}/api/registry`);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry index from ${DS_URL}/api/registry — HTTP ${res.status}`);
  }
  const json = await res.json();
  // Returns { ..., items: [{ name, type, meta: { version, kind, ... }, ... }] }
  // `name` in the registry index is the slug.
  return json.items ?? [];
}

async function main() {
  console.log(`📋 Scanning ${UI_DIR}`);
  const files = (await readdir(UI_DIR))
    .filter((f) => f.endsWith(".tsx") && f !== "index.tsx");

  console.log(`   found ${files.length} .tsx files`);
  console.log(`🌐 Fetching ds registry index from ${DS_URL}/api/registry`);
  const dsIndex = await fetchRegistryIndex();
  const dsBySlug = new Map(dsIndex.map((item) => [item.name, item]));
  console.log(`   ${dsIndex.length} catalog entries available\n`);

  const matched = [];
  const unmatched = [];

  for (const file of files) {
    const slug = slugFromFilename(file);
    const dsEntry = dsBySlug.get(slug);
    if (!dsEntry) {
      unmatched.push({ file, slug });
      continue;
    }
    const sourcePath = join(UI_DIR, file);
    const source = await readFile(sourcePath, "utf8");
    const installedHash = hashSource(source);
    // Registry index puts `version` at the item top level; only the
    // per-item endpoint nests it under `meta`. Read both, prefer top
    // level since that's what the index returns.
    const version = dsEntry.version ?? dsEntry.meta?.version ?? "0.0.0";

    matched.push({
      name: slug,
      version,
      installedHash,
      installedAt: new Date().toISOString().slice(0, 10),
      source: `${DS_URL}/api/registry/${slug}`,
      path: `components/ui/${file}`,
    });
    console.log(`  ✓ ${file.padEnd(22)} → ${slug} @ ${version}  (${installedHash.slice(0, 19)}…)`);
  }

  if (unmatched.length > 0) {
    console.log("");
    console.log(`  · ${unmatched.length} file(s) without a ds-catalog match (kept local-only):`);
    for (const u of unmatched) {
      console.log(`      - ${u.file} (would be slug "${u.slug}")`);
    }
  }

  const manifest = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "krhanicky-proud",
    registries: { "@anfilov": `${DS_URL}/api/registry` },
    items: matched.sort((a, b) => a.name.localeCompare(b.name)),
  };

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("");
  console.log(`📝 Wrote ${MANIFEST_PATH}`);
  console.log(`   ${matched.length} entries tracked, ${unmatched.length} unmatched skipped.`);
}

main().catch((err) => {
  console.error("init-components-manifest failed:", err.message);
  process.exit(1);
});
