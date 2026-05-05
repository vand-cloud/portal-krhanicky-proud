import { getTranslations, setRequestLocale } from "next-intl/server";
import { entries, distanceTierOrder, type DistanceTier } from "@/content/entries";
import { SectionView } from "@/components/sections/Hybrid/SectionView";
import type { Scope } from "@/components/sections/Hybrid/util";

// Homepage IS the Krhanický průvodce. Visitors land directly on the
// search hero so the primary action ("najdi mi něco") is the front
// door, not a curated overview. The previous curated rozcestník now
// lives at /rozcestnik (hidden from nav, pending deploy decision).
export const metadata = { title: "Krhanický průvodce" };

// URL ?type=... → internal Scope. New taxonomy: each type IS its own slug.
// "vse" remains as a friendly alias for the catch-all view.
const SCOPE_BY_QUERY: Record<string, Scope> = {
  vse: "all",
  akce: "akce",
  mista: "mista",
  gastro: "gastro",
  obchody: "obchody",
  sluzby: "sluzby",
  spolky: "spolky",
};

// Validate ?dist= against the canonical tier set. Unknown / missing
// values fall back to SectionView's default (DEFAULT_DISTANCE_TIER).
const VALID_TIERS = new Set<DistanceTier>(distanceTierOrder);

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
    cat?: string;
    sub?: string;
    tags?: string;
    dist?: string;
  }>;
}) {
  const { locale } = await params;
  const { type, cat, sub, tags, dist } = await searchParams;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });

  // Default landing is "all" -- a curated overview. Type-specific URLs
  // (?type=akce, mista, gastro, …) keep working for filtered listings.
  const initialScope: Scope = (type && SCOPE_BY_QUERY[type]) || "all";

  // Tags arrive as comma-separated. SectionView validates them against
  // the actual tag pool, so unknown tokens just disappear.
  const initialTags = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  // Distance tier from URL. Undefined when missing/invalid -- SectionView
  // then uses DEFAULT_DISTANCE_TIER ("blizko" / Do 7 km).
  const initialTier =
    dist && VALID_TIERS.has(dist as DistanceTier)
      ? (dist as DistanceTier)
      : undefined;

  return (
    <SectionView
      entries={entries}
      pageEyebrow="Krhanický průvodce"
      pageTitle="Hledej a najdeš"
      searchPlaceholderByScope={{
        all: tHome("searchAll"),
        akce: tHome("searchEvents"),
        mista: tHome("searchPlaces"),
        gastro: tHome("searchGastro"),
        obchody: tHome("searchObchody"),
        sluzby: tHome("searchServices"),
        spolky: tHome("searchSpolky"),
      }}
      initialScope={initialScope}
      initialCategorySlug={cat}
      initialSubcategorySlug={sub}
      initialTags={initialTags}
      initialTier={initialTier}
    />
  );
}
