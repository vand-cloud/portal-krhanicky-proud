import { Calendar, MapPin, Beer, Store, Briefcase, Users } from "lucide-react";
import type { Entry, EntryType } from "@/content/entries";

// Generic image-placeholder icons -- one per type so the empty thumb still
// communicates what kind of entry it is. The same six icons are reused
// across the map markers and the scope pills so the type vocabulary
// stays one consistent sign system across the whole app.
const placeholderIconByType: Record<
  EntryType,
  (props: { size?: number }) => React.JSX.Element
> = {
  akce: ({ size = 20 }) => <Calendar size={size} aria-hidden />,
  mista: ({ size = 20 }) => <MapPin size={size} aria-hidden />,
  gastro: ({ size = 20 }) => <Beer size={size} aria-hidden />,
  obchody: ({ size = 20 }) => <Store size={size} aria-hidden />,
  sluzby: ({ size = 20 }) => <Briefcase size={size} aria-hidden />,
  spolky: ({ size = 20 }) => <Users size={size} aria-hidden />,
};

// Aspect ratio per usage: square thumb in lists, 16/9 banner in detail.
type Variant = "thumb" | "hero";

// Visual representation of the entry image. Renders heroImage when present,
// otherwise a typed placeholder on a soft surface.
export function EntryThumb({
  entry,
  contextType,
  variant,
}: {
  entry: Entry;
  contextType: EntryType;
  variant: Variant;
}) {
  // Single-type entries -- the icon always reflects entry.type. contextType
  // is kept on the API for parity with previous multi-type entries.
  void contextType;
  const Icon = placeholderIconByType[entry.type];
  const iconSize = variant === "thumb" ? 22 : 36;

  const wrapperClass =
    variant === "thumb"
      ? "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-24 sm:w-24"
      : "relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]";

  if (entry.heroImage) {
    return (
      <div className={wrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */}
        <img
          src={entry.heroImage}
          alt={entry.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${wrapperClass} flex items-center justify-center text-[var(--color-text-tertiary)]`}
      aria-hidden
    >
      <Icon size={iconSize} />
    </div>
  );
}
