import {
  ArrowRight,
  Baby,
  Compass,
  FileText,
  Footprints,
  Image as ImageIcon,
  Leaf,
  User,
  Users,
} from "lucide-react";
import {
  type ProudCategory,
  type ProudItem,
  proudCategoryLabels,
  proudHighlightItems,
} from "@/content/proud";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Editorial cap on the homepage strip. Anything above is silently
// dropped from the render -- a soft guardrail against an over-eager
// editor flagging eight items as highlights and overwhelming the page.
const HIGHLIGHT_CAP = 4;

// Per-category placeholder icon. Used as the cover when an item has no
// heroImage yet (default state in wireframe phase). Once Sanity assets
// are wired up, the cover image takes over and this map only kicks in
// for items the editor publishes without a photo.
const categoryIcon: Record<
  ProudCategory,
  (props: { size?: number }) => React.JSX.Element
> = {
  program: ({ size = 36 }) => <Compass size={size} aria-hidden />,
  kandidati: ({ size = 36 }) => <User size={size} aria-hidden />,
  doprava: ({ size = 36 }) => <Footprints size={size} aria-hidden />,
  "zivotni-prostredi": ({ size = 36 }) => <Leaf size={size} aria-hidden />,
  "vzdelavani-deti": ({ size = 36 }) => <Baby size={size} aria-hidden />,
  "komunita-kultura": ({ size = 36 }) => <Users size={size} aria-hidden />,
  "transparentnost-rozpocet": ({ size = 36 }) => (
    <FileText size={size} aria-hidden />
  ),
};

function HighlightCard({ item }: { item: ProudItem }) {
  const Icon = categoryIcon[item.category] ??
    (({ size = 36 }: { size?: number }) => <ImageIcon size={size} aria-hidden />);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors hover:border-[var(--color-text-tertiary)] focus-within:border-[var(--color-text-tertiary)]">
      {/* Cover (or typed placeholder when missing). 16/9 to read as
          "card with photo" without dominating the row. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-surface)]">
        {item.heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
          <img
            src={item.heroImage}
            alt={item.title}
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
        {/* Category chip above the title. Links to the programme
            rozcestník pre-filtered to that category. Sits relative
            z-10 above the card-overlay anchor so the chip click
            registers instead of opening the post. */}
        <div className="relative z-10 flex flex-wrap gap-1.5">
          <a
            href={`/proud/nas-program?kat=${encodeURIComponent(item.category)}`}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {proudCategoryLabels[item.category]}
          </a>
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-[var(--color-text-accent)] sm:text-lg group-hover:underline group-hover:underline-offset-4 group-focus-within:underline group-focus-within:underline-offset-4">
          <a
            href={item.href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            {item.title}
          </a>
        </h3>

        {item.description ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        ) : null}

        {item.date ? (
          <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
            <time dateTime={item.date}>
              {formatDate.format(new Date(item.date))}
            </time>
          </p>
        ) : null}
      </div>
    </article>
  );
}

// "Střípky z našeho programu" -- a 4-card strip on /proud homepage
// teasing concrete proposals from the programme rozcestník. Picks
// items marked `highlight: true` in content/proud.ts (currently four,
// one per thematic category to show breadth). Each card links to the
// full post under /proud/nas-program/[slug].
export function ProudHighlights() {
  const items = proudHighlightItems().slice(0, HIGHLIGHT_CAP);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="proud-highlights">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Z našeho programu
          </p>
          <h2
            id="proud-highlights"
            className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-accent)] sm:text-3xl"
          >
            Střípky z našeho programu
          </h2>
        </div>
        <a
          href="/proud/nas-program"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:inline-flex"
        >
          Celý program
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <HighlightCard item={item} />
          </li>
        ))}
      </ul>

      {/* Mobile-only CTA: header CTA hides under sm breakpoint to keep
          the heading line tidy. */}
      <a
        href="/proud/nas-program"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:hidden"
      >
        Celý program
        <ArrowRight size={16} aria-hidden />
      </a>
    </section>
  );
}
