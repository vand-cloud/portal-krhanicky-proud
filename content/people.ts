// People entity (Phase 2 wireframe -- hardcoded sample data).
// In Sanity this becomes a `person` document type. Affiliations is a
// reference to a tag list (or hardcoded enum) the operator can grow.
// Multi-affiliation: one person can be a councillor AND a Proud member
// AND a candidate at the same time -- stored as an array, not separate
// document types.

import type { SocialLinks } from "./entries";

export type Affiliation =
  | "zastupitel"
  | "proud-clen"
  | "kandidat-2026"
  | "redaktor";

export const affiliationLabels: Record<Affiliation, string> = {
  zastupitel: "Zastupitel",
  "proud-clen": "Člen Krhanického Proudu",
  "kandidat-2026": "Kandidát voleb 2026",
  redaktor: "Redaktor",
};

// "public" -> has a /lide/[slug] detail page, listings link to it
// "internal" -> name displays as plain text (no link), used as a service
// contact only. The person opted out of a public profile.
export type PersonVisibility = "public" | "internal";

export interface Person {
  id: string;
  slug: string;
  name: string;
  // Short formal role used in listings (e.g. "Starostka", "Předseda
  // kontrolního výboru", "Provozní hospody U Hraběte").
  role?: string;
  // 2-4 sentence bio for the detail page.
  bio?: string;
  affiliations: Affiliation[];
  visibility: PersonVisibility;
  contactEmail?: string;
  contactPhone?: string;
  social?: SocialLinks;
  // Optional photo URL. Phase 2 wireframe: empty -> typed placeholder.
  photo?: string;
  // Refs to other content (Phase 2 = id strings, Sanity = real refs).
  // `businesses`: services this person owns or runs.
  businesses?: string[];
  // `articles`: blog posts this person authored.
  articles?: string[];
}

export const people: Person[] = [
  // ─── Zastupitelé obce Krhanice (zdroj: obeckrhanice.cz/slozeni-zastupitelstva-obce,
  // scrape 2026-05-04, round 2). 9 zvolených zastupitelů, řazeno dle obecního
  // webu. Externí členové výborů (5 lidí) jsou níže s affiliation [] a rolí
  // jasně označenou jako členství ve výboru bez mandátu zastupitele.
  {
    id: "p-ales-papousek",
    slug: "ales-papousek",
    name: "Mgr. Aleš Papoušek",
    role: "Starosta, předseda spolku Naše Krhanice",
    bio: "Aleš Papoušek je starosta obce Krhanice a zároveň vede spolek Naše Krhanice. Má na starosti rozvoj obce, agendu kanalizace a ČOV (I. etapa od 2026) i ekologii: pod jeho vedením obec obhájila stříbrný certifikát Ekologická obec za rok 2025.",
    affiliations: ["zastupitel"],
    visibility: "public",
    contactEmail: "starosta@obeckrhanice.cz",
    contactPhone: "+420 733 120 090",
    businesses: ["sv-nase-krhanice"],
  },
  {
    id: "p-jaroslav-mixa",
    slug: "jaroslav-mixa",
    name: "Jaroslav Mixa",
    role: "Místostarosta",
    bio: "Jaroslav Mixa je místostarosta obce Krhanice. Komunikuje s občany v praktických otázkách provozu obce, mimo jiné svozu odpadu.",
    affiliations: ["zastupitel"],
    visibility: "public",
    contactEmail: "ou.krhanice@seznam.cz",
    contactPhone: "+420 733 120 091",
  },
  {
    id: "p-tomas-kratochvil",
    slug: "tomas-kratochvil",
    name: "Ing. Tomáš Kratochvíl",
    role: "Zastupitel, vedoucí SDH Krhanice",
    bio: "Tomáš Kratochvíl sedí v zastupitelstvu obce a zároveň vede Sbor dobrovolných hasičů Krhanice. SDH funguje od roku 1895 a stojí za většinou tradičních akcí v obci.",
    affiliations: ["zastupitel"],
    visibility: "public",
    contactPhone: "+420 721 959 131",
    businesses: ["pl-hasicska-zbrojnice-krhanice"],
  },
  {
    id: "p-jana-laboutkova",
    slug: "jana-laboutkova",
    name: "Jana Laboutková",
    role: "Zastupitelka, členka finančního výboru",
    affiliations: ["zastupitel"],
    visibility: "public",
  },
  {
    id: "p-martin-jiricka",
    slug: "martin-jiricka",
    name: "Ing. Martin Jiřička",
    role: "Zastupitel, předseda kontrolního výboru",
    bio: "Martin Jiřička vede kontrolní výbor zastupitelstva obce Krhanice. Dohlíží na hospodaření obce a plnění usnesení zastupitelstva.",
    affiliations: ["zastupitel"],
    visibility: "public",
  },
  {
    id: "p-petr-dub",
    slug: "petr-dub",
    name: "Bc. Petr Dub, DiS.",
    role: "Zastupitel, předseda finančního výboru",
    bio: "Petr Dub vede finanční výbor zastupitelstva obce Krhanice. Stará se o rozpočet, jeho plnění a střednědobý finanční výhled.",
    affiliations: ["zastupitel"],
    visibility: "public",
  },
  {
    id: "p-ales-kozel",
    slug: "ales-kozel",
    name: "Ing. Aleš Kozel",
    role: "Zastupitel, člen kontrolního výboru",
    affiliations: ["zastupitel"],
    visibility: "public",
  },
  {
    id: "p-lucie-marsikova",
    slug: "lucie-marsikova",
    name: "Mgr. Lucie Maršíková",
    role: "Zastupitelka, předsedkyně spolku Aktivní Krhanice",
    bio: "Lucie Maršíková sedí v zastupitelstvu obce a vede spolek Aktivní Krhanice. Spolek se zaměřuje na kultivaci veřejného prostoru, sousedských vztahů a kulturní akce.",
    affiliations: ["zastupitel"],
    visibility: "public",
    contactEmail: "lucie.vasakova@gmail.com",
    contactPhone: "+420 606 269 744",
    businesses: ["sv-aktivni-krhanice"],
  },
  {
    id: "p-sarka-dusova",
    slug: "sarka-dusova",
    name: "Bc. Šárka Dušová",
    role: "Zastupitelka",
    affiliations: ["zastupitel"],
    visibility: "public",
  },
  // ─── Vedoucí veřejných institucí v Krhanicích ────────────────────────────
  {
    id: "p-vera-rablova",
    slug: "vera-rablova",
    name: "Mgr. Bc. Věra Ráblová",
    role: "Ředitelka Základní školy Krhanice",
    bio: "Věra Ráblová vede Základní školu Krhanice. Zároveň působí jako školní metodička prevence. Škola realizuje projekt Škola pro budoucnost a zapojuje se do dotačních programů Doučování žáků a OP JAK.",
    affiliations: [],
    visibility: "public",
    contactEmail: "skola@zskrhanice.cz",
    contactPhone: "+420 733 120 094",
    businesses: ["sv-zs-krhanice"],
  },
  {
    id: "p-jana-bydzovska",
    slug: "jana-bydzovska",
    name: "Ing. Jana Bydžovská",
    role: "Předsedkyně spolku Karhany",
    bio: "Jana Bydžovská vede spolek Karhany, který pořádá Masopust, vánoční trhy, knižní bazary i kroužky pro děti.",
    affiliations: [],
    visibility: "public",
    contactEmail: "spolek@karhany.cz",
    businesses: ["sv-karhany"],
  },
  {
    id: "p-ivana-vatechova",
    slug: "ivana-vatechova",
    name: "Ivana Vatechová",
    role: "SDH Krhanice (kontakt)",
    affiliations: [],
    visibility: "public",
    contactPhone: "+420 723 466 090",
    businesses: ["pl-hasicska-zbrojnice-krhanice"],
  },
  {
    id: "p-hana-strnadova",
    slug: "hana-strnadova",
    name: "Hana Strnadová",
    role: "Členka představenstva spolku Aktivní Krhanice",
    affiliations: [],
    visibility: "public",
    contactEmail: "atelier@hanastrnadova.cz",
    contactPhone: "+420 606 208 372",
    businesses: ["sv-aktivni-krhanice"],
  },
  // ─── Externí členové výborů (NEjsou zastupitelé) ────────────────────────
  {
    id: "p-alena-kratochvilova",
    slug: "alena-kratochvilova",
    name: "Ing. Alena Kratochvílová",
    role: "Členka finančního výboru (externí)",
    affiliations: [],
    visibility: "public",
  },
  {
    id: "p-dana-kohoutova",
    slug: "dana-kohoutova",
    name: "Dana Kohoutová",
    role: "Knihovnice, členka finančního výboru (externí)",
    bio: "Dana Kohoutová vede Obecní knihovnu Krhanice a zasedá ve finančním výboru obce. Knihovna má od ledna 2026 rozšířenou provozní dobu, registrace zůstává bez poplatku.",
    affiliations: [],
    visibility: "public",
    businesses: ["sv-knihovna-krhanice"],
  },
  {
    id: "p-sona-valaskova",
    slug: "sona-valaskova",
    name: "Soňa Valášková",
    role: "Členka finančního výboru (externí)",
    affiliations: [],
    visibility: "public",
  },
  {
    id: "p-radek-scotka",
    slug: "radek-scotka",
    name: "Ing. Radek Ščotka",
    role: "Člen kontrolního výboru (externí)",
    affiliations: [],
    visibility: "public",
  },
  {
    id: "p-marketa-fischerova",
    slug: "marketa-fischerova",
    name: "Ing. Markéta Fischerová",
    role: "Členka kontrolního výboru (externí)",
    affiliations: [],
    visibility: "public",
  },
  {
    id: "p-adela-polachova",
    slug: "adela-polachova",
    name: "Adéla Polachová",
    role: "Lídryně kandidátky, členka Krhanického Proudu",
    bio: "Adéla Polachová vede kandidátku Krhanického Proudu do zastupitelstva v komunálních volbách 2026. Mimo politiku se věnuje environmentální výchově dětí.",
    affiliations: ["kandidat-2026", "proud-clen"],
    visibility: "public",
    contactEmail: "adela.polachova@krhanickyproud.cz",
    social: {
      facebook: "https://www.facebook.com/adela.polachova",
    },
  },
  // Phase 2 wireframe: rest of the candidate list. In Sanity these stay
  // in `person` documents tagged with affiliation "kandidat-2026" -- the
  // /proud page filters live and orders them by their position in the
  // people array (ballot order).
  {
    id: "p-jakub-hajek",
    slug: "jakub-hajek",
    name: "Jakub Hájek",
    role: "Kandidát, učitel matematiky",
    bio: "Jakub Hájek učí matematiku na druhém stupni v Týnci. Dlouhodobě se v Krhanicích zasazuje o lepší vybavení školy a školky. Trénuje místní mladší žáky v kopané.",
    affiliations: ["kandidat-2026", "proud-clen"],
    visibility: "public",
    contactEmail: "jakub.hajek@krhanickyproud.cz",
  },
  {
    id: "p-milena-dvorakova",
    slug: "milena-dvorakova",
    name: "Milena Dvořáková",
    role: "Kandidátka, ekonomka",
    bio: "Milena Dvořáková pracuje jako účetní v soukromé firmě v Praze. Do voleb jde s důrazem na transparentní hospodaření obce a srozumitelný rozpočet pro občany.",
    affiliations: ["kandidat-2026", "proud-clen"],
    visibility: "public",
    contactEmail: "milena.dvorakova@krhanickyproud.cz",
  },
  {
    id: "p-pavel-cerny",
    slug: "pavel-cerny",
    name: "Pavel Černý",
    role: "Kandidát, hasič a zedník",
    bio: "Pavel Černý je členem místního SDH a živí se jako zedník. Zaměřuje se na praktická řešení, která dělají život v obci pohodlnější: chodníky, lavičky, autobusové zastávky.",
    affiliations: ["kandidat-2026"],
    visibility: "public",
    contactEmail: "pavel.cerny@krhanickyproud.cz",
  },
  {
    id: "p-lenka-pokorna",
    slug: "lenka-pokorna",
    name: "Lenka Pokorná",
    role: "Kandidátka, lékařka",
    bio: "Lenka Pokorná pracuje jako praktická lékařka v Týnci. V Krhanicích žije s rodinou patnáct let. Do voleb jde s tématy zdravotní dostupnosti a podpory seniorů.",
    affiliations: ["kandidat-2026", "proud-clen"],
    visibility: "public",
    contactEmail: "lenka.pokorna@krhanickyproud.cz",
  },
  {
    id: "p-stepan-kratochvil",
    slug: "stepan-kratochvil",
    name: "Štěpán Kratochvíl",
    role: "Kandidát, IT specialista",
    bio: "Štěpán Kratochvíl pracuje v oblasti IT bezpečnosti. Do voleb přináší témata digitalizace obecní agendy, otevřených dat a fungujícího webu obce.",
    affiliations: ["kandidat-2026"],
    visibility: "public",
    contactEmail: "stepan.kratochvil@krhanickyproud.cz",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function findPersonBySlug(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}

export function findPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

export function peopleByAffiliation(aff: Affiliation): Person[] {
  return people.filter((p) => p.affiliations.includes(aff));
}

// True when the person should be shown as a clickable link to /lide/[slug].
export function isLinkable(person: Person): boolean {
  return person.visibility === "public";
}
