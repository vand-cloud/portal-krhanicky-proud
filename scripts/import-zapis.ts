/* eslint-disable no-console */
// Importer: turns an official council-minutes PDF from the Krhanice
// municipality into a Sanity `uradPost` that holds BOTH the original PDF
// (download bar) AND a faithful, searchable text transcript.
//
// ACCURACY IS THE #1 REQUIREMENT. These are official documents (úřední dílo,
// public + free to reproduce verbatim). The transcript is the EXACT text from
// the PDF text layer. This script ONLY segments that text into Portable Text
// blocks (headings / paragraphs / numbered + bulleted lists). It NEVER
// paraphrases, summarizes, reorders, "fixes", or rewords. Any artifacts in the
// source text layer (e.g. OCR-style glyph errors) are preserved verbatim and
// flagged for human review.
//
// The result is created as a Sanity DRAFT (drafts.*), so it does NOT appear on
// the live site and can be reviewed in Studio (Úřad → Příspěvky).
//
// Run the demo (latest zápis only):
//   node_modules/.bin/tsx scripts/import-zapis.ts
//
// Reuse over many PDFs: call importZapis({ pdfUrl, title, isoDate, meetingDate,
// summary, subcategory }) from another script / loop. It is idempotent on the
// draft _id (createOrReplace), so re-running re-imports cleanly without ever
// touching published documents.

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── env ────────────────────────────────────────────────────────────────────
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

// ── portable text helpers (mirrors scripts/seed-sanity.ts) ───────────────────
let _k = 0;
const key = () => `k${_k++}`;
type Block = Record<string, unknown>;

function span(text: string, marks: string[] = []) {
  return { _type: "span", _key: key(), text, marks };
}
function para(text: string): Block {
  return { _type: "block", _key: key(), style: "normal", markDefs: [], children: [span(text)] };
}
function heading(style: "h2" | "h3", text: string): Block {
  return { _type: "block", _key: key(), style, markDefs: [], children: [span(text)] };
}
function listItem(text: string, listType: "bullet" | "number"): Block {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: listType,
    level: 1,
    markDefs: [],
    children: [span(text)],
  };
}
function fileDownloadBlock(assetId: string, name: string, fileType = "PDF"): Block {
  return {
    _type: "fileDownload",
    _key: key(),
    file: { _type: "file", asset: { _type: "reference", _ref: assetId } },
    name,
    fileType,
  };
}

// ── PDF text extraction ──────────────────────────────────────────────────────
// Prefers the PDF text layer via poppler `pdftotext -layout` (exactness).
// Returns the raw text plus whether the PDF appears to carry a real text layer
// (vs. being a scanned image that would require OCR).
type Extraction = { text: string; hasTextLayer: boolean; method: string };

function extractText(pdfPath: string): Extraction {
  let pdftotext = "";
  try {
    pdftotext = execFileSync("which", ["pdftotext"]).toString().trim();
  } catch {
    pdftotext = "";
  }
  if (!pdftotext) {
    throw new Error(
      "pdftotext (poppler) not found. Install poppler, or add a pdfjs-dist / pdf-parse fallback before running.",
    );
  }
  const text = execFileSync(pdftotext, ["-layout", pdfPath, "-"]).toString();
  // Heuristic: a genuine text layer yields a meaningful amount of word
  // characters. A scanned image PDF yields little or nothing.
  const wordChars = (text.match(/[\p{L}\p{N}]/gu) ?? []).length;
  const hasTextLayer = wordChars > 200;
  return { text, hasTextLayer, method: "pdftotext -layout (poppler)" };
}

// ── faithful segmentation ────────────────────────────────────────────────────
// Turns the EXACT extracted text into Portable Text blocks. The only decisions
// made here are STRUCTURAL (is this line a heading / a numbered agenda point /
// a bullet / a paragraph). Words, numbers, dates and names are passed through
// untouched. Whitespace inside a paragraph is normalized to single spaces and
// soft-wrapped lines are rejoined, because PDF line breaks are layout artifacts,
// not content. Page-number-only lines (poppler emits the running footer) are
// dropped as they are not part of the minutes' text.

function isPageNumberLine(line: string): boolean {
  return /^\s*\d{1,3}\s*$/.test(line);
}

// Top-level agenda points: "1) ...", "10)..." (also tolerates the source's
// OCR-style "I)" / "S)" / "lO)" first-glyph artifacts so they still segment as
// headings; the original text is preserved verbatim inside the heading).
function isTopLevelSection(line: string): boolean {
  return /^\s*(?:\d{1,2}|[ISl]{1,2}|lO|lO\))\s*\)/.test(line) && line.length < 90;
}

// "Různé" sub-items rendered as bullets: "•   TITLE", "❖ ...".
function isBulletMarker(line: string): boolean {
  return /^\s*[•►▪◦▶❖,]\s+/.test(line);
}

function segmentToPortableText(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  // First line of the document is the title heading.
  const blocks: Block[] = [];

  // Group lines into logical paragraphs separated by blank lines, while
  // recognizing structural markers.
  let buffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length === 0) return;
    const joined = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (joined) blocks.push(para(joined));
    buffer = [];
  };

  let isFirstContentLine = true;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, "");
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      continue;
    }
    if (isPageNumberLine(trimmed)) {
      // running footer page number — not content
      continue;
    }

    if (isFirstContentLine) {
      // Document title → h2.
      flushParagraph();
      blocks.push(heading("h2", trimmed.replace(/\s+/g, " ")));
      isFirstContentLine = false;
      continue;
    }

    if (isTopLevelSection(trimmed)) {
      flushParagraph();
      blocks.push(heading("h3", trimmed.replace(/\s+/g, " ")));
      continue;
    }

    if (isBulletMarker(trimmed)) {
      flushParagraph();
      const text = trimmed.replace(/^[•►▪◦▶❖,]\s+/, "").replace(/\s+/g, " ").trim();
      blocks.push(listItem(text, "bullet"));
      continue;
    }

    buffer.push(trimmed);
  }
  flushParagraph();

  return blocks;
}

// ── importer (reusable) ──────────────────────────────────────────────────────
export type ImportInput = {
  pdfUrl: string;
  /** Exact document title as labelled in the source (e.g. "Zápis č. 1/2026 …"). */
  title: string;
  /** ISO date used in the draft _id + slug (the meeting date, YYYY-MM-DD). */
  isoDate: string;
  /** Meeting date for the `date` field (YYYY-MM-DD). */
  meetingDate: string;
  /** One-line factual descriptor for `summary`. */
  summary: string;
  /** uradCategory subcategory slug. */
  subcategory: string;
  /** PDF filename for the uploaded asset. */
  filename: string;
};

export type ImportResult = {
  draftId: string;
  hasTextLayer: boolean;
  method: string;
  transcriptChars: number;
  blockCount: number;
};

export async function importZapis(input: ImportInput): Promise<ImportResult> {
  const tmpPdf = resolve(__dirname, `.zapis-import-${input.isoDate}.pdf`);

  // 1) download
  const res = await fetch(input.pdfUrl);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${input.pdfUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(tmpPdf, buffer);

  try {
    // 2) extract
    const extraction = extractText(tmpPdf);
    if (!extraction.hasTextLayer) {
      throw new Error(
        "PDF has no usable text layer (likely a scanned image). OCR with tesseract (ces) is " +
          "required, and OCR output MUST be flagged for careful human review. Aborting to avoid " +
          "fabricating text.",
      );
    }

    // 3) upload PDF as a Sanity file asset
    const asset = await client.assets.upload("file", buffer, { filename: input.filename });

    // 4) build the faithful body
    const lead = para(
      "Níže najdete přepis úředního zápisu. Originál si můžete stáhnout jako PDF.",
    );
    const transcriptBlocks = segmentToPortableText(extraction.text);
    const body: Block[] = [
      lead,
      fileDownloadBlock(asset._id, input.title, "PDF"),
      ...transcriptBlocks,
    ];

    // 5) create DRAFT (never overwrites published docs; drafts.* id)
    const draftId = `drafts.zapis-import-${input.isoDate}`;
    await client.createOrReplace({
      _id: draftId,
      _type: "uradPost",
      title: input.title,
      slug: { _type: "slug", current: `zapis-import-${input.isoDate}` },
      date: input.meetingDate,
      summary: input.summary,
      category: { _type: "reference", _ref: "uradCategory-zastupitelstvo" },
      subcategory: input.subcategory,
      body,
    });

    return {
      draftId,
      hasTextLayer: extraction.hasTextLayer,
      method: extraction.method,
      transcriptChars: extraction.text.length,
      blockCount: body.length,
    };
  } finally {
    // cleanup temp file
    if (existsSync(tmpPdf)) unlinkSync(tmpPdf);
  }
}

// ── demo: import the single most recent zápis ze zastupitelstva ──────────────
async function main() {
  // Most recent zápis ze zastupitelstva on
  // https://www.obeckrhanice.cz/zapisy-a-usneseni-zastupitelstva-obce
  // = Zápis č. 1/2026, meeting 9.3.2026 (newer than č.6/2025 of 12.12.2025;
  // the 8.6.2026 entry is only a Usnesení, not a full zápis).
  const result = await importZapis({
    pdfUrl: "https://www.obeckrhanice.cz/file.php?nid=714&oid=13395111",
    title: "Zápis č. 1/2026 ze zasedání zastupitelstva obce Krhanice konaného dne 9.3.2026",
    isoDate: "2026-03-09",
    meetingDate: "2026-03-09",
    summary: "Přepis úředního zápisu ze zasedání zastupitelstva obce Krhanice ze dne 9. 3. 2026.",
    subcategory: "archiv-schuzi",
    filename: "zapis-1-2026-krhanice.pdf",
  });

  console.log("Imported draft:");
  console.log("  _id:", result.draftId);
  console.log("  extraction:", result.method, "| text layer:", result.hasTextLayer);
  console.log("  transcript chars:", result.transcriptChars, "| body blocks:", result.blockCount);
  console.log("Review in Studio: Úřad → Příspěvky (shows as a draft).");
}

// Only run the demo when invoked directly (allows reuse as a module).
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
