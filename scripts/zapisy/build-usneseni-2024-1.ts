/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2024",
    isoDate: "2024-03-07",
    dateLabel: "7. 3. 2024",
    fullDateDot: "7.3.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-1.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení: Tomáš Kratochvíl, Petr Dub.",
          "program zasedání zastupitelstva obce.",
          "rozpočtové opatření č. 1/2024.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "uzavření Smlouvy o výpůjčce části pozemku parc.č. 502 k.ú. Krhanice o výměře 138 m² za účelem výstavby a udržování 3 tůní bezúplatně od 8.3.2024 do 7.3.2028 se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IZ-12-6003886 na pozemcích parc. č. 1942/9 a 1956/33 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 8390 Kč na umístění zařízení kabelového vedení a pojistkové skříně.",
          "a souhlasí s účastí obce v rámci projektu Úřadu práce Příbram, pobočka Benešov v zaměstnávání osob se sníženou možností získání zaměstnání – 1 pracovní místo.",
          "uzavření smlouvy o dílo na akci „Krhanice - chodník podél silnice III/1066“ s Jaroslavem Žabou, Pecerady 69, 257 41 Týnec nad Sázavou, IČO: 86934431 ve výši 6 593 311,41 Kč.",
          "podání žádosti o dotaci na SFŽP v rámci výzvy RES+ č. 3/2024 – Komunální FVE na veřejných budovách pro malé obce pro projekt „Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích“.",
          "podání žádosti o dotaci pro projekt „Dopravní automobil pro JSDHO Krhanice“ na Středočeském kraji v rámci Programu 2024 pro poskytování dotací z rozpočtu Středočeského kraje ze Středočeského Fondu podpory dobrovolných hasičů a složek IZS.",
          "Pravidla pronájmu klubovny zázemí víceúčelového hřiště s účinností od 11.3.2024.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu kontrolního výboru ze dne 18.12.2023.",
          "Zprávu o výsledku přezkoumání hospodaření obce za rok 2023 ze dne 23.1.2024.",
          "Inventarizační zprávu obce Krhanice za rok 2023.",
          "neschválení žádosti o dotaci pro projekt „Krhanice – chodník podél silnice III/1066“ na Státním fondu dopravní infrastruktury.",
          "neschválení žádosti o dotaci pro projekt „Tělocvična obce Krhanice“ ze strany Národní sportovní agentury.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu svoláním schůzky s firmou Kámen Zbraslav, a.s. o vzájemném prodeji části pozemků.",
          "starostu podpisem smlouvy o dílo na akci „Krhanice - chodník podél silnice III/1066“ s s: Jaroslavem Žabou, Pecerady 69, 257 41 Týnec nad Sázavou, IČO: 86934431.",
          "starostu obce realizací výběrového řízení na projekt „Dopravní automobil pro JSDHO Krhanice“ ve spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
