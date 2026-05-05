"use client";

import type { Category } from "@/content/entries";

// Multi-select category filter chips. Categories are passed as labeled items
// because slug→label resolution depends on the entry type context, which the
// caller knows. Currently re-exported but not consumed; kept for future use
// when a place/listing page wants its own multi-select chip filter.
export function CategoryFilter({
  active,
  categories,
  onChange,
  labels,
}: {
  active: Category[];
  categories: Array<{ slug: Category; label: string }>;
  onChange: (next: Category[]) => void;
  labels: { all: string; title: string };
}) {
  const toggle = (cat: Category) => {
    if (active.includes(cat)) {
      onChange(active.filter((c) => c !== cat));
    } else {
      onChange([...active, cat]);
    }
  };
  const clearAll = () => onChange([]);
  const showAll = active.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="sr-only">{labels.title}</span>
      <button
        type="button"
        onClick={clearAll}
        aria-pressed={showAll}
        className={[
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          showAll
            ? "border border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
            : "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
        ].join(" ")}
      >
        {labels.all}
      </button>
      {categories.map((cat) => {
        const isActive = active.includes(cat.slug);
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => toggle(cat.slug)}
            aria-pressed={isActive}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              isActive
                ? "border border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
