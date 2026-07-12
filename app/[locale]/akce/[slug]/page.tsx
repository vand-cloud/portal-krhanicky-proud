import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SectionView } from "@/components/sections/Hybrid/SectionView";
import { getCatalogEntries } from "@/lib/sanity/catalog";

// New catalog entries created in Sanity after the last build must still
// resolve instead of 404ing until the next deploy/ISR revalidation.
export const dynamicParams = true;

export async function generateStaticParams() {
  const entries = await getCatalogEntries();
  return entries
    .filter((e) => e.type === "akce")
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await getCatalogEntries();
  const entry = entries.find((e) => e.slug === slug && e.type === "akce");
  if (!entry) return { title: "Akce nenalezena" };
  return { title: entry.title, description: entry.description };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });
  const entries = await getCatalogEntries();

  const entry = entries.find((e) => e.slug === slug && e.type === "akce");
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
      initialScope="akce"
      initialSelectedSlug={slug}
      initialSelectedType="akce"
    />
  );
}
