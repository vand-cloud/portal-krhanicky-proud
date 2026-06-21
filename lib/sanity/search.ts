import "server-only";
import { groq } from "next-sanity";
import { client } from "./client";
import { unaccent } from "@/content/entries";
import type { SearchHit } from "./content-types";

// Scoped server-side fulltext search. Each scope searches ONLY its own
// document type — úřad never leaks into blog and vice versa. The body is
// flattened to plain text with GROQ pt::text(body) so names, parcel numbers
// and topics buried inside transcripts (zápisy, usnesení) become findable.
// Matching is diacritics-insensitive (unaccent) and substring-based (so
// "403/8" or "Dvorak" both hit), and each result carries a snippet of the
// ORIGINAL text around the match.

export type SearchScope = "urad" | "program" | "blog";

type Doc = {
  id: string;
  title: string;
  slug: string;
  lead?: string; // summary / description / excerpt — fallback snippet
  meta?: string; // category label
  date?: string;
  text?: string; // pt::text(body)
};

const QUERIES: Record<SearchScope, string> = {
  urad: groq`*[_type == "uradPost"] | order(date desc){
    "id": _id, title, "slug": slug.current, "lead": summary, date,
    "meta": category->title, "text": pt::text(body)
  }`,
  program: groq`*[_type == "proudPost"] | order(orderRank){
    "id": _id, title, "slug": slug.current, "lead": description,
    "meta": category->name, "text": pt::text(body)
  }`,
  blog: groq`*[_type == "blogPost"] | order(publishedAt desc){
    "id": _id, title, "slug": slug.current, "lead": excerpt, "date": publishedAt,
    "meta": categories[0]->title, "text": pt::text(body)
  }`,
};

const META_FALLBACK: Record<SearchScope, string> = {
  urad: "Úřad",
  program: "Program",
  blog: "Blog",
};

function hrefFor(scope: SearchScope, slug: string): string {
  if (scope === "urad") return `/urad/${slug}`;
  if (scope === "program") return `/proud/nas-program/${slug}`;
  return `/blog/${slug}`;
}

// Fold a string to its accent-stripped, lowercased form WHILE keeping a map
// from each folded-character index back to the index in the original string.
// unaccent() decomposes (NFD) and drops combining marks, which can change the
// length, so this mapping is what lets us cut a clean snippet from the
// untouched original around a match found in the folded text.
function fold(s: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const f = unaccent(s[i]);
    for (let j = 0; j < f.length; j++) {
      folded += f[j];
      map.push(i);
    }
  }
  return { folded, map };
}

const SNIPPET_RADIUS = 90;
const MAX_RESULTS = 40;

function makeSnippet(original: string, map: number[], foldedIdx: number, qLen: number): string {
  const start = map[foldedIdx] ?? 0;
  const endIdx = Math.min(foldedIdx + qLen - 1, map.length - 1);
  const end = (map[endIdx] ?? start) + 1;
  const from = Math.max(0, start - SNIPPET_RADIUS);
  const to = Math.min(original.length, end + SNIPPET_RADIUS);
  let snippet = original.slice(from, to).replace(/\s+/g, " ").trim();
  if (from > 0) snippet = `… ${snippet}`;
  if (to < original.length) snippet = `${snippet} …`;
  return snippet;
}

export async function searchScope(scope: SearchScope, rawQuery: string): Promise<SearchHit[]> {
  const q = unaccent(rawQuery.trim());
  if (q.length < 2) return [];

  // Cached per scope (Next data cache, 60s) so search-as-you-type reuses the
  // corpus across keystrokes and users instead of re-querying Sanity.
  const docs = await client.fetch<Doc[]>(QUERIES[scope], {}, {
    next: { revalidate: 60, tags: [`search-${scope}`] },
  });

  const ranked: { hit: SearchHit; rank: number }[] = [];

  for (const d of docs) {
    const titleHit = unaccent(d.title ?? "").includes(q);
    const leadHit = unaccent(d.lead ?? "").includes(q);

    let snippet: string | undefined;
    let bodyHit = false;
    if (d.text) {
      const { folded, map } = fold(d.text);
      const idx = folded.indexOf(q);
      if (idx >= 0) {
        bodyHit = true;
        snippet = makeSnippet(d.text, map, idx, q.length);
      }
    }

    if (!titleHit && !leadHit && !bodyHit) continue;

    if (!snippet) snippet = d.lead || undefined;
    // rank: title match first, then lead, then body-only.
    const rank = titleHit ? 0 : leadHit ? 1 : 2;
    ranked.push({
      hit: {
        id: d.id,
        title: d.title,
        href: hrefFor(scope, d.slug),
        meta: d.meta || META_FALLBACK[scope],
        snippet,
      },
      rank,
    });
  }

  ranked.sort((a, b) => a.rank - b.rank); // stable: preserves date/orderRank within a rank
  return ranked.slice(0, MAX_RESULTS).map((r) => r.hit);
}
