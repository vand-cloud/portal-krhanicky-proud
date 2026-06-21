/* eslint-disable no-console */
// Deletes the old demo zápis stubs (no PDF, no transcript — blk=1). Keeps the
// real č.1/2026 transcript and the non-zápis úřad posts (kontakt, úřední
// hodiny, termín zasedání). Safe: the bulk import recreates 2025 with content.
import { client } from "./zapis-lib";

const STUBS = [
  "uradPost-zapis-2025-6-zasedani-12-12-2025",
  "uradPost-zapis-2025-5-zasedani-19-11-2025",
  "uradPost-zapis-2025-4-zasedani-26-8-2025",
  "uradPost-zapis-2025-3-zasedani-25-6-2025",
  "uradPost-zapis-2025-2-zasedani-16-4-2025",
  "uradPost-zapis-2025-1-zasedani-11-3-2025",
];

async function run() {
  for (const id of STUBS) {
    await client.delete(id).catch((e) => console.error("skip", id, e.message));
    console.log("deleted", id);
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
