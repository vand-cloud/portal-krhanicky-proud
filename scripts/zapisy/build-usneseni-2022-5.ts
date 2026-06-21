/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "5", rok: "2022",
    isoDate: "2022-10-19", dateLabel: "19. 10. 2022", fullDateDot: "19.10.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-5.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení Jaroslav Mixa a Jana Laboutková.",
          "ověřovatele zápisu ve složení Tomáš Kratochvíl a Martin Jiřička.",
          "program zasedání zastupitelstva obce.",
          "zvolení jednoho místostarosty.",
          "v souladu s § 84 odst. 2 písm. k) zákona o obcích, že pro výkon funkce starosty obce bude uvolněný člen zastupitelstva obce.",
          "volbu starosty a místostarosty veřejným hlasováním.",
          "do funkce starosty obce Mgr. Aleše Papouška.",
          "do funkce místostarosty obce Jaroslava Mixu.",
          "zřízení finančního výboru a kontrolního výboru. Každý výbor bude pětičlenný.",
          "do funkce předsedy finančního výboru Bc. Petra Duba.",
          "do funkce předsedy kontrolního výboru Ing. Martina Jiřičku.",
          "za člena finančního výboru Janu Laboutkovou.",
          "za člena finančního výboru Ing. Alenu Kratochvílovou.",
          "za člena finančního výboru Ing. Bohuslava Kadeřábka.",
          "za člena finančního výboru Danu Kohoutovou.",
          "za člena kontrolního výboru Ing. Aleše Kozla.",
          "za člena kontrolního výboru Ing. Markétu Fischerovou.",
          "za člena kontrolního výboru Ing. Radka Ščotku.",
          "za člena kontrolního výboru Mgr. Lucii Maršíkovou.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
