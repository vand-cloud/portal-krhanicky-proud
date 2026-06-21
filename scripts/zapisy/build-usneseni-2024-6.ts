/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "6",
    rok: "2024",
    isoDate: "2024-12-13",
    dateLabel: "13. 12. 2024",
    fullDateDot: "13.12.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-6.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Tomáš Kratochvíl, Petr Dub.",
          "program zasedání zastupitelstva obce.",
          "rozpočtové opatření č. 11/2024.",
          "Střednědobý výhled rozpočtu obce Krhanice na období 2024 – 2027.",
          "Rozpočet Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice pro rok 2025 jako vyrovnaný.",
          "Přílohu Rozpočtu obce Krhanice na rok 2025.",
          "Rozpočet obce Krhanice na rok 2025 jako schodkový. Schodek bude hrazen finančními prostředky z minulých let.",
          "pronájem části pozemku parc. č. 59/1 k.ú. Krhanice o výměře 941,2 m² ke zřízení zahrádky za cenu 10,- Kč/1 m²/rok od 1.1.2025 do 31.12.2025 J. a J. K., Praha.",
          "pronájem pozemku parc. č. 423/5 k.ú. Krhanice o výměře 469 m² ke zřízení zahrádky za cenu 10,- Kč/1 m²/rok od 1.1.2025 na dobu 4 let Ing. M.C., Zdiby Brnky.",
          "záměr budoucího prodeje stavebního pozemku č. st. 474 k.ú. Krhanice a schvaluje zadání vyhotovení znaleckého posudku pro budoucí prodej stavebního pozemku č. st. 474 k.ú. Krhanice o výměře 39 m², na jehož pozemku se nachází rekreační objekt č.ev. 34.",
          "pronájem části pozemku parc. č. 1972/6 k.ú. Krhanice o výměře 4,6 m² pro stávající jímku odpadních vod včetně potrubí pro přítok odpadních vod do podzemní části pod tímto pozemkem o výměře 8,74 m³ a dále pro provoz této jímky odpadních vod za cenu 100 Kč/m³/rok od 1.4.2025 na dobu 4 let R.N., Krhanice.",
          "Dohodu vlastníků provozně souvisejících vodovodů s Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223, Masarykovo náměstí 194, 254 01 Jílové u Prahy, městysem Davle, IČO: 002 41 156, Na náměstí 63, 252 06 Davle, městem Jílové u Prahy, IČO: 002 41 326, Masarykovo náměstí 194, 254 01 Jílové u Prahy, obcí Kamenný Přívoz, IČO: 002 41 351, Kamenný Přívoz 285, Kamenný Přívoz 252 82, obcí Krhanice, IČO: 002 32 025, Krhanice 46, Krhanice 257 42, obcí Libeř, IČO: 002 41 415, Libeř 35, Libeř 25241 a obcí Petrov, IČO: 002 41 539, Hlavní 30, Petrov 252 81.",
          "Dohodu vlastníků provozně souvisejících vodovodů obce Krhanice, IČO: 002 32 025 s městem Týnec nad Sázavou, IČO: 002 32 904 a Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223.",
          "cenu vodného od 1.1.2025 ve výši 74,10 Kč bez DPH/1 m³.",
          "Dodatek č. 15 k Příloze č. 1 Knihovního řádu Obecní knihovny Krhanice Výpůjční řád.",
          "a souhlasí se vznikem pracovněprávních vztahů mezi obcí a členem zastupitelstva obce s platností od 1.1.2025 do 31.12.2025, a to oblast činnosti knihovnické: Bc. Petr Dub. Dohody budou uzavírány v průběhu roku 2025 dle konkrétních potřeb obce.",
          "Obecně závaznou vyhlášku obce Krhanice o stanovení obecního systému odpadového hospodářství.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "vratku 40 000,- Kč z provozního příspěvku pro rok 2024 Mateřské školy Krhanice z důvodu nevyčerpaných energií.",
          "vratku 500 000,- Kč z provozního příspěvku pro rok 2024 Základní školy Krhanice z důvodu nevyčerpaných energií.",
          "že Rozpočet Bene-Bus dobrovolný svazek obcí na rok 2025 je přebytkový a bere na vědomí Střednědobý výhled rozpočtu Bene-Bus dobrovolný svazek obcí na období 2026-2028 a bere na vědomí Rozpočtové opatření č. 1/2024.",
          "že Rozpočet 2025 Týnecko-svazek obcí je vyrovnaný a bere na vědomí Střednědobý výhled rozpočtu na období 2025-2027.",
          "že Rozpočet 2025 Posázavský vodovod – dobrovolný svazek obcí je schodkový a bude kryt finančními prostředky z minulých let.",
          "Zápis z dílčího přezkoumání hospodaření územního celku obce Krhanice z 6.12.2024.",
          "Zprávu Krhanice – kanalizace a čistírna odpadních vod vypracovanou firmou PROJEKTY VODAM s.r.o., Galašova 158, 753 01 Hranice.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce podpisem Dohody vlastníků provozně souvisejících vodovodů s Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223, Masarykovo náměstí 194, 254 01 Jílové u Prahy, městysem Davle, IČO: 002 41 156, Na náměstí 63, 252 06 Davle, městem Jílové u Prahy, IČO: 002 41 326, Masarykovo náměstí 194, 254 01 Jílové u Prahy, obcí Kamenný Přívoz, IČO: 002 41 351, Kamenný Přívoz 285, Kamenný Přívoz 252 82, obcí Krhanice, IČO: 002 32 025, Krhanice 46, Krhanice 257 42, obcí Libeř, IČO: 002 41 415, Libeř 35, Libeř 25241 a obcí Petrov, IČO: 002 41 539, Hlavní 30, Petrov 252 81.",
          "starostu obce podpisem Dohody vlastníků provozně souvisejících vodovodů obce Krhanice, IČO: 002 32 025 s městem Týnec nad Sázavou, IČO: 002 32 904 a Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice ruší",
        items: [
          "Pravidla pronájmu místností Základní školy Krhanice schválené Zastupitelstvem obce Krhanice dne 18.9.2017.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
