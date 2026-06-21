/* eslint-disable no-console */
// Lists every uradPost in the "zastupitelstvo" category so we can tell the
// real transcript (has a fileDownload + many blocks) from the old demo stubs
// (no PDF, little/no body) that need deleting.
import { client } from "./zapis-lib";

async function run() {
  const docs: Array<{
    _id: string;
    title?: string;
    subcategory?: string;
    slug?: string;
    blocks?: number;
    hasFile?: boolean;
    date?: string;
  }> = await client.fetch(
    `*[_type == "uradPost" && category._ref == "uradCategory-zastupitelstvo"]{
      _id, title, subcategory, "slug": slug.current, date,
      "blocks": count(body),
      "hasFile": count(body[_type == "fileDownload"]) > 0
    } | order(date desc)`,
  );
  for (const d of docs) {
    console.log(
      `${d.hasFile ? "PDF " : "----"} blk=${String(d.blocks ?? 0).padStart(3)}  ${d.date ?? "????"}  ${d._id}  | ${d.title ?? ""}`,
    );
  }
  console.log(`\nTotal: ${docs.length}`);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
