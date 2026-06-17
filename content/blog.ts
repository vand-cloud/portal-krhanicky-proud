// Blog posts content (Phase 2 wireframe -- hardcoded sample data).
// Phase 4 migration to Sanity will use the same shape: a category enum
// curated by the operator, free-form tags chosen ad-hoc per post, and
// the editor reorders + creates entries directly in Studio.

export type BlogCategory =
  | "z-radnice"
  | "zivot-v-obci"
  | "tipy-na-vylet"
  | "komentare"
  | "rozhovory";

export const blogCategoryLabels: Record<BlogCategory, string> = {
  "z-radnice": "Z radnice",
  "zivot-v-obci": "Život v obci",
  "tipy-na-vylet": "Tipy na výlet",
  komentare: "Komentáře",
  rozhovory: "Rozhovory",
};

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  // Body is a placeholder paragraph for Phase 2; in Sanity this becomes
  // a portable text block.
  body?: string;
  publishedAt: string;
  author: string;
  readingTime: string;
  categories: BlogCategory[];
  // Free-form labels. Operator creates new tags ad-hoc in Sanity.
  tags: string[];
  href: string;
  // Cover image URL. Phase 2 wireframe leaves this empty -- the card
  // shows a typed placeholder. Sanity migration fills it with an asset
  // reference rendered via next/image.
  heroImage?: string;
  // Manually curated related posts (by id). Phase 4 in Sanity becomes a
  // reference array with a 3-item soft cap on the schema. Order is
  // editorial -- we render exactly what the editor picks, in their
  // order, no auto-suggestions on top.
  relatedPosts?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-proc-stavime-portal",
    slug: "proc-stavime-tento-portal",
    title: "Proč stavíme tento portál",
    excerpt:
      "Krhanice mají obecní web, ale aktuality o akcích jsou roztroušené po Facebooku, Posázaví a hospodských vývěskách. Chceme to dát na jedno místo.",
    publishedAt: "2026-04-15",
    author: "Krhanický Proud",
    readingTime: "4 min",
    categories: ["komentare"],
    tags: ["portál", "komunita", "vize"],
    href: "/blog/proc-stavime-tento-portal",
    heroImage: "/blog/proc-stavime-tento-portal.webp",
    relatedPosts: [
      "blog-spolky-v-krhanicich",
      "blog-rozhovor-starosta-2026",
      "blog-kanalizace-cov",
    ],
  },
  {
    id: "blog-jaro-2026",
    slug: "co-se-chysta-na-jaro-2026",
    title: "Co se chystá v Krhanicích na jaro 2026",
    excerpt:
      "Krátký přehled jarních akcí v obci a okolí: pálení čarodějnic, kácení máje, dětský den, plus tip na sousední obce.",
    publishedAt: "2026-04-08",
    author: "Krhanický Proud",
    readingTime: "3 min",
    categories: ["tipy-na-vylet", "zivot-v-obci"],
    tags: ["jaro", "akce", "tradice"],
    href: "/blog/co-se-chysta-na-jaro-2026",
    heroImage: "/blog/co-se-chysta-na-jaro-2026.webp",
    relatedPosts: [
      "blog-vylet-posazavi-cyklo",
      "blog-spolky-v-krhanicich",
      "blog-rozhovor-starosta-2026",
    ],
  },
  {
    id: "blog-kanalizace-cov",
    slug: "kanalizace-cov-prvni-etapa",
    title: "Kanalizace a ČOV: co znamená první etapa",
    excerpt:
      "Co projekt obnáší, jaké uzavírky vás čekají v ulicích Pod Vrškem a Na Návsi, jaký je harmonogram a co se chystá v dalších měsících.",
    publishedAt: "2026-03-12",
    author: "Krhanický Proud",
    readingTime: "6 min",
    categories: ["z-radnice"],
    tags: ["kanalizace", "doprava", "infrastruktura"],
    href: "/blog/kanalizace-cov-prvni-etapa",
    heroImage: "/blog/kanalizace-cov-prvni-etapa.webp",
    relatedPosts: [
      "blog-rozhovor-starosta-2026",
      "blog-proc-stavime-portal",
      "blog-spolky-v-krhanicich",
    ],
  },
  {
    id: "blog-rozhovor-starosta-2026",
    slug: "rozhovor-se-starostou-priority-2026",
    title: "Rozhovor se starostou: priority na rok 2026",
    excerpt:
      "Mluvili jsme s panem starostou o tom, co obec čeká v roce 2026. Na stole je hřiště pro děti, oprava kapličky a dotace na zateplení školy.",
    publishedAt: "2026-02-22",
    author: "Krhanický Proud",
    readingTime: "8 min",
    categories: ["rozhovory", "z-radnice"],
    tags: ["starosta", "plány", "rozpočet"],
    href: "/blog/rozhovor-se-starostou-priority-2026",
    heroImage: "/blog/rozhovor-se-starostou-priority-2026.webp",
    relatedPosts: [
      "blog-kanalizace-cov",
      "blog-proc-stavime-portal",
      "blog-spolky-v-krhanicich",
    ],
  },
  {
    id: "blog-spolky-v-krhanicich",
    slug: "sousedske-spolky-v-krhanicich",
    title: "Sousedské spolky v Krhanicích: kdo a kde",
    excerpt:
      "Přehled aktivních spolků v obci a jak se zapojit: SDH, TJ Sokol, myslivci, rybáři i divadelní soubor.",
    publishedAt: "2026-02-05",
    author: "Krhanický Proud",
    readingTime: "5 min",
    categories: ["zivot-v-obci"],
    tags: ["spolky", "komunita", "hasiči", "sokol"],
    href: "/blog/sousedske-spolky-v-krhanicich",
    heroImage: "/blog/sousedske-spolky-v-krhanicich.webp",
    relatedPosts: [
      "blog-jaro-2026",
      "blog-rozhovor-starosta-2026",
      "blog-vylet-posazavi-cyklo",
    ],
  },
  {
    id: "blog-vylet-posazavi-cyklo",
    slug: "letni-vylet-po-posazavi-na-kole",
    title: "Letní výlet po Posázaví na kole",
    excerpt:
      "Konkrétní trasa po Posázaví: 30 km, 4 hospody, 2 zámky a jedno koupání v Sázavě. Vhodné pro rodinu s dětmi staršími deseti let, plus tipy, kde se občerstvit.",
    publishedAt: "2026-01-18",
    author: "Krhanický Proud",
    readingTime: "5 min",
    categories: ["tipy-na-vylet"],
    tags: ["cyklistika", "příroda", "rodiny", "Posázaví"],
    href: "/blog/letni-vylet-po-posazavi-na-kole",
    heroImage: "/blog/letni-vylet-po-posazavi-na-kole.webp",
    relatedPosts: [
      "blog-jaro-2026",
      "blog-spolky-v-krhanicich",
      "blog-rozhovor-starosta-2026",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function sortBlogByDate(list: BlogPost[]): BlogPost[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterBlogByCategory(
  list: BlogPost[],
  cats: BlogCategory[],
): BlogPost[] {
  if (cats.length === 0) return list;
  return list.filter((p) => p.categories.some((c) => cats.includes(c)));
}

export function filterBlogByTag(list: BlogPost[], tags: string[]): BlogPost[] {
  if (tags.length === 0) return list;
  return list.filter((p) => p.tags.some((t) => tags.includes(t)));
}

// All tags currently used across posts, sorted by frequency desc.
// Used to render the tag chip filter on the blog index.
export function getAllTags(list: BlogPost[]): string[] {
  const counts = new Map<string, number>();
  for (const post of list) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
