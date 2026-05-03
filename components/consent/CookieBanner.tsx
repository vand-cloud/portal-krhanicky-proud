"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

export function CookieBanner() {
  const t = useTranslations("consent");
  const locale = useLocale();

  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        preferences: {},
        analytics: {},
        marketing: {},
      },
      language: {
        default: locale,
        translations: {
          [locale]: {
            consentModal: {
              title: t("title"),
              description: t("description"),
              acceptAllBtn: t("acceptAll"),
              acceptNecessaryBtn: t("rejectAll"),
              showPreferencesBtn: t("preferences"),
            },
            preferencesModal: {
              title: t("preferences"),
              acceptAllBtn: t("acceptAll"),
              acceptNecessaryBtn: t("rejectAll"),
              savePreferencesBtn: t("preferences"),
              closeIconLabel: t("preferences"),
              sections: [
                {
                  title: t("categories.necessary"),
                  linkedCategory: "necessary",
                },
                {
                  title: t("categories.preferences"),
                  linkedCategory: "preferences",
                },
                {
                  title: t("categories.analytics"),
                  linkedCategory: "analytics",
                },
                {
                  title: t("categories.marketing"),
                  linkedCategory: "marketing",
                },
              ],
            },
          },
        },
      },
    });
  }, [locale, t]);

  return null;
}
