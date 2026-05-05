"use client";

import { ChevronDown } from "lucide-react";

// Three sort modes for the non-event listings (mista / gastro / obchody
// / sluzby / spolky):
//   - distance: nearest first, the default. Matches the hyperlocal
//               framing of the portal -- when in doubt, what's close.
//   - alpha:    a-z by title, useful when the user is looking for a
//               specific name and doesn't care where it sits.
//   - featured: editor-curated first (entries with `featured: true`),
//               then by distance as tiebreak. Replaces the originally
//               proposed "Nejlépe hodnocené" because we don't have a
//               rating data axis yet (no Sanity field, no external
//               reviews integration). Editor flags carry the same UX
//               intent without inventing data.
export type SortMode = "distance" | "alpha" | "featured";

const LABELS: Record<SortMode, string> = {
  distance: "Nejbližší",
  alpha: "Abecedně",
  featured: "Doporučené",
};

const ORDER: SortMode[] = ["distance", "alpha", "featured"];

// Quiet inline sort control. Native <select> for accessibility
// (keyboard, screen reader, OS menu) with custom styling that blends
// into the page chrome -- no border by default, just a chevron hint
// that it opens. Hover/focus pulls a subtle border so the affordance
// is clear when the user reaches it. Renders inline (no outer wrapper
// margin or alignment) so the parent decides where it sits relative
// to the result count.
export function SortControl({
  mode,
  onChange,
}: {
  mode: SortMode;
  onChange: (next: SortMode) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
      <label htmlFor="sort-mode" className="select-none">
        Řadit:
      </label>
      <div className="relative">
        <select
          id="sort-mode"
          value={mode}
          onChange={(e) => onChange(e.target.value as SortMode)}
          className="appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] py-1 pl-2 pr-7 text-xs font-medium text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-text)] focus-visible:border-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
        >
          {ORDER.map((m) => (
            <option
              key={m}
              value={m}
              className="bg-[var(--color-bg)] text-[var(--color-text)]"
            >
              {LABELS[m]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
        />
      </div>
    </div>
  );
}
