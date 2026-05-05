import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { entries } from "@/content/entries";
import { SectionView } from "@/components/sections/Hybrid/SectionView";

// /mista/[slug] is the canonical detail bucket for three types: places to
// visit, places to eat (gastro), places to buy (obchody). They all route
// through here so the URL stays human-readable.
const MISTA_BUCKET = ["mista", "gastro", "obchody"] as const;

export async function generateStaticParams() {
  return entries
    .filter((e) => (MISTA_BUCKET as readonly string[]).includes(e.type))
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find(
    (e) => e.slug === slug && (MISTA_BUCKET as readonly string[]).includes(e.type),
  );
  if (!entry) return { title: "Místo nenalezeno" };
  return { title: entry.title, description: entry.description };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });

  const entry = entries.find(
    (e) => e.slug === slug && (MISTA_BUCKET as readonly string[]).includes(e.type),
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
