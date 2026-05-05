"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

/**
 * Cookie consent banner — vanilla-cookieconsent v3 (orestbida).
 *
 * Splňuje GDPR + § 89 zák. 127/2005 Sb. (ÚOOÚ):
 *  - Aktivní souhlas (žádné pre-checked boxy)
 *  - Equal prominence: Přijmout vše / Odmítnout vše / Nastavení (rovnocenná)
 *  - 4 kategorie: necessary / preferences / analytics / marketing
 *  - Cookie blocking přes <script type="text/plain" data-category="...">
 *  - Možnost změny kdykoliv (footer link → CookieConsent.showPreferences())
 *  - Záznam souhlasu v localStorage (cc_cookie) — verzováno přes revision
 *
 * Při změně textů nebo kategorií zvyš `revision` — tím se všem uživatelům
 * vyžádá nový souhlas. Aktuálně je revision odvozená přímo zde; při Sanity
 * migraci se přesune do siteSettings singletonu.
 *
 * Vzhled banneru je tokenizovaný přes globals.css (mapping na --cc-*
 * proměnné z naší semantic palety). V designed phase se barvy v
 * --color-* automaticky propíší i sem -- není třeba upravovat banner.
 */
const CONSENT_REVISION = 1;

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      revision: CONSENT_REVISION,
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        preferences: {},
        analytics: {},
        marketing: {},
      },
      language: {
        default: "cs",
        translations: {
          cs: {
            consentModal: {
              title: "Cookies pro lepší zážitek",
              description:
                'Tyto stránky používají cookies pro nezbytný provoz a pro analytiku a personalizaci (s vaším souhlasem). Souhlas můžete kdykoliv odvolat v patičce webu nebo v <a href="/cookies">Zásadách cookies</a>.',
              acceptAllBtn: "Přijmout vše",
              acceptNecessaryBtn: "Odmítnout vše",
              showPreferencesBtn: "Nastavení",
              footer:
                '<a href="/gdpr">Ochrana osobních údajů</a> <a href="/cookies">Zásady cookies</a>',
            },
            preferencesModal: {
              title: "Nastavení cookies",
              acceptAllBtn: "Přijmout vše",
              acceptNecessaryBtn: "Odmítnout vše",
              savePreferencesBtn: "Uložit nastavení",
              closeIconLabel: "Zavřít",
              serviceCounterLabel: "Služby",
              sections: [
                {
                  title: "Co jsou cookies",
                  description:
                    "Cookies jsou malé textové soubory ukládané ve vašem prohlížeči. Některé jsou nezbytné pro funkčnost webu, jiné slouží k analytice a personalizaci. Níže si můžete zvolit, které kategorie povolíte.",
                },
                {
                  title: "Nezbytné cookies",
                  description:
                    "Nutné pro základní fungování webu (uložení vašeho preferovaného režimu, CSRF ochrana formulářů a podobně). Bez nich by web nefungoval správně. Nelze odmítnout.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Preference",
                  description:
                    "Pamatují si vaše volby (jazyk, region, preferovaný formát zobrazení). Bez nich web funguje, jen vám některé volby nezůstanou zachovány mezi návštěvami.",
                  linkedCategory: "preferences",
                },
                {
                  title: "Analytika",
                  description:
                    "Pomáhají nám pochopit, jak web používáte, abychom ho mohli zlepšovat. Sbírají anonymizovaná data o návštěvnosti a chování. Aktuálně web žádné analytické cookies nenastavuje, kategorie je zde pro případ jejich budoucího nasazení.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Marketing",
                  description:
                    "Slouží k cílení reklamy a měření kampaní. Aktuálně tento web žádné marketingové cookies nenastavuje. Kategorie je zde pro případ budoucích integrací (sociální sítě, externí měření).",
                  linkedCategory: "marketing",
                },
                {
                  title: "Více informací",
                  description:
                    'Detaily naleznete v <a href="/cookies">Zásadách cookies</a> a <a href="/gdpr">Ochraně osobních údajů</a>. V případě dotazů nás kontaktujte na <a href="/zapojte-se">kontaktní stránce</a>.',
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}

/** Otevře dialog s nastavením cookies — pro footer link nebo tlačítko. */
export function openCookieSettings() {
  CookieConsent.showPreferences();
}
