/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "4",
    rok: "2021",
    isoDate: "2021-09-13",
    dateLabel: "13. 9. 2021",
    fullDateDot: "13.9.2021",
    pdfPath: "scripts/zapisy-pdf/usneseni-2021-4.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Petr Dub.",
          "ověřovatele zápisu ve složení Martin Jiřička, Edita Jarošová.",
          "a bere na vědomí Protokol o kontrole výkonu samostatné působnosti svěřené orgánům obce Krhanice (Ministerstvo vnitra – kontrolní orgán).",
          "poskytnutí finančního příspěvku ve výši 10.000,- Kč pro Aktivní Krhanice, IČ 09017429, Krhanice 35, 257 42 Krhanice na akci „Zažít Krhanice jinak“. Se spolkem bude uzavřena veřejnoprávní smlouva.",
          "navýšení provozního příspěvku Mateřské škole Krhanice o 30.000,- Kč na nákup notebooku s operačním systémem Windows 10 Pro a Office 2019.",
          "poskytnutí návratné finanční výpomoci ve výši 595.979,- Kč Základní škole Krhanice, okres Benešov pro projekt „Nákup tabulí s interaktivním systémem do kmenových učeben“ v rámci dotace z Programu rozvoje venkova s termínem vrácení do 31.8.2022. Se Základní školou Krhanice, okres Benešov bude uzavřena smlouva o návratné finanční výpomoci.",
          "navýšení provozního příspěvku Základní škole Krhanice, okres Benešov o částku 32.000,- Kč na nákup sekačky a křovinořezu.",
          "rozpočtové opatření č. 5/2021",
          "pronajmout část pozemku parc. č. 132/1, 1988 a 128/10 k.ú. Krhanice o výměře 165 m2 k dočasnému zřízení zahrádky a umístění movitých věcí za cenu 5 Kč/m2/rok od 1.11.2021 na dobu 4 let D.K., Krhanice.",
          "pronajmout část pozemku parc. č. 132/1, 1988 a 128/10 k.ú. Krhanice o výměře 209 m2 k dočasnému zřízení zahrádky a umístění movitých věcí za cenu 5 Kč/m2/rok od 1.11.2021 na dobu 4 let M.P., Krhanice.",
          "uzavření Smlouvy o zřízení věcného břemene – služebnosti č. IP-12-6014232/1, Krhanice-kNN-p.č. 509/11 na pozemcích parc. č. 132/10 a 132/11 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 6.000,- Kč.",
          "pronájem části pozemku st. p. 675 k.ú. Krhanice o výměře 18 m2 k umístění plechové garáže k podnikání za cenu 20 Kč/m2/rok od 14.9.2021 na dobu 10 let J.M., Krhanice. Záměr byl schválen ZO č. 1/2021 dne 17.3.2021, nyní dochází k úpravě celkové výměry z 17,5 m2 na 18 m2.",
          "uzavření Smlouvy č. 1190901143 o poskytnutí podpory ze Státního fondu životního prostředí České republiky na projekt „Nové stromy na Sokolce v Krhanicích“ a souhlasí s přijetím podpory a s podmínkami této smlouvy na uvedený projekt.",
          "bere na vědomí návrh projektu budoucího zajištění společného provozu vodohospodářské infrastruktury v regionech Benešovska a Vlašimska a okresech Praha-západ a Praha-východ za účasti zastoupení skupiny SUEZ Groupe v České republice a schvaluje uzavření předloženého návrhu memoranda o vzájemné spolupráci jako podkladu pro zahájení realizace projektu.",
          "Plán inventur na rok 2021 včetně přílohy č. 1 – Seznamu inventurních soupisů na rok 2021.",
          "Komisi pro sestavení rozpočtu pro rok 2022 ve složení: Mgr. Aleš Papoušek, Jana Laboutková, Ing. Bohuslav Kadeřábek, Ing. Alena Kratochvílová, Ing. Jana Cachová.",
          "navýšení ceny oběda pro cizí strávníky na částku 78,- Kč od 1.10.2021.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu uzavřením a podpisem Smlouvy č. 1190901143 o poskytnutí podpory ze Státního fondu životního prostředí České republiky na projekt „Nové stromy na Sokolce v Krhanicích“.",
          "starostu obce Mgr. Aleše Papouška k podpisu předloženého návrhu memoranda o vzájemné spolupráci a k provedení všech dalších právních jednání v rámci plnění práv a povinností vyplývajících z memoranda o vzájemné spolupráci.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: ["Zprávu kontrolního výboru ze dne 30.8.2021."],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
