import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
} from "@/lib/sanity/fetch";
import { BlogCard } from "@/components/sections/Blog/BlogCard";
import { PortableBody } from "@/components/sections/RichText/PortableBody";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  // Prerender every blog slug when Sanity is reachable. If it is not (e.g. a
  // CI build with a placeholder project id), return no params so the build
  // succeeds and these routes render on demand instead of crashing the
  // whole build. A production build with real credentials still prerenders
  // the full set.
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Článek nenalezen" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Editorial cap: max 2 related posts to keep the end-of-article module
  // quiet (one focused next read + one alternative).
  const related = (post.related ?? []).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <a
        href="/blog"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
      >
        <ChevronLeft size={12} aria-hidden />
        Zpět na blog
      </a>

      <article className="mt-8">
        {/* Service line above the title: clickable categories + reading
            time. Categories link to /blog?cat=... so the reader can jump
            to the same kind of content. Editorial-style uppercase
            tracking; pills are reserved for the metadata strip below. */}
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
          {post.categoryLabels.length > 0 ? (
            <>
              <span>
                {post.categoryLabels.map((cat, i) => (
                  <span key={cat.slug}>
                    {i > 0 ? ", " : null}
                    <a
                      href={`/blog?cat=${encodeURIComponent(cat.slug)}`}
                      className="text-[var(--color-text-secondary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:underline"
                    >
                      {cat.label}
                    </a>
                  </span>
                ))}
              </span>
              {" · "}
            </>
          ) : null}
          {post.readingTime}
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          {post.excerpt}
        </p>

        {/* Hero image. Sits inside the reading column (not full-bleed) and
            shows the whole image at its natural ratio -- no fixed aspect
            box, no crop, so portrait/landscape/square covers all render
            uncropped. The placeholder (no asset) keeps the boxed 16/9 look
            since an empty div has no intrinsic height. */}
        {post.heroImage ? (
          <div className="relative mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image migration tracked separately. */}
            <img
              src={post.heroImage}
              alt={post.title}
              className="block h-auto w-full"
            />
          </div>
        ) : (
          <div className="relative mt-8 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)]">
            <ImageIcon size={48} aria-hidden />
          </div>
        )}

        {/* Metadata strip below the hero: publish date + author on one line,
            tags on the next. These are "service" details -- secondary to
            the article body, but visible enough to anchor the piece. */}
        <div className="mt-6 flex flex-col gap-3 text-sm text-[var(--color-text-tertiary)]">
          <p>
            <time dateTime={post.publishedAt}>
              {formatDate.format(new Date(post.publishedAt))}
            </time>
            {" · "}
            <span>
              Autor:{" "}
              {post.authorSlug && post.authorVisibility === "public" ? (
                <a
                  href={`/lide/${post.authorSlug}`}
                  className="text-[var(--color-text)] underline underline-offset-2 hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {post.author ?? "Krhanický Proud"}
                </a>
              ) : (
                post.author ?? "Krhanický Proud"
              )}
            </span>
          </p>
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?stitek=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {tag}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* Body: portable text from Sanity, rendered through the shared
            PortableBody serializer (headings, lists, captioned images). */}
        <PortableBody value={post.body} />
      </article>

      {/* Related articles -- editorial pick, max two. Lives in the same
          max-w-3xl column as the article so the page reads as a single
          flow, not as a separate "more from us" footer block. */}
      {related.length > 0 ? (
        <section
          className="mt-16 border-t border-[var(--color-border)] pt-10"
          aria-labelledby="related-heading"
        >
          <h2
            id="related-heading"
            className="section-eyebrow"
          >
            Související články
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
