"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/ui/Container";

export type MegaMenuLink = {
  href: string;
  label: string;
};

export type MegaMenuDivision = {
  href: string;
  label: string;
  description?: string;
  items: MegaMenuLink[];
};

export type MegaMenuCategoryGroup = {
  label: string;
  items: MegaMenuLink[];
};

export type MegaMenuData = {
  triggerLabel: string;
  divisions: MegaMenuDivision[];
  categoriesHeading: string;
  categoryGroups: MegaMenuCategoryGroup[];
};

type Props = {
  data: MegaMenuData;
};

/**
 * Full-bleed dropdown anchored to the viewport (not the trigger button).
 * Width follows the page Container so the panel aligns with the rest of
 * the layout. The panel uses position: fixed below a sticky header that
 * is 4rem (h-16) tall — adjust top-16 if header height changes.
 */
export function MegaMenu({ data }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = containerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const columnsForCategoryGroups = [0, 1] as const;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((s) => !s)}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="text-sm font-medium text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)] inline-flex items-center gap-1"
      >
        {data.triggerLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed inset-x-0 top-16 z-50"
        >
          <Container>
            <div className="bg-[var(--color-bg)] border border-t-0 border-[var(--color-border)] rounded-b-[var(--radius-lg)] shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {data.divisions.map((div) => (
                  <div key={div.label}>
                    <Link
                      href={div.href}
                      className="text-base font-semibold font-[family-name:var(--font-heading)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-sm)]"
                    >
                      {div.label}
                    </Link>
                    {div.description && (
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {div.description}
                      </p>
                    )}
                    <ul className="mt-4 space-y-2">
                      {div.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-sm text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-sm)]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {columnsForCategoryGroups.map((columnIndex) => {
                  const groups = data.categoryGroups.slice(
                    columnIndex * 2,
                    columnIndex * 2 + 2,
                  );
                  return (
                    <div key={columnIndex}>
                      {columnIndex === 0 && (
                        <p className="text-base font-semibold font-[family-name:var(--font-heading)] mb-4">
                          {data.categoriesHeading}
                        </p>
                      )}
                      {columnIndex === 1 && (
                        <p
                          aria-hidden="true"
                          className="text-base font-semibold font-[family-name:var(--font-heading)] mb-4 invisible"
                        >
                          {data.categoriesHeading}
                        </p>
                      )}
                      <div className="space-y-5">
                        {groups.map((group) => (
                          <div key={group.label}>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                              {group.label}
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="text-sm text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-sm)]"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
