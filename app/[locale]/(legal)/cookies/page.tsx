import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/site.config";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

// Phase 2 wireframe: hardcoded text mirroring the anfilov.cz canonical
// version. Cookie inventory below reflects the actual wireframe state
// (only the consent record cookie + an optional theme localStorage). When
// real analytics or marketing pixels get wired up, add rows to the table
// and bump CONSENT_REVISION in CookieConsent.tsx so users re-consent.

export const metadata: Metadata = {
  title: `Pravidla cookies | ${siteConfig.brand.name}`,
  description: `Informace o používání souborů cookies na ${siteConfig.brand.domain}.`,
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalLayout title="Pravidla cookies">
      <p>
        Tyto zásady popisují, jaké soubory cookies a podobné technologie
        používá web <strong>{siteConfig.brand.domain}</strong>, k jakým
        účelům, jak dlouho je uchováváme a jak nad nimi máte kontrolu.
        Zpracování probíhá v souladu s nařízením GDPR (2016/679) a § 89
        zákona č. 127/2005 Sb. o elektronických komunikacích.
      </p>

      <h2>Co jsou cookies</h2>
      <p>
        Cookies jsou malé textové soubory, které web ukládá ve vašem
        prohlížeči. Slouží zejména k zapamatování vašich preferencí,
        zajištění funkcí webu a (pokud k tomu udělíte souhlas) k analytice
        a personalizaci.
      </p>

      <h2>Vaše volba</h2>
      <p>
        Při první návštěvě se zobrazí lišta, kde můžete cookies{" "}
        <strong>přijmout</strong>, <strong>odmítnout</strong> nebo si zvolit
        jednotlivé kategorie. Souhlas můžete kdykoliv změnit:
      </p>
      <p>
        <CookieSettingsButton
          className="prose-link cursor-pointer bg-transparent p-0"
          label="Otevřít nastavení cookies"
        />
      </p>

      <h2>Kategorie cookies</h2>

      <h3>Nezbytné</h3>
      <p>
        Nutné pro základní fungování webu. Bez nich by web nefungoval
        správně. Tyto cookies nelze odmítnout.
      </p>

      <h3>Preference</h3>
      <p>
        Pamatují si vaše volby, například světlý nebo tmavý režim. Bez nich
        se některé volby nezachovají mezi návštěvami.
      </p>

      <h3>Analytika</h3>
      <p>
        Pomáhají nám měřit návštěvnost a chování uživatelů na webu. Data
        jsou anonymizovaná. Aktuálně web žádné analytické cookies
        nenastavuje, kategorie je zde pro případ jejich budoucího nasazení.
      </p>

      <h3>Marketing</h3>
      <p>
        Slouží k cílení reklamy a měření kampaní. Aktuálně tato kategorie
        zůstává <em>prázdná</em>.
      </p>

      <h2>Konkrétní cookies a technologie</h2>
      <p>Web používá následující úložiště v prohlížeči.</p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left">
              <th className="py-2 pr-4 font-semibold">Název</th>
              <th className="py-2 pr-4 font-semibold">Vlastník</th>
              <th className="py-2 pr-4 font-semibold">Účel</th>
              <th className="py-2 pr-4 font-semibold">Životnost</th>
              <th className="py-2 font-semibold">Kategorie</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border)]">
              <td className="py-2 pr-4 font-mono text-xs">cc_cookie</td>
              <td className="py-2 pr-4">{siteConfig.brand.domain}</td>
              <td className="py-2 pr-4">
                Záznam o tom, co jste v cookies liště odsouhlasili.
              </td>
              <td className="py-2 pr-4">6 měsíců</td>
              <td className="py-2">Nezbytné</td>
            </tr>
            <tr className="border-b border-[var(--color-border)]">
              <td className="py-2 pr-4 font-mono text-xs">
                krhanicky-proud-theme
              </td>
              <td className="py-2 pr-4">{siteConfig.brand.domain}</td>
              <td className="py-2 pr-4">
                Uložená volba světlého nebo tmavého režimu (localStorage).
              </td>
              <td className="py-2 pr-4">Trvalé (do ručního smazání)</td>
              <td className="py-2">Preference</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.875rem", color: "var(--color-text-tertiary)" }}>
        Naposledy aktualizováno: [DOPLNIT datum při launchi].
      </p>

      <h2>Správa cookies v prohlížeči</h2>
      <p>
        Cookies můžete kdykoliv smazat nebo zablokovat v nastavení svého
        prohlížeče. Návody pro nejpoužívanější prohlížeče: Chrome, Firefox,
        Safari, Edge.
      </p>

      <h2>Kontakt</h2>
      <p>
        V případě dotazů ohledně cookies nebo zpracování osobních údajů nás
        kontaktujte na adrese{" "}
        <a href={`mailto:${siteConfig.legalEntity.email}`}>
          {siteConfig.legalEntity.email}
        </a>{" "}
        nebo si přečtěte sekci <a href="/gdpr">Ochrana osobních údajů</a>.
      </p>
    </LegalLayout>
  );
}
