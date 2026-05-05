"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import type {
  Category,
  Entry,
  EntryType,
  SocialLinks,
  Subcategory,
} from "@/content/entries";
import {
  categoriesForType,
  filterByCategory,
  filterBySubcategory,
  filterByTagsIntersection,
  filterByText,
  filterByTimeWindow,
  filterByType,
  getCategoryLabel,
  getTagLabel,
  sortByDistance,
  sortByStart,
  subcategoriesFor,
  subcategoryDefs,
  typeLabels,
} from "@/content/entries";
import { SearchBar } from "./SearchBar";
import { TimelineView } from "./TimelineView";
import { MapView } from "./MapView";
import { EntryListItem } from "./EntryListItem";
import { EntryThumb } from "./EntryThumb";
import { ScopePills } from "./ScopePills";
import { SOCIAL_ITEMS, formatWebUrl } from "./SocialIcons";
import {
  type Scope,
  categoryFilterHref,
  pruvodceHref,
} from "./util";

// Forward look-ahead for the "Akce" scope. 365 days mirrors how a real
// village calendar feels -- summer festivals are announced months ahead
// (Krhanice Open Air sits 88 days out, the 60-day window was clipping
// it from the listing while it still showed in "Vše"). Past events
// archive after end + 1 day via filterByTimeWindow's lower bound.
const EVENT_WINDOW_DAYS = 365;

const formatDateTime = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});
const formatTime = new Intl.DateTimeFormat("cs-CZ", {
  hour: "2-digit",
  minute: "2-digit",
});
const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
});

// All-day events use a pure date string ("2026-01-17") with no time component.
// Parsing those with `new Date` makes JS interpret them as UTC midnight, which
// renders as 01:00 / 02:00 in cs-CZ. Detect the "T" separator to switch
// formatters and avoid the spurious time.
function hasTimePart(iso: string): boolean {
  return iso.includes("T");
}

function formatRange(startISO?: string, endISO?: string): string | null {
  if (!startISO) return null;
  const start = new Date(startISO);
  const startTimed = hasTimePart(startISO);
  if (!endISO) {
    return startTimed ? formatDateTime.format(start) : formatDate.format(start);
  }
  const end = new Date(endISO);
  const endTimed = hasTimePart(endISO);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  if (sameDay) {
    if (startTimed && endTimed) {
      return `${formatDateTime.format(start)} – ${formatTime.format(end)}`;
    }
    return formatDate.format(start);
  }
  return `${formatDate.format(start)} – ${formatDate.format(end)}`;
}

// Categories shown after the user picks a non-"all" type. Order follows
// the categoryDefs declaration order in entries.ts (which mirrors the spec).
function categoriesFor(scope: Scope): Category[] {
  if (scope === "all") return [];
  return categoriesForType[scope];
}

// Tag pool for the active scope. Dynamic -- computed from the entries
// currently passing the type/category/subcategory filters. New tags
// added in Sanity (or in entries.ts) appear automatically.
function collectTags(list: Entry[]): string[] {
  const set = new Set<string>();
  for (const e of list) {
    for (const t of e.tags ?? []) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "cs"));
}

export function SectionView({
  entries,
  pageEyebrow,
  pageTitle,
  pageIntro,
  searchPlaceholderByScope,
  initialScope = "akce",
  initialCategorySlug,
  initialSubcategorySlug,
  initialTags = [],
  initialSelectedSlug,
  initialSelectedType,
}: {
  entries: Entry[];
  // Optional small mono kicker shown above the H1. Uses the .eyebrow
  // utility (JetBrains Mono, uppercase, accent color) defined in
  // globals.css. Same convention as every other top-level page.
  pageEyebrow?: string;
  pageTitle: string;
  pageIntro?: string;
  // Per-scope placeholder strings -- the search box hint adapts to what
  // the user is currently scoped to.
  searchPlaceholderByScope: Record<Scope, string>;
  // From URL query (?type=akce|mista|sluzby). Sets the initial pill scope.
  initialScope?: Scope;
  // From URL query (?cat=deti). Pre-applies a single category filter on mount.
  initialCategorySlug?: string;
  // From URL query (?sub=hudebni). Pre-applies a single subcategory filter.
  initialSubcategorySlug?: string;
  // From URL query (?tags=rock,venkovni). Pre-applies tag intersection.
  initialTags?: string[];
  // Set on canonical detail pages (/akce/[slug] etc.). Together with
  // initialSelectedType, the view shows the detail panel pre-selected.
  initialSelectedSlug?: string;
  initialSelectedType?: EntryType;
}) {
  const tHome = useTranslations("homepage");
  const router = useRouter();
  const pathname = usePathname();
  // Four cascading filter levels:
  //   1. scope        : EntryType ("all" sentinel = no type filter)
  //   2. category     : single Category, only when scope != "all"
  //   3. subcategory  : single Subcategory, only when category set + has subs
  //   4. tags         : multi, intersection (AND)
  // Each level's "Vše" sentinel resets all narrower levels (cascade reset).
  const [scope, setScope] = useState<Scope>(initialScope);
  const [category, setCategory] = useState<Category | null>(() => {
    if (!initialCategorySlug) return null;
    // Category slug must belong to the active scope's category set.
    if (initialScope !== "all" && categoriesForType[initialScope].includes(initialCategorySlug)) {
      return initialCategorySlug;
    }
    return null;
  });
  const [subcategory, setSubcategory] = useState<Subcategory | null>(() => {
    if (!initialSubcategorySlug) return null;
    // Validate subcategory belongs to (initialScope, initialCategorySlug).
    // A stale URL falls through silently rather than crashing the page.
    if (initialScope === "all" || !initialCategorySlug) return null;
    const def = subcategoryDefs.find(
      (s) =>
        s.type === initialScope &&
        s.category === initialCategorySlug &&
        s.slug === initialSubcategorySlug,
    );
    return def ? def.slug : null;
  });
  const [tags, setTags] = useState<string[]>(initialTags);
  const [query, setQuery] = useState("");
  // Bidirectional hover sync between map pins and list items.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Selected entry is derived from the URL -- never set in-place by clicks.
  // Clicking a list row or a map pin navigates to the canonical detail URL,
  // which re-mounts SectionView with a new initialSelectedSlug.
  const selectedEntry = useMemo(() => {
    if (!initialSelectedSlug || !initialSelectedType) return null;
    return (
      entries.find(
        (e) => e.slug === initialSelectedSlug && e.type === initialSelectedType,
      ) ?? null
    );
  }, [entries, initialSelectedSlug, initialSelectedType]);

  // Cascade reset handlers. Each handler clears all narrower levels --
  // a category that lived under a different scope rarely transfers
  // cleanly, and a subcategory under a different category is meaningless.
  const handleScopeChange = useCallback((next: Scope) => {
    setScope(next);
    setCategory(null);
    setSubcategory(null);
    setTags([]);
    setQuery("");
  }, []);

  const handleCategoryChange = useCallback((next: Category | null) => {
    setCategory(next);
    setSubcategory(null);
    setTags([]);
  }, []);

  const handleSubcategoryChange = useCallback(
    (next: Subcategory | null) => {
      setSubcategory(next);
      setTags([]);
    },
    [],
  );

  const handleTagToggle = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  // URL state sync. When the user changes filters (in listing mode), we
  // mirror them into the address bar so the link is shareable. We skip
  // detail mode -- canonical URL is /akce/[slug] etc., not a filter.
  useEffect(() => {
    if (initialSelectedSlug) return;
    const params = new URLSearchParams();
    if (scope !== "all") {
      // Type is its own URL slug in the new taxonomy.
      params.set("type", scope);
    }
    if (category) params.set("cat", category);
    if (subcategory) params.set("sub", subcategory);
    if (tags.length > 0) params.set("tags", tags.join(","));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [scope, category, subcategory, tags, pathname, router, initialSelectedSlug]);

  // Pill rows visible right now. Progressive reveal: each level appears
  // only after the previous one is committed (not "Vše").
  const visibleCategories = useMemo(() => categoriesFor(scope), [scope]);
  const visibleSubcategories = useMemo(() => {
    if (!category || scope === "all") return [];
    return subcategoriesFor(scope, category);
  }, [scope, category]);
  // Show tag row when (a) subcategory is picked, or (b) the active
  // category is flat (no subcategories at all).
  const showTagRow = Boolean(
    subcategory ||
      (category &&
        scope !== "all" &&
        subcategoriesFor(scope, category).length === 0),
  );

  // Filtered entries differ by scope:
  // - "all": no type filter, no forward time window. AllScopeList handles
  //   its own per-section windowing (top-5 upcoming, top-5 featured …).
  // - single type: forward time window for events, full list for others.
  // The cascade applies in both modes: category → subcategory → tags
  // narrow the list further, plus full-text query.
  const filtered = useMemo(() => {
    let list = entries;
    if (scope !== "all") {
      list = filterByType(list, [scope]);
      const now = new Date();
      const windowEnd = new Date(now);
      windowEnd.setDate(now.getDate() + EVENT_WINDOW_DAYS);
      list = filterByTimeWindow(list, now, windowEnd);
    }
    list = filterByCategory(list, category);
    list = filterBySubcategory(list, subcategory);
    list = filterByTagsIntersection(list, tags);
    list = filterByText(list, query);
    return list;
  }, [entries, scope, category, subcategory, tags, query]);

  // Tag pool for the chip row. Computed from the items that currently
  // pass type/category/subcategory filters (so picking "Hudební" shows
  // hudební tags, not the whole vocabulary). Tags from the active set
  // are always included even if the filter narrowed them out -- so user
  // can still see what's currently selected.
  const tagPool = useMemo(() => {
    let scoped = entries;
    if (scope !== "all") scoped = filterByType(scoped, [scope]);
    scoped = filterByCategory(scoped, category);
    scoped = filterBySubcategory(scoped, subcategory);
    const pool = collectTags(scoped);
    for (const t of tags) {
      if (!pool.includes(t)) pool.push(t);
    }
    return pool;
  }, [entries, scope, category, subcategory, tags]);

  // Map shows different content based on mode:
  // - Detail (canonical URL): only the selected entry, zoomed in. The page
  //   is about ONE thing; surrounding pins would distract.
  // - Listing: all filtered entries, map stays anchored on Krhanice.
  const mapEntries = useMemo(() => {
    if (selectedEntry) return [selectedEntry];
    return filtered;
  }, [filtered, selectedEntry]);

  const handleSelect = useCallback(
    (entry: Entry) => {
      router.push(entry.href);
    },
    [router],
  );

  // Hover from MAP -- highlight the list item AND scroll it into view.
  // Skipped in detail mode (no list visible) to avoid spurious scrolls.
  const handleMapHover = useCallback(
    (entry: Entry | null) => {
      if (selectedEntry) return;
      setHoveredId(entry?.id ?? null);
      if (entry && listRef.current) {
        const el = listRef.current.querySelector(
          `[data-entry-id="${entry.id}"]`,
        );
        if (el && "scrollIntoView" in el) {
          (el as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    },
    [selectedEntry],
  );

  // Hover from LIST -- only highlight, no scroll (the item is already visible).
  const handleListHover = useCallback((entry: Entry | null) => {
    setHoveredId(entry?.id ?? null);
  }, []);

  const placeholder = searchPlaceholderByScope[scope];

  // Show the distance hint only when the active list is distance-sorted.
  // In "all" mode each section has its own sort, so the hint is omitted.
  // Distance-sorted scopes: everything except akce (which sorts by date) and
  // "all" (which uses curated sections with their own sorts).
  const sortHint =
    scope !== "all" && scope !== "akce"
      ? ` · ${tHome("sortByDistance")}`
      : "";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* In detail mode hide the section header AND all filters on every
          viewport -- the user came here for one specific entry. */}
      {selectedEntry ? null : (
        <>
          <header className="pt-12 pb-6 sm:pt-16 lg:pb-8">
            {pageEyebrow ? (
              <p className="eyebrow mb-3">{pageEyebrow}</p>
            ) : null}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
              {pageTitle}
            </h1>
            {pageIntro ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                {pageIntro}
              </p>
            ) : null}
          </header>

          <div className="space-y-3 pb-6">
            {/* Level 1: Type pills (always visible). Largest size --
                they set the corpus for the whole page. Wrapped in
                FilterRow so the "TYP" label aligns with KATEGORIE /
                PODKATEGORIE / ŠTÍTKY in the rows below. */}
            <FilterRow label="Typ">
              <ScopePills active={scope} onChange={handleScopeChange} />
            </FilterRow>

            {/* Level 2: Category pills. Visible after a non-"Vše" type
                is picked. Medium size. "Vše" sentinel resets level 2
                and cascades to clear levels 3 + 4. */}
            {visibleCategories.length > 0 ? (
              <PillRow
                label="Kategorie"
                size="md"
                items={[
                  { value: null, label: tHome("filterAll") },
                  ...visibleCategories.map((c) => ({
                    value: c as Category,
                    label: scope === "all" ? c : getCategoryLabel(scope, c),
                  })),
                ]}
                active={category}
                onChange={(v) =>
                  handleCategoryChange((v as Category | null) ?? null)
                }
              />
            ) : null}

            {/* Level 3: Subcategory pills. Visible only when the active
                category has subcategories. Small size. */}
            {visibleSubcategories.length > 0 ? (
              <PillRow
                label="Podkategorie"
                size="sm"
                items={[
                  { value: null, label: tHome("filterAll") },
                  ...visibleSubcategories.map((s) => ({
                    value: s.slug as Subcategory,
                    label: s.label,
                  })),
                ]}
                active={subcategory}
                onChange={(v) =>
                  handleSubcategoryChange((v as Subcategory | null) ?? null)
                }
              />
            ) : null}

            {/* Level 4: Tag chips. Multi-select, intersection (AND).
                Visible after subcategory is picked, or when the active
                category is flat (no subcategories defined). */}
            {showTagRow && tagPool.length > 0 ? (
              <TagChipRow
                label="Štítky"
                tags={tagPool}
                active={tags}
                onToggle={handleTagToggle}
              />
            ) : null}

            <SearchBar
              query={query}
              onChange={setQuery}
              placeholder={placeholder}
              size="large"
            />
          </div>
        </>
      )}

      <div
        className={`grid gap-6 pb-16 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-8 ${
          selectedEntry ? "pt-6 lg:pt-8" : ""
        }`}
      >
        {/* Map column: portrait 3:4 aspect (instead of a tall noodle or
            square). Mobile order-2 places it after the content. Desktop
            sticks on the left; sticky offset matches the grid's top
            padding so the map top aligns with the content top. */}
        <div className="relative order-2 aspect-[3/4] w-full lg:order-1 lg:sticky lg:top-24">
          <MapView
            entries={mapEntries}
            onEntryClick={handleSelect}
            selectedId={selectedEntry?.id}
            hoveredId={hoveredId ?? undefined}
            onEntryHover={handleMapHover}
          />
        </div>

        {/* Content: detail (canonical URL) or scrolling list (listing URL).
            Renders first on mobile so the user sees what they came for. */}
        <div className="order-1 lg:order-2">
          {selectedEntry && initialSelectedType ? (
            <EntryDetail
              entry={selectedEntry}
              backHref={pruvodceHref(initialSelectedType)}
              contextType={initialSelectedType}
            />
          ) : (
            <div ref={listRef}>
              <p className="mb-4 text-xs text-[var(--color-text-tertiary)]">
                {tHome("resultsCount", { count: filtered.length })}
                {filtered.length > 0 ? sortHint : ""}
              </p>
              {scope === "all" ? (
                <AllScopeList
                  entries={filtered}
                  emptyLabel={tHome("noResults")}
                  hoveredId={hoveredId ?? undefined}
                  onHover={handleListHover}
                />
              ) : scope === "akce" ? (
                <TimelineView
                  entries={sortByStart(filtered)}
                  emptyLabel={tHome("noResults")}
                  contextType="akce"
                  hoveredId={hoveredId ?? undefined}
                  onHover={handleListHover}
                />
              ) : (
                <DistanceList
                  entries={sortByDistance(filtered)}
                  contextType={scope}
                  emptyLabel={tHome("noResults")}
                  hoveredId={hoveredId ?? undefined}
                  onHover={handleListHover}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter row primitives (single-select pills + multi-select tag chips)
// ─────────────────────────────────────────────────────────────────────────────

// Fixed label column width so all four filter rows (TYP / KATEGORIE /
// PODKATEGORIE / ŠTÍTKY) start their pill column at the same x-axis
// position. Without this, the rows wobble because each label is a
// different width.
const LABEL_COL = "w-28 shrink-0";

// Wrapper that gives a filter row a left-aligned uppercase label and an
// inline pill area. Used for ScopePills (TYP) at the top and for
// PillRow / TagChipRow below.
function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 sm:flex-nowrap">
      <span
        className={`${LABEL_COL} section-eyebrow`}
      >
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

interface PillItem<V> {
  value: V;
  label: string;
}

// Single-select pill row used for category and subcategory levels. Active
// pill gets the inverted treatment (text-bg block); inactive pills sit
// as soft outline chips. Size prop scales the rhythm so deeper levels
// read smaller and the page hierarchy is unambiguous.
function PillRow<V extends string | null>({
  label,
  size,
  items,
  active,
  onChange,
}: {
  label: string;
  size: "md" | "sm";
  items: PillItem<V>[];
  active: V;
  onChange: (next: V) => void;
}) {
  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <FilterRow label={label}>
      {items.map((item) => {
        const isActive =
          item.value === active ||
          (item.value === null && active === null);
        return (
          <button
            key={String(item.value ?? "all")}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={isActive}
            className={[
              "rounded-full border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              sizeClasses,
              isActive
                ? "border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border-[var(--color-border)] bg-transparent font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </FilterRow>
  );
}

// Multi-select chip row for tags. Active chips get the inverted block
// just like the single-select pills, but multiple can be active at once
// (intersection / AND filter). Size is fixed to xs -- this is the
// finest-grained filter on the page.
function TagChipRow({
  label,
  tags,
  active,
  onToggle,
}: {
  label: string;
  tags: string[];
  active: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <FilterRow label={label}>
      {tags.map((tag) => {
        const isActive = active.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            aria-pressed={isActive}
            className={[
              "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              isActive
                ? "border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border-[var(--color-border)] bg-transparent font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            {tag}
          </button>
        );
      })}
    </FilterRow>
  );
}

// Maximum items per "Vše" section. Beyond this, the user is invited to
// jump into the type-filtered listing via "Zobrazit všechny X".
const ALL_SECTION_LIMIT = 5;

// "Vše" listing: a curated landing, NOT a full dump.
// - Events: top 5 chronologically (objective, calendar wins).
// - Services / Places: items marked `featured: true` by the operator,
//   with a graceful fallback to the closest entries when nothing is
//   featured yet. Multi-type entries (hospoda = place + service) can
//   surface in BOTH sections at once -- this matches operator intent.
function AllScopeList({
  entries,
  emptyLabel,
  hoveredId,
  onHover,
}: {
  entries: Entry[];
  emptyLabel: string;
  hoveredId?: string;
  onHover?: (entry: Entry | null) => void;
}) {
  // Events: top-5 upcoming chronologically. Past events are filtered out
  // here (the parent skips the 60-day window in "all" mode so we can see
  // farther into the future, but past entries should never surface).
  const events = useMemo(() => {
    const now = new Date();
    return sortByStart(
      entries.filter((e) => {
        if (e.type !== "akce" || !e.startedAt) return false;
        const end = e.endedAt ? new Date(e.endedAt) : new Date(e.startedAt);
        return end >= now;
      }),
    ).slice(0, ALL_SECTION_LIMIT);
  }, [entries]);

  const places = useMemo(
    () => pickFeaturedOrFallback(entries, "mista"),
    [entries],
  );
  const gastro = useMemo(
    () => pickFeaturedOrFallback(entries, "gastro"),
    [entries],
  );
  const obchody = useMemo(
    () => pickFeaturedOrFallback(entries, "obchody"),
    [entries],
  );
  const sluzby = useMemo(
    () => pickFeaturedOrFallback(entries, "sluzby"),
    [entries],
  );
  const spolky = useMemo(
    () => pickFeaturedOrFallback(entries, "spolky"),
    [entries],
  );

  const allSections: Array<{
    key: EntryType;
    label: string;
    showAllLabel: string;
    items: Entry[];
  }> = [
    {
      key: "akce",
      label: "Nadcházející akce",
      showAllLabel: "Všechny akce →",
      items: events,
    },
    {
      key: "mista",
      label: "Vybraná místa",
      showAllLabel: "Všechna místa →",
      items: places,
    },
    {
      key: "gastro",
      label: "Vybrané gastro",
      showAllLabel: "Vše gastro →",
      items: gastro,
    },
    {
      key: "obchody",
      label: "Vybrané obchody",
      showAllLabel: "Všechny obchody →",
      items: obchody,
    },
    {
      key: "sluzby",
      label: "Vybrané služby",
      showAllLabel: "Všechny služby →",
      items: sluzby,
    },
    {
      key: "spolky",
      label: "Vybrané spolky",
      showAllLabel: "Všechny spolky →",
      items: spolky,
    },
  ];
  const sections = allSections.filter((s) => s.items.length > 0);

  if (sections.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.key} aria-labelledby={`scope-${section.key}`}>
          <div className="mb-1 flex items-end justify-between gap-4 px-3">
            <h2
              id={`scope-${section.key}`}
              className="section-eyebrow"
            >
              {section.label}
            </h2>
            {/* The "Show all X" link routes to the type-filtered listing,
                which switches the pill scope to that type and shows the
                full sorted list with all filters available. */}
            <a
              href={pruvodceHref(section.key)}
              className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)] underline-offset-4 outline-none transition-colors hover:text-[var(--color-text)] hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              {section.showAllLabel}
            </a>
          </div>
          <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {section.items.map((entry) => (
              <li key={entry.id}>
                <EntryListItem
                  entry={entry}
                  contextType={section.key}
                  hovered={hoveredId === entry.id}
                  onHover={onHover}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// Pick featured entries of a given type for the "Vše" landing. If the
// operator has not flagged any entry as featured yet, fall back to the
// nearest 5 by distance so the section is never empty without reason.
// Uses types.includes() (not types[0]) so multi-type entries can show in
// both relevant sections when explicitly featured.
function pickFeaturedOrFallback(
  entries: Entry[],
  type: EntryType,
): Entry[] {
  const all = entries.filter((e) => e.type === type);
  const featured = all.filter((e) => e.featured);
  const pool = featured.length > 0 ? featured : all;
  return sortByDistance(pool).slice(0, ALL_SECTION_LIMIT);
}

// Two-line empty state used when filters yield zero results. The headline
// names the situation, the hint nudges the user toward the easiest fix
// (drop the narrowest filter or switch type back to "Vše"). Wrapped in
// a dashed-border card so it reads as a placeholder, not raw text floating
// in the empty pane.
function EmptyState({ label }: { label: string }) {
  const tHome = useTranslations("homepage");
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elev)] px-6 py-12 text-center">
      <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {tHome("noResultsHint")}
      </p>
    </div>
  );
}

function DistanceList({
  entries,
  contextType,
  emptyLabel,
  hoveredId,
  onHover,
}: {
  entries: Entry[];
  contextType: EntryType;
  emptyLabel: string;
  hoveredId?: string;
  onHover?: (entry: Entry | null) => void;
}) {
  if (entries.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {entries.map((entry) => (
        <li key={entry.id}>
          <EntryListItem
            entry={entry}
            contextType={contextType}
            hovered={hoveredId === entry.id}
            onHover={onHover}
          />
        </li>
      ))}
    </ul>
  );
}

type MetaRow = {
  label: string;
  value: string | null | undefined;
  href?: string;
  // When true, the link opens in a new tab (used for website URLs).
  external?: boolean;
};

// Build the meta block in priority order for the entry's primary type.
// Empty rows (no value) are filtered out before render.
function buildMetaRows(entry: Entry): MetaRow[] {
  const range = formatRange(entry.startedAt, entry.endedAt);
  const phoneHref = entry.contactPhone
    ? `tel:${entry.contactPhone.replace(/\s/g, "")}`
    : undefined;
  const emailHref = entry.contactEmail
    ? `mailto:${entry.contactEmail}`
    : undefined;
  const webValue = entry.website ? formatWebUrl(entry.website) : null;

  const t = entry.type;

  // Akce: when + where + organizer first, then web + contacts.
  if (t === "akce") {
    return [
      { label: "Termín", value: range },
      { label: "Místo", value: entry.address },
      { label: "Vstupné", value: entry.price },
      { label: "Pořadatel", value: entry.organizer },
      { label: "Web", value: webValue, href: entry.website, external: true },
      { label: "E-mail", value: entry.contactEmail, href: emailHref },
      { label: "Telefon", value: entry.contactPhone, href: phoneHref },
    ];
  }

  // Sluzby + spolky: how to reach them comes first.
  if (t === "sluzby" || t === "spolky") {
    return [
      { label: "Telefon", value: entry.contactPhone, href: phoneHref },
      { label: "E-mail", value: entry.contactEmail, href: emailHref },
      { label: "Otevírací doba", value: entry.hours },
      { label: "Web", value: webValue, href: entry.website, external: true },
      { label: "Adresa", value: entry.address },
      { label: "Pořadatel", value: entry.organizer },
    ];
  }

  // Mista + gastro + obchody: address + opening hours + admission, then web.
  return [
    { label: "Adresa", value: entry.address },
    { label: "Otevírací doba", value: entry.hours },
    { label: "Vstupné", value: entry.price },
    { label: "Parkování", value: entry.parking },
    { label: "Web", value: webValue, href: entry.website, external: true },
    { label: "Pořadatel", value: entry.organizer },
    { label: "E-mail", value: entry.contactEmail, href: emailHref },
    { label: "Telefon", value: entry.contactPhone, href: phoneHref },
  ];
}

function EntryDetail({
  entry,
  backHref,
  contextType,
}: {
  entry: Entry;
  // Path to the listing. Renders a quiet "Zpět na seznam" anchor link.
  backHref: string;
  contextType: EntryType;
}) {
  const visibleRows = buildMetaRows(entry).filter(
    (r): r is MetaRow & { value: string } => Boolean(r.value),
  );
  void contextType;
  const displayType = entry.type;

  return (
    <article aria-label={`Detail: ${entry.title}`}>
      {/* Decent breadcrumb, not a button. Quiet, gives the user a way out
          without competing with the page content. */}
      <a
        href={backHref}
        className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
      >
        <ChevronLeft size={12} aria-hidden />
        Zpět na seznam
      </a>

      <div className="mt-3">
        {/* Same chip row pattern as in the list item: root type first,
            then categories, all with identical visual weight. */}
        <div className="flex flex-wrap gap-1.5">
          <a
            href={pruvodceHref(displayType)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {typeLabels[displayType]}
          </a>
          <a
            href={categoryFilterHref(entry, entry.category)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {getCategoryLabel(entry.type, entry.category)}
          </a>
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl">
          {entry.title}
        </h2>

        <div className="mt-5">
          <EntryThumb entry={entry} contextType={contextType} variant="hero" />
        </div>

        {visibleRows.length > 0 || entry.social ? (
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {visibleRows.map((row) => (
              <DefnRow
                key={row.label}
                label={row.label}
                value={row.value}
                href={row.href}
                external={row.external}
              />
            ))}
            {entry.social ? <SocialRow social={entry.social} /> : null}
          </dl>
        ) : null}

        {entry.description ? (
          <p className="mt-7 text-base text-[var(--color-text-secondary)]">
            {entry.description}
          </p>
        ) : null}

        {/* Tags row: each tag links back to the listing pre-filtered to
            that tag (with the entry's full cascade applied so the URL
            lands the user back exactly here). Sits below contacts +
            description so it reads as metadata, not a CTA. */}
        {entry.tags && entry.tags.length > 0 ? (
          <div className="mt-7 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
              Štítky:
            </span>
            {entry.tags.map((tag) => (
              <a
                key={tag}
                href={tagFilterHref(entry, tag)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {getTagLabel(tag)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

// Build a /pruvodce URL with the entry's full cascade pre-applied plus
// the chosen tag pinned in. The user lands at the listing with type +
// category + subcategory + tag all active, the chip row reflects that
// state, and clicking another tag refines (intersection) on top.
function tagFilterHref(entry: Entry, tag: string): string {
  const params = new URLSearchParams();
  params.set("type", entry.type);
  params.set("cat", entry.category);
  if (entry.subcategory) params.set("sub", entry.subcategory);
  params.set("tags", tag);
  return `/pruvodce?${params.toString()}`;
}

function SocialRow({ social }: { social: SocialLinks }) {
  const items = SOCIAL_ITEMS.filter((item) => social[item.key]);
  if (items.length === 0) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        Sociální sítě
      </dt>
      {/* Plain icons sitting on the page background, sized to the
          surrounding text. No pill, no border, no wrapper -- the icons
          ARE the link. */}
      <dd className="mt-1.5 flex flex-wrap items-center gap-3 text-[var(--color-text-secondary)]">
        {items.map(({ key, Icon, label }) => (
          <a
            key={key}
            href={social[key]!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex items-center outline-none transition-colors hover:text-[var(--color-text)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            <Icon size={16} aria-hidden />
          </a>
        ))}
      </dd>
    </div>
  );
}

function DefnRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-[var(--color-text)]">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 outline-none hover:underline focus-visible:underline focus-visible:underline-offset-2"
          >
            {value}
            {external ? <ArrowUpRight size={12} aria-hidden /> : null}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
