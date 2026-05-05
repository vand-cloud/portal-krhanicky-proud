import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  entries,
  filterByType,
  news,
  sortByDistance,
  sortByStart,
} from "@/content/entries";
import { blogPosts, sortBlogByDate } from "@/content/blog";
import { HomeSearch } from "@/components/sections/Home/HomeSearch";
import { BlogCard } from "@/components/sections/Blog/BlogCard";

const formatNewsDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
});

const formatEventDate = new Intl.DateTimeFormat("cs-CZ", {
  weekday: "short",
  day: "numeric",
  month: "long",
});

const formatEventDateOnly = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
});

// All-day events store a pure date string ("2026-01-17"). Parsing those with
// `new Date` makes JS treat them as UTC midnight, which renders as 01:00 in
// cs-CZ. Detect the "T" separator before deciding the format.
function hasTimePart(iso: string): boolean {
  return iso.includes("T");
}

// What to show under a homepage event row. Three cases:
//   * already running (start <= today, end >= today)   -> "Probíhá do …"
//   * single-day or just-starting (no end, or end=start) -> "X. listopadu"
//   * multi-day in the future                          -> "X. – Y. listopadu"
function eventDateLine(
  startedAt: string,
  endedAt: string | undefined,
  now: Date,
): string {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : null;
  const startedAlready = start.getTime() <= now.getTime();
  if (end && startedAlready && end.getTime() >= now.getTime()) {
    return `Probíhá do ${formatEventDateOnly.format(end)}`;
  }
  if (end && start.getTime() !== end.getTime()) {
    return `${formatEventDateOnly.format(start)} – ${formatEventDateOnly.format(end)}`;
  }
  return hasTimePart(startedAt)
    ? formatEventDate.format(start)
    : formatEventDateOnly.format(start);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: "homepage" });

  // Top 5 upcoming events (no 60-day window -- on the homepage we want
  // farther horizon so all 5 slots stay filled even in slow months).
  const now = new Date();
  const upcomingEvents = sortByStart(
    filterByType(entries, ["akce"]).filter((e) => {
      if (!e.startedAt) return false;
      const end = e.endedAt ? new Date(e.endedAt) : new Date(e.startedAt);
      return end >= now;
    }),
  ).slice(0, 5);

  // Featured services -- curator's pick across the four "non-akce, non-mista"
  // forms (gastro, obchody, sluzby, spolky). Falls back to nearest 5 by
  // distance when nothing is flagged yet.
  const allServices = entries.filter(
    (e) =>
      e.type === "sluzby" ||
      e.type === "spolky" ||
      e.type === "gastro" ||
      e.type === "obchody",
  );
  const featuredPool = allServices.filter((e) => e.featured);
  const featuredServices = sortByDistance(
    featuredPool.length > 0 ? featuredPool : allServices,
  ).slice(0, 5);

  // News from village -- top 5 by date. No blog mixed in (separate section).
  const recentNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Top 3 latest blog posts for the standalone section below.
  const recentBlog = sortBlogByDate(blogPosts).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Hero. The title positions the portal as a neighbourhood
            crossroads, not a tourist board -- Simon's exact phrasing. */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-3">Krhanický proud</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
            Sousedský rozcestník pro Krhanice a okolí
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Najděte si svoji akci, restauraci, službu, tip na výlet nebo
            v záložce obec i důležité kontakty a informace z obecního úřadu.
            Všechno na jednom místě.
          </p>
          <div className="mt-7">
            <HomeSearch
              entries={entries}
              news={news}
              placeholder={tHome("searchAll")}
            />
          </div>
        </section>

        {/* Three-column quick overview. Each column is a self-contained
            mini-feed (5 items max) with its own "show all" link in the
            eyebrow. Stacks on mobile, side-by-side from large screens. */}
        <section className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          <ColumnEvents events={upcomingEvents} now={now} />
          <ColumnServices services={featuredServices} />
          <ColumnNews items={recentNews} />
        </section>

        {/* Standalone blog section. Three latest posts as larger cards,
            visually distinct from the timeline-style columns above. */}
        {recentBlog.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-accent)] sm:text-2xl">
                Z blogu
              </h2>
              <a
                href="/blog"
                className="shrink-0 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 outline-none transition-colors hover:text-[var(--color-brand)] hover:no-underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Všechny články →
              </a>
            </div>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentBlog.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column primitives. Each renders its own eyebrow with a "show all" link
// and a list of 5 compact items. Item shape varies slightly per type.
// ─────────────────────────────────────────────────────────────────────────────

function ColumnHeader({
  title,
  showAllLabel,
  showAllHref,
}: {
  title: string;
  showAllLabel: string;
  showAllHref: string;
}) {
  return (
    <div className="mb-2 flex items-end justify-between gap-3">
      <h2 className="section-eyebrow">
        {title}
      </h2>
      <a
        href={showAllHref}
        className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)] underline-offset-4 outline-none transition-colors hover:text-[var(--color-text)] hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        {showAllLabel}
      </a>
    </div>
  );
}

function ColumnEvents({ events, now }: { events: typeof entries; now: Date }) {
  if (events.length === 0) return null;
  return (
    <div>
      <ColumnHeader
        title="Nadcházející akce"
        showAllLabel="Všechny akce →"
        showAllHref="/pruvodce?type=akce"
      />
      <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {events.map((entry) => (
          <li key={entry.id}>
            <a
              href={entry.href}
              className="group block px-3 py-3 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              {entry.startedAt ? (
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {eventDateLine(entry.startedAt, entry.endedAt, now)}
                </p>
              ) : null}
              <h3 className="mt-0.5 text-sm font-bold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4">
                {entry.title}
              </h3>
              {entry.organizer ? (
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  Pořadatel: {entry.organizer}
                </p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnServices({ services }: { services: typeof entries }) {
  if (services.length === 0) return null;
  return (
    <div>
      <ColumnHeader
        title="Vybrané služby"
        showAllLabel="Všechny služby →"
        showAllHref="/pruvodce?type=sluzby"
      />
      <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {services.map((entry) => (
          <li key={entry.id}>
            <a
              href={entry.href}
              className="group block px-3 py-3 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <h3 className="text-sm font-bold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4">
                {entry.title}
              </h3>
              {entry.address ? (
                <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-secondary)]">
                  {entry.address}
                </p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnNews({ items }: { items: typeof news }) {
  if (items.length === 0) return null;
  return (
    <div>
      <ColumnHeader
        title="Aktuality obce"
        showAllLabel="Vše z obce →"
        showAllHref="/obec/aktuality"
      />
      <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className="group block px-3 py-3 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <time
                dateTime={item.date}
                className="text-xs font-medium text-[var(--color-text-secondary)]"
              >
                {formatNewsDate.format(new Date(item.date))}
              </time>
              <h3 className="mt-0.5 text-sm font-bold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4">
                {item.title}
              </h3>
              {item.description ? (
                <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-tertiary)]">
                  {item.description}
                </p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
