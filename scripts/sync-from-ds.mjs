#!/usr/bin/env node
/**
 * Read `components.json`, ask the ds catalog about every entry, and
 * print a per-component status table. Read-only — does NOT modify
 * any tracked component file.
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
 *   node scripts/sync-from-ds.mjs
 *   DS_URL=http://localhost:3030 node scripts/sync-from-ds.mjs
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = join(__dirname, "..");
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

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
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
