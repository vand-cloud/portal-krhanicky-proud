"use client";

import { Home, MapPinned, Map } from "lucide-react";
import {
  distanceTierLabels,
  distanceTierOrder,
  type DistanceTier,
} from "@/content/entries";

// Per-tier icons. Not just decorative -- they reinforce the geographic
// nesting metaphor: home (just here) -> pinned (close enough to walk
// or short drive) -> regional map (the wider catchment).
const iconByTier: Record<
  DistanceTier,
  (props: { size?: number }) => React.JSX.Element
> = {
  krhanice: ({ size = 14 }) => <Home size={size} aria-hidden />,
  blizko: ({ size = 14 }) => <MapPinned size={size} aria-hidden />,
  region: ({ size = 14 }) => <Map size={size} aria-hidden />,
};

// Single-select tier pills, mirrors ScopePills visual treatment so the
// hero's filter cascade reads as one consistent vocabulary. Always
// exactly one tier is active; no "Vše" sentinel because "no distance
// limit" has no useful meaning for a hyperlocal portal.
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
      className="flex flex-wrap justify-center gap-2"
    >
      {distanceTierOrder.map((tier) => {
        const isActive = tier === active;
        const Icon = iconByTier[tier];
        return (
          <button
            key={tier}
            type="button"
            onClick={() => onChange(tier)}
            aria-pressed={isActive}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              isActive
                ? "border border-[var(--color-text)] bg-[var(--color-bg-elev)] font-semibold text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            <Icon size={14} />
            {distanceTierLabels[tier]}
          </button>
        );
      })}
    </nav>
  );
}
