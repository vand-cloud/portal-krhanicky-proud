import { setRequestLocale } from "next-intl/server";
import {
  type ProudCategory,
  proudCategories,
  proudItems,
} from "@/content/proud";
import { ProudIndex } from "@/components/sections/Proud/ProudIndex";
import { ProudSearch } from "@/components/sections/Proud/ProudSearch";

export const metadata = {
  title: "Náš program",
  description:
    "Co konkrétně chceme v Krhanicích řešit. Témata kandidátky Krhanického Proudu pro komunální volby 2026.",
};

// Validate ?kat= against the actual category enum so a stale or
// hand-typed link does not crash the page or pre-select garbage.
function resolveCategory(catParam: string | undefined): ProudCategory | "all" {
  if (!catParam) return "all";
  const cat = proudCategories.find((c) => c.slug === catParam);
  return cat ? cat.slug : "all";
}

// Programme rozcestník. Lives as a child of /proud rather than on the
// /proud page itself so the layout has a clean anchor: hero → sidebar
// + content. /proud stays focused on "who we are"; this page on "what
// we want to do".
export default async function NasProgramPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kat?: string }>;
}) {
  const { locale } = await params;
  const { kat } = await searchParams;
  setRequestLocale(locale);

  const initialCategory = resolveCategory(kat);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Krhanický Proud</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Náš program
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Co konkrétně chceme v Krhanicích řešit. Témata řadíme tematicky,
          za každým návrhem stojí někdo z týmu nebo kandidátky.
        </p>
        <div className="mt-7">
          <ProudSearch
            categories={proudCategories}
            items={proudItems}
            placeholder="Hledat téma, kandidáta, nápad…"
          />
        </div>
      </header>

      <div className="mt-12">
        <ProudIndex items={proudItems} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
