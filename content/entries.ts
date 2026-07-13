// Catalog taxonomy + shared types/helpers for the katalog (akce / mista /
// gastro / obchody / sluzby / spolky). Mirrors the 4-level taxonomy spec
// (TYP → KATEGORIE → PODKATEGORIE → ŠTÍTKY) from
// _in/krhanicky-pruvodce-taxonomie.md (v1.0, 2026-05-05).
//
// The actual catalog RECORDS live in Sanity now (document type
// `catalogEntry`, fetched + mapped to `Entry` by lib/sanity/catalog.ts).
// This file no longer holds any entry data -- only the taxonomy (`Entry`
// interface, `EntryType`, `categoryDefs`, `subcategoryDefs`, `tagDefs`, …)
// and the pure filter/sort/search helpers everything downstream is built on.
//
// Hierarchy:
//   1. type        -- single, one of 6 forms (akce / mista / gastro / obchody / sluzby / spolky)
//   2. category    -- single, scoped per type (kultura, sport, …)
//   3. subcategory -- single, scoped per (type, category). Optional.
//   4. tags        -- multi, intersection (AND). Drawn from the shared catalog
//                     in tagDefs (each tag declares applicableForms).
//
// Multi-role entities (e.g. potter who runs a shop AND workshops) split into
// TWO entries per the spec, with `relatedEntries` cross-references.

// ─────────────────────────────────────────────────────────────────────────────
// Core types
// ─────────────────────────────────────────────────────────────────────────────

export type EntryType =
  | "akce"
  | "mista"
  | "gastro"
  | "obchody"
  | "sluzby"
  | "spolky";

// Category and Subcategory are stored as plain string slugs. Validation lives
// at runtime via categoryDefs / subcategoryDefs. Slugs are unique within a
// type (categories) or within a (type, category) tuple (subcategories), but
// may collide across different types -- that's expected per the spec ("Sport"
// is a category in Akce, Mista AND Spolky). Disambiguation always goes
// through the entry's `type` field.
export type Category = string;
export type Subcategory = string;

export type TrustLevel = "verified" | "scraped" | "user_submitted";
export type EntryStatus = "pending" | "approved" | "archived";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  web?: string;
}

export interface Entry {
  id: string;
  // Single type, one of 6 forms. No more multi-type arrays -- entities with
  // two strong roles (Hrnčířka prodejna + Hrnčířka workshop) live as TWO
  // separate entries cross-referenced via relatedEntries.
  type: EntryType;
  slug: string;
  title: string;
  description: string;
  // Routing path. Phase 2 wireframe uses 3 buckets (akce / mista / sluzby).
  // Mapping: akce → /akce, mista+gastro+obchody → /mista, sluzby+spolky → /sluzby.
  // Sanity migration may split into 6 routes; URL convention adapts then.
  href: string;
  website?: string;
  social?: SocialLinks;
  lat?: number;
  lng?: number;
  address?: string;
  startedAt?: string;
  endedAt?: string;
  hours?: string;
  price?: string;
  parking?: string;
  category: Category;
  subcategory?: Subcategory;
  tags?: string[];
  status: EntryStatus;
  trustLevel: TrustLevel;
  heroImage?: string;
  heroAlt?: string;
  // Provenance link proving the entry is real, plus a short human label
  // (e.g. "Firmy.cz", "Vlastní web", "mapy.cz"). Rendered as a "Zdroj" link.
  sourceUrl?: string;
  sourceLabel?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Civic membership flag: TRUE means this entry sits in Krhanice or one
  // of its osady (Prosechov, Brejlov, Závist). Used by the distance tier
  // filter -- "Jen Krhanice" only shows entries where inVillage === true,
  // independent of haversine math (the village boundary is fuzzy and a
  // pure radius from náves would mis-classify some osady). For tiers
  // "do 7 km" and "do 15 km" the flag is OR-combined with haversine, so
  // every in-village entry stays visible at any tier even if it has no
  // lat/lng (e.g. a craftsman without a fixed pin). Editor sets this
  // explicitly in Sanity Studio; in this hardcoded wireframe phase the
  // flag is pre-populated for entries whose address points to one of
  // the village settlements.
  inVillage?: boolean;
  // Curator's pick for the "Vše" landing's selected sections.
  featured?: boolean;
  // Cross-references for the "split into two records" pattern (e.g. Hrnčířka
  // prodejna + workshop). Populated where applicable. Sanity will use a
  // proper reference[] field; here we just store ids.
  relatedEntries?: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  href: string;
  category: "urad" | "zastupitelstvo" | "odpady" | "doprava" | "kultura" | "jine";
}

// Náves Krhanic, default mapový střed pro fitBounds + sort by distance.
// Source: Wikipedia coords API + OSM Photon (49.856082, 14.557414).
export const KRHANICE_CENTER = { lat: 49.8561, lng: 14.5574 };

// ─────────────────────────────────────────────────────────────────────────────
// Type labels
// ─────────────────────────────────────────────────────────────────────────────

export const typeLabels: Record<EntryType, string> = {
  akce: "Akce",
  mista: "Místo",
  gastro: "Gastro",
  obchody: "Obchod",
  sluzby: "Služba",
  spolky: "Spolek",
};

// Plural section names used by navigation pills and section page titles.
export const typeNavLabels: Record<EntryType, string> = {
  akce: "Akce",
  mista: "Místa",
  gastro: "Gastro",
  obchody: "Obchody",
  sluzby: "Služby",
  spolky: "Spolky",
};

// Display order on filter pills and listings.
export const typeOrder: EntryType[] = [
  "akce",
  "mista",
  "gastro",
  "obchody",
  "sluzby",
  "spolky",
];

// ─────────────────────────────────────────────────────────────────────────────
// Category catalog -- single source of truth for (type, slug) → label.
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryDef {
  type: EntryType;
  slug: Category;
  label: string;
}

export const categoryDefs: CategoryDef[] = [
  // AKCE -- "Komunita" was dropped per the spec's open question #1.
  { type: "akce", slug: "kultura", label: "Kultura" },
  { type: "akce", slug: "sport", label: "Sport" },
  { type: "akce", slug: "zabava", label: "Zábava" },
  { type: "akce", slug: "priroda", label: "Příroda" },
  { type: "akce", slug: "deti-rodina", label: "Děti a rodina" },
  { type: "akce", slug: "vzdelavani", label: "Vzdělávání" },

  // MÍSTA
  { type: "mista", slug: "priroda-krajina", label: "Příroda a krajina" },
  { type: "mista", slug: "pamatky", label: "Památky" },
  { type: "mista", slug: "kultura", label: "Kultura" },
  { type: "mista", slug: "sport", label: "Sport" },
  { type: "mista", slug: "rekreace", label: "Rekreace" },
  { type: "mista", slug: "prakticka-mista", label: "Praktická místa" },

  // GASTRO
  { type: "gastro", slug: "restaurace", label: "Restaurace" },
  { type: "gastro", slug: "hospody-bary", label: "Hospody a bary" },
  { type: "gastro", slug: "kavarny-cukrarny", label: "Kavárny a cukrárny" },
  { type: "gastro", slug: "rychle-obcerstveni", label: "Rychlé občerstvení" },
  { type: "gastro", slug: "catering-doruceni", label: "Catering a doručování" },

  // OBCHODY
  { type: "obchody", slug: "potraviny-napoje", label: "Potraviny a nápoje" },
  { type: "obchody", slug: "pekarstvi-cukrarstvi", label: "Pekařství a cukrářství" },
  { type: "obchody", slug: "moda", label: "Móda" },
  { type: "obchody", slug: "pro-domov", label: "Pro domov" },
  { type: "obchody", slug: "hobby-volny-cas", label: "Hobby a volný čas" },
  { type: "obchody", slug: "specializovane", label: "Specializované" },

  // SLUŽBY
  { type: "sluzby", slug: "bydleni-stavba", label: "Bydlení a stavba" },
  { type: "sluzby", slug: "auto-doprava", label: "Auto a doprava" },
  { type: "sluzby", slug: "krasa-pece", label: "Krása a péče" },
  { type: "sluzby", slug: "zdravi", label: "Zdraví" },
  { type: "sluzby", slug: "vzdelavani", label: "Vzdělávání" },
  { type: "sluzby", slug: "profesni-financni", label: "Profesní a finanční" },
  { type: "sluzby", slug: "pro-domacnost-ostatni", label: "Pro domácnost a ostatní" },

  // SPOLKY
  { type: "spolky", slug: "sport", label: "Sport" },
  { type: "spolky", slug: "kultura-umeni", label: "Kultura a umění" },
  { type: "spolky", slug: "mladez", label: "Mládež" },
  { type: "spolky", slug: "tradice-komunita", label: "Tradice a komunita" },
  { type: "spolky", slug: "zajmove", label: "Zájmové" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Subcategory catalog -- (type, category, slug) → label.
// ─────────────────────────────────────────────────────────────────────────────

export interface SubcategoryDef {
  type: EntryType;
  category: Category;
  slug: Subcategory;
  label: string;
}

export const subcategoryDefs: SubcategoryDef[] = [
  // AKCE / kultura
  { type: "akce", category: "kultura", slug: "vystavy", label: "Výstavy" },
  { type: "akce", category: "kultura", slug: "koncerty", label: "Koncerty" },
  { type: "akce", category: "kultura", slug: "divadlo", label: "Divadlo" },
  { type: "akce", category: "kultura", slug: "kino", label: "Kino" },
  { type: "akce", category: "kultura", slug: "prednasky", label: "Přednášky" },
  { type: "akce", category: "kultura", slug: "prohlidky", label: "Prohlídky" },
  { type: "akce", category: "kultura", slug: "besedy-cteni", label: "Besedy a čtení" },
  { type: "akce", category: "kultura", slug: "festivaly", label: "Festivaly" },
  // AKCE / sport
  { type: "akce", category: "sport", slug: "zavody", label: "Závody" },
  { type: "akce", category: "sport", slug: "turnaje", label: "Turnaje" },
  { type: "akce", category: "sport", slug: "treninky", label: "Tréninky" },
  { type: "akce", category: "sport", slug: "cviceni", label: "Cvičení" },
  { type: "akce", category: "sport", slug: "pochody-behy", label: "Pochody a běhy" },
  // AKCE / zabava
  { type: "akce", category: "zabava", slug: "plesy", label: "Plesy" },
  { type: "akce", category: "zabava", slug: "oslavy", label: "Oslavy" },
  { type: "akce", category: "zabava", slug: "jarmarky", label: "Jarmarky" },
  { type: "akce", category: "zabava", slug: "posviceni", label: "Posvícení" },
  { type: "akce", category: "zabava", slug: "tanecni-zabavy", label: "Taneční zábavy" },
  // AKCE / priroda
  { type: "akce", category: "priroda", slug: "vylety", label: "Výlety" },
  { type: "akce", category: "priroda", slug: "brigady", label: "Brigády" },
  { type: "akce", category: "priroda", slug: "sbery", label: "Sběry" },
  { type: "akce", category: "priroda", slug: "sazeni", label: "Sázení" },
  { type: "akce", category: "priroda", slug: "pozorovani", label: "Pozorování" },
  // AKCE / deti-rodina
  { type: "akce", category: "deti-rodina", slug: "detske-dny", label: "Dětské dny" },
  { type: "akce", category: "deti-rodina", slug: "tabory", label: "Tábory" },
  { type: "akce", category: "deti-rodina", slug: "dilny-pro-deti", label: "Dílny pro děti" },
  { type: "akce", category: "deti-rodina", slug: "detska-divadla", label: "Dětská divadla" },
  { type: "akce", category: "deti-rodina", slug: "soutezi", label: "Soutěže" },
  // AKCE / vzdelavani
  { type: "akce", category: "vzdelavani", slug: "kurzy", label: "Kurzy" },
  { type: "akce", category: "vzdelavani", slug: "workshopy", label: "Workshopy" },
  { type: "akce", category: "vzdelavani", slug: "seminare", label: "Semináře" },
  { type: "akce", category: "vzdelavani", slug: "tvurci-dilny", label: "Tvůrčí dílny" },
  { type: "akce", category: "vzdelavani", slug: "exkurze", label: "Exkurze" },

  // MÍSTA / priroda-krajina
  { type: "mista", category: "priroda-krajina", slug: "lesy-stezky", label: "Lesy a stezky" },
  { type: "mista", category: "priroda-krajina", slug: "rybniky-vodni-plochy", label: "Rybníky a vodní plochy" },
  { type: "mista", category: "priroda-krajina", slug: "vyhlidky", label: "Vyhlídky" },
  { type: "mista", category: "priroda-krajina", slug: "naucne-stezky", label: "Naučné stezky" },
  { type: "mista", category: "priroda-krajina", slug: "parky-zahrady", label: "Parky a zahrady" },
  // MÍSTA / pamatky
  { type: "mista", category: "pamatky", slug: "sakralni-stavby", label: "Sakrální stavby" },
  { type: "mista", category: "pamatky", slug: "pomniky-sochy", label: "Pomníky a sochy" },
  { type: "mista", category: "pamatky", slug: "hrady-zamky", label: "Hrady a zámky" },
  { type: "mista", category: "pamatky", slug: "historicke-budovy", label: "Historické budovy" },
  { type: "mista", category: "pamatky", slug: "archeologicke", label: "Archeologické" },
  // MÍSTA / kultura
  { type: "mista", category: "kultura", slug: "muzea", label: "Muzea" },
  { type: "mista", category: "kultura", slug: "galerie", label: "Galerie" },
  { type: "mista", category: "kultura", slug: "knihovny", label: "Knihovny" },
  { type: "mista", category: "kultura", slug: "kulturni-domy", label: "Kulturní domy" },
  { type: "mista", category: "kultura", slug: "divadla-kina", label: "Divadla a kina" },
  // MÍSTA / sport
  { type: "mista", category: "sport", slug: "hriste", label: "Hřiště" },
  { type: "mista", category: "sport", slug: "sportoviste", label: "Sportoviště" },
  { type: "mista", category: "sport", slug: "posilovny", label: "Posilovny" },
  { type: "mista", category: "sport", slug: "telocvicny", label: "Tělocvičny" },
  { type: "mista", category: "sport", slug: "cyklotrasy", label: "Cyklotrasy" },
  { type: "mista", category: "sport", slug: "sjezdovky", label: "Sjezdovky" },
  // MÍSTA / rekreace
  { type: "mista", category: "rekreace", slug: "koupaliste", label: "Koupaliště" },
  { type: "mista", category: "rekreace", slug: "detska-hriste", label: "Dětská hřiště" },
  { type: "mista", category: "rekreace", slug: "piknikova-mista", label: "Pikniková místa" },
  { type: "mista", category: "rekreace", slug: "ohniste", label: "Ohniště" },
  { type: "mista", category: "rekreace", slug: "workout", label: "Workout" },
  // MÍSTA / prakticka-mista
  { type: "mista", category: "prakticka-mista", slug: "urady", label: "Úřady" },
  { type: "mista", category: "prakticka-mista", slug: "posta", label: "Pošta" },
  { type: "mista", category: "prakticka-mista", slug: "nadrazi-zastavky", label: "Nádraží a zastávky" },
  { type: "mista", category: "prakticka-mista", slug: "parkoviste", label: "Parkoviště" },
  { type: "mista", category: "prakticka-mista", slug: "hrbitov", label: "Hřbitov" },
  { type: "mista", category: "prakticka-mista", slug: "sberny-dvur", label: "Sběrný dvůr" },

  // GASTRO / restaurace
  { type: "gastro", category: "restaurace", slug: "ceska-kuchyne", label: "Česká kuchyně" },
  { type: "gastro", category: "restaurace", slug: "italska", label: "Italská" },
  { type: "gastro", category: "restaurace", slug: "asijska", label: "Asijská" },
  { type: "gastro", category: "restaurace", slug: "mezinarodni", label: "Mezinárodní" },
  { type: "gastro", category: "restaurace", slug: "vegetarianska-vegan", label: "Vegetariánská a vegan" },
  { type: "gastro", category: "restaurace", slug: "pizzerie", label: "Pizzerie" },
  // GASTRO / hospody-bary
  { type: "gastro", category: "hospody-bary", slug: "pivnice", label: "Pivnice" },
  { type: "gastro", category: "hospody-bary", slug: "bary", label: "Bary" },
  { type: "gastro", category: "hospody-bary", slug: "vinoteky", label: "Vinotéky" },
  { type: "gastro", category: "hospody-bary", slug: "pivovary-minipivovary", label: "Pivovary a minipivovary" },
  // GASTRO / kavarny-cukrarny
  { type: "gastro", category: "kavarny-cukrarny", slug: "kavarny", label: "Kavárny" },
  { type: "gastro", category: "kavarny-cukrarny", slug: "cukrarny", label: "Cukrárny" },
  { type: "gastro", category: "kavarny-cukrarny", slug: "cajovny", label: "Čajovny" },
  { type: "gastro", category: "kavarny-cukrarny", slug: "zmrzlinarny", label: "Zmrzlinárny" },
  // GASTRO / rychle-obcerstveni
  { type: "gastro", category: "rychle-obcerstveni", slug: "bistra", label: "Bistra" },
  { type: "gastro", category: "rychle-obcerstveni", slug: "stanky", label: "Stánky" },
  { type: "gastro", category: "rychle-obcerstveni", slug: "foodtrucky", label: "Foodtrucky" },
  { type: "gastro", category: "rychle-obcerstveni", slug: "s-sebou", label: "S sebou" },
  // GASTRO / catering-doruceni
  { type: "gastro", category: "catering-doruceni", slug: "catering-akce", label: "Catering na akce" },
  { type: "gastro", category: "catering-doruceni", slug: "donaskova-sluzba", label: "Donášková služba" },
  { type: "gastro", category: "catering-doruceni", slug: "poledni-menu", label: "Polední menu" },

  // OBCHODY / potraviny-napoje
  { type: "obchody", category: "potraviny-napoje", slug: "samoobsluhy", label: "Samoobsluhy" },
  { type: "obchody", category: "potraviny-napoje", slug: "reznictvi", label: "Řeznictví" },
  { type: "obchody", category: "potraviny-napoje", slug: "syrarny", label: "Sýrárny" },
  { type: "obchody", category: "potraviny-napoje", slug: "vinoteky", label: "Vinotéky" },
  { type: "obchody", category: "potraviny-napoje", slug: "regionalni-produkty", label: "Regionální produkty" },
  { type: "obchody", category: "potraviny-napoje", slug: "bio", label: "Bio" },
  // OBCHODY / pekarstvi-cukrarstvi
  { type: "obchody", category: "pekarstvi-cukrarstvi", slug: "pekarny", label: "Pekárny" },
  { type: "obchody", category: "pekarstvi-cukrarstvi", slug: "cukrarny-prodejna", label: "Cukrárny" },
  // OBCHODY / moda
  { type: "obchody", category: "moda", slug: "odevy", label: "Oděvy" },
  { type: "obchody", category: "moda", slug: "obuv", label: "Obuv" },
  { type: "obchody", category: "moda", slug: "doplnky-sperky", label: "Doplňky a šperky" },
  // OBCHODY / pro-domov
  { type: "obchody", category: "pro-domov", slug: "nabytek", label: "Nábytek" },
  { type: "obchody", category: "pro-domov", slug: "dekorace", label: "Dekorace" },
  { type: "obchody", category: "pro-domov", slug: "drogerie", label: "Drogerie" },
  { type: "obchody", category: "pro-domov", slug: "kvetinarstvi", label: "Květinářství" },
  { type: "obchody", category: "pro-domov", slug: "naradi", label: "Nářadí" },
  { type: "obchody", category: "pro-domov", slug: "stavebniny", label: "Stavebniny" },
  { type: "obchody", category: "pro-domov", slug: "zahradnictvi", label: "Zahradnictví" },
  // OBCHODY / hobby-volny-cas
  { type: "obchody", category: "hobby-volny-cas", slug: "sportovni-potreby", label: "Sportovní potřeby" },
  { type: "obchody", category: "hobby-volny-cas", slug: "hracky", label: "Hračky" },
  { type: "obchody", category: "hobby-volny-cas", slug: "knihy", label: "Knihy" },
  { type: "obchody", category: "hobby-volny-cas", slug: "papirnictvi", label: "Papírnictví" },
  { type: "obchody", category: "hobby-volny-cas", slug: "darky", label: "Dárky" },
  { type: "obchody", category: "hobby-volny-cas", slug: "hudebni-nastroje", label: "Hudební nástroje" },
  // OBCHODY / specializovane
  { type: "obchody", category: "specializovane", slug: "lekarna", label: "Lékárna" },
  { type: "obchody", category: "specializovane", slug: "optika", label: "Optika" },
  { type: "obchody", category: "specializovane", slug: "keramika-remeslo", label: "Keramika a řemeslo" },
  { type: "obchody", category: "specializovane", slug: "galanterie", label: "Galanterie" },
  { type: "obchody", category: "specializovane", slug: "starozitnosti", label: "Starožitnosti" },
  { type: "obchody", category: "specializovane", slug: "farmarske-trhy", label: "Farmářské trhy" },

  // SLUŽBY / bydleni-stavba
  { type: "sluzby", category: "bydleni-stavba", slug: "instalater", label: "Instalatér" },
  { type: "sluzby", category: "bydleni-stavba", slug: "elektrikar", label: "Elektrikář" },
  { type: "sluzby", category: "bydleni-stavba", slug: "zednik", label: "Zedník" },
  { type: "sluzby", category: "bydleni-stavba", slug: "malir", label: "Malíř" },
  { type: "sluzby", category: "bydleni-stavba", slug: "klempir", label: "Klempíř" },
  { type: "sluzby", category: "bydleni-stavba", slug: "kominik", label: "Kominík" },
  { type: "sluzby", category: "bydleni-stavba", slug: "plynar", label: "Plynař" },
  { type: "sluzby", category: "bydleni-stavba", slug: "stavebni-firmy", label: "Stavební firmy" },
  { type: "sluzby", category: "bydleni-stavba", slug: "podlahari", label: "Podlaháři" },
  { type: "sluzby", category: "bydleni-stavba", slug: "sklenari", label: "Sklenáři" },
  // SLUŽBY / auto-doprava
  { type: "sluzby", category: "auto-doprava", slug: "autoservis", label: "Autoservis" },
  { type: "sluzby", category: "auto-doprava", slug: "pneuservis", label: "Pneuservis" },
  { type: "sluzby", category: "auto-doprava", slug: "stk", label: "STK" },
  { type: "sluzby", category: "auto-doprava", slug: "taxi", label: "Taxi" },
  { type: "sluzby", category: "auto-doprava", slug: "autoskola", label: "Autoškola" },
  { type: "sluzby", category: "auto-doprava", slug: "pujcovna-aut", label: "Půjčovna aut" },
  { type: "sluzby", category: "auto-doprava", slug: "odtah", label: "Odtah" },
  // SLUŽBY / krasa-pece
  { type: "sluzby", category: "krasa-pece", slug: "kadernictvi", label: "Kadeřnictví" },
  { type: "sluzby", category: "krasa-pece", slug: "kosmetika", label: "Kosmetika" },
  { type: "sluzby", category: "krasa-pece", slug: "manikura", label: "Manikúra" },
  { type: "sluzby", category: "krasa-pece", slug: "pedikura", label: "Pedikúra" },
  { type: "sluzby", category: "krasa-pece", slug: "masaze", label: "Masáže" },
  { type: "sluzby", category: "krasa-pece", slug: "solarium", label: "Solárium" },
  { type: "sluzby", category: "krasa-pece", slug: "tetovani", label: "Tetování" },
  // SLUŽBY / zdravi
  { type: "sluzby", category: "zdravi", slug: "prakticky-lekar", label: "Praktický lékař" },
  { type: "sluzby", category: "zdravi", slug: "zubar", label: "Zubař" },
  { type: "sluzby", category: "zdravi", slug: "pediatr", label: "Pediatr" },
  { type: "sluzby", category: "zdravi", slug: "gynekolog", label: "Gynekolog" },
  { type: "sluzby", category: "zdravi", slug: "fyzioterapie", label: "Fyzioterapie" },
  { type: "sluzby", category: "zdravi", slug: "veterinar", label: "Veterinář" },
  { type: "sluzby", category: "zdravi", slug: "psycholog", label: "Psycholog" },
  // SLUŽBY / vzdelavani
  { type: "sluzby", category: "vzdelavani", slug: "materska-skola", label: "Mateřská škola" },
  { type: "sluzby", category: "vzdelavani", slug: "zakladni-skola", label: "Základní škola" },
  { type: "sluzby", category: "vzdelavani", slug: "hudebni-skola", label: "Hudební škola" },
  { type: "sluzby", category: "vzdelavani", slug: "jazykovka", label: "Jazykovka" },
  { type: "sluzby", category: "vzdelavani", slug: "doucovani", label: "Doučování" },
  { type: "sluzby", category: "vzdelavani", slug: "kurzy", label: "Kurzy" },
  // SLUŽBY / profesni-financni
  { type: "sluzby", category: "profesni-financni", slug: "advokat", label: "Advokát" },
  { type: "sluzby", category: "profesni-financni", slug: "notar", label: "Notář" },
  { type: "sluzby", category: "profesni-financni", slug: "ucetni", label: "Účetní" },
  { type: "sluzby", category: "profesni-financni", slug: "realitka", label: "Realitka" },
  { type: "sluzby", category: "profesni-financni", slug: "pojistovna", label: "Pojišťovna" },
  { type: "sluzby", category: "profesni-financni", slug: "banka", label: "Banka" },
  { type: "sluzby", category: "profesni-financni", slug: "danovy-poradce", label: "Daňový poradce" },
  // SLUŽBY / pro-domacnost-ostatni
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "uklid", label: "Úklid" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "pradelna", label: "Prádelna" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "hodinar", label: "Hodinář" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "foto", label: "Foto" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "it-web", label: "IT a web" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "svatebni-agentura", label: "Svatební agentura" },
  { type: "sluzby", category: "pro-domacnost-ostatni", slug: "pohrebni-sluzba", label: "Pohřební služba" },

  // SPOLKY / sport
  { type: "spolky", category: "sport", slug: "fotbal", label: "Fotbal" },
  { type: "spolky", category: "sport", slug: "hokej", label: "Hokej" },
  { type: "spolky", category: "sport", slug: "tenis", label: "Tenis" },
  { type: "spolky", category: "sport", slug: "sokol", label: "Sokol" },
  { type: "spolky", category: "sport", slug: "sachy", label: "Šachy" },
  { type: "spolky", category: "sport", slug: "bojove-sporty", label: "Bojové sporty" },
  { type: "spolky", category: "sport", slug: "ostatni-sport", label: "Ostatní" },
  // SPOLKY / kultura-umeni
  { type: "spolky", category: "kultura-umeni", slug: "pevecky", label: "Pěvecký" },
  { type: "spolky", category: "kultura-umeni", slug: "divadelni", label: "Divadelní" },
  { type: "spolky", category: "kultura-umeni", slug: "tanecni", label: "Taneční" },
  { type: "spolky", category: "kultura-umeni", slug: "hudebni", label: "Hudební" },
  { type: "spolky", category: "kultura-umeni", slug: "fotograficky", label: "Fotografický" },
  { type: "spolky", category: "kultura-umeni", slug: "vytvarny", label: "Výtvarný" },
  // SPOLKY / mladez
  { type: "spolky", category: "mladez", slug: "skauti-junak", label: "Skauti / Junák" },
  { type: "spolky", category: "mladez", slug: "pionyr", label: "Pionýr" },
  { type: "spolky", category: "mladez", slug: "detske-oddily", label: "Dětské oddíly" },
  { type: "spolky", category: "mladez", slug: "ymca", label: "YMCA" },
  // SPOLKY / tradice-komunita
  { type: "spolky", category: "tradice-komunita", slug: "hasicsky-sbor", label: "Hasičský sbor" },
  { type: "spolky", category: "tradice-komunita", slug: "myslivecky", label: "Myslivecký" },
  { type: "spolky", category: "tradice-komunita", slug: "sousedsky", label: "Sousedský" },
  { type: "spolky", category: "tradice-komunita", slug: "vlastenecky", label: "Vlastenecký" },
  // SPOLKY / zajmove
  { type: "spolky", category: "zajmove", slug: "zahradkari", label: "Zahrádkáři" },
  { type: "spolky", category: "zajmove", slug: "chovatele", label: "Chovatelé" },
  { type: "spolky", category: "zajmove", slug: "modelari", label: "Modeláři" },
  { type: "spolky", category: "zajmove", slug: "klub-senioru", label: "Klub seniorů" },
  { type: "spolky", category: "zajmove", slug: "vcelari", label: "Včelaři" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tag catalog -- shared faceted vocabulary (level 4). Each tag declares which
// forms it makes sense for via applicableForms.
// ─────────────────────────────────────────────────────────────────────────────

export type TagGroup =
  | "audience"
  | "accessibility"
  | "place-weather"
  | "theme"
  | "price-entry"
  | "gastro";

export interface TagDef {
  slug: string;
  label: string;
  group: TagGroup;
  applicableForms: EntryType[];
}

export const tagDefs: TagDef[] = [
  // Audience
  // Pro děti: spec original allowed everything except spolky. Extended to
  // spolky for youth-oriented organizations (Mažoretky Hraběnky, TAEKWON-DO).
  { slug: "pro-deti", label: "Pro děti", group: "audience", applicableForms: ["akce", "mista", "gastro", "obchody", "sluzby", "spolky"] },
  { slug: "pro-rodiny", label: "Pro rodiny", group: "audience", applicableForms: ["akce", "mista", "gastro"] },
  { slug: "pro-seniory", label: "Pro seniory", group: "audience", applicableForms: ["akce", "mista", "sluzby"] },
  { slug: "pro-pary", label: "Pro páry", group: "audience", applicableForms: ["akce", "mista", "gastro"] },
  { slug: "pro-skupiny", label: "Pro skupiny", group: "audience", applicableForms: ["akce", "mista", "gastro"] },
  // Accessibility
  { slug: "bezbarierove", label: "Bezbariérové", group: "accessibility", applicableForms: ["mista", "gastro", "obchody", "sluzby"] },
  { slug: "pejskari-vitani", label: "Pejskaři vítáni", group: "accessibility", applicableForms: ["mista", "gastro"] },
  { slug: "parkovani", label: "Parkování", group: "accessibility", applicableForms: ["mista", "gastro", "obchody", "sluzby"] },
  { slug: "wifi-zdarma", label: "WiFi zdarma", group: "accessibility", applicableForms: ["gastro", "mista"] },
  // Place + weather
  { slug: "venku", label: "Venku", group: "place-weather", applicableForms: ["akce", "mista"] },
  { slug: "pod-strechou", label: "Pod střechou", group: "place-weather", applicableForms: ["akce", "mista"] },
  { slug: "sezonni", label: "Sezónní", group: "place-weather", applicableForms: ["akce", "mista", "gastro"] },
  { slug: "celorocni", label: "Celoroční", group: "place-weather", applicableForms: ["akce", "mista"] },
  { slug: "v-centru", label: "V centru", group: "place-weather", applicableForms: ["mista", "gastro", "obchody", "sluzby"] },
  { slug: "mimo-obec", label: "Mimo obec", group: "place-weather", applicableForms: ["mista"] },
  // Theme + content
  { slug: "historie", label: "Historie", group: "theme", applicableForms: ["akce", "mista"] },
  // Tradice: spec original allowed akce/mista/spolky. Extended to obchody for
  // family-run shops (e.g. JARNO pekárna, since 1996).
  { slug: "tradice", label: "Tradice", group: "theme", applicableForms: ["akce", "mista", "spolky", "obchody"] },
  { slug: "priroda", label: "Příroda", group: "theme", applicableForms: ["akce", "mista"] },
  { slug: "naucne", label: "Naučné", group: "theme", applicableForms: ["akce", "mista"] },
  { slug: "veda-technika", label: "Věda a technika", group: "theme", applicableForms: ["akce", "mista"] },
  { slug: "hudba", label: "Hudba", group: "theme", applicableForms: ["akce", "mista", "spolky"] },
  { slug: "vytvarne", label: "Výtvarné", group: "theme", applicableForms: ["akce", "mista", "obchody", "spolky"] },
  { slug: "literatura", label: "Literatura", group: "theme", applicableForms: ["akce", "mista"] },
  // Řemeslo: spec original allowed akce/obchody/spolky. Extended to sluzby for
  // specialized craft services (e.g. opravy věžních hodin).
  { slug: "remeslo", label: "Řemeslo", group: "theme", applicableForms: ["akce", "obchody", "spolky", "sluzby"] },
  // Regionální produkt + bio/eko: spec original allowed gastro/obchody.
  // Extended to akce for events spotlighting local/fair-trade products
  // (Férová snídaně, Tržiště v Zaječí).
  { slug: "regionalni-produkt", label: "Regionální produkt", group: "theme", applicableForms: ["gastro", "obchody", "akce"] },
  { slug: "bio-eko", label: "Bio / eko", group: "theme", applicableForms: ["gastro", "obchody", "akce"] },
  { slug: "lokalni-vyroba", label: "Lokální výroba", group: "theme", applicableForms: ["obchody"] },
  // Price + entry
  { slug: "vstup-zdarma", label: "Vstup zdarma", group: "price-entry", applicableForms: ["akce", "mista"] },
  { slug: "placene", label: "Placené", group: "price-entry", applicableForms: ["akce"] },
  { slug: "rezervace-nutna", label: "Rezervace nutná", group: "price-entry", applicableForms: ["akce", "gastro", "sluzby"] },
  { slug: "darkovy-poukaz", label: "Dárkový poukaz", group: "price-entry", applicableForms: ["gastro", "sluzby"] },
  // Gastro-specific
  { slug: "vegetarianske", label: "Vegetariánské", group: "gastro", applicableForms: ["gastro"] },
  { slug: "veganske", label: "Veganské", group: "gastro", applicableForms: ["gastro"] },
  { slug: "bezlepkove", label: "Bezlepkové", group: "gastro", applicableForms: ["gastro"] },
  { slug: "poledni-menu-tag", label: "Polední menu", group: "gastro", applicableForms: ["gastro"] },
  { slug: "snidane", label: "Snídaně", group: "gastro", applicableForms: ["gastro"] },
  { slug: "brunch", label: "Brunch", group: "gastro", applicableForms: ["gastro"] },
  { slug: "donaska", label: "Donáška", group: "gastro", applicableForms: ["gastro"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Convenience lookups -- O(N) but the catalogs are small and lookups happen
// in render paths. If profiling reveals hotspots, swap to Map<string, *>.
// ─────────────────────────────────────────────────────────────────────────────

export function getCategoryLabel(type: EntryType, slug: Category): string {
  return categoryDefs.find((c) => c.type === type && c.slug === slug)?.label ?? slug;
}

export function getSubcategoryLabel(
  type: EntryType,
  category: Category,
  slug: Subcategory,
): string {
  return (
    subcategoryDefs.find(
      (s) => s.type === type && s.category === category && s.slug === slug,
    )?.label ?? slug
  );
}

export function getTagLabel(slug: string): string {
  return tagDefs.find((t) => t.slug === slug)?.label ?? slug;
}

// Categories visible after picking a type pill. Order follows the categoryDefs
// declaration order (which mirrors the spec doc).
export const categoriesForType: Record<EntryType, Category[]> = {
  akce: categoryDefs.filter((c) => c.type === "akce").map((c) => c.slug),
  mista: categoryDefs.filter((c) => c.type === "mista").map((c) => c.slug),
  gastro: categoryDefs.filter((c) => c.type === "gastro").map((c) => c.slug),
  obchody: categoryDefs.filter((c) => c.type === "obchody").map((c) => c.slug),
  sluzby: categoryDefs.filter((c) => c.type === "sluzby").map((c) => c.slug),
  spolky: categoryDefs.filter((c) => c.type === "spolky").map((c) => c.slug),
};

// Subcategories visible after picking (type, category). Used by the level-3
// pill row in SectionView. Empty array when the category has no subs (UI
// hides the row and goes straight to tags).
export function subcategoriesFor(
  type: EntryType,
  category: Category,
): Array<{ slug: Subcategory; label: string }> {
  return subcategoryDefs
    .filter((s) => s.type === type && s.category === category)
    .map((s) => ({ slug: s.slug, label: s.label }));
}

// ─────────────────────────────────────────────────────────────────────────────
// AKTUALITY OBCE (news) -- 8 entries, real data scraped from obeckrhanice.cz
// (2026-05-04). Texts lightly edited for active voice + Krhanický Proud tone.
// ─────────────────────────────────────────────────────────────────────────────
export const news: NewsItem[] = [
  {
    id: "n-den-zeme-2026",
    slug: "22duben-den-zeme",
    title: "22. duben, Den Země",
    description:
      "Starosta Aleš Papoušek shrnuje, jak obec dlouhodobě snižuje množství komunálního odpadu díky aktivnímu třídění a rozšíření sběrných míst. Krhanice obhájily stříbrný certifikát Ekologická obec za rok 2025, pokračují úklidy Čistá řeka Sázava i stavba zábran pro přechod žab přes silnici.",
    date: "2026-04-22",
    href: "/urad/22duben-den-zeme",
    category: "kultura",
  },
  {
    id: "n-kanalizace-cov-2026",
    slug: "informace-o-akci-krhanice-kanalizace-a-cov-i-etapa",
    title: "Krhanice, kanalizace a ČOV: I. etapa odstartovala",
    description:
      "Obec spouští projektovou přípravu kanalizace a čistírny odpadních vod ve spolupráci s firmou Projekty Vodam. Příprava potrvá zhruba 40 týdnů od poloviny března 2026, financování pokryje obec kombinací dotace, státní půjčky a úvěru.",
    date: "2026-03-11",
    href: "/urad/informace-o-akci-krhanice-kanalizace-a-cov-i-etapa",
    category: "urad",
  },
  {
    id: "n-komposter-2026",
    slug: "neuvazujete-nad-porizenim-noveho-komposteru",
    title: "Pořiďte si kompostér s příspěvkem obce",
    description:
      "Obec poskytuje občanům s trvalým pobytem příspěvek až 2 000 Kč na pořízení kompostéru o objemu od 600 litrů. Pro rok 2026 je vyčleněno 30 000 Kč. Stačí předložit fakturu a doklad o zaplacení do 16. prosince 2026.",
    date: "2026-03-10",
    href: "/urad/neuvazujete-nad-porizenim-noveho-komposteru",
    category: "odpady",
  },
  {
    id: "n-bioodpad-2026",
    slug: "zahajeni-svozu-bioodpadu-2026-ze-zahrad-a-domacnosti",
    title: "Svoz bioodpadu 2026 ze zahrad a domácností",
    description:
      "Hnědé kontejnery na bioodpad jsou od 9. března 2026 přistavené v obci, vyvážejí se každé pondělí. Modrý velkoobjemový kontejner rotuje mezi stanovišti v Krhanicích (náves U křížku, víceúčelové hřiště u školy) a v Prosečnici od 9. března do 13. dubna.",
    date: "2026-03-10",
    href: "/urad/zahajeni-svozu-bioodpadu-2026-ze-zahrad-a-domacnosti",
    category: "odpady",
  },
  {
    id: "n-svoz-popelnic-2026",
    slug: "svoz-popelnic-jiz-na-novou-znamku-2026",
    title: "Svoz popelnic už jen na novou známku 2026",
    description:
      "Od úterý 3. března 2026 svoz popelnic probíhá pouze na novou známku pro rok 2026. Místostarosta Jaroslav Mixa žádá o vylepení nové známky a odstranění starých.",
    date: "2026-03-02",
    href: "/urad/svoz-popelnic-jiz-na-novou-znamku-2026",
    category: "odpady",
  },
  {
    id: "n-senior-taxi-2026",
    slug: "senior-taxi-a-rehabilitace-taxi-pokracuje-i-v-roce-2026",
    title: "Senior taxi a rehabilitace taxi pokračují i v roce 2026",
    description:
      "Služba pro občany s trvalým pobytem v Krhanicích od 65 let. Jízdy k lékaři a na rehabilitaci do Týnce nad Sázavou (25 Kč) nebo Benešova (50 Kč). Maximálně 6 jízd měsíčně, doprovod jede zdarma. Objednávky v pracovních dnech 6:00 až 17:00 na 739 701 246.",
    date: "2025-12-30",
    href: "/urad/senior-taxi-a-rehabilitace-taxi-pokracuje-i-v-roce-2026",
    category: "doprava",
  },
  {
    id: "n-pyrotechnika-2025",
    slug: "prisnejsi-pravidla-pro-pyrotechniku-od-1-prosince",
    title: "Přísnější pravidla pro pyrotechniku od 1. prosince",
    description:
      "Od 1. prosince 2025 platí novela zákona o pyrotechnických výrobcích. Stánky a trhy už pyrotechniku prodávat nesmějí, ohňostroje jsou zakázané v pásmu 250 metrů od nemocnic, útulků, zoo a chovů. Zastupitelstvo Krhanice schválilo 12. prosince 2025 vlastní obecně závaznou vyhlášku.",
    date: "2025-12-19",
    href: "/urad/prisnejsi-pravidla-pro-pyrotechniku-od-1-prosince",
    category: "urad",
  },
  {
    id: "n-vypnuti-elektriny",
    slug: "jak-zjistite-planovane-vypnuti-vasi-nemovitosti-od-elektrickeho-proudu",
    title: "Jak zjistíte plánované vypnutí elektřiny",
    description:
      "ČEZ Distribuce už delší dobu nezveřejňuje informace o odstávkách na sloupech vedení. Plánované odstávky najdete v sekci Důležité informace na webu obce, případně po registraci v systému ČEZ Distribuce.",
    date: "2023-02-14",
    href: "/urad/jak-zjistite-planovane-vypnuti-vasi-nemovitosti-od-elektrickeho-proudu",
    category: "urad",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: filter, sort, search.
// ─────────────────────────────────────────────────────────────────────────────

// Past events are hidden (per SPEC: archive after ended_at + 1 day).
// Static entries (mista/gastro/obchody/sluzby/spolky without startedAt) are
// always passed through.
export function filterByTimeWindow(
  list: Entry[],
  windowStart: Date,
  windowEnd: Date,
): Entry[] {
  return list.filter((e) => {
    if (e.type !== "akce") return true;
    if (!e.startedAt) return true;
    const start = new Date(e.startedAt);
    const end = e.endedAt ? new Date(e.endedAt) : start;
    return end >= windowStart && start <= windowEnd;
  });
}

// Single-select category filter. Category slug is unique within a type, so
// filtering by category alone may match across types -- callers should pair
// it with filterByType when scope is fixed.
export function filterByCategory(list: Entry[], cat: Category | null): Entry[] {
  if (!cat) return list;
  return list.filter((e) => e.category === cat);
}

// Single-select subcategory filter. Pass null to skip.
export function filterBySubcategory(
  list: Entry[],
  sub: Subcategory | null,
): Entry[] {
  if (!sub) return list;
  return list.filter((e) => e.subcategory === sub);
}

// Multi-select tag filter using INTERSECTION (AND).
export function filterByTagsIntersection(
  list: Entry[],
  activeTags: string[],
): Entry[] {
  if (activeTags.length === 0) return list;
  return list.filter((e) =>
    activeTags.every((tag) => (e.tags ?? []).includes(tag)),
  );
}

export function filterByType(list: Entry[], types: EntryType[]): Entry[] {
  if (types.length === 0) return list;
  return list.filter((e) => types.includes(e.type));
}

export function sortByStart(list: Entry[]): Entry[] {
  return [...list].sort((a, b) => {
    const ta = a.startedAt ? new Date(a.startedAt).getTime() : Infinity;
    const tb = b.startedAt ? new Date(b.startedAt).getTime() : Infinity;
    return ta - tb;
  });
}

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function sortByDistance(
  list: Entry[],
  center: { lat: number; lng: number } = KRHANICE_CENTER,
): Entry[] {
  return [...list].sort((a, b) => {
    const aHas = a.lat !== undefined && a.lng !== undefined;
    const bHas = b.lat !== undefined && b.lng !== undefined;
    if (aHas && bHas) {
      return (
        haversineKm({ lat: a.lat!, lng: a.lng! }, center) -
        haversineKm({ lat: b.lat!, lng: b.lng! }, center)
      );
    }
    if (aHas) return -1;
    if (bHas) return 1;
    return 0;
  });
}

// Distance tier filter. Three tiers, narrow to wide:
//   - "krhanice": only entries explicitly tagged inVillage. Pure civic
//                 membership, no haversine. An entry without lat/lng but
//                 marked inVillage stays visible (e.g. a Krhanice-based
//                 craftsman with no fixed shop pin).
//   - "blizko":   inVillage OR within 7 km of náves. Walking + short
//                 drive distance. The "neighborhood" radius (Týnec,
//                 Bukovany, Prosechov-via-radius, Krusičany).
//   - "region":   inVillage OR within 15 km of náves. The Posázaví
//                 regional radius the project mission scopes to.
// Tiers are cumulative: the wider tier shows everything the narrower
// tier shows, plus more. Default tier on /pruvodce is "blizko".
export type DistanceTier = "krhanice" | "blizko" | "region";

export const DEFAULT_DISTANCE_TIER: DistanceTier = "blizko";

export const distanceTierLabels: Record<DistanceTier, string> = {
  krhanice: "Jen Krhanice",
  blizko: "Do 7 km",
  region: "Do 15 km",
};

// Display order: narrow to wide. Mirrors how the user thinks about
// expanding scope ("nejdřív obec, pak okolí, pak region").
export const distanceTierOrder: DistanceTier[] = [
  "krhanice",
  "blizko",
  "region",
];

const TIER_RADIUS_KM: Record<DistanceTier, number> = {
  krhanice: 0, // sentinel, never used (in-village is checked separately)
  blizko: 7,
  region: 15,
};

export function entryMatchesTier(entry: Entry, tier: DistanceTier): boolean {
  // In-village always wins, at every tier. Tier "krhanice" is the only
  // tier that REQUIRES this flag.
  if (entry.inVillage === true) return true;
  if (tier === "krhanice") return false;

  // For tiers blizko / region we need coordinates. Entries without
  // lat/lng (and without inVillage) drop out of these tiers -- they
  // have no testable location.
  if (entry.lat === undefined || entry.lng === undefined) return false;

  const km = haversineKm(
    { lat: entry.lat, lng: entry.lng },
    KRHANICE_CENTER,
  );
  return km <= TIER_RADIUS_KM[tier];
}

// Strip Czech diacritics + lowercase. Used for both haystack and needle so
// search works regardless of how the user types ("hospoda" vs "hospódá").
export function unaccent(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function filterByText(list: Entry[], query: string): Entry[] {
  const q = unaccent(query.trim());
  if (!q) return list;
  return list.filter((e) => {
    const haystack = [
      e.title,
      e.description,
      e.organizer ?? "",
      ...(e.tags ?? []),
      getCategoryLabel(e.type, e.category),
      e.subcategory
        ? getSubcategoryLabel(e.type, e.category, e.subcategory)
        : "",
    ]
      .map(unaccent)
      .join(" ");
    return haystack.includes(q);
  });
}
