/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "2",
    rok: "2022",
    isoDate: "2022-03-11",
    dateLabel: "11. 3. 2022",
    fullDateDot: "11.3.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-2.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Petr Dub, Jana Laboutková.",
          "ověřovatele zápisu ve složení Bohuslav Kadeřábek, Martin Jiřička.",
          "pravidla pro poskytování humanitární pomoci na území obce Krhanice zahraničním uprchlíkům z Ukrajiny.",
          "uzavření Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000735 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a uzavření Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000745 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice.",
          "rozpočtové opatření č. 2/2022.",
          "ceny za pronájmy obecních pozemků a nebytových prostor pro občany jako nájemce pro smlouvy uzavírané od 1.4.2022.",
          "I. Rozhodlo o pořízení územní studie v ploše ZK10, kde je zástavba ve vydaném územním plánu Krhanice podmíněna zpracováním územní studie. Vyznačení plochy je vymezeno v příloze tohoto usnesení.\nII. Schválilo pořízení územní studie ve smyslu § 6 odst. 2 stavebního zákona fyzickou osobou oprávněnou pro výkon územně plánovací činnosti podle § 24 stavebního zákona.\nIII. Ukládá starostovi obce uzavřít smlouvu s fyzickou osobou oprávněnou k výkonu územně plánovací činnosti s Pavlou Bechyňovou, která tímto zajistí obecnímu úřadu splnění kvalifikačních požadavků pro výkon územně plánovací činnosti.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zápis z celoročního přezkoumání hospodaření obce za rok 2021 ze dne 23.2.2022.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce podpisem Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000735 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000745 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
