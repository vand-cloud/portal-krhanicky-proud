import { useTranslations } from "next-intl";
import type { Entry, EntryType } from "@/content/entries";
import { sortByStart } from "@/content/entries";
import { EntryListItem } from "./EntryListItem";

type Group = {
  key: "today" | "weekend" | "week" | "month" | "later" | "static";
  label: string;
  items: Entry[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Returns [start, end) of "this weekend":
// - Sat:    today + Sunday (weekend covers today and tomorrow)
// - Sun:    today only (weekend ends after today)
// - Mon-Fri: upcoming Sat 00:00 through Mon 00:00
function thisWeekendRange(today: Date): [Date, Date] {
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
  const start = new Date(today);
  if (dayOfWeek === 0) {
    return [start, addDays(start, 1)];
  }
  if (dayOfWeek === 6) {
    return [start, addDays(start, 2)];
  }
  start.setDate(today.getDate() + (6 - dayOfWeek));
  return [start, addDays(start, 2)];
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(d.getDate() + n);
  return x;
}

// Calendar-based time bucketing (deliberately not rolling windows -- a
// villager thinks in "tento týden / tento měsíc", not "next 7 days").
// Cascading priority, first match wins:
//   1. Active today (start <= today <= end)         -> Dnes
//      Covers single-day events on today AND multi-day events currently
//      running. Multi-day exhibitions running for weeks land here, not
//      in their original start-week bucket.
//   2. Start day in upcoming weekend                -> Tento víkend
//   3. Start before next Monday (Mon-Fri this week) -> Tento týden
//   4. Start before 1st of next month               -> Tento měsíc
//   5. Otherwise                                    -> Později
// Past events (end < today) are filtered out entirely.
function groupEntries(list: Entry[], now: Date): Group[] {
  const today = startOfDay(now);
  const [weekendStart, weekendEnd] = thisWeekendRange(today);
  // End of this calendar month (first day of next month, 00:00).
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const buckets: Record<Group["key"], Entry[]> = {
    today: [],
    weekend: [],
    week: [],
    month: [],
    later: [],
    static: [],
  };

  for (const e of list) {
    if (!e.startedAt) {
      buckets.static.push(e);
      continue;
    }
    const start = startOfDay(new Date(e.startedAt));
    const end = e.endedAt ? startOfDay(new Date(e.endedAt)) : start;

    // Past events: archive. End-of-day is the last visible moment, so an
    // event ending today still surfaces; ending yesterday (or earlier)
    // doesn't.
    if (end < today) continue;

    // Top priority bucket: anything happening today (single-day-today
    // OR multi-day running). A months-long exhibition that started weeks
    // ago surfaces here, not in its start-week bucket.
    if (start <= today && end >= today) {
      buckets.today.push(e);
      continue;
    }

    // Future-only events from here on.
    if (start >= weekendStart && start < weekendEnd) {
      buckets.weekend.push(e);
    } else if (start < weekendStart) {
      // Tomorrow through Friday this week (Mon-Thu today).
      buckets.week.push(e);
    } else if (start < monthEnd) {
      buckets.month.push(e);
    } else {
      buckets.later.push(e);
    }
  }

  const groups: Group[] = [
    { key: "today", label: "Dnes", items: sortByStart(buckets.today) },
    { key: "weekend", label: "Tento víkend", items: sortByStart(buckets.weekend) },
    { key: "week", label: "Tento týden", items: sortByStart(buckets.week) },
    { key: "month", label: "Tento měsíc", items: sortByStart(buckets.month) },
    { key: "later", label: "Později", items: sortByStart(buckets.later) },
    { key: "static", label: "Místa a služby", items: buckets.static },
  ];

  // Hide empty buckets entirely. Keeps the cascade tight on quiet weeks
  // and matches Simon's "nerendrovat" preference.
  return groups.filter((g) => g.items.length > 0);
}

export function TimelineView({
  entries,
  now = new Date(),
  emptyLabel,
  contextType = "akce",
  hoveredId,
  onHover,
}: {
  entries: Entry[];
  now?: Date;
  emptyLabel: string;
  contextType?: EntryType;
  hoveredId?: string;
  onHover?: (entry: Entry | null) => void;
}) {
  void contextType;
  const tHome = useTranslations("homepage");
  const groups = groupEntries(entries, now);

  if (groups.length === 0) {
    return (
      <p className="px-2 py-12 text-center text-sm text-[var(--color-text-secondary)]">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`group-${group.key}`}>
          {/* Quiet eyebrow header with item count + inflected noun
              ("Dnes · 3 akce", "Tento víkend · 5 akcí"). The count
              carries enough at-a-glance info to drop the page-level
              "X výsledků" line entirely. The eventsCount ICU plural
              key handles Czech inflection (one/few/other branches). */}
          <h2
            id={`group-${group.key}`}
            className="section-eyebrow mb-1 px-3"
          >
            {group.label}
            <span className="ml-1.5 font-normal text-[var(--color-text-tertiary)]">
              · {tHome("eventsCount", { count: group.items.length })}
            </span>
          </h2>
          <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {group.items.map((entry) => (
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
        </section>
      ))}
    </div>
  );
}
