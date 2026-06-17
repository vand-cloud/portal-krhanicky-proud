// /proud content (Phase 2 wireframe -- hardcoded sample data).
// One flat list of items, each tagged with category. Polymorphic: an
// item is either a candidate card (personId) or a free-form post
// ("nápad / řešení") with a title, date, description, and author.
// In Sanity this becomes a `proudItem` document type with category
// reference + a portable text body for posts.

export type ProudCategory =
  | "program"
  | "kandidati"
  | "doprava"
  | "zivotni-prostredi"
  | "vzdelavani-deti"
  | "komunita-kultura"
  | "transparentnost-rozpocet";

export interface ProudCategoryDef {
  slug: ProudCategory;
  label: string;
  // 1-2 sentence intro shown above the list when the category is active.
  description?: string;
}

// Sidebar order. Program first (the manifesto), candidates second, then
// thematic policy areas. Matches how a voter typically explores: who
// are you → who is running → what do you stand for.
export const proudCategories: ProudCategoryDef[] = [
  {
    slug: "program",
    label: "Náš program",
    description:
      "Co chceme v Krhanicích dělat jinak. Hlavní teze našeho programu pro volební období 2026 až 2030.",
  },
  {
    slug: "kandidati",
    label: "Naši kandidáti",
    description:
      "Kdo jde v komunálních volbách 2026 za Krhanický Proud. Kandidátka v pořadí, jak ji uvidíte na hlasovacím lístku.",
  },
  {
    slug: "doprava",
    label: "Doprava a chodníky",
    description:
      "Bezpečné cesty pro pěší, lepší autobusové spojení, jasná pravidla pro parkování.",
  },
  {
    slug: "zivotni-prostredi",
    label: "Životní prostředí",
    description:
      "Odpady, zeleň, voda. Konkrétní kroky, které obec může udělat sama, bez čekání na kraj.",
  },
  {
    slug: "vzdelavani-deti",
    label: "Vzdělávání a děti",
    description:
      "Mateřská škola, základní škola, hřiště. Místa, kde rostou další generace Krhaničáků.",
  },
  {
    slug: "komunita-kultura",
    label: "Komunita a kultura",
    description:
      "Spolky, sousedské akce, společný prostor. Krhanice nejsou jen ulice domů, jsou to lidé.",
  },
  {
    slug: "transparentnost-rozpocet",
    label: "Transparentnost a rozpočet",
    description:
      "Smlouvy, výběrová řízení, hospodaření. Obec, kde je každá koruna dohledatelná.",
  },
];

export const proudCategoryLabels: Record<ProudCategory, string> =
  Object.fromEntries(
    proudCategories.map((c) => [c.slug, c.label]),
  ) as Record<ProudCategory, string>;

export interface ProudItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  // ISO date for posts (idea / proposed solution publish date). Omitted
  // for static items like candidate cards.
  date?: string;
  category: ProudCategory;
  // Link target. Posts and candidate detail pages live under /proud/[slug]
  // and render inside ProudIndex's right pane (sidebar stays mounted).
  href: string;
  // Person reference: candidate cards in "Naši kandidáti" use this to
  // render the person profile inline; posts use it as author byline.
  personId?: string;
  // "Vše" mode curated order. Lower number = higher up. Items without
  // featuredOrder fall to the bottom of the curated mix.
  featuredOrder?: number;
  // Cover image URL. Wireframe phase leaves this empty -- the highlight
  // card then renders a typed placeholder with a category-specific icon.
  // Sanity migration fills it with an asset reference rendered via
  // next/image.
  heroImage?: string;
  // Optional curation flag for the homepage of /proud: items marked
  // `highlight: true` are surfaced in the "Střípky z našeho programu"
  // strip below the hero/candidates block. Independent of featuredOrder
  // so we can tune the rozcestník mix and the homepage strip separately.
  highlight?: boolean;
}

// Manifesto post -- the main programme statement.
const programItems: ProudItem[] = [
  {
    id: "proud-program-manifesto",
    heroImage: "/blog/co-se-chysta-na-jaro-2026.webp",
    slug: "nas-program-2026-2030",
    title: "Náš program pro Krhanice 2026 až 2030",
    description:
      "Sedm priorit Krhanického Proudu pro nadcházející volební období. Otevřená radnice, bezpečné chodníky, péče o zeleň, podpora škol a spolků, transparentní rozpočet.",
    date: "2026-04-10",
    category: "program",
    href: "/proud/nas-program/nas-program-2026-2030",
    personId: "p-adela-polachova",
    featuredOrder: 1,
  },
];

// Candidate cards -- one item per person tagged with affiliation
// "kandidat-2026". Order on the ballot is the order in this array.
const candidateItems: ProudItem[] = [
  {
    id: "proud-k-adela-polachova",
    slug: "kandidat-adela-polachova",
    title: "Adéla Polachová",
    description: "Lídryně kandidátky",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-adela-polachova",
    personId: "p-adela-polachova",
    featuredOrder: 2,
  },
  {
    id: "proud-k-jakub-hajek",
    slug: "kandidat-jakub-hajek",
    title: "Jakub Hájek",
    description: "Učitel matematiky",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-jakub-hajek",
    personId: "p-jakub-hajek",
  },
  {
    id: "proud-k-milena-dvorakova",
    slug: "kandidat-milena-dvorakova",
    title: "Milena Dvořáková",
    description: "Ekonomka",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-milena-dvorakova",
    personId: "p-milena-dvorakova",
  },
  {
    id: "proud-k-pavel-cerny",
    slug: "kandidat-pavel-cerny",
    title: "Pavel Černý",
    description: "Hasič a zedník",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-pavel-cerny",
    personId: "p-pavel-cerny",
  },
  {
    id: "proud-k-lenka-pokorna",
    slug: "kandidat-lenka-pokorna",
    title: "Lenka Pokorná",
    description: "Praktická lékařka",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-lenka-pokorna",
    personId: "p-lenka-pokorna",
  },
  {
    id: "proud-k-stepan-kratochvil",
    slug: "kandidat-stepan-kratochvil",
    title: "Štěpán Kratochvíl",
    description: "IT specialista",
    category: "kandidati",
    href: "/proud/nas-program/kandidat-stepan-kratochvil",
    personId: "p-stepan-kratochvil",
  },
];

// Policy posts -- "nápady a řešení". Each post has a title, date,
// description and an author (personId). In Sanity these gain a
// portable text body. Wireframe phase: title + lede only.
const policyItems: ProudItem[] = [
  {
    id: "proud-d-bezpecne-chodniky",
    heroImage: "/blog/sousedske-spolky-v-krhanicich.webp",
    slug: "bezpecne-chodniky-podel-hlavni",
    title: "Bezpečné chodníky podél hlavní silnice",
    description:
      "Návrh dvouletého plánu, jak doplnit chodníky tam, kde dnes lidé chodí po krajnici. Začneme úsekem od školy ke kapličce.",
    date: "2026-04-22",
    category: "doprava",
    href: "/proud/nas-program/bezpecne-chodniky-podel-hlavni",
    personId: "p-pavel-cerny",
    featuredOrder: 3,
    highlight: true,
  },
  {
    id: "proud-d-autobus-tynec",
    heroImage: "/blog/kanalizace-cov-prvni-etapa.webp",
    slug: "lepsi-autobus-do-tynce",
    title: "Lepší autobusové spojení do Týnce",
    description:
      "Současný interval 90 minut neodpovídá potřebám studentů a pracujících. Jednáme s krajem o posílení ranního a podvečerního spoje.",
    date: "2026-03-30",
    category: "doprava",
    href: "/proud/nas-program/lepsi-autobus-do-tynce",
    personId: "p-jakub-hajek",
  },
  {
    id: "proud-zp-bioodpad",
    heroImage: "/blog/letni-vylet-po-posazavi-na-kole.webp",
    slug: "tridit-bioodpad-v-kazde-domacnosti",
    title: "Třídit bioodpad v každé domácnosti",
    description:
      "Hnědé popelnice na biodopad zdarma pro všechny domy. Snížíme tím množství směsného odpadu i poplatek za svoz.",
    date: "2026-04-05",
    category: "zivotni-prostredi",
    href: "/proud/nas-program/tridit-bioodpad-v-kazde-domacnosti",
    personId: "p-adela-polachova",
    featuredOrder: 4,
    highlight: true,
  },
  {
    id: "proud-zp-laviky-stromy",
    heroImage: "/blog/proc-stavime-tento-portal.webp",
    slug: "vice-laviek-a-stromu-v-centru",
    title: "Více laviček a stromů v centru obce",
    description:
      "Náves bez stínu a místa k odpočinku. Jednoduchý plán: deset stromů a deset laviček do tří let, vždy s plánem péče.",
    date: "2026-03-18",
    category: "zivotni-prostredi",
    href: "/proud/nas-program/vice-laviek-a-stromu-v-centru",
    personId: "p-jakub-hajek",
  },
  {
    id: "proud-vd-detske-hriste",
    heroImage: "/blog/rozhovor-se-starostou-priority-2026.webp",
    slug: "nove-detske-hriste-u-sokolovny",
    title: "Nové dětské hřiště u Sokolovny",
    description:
      "Vyměnit 25 let starou herní sestavu za moderní, bezpečnou a přístupnou i pro děti s pohybovým omezením. Předpokládaný rozpočet 1,2 milionu Kč.",
    date: "2026-04-15",
    category: "vzdelavani-deti",
    href: "/proud/nas-program/nove-detske-hriste-u-sokolovny",
    personId: "p-jakub-hajek",
    featuredOrder: 5,
    highlight: true,
  },
  {
    id: "proud-vd-skolni-zahrada",
    heroImage: "/blog/co-se-chysta-na-jaro-2026.webp",
    slug: "skolni-zahrada-jako-ucebna",
    title: "Školní zahrada jako učebna pod širým nebem",
    description:
      "Bylinková zahrádka, ovocné stromy, lavičky s pracovními stoly. Místo, kde děti pěstují, počítají i čtou venku.",
    date: "2026-02-28",
    category: "vzdelavani-deti",
    href: "/proud/nas-program/skolni-zahrada-jako-ucebna",
    personId: "p-lenka-pokorna",
  },
  {
    id: "proud-kk-sousedske-trhy",
    heroImage: "/blog/sousedske-spolky-v-krhanicich.webp",
    slug: "navrat-sousedskych-trhu",
    title: "Návrat sousedských sobotních trhů",
    description:
      "Jednou za měsíc malý trh na návsi. Zelenina od místních pěstitelů, pečivo, med. Rozpočet zajistí pronájem stánků a zvuk.",
    date: "2026-03-25",
    category: "komunita-kultura",
    href: "/proud/nas-program/navrat-sousedskych-trhu",
    personId: "p-adela-polachova",
    featuredOrder: 6,
  },
  {
    id: "proud-tr-otevrene-smlouvy",
    heroImage: "/blog/kanalizace-cov-prvni-etapa.webp",
    slug: "zverejnime-vsechny-smlouvy",
    title: "Zveřejníme všechny smlouvy obce",
    description:
      "Registr smluv nad 50 000 Kč máme dnes ze zákona. My zveřejníme všechny, bez ohledu na částku, a do 14 dnů od podpisu.",
    date: "2026-04-08",
    category: "transparentnost-rozpocet",
    href: "/proud/nas-program/zverejnime-vsechny-smlouvy",
    personId: "p-milena-dvorakova",
    featuredOrder: 7,
    highlight: true,
  },
  {
    id: "proud-tr-otevreny-rozpocet",
    heroImage: "/blog/letni-vylet-po-posazavi-na-kole.webp",
    slug: "otevreny-rozpocet-online",
    title: "Otevřený rozpočet online",
    description:
      "Vizualizace, kam jdou peníze obce. Klikatelný strom kapitol, vždy aktuální stav čerpání, bez nutnosti studovat tabulky.",
    date: "2026-03-15",
    category: "transparentnost-rozpocet",
    href: "/proud/nas-program/otevreny-rozpocet-online",
    personId: "p-stepan-kratochvil",
  },
];

export const proudItems: ProudItem[] = [
  ...programItems,
  ...candidateItems,
  ...policyItems,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function findProudItemBySlug(slug: string): ProudItem | undefined {
  return proudItems.find((i) => i.slug === slug);
}

export function proudItemsByCategory(cat: ProudCategory): ProudItem[] {
  return proudItems
    .filter((i) => i.category === cat)
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
}

// Highlight strip on /proud homepage: items explicitly marked as
// highlight, in their declaration order. Editorial cap (4 items) lives
// on the consumer side -- here we just expose the curated set.
export function proudHighlightItems(): ProudItem[] {
  return proudItems.filter((i) => i.highlight === true);
}

// "Vše" curated mix: featured items first (in featuredOrder), then the
// rest by date desc. Mirrors obecFeaturedMix's pattern.
export function proudFeaturedMix(): ProudItem[] {
  const featured = proudItems
    .filter((i) => typeof i.featuredOrder === "number")
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
  const rest = proudItems
    .filter((i) => typeof i.featuredOrder !== "number")
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  return [...featured, ...rest];
}
