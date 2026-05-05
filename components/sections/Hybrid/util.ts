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

// All scope values accepted by the homepage listing.
export type Scope = "all" | EntryType;

// Build URL for the homepage listing with a specific scope pre-selected.
// The Krhanický průvodce IS the homepage now (formerly /pruvodce), so
// "all" maps to "/" and scope filters become "/?type=...".
export function pruvodceHref(scope: Scope): string {
  if (scope === "all") return "/";
  return `/?type=${scopeSlugByType[scope]}`;
}

// Build URL for a category-filtered listing view, anchored to the entry's
// type. Click on a "Děti a rodina" chip in an event detail goes to
// /?type=akce&cat=deti-rodina.
export function categoryFilterHref(entry: Entry, cat: Category): string {
  return `/?type=${scopeSlugByType[entry.type]}&cat=${encodeURIComponent(cat)}`;
}
