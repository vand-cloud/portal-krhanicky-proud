/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2026",
    isoDate: "2026-07-22",
    dateLabel: "22. 7. 2026",
    fullDateDot: "22.7.2026",
    pdfPath: "scripts/zapisy-pdf/usneseni-2026-3.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
          "ověřovatele zápisu ve složení Aleš Kozel, Tomáš Kratochvíl.",
          "program zasedání zastupitelstva obce.",
          "přijetí dotace pro projekt „Přístavba Mateřské školy Krhanice“ ve výši 1 135 000,00 Kč z Programu 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel z rozpočtu Středočeského kraje ze Středočeského Fondu obnovy venkova v rámci tematického zadání Veřejná infrastruktura, oblast podpory: Občanské vybavení.",
          "uzavření veřejnoprávní smlouvy o poskytnutí dotace pro projekt „Přístavba Mateřské školy Krhanice“ podle Programu 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel z rozpočtu Středočeského kraje ze Středočeského Fondu obnovy venkova v rámci tematického zadání Veřejná infrastruktura, oblast podpory: Občanské vybavení.",
          "uzavření Dodatku č. 1 pro smlouvu o dílo č. SoD/02/2026 „Přístavba Mateřské školy Krhanice“ s firmou PRO-REKO, s.r.o., IČO: 21058780, Stříbrná Lhota 698, 252 10 Mníšek pod Brdy na částku 136 476,93 Kč včetně DPH.",
          "uzavření Smlouvy o dílo č. SoD/04/2026 „Dešťová kanalizace na pozemku parc.č. 102/3 k.ú. Krhanice“ s firmou LAROS s.r.o., IČO: 49826514, Jana Nohy 1285, 256 01 Benešov na částku 1 933 403,61 Kč včetně DPH.",
          "uzavření Dodatku č. 1 pro smlouvu o dílo č. SoD/02/2025 „Stavební úpravy a přístavba objektu č.p. 69, Krhanice“ s firmou BFJ stav, s.r.o., Krhanice 255, 257 42 Krhanice, IČO: 86934431 v částce 586 294 Kč vč. DPH.",
          "rozpočtové opatření č. 3/2026.",
          "pronájem části pozemku parc. č. 110/1 k.ú. Krhanice o výměře 150 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.8.2026 do 31.7.2030 J. B., Krhanice.",
          "pronajmout část pozemku parc. č. 229/1 k.ú. Krhanice o výměře 36 m² pro užívání související se stáním pro automobily za cenu 15,- Kč/1 m²/rok od 1.11.2026 do 31.10.2030 J. H., Krhanice.",
          "zřízení věcného břemeno kabelového vedení NN a uzavření Smlouvy o smlouvě budoucí o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6035954/VB01 na pozemcích parc. č. 1435/20 a 1435/49 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 88 880 Kč.",
          "zřízení věcného břemene kabelového vedení NN a uzavření Smlouvy o smlouvě budoucí o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6039776 na pozemku parc. č. 1978/13 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 16 400 Kč.",
          "přičlenění pozemků parc.č. 336/15, 282/1, 1541/1, 631/2, 630, 514, 1450/1, 132/5, 499/4, 1905/17, 132/1, 1905/2, 499/2, 1901, 1950/2, 128/9, 1955/1, 1592/3, 1904/1, 1884/2, 1950/1, 1902, 1884/4, 132/2, 1905/1, 515/1, 324/1, 1420/2, 376, 1420/8, 2081, 1593, 407, 380/2, 632/3, 288/1, 336/2, 337/1, 436, 337/2, 336/1, 336/13, 632/1, 1892, 509/1, 632/2, 409/1, 1965/2, 1433/1, 1441/15, 1957/5 a 406/2 k.ú. Krhanice k honitbě a uzavření Dohody o náhradě za přičlenění honebních pozemků k honitbě s Lesy České republiky, s.p., IČO 42196451, se sídlem, Přemyslova 1106, 501 68 Hradec Králové za cenu 1.680,- Kč/1 rok (50,- Kč bez DPH za 1 ha/rok).",
          "koupit pozemek oddělenou část pozemku parc.č. 162/2 k.ú. Krhanice, a to díl „a“ o výměře 23 m² a oddělenou část pozemku parc.č. 162/5 díl „b“ o výměře 25 m², které budou sloučeny do pozemku parc.č. 1978/13 k.ú. Krhanice na základě geometrického plánu č. 1321/59/2025 za cenu 1 000,- Kč/1 m² od T. Č. a D. Č, Vlašim. Náklady spojené s odkoupením bude hradit obec (geometrický plán, vklad na katastr, ...)",
          "koupit pozemky parc. č. 2070/7 k. ú. Krhanice o výměře 736 m² a parc. č. 2070/8 k.ú. Krhanice o výměře 174 m² za navrhovanou kupní cenu 568 700 Kč (470 000 Kč plus DPH ve výši 98 700 Kč) od Českých drah, a.s. IČO: 70994226, nábřeží Ludvíka Svobody 1222/12, 110 15 Praha 1.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "rozpočtové opatření č. 3/2026 Společná voda d.s.o.",
          "že zůstává v platnosti cena vodného od 1.1.2026 v částce 84,07 Kč vč. DPH.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice ruší",
        items: [
          "bod č. 31 usnesení č. 2/2026 ze dne 8.6.2026: „ZO schvaluje zřízení věcného břemene kabelového vedení NN a uzavření Smlouvy o smlouvě budoucí o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6035954/VB01 na pozemcích parc. č. 1435/20 a 1435/49 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 100 500 Kč na umístění zařízení distribuční soustavy – kabelové vedení.“",
          "bod č. 32 usnesení č. 2/2026 ze dne 8.6.2026: „ZO schvaluje koupit pozemek oddělenou část pozemku parc.č. 1978/13 k.ú. Krhanice, a to díl „a“ o výměře 23 m² a díl „b“ o výměře 25 m², které budou sloučeny do pozemku parc.č. 1978/13 k.ú. Krhanice na základě geometrického plánu č. 1321/59/2025 za cenu 1 000,- Kč/1 m² od T. Č. a D. Č., Vlašim. Náklady spojené s odkoupením bude hradit obec (geometrický plán, vklad na katastr, ...).“",
          "bod č. 37 usnesení č. 2/2026 ze dne 8.6.2026: „ZO schvaluje cenu vodného od 1.7.2026 v částce 84,45 Kč vč. DPH.“",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením veřejnoprávní smlouvy o poskytnutí dotace pro projekt „Přístavba Mateřské školy Krhanice“ podle Programu 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel z rozpočtu Středočeského kraje ze Středočeského Fondu obnovy venkova v rámci tematického zadání Veřejná infrastruktura, oblast podpory: Občanské vybavení.",
          "starostu obce uzavřením Dodatku č. 1 pro smlouvu o dílo č. SoD/02/2026 „Přístavba Mateřské školy Krhanice“ s firmou PRO-REKO, s.r.o., IČO: 21058780, Stříbrná Lhota 698, 252 10 Mníšek pod Brdy.",
          "starostu obce uzavřením Smlouvy o dílo č. SoD/04/2026 „Dešťová kanalizace na pozemku parc.č. 102/3 k.ú. Krhanice“ s firmou LAROS s.r.o., IČO: 49826514, Jana Nohy 1285, 256 01 Benešov.",
          "starostu obce uzavřením Dodatku č. 1 pro smlouvu o dílo č. SoD/02/2025 „Stavební úpravy a přístavba objektu č.p. 69, Krhanice“ s firmou BFJ stav, s.r.o., Krhanice 255, 257 42 Krhanice, IČO: 86934431.",
          "starostu uzavřením smlouvy o koupi pozemků parc. č. 2070/7 k.ú. Krhanice o výměře 736 m² a parc. č. 2070/8 k.ú. Krhanice o výměře 174 m² za navrhovanou kupní cenu 568 700 Kč (470 000 Kč plus DPH ve výši 98 700 Kč) od Českých drah, a.s. IČO: 70994226, nábřeží Ludvíka Svobody 1222/12, 110 15 Praha 1.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
