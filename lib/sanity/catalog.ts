// Server-side data layer for the katalog (akce/mista/gastro/obchody/sluzby/
// spolky). Fetches `catalogEntry` documents from Sanity and maps them into
// the exact `Entry` shape content/entries.ts used to hardcode, so every
// consumer downstream (SectionView, the Hybrid components, HomeSearch,
// ObecSearch, ProudSearch, PersonDetail, lib/sanity/search.ts) keeps working
// unchanged -- they only ever typed against `Entry`, never against the old
// hardcoded arrays.
import "server-only";
import { groq } from "next-sanity";
import { client } from "./client";
import type {
  Category,
  Entry,
  EntryStatus,
  EntryType,
  SocialLinks,
  Subcategory,
  TrustLevel,
} from "@/content/entries";

// Same network-unavailable guard as lib/sanity/fetch.ts (kept local here
// since that file's `fetch` wrapper isn't exported): a CI build pointed at
// the placeholder project id ("dummy") gets a 404, and outright transport
// failures carry one of these undici/node error codes. Both degrade to an
// empty list instead of failing the build/request -- genuine query errors
// (malformed GROQ, schema mismatch) still throw.
const NETWORK_ERROR_CODES = new Set([
  "ENOTFOUND",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
]);

function isBackendUnavailable(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  if ((err as { statusCode?: number }).statusCode === 404) return true;
  const code = (err as { code?: string }).code;
  if (code && NETWORK_ERROR_CODES.has(code)) return true;
  const causeCode = (err as { cause?: { code?: string } }).cause?.code;
  if (causeCode && NETWORK_ERROR_CODES.has(causeCode)) return true;
  return false;
}

// Every field is projected explicitly so the shape matches Entry 1:1.
// Categories/subcategory/tags resolve to plain slugs. Ivan picks them from
// the catalogCategory/catalogTag documents in Studio, but display LABELS
// still come from the hardcoded categoryDefs/subcategoryDefs/tagDefs in
// content/entries.ts (getCategoryLabel/getTagLabel etc.), not from those
// documents' `name` field -- renaming or adding a category/tag in Studio
// has no visible effect on the live site today. Wiring labels to Sanity
// is a follow-up, not yet built.
// Only "approved" entries are public -- "pending" is Ivan's moderation
// queue (see the "Ke schválení" desk view) and must never leak to
// visitors, "archived" is a soft-delete.
const catalogEntriesQuery = groq`
  *[_type == "catalogEntry" && status == "approved"]{
    "id": _id,
    "type": entryType,
    "slug": slug.current,
    title,
    description,
    website,
    social,
    "lat": location.lat,
    "lng": location.lng,
    address,
    startedAt,
    endedAt,
    hours,
    price,
    parking,
    "category": category->slug.current,
    subcategory,
    "tags": tags[]->slug.current,
    status,
    trustLevel,
    "heroImage": heroImage.asset->url,
    "heroAlt": heroImage.alt,
    organizer,
    contactEmail,
    contactPhone,
    inVillage,
    featured,
    "relatedEntries": relatedEntries[]->_id
  }
`;

// Raw shape returned by the query above. GROQ projects `null` (never
// `undefined`) for any field with no value, so every optional Entry field
// is typed `T | null` here and normalized to `T | undefined` in the mapper
// below to match the Entry interface exactly.
type RawCatalogEntry = {
  id: string;
  type: EntryType;
  slug: string;
  title: string;
  description: string;
  website: string | null;
  social: SocialLinks | null;
  lat: number | null;
  lng: number | null;
  address: string | null;
  startedAt: string | null;
  endedAt: string | null;
  hours: string | null;
  price: string | null;
  parking: string | null;
  category: Category;
  subcategory: Subcategory | null;
  tags: string[] | null;
  status: EntryStatus;
  trustLevel: TrustLevel;
  heroImage: string | null;
  heroAlt: string | null;
  organizer: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  inVillage: boolean | null;
  featured: boolean | null;
  relatedEntries: string[] | null;
};

// Detail route bucket per type, mirroring the routing comment on the Entry
// interface (content/entries.ts) and the live routes under app/[locale]/:
// akce -> /akce, mista+gastro+obchody -> /mista, sluzby+spolky -> /sluzby.
// No locale prefix: i18n/routing.ts has a single locale ("cs") with
// localePrefix "as-needed", so it's never actually emitted -- every other
// href in the codebase (lib/sanity/fetch.ts, lib/sanity/search.ts,
// components/sections/Hybrid/util.ts) is bare the same way.
const ROUTE_BUCKET: Record<EntryType, string> = {
  akce: "akce",
  mista: "mista",
  gastro: "mista",
  obchody: "mista",
  sluzby: "sluzby",
  spolky: "sluzby",
};

function hrefFor(type: EntryType, slug: string): string {
  return `/${ROUTE_BUCKET[type]}/${slug}`;
}

// Sanity document ids for the migrated records are prefixed "catalogEntry-"
// (e.g. "catalogEntry-evt-paleni-carodejnic-2026") so the seed script could
// dedupe against the old hardcoded ids on re-run. Entry.id must come back in
// the original unprefixed form so anything keyed off it (relatedEntries
// cross-references, React `key`s, etc.) stays stable across the migration.
function stripIdPrefix(id: string): string {
  return id.replace(/^catalogEntry-/, "");
}

function mapCatalogEntry(raw: RawCatalogEntry): Entry {
  return {
    id: stripIdPrefix(raw.id),
    type: raw.type,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    href: hrefFor(raw.type, raw.slug),
    website: raw.website ?? undefined,
    social: raw.social ?? undefined,
    lat: raw.lat ?? undefined,
    lng: raw.lng ?? undefined,
    address: raw.address ?? undefined,
    startedAt: raw.startedAt ?? undefined,
    endedAt: raw.endedAt ?? undefined,
    hours: raw.hours ?? undefined,
    price: raw.price ?? undefined,
    parking: raw.parking ?? undefined,
    category: raw.category,
    subcategory: raw.subcategory ?? undefined,
    tags: raw.tags ?? undefined,
    status: raw.status,
    trustLevel: raw.trustLevel,
    heroImage: raw.heroImage ?? undefined,
    heroAlt: raw.heroAlt ?? undefined,
    organizer: raw.organizer ?? undefined,
    contactEmail: raw.contactEmail ?? undefined,
    contactPhone: raw.contactPhone ?? undefined,
    inVillage: raw.inVillage ?? undefined,
    featured: raw.featured ?? undefined,
    relatedEntries: raw.relatedEntries?.map(stripIdPrefix) ?? undefined,
  };
}

export async function getCatalogEntries(): Promise<Entry[]> {
  let raw: RawCatalogEntry[] | null;
  try {
    raw = await client.fetch<RawCatalogEntry[]>(
      catalogEntriesQuery,
      {},
      { next: { revalidate: 60, tags: ["catalog"] } },
    );
  } catch (err) {
    if (isBackendUnavailable(err)) return [];
    throw err;
  }
  return (raw ?? []).map(mapCatalogEntry);
}
