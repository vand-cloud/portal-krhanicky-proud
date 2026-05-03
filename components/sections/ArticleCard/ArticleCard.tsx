import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
};

type SingleProps = {
  article: Article;
  href: string;
};

export function ArticleCard({ article, href }: SingleProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col h-full overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 transition-colors"
    >
      <ImagePlaceholder
        aspect="video"
        className="rounded-none border-x-0 border-t-0 bg-[var(--color-bg)]"
      />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex flex-wrap gap-2 mb-3 min-h-[1.25rem]">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] mb-3 line-clamp-2 group-hover:opacity-70 transition-opacity">
          {article.title}
        </h3>
        <p className="text-base text-[var(--color-text-secondary)] line-clamp-3 mb-6">
          {article.excerpt}
        </p>
        <p className="mt-auto text-xs text-[var(--color-text-tertiary)]">
          {new Intl.DateTimeFormat("cs-CZ").format(new Date(article.publishedAt))}{" "}
          · {article.readingTime} min čtení
        </p>
      </div>
    </Link>
  );
}

type ListProps = {
  heading?: string;
  subheading?: string;
  articles: Article[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional override for article URL builder. Defaults to /blog/{slug}. */
  hrefBuilder?: (article: Article) => string;
};

export function ArticleList({
  heading,
  subheading,
  articles,
  ctaLabel,
  ctaHref,
  hrefBuilder = (a) => `/blog/${a.slug}`,
}: ListProps) {
  return (
    <section className="py-[var(--spacing-section)] bg-[var(--color-bg)]">
      <Container>
        {(heading || subheading || (ctaLabel && ctaHref)) && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-lg text-[var(--color-text-secondary)]">
                  {subheading}
                </p>
              )}
            </div>
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              href={hrefBuilder(article)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
