import { ChevronRight } from "lucide-react";
import type { Entry, EntryType } from "@/content/entries";
import { getCategoryLabel, typeLabels } from "@/content/entries";
import { categoryFilterHref, pruvodceHref } from "./util";
import { EntryThumb } from "./EntryThumb";
import { SOCIAL_ITEMS, formatWebUrl, isSameUrl } from "./SocialIcons";

const formatDateTime = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
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

function formatEventLine(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt);
  const end = endedAt ? new Date(endedAt) : null;
  const startTimed = hasTimePart(startedAt);
  const sameDay =
    end !== null &&
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (end && !sameDay) {
    return `${formatDate.format(start)} – ${formatDate.format(end)}`;
  }
  return startTimed ? formatDateTime.format(start) : formatDate.format(start);
}

// Card-with-overlay pattern: the title <a> has an absolute pseudo-element
// covering the whole card, so the entire row is clickable. Category chips
// and any directly actionable links (phone, email, web, social) are
// positioned `relative z-10` above the overlay so they remain independently
// clickable. Plain meta text (Pořadatel, Adresa) stays under the overlay
// so clicking that area still routes to the detail page.
export function EntryListItem({
  entry,
  contextType,
  hovered = false,
  onHover,
  featuredBadge = false,
}: {
  entry: Entry;
  contextType: EntryType;
  // Bidirectional hover sync with the map. Parent controls `hovered`;
  // pointer enter/leave fires onHover so the matching pin can highlight.
  hovered?: boolean;
  onHover?: (entry: Entry | null) => void;
  // Curator's pick marker. When true, a solid-accent "Doporučujeme" pill
  // leads the chip row. Only the "Vše" landing passes this (and only for
  // entries the operator actually flagged), so the badge stays a scarce,
  // meaningful signal rather than decoration on every row.
  featuredBadge?: boolean;
}) {
  // Single-type entries: contextType is informational only (it picks which
  // section the row sits in on the "Vše" landing). Display always reflects
  // the entry's actual type.
  const displayType = entry.type;
  // Suppress unused-var warning for back-compat prop (still threaded through
  // by ScopeSectionView for parity with old API).
  void contextType;

  const primaryLine =
    displayType === "akce" && entry.startedAt
      ? formatEventLine(entry.startedAt, entry.endedAt)
      : entry.address ?? null;

  return (
    <article
      data-entry-id={entry.id}
      onMouseEnter={() => onHover?.(entry)}
      onMouseLeave={() => onHover?.(null)}
      className={[
        "group relative flex items-start gap-3 px-3 py-4 transition-colors sm:gap-4",
        "hover:bg-[var(--color-bg-elev)] focus-within:bg-[var(--color-bg-elev)]",
        hovered ? "bg-[var(--color-bg-elev)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <EntryThumb entry={entry} contextType={contextType} variant="thumb" />
      <div className="min-w-0 flex-1">
        {/* Root type chip + category chips, all the same visual weight so
            the row reads as one taxonomy line. Root just happens to be first. */}
        <div className="relative z-10 flex flex-wrap items-center gap-1.5">
          {featuredBadge ? (
            // Same outline-chip shape as the type/category tags: white
            // fill, but the border + label in the success (green) semantic
            // so the curator's pick reads as a quiet positive marker.
            <span className="rounded-full border border-[var(--color-success)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-success)]">
              Doporučujeme
            </span>
          ) : null}
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

        {/* Visual hierarchy: title dominates, primary line (date/distance)
            reads as a subtitle, then a single type-specific meta row. The
            description was removed -- it lives only in the detail page. */}
        <h3 className="mt-2 text-base font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-lg group-hover:underline group-hover:underline-offset-4 group-focus-within:underline group-focus-within:underline-offset-4">
          <a
            href={entry.href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            {entry.title}
          </a>
        </h3>

        {primaryLine ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
            {primaryLine}
          </p>
        ) : null}

        <BottomMetaRow entry={entry} displayType={displayType} />
      </div>
      <ChevronRight
        size={18}
        aria-hidden
        className="mt-2 shrink-0 text-[var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-text)]"
      />
    </article>
  );
}

// Type-specific meta row under the address/date subtitle.
// - event   -> "Pořadatel: …"
// - place   -> nothing (the subtitle already carries the address)
// - service -> quick-action contact row (Tel · E-mail · Web · Sítě)
function BottomMetaRow({
  entry,
  displayType,
}: {
  entry: Entry;
  displayType: EntryType;
}) {
  if (displayType === "akce") {
    if (!entry.organizer && !entry.sourceUrl) return null;
    return (
      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-tertiary)]">
        {entry.organizer ? <span>Pořadatel: {entry.organizer}</span> : null}
        <SourceLink entry={entry} />
      </p>
    );
  }

  // mista: address is already shown in the subtitle; only add a source link.
  if (displayType === "mista") {
    if (!entry.sourceUrl) return null;
    return (
      <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">
        <SourceLink entry={entry} />
      </p>
    );
  }

  // gastro / obchody / sluzby / spolky: rapid-contact strip. Each contact
  // (tel:, mailto:, external link, social glyphs). They sit on z-10 so they
  // win over the title overlay; the surrounding tertiary-color separators
  // and dots do not, so clicking the gaps still falls through to the detail.
  return <ServiceContactRow entry={entry} />;
}

// Provenance link shown in list items across every type. Same quiet
// tertiary-text style as the other meta links (Web:, Tel:) so it reads as
// metadata, not a call to action. Renders nothing when the entry carries
// no verified source.
const META_LINK_CLASS =
  "relative z-10 inline-flex items-center outline-none transition-colors hover:text-[var(--color-text)] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2";

function SourceLink({ entry }: { entry: Entry }) {
  if (!entry.sourceUrl) return null;
  const label = entry.sourceLabel || formatWebUrl(entry.sourceUrl);
  return (
    <a
      href={entry.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={META_LINK_CLASS}
    >
      Zdroj: {label}
    </a>
  );
}

function ServiceContactRow({ entry }: { entry: Entry }) {
  const phoneHref = entry.contactPhone
    ? `tel:${entry.contactPhone.replace(/\s/g, "")}`
    : null;
  const emailHref = entry.contactEmail ? `mailto:${entry.contactEmail}` : null;
  const social = entry.social;
  const socialItems = social
    ? SOCIAL_ITEMS.filter((item) => social[item.key])
    : [];
  // Hide the Web link when it is the same URL as the source link below.
  const showWeb = Boolean(
    entry.website && !isSameUrl(entry.website, entry.sourceUrl),
  );

  // If nothing to show, render nothing -- avoid a stray empty row.
  if (
    !phoneHref &&
    !emailHref &&
    !showWeb &&
    !entry.sourceUrl &&
    socialItems.length === 0
  ) {
    return null;
  }

  const linkClass = META_LINK_CLASS;

  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-tertiary)]">
      {phoneHref ? (
        <a href={phoneHref} className={linkClass}>
          Tel: {entry.contactPhone}
        </a>
      ) : null}
      {emailHref ? (
        <a href={emailHref} className={linkClass}>
          E-mail: {entry.contactEmail}
        </a>
      ) : null}
      {showWeb && entry.website ? (
        <a
          href={entry.website}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Web: {formatWebUrl(entry.website)}
        </a>
      ) : null}
      <SourceLink entry={entry} />
      {socialItems.length > 0 && social ? (
        <span className="inline-flex items-center gap-2">
          {socialItems.map(({ key, Icon, label }) => (
            <a
              key={key}
              href={social[key]!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={`${linkClass} hover:no-underline`}
            >
              <Icon size={14} />
            </a>
          ))}
        </span>
      ) : null}
    </p>
  );
}
