import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/site.config";
import { LegalLayout } from "@/components/legal/LegalLayout";

// Phase 2 wireframe: hardcoded text mirroring the anfilov.cz canonical
// version, adapted for Krhanický Proud (community portal). The legal
// reference frame is the same -- směrnice (EU) 2016/2102 + zákon č.
// 99/2019 Sb. -- but the controller line and contact details flip to
// the portal's editorial team via siteConfig.legalEntity.

export const metadata: Metadata = {
  title: `Prohlášení o přístupnosti | ${siteConfig.brand.name}`,
  description: `Prohlášení o přístupnosti webu ${siteConfig.brand.domain} dle směrnice (EU) 2016/2102 a zákona č. 99/2019 Sb.`,
};

export default async function PristupnostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalLayout title="Prohlášení o přístupnosti">
      <p>
        Provozovatel portálu{" "}
        <strong>{siteConfig.legalEntity.name}</strong> se zavazuje ke
        zpřístupnění svých webových stránek v souladu se směrnicí
        Evropského parlamentu a Rady (EU) 2016/2102 a zákonem č. 99/2019 Sb.,
        o přístupnosti internetových stránek a mobilních aplikací.
      </p>
      <p>
        Toto prohlášení o přístupnosti se vztahuje na webové stránky{" "}
        <a
          href={`https://${siteConfig.brand.domain}`}
          target="_blank"
          rel="noopener"
        >
          {siteConfig.brand.domain}
        </a>
        .
      </p>

      <h2>Stav souladu</h2>
      <p>
        Tyto webové stránky jsou v souladu s normou{" "}
        <strong>EN 301 549 V3.2.1</strong> a standardem{" "}
        <strong>WCAG 2.1 na úrovni AA</strong> s výjimkami uvedenými níže.
      </p>

      <h2>Nepřístupný obsah</h2>
      <p>Níže uvedený obsah nemusí být plně přístupný:</p>
      <ul>
        <li>
          Některé fotografie z akcí v obci nemusí mít detailní popis ve formě
          alternativního textu.
        </li>
        <li>
          Vložené dokumenty třetích stran (PDF úřední desky, naskenované
          vyhlášky) nemusí být plně strojově čitelné.
        </li>
        <li>
          Vložená videa třetích stran (například YouTube) mohou postrádat
          titulky nebo přepis.
        </li>
        <li>
          Některé interaktivní animace nemusí být plně optimalizovány pro
          uživatele s preferencí omezeného pohybu, ačkoliv web respektuje
          systémové nastavení <code>prefers-reduced-motion</code>.
        </li>
      </ul>

      <h2>Alternativy</h2>
      <p>
        Pokud potřebujete obsah v jiném formátu nebo narazíte na bariéru
        v přístupnosti, kontaktujte nás a obsah vám rádi poskytneme jiným
        způsobem (e-mailem, telefonicky, osobně).
      </p>

      <h2>Vypracování prohlášení</h2>
      <p>
        Toto prohlášení bylo vypracováno dne [DOPLNIT datum při launchi]
        metodou vlastního posouzení provedeného provozovatelem stránek.
      </p>

      <h2>Zpětná vazba a kontaktní údaje</h2>
      <p>
        Vaše náměty, postřehy a informace o problémech při zobrazování těchto
        stránek nebo dotazy k obsahu můžete zaslat na:
      </p>
      <ul>
        <li>
          E-mail:{" "}
          <a href={`mailto:${siteConfig.legalEntity.email}`}>
            {siteConfig.legalEntity.email}
          </a>
        </li>
        <li>
          Provozovatel: {siteConfig.legalEntity.name},{" "}
          {siteConfig.legalEntity.addressLine1},{" "}
          {siteConfig.legalEntity.addressLine2}
        </li>
      </ul>

      <h2>Postupy pro prosazování práva</h2>
      <p>
        V případě neuspokojivé odpovědi na oznámení nebo žádost zaslanou
        v souladu se směrnicí (EU) 2016/2102 můžete kontaktovat:
      </p>
      <p>
        Ministerstvo vnitra ČR
        <br />
        odbor eGovernmentu
        <br />
        náměstí Hrdinů 1634/3
        <br />
        140 21 Praha 4
        <br />
        E-mail:{" "}
        <a href="mailto:pristupnost@mvcr.cz">pristupnost@mvcr.cz</a>
      </p>
    </LegalLayout>
  );
}
