// Hardcoded demo data for Phase 2 wireframe.
// Mirrors the 4-level taxonomy spec (TYP → KATEGORIE → PODKATEGORIE → ŠTÍTKY)
// from _in/krhanicky-pruvodce-taxonomie.md (v1.0, 2026-05-05).
// Real Posázaví locations + events scraped 2026-05-03 from obeckrhanice.cz
// and tourist.posazavi.com.
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
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
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
// AKCE -- 28 entries
//   * Lokální Krhanické tradice (SDH, TJ Sokol, kulturní komise)
//   * Reálné regionální akce scrapnuté 2026-05-04 z mestotynec.cz a
//     tourist.posazavi.com (15 km radius)
// ─────────────────────────────────────────────────────────────────────────────
const events: Entry[] = [
  {
    id: "evt-paleni-carodejnic-2026",
    type: "akce",
    slug: "paleni-carodejnic-2026-04-30",
    title: "Pálení čarodějnic",
    description:
      "Sraz u hasičské zbrojnice od 18:00, v 19:00 stavění májky, ve 20:00 zapálení hranice. Doprovodný program pro děti a soutěž o nejhezčí masku. Občerstvení zajistí SDH na místě.",
    href: "/akce/paleni-carodejnic-2026-04-30",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    lat: 49.8568,
    lng: 14.5576,
    address: "Hasičská zbrojnice, Krhanice",
    startedAt: "2026-04-30T18:00:00+02:00",
    endedAt: "2026-04-30T22:30:00+02:00",
    category: "zabava",
    subcategory: "oslavy",
    tags: ["tradice", "venku", "vstup-zdarma", "pro-rodiny"],
    status: "approved",
    trustLevel: "verified",
    organizer: "SDH Krhanice",
    price: "Vstup zdarma",
  },
  {
    id: "evt-kaceni-maje-2026",
    type: "akce",
    slug: "kaceni-maje-2026-05-30",
    title: "Kácení máje",
    description:
      "Tradiční obřad konce máje s živou kapelou a posezením u hasičárny. Hudbu obstarávají místní muzikanti, jídlo a pití přímo z grilu, tombola, zábava do pozdních hodin. Začátek u návsi, průvod ke zbrojnici.",
    href: "/akce/kaceni-maje-2026-05-30",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    lat: 49.8568,
    lng: 14.5576,
    address: "Hasičská zbrojnice, Krhanice",
    startedAt: "2026-05-30T15:00:00+02:00",
    category: "zabava",
    subcategory: "oslavy",
    tags: ["tradice", "vstup-zdarma", "venku", "hudba"],
    status: "approved",
    trustLevel: "verified",
    organizer: "SDH Krhanice",
    contactPhone: "+420 317 792 235",
    contactEmail: "sdh@krhanice.cz",
    price: "Vstup zdarma",
  },
  {
    id: "evt-detsky-den-2026",
    type: "akce",
    slug: "detsky-den-2026-06-06",
    title: "Dětský den",
    description:
      "Zábavné odpoledne plné her, soutěží a stanovišť pro krhanické děti i hosty z okolí. Skákací hrad, malování na obličej, ukázka hasičské techniky, sladká odměna pro každého účastníka. Občerstvení pro děti i rodiče zajištěno.",
    href: "/akce/detsky-den-2026-06-06",
    lat: 49.8561,
    lng: 14.5574,
    address: "Náves Krhanice",
    startedAt: "2026-06-06T14:00:00+02:00",
    category: "deti-rodina",
    subcategory: "detske-dny",
    tags: ["pro-deti", "pro-rodiny", "venku", "vstup-zdarma"],
    status: "approved",
    trustLevel: "verified",
    organizer: "Obecní úřad Krhanice, Kulturní komise, SDH, TJ Sokol",
    contactPhone: "+420 317 792 100",
    contactEmail: "ou@krhanice.cz",
    price: "Zdarma pro všechny",
  },
  {
    id: "evt-anenska-zabava-2026",
    type: "akce",
    slug: "anenska-zabava-2026-07-25",
    title: "Anenská zábava",
    description:
      "Letní zábava na sokolském hřišti. Živá hudba do pozdních hodin, taneční parket pod širým nebem, klasická česká kuchyně, čepované pivo a domácí limonády. Předprodej vstupenek v hospodě U Hraběte.",
    href: "/akce/anenska-zabava-2026-07-25",
    lat: 49.8557,
    lng: 14.5580,
    address: "Sokolovna Krhanice",
    startedAt: "2026-07-25T20:00:00+02:00",
    category: "zabava",
    subcategory: "tanecni-zabavy",
    tags: ["venku", "pro-rodiny", "placene", "hudba"],
    status: "approved",
    trustLevel: "verified",
    organizer: "TJ Sokol Krhanice",
    contactPhone: "+420 605 432 110",
    contactEmail: "sokol@krhanice.cz",
    price: "200 Kč v předprodeji, 250 Kč na místě",
  },
  {
    id: "evt-hasicsky-ples-2026",
    type: "akce",
    slug: "hasicsky-ples-2026-08-22",
    title: "Hasičský ples pod hvězdami",
    description:
      "Letní ples na otevřeném prostranství u hasičárny. Velká tombola s hodnotnými cenami, taneční hudba do rána, půlnoční překvapení. Předprodej vstupenek v hospodě U Hraběte a u členů SDH.",
    href: "/akce/hasicsky-ples-2026-08-22",
    lat: 49.8568,
    lng: 14.5576,
    address: "Hasičská zbrojnice, Krhanice",
    startedAt: "2026-08-22T20:00:00+02:00",
    category: "zabava",
    subcategory: "plesy",
    tags: ["venku", "placene", "hudba"],
    status: "approved",
    trustLevel: "verified",
    organizer: "SDH Krhanice",
    contactPhone: "+420 317 792 235",
    contactEmail: "sdh@krhanice.cz",
    price: "150 Kč v předprodeji, 200 Kč na místě",
  },
  {
    id: "evt-letni-kino-2026",
    type: "akce",
    slug: "letni-kino-2026-08-28",
    title: "Letní kino",
    description:
      "Promítání pod širým nebem na konci léta. V programu český film a krátké animované pásmo pro děti. Občerstvení a deky v ceně, doporučujeme přijít si pohlídat místo. V případě deště se akce přesouvá do sokolovny.",
    href: "/akce/letni-kino-2026-08-28",
    lat: 49.8561,
    lng: 14.5574,
    address: "Náves Krhanice",
    startedAt: "2026-08-28T20:30:00+02:00",
    category: "kultura",
    subcategory: "kino",
    tags: ["venku", "pro-rodiny", "placene"],
    status: "approved",
    trustLevel: "verified",
    organizer: "Aktivní Krhanice",
    contactPhone: "+420 605 333 777",
    contactEmail: "kultura@aktivnikrhanice.cz",
    price: "Dospělí 80 Kč, děti zdarma",
  },
  {
    id: "evt-cervnove-diskoteky-2026",
    type: "akce",
    slug: "cervnove-diskoteky-pro-deti-a-dospele-2026-06-13",
    title: "Červnové diskotéky pro děti a dospělé",
    description:
      "Sousedský diskotékový večer s programem pro děti i dospělé. Pořádá spolek Naše Krhanice.",
    href: "/akce/cervnove-diskoteky-pro-deti-a-dospele-2026-06-13",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    address: "Krhanice (místo upřesní pořadatel)",
    startedAt: "2026-06-13",
    category: "zabava",
    subcategory: "tanecni-zabavy",
    tags: ["tradice", "pro-rodiny", "hudba"],
    status: "approved",
    trustLevel: "verified",
    organizer: "Naše Krhanice",
  },
  {
    id: "evt-kavarnicka-seniori-2026",
    type: "akce",
    slug: "kavarnicka-pro-seniory-2026-06-19",
    title: "Kavárnička pro seniory",
    description:
      "Pravidelné setkání seniorů u kávy a dortu. Organizuje obecní úřad společně s kulturní komisí.",
    href: "/akce/kavarnicka-pro-seniory-2026-06-19",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    address: "Krhanice (místo upřesní pořadatel)",
    startedAt: "2026-06-19",
    category: "zabava",
    subcategory: "oslavy",
    tags: ["pro-seniory", "pod-strechou"],
    status: "approved",
    trustLevel: "verified",
    organizer: "Obecní úřad Krhanice a Kulturní komise",
  },
  {
    id: "evt-zajezd-divadlo-2026",
    type: "akce",
    slug: "zajezd-do-divadla-palace-2026-06-24",
    title: "Zájezd do divadla Palace",
    description:
      "Společný zájezd do Divadla Palace v Praze na představení Prachy! Doprava autobusem od obecního úřadu.",
    href: "/akce/zajezd-do-divadla-palace-2026-06-24",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    lat: 50.0853,
    lng: 14.4271,
    address: "Divadlo Palace, Praha",
    startedAt: "2026-06-24",
    category: "kultura",
    subcategory: "divadlo",
    tags: ["pro-seniory", "placene"],
    status: "approved",
    trustLevel: "verified",
    organizer: "Kulturní komise a Obecní úřad Krhanice",
  },
  {
    id: "evt-krhanice-open-air-2026",
    type: "akce",
    slug: "krhanice-open-air-2026-08-01",
    title: "Krhanice Open Air",
    description:
      "Letní open-air akce v Krhanicích. Konkrétní program a místo zveřejní pořadatel blíže k termínu.",
    href: "/akce/krhanice-open-air-2026-08-01",
    website: "https://www.obeckrhanice.cz/pozvanky-na-akce",
    address: "Krhanice",
    startedAt: "2026-08-01",
    category: "kultura",
    subcategory: "festivaly",
    tags: ["venku", "pro-rodiny", "hudba"],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── Reálné regionální akce (scraped 2026-05-04) ────────────────────────
  {
    id: "evt-sber-textilu-tynec-2026",
    type: "akce",
    slug: "sber-textilu-pro-diakonii-broumov",
    title: "Sběr textilu pro Diakonii Broumov",
    description:
      "Můžete darovat funkční oblečení, ložní prádlo, obuv, domácí textil, drobné elektrospotřebiče, knihy či hygienické potřeby, které poslouží potřebným. Naopak nelze odevzdávat například nábytek, znečištěné věci nebo velké spotřebiče.",
    href: "/akce/sber-textilu-pro-diakonii-broumov",
    website: "http://tourist.posazavi.com/cz/Event/Event.aspx?Id=44273",
    heroImage: "/brand/photos/evt-sber-textilu-tynec-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, Městský úřad",
    startedAt: "2026-05-04",
    endedAt: "2026-05-06",
    category: "priroda",
    subcategory: "brigady",
    tags: ["pod-strechou", "vstup-zdarma"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Město Týnec nad Sázavou",
  },
  {
    id: "evt-ferova-snidane-tynec-2026",
    type: "akce",
    slug: "ferova-snidane-tynec",
    title: "Férová snídaně",
    description:
      "Srdečně vás zveme na Férovou snídani, celorepublikový piknik na podporu fair trade a lokálních potravin, který se uskuteční v zahradě Kulturního centra Týnec. Přijďte si užít příjemné dopoledne v milé společnosti, přineste si vlastní snídani z férových nebo lokálních surovin a společně podpořme myšlenku spravedlivého obchodu a odpovědné spotřeby.",
    href: "/akce/ferova-snidane-tynec",
    website: "http://tourist.posazavi.com/cz/Event/Event.aspx?Id=44172",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, zahrada Kulturního centra",
    startedAt: "2026-05-09",
    category: "zabava",
    subcategory: "jarmarky",
    tags: ["venku", "vstup-zdarma", "regionalni-produkt", "bio-eko", "pro-rodiny"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Kulturní centrum Týnec",
    price: "Vstup zdarma",
  },
  {
    id: "evt-tvoreni-dne-matek-2026",
    type: "akce",
    slug: "tvoreni-ke-dni-matek",
    title: "Tvoření ke Dni matek",
    description:
      "Tvořivé odpoledne pro děti, při kterém si malí účastníci vyrobí vlastní dárky ke Dni matek a potěší tak své maminky originálním překvapením. Akce je určena dětem.",
    href: "/akce/tvoreni-ke-dni-matek",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220448-tvoreni-ke-dni-matek/",
    heroImage: "/brand/photos/evt-tvoreni-dne-matek-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hospůdka K Náklí",
    startedAt: "2026-05-08",
    category: "deti-rodina",
    subcategory: "dilny-pro-deti",
    tags: ["pro-deti", "pro-rodiny", "vytvarne"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Hospůdka K Náklí",
  },
  {
    id: "evt-swap-kvetin-tynec-2026",
    type: "akce",
    slug: "swap-kvetin-v-knihovne",
    title: "Swap květin v knihovně",
    description:
      "Máte doma spoustu květin a nevíte co s nimi? Přineste je a uděláte radost jiným zájemcům. Soušasně si můžete i odnést zelené 'poklady' jiných pěstilů.",
    href: "/akce/swap-kvetin-v-knihovne",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220485-swap-kvetin-v-knihovne/",
    heroImage: "/brand/photos/evt-swap-kvetin-tynec-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, knihovna Kulturního centra",
    startedAt: "2026-04-01",
    endedAt: "2026-05-31",
    category: "zabava",
    subcategory: "jarmarky",
    tags: ["pod-strechou", "vstup-zdarma", "sezonni"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Kulturní centrum Týnec",
  },
  {
    id: "evt-pribeh-vejiru-tynec-2026",
    type: "akce",
    slug: "pribeh-vejiru",
    title: "Příběh vějířů",
    description:
      "Výstava vějířů v průběhu století ze soukromých sbírek Jany Novákové a Jiřího Sauka.",
    href: "/akce/pribeh-vejiru",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220478-pribeh-vejiru/",
    heroImage: "/brand/photos/evt-pribeh-vejiru-tynec-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hrad a muzeum",
    startedAt: "2026-04-03",
    endedAt: "2026-07-26",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pod-strechou", "historie"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-kreativni-obrazy-tynec-2026",
    type: "akce",
    slug: "kreativni-obrazy-tynec",
    title: "Kreativní obrazy",
    description:
      "Navštivte výstavu kreativních obrazů Lenky Útratové a Miloše Klenovce. K vidění ve velké galerii v otevírací době muzea: duben, květen pátek–neděle 10–12 a 13–17. Vernisáž 3. 4. od 17.00 hodin.",
    href: "/akce/kreativni-obrazy-tynec",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220482-kreativni-obrazy/",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, velká galerie městského muzea",
    startedAt: "2026-04-03",
    endedAt: "2026-05-31",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pod-strechou", "vytvarne"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-sazavenkov-carodejnice-2026",
    type: "akce",
    slug: "sazavenkov-v-risi-carodejnic",
    title: "Sázavěnkov v říši čarodějnic",
    description:
      "Pohádková krajina víly Sázavěnky plná víl, skřítků a čarodějnic.",
    href: "/akce/sazavenkov-v-risi-carodejnic",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220480-sazavenkov-v-risi-carodejnic/",
    heroImage: "/brand/photos/evt-sazavenkov-carodejnice-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hrad a muzeum",
    startedAt: "2026-04-03",
    endedAt: "2026-12-20",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pro-deti", "pro-rodiny", "pod-strechou"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-stripky-tynecka-2026",
    type: "akce",
    slug: "stripky-z-historie-tynecka",
    title: "Střípky z historie Týnecka",
    description:
      "Navštivte 2. patro věže hradu. Naleznete zde archeologické nálezy z Týnce nad Sázavou a jeho okolí od pravěku po středověk.",
    href: "/akce/stripky-z-historie-tynecka",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220481-stripky-z-historie-tynecka/",
    heroImage: "/brand/photos/evt-stripky-tynecka-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hrad a muzeum",
    startedAt: "2026-04-03",
    endedAt: "2026-12-20",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pod-strechou", "historie", "naucne"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-tynecka-kamenina-2026",
    type: "akce",
    slug: "tynecka-kamenina",
    title: "Týnecká kamenina",
    description:
      "Navštivte stálou expozici jemných kameninových výrobků.",
    href: "/akce/tynecka-kamenina",
    website: "https://www.mestotynec.cz/kalendar-akci/kalendar-akci/220479-tynecka-kamenina/",
    heroImage: "/brand/photos/evt-tynecka-kamenina-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hrad a muzeum",
    startedAt: "2026-04-03",
    endedAt: "2026-12-20",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pod-strechou", "tradice", "remeslo"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-einstein-jilove-2026",
    type: "akce",
    slug: "vystava-einstein-jilove",
    title: "Albert Einstein: Člověk a genius",
    description:
      "Fascinující příběh jednoho z největších myslitelů všech dob. Výstava mapuje život a dílo výjimečného fyzika, jehož teorie změnily pohled na nám známý svět i vesmír.",
    href: "/akce/vystava-einstein-jilove",
    website: "http://tourist.posazavi.com/cz/Event/Event.aspx?Id=43728",
    heroImage: "/brand/photos/evt-einstein-jilove-2026.webp",
    lat: 49.8983,
    lng: 14.4942,
    address: "Jílové u Prahy, Regionální muzeum, Masarykovo nám. 16",
    startedAt: "2026-01-17",
    endedAt: "2026-05-24",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["pod-strechou", "veda-technika", "naucne"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Regionální muzeum Jílové u Prahy",
  },
  {
    id: "evt-ora-et-labora-jilove-2026",
    type: "akce",
    slug: "ora-et-labora-jilove",
    title: "Ora et labora, panelová výstava",
    description:
      "Přijďte si prohlédnout panelovou výstavu Ora et labora v parku před muzeem. Představuje aktualizované digitální výstupy, nové vizualizace a širší pohled na klášter na Ostrově u Davle i jeho zázemí, včetně zaniklé osady Sekanka.",
    href: "/akce/ora-et-labora-jilove",
    website: "http://tourist.posazavi.com/cz/Event/Event.aspx?Id=44144",
    heroImage: "/brand/photos/evt-ora-et-labora-jilove-2026.webp",
    lat: 49.8983,
    lng: 14.4942,
    address: "Jílové u Prahy, park před Regionálním muzeem",
    startedAt: "2026-03-03",
    endedAt: "2026-05-24",
    category: "kultura",
    subcategory: "vystavy",
    tags: ["venku", "historie", "naucne"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Regionální muzeum Jílové u Prahy",
  },
  {
    id: "evt-konopiste-ruzova-zahrada-2026",
    type: "akce",
    slug: "vecerni-prohlidka-konopiste-ruzova-zahrada",
    title: "Večerní prohlídka: Exotika v Růžové zahradě",
    description:
      "Komentovaná prohlídka skleníků plných vůní z exotických rostlin, které si arcivévoda přivezl z tajemných dálek, či se na svých cestách inspiroval a začal je pěstovat i na svém panství.",
    href: "/akce/vecerni-prohlidka-konopiste-ruzova-zahrada",
    website: "https://www.zamek-konopiste.cz/cs/akce/11123-vecerni-prohlidka-exotika-v-ruzove-zahrade",
    heroImage: "/brand/photos/evt-konopiste-ruzova-zahrada-2026.webp",
    lat: 49.7820,
    lng: 14.6562,
    address: "Zámek Konopiště, Růžová zahrada",
    startedAt: "2026-05-06T20:00:00+02:00",
    category: "kultura",
    subcategory: "prohlidky",
    tags: ["venku", "placene", "rezervace-nutna"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Zámek Konopiště",
  },
  {
    id: "evt-konopiste-waffen-ss-2026",
    type: "akce",
    slug: "konopiste-velitelstvi-waffen-ss",
    title: "Konopiště, velitelství Waffen-SS",
    description:
      "Na Den vítězství, který připomíná konec II. světové války v Evropě, bude pro návštěvníky připravena výjimečná prohlídka s unikátními předměty a zajímavým výkladem o roli Konopiště, potomcích arcivévody Františka Ferdinanda d´Este a okolí zámku. Během II. světové války (1943–1945) na zámku Konopiště sídlilo velitelství Waffen-SS.",
    href: "/akce/konopiste-velitelstvi-waffen-ss",
    website: "https://www.zamek-konopiste.cz/cs/akce/132638-konopiste-velitelstvi-waffen-ss",
    heroImage: "/brand/photos/evt-konopiste-waffen-ss-2026.webp",
    lat: 49.7820,
    lng: 14.6562,
    address: "Zámek Konopiště",
    startedAt: "2026-05-08T10:00:00+02:00",
    endedAt: "2026-05-08T16:00:00+02:00",
    category: "kultura",
    subcategory: "prohlidky",
    tags: ["pod-strechou", "historie", "placene"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Zámek Konopiště",
  },
  {
    id: "evt-trziste-zajeci-2026",
    type: "akce",
    slug: "trziste-v-zajeci-2026",
    title: "Tržiště v Zaječí",
    description:
      "Sousedský trh na návsi v Zaječí, osadě Bystřice u Benešova. Lokální výrobci, jídlo, drobní řemeslníci. Od 12:00.",
    href: "/akce/trziste-v-zajeci-2026",
    website: "https://www.mestobystrice.cz/volny-cas/kalendar-akci/",
    lat: 49.7900,
    lng: 14.6850,
    address: "Zaječí (osada Bystřice u Benešova), náves",
    startedAt: "2026-05-09T12:00:00+02:00",
    category: "zabava",
    subcategory: "jarmarky",
    tags: ["venku", "regionalni-produkt"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Město Bystřice u Benešova",
  },
  {
    id: "evt-cesky-pohar-vodaku-2026",
    type: "akce",
    slug: "cesky-pohar-vodaku-sazava-2026",
    title: "Český pohár vodáků na Sázavě",
    description:
      "Další ročník závodu se koná na trase Týnec nad Sázavou – Luka pod Medníkem, která je dlouhá 12 kilometrů (WW I-II). Start závodu je nad jezem v Týnci, cíl pod 'soutěskou' na Lukách pod Medníkem.",
    href: "/akce/cesky-pohar-vodaku-sazava-2026",
    website: "https://www.kudyznudy.cz/akce/sazava-cesky-pohar-vodaku",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, řeka Sázava",
    startedAt: "2026-05-16",
    category: "sport",
    subcategory: "zavody",
    tags: ["venku", "sezonni"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Český svaz kanoistů",
  },
  {
    id: "evt-muzejni-noc-tynec-2026",
    type: "akce",
    slug: "muzejni-noc-tynec-2026-06-05",
    title: "Muzejní noc na hradě Týnec",
    description:
      "Jste zváni na Muzejní noc do Týnce nad Sázavou, která se koná 5. 6. 2026 od 18 do 22 hodin.",
    href: "/akce/muzejni-noc-tynec-2026-06-05",
    website: "https://www.kudyznudy.cz/akce/muzejni-noc-hvezdy-na-hrade",
    heroImage: "/brand/photos/evt-muzejni-noc-tynec-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, hrad a muzeum",
    startedAt: "2026-06-05",
    category: "kultura",
    subcategory: "prohlidky",
    tags: ["pod-strechou", "historie", "pro-rodiny", "placene"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Městské muzeum Týnec nad Sázavou",
  },
  {
    id: "evt-tynecka-neckyada-2026",
    type: "akce",
    slug: "tynecka-neckyada-2026-08-15",
    title: "Týnecká neckyáda",
    description:
      "Čeká vás veselý přehlídkový závod originálních plavidel na řece Sázavě, kde fantazii se meze nekladou. Soutěžit můžete o ceny za nejvtipnější či nejoriginálnější loď, nebo se přijďte jen pobavit a fandit. Program doplní doprovodné soutěže – oblíbené lovení kachniček a pokladu na vodě, nově i další hry a akce pro děti.",
    href: "/akce/tynecka-neckyada-2026-08-15",
    website: "https://www.kudyznudy.cz/akce/tynecka-neckyada-1",
    heroImage: "/brand/photos/evt-tynecka-neckyada-2026.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou, řeka Sázava",
    startedAt: "2026-08-15",
    category: "sport",
    subcategory: "zavody",
    tags: ["venku", "sezonni", "pro-rodiny"],
    status: "approved",
    trustLevel: "scraped",
    organizer: "Město Týnec nad Sázavou",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MÍSTA / GASTRO / OBCHODY / SLUŽBY / SPOLKY
// Each entry has exactly one type. Multi-role entities split per spec.
// ─────────────────────────────────────────────────────────────────────────────
const directory: Entry[] = [
  // ─── SPOLKY ────────────────────────────────────────────────────────────
  {
    id: "pl-hasicska-zbrojnice-krhanice",
    type: "spolky",
    slug: "sdh-krhanice",
    title: "SDH Krhanice (Sbor dobrovolných hasičů)",
    description:
      "Dobrovolný hasičský sbor založený 1895 s nepřerušenou činností. Zázemí v hasičské zbrojnici a stojí za většinou tradičních akcí: pálení čarodějnic, kácení máje, hasičský ples, dětský den. Vedoucí Ing. Tomáš Kratochvíl.",
    href: "/sluzby/sdh-krhanice",
    website: "https://hasici.obeckrhanice.cz/",
    address: "Krhanice (hasičská zbrojnice, přesnou adresu doplníme)",
    category: "tradice-komunita",
    subcategory: "hasicsky-sbor",
    tags: ["tradice"],
    status: "approved",
    trustLevel: "verified",
    organizer: "SDH Krhanice",
    contactPhone: "+420 721 959 131",
    contactEmail: "sdh-Krhanice@seznam.cz",
    featured: true,
  },
  {
    id: "sv-tj-sokol",
    type: "spolky",
    slug: "tj-sokol-krhanice",
    title: "TJ Sokol Krhanice",
    description:
      "Tělovýchovná jednota Sokol Krhanice nabízí fotbal a volejbal. Fotbalový A‑tým hraje III. třídu okresu Benešov, mužstvo má vlastní hřiště u sokolovny.",
    href: "/sluzby/tj-sokol-krhanice",
    website: "https://www.facebook.com/sokolkrhanice/",
    social: {
      facebook: "https://www.facebook.com/sokolkrhanice/",
    },
    address: "Krhanice (sokolské hřiště, přesnou adresu doplníme)",
    category: "sport",
    subcategory: "sokol",
    tags: ["tradice"],
    status: "approved",
    trustLevel: "verified",
    contactEmail: "sokolkrhanice@seznam.cz",
    featured: true,
  },
  {
    id: "sv-aktivni-krhanice",
    type: "spolky",
    slug: "aktivni-krhanice",
    title: "Aktivní Krhanice, z.s.",
    description:
      "Chceme vytvářet lepší životní prostředí realizováním nápadů a projektů, které pomůžou kultivovat veřejný prostor, krajinu i sousedské vztahy v obci Krhanice.",
    href: "/sluzby/aktivni-krhanice",
    website: "https://www.aktivnikrhanice.cz/",
    social: {
      facebook: "https://www.facebook.com/aktivnikrhanice",
    },
    lat: 49.8552575,
    lng: 14.557905,
    address: "Krhanice 35, 257 42",
    category: "tradice-komunita",
    subcategory: "sousedsky",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactEmail: "spolek@aktivnikrhanice.cz",
    contactPhone: "+420 606 269 744",
  },
  {
    id: "sv-karhany",
    type: "spolky",
    slug: "karhany",
    title: "Karhany, z.s.",
    description:
      "Jsme spolkem fungujícím od roku 2017. Naším cílem je podpora, šíření kulturních a řemeslných tradic, vzdělávání občanů ve vazbě na aktivní využívání volného času, podpora školství, tělovýchovy, dětí, mládeže a ochrana přírody.",
    href: "/sluzby/karhany",
    website: "https://www.karhany.cz/",
    social: {
      facebook: "https://www.facebook.com/spolekkarhany",
      instagram: "https://www.instagram.com/karhany_spolek",
    },
    lat: 49.8560226,
    lng: 14.56012,
    address: "Krhanice 197, 257 42",
    category: "tradice-komunita",
    subcategory: "sousedsky",
    tags: ["tradice"],
    status: "approved",
    trustLevel: "verified",
    contactEmail: "spolek@karhany.cz",
    contactPhone: "+420 608 530 807",
  },
  {
    id: "sv-nase-krhanice",
    type: "spolky",
    slug: "nase-krhanice",
    title: "Naše Krhanice, z.s.",
    description:
      "V roce 2022 byl založen spolek Naše Krhanice, z.s. a dále Nadační fond Naše Krhanice. Účelem nadačního fondu i spolku je podpora veřejně prospěšných aktivit na území obce Krhanice.",
    href: "/sluzby/nase-krhanice",
    website: "https://www.nasekrhanice.cz/",
    address: "Krhanice 252, 257 42",
    category: "tradice-komunita",
    subcategory: "sousedsky",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactEmail: "spolek@nasekrhanice.cz",
    contactPhone: "+420 604 202 337",
  },
  {
    id: "sv-mazoretky-hrabenky",
    type: "spolky",
    slug: "mazoretky-hrabenky-kamenice",
    title: "Mažoretky Hraběnky Kamenice",
    description:
      "Mažoretkový soubor pod vedením Markéty a Anny Novotné. Tým má za sebou úspěchy na mistrovství světa, aktivně se účastní soutěží České federace mažoretkového sportu. Sídlo a kontakt v Krhanicích.",
    href: "/sluzby/mazoretky-hrabenky-kamenice",
    website: "https://www.mazoretkykamenice.cz/",
    address: "Krhanice 62, 257 42",
    category: "sport",
    subcategory: "ostatni-sport",
    tags: ["pro-deti", "tradice"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-fun-carving-club",
    type: "spolky",
    slug: "czech-fun-carving-club",
    title: "Czech Fun Carving Club",
    description:
      "Lyžařský klub se zaměřením na carving, fun carving a race carving.",
    href: "/sluzby/czech-fun-carving-club",
    address: "Krhanice 37, 257 42",
    category: "sport",
    subcategory: "ostatni-sport",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-taekwon-do",
    type: "spolky",
    slug: "skola-taekwon-do",
    title: "Škola TAEKWON-DO I.T.F. GE-BAEK HOSIN SOOL",
    description:
      "Tradiční korejské bojové umění pro děti i dospělé. Trénuje se v tělocvičně ZŠ Krhanice.",
    href: "/sluzby/skola-taekwon-do",
    address: "Krhanice 149, 257 42 (tělocvična ZŠ)",
    category: "sport",
    subcategory: "bojove-sporty",
    tags: ["pro-deti"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-crazy-boys",
    type: "spolky",
    slug: "crazy-boys-kapela",
    title: "Crazy Boys",
    description:
      "Hudební skupina z Krhanic.",
    href: "/sluzby/crazy-boys-kapela",
    address: "Krhanice, 257 42",
    category: "kultura-umeni",
    subcategory: "hudebni",
    tags: ["hudba"],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── MÍSTA / pamatky ───────────────────────────────────────────────────
  {
    id: "pl-konopiste",
    type: "mista",
    slug: "zamek-konopiste",
    title: "Zámek Konopiště",
    description:
      "Konopiště patří k nejvýznamnějším památkám v České republice. Zámek je hodnotný především jako stavba, v jejíž hmotné struktuře se dochovaly podstatné části mohutné středověké pevnosti výrazného architektonického typu, jaký se v Čechách vyskytl jenom výjimečně.",
    href: "/mista/zamek-konopiste",
    website: "https://www.zamek-konopiste.cz/",
    heroImage: "/brand/photos/pl-konopiste.webp",
    social: {
      facebook: "https://www.facebook.com/zamekkonopiste",
      instagram: "https://www.instagram.com/zamek_konopiste",
    },
    lat: 49.7758,
    lng: 14.6611,
    address: "Konopiště, 256 01 Benešov",
    hours: "Út-Ne 9:00-17:00 (sezona)",
    price: "200-330 Kč",
    parking: "Placené parkoviště u zámku",
    category: "pamatky",
    subcategory: "hrady-zamky",
    tags: ["historie", "parkovani", "pro-rodiny", "mimo-obec"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 721 366",
    contactEmail: "konopiste@npu.cz",
    featured: true,
  },
  {
    id: "pl-zboreny-kostelec",
    type: "mista",
    slug: "zboreny-kostelec",
    title: "Zbořený Kostelec",
    description:
      "Zbořený Kostelec je zřícenina hradu nad pravým břehem řeky Sázavy u soutoku s Kamenickým potokem, naproti vesnici Zbořený Kostelec nedaleko Týnce nad Sázavou v okresu Benešov.",
    href: "/mista/zboreny-kostelec",
    heroImage: "/brand/photos/pl-zboreny-kostelec.webp",
    lat: 49.85434,
    lng: 14.591563,
    address: "Krhanice 257 42 (lokalita Zbořený Kostelec)",
    category: "pamatky",
    subcategory: "hrady-zamky",
    tags: ["historie", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-tynecky-hrad",
    type: "mista",
    slug: "tynecky-hrad-a-muzeum",
    title: "Týnecký hrad a muzeum",
    description:
      "Nejstarší písemná zpráva o existenci Týnce a týneckého hradu je z roku 1318 a zachovala se ve zlomku bývalých soudních spisů tzv. půhonných desek.",
    href: "/mista/tynecky-hrad-a-muzeum",
    website: "https://www.mestotynec.cz/hrad-a-muzeum",
    lat: 49.8369,
    lng: 14.5949,
    address: "Nádvoří Adama Hodějovského 48, 257 41 Týnec nad Sázavou",
    category: "pamatky",
    subcategory: "hrady-zamky",
    tags: ["historie", "pro-rodiny", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
    contactPhone: "+420 317 701 051",
    contactEmail: "muzeum@kctynec.cz",
    featured: true,
  },
  {
    id: "pl-zlenice",
    type: "mista",
    slug: "zricenina-zlenice",
    title: "Zřícenina hradu Zlenice (Hláska)",
    description:
      "Přesné založení hradu Zlenice, lidově též zvaného Hláska, je dosud zahaleno tajemstvím. Hrad byl postaven zřejmě někdy na počátku 14. století a v 15. století byl dobyt a zničen.",
    href: "/mista/zricenina-zlenice",
    website: "https://www.kudyznudy.cz/aktivity/zricenina-hradu-zlenice-hrad-znamy-z-obrazku-jos",
    heroImage: "/brand/photos/pl-zlenice.webp",
    lat: 49.8950,
    lng: 14.7300,
    address: "Čerčany / Senohraby (Posázaví)",
    category: "pamatky",
    subcategory: "hrady-zamky",
    tags: ["historie", "mimo-obec", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-stola-v-halirich",
    type: "mista",
    slug: "stola-v-halirich",
    title: "Štola v Halířích",
    description:
      "Tichý kout v srdci Posázaví ukrývá unikátní technickou památku – Štolu v Halířích, důlní dílo z poloviny 20. století, které zaujme svým kosočtvercovým profilem a autentickou atmosférou hornické práce. Návštěvníky zde čeká pohled do nitra země, kde se potkává historie s tajemstvím podzemí. Při prohlídce nahlédnete do doby, kdy zde čtyři havíři razili tunel o délce 258 metrů, aby prozkoumali Halířské žilné pásmo. Ve štole je dodnes možné spatřit dobové hornické vybavení, vyzkoušet si rýžování zlata nebo se nechat okouzlit fluorescenčními minerály.",
    href: "/mista/stola-v-halirich",
    website: "https://www.navylet.cz/cs/cil/stola-v-halirich-jilove-u-prahy",
    heroImage: "/brand/photos/pl-stola-v-halirich.webp",
    lat: 49.88423,
    lng: 14.51346,
    address: "Halíře u Jílového u Prahy",
    category: "pamatky",
    subcategory: "historicke-budovy",
    tags: ["historie", "naucne", "pro-rodiny", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
    featured: true,
  },
  {
    id: "pl-kostel-simon-juda-tynec",
    type: "mista",
    slug: "kostel-svateho-simona-a-judy-tynec",
    title: "Kostel sv. Šimona a Judy",
    description:
      "Historický kostel zasvěcený sv. Šimonovi a Judovi v centru Týnce nad Sázavou. Stojí vedle hradu, součást městské památkové zóny.",
    href: "/mista/kostel-svateho-simona-a-judy-tynec",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou (centrum)",
    category: "pamatky",
    subcategory: "sakralni-stavby",
    tags: ["historie", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-kostel-porici",
    type: "mista",
    slug: "kostel-svateho-petra-a-pavla-porici",
    title: "Kostel sv. Petra a Pavla v Poříčí nad Sázavou",
    description:
      "Kostel ze žulových kvádrů v románském slohu byl postaven v 11. století a až na drobné detaily se v této podobě dochoval do dnes.",
    href: "/mista/kostel-svateho-petra-a-pavla-porici",
    website: "https://www.kudyznudy.cz/aktivity/kostel-sv-petra-a-pavla-v-porici-nad-sazavou",
    heroImage: "/brand/photos/pl-kostel-porici.webp",
    lat: 49.8400,
    lng: 14.6900,
    address: "Benešovská, 257 21 Poříčí nad Sázavou",
    category: "pamatky",
    subcategory: "sakralni-stavby",
    tags: ["historie", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
  },

  // ─── MÍSTA / kultura ───────────────────────────────────────────────────
  {
    id: "pl-vojenske-muzeum-lesany",
    type: "mista",
    slug: "vojenske-muzeum-lesany",
    title: "Vojenské muzeum Lešany",
    description:
      "Největší expozice vojenské techniky v Česku. Tanky, děla, letadla, dobové vozy, palné zbraně, mundúry. Více než tisíc kusů techniky pod střechou i pod širým nebem. Pravidelné ukázky bojového nasazení v sezoně, vhodné pro celé rodiny i odbornou veřejnost.",
    href: "/mista/vojenske-muzeum-lesany",
    website: "https://www.vhu.cz/muzea/lesany/",
    heroImage: "/brand/photos/pl-vojenske-muzeum-lesany.webp",
    lat: 49.7847,
    lng: 14.4944,
    address: "Lešany 1, 257 42 Krhanice",
    hours: "Út-Ne 9:30-17:30 (květen-říjen)",
    price: "150 Kč, děti 50 Kč",
    parking: "Volné parkoviště u areálu",
    category: "kultura",
    subcategory: "muzea",
    tags: ["historie", "parkovani", "pro-rodiny"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 973 296 161",
    contactEmail: "muzeumlesany@army.cz",
    featured: true,
  },
  {
    id: "pl-muzeum-jilove",
    type: "mista",
    slug: "regionalni-muzeum-jilove",
    title: "Regionální muzeum v Jílovém u Prahy",
    description:
      "Navštivte Regionální muzeum v Jílovém u Prahy a objevte fascinující historii těžby zlata i bohaté kulturní dědictví regionu.",
    href: "/mista/regionalni-muzeum-jilove",
    website: "http://muzeumjilove.cz/",
    lat: 49.8983,
    lng: 14.4942,
    address: "Jílové u Prahy, Masarykovo nám. 16",
    category: "kultura",
    subcategory: "muzea",
    tags: ["pod-strechou", "historie", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "sv-knihovna-krhanice",
    type: "mista",
    slug: "obecni-knihovna-krhanice",
    title: "Obecní knihovna Krhanice",
    description:
      "Knihovna v budově obecního úřadu, fond beletrie i odborné literatury, koutek pro děti. Knihovnice Dana Kohoutová. Od ledna 2026 rozšířená provozní doba, registrace zůstává bez poplatku. Tematické akce: Březen měsíc čtenářů, Noc s Andersenem, velikonoční dílny.",
    href: "/mista/obecni-knihovna-krhanice",
    website: "https://www.obeckrhanice.cz/obecni-knihovna",
    lat: 49.8569238,
    lng: 14.5596988,
    address: "Krhanice 46, 257 42 (budova obecního úřadu)",
    hours: "Po 15:00–18:00",
    price: "Roční registrace 50 Kč, děti zdarma",
    category: "kultura",
    subcategory: "knihovny",
    tags: ["pod-strechou", "literatura", "vstup-zdarma", "v-centru", "pro-rodiny"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 792 100",
    contactEmail: "knihovna@krhanice.cz",
    featured: true,
  },
  {
    id: "pl-kc-tynec",
    type: "mista",
    slug: "kulturni-centrum-tynec",
    title: "Kulturní centrum Týnec",
    description:
      "Hlavní činností příspěvkové organizace je nezisková činnost v kultuře, cestovním ruchu, muzejnictví a knihovnictví.",
    href: "/mista/kulturni-centrum-tynec",
    website: "https://www.mestotynec.cz/kulturni-centrum-tynec",
    heroImage: "/brand/photos/pl-kc-tynec.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Klusáčkova 2, 257 41 Týnec nad Sázavou",
    category: "kultura",
    subcategory: "kulturni-domy",
    tags: ["pod-strechou", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
    contactPhone: "+420 317 729 050",
  },

  // ─── MÍSTA / priroda-krajina ────────────────────────────────────────────
  {
    id: "pl-rozhledna-pepr",
    type: "mista",
    slug: "rozhledna-pepr",
    title: "Rozhledna Pepř",
    description:
      "Teprve před několika lety byla na kopci Pepř asi kilometr od Jílového u Prahy otevřena stejnojmenná rozhledna. Z 30metrového kovového vysílače s vyhlídkovou plošinou v 18 metrech jsou za příznivých podmínek vidět Praha, Brdy, vysílač Cukrák, Votice, zámek Konopiště, Středočeská pahorkatina a samozřejmě Jílové. Rozhledna je volně přístupná.",
    href: "/mista/rozhledna-pepr",
    website: "https://www.navylet.cz/cs/cil/rozhledna-pepr-jilove-u-prahy",
    heroImage: "/brand/photos/pl-rozhledna-pepr.webp",
    lat: 49.88714,
    lng: 14.48325,
    address: "kopec Pepř u Jílového u Prahy",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["vstup-zdarma", "mimo-obec", "venku", "priroda"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-rozhledna-nesteticka-hora",
    type: "mista",
    slug: "rozhledna-nesteticka-hora",
    title: "Rozhledna Neštětická hora",
    description:
      "Ve 20. letech minulého století byl při příležitosti výročí selského povstání postaven na Neštětické hoře asi 3 kilometry od obce Neveklov památník s rozhlednou. Z 16metrové betonové konstrukce jsou vidět celá Česká Sibiř i vysílač Cukrák a Posázaví. Výhledy částečně kryjí vzrostlé stromy. Rozhledna je volně přístupná.",
    href: "/mista/rozhledna-nesteticka-hora",
    website: "https://www.navylet.cz/cs/cil/rozhledna-nesteticka-hora-neveklov",
    heroImage: "/brand/photos/pl-rozhledna-nesteticka-hora.webp",
    lat: 49.76913,
    lng: 14.56843,
    address: "Neštětická hora u Neveklova",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["vstup-zdarma", "mimo-obec", "venku", "priroda"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-vyhlidka-trestibok",
    type: "mista",
    slug: "vyhlidka-trestibok",
    title: "Vyhlídka Třeštibok",
    description:
      "U Petrova jižně od Prahy se na břehu Sázavy k nebi vypíná kopec Zahrádka s přírodní památkou Třeštibok a stejnojmennou skalní vyhlídkou. Vyhlídka Třeštibok dodnes připomíná doby slavných sázavských vorařů, jimž místní silný proud o zdejší skalnatý břeh roztříštil nejeden vor. Dnes Třeštibok odmění své návštěvníky za výstup zajímavými skalními útvary i nádhernými výhledy nejen do kaňonu řeky, ale také na železniční trať známého Posázavského pacifiku a vrch Medník na protější straně údolí. Třeštibok leží na žluté turistické značce vedoucí z Petrova do Jílového u Prahy.",
    href: "/mista/vyhlidka-trestibok",
    website: "https://www.navylet.cz/cs/cil/vyhlidka-trestibok",
    heroImage: "/brand/photos/pl-vyhlidka-trestibok.webp",
    lat: 49.87695,
    lng: 14.45218,
    address: "kopec Zahrádka u Petrova",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["priroda", "mimo-obec", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-vyhlidka-maj",
    type: "mista",
    slug: "vyhlidka-maj",
    title: "Vyhlídka Máj",
    description:
      "Na pravém břehu Vltavy se mezi Slapskou a Štěchovickou přehradou jižně od Prahy nachází jedna z našich nejznámějších a nejkrásnějších vyhlídek, Máj. Nedaleko obce Teletín se tady nad bývalými Svatojánskými proudy tyčí mohutné skalisko, z něhož se otevírají pohledy na meandr Vltavy tam, kde řeka protéká hlubokým kaňonem a stáčí se do tvaru podkovy. Z Teletína sem vede žlutě značená turistická trasa, na skálu je to asi 1,2 kilometru.",
    href: "/mista/vyhlidka-maj",
    website: "https://www.navylet.cz/cs/cil/vyhlidka-maj",
    heroImage: "/brand/photos/pl-vyhlidka-maj.webp",
    lat: 49.83106,
    lng: 14.45602,
    address: "Teletín u Krňan",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["priroda", "mimo-obec", "venku"],
    status: "approved",
    trustLevel: "scraped",
    featured: true,
  },
  {
    id: "pl-smetanova-vyhlidka",
    type: "mista",
    slug: "smetanova-vyhlidka",
    title: "Smetanova vyhlídka",
    description:
      "U Krňan jižně od Prahy se nad meandrem řeky Vltavy vysoko nad Štěchovickou přehradou nachází jedna z nejkrásnějších vyhlídek v oblasti. Smetanova vyhlídka pod vrcholem kopce Kletečná byla zřízena v 70. letech minulého století a pojmenována na počest známého hudebního skladatele Bedřicha Smetany, který ji prý rád navštěvoval a která údajně byla i inspirací pro jeho Mou vlast. Z vyhlídky se otevírají nádherné pohledy na meandr Vltavy.",
    href: "/mista/smetanova-vyhlidka",
    website: "https://www.navylet.cz/cs/cil/smetanova-vyhlidka",
    heroImage: "/brand/photos/pl-smetanova-vyhlidka.webp",
    lat: 49.84844,
    lng: 14.4522,
    address: "Krňany (pod vrcholem Kletečné)",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["priroda", "mimo-obec", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-panska-vyhlidka",
    type: "mista",
    slug: "panska-vyhlidka",
    title: "Panská vyhlídka",
    description:
      "Skalní vyhlídka nad Sázavou kousek od Krhanic. Krátká procházka z obce, výhled na zákrut řeky a okolní lesy. Vhodné na rodinný výlet i odpolední čaj.",
    href: "/mista/panska-vyhlidka",
    lat: 49.875053,
    lng: 14.564747,
    address: "Krhanice 257 42 (severní katastr obce)",
    category: "priroda-krajina",
    subcategory: "vyhlidky",
    tags: ["priroda", "venku", "pro-rodiny"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-naucna-stezka-jilovske-zlate-doly",
    type: "mista",
    slug: "naucna-stezka-jilovske-zlate-doly",
    title: "Naučná stezka Jílovské zlaté doly",
    description:
      "V jižní části Jílového u Prahy se návštěvníci mohou těšit na zajímavé doplnění stálé expozice zlata jílovského Regionálního muzea. Naučná stezka Jílovské zlaté doly má dvě samostatné trasy. Ta okružní je dlouhá 4,5 kilometru a zájemce zavede k historickým zlatým dolům: kapličce svaté Anny u dolu Petr, Kocourským dolům, dolu Pepř i rozhledně na Pepři. Druhá, jednosměrná trasa je dlouhá 5 kilometrů a vede do Dolního Studeného, na Žampach a Kamenný Přívoz, kde návštěvníky čeká přístupná štola svatého Josefa nebo železniční viadukt u Žampachu, který je se svými více než 41 metry nejvyšším kamenným mostem v Evropě.",
    href: "/mista/naucna-stezka-jilovske-zlate-doly",
    website: "https://www.navylet.cz/cs/cil/naucna-stezka-jilovske-zlate-doly",
    heroImage: "/brand/photos/pl-naucna-stezka-jilovske-zlate-doly.webp",
    lat: 49.89479,
    lng: 14.49325,
    address: "Jílové u Prahy (start u kostela sv. Vojtěcha)",
    category: "priroda-krajina",
    subcategory: "naucne-stezky",
    tags: ["pro-rodiny", "mimo-obec", "naucne", "historie", "venku"],
    status: "approved",
    trustLevel: "scraped",
    featured: true,
  },
  {
    id: "pl-naucna-stezka-svatojanske-proudy",
    type: "mista",
    slug: "naucna-stezka-svatojanske-proudy",
    title: "Naučná stezka Svatojánské proudy",
    description:
      "U Štěchovic jižně od Prahy najdou návštěvníci středních Čech hezkou naučnou stezku, která je provede hlubokým skalnatým údolím Vltavy podél bývalých Svatojánských proudů, které jsou dnes zatopené Štěchovickou přehradou. Naučná stezka Svatojánské proudy je dlouhá 8,5 kilometru a na její trase je celkem 15 zastavení s informačními tabulemi. Zastavení jsou doplněná o interaktivní prvky, které ocení hlavně rodiny s dětmi. Trasa vede místy náročným terénem, jen pro pěší. Začíná ve Štěchovicích a pokračuje kolem trampské osady Ztracená naděje (Ztracenka) až do Nových Třebenic.",
    href: "/mista/naucna-stezka-svatojanske-proudy",
    website: "https://www.navylet.cz/cs/cil/naucna-stezka-svatojanske-proudy",
    heroImage: "/brand/photos/pl-naucna-stezka-svatojanske-proudy.webp",
    lat: 49.85163,
    lng: 14.40626,
    address: "Štěchovice (start)",
    category: "priroda-krajina",
    subcategory: "naucne-stezky",
    tags: ["pro-rodiny", "mimo-obec", "naucne", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-posazavska-stezka",
    type: "mista",
    slug: "posazavska-stezka",
    title: "Posázavská stezka",
    description:
      "Naučná stezka prochází údolím řeky Sázavy a po svazích vrchu Medník. Začíná i končí na železniční zastávce Petrov u Prahy. Seznámíte se na ní nejen s přírodními poměry, ale také o stavbě železniční trati Posázavského pacifiku, řece Sázavě, vodáctví a historii trampingu.",
    href: "/mista/posazavska-stezka",
    website: "https://www.kudyznudy.cz/aktivity/posazavska-stezka-ceska-trempska-klasika",
    heroImage: "/brand/photos/pl-posazavska-stezka.webp",
    lat: 49.8561,
    lng: 14.5574,
    address: "Krhanice (úsek stezky podél Sázavy)",
    category: "priroda-krajina",
    subcategory: "naucne-stezky",
    tags: ["pro-rodiny", "naucne", "priroda", "venku"],
    status: "approved",
    trustLevel: "scraped",
    featured: true,
  },
  {
    id: "pl-kopec-dabel",
    type: "mista",
    slug: "kopec-dabel-stred-cech",
    title: "Kopec Ďábel, geometrický střed Čech",
    description:
      "U obce Petrov jižně od Prahy se k nebi tyčí Ďábel. Výrazný kopec nad malou vesničkou se nachází na území přírodního parku Střed Čech a v jeho zalesněném svahu leží údajný geometrický střed regionu. Kdo se sem postaví, bude to mít na hranice s Moravou, Polskem, Německem i Rakouskem 105 kilometrů. Výhledy jsou z vrcholu omezené na místo na východní straně kopce, kde si ti, co se unaví, mohou odpočinout a na informační tabuli si přečíst, jak byl geometrický střed Čech vlastně spočítán. Procházka na 398 metrů vysoký Ďábel není těžká, vhodná i pro rodiny s dětmi.",
    href: "/mista/kopec-dabel-stred-cech",
    website: "https://www.navylet.cz/cs/cil/kopec-dabel-geometricky-stred-cech",
    heroImage: "/brand/photos/pl-kopec-dabel.webp",
    lat: 49.89048,
    lng: 14.43434,
    address: "u Petrova (přírodní park Střed Čech)",
    category: "priroda-krajina",
    subcategory: "lesy-stezky",
    tags: ["pro-rodiny", "mimo-obec", "naucne", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-vlci-rokle",
    type: "mista",
    slug: "vlci-rokle",
    title: "Vlčí rokle",
    description:
      "Vlčí rokle je přírodní památka, která se nachází na území obce Krhanice v okrese Benešov ve Středočeském kraji. Předmětem ochrany je cenný fragment staré acidofilní bučiny spolu s místním geologickým fenoménem – balvanitým rozpadem biotitické žuly. Některé buky jsou zde i více než 200 let staré.",
    href: "/mista/vlci-rokle",
    heroImage: "/brand/photos/pl-vlci-rokle.webp",
    lat: 49.874643,
    lng: 14.531274,
    address: "Krhanice 257 42 (lokalita Vlčí rokle, severozápadní katastr)",
    category: "priroda-krajina",
    subcategory: "lesy-stezky",
    tags: ["priroda", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-sazava-tynec",
    type: "mista",
    slug: "reka-sazava-usek-tynec",
    title: "Řeka Sázava, úsek Týnec",
    description:
      "Úsek Sázavy v Týnci je oblíbeným cílem vodáků, cyklistů i pěších. Stezka vede pod hradem, několik míst pro vstup do vody.",
    href: "/mista/reka-sazava-usek-tynec",
    lat: 49.8369,
    lng: 14.5949,
    address: "Týnec nad Sázavou (řeka Sázava)",
    category: "priroda-krajina",
    subcategory: "rybniky-vodni-plochy",
    tags: ["priroda", "venku", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
  },

  // ─── MÍSTA / rekreace ──────────────────────────────────────────────────
  {
    id: "pl-tank-pro-deti",
    type: "mista",
    slug: "tank-pro-deti",
    title: "Tank pro děti",
    description:
      "Dětské hřiště s ikonickým „Růžovým tankem“ v Krhanicích. Lokální orientační bod, oblíbené místo pro rodiny s malými dětmi.",
    href: "/mista/tank-pro-deti",
    lat: 49.855295,
    lng: 14.541899,
    address: "Krhanice 257 42",
    category: "rekreace",
    subcategory: "detska-hriste",
    tags: ["pro-deti", "pro-rodiny", "venku"],
    status: "approved",
    trustLevel: "scraped",
  },
  {
    id: "pl-kemp-sazava",
    type: "mista",
    slug: "kemp-sazava",
    title: "Kemp Sázava",
    description:
      "Kemp na řece Sázavě v okolí Krhanic. Otevřeno celoročně, rezervace on-line. Hlavní destinace pro letní koupání a stanování v okolí.",
    href: "/mista/kemp-sazava",
    website: "https://www.kempsazava.cz/",
    heroImage: "/brand/photos/kemp-sazava.webp",
    address: "Sázava ev.č. 395, 285 06 Sázava",
    category: "rekreace",
    subcategory: "piknikova-mista",
    tags: ["parkovani", "sezonni", "pro-rodiny", "mimo-obec", "priroda", "celorocni"],
    status: "approved",
    trustLevel: "verified",
    featured: true,
  },
  {
    id: "pl-penzion-club-demon",
    type: "mista",
    slug: "penzion-club-demon-prosecnice",
    title: "Penzion Club Démon",
    description:
      "Penzion s 38 lůžky ve dvoulůžkových pokojích. Kurt s umělým trávníkem, hřiště, ohniště, bezbariérový přístup.",
    href: "/mista/penzion-club-demon-prosecnice",
    address: "Prosečnice 50, 257 42",
    category: "rekreace",
    subcategory: "ohniste",
    tags: ["parkovani", "pro-rodiny", "mimo-obec", "bezbarierove"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "pl-posazavsky-motoracek",
    type: "mista",
    slug: "posazavsky-motoracek",
    title: "Posázavský motoráček",
    description:
      "Posázavský motoráček jezdí z Prahy po trati tzv. Posázavského pacifiku přes Vrané nad Vltavou a Jílové u Prahy do Týnce nad Sázavou a zpět. Vlak jede každou neděli od posledního březnového víkendu do 28. září.",
    href: "/mista/posazavsky-motoracek",
    website: "https://www.kudyznudy.cz/aktivity/posazavsky-motoracek-pravidelny-vikendovy-vlak",
    heroImage: "/brand/photos/pl-posazavsky-motoracek.webp",
    lat: 49.8561,
    lng: 14.5574,
    address: "Stanice Krhanice (na trati Čerčany–Světlá)",
    category: "rekreace",
    subcategory: "piknikova-mista",
    tags: ["historie", "sezonni", "pro-rodiny", "mimo-obec"],
    status: "approved",
    trustLevel: "scraped",
    featured: true,
  },
  {
    id: "pl-bisport-tynec",
    type: "mista",
    slug: "bisport-pujcovna-lodi-tynec",
    title: "Bisport, půjčovna lodí a kol",
    description:
      "Máte volný den, víkend nebo týden a ještě nevíte, jak ho využít? Potom neváhejte a vyzkoušejte netradiční zážitek. Bisport v Týnci nad Sázavou půjčuje kanoe, rafty a kajaky na vodácké výlety na řece Sázavě.",
    href: "/mista/bisport-pujcovna-lodi-tynec",
    website: "https://www.kudyznudy.cz/aktivity/bisport-jednicka-mezi-pujcovnami-sportovniho-vyb",
    heroImage: "/brand/photos/pl-bisport-tynec.webp",
    lat: 49.8369,
    lng: 14.5949,
    address: "Ing. Fr. Janečka 511, 257 41 Týnec nad Sázavou",
    contactPhone: "+420 777 335 618",
    contactEmail: "info@bisport.cz",
    category: "rekreace",
    subcategory: "piknikova-mista",
    tags: ["sezonni", "mimo-obec", "pro-rodiny"],
    status: "approved",
    trustLevel: "scraped",
  },

  // ─── MÍSTA / prakticka-mista ────────────────────────────────────────────
  {
    id: "sv-alzabox-krhanice",
    type: "mista",
    slug: "alzabox-krhanice",
    title: "AlzaBox Krhanice",
    description:
      "Multi-carrier výdejní bod u základní školy. Vyzvedněte si zásilky Alza, DHL, PPL, DPD, GLS, Balíkovna i One Point. Provoz nepřetržitě, 24/7.",
    href: "/mista/alzabox-krhanice",
    lat: 49.8533701,
    lng: 14.5575275,
    address: "Krhanice 149, 257 42 (u ZŠ)",
    hours: "Non-stop, 24/7",
    category: "prakticka-mista",
    subcategory: "posta",
    tags: ["parkovani", "v-centru"],
    status: "approved",
    trustLevel: "verified",
    featured: true,
  },

  // ─── GASTRO ────────────────────────────────────────────────────────────
  {
    id: "pl-hospoda-na-hristi",
    type: "gastro",
    slug: "hospoda-na-hristi",
    title: "Hospoda Na hřišti",
    description:
      "Hospoda u sokolského hřiště v Krhanicích. Posezení v terénu, akce TJ Sokol.",
    href: "/mista/hospoda-na-hristi",
    social: {
      facebook: "https://www.facebook.com/p/Hospoda-Na-h%C5%99i%C5%A1ti-100063540310514/",
    },
    // Sokolovna Krhanice. Pin sits on the sokolské hřiště to match the
    // Anenská zábava + Hasičský ples pin cluster in the village center.
    lat: 49.8557,
    lng: 14.5580,
    address: "Krhanice (sokolské hřiště, přesnou adresu doplníme)",
    category: "hospody-bary",
    subcategory: "pivnice",
    tags: ["pejskari-vitani"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "pl-restaurace-na-zastavce",
    type: "gastro",
    slug: "restaurace-na-zastavce-prosecnice",
    title: "Restaurace Na zastávce",
    description:
      "Provoz restaurace s nabídkou pokrmů teplé a studené kuchyně. Hodnocení 4,9 z 84 recenzí.",
    href: "/mista/restaurace-na-zastavce-prosecnice",
    // Prosečnice 19 -- ulica restaurace u zastávky vlaku, přibližný střed
    // osady. Klient přesné souřadnice doplní v Sanity.
    lat: 49.7950,
    lng: 14.5920,
    address: "Prosečnice 19, 257 42",
    category: "restaurace",
    subcategory: "ceska-kuchyne",
    tags: ["pro-rodiny", "parkovani"],
    status: "approved",
    trustLevel: "verified",
    featured: true,
  },
  {
    id: "pl-pohostinstvi-drevak",
    type: "gastro",
    slug: "pohostinstvi-drevak-prosecnice",
    title: "Pohostinství Dřevák",
    description:
      "Pohostinství v Prosečnici (část obce Krhanice).",
    href: "/mista/pohostinstvi-drevak-prosecnice",
    // Prosečnice center, přibližný offset od Restaurace Na zastávce, aby se
    // piny na mapě nepřekrývaly. Klient v Sanity upřesní.
    lat: 49.7965,
    lng: 14.5905,
    address: "Prosečnice (část obce Krhanice), 257 42",
    category: "hospody-bary",
    subcategory: "pivnice",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── OBCHODY ───────────────────────────────────────────────────────────
  {
    id: "rm-smisene-zbozi",
    type: "obchody",
    slug: "smisene-zbozi-krhanice",
    title: "Smíšené zboží Krhanice",
    description:
      "Vesnický obchod v centru Krhanic. Potraviny, nápoje a běžná drogerie pro každodenní potřebu. V provozu denně od rána, neděli od osmi. V obchodě funguje výdejní místo PPL.",
    href: "/mista/smisene-zbozi-krhanice",
    lat: 49.855353,
    lng: 14.557239,
    address: "Krhanice 13, 257 42",
    hours: "Po-So 7:00-19:00, Ne 8:00-19:00",
    category: "potraviny-napoje",
    subcategory: "samoobsluhy",
    tags: ["v-centru"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 702 145",
    featured: true,
  },
  {
    id: "rm-pekarstvi-novotni",
    type: "obchody",
    slug: "rodinne-pekarstvi-novotni",
    title: "Rodinné pekařství Novotní (provozovna U Krkovičky)",
    description:
      "Prodejna pekárny JARNO Markéty a Roberta Novotných. Domácí chléb, pečivo, buchty, koláče, dukátové buchtičky a knedlíky. Provoz v hospodě U Krkovičky naproti obecnímu úřadu, prodejní dny tři týdně.",
    href: "/mista/rodinne-pekarstvi-novotni",
    website: "https://www.jarno.cz/",
    lat: 49.856555,
    lng: 14.559594,
    address: "Krhanice, hospoda U Krkovičky (naproti OÚ)",
    hours: "Út, Čt, Ne 15:00-17:30",
    category: "pekarstvi-cukrarstvi",
    subcategory: "pekarny",
    tags: ["regionalni-produkt", "lokalni-vyroba", "v-centru"],
    status: "approved",
    trustLevel: "verified",
    relatedEntries: ["sv-jarno-pekarna"],
  },
  {
    id: "sv-jarno-pekarna",
    type: "obchody",
    slug: "jarno-pekarna",
    title: "JARNO, s.r.o., rodinná pekárna",
    description:
      "Rodinná pekárna v Krhanicích. Široký sortiment z kvalitních surovin. Pekárnu založili v roce 1996 otec a syn Novotní, vyrábí tradiční sladké a slané výrobky ručně podle starých receptur. Mezi nejznámější patří dukátové buchtičky, škvarková houska, koblihy od Krkovičky, švestkový či meruňkový koláč a perník plněný marmeládou. Provozovna pro veřejnost: pekařství U Krkovičky naproti obecnímu úřadu.",
    href: "/mista/jarno-pekarna",
    website: "https://www.jarno.cz/",
    address: "Krhanice 62, 257 42",
    category: "pekarstvi-cukrarstvi",
    subcategory: "pekarny",
    tags: ["regionalni-produkt", "lokalni-vyroba", "tradice"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 722 971 136",
    contactEmail: "jarno@jarno.cz",
    relatedEntries: ["rm-pekarstvi-novotni"],
  },
  {
    id: "sv-faho-knedliky",
    type: "obchody",
    slug: "faho-vyroba-prodej",
    title: "FAHO výroba-prodej a.s.",
    description:
      "Naše výrobna nabízí široký výběr ručně vyrobených knedlíků pro obchody, restaurace a jídelny.",
    href: "/mista/faho-vyroba-prodej",
    website: "https://www.faho.cz/",
    lat: 49.8569,
    lng: 14.5577,
    address: "Krhanice 7, 257 42",
    category: "potraviny-napoje",
    subcategory: "regionalni-produkty",
    tags: ["lokalni-vyroba", "regionalni-produkt"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 702 272",
    contactEmail: "fahosro@faho.cz",
  },
  {
    id: "rm-keramika-jordanova",
    type: "obchody",
    slug: "keramika-marketa-jordanova",
    title: "Keramika Markéta Jordánová",
    description:
      "Ruční keramika z krhanického ateliéru. Mísy, dárkové předměty, zakázková výroba. Online prodej přes Fler.cz.",
    href: "/mista/keramika-marketa-jordanova",
    website: "https://www.fler.cz",
    lat: 49.8489976,
    lng: 14.5505675,
    address: "Krhanice 125, 257 42",
    category: "specializovane",
    subcategory: "keramika-remeslo",
    tags: ["lokalni-vyroba", "remeslo"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 734 470 878",
  },
  {
    id: "rm-mydlarna-leontynka",
    type: "obchody",
    slug: "mydlarna-leontynka",
    title: "Mýdlárna Leontýnka",
    description:
      "Náš zájem o vývoj a kreativní tvorbu ekologických mýdel z přírodních surovin vznikl z touhy přispět něčím pozitivním pro nás samotné, planetu Zemi i pro její další zájemce.",
    href: "/mista/mydlarna-leontynka",
    website: "https://www.mydlarnaleontynka.cz",
    lat: 49.8537888,
    lng: 14.5544963,
    address: "Krhanice 238, 257 42",
    category: "specializovane",
    subcategory: "keramika-remeslo",
    tags: ["lokalni-vyroba", "bio-eko", "remeslo"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 777 635 736",
  },
  {
    id: "sv-porcelan-mulier",
    type: "obchody",
    slug: "porcelanova-vyroba-mulier",
    title: "Porcelánová výroba Mulier, s.r.o.",
    description:
      "Výroba porcelánu v Krhanicích.",
    href: "/mista/porcelanova-vyroba-mulier",
    address: "Krhanice 71, 257 42",
    category: "specializovane",
    subcategory: "keramika-remeslo",
    tags: ["lokalni-vyroba", "remeslo"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-vinovintage",
    type: "obchody",
    slug: "vinovintage",
    title: "Vinovintage.cz, online vinotéka",
    description:
      "Online vinotéka se sídlem v Krhanicích.",
    href: "/mista/vinovintage",
    website: "https://vinovintage.cz/",
    address: "Krhanice 20, 257 42",
    category: "potraviny-napoje",
    subcategory: "vinoteky",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-denny-rose",
    type: "obchody",
    slug: "denny-rose",
    title: "DENNY ROSE",
    description:
      "Italská dámská móda.",
    href: "/mista/denny-rose",
    address: "Krhanice 84, 257 42",
    category: "moda",
    subcategory: "odevy",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-zahradni-studio-strnadova",
    type: "obchody",
    slug: "zahradni-studio-strnadova",
    title: "Zahradní studio Strnadová",
    description:
      "Návrh a realizace zahrad v Krhanicích a okolí.",
    href: "/mista/zahradni-studio-strnadova",
    address: "Krhanice 291, 257 42",
    category: "pro-domov",
    subcategory: "zahradnictvi",
    tags: ["lokalni-vyroba"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-abakron",
    type: "obchody",
    slug: "abakron-zulovy-lom",
    title: "ABAKRON, s.r.o.",
    description:
      "Žulový lom a kamenické výrobky v Prosečnici.",
    href: "/mista/abakron-zulovy-lom",
    address: "Prosečnice 47, 257 42",
    category: "pro-domov",
    subcategory: "stavebniny",
    tags: ["lokalni-vyroba"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-kamen-zbraslav",
    type: "obchody",
    slug: "kamenolom-krhanice-kamen-zbraslav",
    title: "Kamenolom Krhanice, KÁMEN Zbraslav",
    description:
      "Velký kamenolom v Prosečnici, jeden z hlavních zaměstnavatelů v oblasti.",
    href: "/mista/kamenolom-krhanice-kamen-zbraslav",
    address: "Prosečnice, 257 42",
    category: "pro-domov",
    subcategory: "stavebniny",
    tags: ["lokalni-vyroba"],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── SLUŽBY / vzdelavani ───────────────────────────────────────────────
  {
    id: "sv-zs-krhanice",
    type: "sluzby",
    slug: "zakladni-skola-krhanice",
    title: "Základní škola Krhanice",
    description:
      "Plně organizovaná škola s 1. až 9. ročníkem, vlastní školní vzdělávací program „Škola pro budoucnost“. Družina pro 60 žáků ve dvou odděleních a školní jídelna v budově. Maximální kapacita 200 žáků. Pravidelně se zapojuje do programu Doučování žáků, Digitalizujeme školu, OP JAK a Ovoce, zelenina a mléko do škol. Ředitelka Mgr. Bc. Věra Ráblová.",
    href: "/sluzby/zakladni-skola-krhanice",
    website: "https://www.zskrhanice.cz/",
    lat: 49.8533701,
    lng: 14.5575275,
    address: "Krhanice 149, 257 42",
    hours: "Vyučování 7:55–14:20, sekretariát v provozních dnech školy",
    category: "vzdelavani",
    subcategory: "zakladni-skola",
    tags: ["pro-deti"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 702 146",
    contactEmail: "skola@zskrhanice.cz",
    featured: true,
  },
  {
    id: "sv-ms-krhanice",
    type: "sluzby",
    slug: "materska-skola-krhanice",
    title: "Mateřská škola Krhanice",
    description:
      "Naším cílem je hravou, radostnou a zábavnou formou vypěstovat v dětech kladný a ohleduplný vztah ke svému zdraví, lidem, přírodě a světu kolem nás.",
    href: "/sluzby/materska-skola-krhanice",
    website: "http://www.mskrhanice.cz/",
    heroImage: "/brand/photos/sv-ms-krhanice.webp",
    address: "Krhanice (poblíž ZŠ)",
    hours: "Po-Pá 6:30-16:30",
    price: "1 200 Kč/měsíc + strava",
    category: "vzdelavani",
    subcategory: "materska-skola",
    tags: ["pro-deti"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 733 120 093",
    contactEmail: "ms.krhanice@seznam.cz",
    featured: true,
  },
  {
    id: "sv-dr-klutz",
    type: "sluzby",
    slug: "dr-klutz-english-theatre",
    title: "Dr. Klutz, anglické divadlo",
    description:
      "Anglické vzdělávací divadlo pro základní školy.",
    href: "/sluzby/dr-klutz-english-theatre",
    website: "https://drklutz.com/",
    address: "Krhanice 181, 257 42",
    category: "vzdelavani",
    subcategory: "jazykovka",
    tags: ["pro-deti"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-zpev-hlavnickova",
    type: "sluzby",
    slug: "vyuka-zpevu-leona-hlavnickova",
    title: "Výuka zpěvu, Leona Hlavničková",
    description:
      "Individuální výuka zpěvu (mýdlárna Leontýnka, stejná osoba).",
    href: "/sluzby/vyuka-zpevu-leona-hlavnickova",
    address: "Krhanice 238, 257 42",
    category: "vzdelavani",
    subcategory: "kurzy",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── SLUŽBY / zdravi ───────────────────────────────────────────────────
  {
    id: "sv-ordinace-prakticky-lekar",
    type: "sluzby",
    slug: "ordinace-mudr-machacek",
    title: "MUDr. Tomáš Macháček, praktický lékař",
    description:
      "Ordinace praktického lékaře pro dospělé v Krhanicích.",
    href: "/sluzby/ordinace-mudr-machacek",
    lat: 49.8513926,
    lng: 14.550525,
    address: "Krhanice 70, 257 42",
    category: "zdravi",
    subcategory: "prakticky-lekar",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 701 440",
    featured: true,
  },
  {
    id: "rm-veterinakrskova",
    type: "sluzby",
    slug: "veterinarka-dana-krskova",
    title: "Veterinářka MVDr. Dana Kršková",
    description:
      "Veterinární ordinace v Krhanicích. Drobná zvířata i hospodářská, prevence i ošetření, ordinační hodiny každý všední den odpoledne.",
    href: "/sluzby/veterinarka-dana-krskova",
    website: "https://veterinakrhanice.cz",
    lat: 49.8560713,
    lng: 14.5537363,
    address: "Krhanice 169, 257 42",
    hours: "Po-Pá 16:00-18:00",
    category: "zdravi",
    subcategory: "veterinar",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 607 906 505, +420 317 702 262",
    contactEmail: "dana_krskova@volny.cz",
  },
  {
    id: "sv-mikolasova-zubni-lab",
    type: "sluzby",
    slug: "marie-mikolasova-zubni-laborator",
    title: "Marie Mikolášová, zubní laboratoř",
    description:
      "Stomatologická laboratoř v Krhanicích. Výroba fixních i snímatelných zubních protéz.",
    href: "/sluzby/marie-mikolasova-zubni-laborator",
    address: "Krhanice 188, 257 42",
    category: "zdravi",
    subcategory: "zubar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 702 250",
  },
  {
    id: "sv-sarlota-resort",
    type: "sluzby",
    slug: "sarlota-resort-care",
    title: "Šarlota Resort & Care",
    description:
      "Domov pro seniory a lázně v Prosečnici. Kapacita 100 lůžek, bezbariérový přístup. Fyzioterapie, ergoterapie a vodoléčba.",
    href: "/sluzby/sarlota-resort-care",
    address: "Prosečnice 10, 257 42",
    category: "zdravi",
    subcategory: "fyzioterapie",
    tags: ["pro-seniory", "bezbarierove", "parkovani"],
    status: "approved",
    trustLevel: "verified",
    featured: true,
  },

  // ─── SLUŽBY / krasa-pece ───────────────────────────────────────────────
  {
    id: "rm-masaze-micova",
    type: "sluzby",
    slug: "masaze-kristyna-micova",
    title: "Sportovní a relaxační masáže Kristýna Míčová",
    description:
      "Jmenuji se Kristýna Míčová, narodila jsem se v Praze v roce 1985. Jsem žena, milující manželka a maminka tří dětí. Masáže u klienta doma, v dosahu do 20 km kolem Krhanic.",
    href: "/sluzby/masaze-kristyna-micova",
    website: "https://masazekrhanice.cz/",
    lat: 49.8556,
    lng: 14.5570,
    address: "Krhanice (mobilní)",
    hours: "Dle objednávek",
    category: "krasa-pece",
    subcategory: "masaze",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 776 665 165",
    contactEmail: "tina.drtina@gmail.com",
  },
  {
    id: "rm-pilatova-kadernictvi",
    type: "sluzby",
    slug: "pilatova-milena-kadernictvi",
    title: "Milena Pilátová, kadeřnictví",
    description:
      "Kadeřnictví v Krhanicích.",
    href: "/sluzby/pilatova-milena-kadernictvi",
    lat: 49.8571538,
    lng: 14.5616213,
    address: "Krhanice 122, 257 42",
    category: "krasa-pece",
    subcategory: "kadernictvi",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 728 596",
  },
  {
    id: "sv-kadernictvi-petra-prosecnice",
    type: "sluzby",
    slug: "kadernictvi-by-petra-prosecnice",
    title: "Kadeřnictví by Petra",
    description:
      "Kadeřnictví v Prosečnici (část obce Krhanice).",
    href: "/sluzby/kadernictvi-by-petra-prosecnice",
    address: "Prosečnice 39, 257 42",
    category: "krasa-pece",
    subcategory: "kadernictvi",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-pedi-moni",
    type: "sluzby",
    slug: "pedi-moni-prosecnice",
    title: "Pedi-moni",
    description:
      "Suchá pedikúra v Prosečnici. Hodnocení 5,0 z 9 recenzí.",
    href: "/sluzby/pedi-moni-prosecnice",
    address: "Prosečnice 72, 257 42",
    category: "krasa-pece",
    subcategory: "pedikura",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── SLUŽBY / bydleni-stavba ───────────────────────────────────────────
  {
    id: "rm-velei21",
    type: "sluzby",
    slug: "velei-21",
    title: "VELEI 21",
    description:
      "Na začátku byla jasná vize: stavět ze dřeva tak, aby výsledné dílo beze zbytku odpovídalo našim nárokům na kvalitu, estetiku a funkčnost.",
    href: "/sluzby/velei-21",
    website: "https://www.velei21.cz",
    heroImage: "/brand/photos/rm-velei21.webp",
    lat: 49.8572431,
    lng: 14.5650591,
    address: "Krhanice 293, 257 42",
    hours: "Po dohodě",
    category: "bydleni-stavba",
    subcategory: "stavebni-firmy",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 606 840 662",
    contactEmail: "r.havel@icloud.com",
  },
  {
    id: "rm-zednictvi-jaros",
    type: "sluzby",
    slug: "zednictvi-karel-jaros",
    title: "Zednictví Karel Jaroš",
    description:
      "Zednické práce, omítky, drobné stavební úpravy. Provoz v Krhanicích, dohoda telefonicky.",
    href: "/sluzby/zednictvi-karel-jaros",
    lat: 49.8596749,
    lng: 14.5592258,
    address: "Krhanice 270, 257 42",
    category: "bydleni-stavba",
    subcategory: "zednik",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 777 305 744",
  },
  {
    id: "rm-bfj-stav",
    type: "sluzby",
    slug: "bfj-stav",
    title: "BFJ stav",
    description:
      "Stavební firma se sídlem v Krhanicích. Stavební a montážní práce, dohoda telefonicky.",
    href: "/sluzby/bfj-stav",
    lat: 49.8528851,
    lng: 14.5546438,
    address: "Krhanice 255, 257 42",
    category: "bydleni-stavba",
    subcategory: "stavebni-firmy",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 606 063 198",
  },
  {
    id: "rm-tesar-visvarda",
    type: "sluzby",
    slug: "jan-visvarda",
    title: "Jan Višvarda, tesař",
    description:
      "Tesařské, klempířské a pokrývačské práce. Krovy, střechy, klempířina, opravy i nové realizace.",
    href: "/sluzby/jan-visvarda",
    lat: 49.8585388,
    lng: 14.5619913,
    address: "Krhanice 260, 257 42",
    category: "bydleni-stavba",
    subcategory: "klempir",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 605 933 933",
  },
  {
    id: "sv-mv-truhlarstvi",
    type: "sluzby",
    slug: "mv-truhlarstvi",
    title: "MV Truhlářství",
    description:
      "Truhlářské práce v Krhanicích.",
    href: "/sluzby/mv-truhlarstvi",
    address: "Krhanice 316, 257 42",
    category: "bydleni-stavba",
    subcategory: "stavebni-firmy",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-okna-blahut",
    type: "sluzby",
    slug: "okna-dvere-roman-blahut",
    title: "Okna a dveře Roman Blahút",
    description:
      "Prodej a montáž oken a dveří.",
    href: "/sluzby/okna-dvere-roman-blahut",
    address: "Krhanice 163, 257 42",
    category: "bydleni-stavba",
    subcategory: "sklenari",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "rm-alltech",
    type: "sluzby",
    slug: "alltech",
    title: "AllTech, s.r.o.",
    description:
      "Vodoinstalatérství a topenářství v Krhanicích. Montáž a revize rozvodů vody, topení a plynu, kotle, radiátory, sanitární vybavení.",
    href: "/sluzby/alltech",
    lat: 49.8607026,
    lng: 14.5592475,
    address: "Krhanice 38, 257 42",
    category: "bydleni-stavba",
    subcategory: "instalater",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-instalaterstvi-hudcek",
    type: "sluzby",
    slug: "instalaterstvi-jaroslav-hudcek",
    title: "Instalatérství Jaroslav Hudček",
    description:
      "Instalatérské práce: voda, topení, kanalizace, sádrokarton.",
    href: "/sluzby/instalaterstvi-jaroslav-hudcek",
    address: "Krhanice 59, 257 42",
    category: "bydleni-stavba",
    subcategory: "instalater",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-energozon",
    type: "sluzby",
    slug: "energozon",
    title: "ENERGOZON",
    description:
      "Tepelná čerpadla pro domácnosti i firmy.",
    href: "/sluzby/energozon",
    address: "Krhanice 74, 257 42",
    category: "bydleni-stavba",
    subcategory: "instalater",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "rm-elektrosluzba-kozel",
    type: "sluzby",
    slug: "ales-kozel-elektrosluzba",
    title: "Aleš Kozel, Elektroslužba",
    description:
      "Vítáme Vás na stránkách společnosti Elektroslužba – Aleš Kozel. Firma Elektroslužba byla založena v roce 1990. Elektroinstalace, dodávky a opravy veřejného osvětlení, NN přípojky, výroba certifikovaných rozvaděčů, revize.",
    href: "/sluzby/ales-kozel-elektrosluzba",
    website: "http://www.ak-elektro.cz",
    lat: 49.8575813,
    lng: 14.5607038,
    address: "Krhanice 88, 257 42",
    category: "bydleni-stavba",
    subcategory: "elektrikar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 602 268 621",
    contactEmail: "ak@ak-elektro.cz",
  },
  {
    id: "sv-pin-292",
    type: "sluzby",
    slug: "pin-292-fotovoltaika",
    title: "PIN 292, s.r.o.",
    description:
      "Fotovoltaika, vodní a solární energetika v Krhanicích.",
    href: "/sluzby/pin-292-fotovoltaika",
    address: "Krhanice 236, 257 42",
    category: "bydleni-stavba",
    subcategory: "elektrikar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-antelek",
    type: "sluzby",
    slug: "antelek",
    title: "ANTELEK",
    description:
      "Antény, kabeláže a kamerové systémy.",
    href: "/sluzby/antelek",
    address: "Krhanice 259, 257 42",
    category: "bydleni-stavba",
    subcategory: "elektrikar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-instalace-anten",
    type: "sluzby",
    slug: "instalace-a-servis-anten",
    title: "Instalace a servis antén",
    description:
      "Instalace a servis antén, partner Skylink.",
    href: "/sluzby/instalace-a-servis-anten",
    address: "Krhanice 185, 257 42",
    category: "bydleni-stavba",
    subcategory: "elektrikar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-elektroprace-bozik",
    type: "sluzby",
    slug: "elektroprace-jan-bozik",
    title: "Elektropráce Jan Božík",
    description:
      "Silnoproud i slaboproud od roku 2010.",
    href: "/sluzby/elektroprace-jan-bozik",
    address: "Krhanice ev.č. 37, 257 42",
    category: "bydleni-stavba",
    subcategory: "elektrikar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-kominictvi-cermak",
    type: "sluzby",
    slug: "kominictvi-tony-cermak",
    title: "Kominictví Tony Čermák",
    description:
      "Veškeré služby spojené s komínem od pravidelných ročních kontrol až po vložkování a frézování. Nabízíme kontroly komínů, jejich vložkování, frézování, čištění kachlových sporáků a opravy šamotu v krbech.",
    href: "/sluzby/kominictvi-tony-cermak",
    website: "https://www.kominictvitonycermak.cz/",
    address: "Krhanice 222, 257 42",
    hours: "Po-Pá 8:00-18:00",
    category: "bydleni-stavba",
    subcategory: "kominik",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 704 284 264",
    contactEmail: "tony.kominik@seznam.cz",
  },

  // ─── SLUŽBY / auto-doprava ─────────────────────────────────────────────
  {
    id: "sv-quad-moto-shop",
    type: "sluzby",
    slug: "quad-moto-shop",
    title: "QUAD-MOTO SHOP",
    description:
      "Prodej elektrických skútrů a motocyklů, čtyřkolek a dalších značek (UM, Zontes, Masai, Keeway, Sym, Benelli, CFMOTO, Yasan, PEDA, DAYI). Servis ATV, QUAD i MOTO. Úpravy čtyřkolek pro hendikepované. O víkendech a svátcích po dohodě.",
    href: "/sluzby/quad-moto-shop",
    website: "https://www.quad-motoshop.cz/",
    address: "Krhanice 16, 257 42",
    hours: "Po dohodě (i víkendy a svátky)",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 601 593 090",
    contactEmail: "quad-motoshop@seznam.cz",
  },
  {
    id: "sv-autodilna-bazant",
    type: "sluzby",
    slug: "autodilna-bazant",
    title: "Autodílna Bažant",
    description:
      "Autoservisní dílna Jana Bažanta v Krhanicích. Bez vlastního webu, kontakt telefonicky.",
    href: "/sluzby/autodilna-bazant",
    address: "Krhanice 122, 257 42",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 702 140",
  },
  {
    id: "sv-auto-moto-tyno",
    type: "sluzby",
    slug: "auto-moto-tyno",
    title: "Auto-moto-tyno",
    description:
      "Provoz autoservisu, autodopravy a pneuservisu. Prodáváme náhradní díly.",
    href: "/sluzby/auto-moto-tyno",
    heroImage: "/brand/photos/auto-moto-tyno.webp",
    address: "Krhanice 189, 257 42",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 317 789 273",
  },
  {
    id: "sv-autolakovna-standa",
    type: "sluzby",
    slug: "autolakovna-standa",
    title: "Autolakovna Standa",
    description:
      "Nabízíme autolakýrnické a drobné karosářské práce.",
    href: "/sluzby/autolakovna-standa",
    address: "Krhanice 269, 257 42",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-autodilna-cerny",
    type: "sluzby",
    slug: "autodilna-cerny-prosecnice",
    title: "Autodílna Černý",
    description:
      "Autodílna zabývající se opravami a individuálními úpravami osobních, dodávkových a terénních vozidel.",
    href: "/sluzby/autodilna-cerny-prosecnice",
    address: "Prosečnice 1, 257 42",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-tmcar-autoservis",
    type: "sluzby",
    slug: "tmcar-autoservis",
    title: "TMCAR autoservis",
    description:
      "Autoservis v Krhanicích (dříve EUROTYRES).",
    href: "/sluzby/tmcar-autoservis",
    address: "Krhanice 233, 257 42",
    category: "auto-doprava",
    subcategory: "autoservis",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-ad-mlejnek",
    type: "sluzby",
    slug: "autodoprava-mlejnek",
    title: "AD Mlejnek, autodoprava",
    description:
      "Provozujeme autodopravu v Krhanicích a okolí.",
    href: "/sluzby/autodoprava-mlejnek",
    address: "Krhanice 215, 257 42",
    category: "auto-doprava",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── SLUŽBY / profesni-financni ─────────────────────────────────────────
  {
    id: "sv-valaskova-ucetnictvi",
    type: "sluzby",
    slug: "sona-valaskova-ucetnictvi",
    title: "Soňa Valášková, účetnictví",
    description:
      "Účetnictví a daně pro fyzické i právnické osoby.",
    href: "/sluzby/sona-valaskova-ucetnictvi",
    address: "Krhanice 277, 257 42",
    category: "profesni-financni",
    subcategory: "ucetni",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-brabec-yourwin",
    type: "sluzby",
    slug: "ludek-brabec-your-win",
    title: "Ing. Luděk Brabec, YOUR WIN",
    description:
      "Poradenství a pomoc s EU dotacemi.",
    href: "/sluzby/ludek-brabec-your-win",
    address: "Krhanice 165, 257 42",
    category: "profesni-financni",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-koci-reality",
    type: "sluzby",
    slug: "lucie-koci-reality",
    title: "Specialista na Posázaví, Lucie Kočí",
    description:
      "Realitní makléřka pro region Posázaví, na trhu od roku 1991.",
    href: "/sluzby/lucie-koci-reality",
    address: "Prosečnice ev.č. 240, 257 42",
    category: "profesni-financni",
    subcategory: "realitka",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },

  // ─── SLUŽBY / pro-domacnost-ostatni ─────────────────────────────────────
  {
    id: "rm-itservis-petlach",
    type: "sluzby",
    slug: "it-servis-tomas-petlach",
    title: "IT servis Tomáš Petlach",
    description:
      "Naše firma poskytuje širokou škálu služeb v oblasti IT. Řídíme se hodnotami, jako jsou přátelský přístup, spolehlivost, profesionalita a férovost.",
    href: "/sluzby/it-servis-tomas-petlach",
    website: "https://www.itposazavi.cz",
    heroImage: "/brand/photos/rm-itservis-petlach.webp",
    lat: 49.8557201,
    lng: 14.5591271,
    address: "Krhanice 309, 257 42",
    hours: "Po-Pá 9:00-18:00, So-Ne 10:00-14:00",
    category: "pro-domacnost-ostatni",
    subcategory: "it-web",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 724 088 077",
    contactEmail: "itposazavi@gmail.com",
  },
  {
    id: "sv-anfilov",
    type: "sluzby",
    slug: "anfilov-brand-design",
    title: "ANFILOV, brand design (Simon Anfilov)",
    description:
      "Studio vizuální komunikace v Krhanicích. Tvorba značky od strategie po design — naming, logo, vizuální identita a webdesign pro firmy a podnikatele. „Vdechnu život vaší značce.“",
    href: "/sluzby/anfilov-brand-design",
    website: "https://anfilov.cz/",
    social: {
      facebook: "https://www.facebook.com/anfilov/",
    },
    heroImage: "/brand/photos/anfilov-symbol.webp",
    address: "Krhanice 275, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "it-web",
    tags: [],
    status: "approved",
    trustLevel: "verified",
    contactPhone: "+420 602 262 633",
    contactEmail: "simon@anfilov.cz",
  },
  {
    id: "sv-zita-nielsen",
    type: "sluzby",
    slug: "zita-nielsen-grafika",
    title: "Ing. Zita Nielsen, grafika a DTP",
    description:
      "Grafické návrhy a předtisková příprava.",
    href: "/sluzby/zita-nielsen-grafika",
    address: "Krhanice 181, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "it-web",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-foto-dostalkova",
    type: "sluzby",
    slug: "fotoatelier-magdalena-dostalkova",
    title: "Fotoateliér Magdaléna Dostálková",
    description:
      "Portrétní focení a fotoknihy.",
    href: "/sluzby/fotoatelier-magdalena-dostalkova",
    address: "Krhanice 46, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "foto",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-aafoto",
    type: "sluzby",
    slug: "aafoto",
    title: "AAFOTO",
    description:
      "Profesionální fotograf v Krhanicích.",
    href: "/sluzby/aafoto",
    address: "Krhanice 197, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "foto",
    tags: ["rezervace-nutna"],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-jan-balacek-hodiny",
    type: "sluzby",
    slug: "jan-balacek-vezni-hodiny",
    title: "Jan Baláček, opravy věžních hodin",
    description:
      "Opravy, údržbu a repase věžních hodin. Specializované řemeslo, v České republice vzácné.",
    href: "/sluzby/jan-balacek-vezni-hodiny",
    address: "Krhanice 36, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "hodinar",
    tags: ["remeslo"],
    status: "approved",
    trustLevel: "verified",
    featured: true,
  },
  {
    id: "sv-smolik-vahy",
    type: "sluzby",
    slug: "vladimir-smolik-servis-vah",
    title: "Vladimír Smolík, servis vah",
    description:
      "Servis a kalibrace vah.",
    href: "/sluzby/vladimir-smolik-servis-vah",
    address: "Krhanice ev.č. 70, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "hodinar",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-jerman",
    type: "sluzby",
    slug: "jerman-sekani-travy",
    title: "JERMAN, s.r.o.",
    description:
      "Sekání trávy a údržba zelených ploch.",
    href: "/sluzby/jerman-sekani-travy",
    address: "Krhanice 197, 257 42",
    category: "pro-domacnost-ostatni",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-koloros-production",
    type: "sluzby",
    slug: "koloros-production",
    title: "KOLOROS Production",
    description:
      "Pronájem světel, zvukové techniky a mobilních pódií.",
    href: "/sluzby/koloros-production",
    address: "Krhanice 235, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "svatebni-agentura",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
  {
    id: "sv-fstage",
    type: "sluzby",
    slug: "fstage",
    title: "Fstage",
    description:
      "Pronájem ozvučení, osvětlení a pódií pro akce.",
    href: "/sluzby/fstage",
    address: "Krhanice 184, 257 42",
    category: "pro-domacnost-ostatni",
    subcategory: "svatebni-agentura",
    tags: [],
    status: "approved",
    trustLevel: "verified",
  },
];

export const entries: Entry[] = [...events, ...directory];

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
    href: "/obec/22duben-den-zeme",
    category: "kultura",
  },
  {
    id: "n-kanalizace-cov-2026",
    slug: "informace-o-akci-krhanice-kanalizace-a-cov-i-etapa",
    title: "Krhanice, kanalizace a ČOV: I. etapa odstartovala",
    description:
      "Obec spouští projektovou přípravu kanalizace a čistírny odpadních vod ve spolupráci s firmou Projekty Vodam. Příprava potrvá zhruba 40 týdnů od poloviny března 2026, financování pokryje obec kombinací dotace, státní půjčky a úvěru.",
    date: "2026-03-11",
    href: "/obec/informace-o-akci-krhanice-kanalizace-a-cov-i-etapa",
    category: "urad",
  },
  {
    id: "n-komposter-2026",
    slug: "neuvazujete-nad-porizenim-noveho-komposteru",
    title: "Pořiďte si kompostér s příspěvkem obce",
    description:
      "Obec poskytuje občanům s trvalým pobytem příspěvek až 2 000 Kč na pořízení kompostéru o objemu od 600 litrů. Pro rok 2026 je vyčleněno 30 000 Kč. Stačí předložit fakturu a doklad o zaplacení do 16. prosince 2026.",
    date: "2026-03-10",
    href: "/obec/neuvazujete-nad-porizenim-noveho-komposteru",
    category: "odpady",
  },
  {
    id: "n-bioodpad-2026",
    slug: "zahajeni-svozu-bioodpadu-2026-ze-zahrad-a-domacnosti",
    title: "Svoz bioodpadu 2026 ze zahrad a domácností",
    description:
      "Hnědé kontejnery na bioodpad jsou od 9. března 2026 přistavené v obci, vyvážejí se každé pondělí. Modrý velkoobjemový kontejner rotuje mezi stanovišti v Krhanicích (náves U křížku, víceúčelové hřiště u školy) a v Prosečnici od 9. března do 13. dubna.",
    date: "2026-03-10",
    href: "/obec/zahajeni-svozu-bioodpadu-2026-ze-zahrad-a-domacnosti",
    category: "odpady",
  },
  {
    id: "n-svoz-popelnic-2026",
    slug: "svoz-popelnic-jiz-na-novou-znamku-2026",
    title: "Svoz popelnic už jen na novou známku 2026",
    description:
      "Od úterý 3. března 2026 svoz popelnic probíhá pouze na novou známku pro rok 2026. Místostarosta Jaroslav Mixa žádá o vylepení nové známky a odstranění starých.",
    date: "2026-03-02",
    href: "/obec/svoz-popelnic-jiz-na-novou-znamku-2026",
    category: "odpady",
  },
  {
    id: "n-senior-taxi-2026",
    slug: "senior-taxi-a-rehabilitace-taxi-pokracuje-i-v-roce-2026",
    title: "Senior taxi a rehabilitace taxi pokračují i v roce 2026",
    description:
      "Služba pro občany s trvalým pobytem v Krhanicích od 65 let. Jízdy k lékaři a na rehabilitaci do Týnce nad Sázavou (25 Kč) nebo Benešova (50 Kč). Maximálně 6 jízd měsíčně, doprovod jede zdarma. Objednávky v pracovních dnech 6:00 až 17:00 na 739 701 246.",
    date: "2025-12-30",
    href: "/obec/senior-taxi-a-rehabilitace-taxi-pokracuje-i-v-roce-2026",
    category: "doprava",
  },
  {
    id: "n-pyrotechnika-2025",
    slug: "prisnejsi-pravidla-pro-pyrotechniku-od-1-prosince",
    title: "Přísnější pravidla pro pyrotechniku od 1. prosince",
    description:
      "Od 1. prosince 2025 platí novela zákona o pyrotechnických výrobcích. Stánky a trhy už pyrotechniku prodávat nesmějí, ohňostroje jsou zakázané v pásmu 250 metrů od nemocnic, útulků, zoo a chovů. Zastupitelstvo Krhanice schválilo 12. prosince 2025 vlastní obecně závaznou vyhlášku.",
    date: "2025-12-19",
    href: "/obec/prisnejsi-pravidla-pro-pyrotechniku-od-1-prosince",
    category: "urad",
  },
  {
    id: "n-vypnuti-elektriny",
    slug: "jak-zjistite-planovane-vypnuti-vasi-nemovitosti-od-elektrickeho-proudu",
    title: "Jak zjistíte plánované vypnutí elektřiny",
    description:
      "ČEZ Distribuce už delší dobu nezveřejňuje informace o odstávkách na sloupech vedení. Plánované odstávky najdete v sekci Důležité informace na webu obce, případně po registraci v systému ČEZ Distribuce.",
    date: "2023-02-14",
    href: "/obec/jak-zjistite-planovane-vypnuti-vasi-nemovitosti-od-elektrickeho-proudu",
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
