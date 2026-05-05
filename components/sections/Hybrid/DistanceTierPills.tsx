"use client";

import {
  distanceTierLabels,
  distanceTierOrder,
  type DistanceTier,
} from "@/content/entries";

// Single-select tier pills -- the bottom row of the homepage filter
// cascade. Sized to match the subcategory PillRow (size="sm",
// px-2.5 py-1 text-xs) so visual weight steps down through the
// cascade: type pills (largest) -> category (md) -> subcategory (sm)
// -> tags (xs) -> distance tier (sm, but anchored as row 5). Always
// exactly one tier is active; no "Vše" sentinel because "no distance
// limit" has no useful meaning for a hyperlocal portal.
//
// No icons -- the three labels (Jen Krhanice / Do 7 km / Do 15 km)
// carry the meaning on their own and adding a third symbol class
// (alongside ScopePills icons and tag chips) would clutter the hero.
export function DistanceTierPills({
  active,
  onChange,
}: {
  active: DistanceTier;
  onChange: (next: DistanceTier) => void;
}) {
  return (
    <nav
      aria-label="Filtr vzdálenosti od Krhanic"
      className="flex flex-wrap justify-center gap-1.5"
    >
      {distanceTierOrder.map((tier) => {
        const isActive = tier === active;
        return (
          <button
            key={tier}
            type="button"
            onClick={() => onChange(tier)}
            aria-pressed={isActive}
            className={[
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              isActive
                ? "border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border-[var(--color-border)] bg-transparent font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            {distanceTierLabels[tier]}
          </button>
        );
      })}
    </nav>
  );
}
