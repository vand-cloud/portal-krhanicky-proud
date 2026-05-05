"use client";

import { useState } from "react";
import type { NewsItem } from "@/content/entries";
import { Megaphone, ChevronDown } from "lucide-react";

const formatDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
});

export function NewsBanner({
  news,
  summary,
}: {
  news: NewsItem[];
  summary: string;
}) {
  const [open, setOpen] = useState(false);
  if (news.length === 0) return null;

  return (
    <section
      aria-label="Aktuality obce"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="news-banner-list"
          className="flex w-full items-center justify-between gap-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          <span className="inline-flex items-center gap-2 font-medium text-[var(--color-text)]">
            <Megaphone size={16} aria-hidden />
            {summary}
          </span>
          <ChevronDown
            size={16}
            aria-hidden
            className={[
              "shrink-0 text-[var(--color-text-secondary)] transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
        {open ? (
          <ul
            id="news-banner-list"
            className="border-t border-[var(--color-border)] py-2"
          >
            {news.map((item) => (
              <li
                key={item.id}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <a
                  href={item.href}
                  className="block py-3 outline-none hover:bg-[var(--color-bg)] focus-visible:bg-[var(--color-bg)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <time
                      dateTime={item.date}
                      className="shrink-0 text-xs uppercase tracking-wide text-[var(--color-text-tertiary)] sm:w-28"
                    >
                      {formatDate.format(new Date(item.date))}
                    </time>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium leading-snug text-[var(--color-text-accent)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
