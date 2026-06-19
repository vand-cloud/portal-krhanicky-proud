"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { CategoryVM, ProudItemVM } from "@/lib/sanity/content-types";
import { PersonThumb } from "@/components/sections/People/PersonThumb";

// "all" sentinel matches the radiogroup pattern from BlogIndex / ObecIndex.
// Category slugs are plain strings now (Sanity-driven, no hardcoded enum).
type CategoryChoice = string | "all";

// Sidebar + content layout, mirrors ObecIndex but without subcategories.
// Three render modes for the right pane:
//   - detail mode    : host-supplied detailNode (candidate card / post body)
//   - "all"          : curated featured mix
//   - "list"         : flat list of items filtered by active category
//
// The host (/proud/[slug] page) supplies detailNode + initialCategory so
// the sidebar lands on the right row when the user arrives at a detail.
export function ProudIndex({
  categories,
  items,
  initialCategory = "all",
  initialSelectedSlug,
  detailNode,
}: {
  categories: CategoryVM[];
  items: ProudItemVM[];
  initialCategory?: CategoryChoice;
  initialSelectedSlug?: string;
  detailNode?: React.ReactNode;
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] =
    useState<CategoryChoice>(initialCategory);

  const isDetailMode = Boolean(initialSelectedSlug && detailNode);

  // Sidebar click behaviour:
  //  - listing mode  : update local state, swap right pane content
  //  - detail mode   : navigate out of /proud/nas-program/[slug] back
  //                    to the rozcestník with the chosen category
  //                    preselected. Sidebar stays usable while a detail
  //                    is open (no "Zpět na seznam" round-trip needed).
  function chooseCategory(cat: CategoryChoice) {
    if (isDetailMode) {
      const href =
        cat === "all"
          ? "/proud/nas-program"
          : `/proud/nas-program?kat=${cat}`;
      router.push(href);
      return;
    }
    setActiveCategory(cat);
  }

  const activeCategoryDef =
    activeCategory !== "all"
      ? categories.find((c) => c.slug === activeCategory)
      : null;

  // "all" mode renders a category rozcestník (cards), so the filtered
  // item list stays empty -- it's only consumed by the list mode below.
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return [];
    return items.filter((i) => i.category === activeCategory);
  }, [activeCategory, items]);

  const scopeLabel =
    activeCategory === "all" ? "Sekce programu" : (activeCategoryDef?.label ?? "");

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
      {/* Sidebar: flat category list. Sticky on desktop so the menu stays
          in view while the long list of policy posts scrolls. In detail
          mode hidden on mobile -- the user came here to read one item,
          the category list above the content is noise on a phone. */}
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
            active={activeCategory === "all" && !isDetailMode}
            onClick={() => chooseCategory("all")}
          />
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat.slug);
            return (
              <SidebarRow
                key={cat.slug}
                label={cat.label}
                count={catItems.length}
                active={activeCategory === cat.slug && !isDetailMode}
                onClick={() => chooseCategory(cat.slug)}
              />
            );
          })}
        </ul>
      </aside>

      <div>
        {isDetailMode ? (
          <>
            <a
              href={buildBackHref(initialCategory)}
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

            {activeCategoryDef?.description ? (
              <p className="mb-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
                {activeCategoryDef.description}
              </p>
            ) : null}

            {activeCategory === "all" ? (
              <TopCategoriesHub
                categories={categories}
                items={items}
                onSelectCategory={(cat) => setActiveCategory(cat)}
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

// Top-level rozcestník: cards for each programme category. Used in
// the "Vše" landing on /proud/nas-program -- the user sees a clear
// list of policy areas (Náš program / Naši kandidáti / Doprava /
// Životní prostředí / …) instead of a flat curated mix.
function TopCategoriesHub({
  categories,
  items,
  onSelectCategory,
}: {
  categories: CategoryVM[];
  items: ProudItemVM[];
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

function SidebarRow({
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

// Reconstruct the listing URL the user came from. /proud/nas-program
// reads ?kat= query param and pre-selects the same sidebar row.
function buildBackHref(category: CategoryChoice): string {
  if (category === "all") return "/proud/nas-program";
  const params = new URLSearchParams({ kat: category });
  return `/proud/nas-program?${params.toString()}`;
}

// One row in the result list.
//  - Programme posts: a small cover thumbnail sits left, then title +
//    description. No date -- programme items are evergreen, not news.
//  - Candidate rows (category "kandidati"): lead with the person's photo
//    (circular avatar) -- candidates are a photo-led "special element".
function ItemRow({ item }: { item: ProudItemVM }) {
  const isCandidate = item.isCandidate;
  return (
    <a
      href={item.href}
      className="group flex items-start gap-3 px-3 py-4 outline-none transition-colors hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:gap-4"
    >
      {isCandidate ? (
        <PersonThumb photoUrl={item.personPhoto} />
      ) : (
        <ProudThumb heroImage={item.heroImage} />
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

// Small left-aligned cover thumbnail for programme posts. Fixed 4:3 box so
// the list stays tidy whatever the source ratio; falls back to a typed
// placeholder until the operator adds a cover (Sanity asset in Phase 4).
function ProudThumb({ heroImage }: { heroImage?: string }) {
  return (
    <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] sm:w-28">
      {heroImage ? (
        /* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]"
          aria-hidden
        >
          <ImageIcon size={20} />
        </div>
      )}
    </div>
  );
}
