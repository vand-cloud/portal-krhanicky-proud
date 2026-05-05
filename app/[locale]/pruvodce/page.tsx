import { getTranslations, setRequestLocale } from "next-intl/server";
import { entries } from "@/content/entries";
import { SectionView } from "@/components/sections/Hybrid/SectionView";
import type { Scope } from "@/components/sections/Hybrid/util";

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

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    type?: string;
    cat?: string;
    sub?: string;
    tags?: string;
  }>;
}) {
  const { locale } = await params;
  const { type, cat, sub, tags } = await searchParams;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });

  // Default landing is "all" -- a curated overview. Type-specific URLs
  // (?type=akce, mista, gastro, …) keep working for filtered listings.
  const initialScope: Scope = (type && SCOPE_BY_QUERY[type]) || "all";

  // Tags arrive as comma-separated. SectionView validates them against
  // the actual tag pool, so unknown tokens just disappear.
  const initialTags = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <SectionView
      entries={entries}
      pageEyebrow="Kde, co a kdy"
      pageTitle="Krhanický průvodce"
      pageIntro="Akce, místa, gastro, obchody, služby a spolky v Krhanicích a okolí. Co se v nejbližší době chystá? Kam zajít na kávu, oběd nebo na výlet? Kde najít řemeslníka, doktora nebo místní spolek?"
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
    />
  );
}
