/* eslint-disable no-console */
// One-off write: flips catalogEntry documents marked decision:"approved" in
// decisions-mista-gastro.json from status "pending" to "approved".
// Entries marked "pending" are left untouched for Ivan's manual review.
//
// Run: node_modules/.bin/tsx scripts/_2026-09-10-firecrawl-refresh/approve-mista-gastro.ts
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

type Decision = { _id: string; title: string; decision: "approved" | "pending"; reason: string };

async function main() {
  const decisions: Decision[] = JSON.parse(
    readFileSync(resolve(SCRATCH, "decisions-mista-gastro.json"), "utf8"),
  );
  const toApprove = decisions.filter((d) => d.decision === "approved");
  console.log(`approving ${toApprove.length}, leaving ${decisions.length - toApprove.length} pending`);

  let ok = 0;
  for (const d of toApprove) {
    await client.patch(d._id).set({ status: "approved" }).commit();
    ok += 1;
    console.log(`  [${ok}/${toApprove.length}] ${d.title}`);
  }

  // Verify final state across the whole batch.
  const ids = decisions.map((d) => d._id);
  const after = await client.fetch<{ _id: string; status: string }[]>(
    `*[_type == "catalogEntry" && _id in $ids]{_id, status}`,
    { ids },
  );
  const want = new Map(decisions.map((d) => [d._id, d.decision]));
  const wrong = after.filter((a) => a.status !== want.get(a._id));
  console.log(`verified ${after.length} docs, mismatches: ${wrong.length}`);
  if (wrong.length) console.log(wrong);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
