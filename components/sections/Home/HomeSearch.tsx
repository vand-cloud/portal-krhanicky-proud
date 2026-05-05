"use client";

import { useMemo, useState } from "react";
import type { Entry, NewsItem } from "@/content/entries";
import { filterByText, typeLabels, unaccent } from "@/content/entries";
import { SearchBar } from "@/components/sections/Hybrid/SearchBar";
import { Megaphone } from "lucide-react";

export function HomeSearch({
  entries,
  news,
  placeholder,
}: {
  entries: Entry[];
  news: NewsItem[];
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  // Drop past events from the searchable corpus -- a result that links
  // to "Pálení čarodějnic" three days ago is just noise. Static entries
  // (places, services without startedAt) always pass through.
  const eligibleEntries = useMemo(() => {
    const now = new Date();
    return entries.filter((e) => {
      if (e.type !== "akce") return true;
      if (!e.startedAt) return true;
      const end = e.endedAt ? new Date(e.endedAt) : new Date(e.startedAt);
      return end >= now;
    });
  }, [entries]);

  const entryResults = useMemo(
    () => (trimmed ? filterByText(eligibleEntries, trimmed).slice(0, 6) : []),
    [eligibleEntries, trimmed],
  );

  const newsResults = useMemo(() => {
    if (!trimmed) return [];
    const q = unaccent(trimmed);
    return news
      .filter((n) => unaccent(`${n.title} ${n.description}`).includes(q))
      .slice(0, 3);
  }, [news, trimmed]);

  const showDropdown = trimmed.length > 0;
  const totalResults = entryResults.length + newsResults.length;

  return (
    <div className="relative">
      <SearchBar
        query={query}
        onChange={setQuery}
        placeholder={placeholder}
        size="large"
      />

      {showDropdown ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
          {totalResults === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
              Pro „{query}“ jsme nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {entryResults.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={entry.href}
                    className="block px-4 py-3 outline-none hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      {typeLabels[entry.type]}
                    </div>
                    <div className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
                      {entry.title}
                    </div>
                    {entry.description ? (
                      <div className="mt-0.5 line-clamp-1 text-xs text-[var(--color-text-secondary)]">
                        {entry.description}
                      </div>
                    ) : null}
                  </a>
                </li>
              ))}
              {newsResults.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="block px-4 py-3 outline-none hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      <Megaphone size={12} aria-hidden />
                      Aktualita
                    </div>
                    <div className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
                      {item.title}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
