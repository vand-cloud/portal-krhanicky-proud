import {
  Building2,
  Image as ImageIcon,
  Map,
  MessageSquare,
  MicVocal,
  Users,
} from "lucide-react";
import {
  type BlogCategory,
  type BlogPost,
  blogCategoryLabels,
} from "@/content/blog";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Per-category placeholder icon. Mirrors the pattern in EntryThumb /
// ProudHighlights -- icon = category, not generic "image missing". When
// the post has no heroImage, the icon hints at what the article is
// about. Falls back to a generic image icon if the post somehow has no
// category set.
const categoryIcon: Record<
  BlogCategory,
  (props: { size?: number }) => React.JSX.Element
> = {
  "z-radnice": ({ size = 36 }) => <Building2 size={size} aria-hidden />,
  "zivot-v-obci": ({ size = 36 }) => <Users size={size} aria-hidden />,
  "tipy-na-vylet": ({ size = 36 }) => <Map size={size} aria-hidden />,
  komentare: ({ size = 36 }) => <MessageSquare size={size} aria-hidden />,
  rozhovory: ({ size = 36 }) => <MicVocal size={size} aria-hidden />,
};

// Card-with-overlay pattern: title <a> covers the whole card via an
// absolute pseudo-element, so the entire surface is clickable. Category
// chips sit `relative z-10` above the overlay so they could host
// independent links if we ever add them (currently they are passive
// labels -- filtering happens on the index, not via card clicks).
export function BlogCard({ post }: { post: BlogPost }) {
  const Icon =
    (post.categories[0] && categoryIcon[post.categories[0]]) ??
    (({ size = 36 }: { size?: number }) => <ImageIcon size={size} aria-hidden />);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors hover:border-[var(--color-text-tertiary)] focus-within:border-[var(--color-text-tertiary)]">
      {/* Cover image (or typed placeholder when missing). 16/9 aspect to
          read as a "card with photo" without dominating the layout. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-surface)]">
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
            <Icon size={36} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Category chips above the title. Each chip links to the blog
            index pre-filtered to that category. They sit relative z-10
            above the card-overlay anchor so the chip click registers
            instead of opening the post. */}
        {post.categories.length > 0 ? (
          <div className="relative z-10 flex flex-wrap gap-1.5">
            {post.categories.map((cat) => (
              <a
                key={cat}
                href={`/blog?cat=${encodeURIComponent(cat)}`}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {blogCategoryLabels[cat]}
              </a>
            ))}
          </div>
        ) : null}

        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-[var(--color-text-accent)] sm:text-lg group-hover:underline group-hover:underline-offset-4 group-focus-within:underline group-focus-within:underline-offset-4">
          <a
            href={post.href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            {post.title}
          </a>
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--color-text-secondary)]">
          {post.excerpt}
        </p>

        <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
          <time dateTime={post.publishedAt}>
            {formatDate.format(new Date(post.publishedAt))}
          </time>
          {" · "}
          {post.readingTime}
        </p>
      </div>
    </article>
  );
}
