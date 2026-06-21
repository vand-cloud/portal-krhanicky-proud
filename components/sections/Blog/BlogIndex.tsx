"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import type { BlogPostVM, CategoryVM } from "@/lib/sanity/content-types";
import { BlogCard } from "./BlogCard";
import { SearchBar } from "@/components/sections/Hybrid/SearchBar";
import { useFulltextSearch } from "@/components/sections/Hybrid/useFulltextSearch";

// "all" is a sentinel for "no category filter" -- rendered as the first
// item in the sidebar so the user always has a way back to the full list.
type CategoryChoice = string;

// Validate ?cat= against the actual category slugs so a stale or hand-typed
// link does not pre-select garbage. Returns "all" for anything unknown.
function resolveInitialCategory(
  catParam: string | null,
  validSlugs: string[],
): CategoryChoice {
  if (!catParam) return "all";
  return validSlugs.includes(catParam) ? catParam : "all";
}

export function BlogIndex({
  posts,
  categories,
}: {
  posts: BlogPostVM[];
  categories: CategoryVM[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categorySlugs = useMemo(
    () => categories.map((c) => c.slug),
    [categories],
  );

  // Both filters are SINGLE-select: one category (or "Vše") plus one
  // optional tag. Click-to-filter, click-again-to-clear. Multi-select
  // tag refinement turned out to be confusing -- the operator's intent
  // was always "show me posts about X", not boolean intersections.
  const [activeCategory, setActiveCategory] = useState<CategoryChoice>(() =>
    resolveInitialCategory(searchParams.get("cat"), categorySlugs),
  );
  const [activeTag, setActiveTag] = useState<string | null>(() =>
    searchParams.get("stitek") || null,
  );

  // Keep state in sync when the URL changes from the outside (e.g. user
  // clicks a tag link in a post detail and lands here, or hits Back).
  // The setState-in-effect rule flags this, but the URL is the source of
  // truth for filter state and the alternative (deriving every render)
  // would skip the optimistic click-then-router.push pattern used below.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setActiveCategory(
      resolveInitialCategory(searchParams.get("cat"), categorySlugs),
    );
    setActiveTag(searchParams.get("stitek") || null);
  }, [searchParams, categorySlugs]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Build the tag list from the posts themselves: collect every tag, count
  // frequency, then sort by frequency desc and alphabetically as tiebreak.
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const tag of p.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.keys()].sort((a, b) => {
      const diff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
      return diff !== 0 ? diff : a.localeCompare(b, "cs");
    });
  }, [posts]);

  const filtered = useMemo(() => {
    // Defensive sort: posts arrive newest-first from Sanity, but re-sort so
    // the component stays correct regardless of fetch ordering.
    let list = [...posts].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categories.includes(activeCategory));
    }
    if (activeTag) {
      list = list.filter((p) => p.tags.includes(activeTag));
    }
    return list;
  }, [posts, activeCategory, activeTag]);

  // Update URL without re-navigating the whole page. Use replace so back
  // button doesn't accumulate filter changes.
  function syncUrl(next: { cat: CategoryChoice; tag: string | null }) {
    const params = new URLSearchParams();
    if (next.cat !== "all") params.set("cat", next.cat);
    if (next.tag) params.set("stitek", next.tag);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function chooseCategory(cat: CategoryChoice) {
    setActiveCategory(cat);
    syncUrl({ cat, tag: activeTag });
  }

  function chooseTag(tag: string) {
    // Click on the active tag clears it; otherwise switch to that single
    // tag. Single-select keeps the model honest with the URL.
    const next = activeTag === tag ? null : tag;
    setActiveTag(next);
    syncUrl({ cat: activeCategory, tag: next });
  }

  function clearAll() {
    setActiveCategory("all");
    setActiveTag(null);
    syncUrl({ cat: "all", tag: null });
  }

  const hasFilters = activeCategory !== "all" || activeTag !== null;

  // Fulltext search across the whole blog (article bodies included). When the
  // box has a query, results replace the filtered grid; clearing it returns to
  // the category/tag browse view.
  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults, loading: searchLoading } = useFulltextSearch(
    "blog",
    searchQuery,
  );
  const searching = searchQuery.trim().length >= 2;

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
      {/* Sidebar: categories as a single-select vertical menu, tags below
          as single-select chips (click again to clear). Sticky on
          desktop so the menu stays visible while the grid scrolls. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div>
          <p className="section-eyebrow mb-2">
            Kategorie
          </p>
          <ul className="space-y-1" role="radiogroup" aria-label="Kategorie">
            <CategoryRow
              label="Vše"
              count={posts.length}
              active={activeCategory === "all"}
              onClick={() => chooseCategory("all")}
            />
            {categories.map((cat) => {
              const count = posts.filter((p) =>
                p.categories.includes(cat.slug),
              ).length;
              return (
                <CategoryRow
                  key={cat.slug}
                  label={cat.label}
                  count={count}
                  active={activeCategory === cat.slug}
                  onClick={() => chooseCategory(cat.slug)}
                />
              );
            })}
          </ul>
        </div>

        {allTags.length > 0 ? (
          <div className="mt-8">
            <p className="section-eyebrow mb-2">
              Štítky
            </p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Štítky">
              {allTags.map((tag) => {
                const active = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => chooseTag(tag)}
                    role="radio"
                    aria-checked={active}
                    className={[
                      "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      active
                        ? "border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                        : "border-[var(--color-border)] bg-transparent font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
                    ].join(" ")}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 text-xs font-medium text-[var(--color-text-secondary)] underline-offset-4 outline-none transition-colors hover:text-[var(--color-text)] hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Zrušit filtry
          </button>
        ) : null}
      </aside>

      {/* Main: search box, then either fulltext results or the filtered grid. */}
      <div>
        <div className="mb-5">
          <SearchBar
            query={searchQuery}
            onChange={setSearchQuery}
            placeholder="Hledat v článcích…"
            size="large"
            ariaLabel="Hledat v blogu"
          />
        </div>

        {searching ? (
          <>
            <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
              {searchLoading
                ? "Hledám…"
                : searchResults.length === 0
                  ? `Pro „${searchQuery}“ jsme nic nenašli`
                  : `${searchResults.length} ${pluralizeArticle(searchResults.length)}`}
            </p>
            {searchResults.length > 0 ? (
              <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-lg border border-[var(--color-border)]">
                {searchResults.map((hit) => (
                  <li key={hit.id}>
                    <a
                      href={hit.href}
                      className="block px-4 py-3 outline-none hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                        <FileText size={12} aria-hidden />
                        {hit.meta}
                      </div>
                      <div className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
                        {hit.title}
                      </div>
                      {hit.snippet ? (
                        <div className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                          {hit.snippet}
                        </div>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <>
            <p className="mb-5 text-xs text-[var(--color-text-tertiary)]">
              {filtered.length === 0
                ? "Pro zvolené filtry nejsou žádné články"
                : `${filtered.length} ${pluralizeArticle(filtered.length)}`}
            </p>

            {filtered.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-12 text-center text-sm text-[var(--color-text-secondary)]">
                Zkuste odebrat některý z filtrů, nebo se podívejte na všechny
                články.
              </p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {filtered.map((post) => (
                  <li key={post.id}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        role="radio"
        aria-checked={active}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          active
            ? "bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
        ].join(" ")}
      >
        <span>{label}</span>
        <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
          {count}
        </span>
      </button>
    </li>
  );
}

function pluralizeArticle(n: number): string {
  if (n === 1) return "článek";
  if (n >= 2 && n <= 4) return "články";
  return "článků";
}
