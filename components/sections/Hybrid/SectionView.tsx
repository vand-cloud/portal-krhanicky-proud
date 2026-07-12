"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, ChevronLeft } from "lucide-react";
import { BlogCard } from "../Blog/BlogCard";
import type { BlogPostVM } from "@/lib/sanity/content-types";
import type {
  Category,
  Entry,
  EntryType,
  SocialLinks,
  Subcategory,
} from "@/content/entries";
import {
  DEFAULT_DISTANCE_TIER,
  KRHANICE_CENTER,
  categoriesForType,
  distanceTierOrder,
  entryMatchesTier,
  filterByCategory,
  filterBySubcategory,
  filterByTagsIntersection,
  filterByText,
  filterByTimeWindow,
  filterByType,
  getCategoryLabel,
  getTagLabel,
  haversineKm,
  sortByDistance,
  sortByStart,
  subcategoriesFor,
  subcategoryDefs,
  typeLabels,
  type DistanceTier,
} from "@/content/entries";
import { SearchBar } from "./SearchBar";
import { TimelineView } from "./TimelineView";
import { MapView } from "./MapView";
import { EntryListItem } from "./EntryListItem";
import { EntryThumb } from "./EntryThumb";
import { ScopePills } from "./ScopePills";
import { DistanceTierPills } from "./DistanceTierPills";
import { SortControl, type SortMode } from "./SortControl";
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
  initialTier,
  initialSelectedSlug,
  initialSelectedType,
  blogPosts = [],
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
  // From URL query (?dist=krhanice|blizko|region). Sets the distance tier.
  // Falls back to DEFAULT_DISTANCE_TIER ("blizko") when absent or invalid.
  initialTier?: DistanceTier;
  // Set on canonical detail pages (/akce/[slug] etc.). Together with
  // initialSelectedType, the view shows the detail panel pre-selected.
  initialSelectedSlug?: string;
  initialSelectedType?: EntryType;
  // Newest blog posts from Sanity for the editorial band under the search
  // module. Passed from the homepage server component (already sorted
  // newest-first); BlogBand shows the top few.
  blogPosts?: BlogPostVM[];
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
  // Distance tier is a cross-cutting filter -- it does NOT cascade-reset
  // when the user changes scope/category/etc. A user filtering "Do 7 km"
  // who switches from Akce to Místa probably still wants "Do 7 km".
  const [tier, setTier] = useState<DistanceTier>(
    initialTier ?? DEFAULT_DISTANCE_TIER,
  );
  // Sort mode for non-event listings (mista / gastro / obchody / sluzby
  // / spolky). Akce uses chronological time buckets in TimelineView and
  // does not surface a sort control. "all" scope is a curated landing
  // and likewise stays untouched.
  const [sortMode, setSortMode] = useState<SortMode>("distance");
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

  // "Načíst všechny akce" on the "Vše" landing: flip the pill scope to
  // Akce (in place, no navigation -- keeps the SPA state) and lift the
  // viewport back to the hero so the user sees the now-active Akce pill
  // and the full chronological timeline below it.
  const handleShowAllEvents = useCallback(() => {
    handleScopeChange("akce");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [handleScopeChange]);

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
    // Only serialize tier when it differs from the default. Keeps the
    // URL clean for the common case (Do 7 km) and makes ?dist=krhanice
    // / ?dist=region the explicit shareable variants.
    if (tier !== DEFAULT_DISTANCE_TIER) params.set("dist", tier);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [scope, category, subcategory, tags, tier, pathname, router, initialSelectedSlug]);

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
    // Distance tier: applied LAST so all categorical filters narrow first
    // and the geo cut sits on top. inVillage entries always pass; others
    // require lat/lng within the tier's km radius.
    list = list.filter((e) => entryMatchesTier(e, tier));
    return list;
  }, [entries, scope, category, subcategory, tags, query, tier]);

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

  // Sort variants for the non-Akce listings. Computed once per
  // (filtered, sortMode) so toggling the dropdown is cheap. Each branch
  // returns a fresh array so the underlying `filtered` memo stays
  // immutable.
  //   - distance: nearest first; entries without coords sink to the end
  //               (sortByDistance handles the partition).
  //   - alpha:    a-z by title via Czech-aware localeCompare.
  //   - featured: editor-flagged first (featured: true), then nearest
  //               within each group as the deterministic tiebreak.
  const sortedNonAkce = useMemo(() => {
    if (sortMode === "alpha") {
      return [...filtered].sort((a, b) =>
        a.title.localeCompare(b.title, "cs"),
      );
    }
    if (sortMode === "featured") {
      return [...filtered].sort((a, b) => {
        const af = a.featured ? 1 : 0;
        const bf = b.featured ? 1 : 0;
        if (af !== bf) return bf - af;
        const aHas = a.lat !== undefined && a.lng !== undefined;
        const bHas = b.lat !== undefined && b.lng !== undefined;
        if (aHas && bHas) {
          return (
            haversineKm({ lat: a.lat!, lng: a.lng! }, KRHANICE_CENTER) -
            haversineKm({ lat: b.lat!, lng: b.lng! }, KRHANICE_CENTER)
          );
        }
        if (aHas) return -1;
        if (bHas) return 1;
        return 0;
      });
    }
    return sortByDistance(filtered);
  }, [filtered, sortMode]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* In detail mode hide the section header AND all filters on every
          viewport -- the user came here for one specific entry. */}
      {selectedEntry ? null : (
        <>
          {/* HERO -- centered dominant block. Cascade reads top to
              bottom: identity (eyebrow + title), then four pill rows
              that progressively narrow the corpus, then a free-text
              search, then a geographic tier. All centered so the hero
              stays a single vertical column on the page axis.

              Spacing rules (deliberate, do NOT change without a sweep):
              - Inter-row gap on the four pill rows: 8px (space-y-2),
                uniform across rows so the cascade reads as one block.
              - Search has 16px above (mt-4) and the distance tier has
                16px above (mt-4) too, so search sits with symmetric
                vertical breathing room between Tags and Distance. */}
          <header className="mx-auto max-w-3xl pt-12 pb-8 text-center sm:pt-16 lg:pt-20 lg:pb-10">
            {pageEyebrow ? (
              <p className="eyebrow mb-3">{pageEyebrow}</p>
            ) : null}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-4xl lg:text-5xl">
              {pageTitle}
            </h1>

            {/* Pill cascade -- rows 1 through 4. Uniform 8px gap. */}
            <div className="mt-8 space-y-2">
              {/* Row 1: Type pills (always visible). Largest size, sets
                  the corpus for the whole page. */}
              <ScopePills active={scope} onChange={handleScopeChange} />

              {/* Row 2: Category pills. Visible after a non-"Vše" type
                  is picked. Medium size. "Vše" sentinel resets row 2
                  and cascades to clear rows 3 + 4. */}
              {visibleCategories.length > 0 ? (
                <PillRow
                  size="md"
                  items={[
                    { value: null, label: tHome("filterAll") },
                    ...visibleCategories.map((c) => ({
                      value: c as Category,
                      label:
                        scope === "all" ? c : getCategoryLabel(scope, c),
                    })),
                  ]}
                  active={category}
                  onChange={(v) =>
                    handleCategoryChange((v as Category | null) ?? null)
                  }
                />
              ) : null}

              {/* Row 3: Subcategory pills. Visible only when the active
                  category has subcategories. Small size. */}
              {visibleSubcategories.length > 0 ? (
                <PillRow
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

              {/* Row 4: Tag chips. Multi-select, intersection (AND).
                  Visible after subcategory is picked, or when the
                  active category is flat (no subcategories defined). */}
              {showTagRow && tagPool.length > 0 ? (
                <TagChipRow
                  tags={tagPool}
                  active={tags}
                  onToggle={handleTagToggle}
                />
              ) : null}
            </div>

            {/* Search input -- the free-text fallback. Symmetric 16px
                gap above (from row 4) and below (to row 5) so the
                search sits as a balanced midpoint in the cascade. */}
            <div className="mx-auto mt-4 max-w-2xl">
              <SearchBar
                query={query}
                onChange={setQuery}
                placeholder={placeholder}
                size="large"
              />
            </div>

            {/* Row 5: Distance tier pills -- geographic cross-cutting
                filter. Sized like the row-3 subcategory pills so the
                visual weight steps down through the cascade. 16px
                above to mirror the gap above the search. */}
            <div className="mt-4">
              <DistanceTierPills active={tier} onChange={setTier} />
            </div>
          </header>
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
              {/* Per-scope listing variants. Each carries its own
                  structural metaphor:
                  - "all": curated landing with per-section windowing.
                           No global sort (each section has its own).
                  - "akce": chronological time buckets in TimelineView.
                           Group headers ("Dnes · 3", "Tento víkend · 5"
                           etc.) carry the count; no global readout.
                  - others: SortControl sits at the top of the list,
                           letting the user toggle distance / alpha /
                           featured. The "X výsledků" count was dropped
                           on Simon's "decentní" pass -- the list itself
                           shows what's there. */}
              {scope === "all" ? (
                <AllScopeList
                  entries={filtered}
                  emptyLabel={tHome("noResults")}
                  hoveredId={hoveredId ?? undefined}
                  onHover={handleListHover}
                  onShowAllEvents={handleShowAllEvents}
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
                <>
                  {/* Count on the left, sort control on the right, one
                      row above the list. The "v okolí Krhanic" suffix
                      was dropped on Simon's pass -- redundant with the
                      page hero already saying "Krhanický průvodce". */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {tHome("resultsCount", { count: sortedNonAkce.length })}
                    </p>
                    <SortControl mode={sortMode} onChange={setSortMode} />
                  </div>
                  <DistanceList
                    entries={sortedNonAkce}
                    contextType={scope}
                    emptyLabel={tHome("noResults")}
                    hoveredId={hoveredId ?? undefined}
                    onHover={handleListHover}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full-width blog band below the search+map module. Shown on every
          listing scope (Vše, Akce, Místa, …) once the user scrolls past
          the module. Hidden only on detail pages, which stay focused on
          the single entry. */}
      {!selectedEntry ? <BlogBand posts={blogPosts} /> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter row primitives (single-select pills + multi-select tag chips)
// ─────────────────────────────────────────────────────────────────────────────

// Wrapper for a horizontal filter row of pills/chips. Centered to match
// the hero column; pill content + size hierarchy carries the meaning,
// no uppercase label is rendered.
function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {children}
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
  size,
  items,
  active,
  onChange,
}: {
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
    <FilterRow>
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
  tags,
  active,
  onToggle,
}: {
  tags: string[];
  active: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <FilterRow>
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

// Maximum curated events surfaced on the "Vše" landing before the user is
// invited to open the full Akce timeline.
const ALL_EVENTS_LIMIT = 5;
// Newest blog posts shown in the editorial band under the events.
const ALL_BLOG_LIMIT = 3;

// "Vše" listing inside the search+map module's right column: the
// operator's "Doporučujeme" picks (featured: true), soonest term first,
// capped at 5, each carrying the badge. When nothing is flagged yet
// (fresh portal / empty Sanity), it falls back to the soonest upcoming
// events WITHOUT the badge so the tab is never blank. A button lifts the
// user into the full Akce scope.
//
// The "Z blogu" band is NOT here -- it renders full-width BELOW the whole
// module (see BlogBand in SectionView), so the search+map module closes
// first and the blog opens as its own section.
function AllScopeList({
  entries,
  emptyLabel,
  hoveredId,
  onHover,
  onShowAllEvents,
}: {
  entries: Entry[];
  emptyLabel: string;
  hoveredId?: string;
  onHover?: (entry: Entry | null) => void;
  // Switches the pill scope to Akce and scrolls back to the hero.
  onShowAllEvents: () => void;
}) {
  // Upcoming events only (end >= now). Featured picks win; the fallback
  // to all upcoming kicks in only when the operator has flagged nothing.
  // `badged` tells the rows whether we are showing real picks (so the
  // "Doporučujeme" badge appears) or the unflagged fallback (no badge).
  const { events, badged } = useMemo(() => {
    const now = new Date();
    const upcoming = entries.filter((e) => {
      if (e.type !== "akce" || !e.startedAt) return false;
      const end = e.endedAt ? new Date(e.endedAt) : new Date(e.startedAt);
      return end >= now;
    });
    const featured = upcoming.filter((e) => e.featured);
    const pool = featured.length > 0 ? featured : upcoming;
    return {
      events: sortByStart(pool).slice(0, ALL_EVENTS_LIMIT),
      badged: featured.length > 0,
    };
  }, [entries]);

  return (
    <section aria-labelledby="vse-akce">
      <p className="eyebrow mb-2">Akce</p>
      <h2
        id="vse-akce"
        className="text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl"
      >
        Co se děje v okolí
      </h2>

      {events.length > 0 ? (
        <>
          <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {events.map((entry) => (
              <li key={entry.id}>
                <EntryListItem
                  entry={entry}
                  contextType="akce"
                  featuredBadge={badged && Boolean(entry.featured)}
                  hovered={hoveredId === entry.id}
                  onHover={onHover}
                />
              </li>
            ))}
          </ul>

          {/* Gateway into the full Akce timeline. In-place scope switch,
              not a link -- preserves the search/filter SPA state. */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onShowAllEvents}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-transparent px-5 py-2 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              Načíst všechny akce
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState label={emptyLabel} />
        </div>
      )}
    </section>
  );
}

// Full-width editorial band sitting BELOW the search+map module on the
// "Vše" landing. The three newest blog posts, independent of the entry
// filters (the blog is its own corpus). Spans the full content width so
// the three cards breathe, unlike the column-bound events list above.
function BlogBand({ posts }: { posts: BlogPostVM[] }) {
  // Posts arrive already sorted newest-first from Sanity; show the top few.
  const shown = posts.slice(0, ALL_BLOG_LIMIT);
  if (shown.length === 0) return null;

  // Unique tags across ALL posts (not just the 3 shown), sorted alphabetically.
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort(
    (a, b) => a.localeCompare(b, "cs"),
  );

  return (
    <section
      aria-labelledby="vse-blog"
      className="border-t border-[var(--color-border)] pt-12 pb-20 lg:pt-16"
    >
      {/* Header row: eyebrow + title left, "Všechny články →" link right
          (desktop). Mirrors the "Celý program →" pattern on /proud. */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Z blogu</p>
          <h2
            id="vse-blog"
            className="text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-3xl"
          >
            Co je nového v obci
          </h2>
        </div>
        <a
          href="/blog"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:inline-flex"
        >
          Všechny články
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>

      {/* Tag chips: all unique tags from all blog posts, link to filtered blog */}
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <a
              key={tag}
              href={`/blog?stitek=${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              {tag}
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Mobile-only CTA: header link hides under sm to keep the heading
          line tidy. */}
      <a
        href="/blog"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-brand)] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:hidden"
      >
        Všechny články
        <ArrowRight size={16} aria-hidden />
      </a>
    </section>
  );
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
