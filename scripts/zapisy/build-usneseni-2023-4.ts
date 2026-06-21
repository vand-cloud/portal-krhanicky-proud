/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "4",
    rok: "2023",
    isoDate: "2023-10-19",
    dateLabel: "19. 10. 2023",
    fullDateDot: "19.10.2023",
    pdfPath: "scripts/zapisy-pdf/usneseni-2023-4.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení: Martin Jiřička, Lucie Maršíková.",
          "program zasedání zastupitelstva obce.",
          "rozpočtové opatření č. 9/2023.",
          "prodej části pozemku díl „a“ z parc.č. 59/1 k.ú. Krhanice o výměře 17 m² za cenu 750,- Kč/1 m² J.H., Krhanice. Geometrický plán na oddělení části pozemku a vklad na katastr nemovitostí bude hradit kupující.",
          "Plán inventur 2023.",
          "složení Komise pro sestavení rozpočtu pro rok 2024: Aleš Papoušek, Jana Laboutková, Petr Dub, Alena Kratochvílová, Markéta Vaňková a Jana Cachová.",
          "vypsání výběrového řízení na dodavatele stavby pro projekt „Krhanice – rekonstrukce veřejného osvětlení“.",
          "oslovení 3 firem pro výzvu k podání nabídky pro projekt „Krhanice-rekonstrukce veřejného osvětlení“:\n- DĚDIC-Elektromontáže s.r.o., IČO: 02623650, Ostrava, Moravská Ostrava a Přívoz, Cihelní 1191/95\n- Yunex, s.r.o., IČO: 09962638, Praha 11, Chodov, V parku 2308/8\n- ELTODO OSVĚTLENÍ, s.r.o., IČO: 25751018, Praha 4, Lhotka, Novodvorská 1010/14",
          "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772 při zajištění poradenství při realizaci výběrového řízení pro projekt „Krhanice – rekonstrukce veřejného osvětlení“.",
          "navýšení ceny vodného na 62,72 Kč bez DPH od 1.1.2024.",
          "podání žádosti o dotaci pro projekt „Tělocvična obce Krhanice“ na výstavbu tělocvičny u Národní sportovní agentury – Regionální sportovní infrastruktura 2023 - investice nad 10 mil. Kč – výzva 12/2023.",
          "použití finančních prostředků z rozpočtu obce pro dofinancování podílu nejméně 30 % celkových způsobilých výdajů projektu „Tělocvična obce Krhanice“.",
          "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772 při zajištění poradenství pro podání dotace pro projekt „Tělocvična obce Krhanice“.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu kontrolního výboru ze dne 24.8.2023.",
          "rozpočtové opatření č. 8/2023.",
          "Rozpočtové opatření č. 2/2023 Posázavský vodovod – dobrovolný svazek obcí.",
          "Zápis z dílčího přezkoumání hospodaření obce Krhanice ze dne 19.9.2023.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce realizací výběrového řízení na dodavatele stavby pro projekt „Krhanice – rekonstrukce veřejného osvětlení“.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice neschvaluje",
        items: [
          "záměr pronajmout část pozemku o výměře 17 m² z parc.č. 59/1 k.ú. Krhanice za cenu 10,- Kč/1 m²/rok na dobu 1 roku J.H., Krhanice.",
          "odložit hlasování o všech bodech týkajících se rekonstrukce veřejného osvětlení (body č. 8, 9 a 10 a pověření bod č.1)",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
