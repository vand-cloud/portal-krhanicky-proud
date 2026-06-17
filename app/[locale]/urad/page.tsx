import { setRequestLocale } from "next-intl/server";
import {
  type ObecCategory,
  type ObecSubcategory,
  obecCategories,
  obecItems,
} from "@/content/urad";
import { ObecIndex } from "@/components/sections/Obec/ObecIndex";
import { ObecSearch } from "@/components/sections/Obec/ObecSearch";

export const metadata = { title: "Obecní úřad Krhanice" };

// Validate URL params against the actual category/subcategory enums so a
// stale or hand-typed link does not crash the page or pre-select garbage.
function resolveScope(
  catParam: string | undefined,
  podParam: string | undefined,
): {
  category: "all" | ObecCategory;
  subcategory: ObecSubcategory | null;
} {
  if (!catParam) return { category: "all", subcategory: null };
  const cat = obecCategories.find((c) => c.slug === catParam);
  if (!cat) return { category: "all", subcategory: null };
  if (!podParam) return { category: cat.slug, subcategory: null };
  const sub = cat.subcategories?.find((s) => s.slug === podParam);
  return {
    category: cat.slug,
    subcategory: sub ? sub.slug : null,
  };
}

export default async function VillagePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kat?: string; pod?: string }>;
}) {
  const { locale } = await params;
  const { kat, pod } = await searchParams;
  setRequestLocale(locale);

  const scope = resolveScope(kat, pod);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Vše z úřadu</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Obecní úřad Krhanice
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Úřední deska, zastupitelstvo, dokumenty a aktuality. Co potřebujete
          vědět z radnice na jednom místě.
        </p>
        <div className="mt-7">
          <ObecSearch
            categories={obecCategories}
            items={obecItems}
            placeholder="Hledat sekci, dokument, zastupitele…"
          />
        </div>
      </header>

      <div className="mt-12">
        <ObecIndex
          items={obecItems}
          initialCategory={scope.category}
          initialSubcategory={scope.subcategory}
        />
      </div>
    </div>
  );
}
