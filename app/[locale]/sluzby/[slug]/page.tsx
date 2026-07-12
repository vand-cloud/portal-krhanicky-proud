import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SectionView } from "@/components/sections/Hybrid/SectionView";
import { getCatalogEntries } from "@/lib/sanity/catalog";

// /sluzby/[slug] is the canonical detail bucket for two types: service
// providers (sluzby) and community organizations (spolky). They share the
// route because both are "providers/orgs" rather than physical destinations.
const SLUZBY_BUCKET = ["sluzby", "spolky"] as const;

// New catalog entries created in Sanity after the last build must still
// resolve instead of 404ing until the next deploy/ISR revalidation.
export const dynamicParams = true;

export async function generateStaticParams() {
  const entries = await getCatalogEntries();
  return entries
    .filter((e) => (SLUZBY_BUCKET as readonly string[]).includes(e.type))
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await getCatalogEntries();
  const entry = entries.find(
    (e) => e.slug === slug && (SLUZBY_BUCKET as readonly string[]).includes(e.type),
  );
  if (!entry) return { title: "Služba nenalezena" };
  return { title: entry.title, description: entry.description };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });
  const entries = await getCatalogEntries();

  const entry = entries.find(
    (e) => e.slug === slug && (SLUZBY_BUCKET as readonly string[]).includes(e.type),
  );
  if (!entry) notFound();

  return (
    <SectionView
      entries={entries}
      pageTitle="Krhanický průvodce"
      pageIntro="Akce, místa, gastro, obchody, služby a spolky v Krhanicích a okolí."
      searchPlaceholderByScope={{
        all: tHome("searchAll"),
        akce: tHome("searchEvents"),
        mista: tHome("searchPlaces"),
        gastro: tHome("searchGastro"),
        obchody: tHome("searchObchody"),
        sluzby: tHome("searchServices"),
        spolky: tHome("searchSpolky"),
      }}
      initialScope={entry.type}
      initialSelectedSlug={slug}
      initialSelectedType={entry.type}
    />
  );
}
