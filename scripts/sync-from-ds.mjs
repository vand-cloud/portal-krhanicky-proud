#!/usr/bin/env node
/**
 * Read `components.json`, ask the ds catalog about every entry, and
 * print a per-component status table. Default behaviour is read-only.
 *
 * Output columns:
 *   name        installed version
 *   ds          current registry version
 *   drift       same / patch / minor / major / older / unknown
 *   local       "clean" if local file hash matches the installedHash
 *               recorded in components.json, "modified" otherwise
 *               (someone hand-edited the component since install)
 *
 * Exit code is always 0 — this is an information tool, not a gate.
 *
 * Usage:
 *   node scripts/sync-from-ds.mjs                     # read-only report
 *   node scripts/sync-from-ds.mjs --apply <slug>      # update one slug
 *   node scripts/sync-from-ds.mjs --apply all         # update all drift!=same
 *   DS_URL=http://localhost:3030 node scripts/sync-from-ds.mjs
 *
 * Apply semantics:
 *   - SKIPS entries with `local == "modified"` (would clobber edits)
 *   - SKIPS entries with `drift == "same"` (no work)
 *   - SKIPS entries with `drift == "older"` (client AHEAD of ds —
 *     suggests intentional fork or a registry rollback; needs manual
 *     resolution)
 *   - WRITES the new source to disk, then updates components.json
 *     with the new version + new installedHash + today's installedAt
 */

import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = join(__dirname, "..");
const MANIFEST_PATH = join(CLIENT_ROOT, "components.json");
const DS_URL = process.env.DS_URL ?? "https://ds.anfilov.cz";

/**
 * Parse CLI args. Supports:
 *   (no args)               → mode=report
 *   --apply <slug>          → mode=apply, target=slug
 *   --apply all             → mode=apply, target=all
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  let mode = "report";
  let target = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--apply") {
      mode = "apply";
      target = args[i + 1];
      if (!target) {
        console.error("--apply requires a slug or 'all'");
        process.exit(2);
      }
      i++;
    }
  }
  return { mode, target };
}

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

// ANSI colors for the terminal — keep it minimal, no chalk dep.
const COL = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorForDrift(drift) {
  switch (drift) {
    case "same":
      return COL.green;
    case "patch":
      return COL.cyan;
    case "minor":
      return COL.yellow;
    case "major":
      return COL.red;
    case "older":
      return COL.magenta;
    default:
      return COL.dim;
  }
}

async function fetchDiff(slug, fromVersion) {
  const url = `${DS_URL}/api/registry/${slug}/diff?from=${encodeURIComponent(fromVersion)}`;
  const res = await fetch(url);
  if (!res.ok) {
    return {
      error: `HTTP ${res.status}`,
      slug,
      currentVersion: "?",
      drift: "unknown",
    };
  }
  return res.json();
}

async function checkLocal(item) {
  try {
    const sourcePath = join(CLIENT_ROOT, item.path);
    const source = await readFile(sourcePath, "utf8");
    const localHash = hashSource(source);
    if (item.installedHash && localHash !== item.installedHash) {
      return { status: "modified", localHash };
    }
    return { status: "clean", localHash };
  } catch {
    return { status: "missing", localHash: null };
  }
}

function pad(s, n) {
  const str = String(s);
  if (str.length >= n) return str;
  return str + " ".repeat(n - str.length);
}

/**
 * Apply a single update for one manifest item:
 *   1. Re-fetch /diff to get the current source + hash
 *   2. Refuse if drift == same / older / unknown, or local == modified
 *   3. Write file(s) to disk, update manifest entry in-place
 * Returns the mutated item (caller writes the manifest atomically at end).
 */
async function applyOne(item, manifest) {
  const diff = await fetchDiff(item.name, item.version);
  if (diff.error) {
    console.log(`  ${COL.red}✗ ${item.name}${COL.reset}  ${diff.error}`);
    return false;
  }
  if (diff.drift === "same") {
    console.log(`  ${COL.dim}· ${item.name}${COL.reset}  already current`);
    return false;
  }
  if (diff.drift === "older" || diff.drift === "unknown") {
    console.log(
      `  ${COL.yellow}! ${item.name}${COL.reset}  drift=${diff.drift} — needs manual review`,
    );
    return false;
  }

  const local = await checkLocal(item);
  if (local.status === "modified") {
    console.log(
      `  ${COL.yellow}! ${item.name}${COL.reset}  local-modified — refusing to overwrite`,
    );
    return false;
  }

  // Write the new source to the client-side path recorded in the
  // manifest, NOT the ds-side path returned by /diff. The catalog
  // stores primitives under `components/primitives/`, but this
  // client checks them out at `components/ui/` — using the diff
  // path would create a parallel tree and orphan the working copy.
  //
  // /diff today returns a single file per entry; if a future template
  // returns multiple, we'd need a manifest-side mapping. For now,
  // single-file primitives + sections only, single-file write.
  const file = (diff.files ?? [])[0];
  if (!file) {
    console.log(`  ${COL.red}✗ ${item.name}${COL.reset}  /diff returned no files`);
    return false;
  }
  const absPath = join(CLIENT_ROOT, item.path);
  await mkdir(dirname(absPath), { recursive: true });
  await writeFile(absPath, file.content, "utf8");

  // Mutate manifest entry in place. installedHash comes straight from
  // /diff (already computed with the same normalisation), so we don't
  // have to re-hash locally.
  item.version = diff.currentVersion;
  item.installedHash = diff.currentHash;
  item.installedAt = new Date().toISOString().slice(0, 10);
  console.log(
    `  ${COL.green}✓ ${item.name}${COL.reset}  → ${diff.currentVersion} (${diff.drift})`,
  );
  return true;
}

async function runApply(manifest, target) {
  const items = manifest.items ?? [];
  const candidates =
    target === "all"
      ? items
      : items.filter((i) => i.name === target);

  if (candidates.length === 0) {
    console.error(`No manifest entry matches "${target}"`);
    process.exit(2);
  }

  console.log(
    `${COL.bold}apply${COL.reset}  ·  ${candidates.length} candidate(s)  ·  ds = ${DS_URL}\n`,
  );

  let writes = 0;
  for (const item of candidates) {
    const wrote = await applyOne(item, manifest);
    if (wrote) writes++;
  }

  if (writes > 0) {
    await writeFile(
      MANIFEST_PATH,
      JSON.stringify(manifest, null, 2) + "\n",
      "utf8",
    );
    console.log(`\n${COL.bold}${writes} file(s) updated${COL.reset}, manifest re-written.`);
    console.log(`${COL.dim}Review the diff: git diff${COL.reset}`);
  } else {
    console.log(`\n${COL.dim}No updates applied.${COL.reset}`);
  }
}

async function main() {
  const { mode, target } = parseArgs(process.argv);
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));

  if (mode === "apply") {
    return runApply(manifest, target);
  }

  const items = manifest.items ?? [];
  console.log(`${COL.bold}sync-from-ds${COL.reset}  ·  ${items.length} components  ·  ds = ${DS_URL}\n`);

  const rows = await Promise.all(
    items.map(async (item) => {
      const [diff, local] = await Promise.all([
        fetchDiff(item.name, item.version),
        checkLocal(item),
      ]);
      return { item, diff, local };
    }),
  );

  // Column header
  console.log(
    COL.dim +
      pad("name", 18) +
      pad("installed", 12) +
      pad("ds", 12) +
      pad("drift", 12) +
      "local" +
      COL.reset,
  );
  console.log(
    COL.dim + "─".repeat(18) + " " + "─".repeat(10) + " " + "─".repeat(10) + " " + "─".repeat(10) + " " + "─".repeat(10) + COL.reset,
  );

  let updates = 0;
  let modified = 0;
  for (const { item, diff, local } of rows) {
    const dColor = colorForDrift(diff.drift);
    const localColor =
      local.status === "modified"
        ? COL.yellow
        : local.status === "missing"
        ? COL.red
        : COL.dim;
    if (diff.drift && diff.drift !== "same" && diff.drift !== "unknown") updates++;
    if (local.status === "modified") modified++;

    console.log(
      pad(item.name, 18) +
        pad(item.version, 12) +
        pad(diff.currentVersion ?? "?", 12) +
        dColor +
        pad(diff.drift ?? "?", 12) +
        COL.reset +
        localColor +
        local.status +
        COL.reset,
    );
  }

  console.log("");
  console.log(
    `${COL.bold}Summary${COL.reset}  ·  ${updates} update(s) available  ·  ${modified} locally modified`,
  );
  if (updates > 0) {
    console.log(`${COL.dim}        Review changes at: ${DS_URL}${COL.reset}`);
  }
  if (modified > 0) {
    console.log(`${COL.yellow}        Locally-modified files won't be touched by future --apply runs.${COL.reset}`);
  }
}

main().catch((err) => {
  console.error("sync-from-ds failed:", err.message);
  process.exit(1);
});
