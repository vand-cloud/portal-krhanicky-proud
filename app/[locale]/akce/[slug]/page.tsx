import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { entries } from "@/content/entries";
import { SectionView } from "@/components/sections/Hybrid/SectionView";

export async function generateStaticParams() {
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
