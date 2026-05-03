"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MegaMenuData, MegaMenuLink } from "./MegaMenu";

type Props = {
  brand: string;
  primary: MegaMenuLink[];
  services?: MegaMenuData;
  ctaLabel?: string;
  ctaHref?: string;
  closeLabel?: string;
  openLabel?: string;
};

/**
 * Full-screen mobile drawer menu. Hamburger button is rendered inline
 * (md:hidden) and the drawer overlays the viewport when toggled. Body
 * scroll is locked while open. Escape and item selection close it.
 */
export function MobileMenu({
  brand,
  primary,
  services,
  ctaLabel,
  ctaHref,
  closeLabel = "Zavřít menu",
  openLabel = "Otevřít menu",
}: Props) {
  const [open, setOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR-safe portal mount marker — canonical pattern that lets the
    // portal render only after hydration. The set-state-in-effect rule
    // is intentionally bypassed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((s) => !s)}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 7h18M3 12h18M3 17h18"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {mounted && open && createPortal(
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-[var(--color-border)]">
            <Link
              href="/"
              onClick={close}
              className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight"
            >
              {brand}
            </Link>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={close}
              className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <ul className="space-y-1">
              {services && (
                <li>
                  <button
                    type="button"
                    aria-expanded={servicesExpanded}
                    aria-controls="mobile-services-panel"
                    onClick={() => setServicesExpanded((s) => !s)}
                    className="w-full flex items-center justify-between py-2 text-lg font-[family-name:var(--font-heading)] font-semibold text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
                  >
                    <span>{services.triggerLabel}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className={`transition-transform ${servicesExpanded ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M3 6l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {servicesExpanded && (
                    <div
                      id="mobile-services-panel"
                      className="mt-2 mb-4 pl-3 border-l border-[var(--color-border)] space-y-6 pb-2"
                    >
                      {services.divisions.map((div) => (
                        <div key={div.label}>
                          <Link
                            href={div.href}
                            onClick={close}
                            className="block text-base font-semibold font-[family-name:var(--font-heading)] hover:opacity-70"
                          >
                            {div.label}
                          </Link>
                          <ul className="mt-2 space-y-1.5">
                            {div.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={close}
                                  className="block text-sm text-[var(--color-text-secondary)] hover:opacity-70 py-0.5"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                          {services.categoriesHeading}
                        </p>
                        {services.categoryGroups.map((group) => (
                          <div key={group.label}>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                              {group.label}
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={close}
                                    className="block text-sm text-[var(--color-text-secondary)] hover:opacity-70 py-0.5"
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
                  )}
                </li>
              )}

              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-2 text-lg font-[family-name:var(--font-heading)] font-semibold text-[var(--color-text)] hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {ctaLabel && ctaHref && (
            <div className="border-t border-[var(--color-border)] px-4 sm:px-6 py-4">
              <Link
                href={ctaHref}
                onClick={close}
                className="inline-flex w-full items-center justify-center px-4 py-3 text-sm font-medium bg-[var(--color-accent)] text-[var(--color-bg)] rounded-[var(--radius-md)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
