import type { Entry, EntryType } from "@/content/entries";
import { getCategoryLabel, typeLabels } from "@/content/entries";
import { Badge } from "@/components/ui/Badge";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
});
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

// All-day entries store pure date strings ("2026-01-17"). Parsing those with
// `new Date` puts them at UTC midnight, which renders as 01:00 / 02:00 in
// cs-CZ. Detect the "T" separator before deciding the formatter.
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

export function EntryCard({
  entry,
  contextType,
  compact = false,
}: {
  entry: Entry;
  // Kept on the API for back-compat with old multi-type entries; in the new
  // single-type model the card labels itself with entry.type unconditionally.
  contextType?: EntryType;
  compact?: boolean;
}) {
  void contextType;
  const range = formatRange(entry.startedAt, entry.endedAt);
  const displayType = entry.type;

  return (
    <article
      className={[
        "group relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]",
        "transition-colors hover:border-[var(--color-text-tertiary)]",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-[var(--color-text-tertiary)]">
          <span className="font-semibold text-[var(--color-text)]">
            {typeLabels[displayType]}
          </span>
          <span className="before:mr-2 before:content-['·']">
            {getCategoryLabel(entry.type, entry.category)}
          </span>
        </div>
        {entry.trustLevel === "scraped" ? (
          <Badge tone="neutral">Z agregátoru</Badge>
        ) : entry.trustLevel === "user_submitted" ? (
          <Badge tone="neutral">Tip občana</Badge>
        ) : null}
      </div>

      <h3
        className={[
          "mt-2 font-semibold leading-tight tracking-tight text-[var(--color-text-accent)]",
          compact ? "text-base" : "text-lg",
        ].join(" ")}
      >
        <a
          href={entry.href}
          className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          {entry.title}
        </a>
      </h3>

      {!compact && entry.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
          {entry.description}
        </p>
      ) : null}

      {range || entry.organizer ? (
        <dl className="mt-3 space-y-1 text-xs text-[var(--color-text-secondary)]">
          {range ? (
            <div className="flex gap-2">
              <dt className="font-medium text-[var(--color-text)]">Termín</dt>
              <dd>{range}</dd>
            </div>
          ) : null}
          {entry.organizer ? (
            <div className="flex gap-2">
              <dt className="font-medium text-[var(--color-text)]">Pořadatel</dt>
              <dd>{entry.organizer}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </article>
  );
}
