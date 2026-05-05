"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/site.config";

// Section navigation between the three legal pages. The active item is
// matched against pathname (locale prefix is stripped by next-intl, so
// the path here is /gdpr, not /cs/gdpr). Order mirrors the anfilov.cz
// canonical sequence.
const navItems = [
  { href: "/gdpr", label: "Ochrana osobních údajů" },
  { href: "/cookies", label: "Pravidla cookies" },
  { href: "/pristupnost", label: "Prohlášení o přístupnosti" },
];

// Two-column legal page shell:
//   left  (lg 2/5): overline + H1 + section nav + správce webu
//   right (lg 3/5): article content with .legal-content typography
// Mobile collapses to a single column (overline + H1 + nav + správce
// stack first, content follows). Pattern mirrors anfilov.cz/gdpr 1:1.
export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeNav = navItems.find((item) => item.href === pathname);
  const breadcrumbLabel = activeNav?.label ?? "Právní informace";
  const entity = siteConfig.legalEntity;

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)]">
      <Container size="wide" className="relative py-12 sm:py-16">
        <Breadcrumbs
          items={[{ label: "Domů", href: "/" }, { label: breadcrumbLabel }]}
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)]">
              Právní informace
            </p>

            <h1 className="mb-10 text-3xl leading-[1.08] tracking-[-0.02em] text-[var(--color-text-accent)] sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>

            <nav aria-label="Právní stránky" className="mb-8">
              <ol className="space-y-2 text-[13px]">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`block py-1 leading-snug outline-none transition-colors focus-visible:underline ${
                          isActive
                            ? "font-semibold text-[var(--color-text)]"
                            : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <span className="mb-3 block text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              Správce webu
            </span>
            <div className="space-y-px text-sm leading-relaxed text-[var(--color-text-secondary)]">
              <p className="font-semibold text-[var(--color-text)]">
                {entity.name}
              </p>
              <p>{entity.addressLine1}</p>
              <p>{entity.addressLine2}</p>
              <p className="pt-1">
                <a href={`mailto:${entity.email}`} className="prose-link">
                  {entity.email}
                </a>
              </p>
              {entity.phone ? (
                <p>
                  <a
                    href={`tel:${entity.phone.replace(/\s/g, "")}`}
                    className="prose-link"
                  >
                    {entity.phone}
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          {/* ── Right column: content ──────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="legal-content">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
