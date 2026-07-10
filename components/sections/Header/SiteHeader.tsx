"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
/* eslint-disable-next-line @next/next/no-img-element -- inline <img> for SVG
   logo so the file is not bundled by next/image. SVG is tiny (<5kb) and
   styling stays simpler at this scale. */

export type NavItem = {
  label: string;
  href: string;
  // Optional submenu. When present, the desktop nav renders a dropdown
  // panel revealed on hover/focus-within of the parent <li>; the parent
  // link itself stays clickable (clicking "Proud" navigates to /proud,
  // hovering reveals "Náš program"). Mobile renders children inline as
  // an indented list below the parent.
  children?: { label: string; href: string }[];
};

// SiteHeader renders ONLY the sticky brand + nav row. The optional banner
// above (campaign / alert) is now its own `TopBar` component composed in
// the layout, keeping concerns separate.
export function SiteHeader({
  brandName,
  brandHref,
  navItems,
}: {
  brandName: string;
  brandHref: string;
  navItems: NavItem[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-elev)]/85 backdrop-blur"
    >
        <div className="mx-auto flex h-[6rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href={brandHref}
            aria-label={brandName}
            className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG, not bundling via next/image. */}
            <img
              src="/brand/logo-left.svg"
              alt={brandName}
              className="h-[60px] w-auto"
            />
          </a>

          <nav aria-label="Hlavní navigace" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const hasChildren =
                  item.children && item.children.length > 0;
                if (!hasChildren) {
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-[20px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li
                    key={item.href}
                    className="group/menu relative"
                  >
                    <a
                      href={item.href}
                      aria-haspopup="true"
                      className="flex items-center gap-1 rounded-md px-3 py-2 text-[20px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        aria-hidden
                        className="opacity-70 transition-transform group-hover/menu:rotate-180 group-focus-within/menu:rotate-180"
                      />
                    </a>
                    {/* Dropdown panel. Hidden by default, revealed when
                        the parent <li> is hovered or contains keyboard
                        focus (so Tab through the parent link opens it
                        for screen-reader users).

                        Hover-bridge: the visible 4px gap between trigger
                        and panel is rendered as `pt-1` on this absolute
                        wrapper (NOT `mt-1`). That keeps the gap part of
                        the wrapper's bounding box, which is a descendant
                        of the `<li>` group -- so cursor moving from the
                        trigger to the panel stays "inside" the group and
                        the dropdown survives the trip. With `mt-1` the
                        gap was outside both elements and hover broke
                        between them (same bug as flynex MegaMenu). */}
                    <div
                      role="menu"
                      className="invisible absolute left-0 top-full z-40 pt-1 opacity-0 transition-opacity duration-150 group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100"
                    >
                      <div className="min-w-[14rem] rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-1 shadow-lg">
                        {item.children?.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block rounded px-3 py-2 text-[20px] font-medium text-[var(--color-text-secondary)] outline-none transition-colors hover:bg-[var(--color-bg-elev)] hover:text-[var(--color-text)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:text-[var(--color-text)]"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>

        {mobileOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Mobilní navigace"
            className="border-t border-[var(--color-border)] md:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-base font-medium text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </a>
                  {item.children && item.children.length > 0 ? (
                    <ul className="border-t border-[var(--color-border)] pb-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 pl-4 text-[20px] font-medium text-[var(--color-text-secondary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
    </header>
  );
}
