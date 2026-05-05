import type { Entry, EntryType } from "@/content/entries";
import { sortByStart } from "@/content/entries";
import { EntryListItem } from "./EntryListItem";

type Group = {
  key: "ongoing" | "weekend" | "week" | "month" | "later" | "static";
  label: string;
  items: Entry[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Returns [start, end) of "this weekend":
// - Sat/Sun: today through Mon 00:00
// - Mon-Fri: upcoming Sat 00:00 through Mon 00:00
function thisWeekendRange(today: Date): [Date, Date] {
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat
  const start = new Date(today);
  if (dayOfWeek === 0) {
    // Sunday — weekend = today only (1 day)
    return [start, addDays(start, 1)];
  }
  if (dayOfWeek === 6) {
    // Saturday — weekend = today + tomorrow
    return [start, addDays(start, 2)];
  }
  // Mon-Fri — weekend = upcoming Sat + Sun
  start.setDate(today.getDate() + (6 - dayOfWeek));
  return [start, addDays(start, 2)];
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(d.getDate() + n);
  return x;
}

function groupEntries(list: Entry[], now: Date): Group[] {
  const today = startOfDay(now);
  const [weekendStart, weekendEnd] = thisWeekendRange(today);
  // End of this calendar month (first day of next month, 00:00).
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const buckets: Record<Group["key"], Entry[]> = {
    ongoing: [],
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

    // Past events: archive. End-of-day is the last visible moment, so an event
    // ending today still surfaces; ending yesterday (or earlier) doesn't.
    if (end < today) continue;

    // Multi-day event already running -- separate bucket so it doesn't
    // pollute "Tento týden" with a months-old start date.
    if (start < today) {
      buckets.ongoing.push(e);
      continue;
    }

    if (start >= weekendStart && start < weekendEnd) {
      buckets.weekend.push(e);
    } else if (start < weekendStart) {
      // Mon-Fri current week, today through Friday.
      buckets.week.push(e);
    } else if (start < monthEnd) {
      buckets.month.push(e);
    } else {
      buckets.later.push(e);
    }
  }

  const groups: Group[] = [
    { key: "ongoing", label: "Právě probíhá", items: sortByStart(buckets.ongoing) },
    { key: "weekend", label: "Tento víkend", items: sortByStart(buckets.weekend) },
    { key: "week", label: "Tento týden", items: sortByStart(buckets.week) },
    { key: "month", label: "Tento měsíc", items: sortByStart(buckets.month) },
    { key: "later", label: "Později", items: sortByStart(buckets.later) },
    { key: "static", label: "Místa a služby", items: buckets.static },
  ];

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
          <h2
            id={`group-${group.key}`}
            className="section-eyebrow mb-1 px-3"
          >
            {group.label}
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
