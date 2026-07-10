import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getBlogData } from "@/lib/sanity/fetch";
import { BlogIndex } from "@/components/sections/Blog/BlogIndex";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { page, categories, posts } = await getBlogData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Hero -- same vertical scale as the Průvodce header so the two
          landing pages feel like siblings, not different sites. */}
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">{page?.eyebrow ?? "Krhanický blog"}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          {page?.title ?? "Obecní příspěvky"}
        </h1>
        <div className="mt-4 space-y-3 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          {(page?.intro ?? "Delší texty: rozhovory s místními, vysvětlení k radničním rozhodnutím a tipy na výlety po Posázaví.").split("\n").filter((ln) => ln.trim()).map((ln, i) => (
            <p key={i}>{ln}</p>
          ))}
        </div>
      </header>

      <div className="mt-12">
        {/* Suspense boundary so useSearchParams inside BlogIndex doesn't
            opt the whole route into client-side rendering. */}
        <Suspense fallback={null}>
          <BlogIndex posts={posts} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
