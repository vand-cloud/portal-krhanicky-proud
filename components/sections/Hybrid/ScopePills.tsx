import { Calendar, MapPin, Utensils, Store, Briefcase, Users, Sparkles } from "lucide-react";
import { typeNavLabels, typeOrder } from "@/content/entries";
import type { EntryType } from "@/content/entries";
import type { Scope } from "./util";

// Scope order on the listing page. "Vše" is a passive option (not the
// default), Akce comes first because most users want it. Other types
// follow the canonical typeOrder.
const ORDER: Scope[] = ["all", ...typeOrder];

const ALL_LABEL = "Vše";

// Per-type icons. Same vocabulary as map markers and entry thumbnails so
// users see the consistent sign system across pills, list thumbs, pins.
const iconByType: Record<
  EntryType,
  (props: { size?: number }) => React.JSX.Element
> = {
  akce: ({ size = 14 }) => <Calendar size={size} aria-hidden />,
  mista: ({ size = 14 }) => <MapPin size={size} aria-hidden />,
  gastro: ({ size = 14 }) => <Utensils size={size} aria-hidden />,
  obchody: ({ size = 14 }) => <Store size={size} aria-hidden />,
  sluzby: ({ size = 14 }) => <Briefcase size={size} aria-hidden />,
  spolky: ({ size = 14 }) => <Users size={size} aria-hidden />,
};

// State-based filter pills (no navigation). Clicking a pill calls onChange
// with the new scope. The active pill gets the inverted dark style.
export function ScopePills({
  active,
  onChange,
}: {
  active: Scope;
  onChange: (next: Scope) => void;
}) {
  return (
    <nav aria-label="Filtr typu položek" className="flex flex-wrap gap-2">
      {ORDER.map((scope) => {
        const isActive = scope === active;
        const label = scope === "all" ? ALL_LABEL : typeNavLabels[scope];
        const Icon =
          scope === "all"
            ? ({ size = 14 }: { size?: number }) => (
                <Sparkles size={size} aria-hidden />
              )
            : iconByType[scope];
        return (
          <button
            key={scope}
            type="button"
            onClick={() => onChange(scope)}
            aria-pressed={isActive}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
              isActive
                ? "border border-[var(--color-text)] bg-[var(--color-bg-elev)] text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                : "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-text)] hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
