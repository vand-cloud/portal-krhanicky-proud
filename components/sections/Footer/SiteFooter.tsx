import { Facebook, Instagram } from "lucide-react";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

type LegalLink = { label: string; href: string };
type Social = { facebook?: string; instagram?: string };

export function SiteFooter({
  brandName,
  disclosure,
  contact,
  legalLinks = [],
  copyright,
  cookieSettingsLabel = "Nastavení cookies",
  social,
}: {
  brandName: string;
  disclosure?: React.ReactNode;
  contact?: React.ReactNode;
  legalLinks?: LegalLink[];
  copyright: string;
  cookieSettingsLabel?: string;
  social?: Social;
}) {
  const legalItemClass =
    "cursor-pointer bg-transparent p-0 text-xs text-[var(--color-text-tertiary)] outline-none hover:text-[var(--color-text)] focus-visible:underline";

  const iconClass =
    "text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded";

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
            {contact ? (
              <p className="mt-2 text-sm leading-relaxed">{contact}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 sm:items-end">
            {social && (social.facebook || social.instagram) ? (
              <div className="flex gap-3">
                {social.facebook ? (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className={iconClass}
                  >
                    <Facebook size={20} aria-hidden />
                  </a>
                ) : null}
                {social.instagram ? (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className={iconClass}
                  >
                    <Instagram size={20} aria-hidden />
                  </a>
                ) : null}
              </div>
            ) : null}
            <nav aria-label="Právní odkazy">
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
        </div>
        <p className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-tertiary)]">
          {copyright}
        </p>
      </div>
    </footer>
  );
}