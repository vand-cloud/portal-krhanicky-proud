import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

type LegalLink = { label: string; href: string };

export function SiteFooter({
  brandName,
  disclosure,
  legalLinks = [],
  copyright,
  cookieSettingsLabel = "Nastavení cookies",
}: {
  brandName: string;
  disclosure?: string;
  legalLinks?: LegalLink[];
  copyright: string;
  cookieSettingsLabel?: string;
}) {
  // Shared style: legal links and the cookie settings re-open trigger
  // need identical typography so the action sits inline with the links
  // and reads as part of the same row.
  const legalItemClass =
    "cursor-pointer bg-transparent p-0 text-xs text-[var(--color-text-tertiary)] outline-none hover:text-[var(--color-text)] focus-visible:underline";

  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-elev)] py-10 text-sm text-[var(--color-text-secondary)]"
    >
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-base font-semibold text-[var(--color-text)]">
              {brandName}
            </p>
            {disclosure ? (
              <p className="mt-2 text-sm leading-relaxed">{disclosure}</p>
            ) : null}
          </div>
          <nav aria-label="Právní odkazy" className="shrink-0">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={legalItemClass}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <CookieSettingsButton
                  className={legalItemClass}
                  label={cookieSettingsLabel}
                />
              </li>
            </ul>
          </nav>
        </div>
        <p className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-tertiary)]">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
