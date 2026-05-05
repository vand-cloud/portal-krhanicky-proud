// /obec content (Phase 2 wireframe -- hardcoded sample data).
// One flat list of items, each tagged with category + optional subcategory.
// In Sanity this becomes a polymorphic `obecItem` document with a category
// reference + per-category fields (date for news, file URL for documents,
// person ref for council members, etc.).

import { news as villageNews } from "./entries";

export type ObecCategory =
  | "aktuality"
  | "uredni-deska"
  | "zastupitelstvo"
  | "dokumenty";

export type ObecSubcategory =
  // zastupitelstvo
  | "zastupitele"
  | "nadchazejici-schuze"
  | "archiv-schuzi"
  | "kontakt"
  // dokumenty
  | "vyhlasky"
  | "rozpocet"
  | "smlouvy"
  | "strategie";

export interface ObecSubcategoryDef {
  slug: ObecSubcategory;
  label: string;
  // Short hint shown on the category hub card for this subcategory.
  description?: string;
}

export interface ObecCategoryDef {
  slug: ObecCategory;
  label: string;
  // 1-2 sentence intro shown above the category hub when this category is
  // active. Sets context for the user before they pick a subcategory.
  description?: string;
  subcategories?: ObecSubcategoryDef[];
}

// Sidebar order. Aktuality first because they're time-critical, then formal
// notices, then council and documents.
export const obecCategories: ObecCategoryDef[] = [
  {
    slug: "aktuality",
    label: "Aktuality",
    description:
      "Aktuální dění v obci. Dopravní omezení, svozy odpadu, kulturní akce, oznámení obecního úřadu.",
  },
  {
    slug: "uredni-deska",
    label: "Úřední deska",
    description:
      "Veřejné vyhlášky, oznámení, výzvy. Vše, co obec formálně vyvěšuje k nahlédnutí.",
  },
  {
    slug: "zastupitelstvo",
    label: "Zastupitelstvo",
    description:
      "Sedm zvolených zástupců a jejich práce. Najdete tu složení zastupitelstva, nejbližší zasedání, archiv zápisů i kontakt na úřad.",
    subcategories: [
      {
        slug: "zastupitele",
        label: "Zastupitelé",
        description: "Složení zastupitelstva, role a kontakty.",
      },
      {
        slug: "nadchazejici-schuze",
        label: "Nadcházející schůze",
        description: "Termíny veřejných zasedání včetně programu.",
      },
      {
        slug: "archiv-schuzi",
        label: "Archiv schůzí",
        description: "Zápisy a usnesení z proběhlých zasedání.",
      },
      {
        slug: "kontakt",
        label: "Kontakt",
        description: "Adresa, otevírací doba, e-mail úřadu.",
      },
    ],
  },
  {
    slug: "dokumenty",
    label: "Dokumenty",
    description:
      "Vyhlášky obce, rozpočet, registr smluv, strategické plány. Vše k nahlédnutí i ke stažení.",
    subcategories: [
      {
        slug: "vyhlasky",
        label: "Vyhlášky",
        description: "Obecně závazné vyhlášky a jejich účinnost.",
      },
      {
        slug: "rozpocet",
        label: "Rozpočet",
        description: "Roční rozpočet a střednědobý finanční výhled.",
      },
      {
        slug: "smlouvy",
        label: "Smlouvy",
        description: "Registr veřejných smluv obce.",
      },
      {
        slug: "strategie",
        label: "Strategie",
        description: "Strategické plány rozvoje obce.",
      },
    ],
  },
];

export const obecCategoryLabels: Record<ObecCategory, string> = Object.fromEntries(
  obecCategories.map((c) => [c.slug, c.label]),
) as Record<ObecCategory, string>;

export const obecSubcategoryLabels: Record<ObecSubcategory, string> = (() => {
  const map: Partial<Record<ObecSubcategory, string>> = {};
  for (const cat of obecCategories) {
    for (const sub of cat.subcategories ?? []) {
      map[sub.slug] = sub.label;
    }
  }
  return map as Record<ObecSubcategory, string>;
})();

export interface ObecItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  // ISO date for chronological items (news, council meetings, document
  // publish dates). Omitted for static items (people, contact pages).
  date?: string;
  category: ObecCategory;
  subcategory?: ObecSubcategory;
  // Link target. Most items lead to /obec/[slug]; council members link to
  // /lide/[slug]; some document items can link to external PDFs.
  href: string;
  // Person reference for council members (renders the person card inline
  // in the listing instead of a generic title row).
  personId?: string;
  // Optional explicit position in "Vše" curated mix. Lower number = higher
  // up. Items without `featuredOrder` fall to the bottom of "Vše".
  featuredOrder?: number;
}

// Council members rendered as items pointing to /obec/[slug] -- the detail
// stays inside the /obec sidebar context. The Person record is referenced
// via personId; /obec/[slug] page resolves it and renders person details
// in the right pane while keeping the sidebar.
// Source: obeckrhanice.cz/slozeni-zastupitelstva-obce, scrape 2026-05-04
// (round 2). Exactly 9 elected councillors; external committee members live
// in `people.ts` and surface elsewhere (knihovna page, výbory listing).
const councilItems: ObecItem[] = [
  {
    id: "obec-z-ales-papousek",
    slug: "zastupitel-ales-papousek",
    title: "Mgr. Aleš Papoušek",
    description: "Starosta",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-ales-papousek",
    personId: "p-ales-papousek",
  },
  {
    id: "obec-z-jaroslav-mixa",
    slug: "zastupitel-jaroslav-mixa",
    title: "Jaroslav Mixa",
    description: "Místostarosta",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-jaroslav-mixa",
    personId: "p-jaroslav-mixa",
  },
  {
    id: "obec-z-tomas-kratochvil",
    slug: "zastupitel-tomas-kratochvil",
    title: "Ing. Tomáš Kratochvíl",
    description: "Zastupitel",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-tomas-kratochvil",
    personId: "p-tomas-kratochvil",
  },
  {
    id: "obec-z-jana-laboutkova",
    slug: "zastupitel-jana-laboutkova",
    title: "Jana Laboutková",
    description: "Zastupitelka, finanční výbor",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-jana-laboutkova",
    personId: "p-jana-laboutkova",
  },
  {
    id: "obec-z-martin-jiricka",
    slug: "zastupitel-martin-jiricka",
    title: "Ing. Martin Jiřička",
    description: "Předseda kontrolního výboru",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-martin-jiricka",
    personId: "p-martin-jiricka",
  },
  {
    id: "obec-z-petr-dub",
    slug: "zastupitel-petr-dub",
    title: "Bc. Petr Dub, DiS.",
    description: "Předseda finančního výboru",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-petr-dub",
    personId: "p-petr-dub",
  },
  {
    id: "obec-z-ales-kozel",
    slug: "zastupitel-ales-kozel",
    title: "Ing. Aleš Kozel",
    description: "Zastupitel, kontrolní výbor",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-ales-kozel",
    personId: "p-ales-kozel",
  },
  {
    id: "obec-z-lucie-marsikova",
    slug: "zastupitel-lucie-marsikova",
    title: "Mgr. Lucie Maršíková",
    description: "Zastupitelka, kontrolní výbor",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-lucie-marsikova",
    personId: "p-lucie-marsikova",
  },
  {
    id: "obec-z-sarka-dusova",
    slug: "zastupitel-sarka-dusova",
    title: "Bc. Šárka Dušová",
    description: "Zastupitelka",
    category: "zastupitelstvo",
    subcategory: "zastupitele",
    href: "/obec/zastupitel-sarka-dusova",
    personId: "p-sarka-dusova",
  },
];

// Real meetings scraped 2026-05-04 from obeckrhanice.cz. Recent zápisy a
// usnesení 2025-2026. Termín nadcházejícího zasedání obec na webu nezveřejnila
// (dlouhodobě se konají jednou za 2-3 měsíce); placeholder sem klient doplní.
const meetingItems: ObecItem[] = [
  {
    id: "obec-schuze-pripravujeme",
    slug: "nadchazejici-zasedani-zastupitelstva",
    title: "Termín nejbližšího zasedání zastupitelstva",
    description: "Termín a program zveřejní obec na úřední desce 7 dní předem.",
    category: "zastupitelstvo",
    subcategory: "nadchazejici-schuze",
    href: "/obec/nadchazejici-zasedani-zastupitelstva",
  },
  {
    id: "obec-schuze-2026-03-09",
    slug: "zapis-2026-1-zasedani-9-3-2026",
    title: "Zápis č. 1/2026, zasedání 9. 3. 2026",
    description: "Usnesení č. 1/2026. Příprava projektu kanalizace a ČOV (I. etapa).",
    date: "2026-03-09",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2026-1-zasedani-9-3-2026",
  },
  {
    id: "obec-schuze-2025-12-12",
    slug: "zapis-2025-6-zasedani-12-12-2025",
    title: "Zápis č. 6/2025, zasedání 12. 12. 2025",
    description: "Usnesení č. 6/2025. Schválení rozpočtu obce 2026, vyhláška o pyrotechnice.",
    date: "2025-12-12",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-6-zasedani-12-12-2025",
  },
  {
    id: "obec-schuze-2025-11-19",
    slug: "zapis-2025-5-zasedani-19-11-2025",
    title: "Zápis č. 5/2025, zasedání 19. 11. 2025",
    description: "Usnesení č. 5/2025.",
    date: "2025-11-19",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-5-zasedani-19-11-2025",
  },
  {
    id: "obec-schuze-2025-08-26",
    slug: "zapis-2025-4-zasedani-26-8-2025",
    title: "Zápis č. 4/2025, zasedání 26. 8. 2025",
    description: "Usnesení č. 4/2025.",
    date: "2025-08-26",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-4-zasedani-26-8-2025",
  },
  {
    id: "obec-schuze-2025-06-25",
    slug: "zapis-2025-3-zasedani-25-6-2025",
    title: "Zápis č. 3/2025, zasedání 25. 6. 2025",
    description: "Usnesení č. 3/2025.",
    date: "2025-06-25",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-3-zasedani-25-6-2025",
  },
  {
    id: "obec-schuze-2025-04-16",
    slug: "zapis-2025-2-zasedani-16-4-2025",
    title: "Zápis č. 2/2025, zasedání 16. 4. 2025",
    description: "Usnesení č. 2/2025. Vyhláška č. 1/2025 o nočním klidu.",
    date: "2025-04-16",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-2-zasedani-16-4-2025",
  },
  {
    id: "obec-schuze-2025-03-11",
    slug: "zapis-2025-1-zasedani-11-3-2025",
    title: "Zápis č. 1/2025, zasedání 11. 3. 2025",
    description: "Usnesení č. 1/2025.",
    date: "2025-03-11",
    category: "zastupitelstvo",
    subcategory: "archiv-schuzi",
    href: "/obec/zapis-2025-1-zasedani-11-3-2025",
  },
];

// Real office contact + úřední hodiny scraped 2026-05-04 (round 2).
const contactItems: ObecItem[] = [
  {
    id: "obec-kontakt-urad",
    slug: "kontakt-obecni-urad",
    title: "Obecní úřad Krhanice",
    description:
      "Krhanice 46, 257 42 Krhanice. Telefon 317 702 121, e-mail ou.krhanice@seznam.cz. IČO 00232025.",
    category: "zastupitelstvo",
    subcategory: "kontakt",
    href: "/obec/kontakt-obecni-urad",
  },
  {
    id: "obec-kontakt-uredni-hodiny",
    slug: "uredni-hodiny",
    title: "Úřední hodiny",
    description:
      "Pondělí a středa 8:00 až 12:00 a 13:00 až 17:00. Úterý a čtvrtek 8:00 až 12:00. Pátek zavřeno. Stejný rozvrh platí pro evidenci obyvatel a CzechPoint.",
    category: "zastupitelstvo",
    subcategory: "kontakt",
    href: "/obec/uredni-hodiny",
  },
];

// Real official board items scraped 2026-05-04 (top 8 by date).
const noticeItems: ObecItem[] = [
  {
    id: "obec-uredni-dan-nemovitosti-2026",
    slug: "verejna-vyhlaska-dan-z-nemovitych-veci-2026",
    title: "Veřejná vyhláška: Daň z nemovitých věcí na rok 2026",
    description: "Finanční úřad pro Středočeský kraj.",
    date: "2026-04-30",
    category: "uredni-deska",
    href: "/obec/verejna-vyhlaska-dan-z-nemovitych-veci-2026",
  },
  {
    id: "obec-uredni-netykavka",
    slug: "verejna-vyhlaska-netykavka-zlaznata",
    title: "Veřejná vyhláška: Zásady regulace netýkavky žláznaté",
    description: "Středočeský kraj, opatření obecné povahy.",
    date: "2026-04-27",
    category: "uredni-deska",
    href: "/obec/verejna-vyhlaska-netykavka-zlaznata",
  },
  {
    id: "obec-uredni-rd-7-odvolani",
    slug: "rozhodnuti-o-odvolani-7-rodinnych-domu",
    title: "Rozhodnutí o odvolání: 7 rodinných domů",
    description: "Včetně garáží, jímek a přípojek.",
    date: "2026-04-27",
    category: "uredni-deska",
    href: "/obec/rozhodnuti-o-odvolani-7-rodinnych-domu",
  },
  {
    id: "obec-uredni-drazba",
    slug: "usneseni-drazebni-vyhlaska",
    title: "Usnesení: Dražební vyhláška o elektronické dražbě",
    description: "Termín a podrobnosti v plném znění vyhlášky.",
    date: "2026-04-22",
    category: "uredni-deska",
    href: "/obec/usneseni-drazebni-vyhlaska",
  },
  {
    id: "obec-uredni-vodne-2025",
    slug: "vyuctovani-vodneho-2025",
    title: "Vyúčtování vodného za rok 2025",
    description: "Vodohospodářská společnost Benešov.",
    date: "2026-04-22",
    category: "uredni-deska",
    href: "/obec/vyuctovani-vodneho-2025",
  },
  {
    id: "obec-uredni-uzemni-plan-zmena-2",
    slug: "navrh-zmeny-c-2-uzemniho-rozvojoveho-planu",
    title: "Návrh Změny č. 2 Územního rozvojového plánu",
    description: "Ministerstvo pro místní rozvoj, veřejné projednání.",
    date: "2026-04-15",
    category: "uredni-deska",
    href: "/obec/navrh-zmeny-c-2-uzemniho-rozvojoveho-planu",
  },
  {
    id: "obec-uredni-nalezena-vec",
    slug: "oznameni-o-nalezene-veci",
    title: "Oznámení o nalezené věci",
    description: "Lhůta pro vyzvednutí na obecním úřadě.",
    date: "2026-03-30",
    category: "uredni-deska",
    href: "/obec/oznameni-o-nalezene-veci",
  },
  {
    id: "obec-uredni-zkousky-hub",
    slug: "pozvanka-zkousky-znalosti-hub-2026",
    title: "Pozvánka ke zkouškám znalosti hub v roce 2026",
    description: "Krajská hygienická stanice Středočeského kraje.",
    date: "2026-03-25",
    category: "uredni-deska",
    href: "/obec/pozvanka-zkousky-znalosti-hub-2026",
  },
];

// Real ordinances scraped 2026-05-04 (16 items, deduplicated to 12 most recent).
const documentItems: ObecItem[] = [
  // Vyhlášky
  {
    id: "obec-doc-vyhl-1-2026-nocni-klid",
    slug: "vyhlaska-c-1-2026-nocni-klid",
    title: "Vyhláška č. 1/2026 o nočním klidu",
    description: "Účinnost od 28. 3. 2026.",
    date: "2026-03-28",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-1-2026-nocni-klid",
  },
  {
    id: "obec-doc-vyhl-4-2025-pyrotechnika",
    slug: "vyhlaska-c-4-2025-pyrotechnika",
    title: "Vyhláška č. 4/2025 o regulaci zacházení s pyrotechnickými výrobky",
    description: "Účinnost od 2. 1. 2026. Doplněk k novele zákona č. 206/2015 Sb.",
    date: "2026-01-02",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-4-2025-pyrotechnika",
  },
  {
    id: "obec-doc-vyhl-3-2025-hlucne-cinnosti",
    slug: "vyhlaska-c-3-2025-hlucne-cinnosti",
    title: "Vyhláška č. 3/2025 o regulaci hlučných činností",
    description: "Účinnost od 11. 7. 2025.",
    date: "2025-07-11",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-3-2025-hlucne-cinnosti",
  },
  {
    id: "obec-doc-vyhl-2-2025-nocni-klid",
    slug: "vyhlaska-c-2-2025-nocni-klid",
    title: "Vyhláška č. 2/2025 o nočním klidu",
    description: "Účinnost od 11. 7. 2025.",
    date: "2025-07-11",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-2-2025-nocni-klid",
  },
  {
    id: "obec-doc-vyhl-5-2024-odpady",
    slug: "vyhlaska-c-5-2024-odpadove-hospodarstvi",
    title: "Vyhláška č. 5/2024 o stanovení obecního systému odpadového hospodářství",
    description: "Účinnost od 1. 1. 2025.",
    date: "2025-01-01",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-5-2024-odpadove-hospodarstvi",
  },
  {
    id: "obec-doc-vyhl-4-2024-koeficient-dane",
    slug: "vyhlaska-c-4-2024-mistni-koeficient",
    title: "Vyhláška č. 4/2024 o stanovení místního koeficientu pro daň z nemovitosti",
    description: "Účinnost od 1. 1. 2025.",
    date: "2025-01-01",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-4-2024-mistni-koeficient",
  },
  {
    id: "obec-doc-vyhl-11-2023-poplatek-odpady",
    slug: "vyhlaska-c-11-2023-poplatek-za-odpady",
    title: "Vyhláška č. 11/2023 o místním poplatku za odpadové hospodářství",
    description: "Účinnost od 1. 1. 2024.",
    date: "2024-01-01",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-11-2023-poplatek-za-odpady",
  },
  {
    id: "obec-doc-vyhl-8-2023-poplatek-psi",
    slug: "vyhlaska-c-8-2023-poplatek-ze-psu",
    title: "Vyhláška č. 8/2023 o místním poplatku ze psů",
    description: "Účinnost od 1. 1. 2024.",
    date: "2024-01-01",
    category: "dokumenty",
    subcategory: "vyhlasky",
    href: "/obec/vyhlaska-c-8-2023-poplatek-ze-psu",
  },
  // Rozpočet
  {
    id: "obec-doc-rozpocet-2026",
    slug: "rozpocet-obce-2026",
    title: "Rozpočet obce na rok 2026",
    description: "Schválen zastupitelstvem 12. 12. 2025.",
    date: "2025-12-12",
    category: "dokumenty",
    subcategory: "rozpocet",
    href: "/obec/rozpocet-obce-2026",
  },
  {
    id: "obec-doc-cov-projekt-2026",
    slug: "smlouva-projektova-priprava-cov-i-etapa",
    title: "Projektová příprava: Krhanice, kanalizace a ČOV, I. etapa",
    description: "Spolupráce s firmou Projekty Vodam s.r.o., zhruba 40 týdnů od poloviny března 2026.",
    date: "2026-03-11",
    category: "dokumenty",
    subcategory: "smlouvy",
    href: "/obec/smlouva-projektova-priprava-cov-i-etapa",
  },
];

// Aktuality reuse the existing news data so we don't duplicate. Wrap them
// into ObecItem shape on the fly.
const aktualityItems: ObecItem[] = villageNews.map((n) => ({
  id: `obec-aktualita-${n.id}`,
  slug: n.slug,
  title: n.title,
  description: n.description,
  date: n.date,
  category: "aktuality" as ObecCategory,
  href: n.href,
}));

// Curator's pick for the "Vše" landing. Lower number surfaces higher up.
// In Sanity this becomes a drag-and-drop reorder field on each item.
const featuredOrderById: Record<string, number> = {
  "obec-aktualita-n-kanalizace-cov-2026": 1,
  "obec-aktualita-n-den-zeme-2026": 2,
  "obec-aktualita-n-bioodpad-2026": 3,
  "obec-schuze-2026-03-09": 4,
  "obec-doc-rozpocet-2026": 5,
  "obec-aktualita-n-svoz-popelnic-2026": 6,
  "obec-aktualita-n-senior-taxi-2026": 7,
  "obec-doc-cov-projekt-2026": 8,
};

export const obecItems: ObecItem[] = [
  ...aktualityItems,
  ...noticeItems,
  ...councilItems,
  ...meetingItems,
  ...contactItems,
  ...documentItems,
].map((item) => {
  const featuredOrder = featuredOrderById[item.id];
  return featuredOrder !== undefined ? { ...item, featuredOrder } : item;
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function findObecItemBySlug(slug: string): ObecItem | undefined {
  return obecItems.find((i) => i.slug === slug);
}

// Items in the curated "Vše" mix, ordered by featuredOrder ascending.
// Items without an order are excluded -- "Vše" is supposed to be a tight
// editorial selection, not a full dump.
export function obecFeaturedMix(): ObecItem[] {
  return obecItems
    .filter((i) => i.featuredOrder !== undefined)
    .sort(
      (a, b) =>
        (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity),
    );
}

export function obecItemsByCategory(category: ObecCategory): ObecItem[] {
  const list = obecItems.filter((i) => i.category === category);
  // Date-bearing items: most recent first. Static items (people, contact)
  // keep their natural order from the source array.
  return list.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

export function obecItemsBySubcategory(
  category: ObecCategory,
  subcategory: ObecSubcategory,
): ObecItem[] {
  return obecItemsByCategory(category).filter(
    (i) => i.subcategory === subcategory,
  );
}
