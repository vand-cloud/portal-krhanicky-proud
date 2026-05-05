"use client";

import { openCookieSettings } from "./CookieConsent";

interface Props {
  className?: string;
  label?: string;
}

/** Button that re-opens the cookie consent preferences modal. */
export function CookieSettingsButton({
  className,
  label = "Nastavení cookies",
}: Props) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  );
}
