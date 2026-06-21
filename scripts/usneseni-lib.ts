/* eslint-disable no-console */
// Toolkit for the resolutions (usnesení) bulk import. Same accuracy rules as
// the zápis import (visual transcription, verbatim text, en dash). Structure
// approved with Simon on Usnesení č. 2/2026:
//   PDF download bar + "Upozornění" note + (optional) GDPR note
//   then each action-verb section as H3 ("…schvaluje", "…bere na vědomí",
//   "…projednalo", "…pověřuje", "…ověřuje", "…ukládá" — whatever the document
//   uses) followed by a numbered list reproducing the document's own P.č.
//   numbering. Signatures / Vyvěšeno-Sejmuto omitted.
//
// SOFT LINE BREAKS: some resolutions in the source table span several rows /
// paragraphs inside a SINGLE numbered point. Keep them as one numbered item and
// separate the parts with "\n" inside the item string — the renderer prints
// them as soft line breaks (whitespace-pre-line) so the numbering stays intact.
import { readFileSync } from "node:fs";
import { client, h3, nl, warnNote, type Block } from "./zapis-lib";

let k = 0;
const key = () => `u${k++}`;

export type Section = { heading: string; items: string[] };

export type UsneseniOpts = {
  cislo: string;
  rok: string;
  isoDate: string;
  dateLabel: string;
  fullDateDot: string;
  pdfPath: string;
  /** The document's own privacy note, rendered in italics (omit if absent). */
  gdpr?: string;
  sections: Section[];
};

function italicNote(text: string): Block {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: ["em"] }],
  };
}

export async function publishUsneseni(o: UsneseniOpts): Promise<{ docId: string; blocks: number }> {
  const [y, m, d] = o.isoDate.split("-");
  const dmy = `${Number(d)}-${Number(m)}-${y}`;
  const slug = `usneseni-${o.rok}-${o.cislo}-zasedani-${dmy}`;
  const docId = `uradPost-${slug}`;
  const fullTitle = `Usnesení č. ${o.cislo}/${o.rok} Zastupitelstva obce Krhanice ze dne ${o.fullDateDot}`;
  const studioTitle = `Usnesení č. ${o.cislo}/${o.rok}, zasedání ${o.dateLabel}`;

  const buffer = readFileSync(o.pdfPath);
  const asset = await client.assets.upload("file", buffer, {
    filename: `usneseni-${o.cislo}-${o.rok}-krhanice.pdf`,
  });
  const fileBar: Block = {
    _type: "fileDownload",
    _key: key(),
    file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    name: fullTitle,
    fileType: "PDF",
  };

  const body: Block[] = [fileBar, warnNote()];
  if (o.gdpr) body.push(italicNote(o.gdpr));
  for (const s of o.sections) {
    body.push(h3(s.heading));
    body.push(...nl(s.items));
  }

  await client.createOrReplace({
    _id: docId,
    _type: "uradPost",
    title: studioTitle,
    slug: { _type: "slug", current: slug },
    date: o.isoDate,
    summary: `Usnesení ze zasedání zastupitelstva obce Krhanice dne ${o.dateLabel}. Plný přepis i originál ke stažení.`,
    category: { _type: "reference", _ref: "uradCategory-zastupitelstvo" },
    subcategory: "archiv-schuzi",
    body,
  });

  return { docId, blocks: body.length };
}
