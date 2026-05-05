"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type BlogCategory,
  type BlogPost,
  blogCategoryLabels,
  filterBlogByCategory,
  filterBlogByTag,
  getAllTags,
  sortBlogByDate,
} from "@/content/blog";
import { BlogCard } from "./BlogCard";

// "all" is a sentinel for "no category filter" -- rendered as the first
// item in the sidebar so the user always has a way back to the full list.
type CategoryChoice = BlogCategory | "all";

// Stable order for the category list -- matches the operator's editorial
// hierarchy in the data file.
const CATEGORY_ORDER: BlogCategory[] = [
  "z-radnice",
  "zivot-v-obci",
  "tipy-na-vylet",
  "rozhovory",
  "komentare",
];

// Validate ?cat= against the actual category enum so a stale or hand-typed
// link does not crash the page or pre-select garbage.
function resolveInitialCategory(catParam: string | null): CategoryChoice {
  if (!catParam) return "all";
  return CATEGORY_ORDER.includes(catParam as BlogCategory)
    ? (catParam as BlogCategory)
    : "all";
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Both filters are SINGLE-select: one category (or "Vše") plus one
  // optional tag. Click-to-filter, click-again-to-clear. Multi-select
  // tag refinement turned out to be confusing -- the operator's intent
  // was always "show me posts about X", not boolean intersections.
  const [activeCategory, setActiveCategory] = useState<CategoryChoice>(() =>
    resolveInitialCategory(searchParams.get("cat")),
  );
  const [activeTag, setActiveTag] = useState<string | null>(() =>
    searchParams.get("stitek") || null,
  );

  // Keep state in sync when the URL changes from the outside (e.g. user
  // clicks a tag link in a post detail and lands here, or hits Back).
  useEffect(() => {
    setActiveCategory(resolveInitialCategory(searchParams.get("cat")));
    setActiveTag(searchParams.get("stitek") || null);
  }, [searchParams]);

  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filtered = useMemo(() => {
    let list = sortBlogByDate(posts);
    if (activeCategory !== "all") {
      list = filterBlogByCategory(list, [activeCategory]);
    }
    if (activeTag) {
      list = filterBlogByTag(list, [activeTag]);
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

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
      {/* Sidebar: categories as a single-select vertical menu, tags below
          as single-select chips (click again to clear). Sticky on
          desktop so the menu stays visible while the grid scrolls. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Kategorie
          </p>
          <ul className="space-y-1" role="radiogroup" aria-label="Kategorie">
            <CategoryRow
              label="Vše"
              count={posts.length}
              active={activeCategory === "all"}
              onClick={() => chooseCategory("all")}
            />
            {CATEGORY_ORDER.map((cat) => {
              const count = posts.filter((p) =>
                p.categories.includes(cat),
              ).length;
              return (
                <CategoryRow
                  key={cat}
                  label={blogCategoryLabels[cat]}
                  count={count}
                  active={activeCategory === cat}
                  onClick={() => chooseCategory(cat)}
                />
              );
            })}
          </ul>
        </div>

        {allTags.length > 0 ? (
          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
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

      {/* Main: result count + grid of cards (1 col mobile, 2 cols desktop). */}
      <div>
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
