import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/site.config";
import { LegalLayout } from "@/components/legal/LegalLayout";

// Phase 2 wireframe: hardcoded text mirroring the anfilov.cz canonical
// version, adapted for the Krhanický Proud context (community portal).
// Phase 4 migration moves the body into Sanity (legalPage document).
//
// "Správce" details live in siteConfig.legalEntity (rendered by
// LegalLayout's left column). Wireframe ships with [DOPLNIT] markers
// so the launch step cannot ship leftover anfilov data unnoticed.

export const metadata: Metadata = {
  title: `Zásady ochrany osobních údajů | ${siteConfig.brand.name}`,
  description:
    "Informace o zpracování a ochraně osobních údajů v souladu s GDPR.",
};

export default async function GdprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalLayout title="Zásady ochrany osobních údajů">
      <h2>Správce osobních údajů</h2>
      <p>
        Správcem osobních údajů je <strong>{siteConfig.legalEntity.name}</strong>
        , se sídlem {siteConfig.legalEntity.addressLine1},{" "}
        {siteConfig.legalEntity.addressLine2}, e-mail:{" "}
        <a href={`mailto:${siteConfig.legalEntity.email}`}>
          {siteConfig.legalEntity.email}
        </a>{" "}
        (dále jen „Správce“).
      </p>
      <p>
        Správce osobních údajů tímto informuje subjekty údajů o způsobu
        a rozsahu zpracování osobních údajů v souladu s nařízením
        Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a se zákonem
        č. 110/2019 Sb., o zpracování osobních údajů.
      </p>
      <p>
        Osobní údaje jsou zpracovávány na základě plnění smlouvy,
        oprávněného zájmu Správce, plnění právních povinností
        a v některých případech na základě uděleného souhlasu.
      </p>

      <h2>Rozsah zpracovávaných osobních údajů</h2>
      <p>Správce zpracovává zejména tyto osobní údaje:</p>
      <ul>
        <li>jméno a příjmení,</li>
        <li>e-mailovou adresu,</li>
        <li>telefonní číslo (pokud jej dobrovolně uvedete),</li>
        <li>
          obsah zprávy odeslané přes formulář (tip na akci, námět na článek,
          zpětná vazba),
        </li>
        <li>
          případně další údaje, které subjekt údajů dobrovolně uvede v rámci
          kontaktu s redakcí.
        </li>
      </ul>

      <h2>Právní důvody a účely zpracování</h2>
      <p>Osobní údaje jsou zpracovávány na základě:</p>
      <ul>
        <li>
          plnění smlouvy nebo provedení opatření před uzavřením smlouvy na
          žádost subjektu údajů,
        </li>
        <li>oprávněného zájmu Správce,</li>
        <li>plnění právních povinností,</li>
        <li>souhlasu subjektu údajů, je-li vyžadován.</li>
      </ul>

      <p>Účelem zpracování je zejména:</p>
      <ul>
        <li>vyřízení podnětů, tipů a námětů odeslaných přes formuláře portálu,</li>
        <li>komunikace s pisateli článků, dobrovolníky a inzerenty,</li>
        <li>vedení interní evidence kontaktů a podnětů,</li>
        <li>zajištění provozu, bezpečnosti a zlepšování webových stránek,</li>
        <li>
          informování o dění v obci e-mailem, pouze pokud byl udělen souhlas
          k zasílání novinek.
        </li>
      </ul>

      <h2>Zapojení třetích stran</h2>
      <p>
        Osobní údaje mohou být zpracovávány prostřednictvím smluvních
        zpracovatelů, zejména poskytovatelů:
      </p>
      <ul>
        <li>technické a aplikační infrastruktury webových stránek,</li>
        <li>hostingových a serverových služeb,</li>
        <li>zabezpečení a provozu informačních systémů,</li>
        <li>
          transakčních e-mailů (potvrzení odeslaných formulářů a podobně).
        </li>
      </ul>
      <p>
        Tito zpracovatelé zpracovávají osobní údaje pouze v rozsahu nezbytném
        pro zajištění poskytovaných služeb a v souladu s platnými právními
        předpisy.
      </p>

      <h2>Doba uchování osobních údajů</h2>
      <p>Osobní údaje jsou uchovávány:</p>
      <ul>
        <li>po dobu nezbytnou k vyřízení podnětu a následné komunikace,</li>
        <li>po dobu nezbytnou k ochraně práv Správce,</li>
        <li>
          u osobních údajů zpracovávaných na základě souhlasu do jeho
          odvolání, nejdéle po dobu 3 let.
        </li>
      </ul>

      <h2>Práva subjektu údajů</h2>
      <p>Subjekt údajů má právo:</p>
      <ul>
        <li>na přístup k osobním údajům,</li>
        <li>na opravu nebo doplnění,</li>
        <li>na výmaz,</li>
        <li>na omezení zpracování,</li>
        <li>na přenositelnost údajů,</li>
        <li>
          podat stížnost u dozorového úřadu, kterým je Úřad pro ochranu
          osobních údajů (
          <a href="https://www.uoou.cz" target="_blank" rel="noopener">
            www.uoou.cz
          </a>
          ).
        </li>
      </ul>

      <p style={{ marginTop: "2.5rem", fontSize: "0.875rem", color: "var(--color-text-tertiary)" }}>
        Naposledy aktualizováno: [DOPLNIT datum při launchi].
      </p>
    </LegalLayout>
  );
}
