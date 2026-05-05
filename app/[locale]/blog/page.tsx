import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { blogPosts } from "@/content/blog";
import { BlogIndex } from "@/components/sections/Blog/BlogIndex";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Hero -- same vertical scale as the Průvodce header so the two
          landing pages feel like siblings, not different sites. */}
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Krhanický blog</p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
          Obecní příspěvky
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Delší texty: rozhovory s místními, vysvětlení k radničním
          rozhodnutím a tipy na výlety po Posázaví.
        </p>
      </header>

      <div className="mt-12">
        {/* Suspense boundary so useSearchParams inside BlogIndex doesn't
            opt the whole route into client-side rendering. */}
        <Suspense fallback={null}>
          <BlogIndex posts={blogPosts} />
        </Suspense>
      </div>
    </div>
  );
}
