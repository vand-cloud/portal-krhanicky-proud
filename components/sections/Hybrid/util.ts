import type { Category, Entry, EntryType } from "@/content/entries";

// New taxonomy: every type IS its own URL slug -- no translation table needed.
// Kept as a Record so callers that previously read scopeSlugByType[type]
// continue to work without changes.
export const scopeSlugByType: Record<EntryType, string> = {
  akce: "akce",
  mista: "mista",
  gastro: "gastro",
  obchody: "obchody",
  sluzby: "sluzby",
  spolky: "spolky",
};

// All scope values accepted by the /pruvodce page.
export type Scope = "all" | EntryType;

// Build URL for the listing page with a specific scope pre-selected.
export function pruvodceHref(scope: Scope): string {
  if (scope === "all") return "/pruvodce";
  return `/pruvodce?type=${scopeSlugByType[scope]}`;
}

// Build URL for a category-filtered listing view, anchored to the entry's
// type. Click on a "Děti a rodina" chip in an event detail goes to
// /pruvodce?type=akce&cat=deti-rodina.
export function categoryFilterHref(entry: Entry, cat: Category): string {
  return `/pruvodce?type=${scopeSlugByType[entry.type]}&cat=${encodeURIComponent(cat)}`;
}
