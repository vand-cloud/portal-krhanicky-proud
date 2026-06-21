/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2023",
    isoDate: "2023-03-16",
    dateLabel: "16. 3. 2023",
    fullDateDot: "16.3.2023",
    pdfPath: "scripts/zapisy-pdf/usneseni-2023-1.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Petr Dub, Tomáš Kratochvíl.",
          "program zasedání zastupitelstva obce.",
          "uzavření Dodatku č.2 ke Smlouvě o dílo se společností Intermont, Opatrný. s.r.o.\npro stavební práce Krhanice – revitalizace a VZT budovy ZŠ. Cena díla se navyšuje\no 2 037 726,11 Kč včetně DPH.",
          "uzavření smlouvy o dílo na akci „Krhanice – rekonstrukce válečného hrobu obětí 2. světové války“ s: Zdeněk Makovíni, Krhanice 193, 257 42 Krhanice, IČO: 74225740 ve výši 386 620 Kč.",
          "poskytnutí finančního daru ve výši 3.000, - Kč a uzavření darovací smlouvy s Diakonie Broumov, sociální družstvo, Husova 319, Velká Ves, 550 01 Broumov, IČO: 49289977.",
          "v rámci Občanského návrhového projektového rozpočtu rozpuštění jeho finanční rezervy 100.000, - Kč alokované v rozpočtu obce pro rok 2023 na „sportovní zařízení ve vlastnictví obce“.",
          "snížení částky výdajů v rozpočtovém opatření č. 3/2023 na základní školu – poskytnutí finančního příspěvku na regionální učebnici 66 tisíc Kč.",
          "rozpočtové opatření č. 3/2023.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "Obecně závaznou vyhlášku obce Krhanice, kterou se stanoví část společného školského obvodu základní školy.",
          "za člena finančního výboru Soňu Valáškovou.",
          "prodej pozemku par. č. 1979/4 k.ú. Krhanice, o výměře 174 m²; pozemku par. č. 1981/3 k.ú. Krhanice, o výměře 138 m², který vznikne dle geometrického plánu č. 1038-5/2021 oddělením z pozemku parc. č. 1981/2; pozemek par. č. 2051/8 k.ú. Krhanice, o výměře 80 m², který vznikne dle geometrického plánu č. 1039-6/2021 oddělením z pozemku parc. č. 2051/5 a pozemek par. č. 2051/9 k.ú. Krhanice, o výměře 88 m², který vznikne dle geometrického plánu č. 1039-6/2021 oddělením z pozemku parc. č. 2051/5, které využívá Správa železnic, státní organizace, IČO 70994234, Dlážděná 1003/7, Praha 1 v rámci své činnosti při zajišťování provozování železniční dopravní cesty jako veřejné služby za cenu znaleckého posudku č. 5791 – 23/2022 ve výši 239.780,- Kč.",
          "uzavření Smlouvy o uzavření budoucí smlouvy o zřízení věcného břemene - služebnosti a smlouvu o právu provést stavbu č. I IP-12-6021683 „BN-Krhanice-kNN-č.parc. 208“ na pozemcích parc. č. 2070/5 k.ú. Krhanice a parc. č. 2070/2 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 3.025,- Kč na umístění zařízení distribuční soustavy – kabelu 28m + pilíř.",
          "uzavření Smlouvy o uzavření budoucí smlouvy o zřízení věcného břemene - služebnosti a smlouvu o právu provést stavbu na pozemku parc. č. 1956/9 k.ú. Krhanice s A.S., Třebotov na dobu neurčitou za cenu 3000,- Kč na umístění zařízení distribuční soustavy – kabelu 25 m.",
          "bezúplatné nabytí vodovodního řadu N1-1 na pozemku parc.č. 299/1 k.ú. Krhanice realizovaného Vodohospodářskou společností Benešov, s. r. o. a zkolaudovaného Městským úřadem Benešov do vlastnictví obce Krhanice v hodnotě 172.271,- Kč od: B.M., I.M., Jílové u Prahy a současně uzavřít smlouvu o zřízení věcného břemene na vodovodní řad N1-1 pro pozemek parc.č. 299/1 k.ú. Krhanice na dobu neurčitou za cenu 3.000,- Kč.",
          "uzavření Smlouvy o spolupráci při tvorbě, aktualizaci a správě Digitální technické mapy Středočeského kraje se Středočeským krajem, IČO: 70891095, Zborovská 11, 150 21 Praha 5.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu kontrolního výboru ze dne 29.12.2022.",
          "rozpočtové opatření č. 10/2022, č. 1/2023 a č. 2/2023.",
          "Zprávu o výsledku přezkoumání hospodaření obce ze dne 7.3.2023.",
          "Inventarizační zprávu obce Krhanice za rok 2022.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce podpisem Dodatku č.2 ke Smlouvě o dílo se společností Intermont, Opatrný. s.r.o. pro stavební práce Krhanice – revitalizace a VZT budovy ZŠ.",
          "starostu podpisem smlouvy o dílo na akci Krhanice – rekonstrukce válečného hrobu obětí 2. světové války s: Zdeněk Makovíni, Krhanice 193, 257 42 Krhanice, IČO: 74225740.",
          "starostu obce realizací výběrového řízení na projekt „Krhanice - chodník podél silnice III/1066“ ve spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice neschvaluje",
        items: [
          "snížení částky výdajů v rozpočtovém opatření č. 3/2023 na sportovní zařízení - zhotovení samostatného vjezdu do areálu TJ Sokol Krhanice v částce 165.000,- Kč.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
