/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "5",
    rok: "2024",
    isoDate: "2024-10-24",
    dateLabel: "24. 10. 2024",
    fullDateDot: "24.10.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-5.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení: Šárka Dušová, Lucie Maršíková.",
          "program zasedání zastupitelstva obce.",
          "rozpočtové opatření obce Krhanice č. 10/2024.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IZ-12-6003886 na pozemcích parc. č. 1942/9 a 1956/33 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 8 390,- Kč na umístění zařízení distribuční soustavy – kabelové vedení + pojistková skříň.",
          "uzavření Smlouvy o zřízení věcného břemene – služebnosti č. IV-12-6016747/VB/001 „Krhanice – kNN – p.č. 102/48“ na pozemku parc.č. 102/38 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 2 000,- Kč na umístění zařízení distribuční soustavy – kabelové vedení.",
          "pronájem části pozemku parc. č. 224/4 k.ú. Krhanice o výměře 12 m² k umístění a provozování samoobslužné schránky určené pro vyzvednutí/vrácení/odeslání zásilek za cenu 1 000 Kč/1 měsíc na dobu neurčitou firmě Alza.cz a.s., IČO: 27082440, se sídlem: Jankovcova 1522/53, 170 00 Praha 7 – Holešovice.",
          "uzavření Smlouvy o nájmu prostor pro umístění a provozování AlzaBoxu, tj. samoobslužné schránky určené mj. pro vyzvednutí/vrácení/odeslání zásilek na pozemku parc. č. 224/4 k.ú. Krhanice s firmou Alza.cz a.s., IČO: 27082440, se sídlem: Jankovcova 1522/53, 170 00 Praha 7 – Holešovice.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2024 ze dne 21.10.2024.",
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2024 ze dne 22.10.2024.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce zajištěním prodeje automobilu Volkswagen Multivan s registrační značkou 8A5 7153 obálkovou metodou s minimální požadovanou cenou 100 000,- Kč.",
          "starostu obce zajištěním prodeje automobilu Volkswagen Transporter s registrační značkou 2SB 9433 obálkovou metodou s minimální požadovanou cenou 1 000,- Kč.",
          "starostu obce zajištěním prodeje dopravního automobilu Avia A30 K s registrační značkou BNA 0541 obálkovou metodou s minimální požadovanou cenou 1,- Kč.",
          "starostu obce uzavřením Smlouvy o nájmu prostor pro umístění a provozování AlzaBoxu, tj. samoobslužné schránky určené mj. pro vyzvednutí/vrácení/odeslání zásilek na pozemku parc. č. 224/4 k.ú. Krhanice s firmou Alza.cz a.s., IČO: 27082440, se sídlem: Jankovcova 1522/53, 170 00 Praha 7 – Holešovice.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
