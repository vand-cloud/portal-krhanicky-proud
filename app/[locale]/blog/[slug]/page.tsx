import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import { type BlogPost, blogCategoryLabels, blogPosts } from "@/content/blog";
import { BlogCard } from "@/components/sections/Blog/BlogCard";
import { ArticleBodyDemo } from "@/components/sections/ArticleBodyDemo";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Článek nenalezen" };
  return { title: post.title, description: post.excerpt };
}

// Editorial cap: max 2 related posts to keep the end-of-article module
// quiet (one focused next read + one alternative). Sanity schema enforces
// the same upper bound.
const RELATED_LIMIT = 2;

function resolveRelated(post: BlogPost): BlogPost[] {
  if (!post.relatedPosts || post.relatedPosts.length === 0) return [];
  return post.relatedPosts
    .map((id) => blogPosts.find((p) => p.id === id))
    .filter((p): p is BlogPost => Boolean(p))
    .slice(0, RELATED_LIMIT);
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = resolveRelated(post);

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
          {post.categories.length > 0 ? (
            <>
              <span>
                {post.categories.map((c, i) => (
                  <span key={c}>
                    {i > 0 ? ", " : null}
                    <a
                      href={`/blog?cat=${encodeURIComponent(c)}`}
                      className="text-[var(--color-text-secondary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:underline"
                    >
                      {blogCategoryLabels[c]}
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
            since an empty div has no intrinsic height. Sanity migration
            swaps the <img> for next/image + asset reference. */}
        {post.heroImage ? (
          <div className="relative mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */}
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
            <span>Autor: {post.author}</span>
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

        {/* Body. Phase 2 demo: a formatted rich-text sample (headings,
            lists, captioned images) so the client can see the editor
            output. Phase 4 swaps this for a portable text renderer that
            maps the same marks onto this typography. */}
        <ArticleBodyDemo />
      </article>

      {/* Related articles -- editorial pick, max three. Lives in the same
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
