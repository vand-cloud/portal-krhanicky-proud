/* eslint-disable no-console */
// Shared toolkit for the council-minutes (zápis) bulk import.
//
// ACCURACY IS THE #1 REQUIREMENT. These are official documents transcribed
// VISUALLY from the source PDF (the PDF text layer is corrupt — it turns
// "1)" into "I)", "5)" into "S)", "vyvěšeno" into "vyveseno", etc., so we do
// NOT use pdftotext). Each caller reads the PDF pages as images and produces a
// faithful `transcript` of Portable Text blocks using the helpers below.
//
// Structure (approved with Simon on Zápis č. 1/2026):
//   fileBar(TITLE)              ← original PDF download, added automatically
//   warnNote()                  ← "Upozornění: ..." note, added automatically
//   h4("Přítomni") + p(names)
//   h4("Omluveni") + p(names)   ← only if anyone is excused
//   h3("N) Agenda point")       ← the numbered agenda sections
//     h4("Named sub-item")      ← named items inside "Různé" etc.
//     h5("Návrh" | "Rozprava" | "Určení zapisovatele" | ...)
//     p(...)                    ← body paragraphs
//     vote("PRO ( x ) – PROTI ( y ) – ZDRŽEL SE ( z )")   ← bold, en dash –
//     nl([...]) / ul([...])     ← the read-aloud program = numbered list,
//                                  sub-points = bullets
//
// The transcript MUST be verbatim. Preserve Czech diacritics, names, dates,
// parcel numbers, amounts and IČO exactly. Never paraphrase, summarize or
// reorder. Use the en dash "–" (never em dash "—").

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

export const client = createClient({
  projectId: "4nb8kl4e",
  dataset: "production",
  apiVersion: "2026-04-27",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// ── Portable Text helpers ────────────────────────────────────────────────────
export type Block = Record<string, unknown>;

let k = 0;
const key = () => `b${k++}`;
const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: key(), text, marks });
const blk = (style: string, text: string, marks: string[] = []): Block => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [span(text, marks)],
});

export const h2 = (t: string) => blk("h2", t);
export const h3 = (t: string) => blk("h3", t);
export const h4 = (t: string) => blk("h4", t);
export const h5 = (t: string) => blk("h5", t);
export const p = (t: string) => blk("normal", t);
/** Bold vote tally line, e.g. vote("PRO ( 8 ) – PROTI ( 0 ) – ZDRŽEL SE ( 0 )"). */
export const vote = (t: string) => blk("normal", t, ["strong"]);

const li = (style: "bullet" | "number", t: string): Block => ({
  _type: "block",
  _key: key(),
  style: "normal",
  listItem: style,
  level: 1,
  markDefs: [],
  children: [span(t)],
});
export const nl = (items: string[]) => items.map((t) => li("number", t));
export const ul = (items: string[]) => items.map((t) => li("bullet", t));

export function warnNote(): Block {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [
      span("Upozornění: ", ["strong"]),
      span("Následující přepis dokumentu může obsahovat stylistické nebo strukturální chyby."),
    ],
  };
}

function fileBar(assetId: string, name: string): Block {
  return {
    _type: "fileDownload",
    _key: key(),
    file: { _type: "file", asset: { _type: "reference", _ref: assetId } },
    name,
    fileType: "PDF",
  };
}

// ── publish ──────────────────────────────────────────────────────────────────
export type PublishOpts = {
  /** Meeting number, e.g. "1". */
  cislo: string;
  /** Year, e.g. "2025". */
  rok: string;
  /** ISO meeting date, "YYYY-MM-DD". */
  isoDate: string;
  /** Human date label for the Studio title, e.g. "11. 3. 2025". */
  dateLabel: string;
  /** Dotted date used inside the official document title, e.g. "11.3.2025". */
  fullDateDot: string;
  /** Local path to the original PDF on disk. */
  pdfPath: string;
  /** The faithful transcript blocks (everything AFTER the PDF bar + warning). */
  transcript: Block[];
};

export async function publishZapis(opts: PublishOpts): Promise<{ docId: string; blocks: number }> {
  const [y, m, d] = opts.isoDate.split("-");
  const dayMonthYear = `${Number(d)}-${Number(m)}-${y}`; // 9-3-2026
  const slug = `zapis-${opts.rok}-${opts.cislo}-zasedani-${dayMonthYear}`;
  const docId = `uradPost-${slug}`;
  const fullTitle = `Zápis č. ${opts.cislo}/${opts.rok} ze zasedání zastupitelstva obce Krhanice konaného dne ${opts.fullDateDot}`;
  const studioTitle = `Zápis č. ${opts.cislo}/${opts.rok}, zasedání ${opts.dateLabel}`;

  const buffer = readFileSync(opts.pdfPath);
  const asset = await client.assets.upload("file", buffer, {
    filename: `zapis-${opts.cislo}-${opts.rok}-krhanice.pdf`,
  });

  const body: Block[] = [fileBar(asset._id, fullTitle), warnNote(), ...opts.transcript];

  await client.createOrReplace({
    _id: docId,
    _type: "uradPost",
    title: studioTitle,
    slug: { _type: "slug", current: slug },
    date: opts.isoDate,
    summary: `Řádné zasedání zastupitelstva obce Krhanice dne ${opts.dateLabel}. Plný přepis i originál ke stažení.`,
    category: { _type: "reference", _ref: "uradCategory-zastupitelstvo" },
    subcategory: "archiv-schuzi",
    body,
  });

  return { docId, blocks: body.length };
}
