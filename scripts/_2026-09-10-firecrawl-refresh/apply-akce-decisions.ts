/* eslint-disable no-console */
// One-off write: flips the reviewed `akce` catalogEntry documents that passed
// the approval gate to status "approved". Entries decided as "pending" are left
// untouched so Ivan can review them in Studio.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/apply-akce-decisions.ts
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
  decision: "approved" | "pending";
  reason: string;
};

async function main() {
  const decisions = JSON.parse(
    readFileSync(resolve(SCRATCH, "decisions-akce.json"), "utf8"),
  ) as Decision[];

  const approved = decisions.filter((d) => d.decision === "approved");
  const held = decisions.filter((d) => d.decision === "pending");

  console.log(`decisions: ${decisions.length} (approve ${approved.length}, hold ${held.length})`);

  for (const d of approved) {
    await client.patch(d._id).set({ status: "approved" }).commit();
    console.log(`  approved: ${d.title}`);
  }

  // Verify the dataset now matches the decisions exactly.
  const check = await client.fetch(
    `*[_type == "catalogEntry" && _id in $ids]{_id, title, status}`,
    { ids: decisions.map((d) => d._id) },
  );
  const byId = new Map(check.map((c: { _id: string; status: string }) => [c._id, c.status]));
  const mismatched = decisions.filter((d) => byId.get(d._id) !== d.decision);

  console.log(`\nverification: ${check.length} docs read back`);
  if (mismatched.length) {
    console.log("MISMATCH:");
    for (const m of mismatched) {
      console.log(`  ${m.title}: want ${m.decision}, got ${byId.get(m._id)}`);
    }
    process.exit(1);
  }
  console.log("all statuses match the decisions");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
