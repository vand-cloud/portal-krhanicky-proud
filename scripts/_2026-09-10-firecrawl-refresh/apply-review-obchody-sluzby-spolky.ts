/* eslint-disable no-console */
// One-off write: applies the review verdicts for the 2026-09-10 Firecrawl batch of
// obchody / sluzby / spolky entries. "approved" and "archived" get their status set,
// "pending" is left untouched so Ivan can review it in Studio.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/apply-review-obchody-sluzby-spolky.ts
import { readFileSync } from "node:fs";
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

type Decision = {
  _id: string;
  title: string;
  decision: "approved" | "pending" | "archived";
  reason: string;
};

async function main() {
  const decisions: Decision[] = JSON.parse(
    readFileSync(resolve(SCRATCH, "decisions-obchody-sluzby-spolky.json"), "utf8"),
  );

  const toWrite = decisions.filter((d) => d.decision !== "pending");
  console.log(
    `decisions: ${decisions.length} (approved ${decisions.filter((d) => d.decision === "approved").length}, ` +
      `pending ${decisions.filter((d) => d.decision === "pending").length}, ` +
      `archived ${decisions.filter((d) => d.decision === "archived").length})`,
  );

  let ok = 0;
  for (const d of toWrite) {
    await client.patch(d._id).set({ status: d.decision }).commit();
    ok += 1;
    if (ok % 20 === 0) console.log(`  ...${ok}/${toWrite.length}`);
  }
  console.log(`patched: ${ok}`);

  // Verify the resulting state in the dataset.
  const ids = decisions.map((d) => d._id);
  const actual: { _id: string; status: string }[] = await client.fetch(
    `*[_type == "catalogEntry" && _id in $ids]{_id, status}`,
    { ids },
  );
  const byId = Object.fromEntries(actual.map((a) => [a._id, a.status]));
  const mismatches = decisions.filter((d) => byId[d._id] !== d.decision);
  console.log(`verified: ${actual.length}, mismatches: ${mismatches.length}`);
  mismatches.forEach((m) => console.log(`  MISMATCH ${m._id}: want ${m.decision}, got ${byId[m._id]}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
