import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import { type BlogPost, blogCategoryLabels, blogPosts } from "@/content/blog";
import { BlogCard } from "@/components/sections/Blog/BlogCard";

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

        {/* Hero image. Phase 2 wireframe: when no asset, show typed
            placeholder consistent with BlogCard cover. Sanity migration
            replaces this with next/image + asset reference. */}
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          {post.heroImage ? (
            /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
            <img
              src={post.heroImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]"
              aria-hidden
            >
              <ImageIcon size={48} />
            </div>
          )}
        </div>

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

        {/* Body. Phase 4 swaps this for a portable text renderer with
            real typography (lead paragraphs, pull quotes, captioned
            images, embedded entries from Pruvodce). */}
        {post.body ? (
          <div className="mt-10 text-base leading-relaxed text-[var(--color-text)]">
            {post.body.split("\n\n").map((para, i) => (
              <p key={i} className="mt-4 first:mt-0">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-10 italic text-[var(--color-text-tertiary)]">
            Plný text článku připravujeme.
          </p>
        )}
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
