/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "6",
    rok: "2025",
    isoDate: "2025-12-12",
    dateLabel: "12. 12. 2025",
    fullDateDot: "12.12.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-6.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
          "ověřovatele zápisu ve složení Tomáš Kratochvíl, Aleš Kozel.",
          "program zasedání zastupitelstva obce.",
          "poskytnutí investičního příspěvku příspěvkové organizaci Základní škola Krhanice – středisko Školní jídelna na nákup 2 ks indukčních sporáků ve výši 296.000,- Kč.",
          "rozpočtové opatření č. 7/2025.",
          "Střednědobý výhled rozpočtu obce Krhanice na období 2025 – 2028.",
          "pro rok 2026 použití Fondu investic příspěvkové organizace Základní škola Krhanice – středisko Školní jídelna na financování oprav a údržby a nákup vybavení do školní kuchyně.",
          "Rozpočet Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice pro rok 2026 jako vyrovnaný.",
          "změny v Rozpočtu obce Krhanice na rok 2026 a v Příloze Rozpočtu obce Krhanice na rok 2026 v důsledku navýšení příspěvku pro základní školu o 180 000,- Kč a v návaznosti na toto navýšení změny v rozpočtu obce v části běžných výdajů a financování obce.",
          "Přílohu Rozpočtu obce Krhanice na rok 2026.",
          "Rozpočet obce Krhanice na rok 2026 jako schodkový. Schodek bude hrazen finančními prostředky z minulých let.",
          "Obecně závaznou vyhlášku obce Krhanice o regulaci zacházení s pyrotechnickými výrobky s platností od 2.1.2026.",
          "pronájem části pozemku parc. č. 59/1 k.ú. Krhanice o výměře 915 m² ke zřízení zahrádky za cenu 15,- Kč/1 m²/rok od 1.1.2026 do 31.12.2026 J.K., Praha.",
          "prodej části pozemku parc.č. 1984 k.ú. Krhanice o výměře 132 m² – díl a+c a části pozemku parc.č. 1984 k.ú. Krhanice o výměře 22 m² – díl b dle geometrického plánu č. 1233-124/2025 za cenu 28 126 Kč J.H., Krhanice.",
          "koupi pozemků parc.č. 148/12, 247, 264, 265, 239 a 403/3 vše k.ú. Krhanice za cenu 397 360 Kč od M.N., Zašová.",
          "Dodatek č. 16 k Příloze č. 1 Knihovního řádu Obecní knihovny Krhanice Výpůjční řád.",
          "spolupráci s Posázavím o.p.s. při realizaci výběrového řízení na projekt Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích.",
          "cenu stravného pro cizí strávníky Školní jídelny Krhanice od 1.1.2026 ve výši 91,- Kč.",
          "Plán financování obnovy vodovodu Obce Krhanice pro období 2026-2035.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zápis z dílčího přezkoumání hospodaření územního celku obce Krhanice z 26.11.2025.",
          "že od 1.1.2026 bude novou knihovnicí Obecní knihovny Krhanice Dana Kohoutová.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce vypsáním výběrového řízení na projekt Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
