"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  UradCategoryVM,
  UradItemVM,
} from "@/lib/sanity/content-types";
import { PersonThumb } from "@/components/sections/People/PersonThumb";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// "all" sentinel matches the radiogroup pattern from BlogIndex -- "Vše" is
// the first sidebar row and represents the curated mix. Category and
// subcategory choices are plain slug strings now that they come from Sanity
// (no hardcoded enums).
type CategoryChoice = string;

export function ObecIndex({
  categories,
  items,
  initialCategory = "all",
  initialSubcategory = null,
  // When set, the right pane renders the item's detail content instead of
  // a list. Sidebar stays mounted and reflects initialCategory/Subcategory.
  // The host (/urad/[slug] page) supplies the rendered detail node so the
  // component stays content-agnostic (person card vs. document body).
  initialSelectedSlug,
  detailNode,
}: {
  categories: UradCategoryVM[];
  items: UradItemVM[];
  initialCategory?: CategoryChoice;
  initialSubcategory?: string | null;
  initialSelectedSlug?: string;
  detailNode?: React.ReactNode;
}) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryChoice>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    initialSubcategory,
  );

  const isDetailMode = Boolean(initialSelectedSlug && detailNode);

  function selectCategory(cat: CategoryChoice) {
    setActiveCategory(cat);
    setActiveSubcategory(null);
  }

  const activeCategoryDef =
    activeCategory !== "all"
      ? categories.find((c) => c.slug === activeCategory)
      : null;

  // Three render modes for the right pane:
  // - "all"       : curated featured mix
  // - "hub"       : category landing with sub-category tiles + intro text,
  //                 used when a category has subcategories and the user has
  //                 not picked one yet (the previous flat dump was confusing
  //                 because it mixed people, meetings and contact rows)
  // - "list"      : flat list of items (subcategory active, OR category has
  //                 no subcategories at all)
  const mode: "all" | "hub" | "list" = useMemo(() => {
    if (activeCategory === "all") return "all";
    if (
      activeCategoryDef?.subcategories &&
      activeCategoryDef.subcategories.length > 0 &&
      !activeSubcategory
    ) {
      return "hub";
    }
    return "list";
  }, [activeCategory, activeCategoryDef, activeSubcategory]);

  const filteredItems = useMemo(() => {
    // "all" mode renders the TopCategoriesHub, not a flat list, so the list
    // here stays empty. "hub" likewise renders subcategory tiles.
    if (mode === "all" || mode === "hub") return [];
    if (activeCategory !== "all" && activeSubcategory) {
      return items.filter(
        (i) =>
          i.category === activeCategory && i.subcategory === activeSubcategory,
      );
    }
    if (activeCategory !== "all") {
      return items.filter((i) => i.category === activeCategory);
    }
    return [];
  }, [items, mode, activeCategory, activeSubcategory]);

  // Heading above the right pane. For "all" it's a curator-pick label, for
  // "hub" the category name, for "list" the breadcrumb-style scope.
  const scopeLabel = useMemo(() => {
    if (activeCategory === "all") return "Sekce obce";
    if (activeSubcategory && activeCategoryDef) {
      const sub = activeCategoryDef.subcategories.find(
        (s) => s.slug === activeSubcategory,
      );
      return sub ? `${activeCategoryDef.label} · ${sub.label}` : activeCategoryDef.label;
    }
    return activeCategoryDef?.label ?? "";
  }, [activeCategory, activeSubcategory, activeCategoryDef]);

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
      {/* Sidebar: categories with optional 1-level subcategories. Sticky on
          desktop so the menu stays in view while the list scrolls. In
          detail mode hidden on mobile -- the user came here to read one
          item, the category list above the content is noise on a phone. */}
      <aside
        className={`lg:sticky lg:top-24 lg:self-start ${
          isDetailMode ? "hidden lg:block" : ""
        }`}
      >
        <p className="section-eyebrow mb-2">
          Kategorie
        </p>
        <ul className="space-y-1" role="radiogroup" aria-label="Kategorie">
          <SidebarRow
            label="Vše"
            count={items.length}
            active={activeCategory === "all"}
            onClick={() => selectCategory("all")}
          />
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat.slug);
            const isActive = activeCategory === cat.slug;
            return (
              <SidebarRow
                key={cat.slug}
                label={cat.label}
                count={catItems.length}
                active={isActive && !activeSubcategory}
                onClick={() => selectCategory(cat.slug)}
              >
                {/* Sub-categories appear only when their parent is selected.
                    Indented and rendered slightly smaller so the hierarchy
                    is unambiguous. The nested <ul> sits inside the parent
                    SidebarRow's <li> -- no nested-<li> hydration error. */}
                {isActive && cat.subcategories.length > 0 ? (
                  <ul className="mt-1 space-y-0.5 border-l border-[var(--color-border)] pl-2">
                    {cat.subcategories.map((sub) => {
                      const subItems = items.filter(
                        (i) =>
                          i.category === cat.slug && i.subcategory === sub.slug,
                      );
                      return (
                        <SubSidebarRow
                          key={sub.slug}
                          label={sub.label}
                          count={subItems.length}
                          active={activeSubcategory === sub.slug}
                          onClick={() => setActiveSubcategory(sub.slug)}
                        />
                      );
                    })}
                  </ul>
                ) : null}
              </SidebarRow>
            );
          })}
        </ul>
      </aside>

      {/* Main pane. Four modes:
            - detail mode  : host-supplied detailNode (person card, doc, ...)
            - "all" / "list": flat list of rows (curated mix or filtered)
            - "hub":          category landing with sub-tiles + intro */}
      <div>
        {isDetailMode ? (
          <>
            {/* Back link points to the listing the user came from. We
                reconstruct it from initialCategory/Subcategory so the
                sidebar lands on the same row again. */}
            <a
              href={buildBackHref(initialCategory, initialSubcategory)}
              className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
            >
              <ChevronLeft size={12} aria-hidden />
              Zpět na seznam
            </a>
            <div className="mt-6">{detailNode}</div>
          </>
        ) : (
          <>
            <h2 className="section-eyebrow mb-3">
              {scopeLabel}
            </h2>

            {mode === "all" ? (
              <TopCategoriesHub
                categories={categories}
                items={items}
                onSelectCategory={(cat) => selectCategory(cat)}
              />
            ) : mode === "hub" && activeCategoryDef ? (
              <CategoryHub
                category={activeCategoryDef}
                items={items}
                onSelectSub={(sub) => setActiveSubcategory(sub)}
              />
            ) : filteredItems.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-12 text-center text-sm text-[var(--color-text-secondary)]">
                V této sekci zatím nic není.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <ItemRow item={item} />
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

// Sidebar row -- shared shape with the BlogIndex CategoryRow but kept local
// here so /urad can evolve its own layout without coupling.
//
// Optional `children` slot renders inside the same <li>, used by the
// outer category iteration to attach a nested <ul> of subcategories
// without creating a nested-<li> hydration error (the previous version
// wrapped SidebarRow in another <li>).
function SidebarRow({
  label,
  count,
  active,
  onClick,
  children,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
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
      {children}
    </li>
  );
}

function SubSidebarRow({
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
        aria-pressed={active}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          active
            ? "bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
        ].join(" ")}
      >
        <span>{label}</span>
        <span className="shrink-0 text-[var(--color-text-tertiary)]">
          {count}
        </span>
      </button>
    </li>
  );
}

// Reconstruct the listing URL the user came from. The /urad page reads
// these query params and pre-selects the same sidebar row.
function buildBackHref(
  category: CategoryChoice,
  subcategory: string | null,
): string {
  if (category === "all") return "/urad";
  const params = new URLSearchParams();
  params.set("kat", category);
  if (subcategory) params.set("pod", subcategory);
  return `/urad?${params.toString()}`;
}

// Top-level rozcestník: cards for each top category. Used in the "Vše"
// pseudo-category landing -- the user gets a clear list of sections
// (Aktuality / Úřední deska / Zastupitelstvo / Dokumenty) instead of
// a flat curated mix that was hard to skim.
function TopCategoriesHub({
  categories,
  items,
  onSelectCategory,
}: {
  categories: UradCategoryVM[];
  items: UradItemVM[];
  onSelectCategory: (cat: string) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {categories.map((cat) => {
        const count = items.filter((i) => i.category === cat.slug).length;
        return (
          <li key={cat.slug}>
            <button
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="group flex h-full w-full flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-left outline-none transition-colors hover:border-[var(--color-text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4 sm:text-lg">
                  {cat.label}
                </h3>
                <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                  {count}
                </span>
              </div>
              {cat.description ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {cat.description}
                </p>
              ) : null}
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]">
                Otevřít
                <ChevronRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Category landing rendered in place of a flat list when the user picks a
// category with subcategories. Intro paragraph (from the category def) sets
// context, then a 2-col grid of subcategory tiles. Click on a tile sets
// the activeSubcategory state -- the sidebar mirrors the choice.
function CategoryHub({
  category,
  items,
  onSelectSub,
}: {
  category: UradCategoryVM;
  items: UradItemVM[];
  onSelectSub: (sub: string) => void;
}) {
  if (category.subcategories.length === 0) return null;

  return (
    <div>
      {category.description ? (
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          {category.description}
        </p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2">
        {category.subcategories.map((sub) => {
          const count = items.filter(
            (i) => i.category === category.slug && i.subcategory === sub.slug,
          ).length;
          return (
            <li key={sub.slug}>
              <button
                type="button"
                onClick={() => onSelectSub(sub.slug)}
                className="group flex h-full w-full flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-left outline-none transition-colors hover:border-[var(--color-text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4 sm:text-lg">
                    {sub.label}
                  </h3>
                  <span className="shrink-0 text-xs text-[var(--color-text-tertiary)]">
                    {count}
                  </span>
                </div>
                {sub.description ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {sub.description}
                  </p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]">
                  Otevřít
                  <ChevronRight
                    size={12}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// One row in the result list. Date (when available) sits left, title +
// description in the middle, chevron right. Same hover/focus pattern as
// EntryListItem so /urad and /pruvodce read as siblings.
function ItemRow({ item }: { item: UradItemVM }) {
  return (
    <a
      href={item.href}
      className="group flex items-start gap-3 px-3 py-4 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:gap-4"
    >
      {item.isPerson ? (
        // Councillor / person row: lead with the photo, same photo-led
        // "special element" treatment as candidates in /proud.
        <PersonThumb photoUrl={item.personPhoto} />
      ) : item.date ? (
        <time
          dateTime={item.date}
          className="shrink-0 text-xs font-medium text-[var(--color-text-tertiary)] sm:w-28"
        >
          {formatDate.format(new Date(item.date))}
        </time>
      ) : (
        <span className="hidden sm:block sm:w-28" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold leading-snug text-[var(--color-text-accent)] group-hover:underline group-hover:underline-offset-4 sm:text-base">
          {item.title}
        </h3>
        {item.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        ) : null}
      </div>
      <ChevronRight
        size={16}
        aria-hidden
        className="mt-1 shrink-0 text-[var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-text)]"
      />
    </a>
  );
}
