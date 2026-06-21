/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "2",
    rok: "2025",
    isoDate: "2025-04-16",
    dateLabel: "16. 4. 2025",
    fullDateDot: "16.4.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-2.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Lucie Maršíková, Tomáš Kratochvíl.",
          "program zasedání zastupitelstva obce.",
          "rozpočtové opatření č. 2/2025.",
          "prodej pozemku st. 474 k.ú. Krhanice o výměře 39 m², na kterém se nachází rekreační objekt č.ev. 34, na základě znaleckého posudku č. 4860 I 43 I 25 za cenu obvyklou ke dni 27.3.2025 ve výši 69 459,- Kč+ cena za vyhotovení znaleckého posudku ve výši 5.000,- Kč, tedy celkem za 74 459,- Kč Ing. M.C a Ing. B.C.",
          "pronajmout část pozemku parc. č.59/1 k.ú. Krhanice o výměře 264,8 m² na dobu 4 let, a to za účelem spolkové činnosti za cenu 1,- Kč/1 m²/rok Sboru dobrovolných hasičů Krhanice 69, 257 42 Krhanice, IČO 66134234 od 17.4.2025.",
          "uzavření Smlouvy o smlouvě budoucí o zřízení služebnosti inženýrské sítě č. IE-12-6011442NB SIS/02 na pozemku 317/1 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 2 000,- Kč na umístění inženýrské sítě kanalizační přípojky - uliční vpusť+ dešťová kanalizace.",
          "prodej automobilu Volkswagen Multivan s registrační značkou 8A5 7153 O.Š. za cenu 196 150,- Kč.",
          "prodej automobilu Volkswagen Transporter s registrační značkou 2SB 9433 SDH Dolany u Kladna za cenu 27 500,- Kč.",
          "prodej dopravního automobilu Avia A30 K s registrační značkou BNA 0541 J.K. za cenu 21 000,- Kč.",
          "uzavření smlouvy o dílo na akci „Stavební úpravy a přístavba objektu č. p. 69, Krhanice“ s firmou BFJ stav, s.r.o., IČO: 26686406, Krhanice 255, 257 42 Krhanice na celkovou částku 3 552 633,06 Kč s DPH.",
          "objednávku u firmy BES s.r.o., IČO: 43792553, Sukova 625, 256 17 Benešov na realizaci akce „Prosečnice MK na pozemku p.č. 1595675 - obnova povrchu na celkovou částku 1 393 683,59 Kč bez DPH.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Závěrečný účet Týnecko-svazek obcí za rok 2024 a Zprávu o výsledku přezkoumání hospodaření za rok 2024 Týnecko – svazek obcí.",
          "Závěrečný účet Posázavský vodovod – dobrovolný svazek obcí za rok 2024 a Zprávu o výsledku přezkoumání hospodaření za rok 2024 Posázavský vodovod – dobrovolný svazek obcí.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu uzavřením smlouvy na prodej automobilu Volkswagen Multivan s registrační značkou 8A5 7153 a zajištěním převodu automobilu na nového vlastníka.",
          "starostu uzavřením smlouvy na prodej automobilu Volkswagen Transporter s registrační značkou 2SB 9433 a zajištěním převodu automobilu na nového vlastníka.",
          "starostu uzavřením smlouvy na prodej dopravního automobilu Avia A30 K s registrační značkou BNA 0541 a zajištěním převodu automobilu na nového vlastníka.",
          "starostu obce uzavřením a podpisem smlouvy o dílo na akci „Stavební úpravy a přístavba objektu č. p. 69, Krhanice“ s firmou BFJ stav, s.r.o., IČO: 26686406, Krhanice 255, 257 42 Krhanice.",
        ],
      },
    ],
  });
  console.log(
    "OK",
    r.docId,
    "blocks",
    r.blocks,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
