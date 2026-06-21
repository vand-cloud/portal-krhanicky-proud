/* eslint-disable no-console */
// Faithful visual transcript of Usnesení č. 4/2025 (26.8.2025), transcribed
// page-by-page from the official PDF (1 page). Sections by action verb:
// "schvaluje" (15 items) + "pověřuje" (1 item). GDPR note present.
// Signatures / Vyvěšeno-Sejmuto omitted per contract.
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
  "ověřovatele zápisu ve složení Aleš Kozel, Petr Dub.",
  "program zasedání zastupitelstva obce.",
  "rozpočtové opatření č. 4/2025.",
  "pronájem části pozemků parc. č. 132/1, 1988 a 128/10 k.ú. Krhanice o celkové výměře 165 m² dle přílohy a uzavření smlouvy, a to od 1.11.2025 na dobu 4 let za cenu 15,- Kč/m² D.K., Krhanice.",
  "pronájem části pozemků parc. č. 132/1, 1988 a 128/10 k.ú. Krhanice o celkové výměře 209 m² dle přílohy a uzavření smlouvy, od 1.11.2025 na dobu 4 let za cenu 15,- Kč/m² M.P., Krhanice.",
  "odkoupení části pozemku st.p. 244/1 k.ú. Krhanice díl a o výměře 3 m² a část pozemku parc.č. 230/1 k.ú. Krhanice, díl b o výměře 9 m², a to dle geometrického plánu č. 1204-63/2025 za cenu 1 Kč/1 m² od Š.N. a J.M., Krhanice.",
  "záměr odprodat část obecního pozemku parc.č. 416/3 k.ú. Krhanice o výměře cca 77 m². Pro prodej této části pozemku bude vyhotoven geometrický plán a znalecký posudek.",
  "záměr odkoupení části pozemku parc.č. 148/32 k.ú. Krhanice o výměře cca 2000 m² a pozemku parc.č. 148/7 k.ú. Krhanice o výměře 162 m² za cenu 35 Kč/1 m². Náklady spojené s odkoupením bude hradit obec (geometrický plán, vklad na katastr, ...).",
  "přijetí dotace z rozpočtu Středočeského kraje z Fondu podpory dobrovolných hasičů a složek IZS a uzavření veřejnoprávní smlouvy o poskytnutí dotace se Středočeským krajem pro dotaci Vybavení jednotky SDH obce Krhanice věcnými prostředky pro zvýšení ochrany hasičů a zlepšení vybavenosti jednotky.",
  "podání žádosti o dotaci pro projekt „Přístavba Mateřské školy Krhanice“ z rozpočtu Středočeského kraje Program 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel ze Středočeského Fondu obnovy venkova a schvaluje finanční spoluúčast obce.",
  "vypsání výběrového řízení na dodavatele stavby pro projekt „Přístavba Mateřské školy Krhanice“ s oslovením nejméně 3 firem.",
  "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772 při zajištění poradenství při realizaci výběrového řízení pro projekt „Přístavba Mateřské školy Krhanice“.",
  "Plán inventur na rok 2025.",
  "složení Komise pro sestavení rozpočtu pro rok 2026: Aleš Papoušek, Jana Laboutková, Petr Dub, Alena Kratochvílová, Markéta Vaňková a Jana Cachová.",
];

const poveruje = [
  "starostu obce realizací vypsání výběrového řízení na dodavatele stavby, pro projekt „Přístavba Mateřské školy Krhanice“.",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "4",
    rok: "2025",
    isoDate: "2025-08-26",
    dateLabel: "26. 8. 2025",
    fullDateDot: "26.8.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-4.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice pověřuje", items: poveruje },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks, "| schvaluje", schvaluje.length, "poveruje", poveruje.length);
}
run().catch((e) => { console.error(e); process.exit(1); });
