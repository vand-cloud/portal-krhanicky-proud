"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { GoogleAnalytics } from "@next/third-parties/google";

export function ConsentGatedGA4({ gaId }: { gaId?: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!gaId) return;

    const check = () => setConsented(CookieConsent.acceptedCategory("analytics"));

    check();
    window.addEventListener("cc:onConsent", check);
    window.addEventListener("cc:onChange", check);

    return () => {
      window.removeEventListener("cc:onConsent", check);
      window.removeEventListener("cc:onChange", check);
    };
  }, [gaId]);

  if (!gaId || !consented) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
