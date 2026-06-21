/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2024",
    isoDate: "2024-07-22",
    dateLabel: "22. 7. 2024",
    fullDateDot: "22.7.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-3.pdf",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení: Martin Jiřička, Petr Dub.",
          "program zasedání zastupitelstva obce.",
          "uzavření Dodatku č. 1 ke smlouvě o dílo č. SoD/02/2024 ze dne 2.4.2024 na akci „Krhanice – chodník podél silnice III/1066“ s firmou Jaroslav Žaba, IČO: 86934431, Pecerady 69, 257 41 Týnec nad Sázavou na celkovou částku 5 634 600,06 Kč s DPH.",
          "uzavření smlouvy o dílo na akci „Krhanice – chodník podél silnice III/1066 – 2.etapa“ s firmou Jaroslav Žaba, IČO 86934431, Pecerady 69, 257 41 Týnec nad Sázavou na celkovou částku 1 381 516,02 Kč s DPH.",
          "navýšení provozního příspěvku Mateřské školy Krhanice ve výši 100 000,- Kč na opravu vrat a branek u školky.",
          "rozpočtové opatření Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice č. 1/2024.",
          "rozpočtové opatření obce Krhanice č. 6/2024.",
          "odstranit v Článku 3 bod 4 v Obecně závazné vyhlášce obce Krhanice o nočním klidu.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "Obecně závaznou vyhlášku obce Krhanice o stanovení místního koeficientu pro obec.",
          "uzavření Dodatku č.3 ke Smlouvě o přenechání VO na území obce Krhanice do nájmu, o jeho provozování a správě s Osvětlení Týnec, k.s., IČO: 26140781, K Náklí 404, 257 41 Týnec nad Sázavou.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením a podpisem Dodatku č. 1 ke smlouvě o dílo č. SoD/02/2024 ze dne 2.4.2024 na akci „Krhanice – chodník podél silnice III/1066“ s firmou Jaroslav Žaba, IČO 86934431, Pecerady 69, 257 41 Týnec nad Sázavou.",
          "starostu obce uzavřením a podpisem smlouvy o dílo na akci „Krhanice – chodník podél silnice III/1066 – 2.etapa“ s firmou Jaroslav Žaba, IČO 86934431, Pecerady 69, 257 41 Týnec nad Sázavou.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
