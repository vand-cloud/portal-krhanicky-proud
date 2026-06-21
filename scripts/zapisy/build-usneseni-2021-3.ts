/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2021",
    isoDate: "2021-07-12",
    dateLabel: "12. 7. 2021",
    fullDateDot: "12.7.2021",
    pdfPath: "scripts/zapisy-pdf/usneseni-2021-3.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Petr Dub.",
          "ověřovatele zápisu ve složení Edita Jarošová, Tomáš Kratochvíl.",
          "uzavření smlouvy o dílo na akci „Krhanice – revitalizace a VZT budovy ZŠ“ s firmou Intermont, Opatrný, s.r.o., IČO: 49900854, se sídlem: Vrskmaň 74, 431 15 Vrskmaň ve výši 20.554.623, - Kč.",
          "finanční prostředky ve výši 6.900.000, - Kč jako spoluúčast obce Krhanice pro dotaci a na související investiční výdaje na akci „Krhanice – revitalizace a VZT budovy ZŠ“, které budou zapojeny do výdajů rozpočtu na rok 2021 rozpočtovým opatřením č. 4/2021. Finanční prostředky dle Smlouvy o dílo a související investiční výdaje na akci pro další období budou zapojeny v rozpočtu daného období.",
          "poskytnutí finančního příspěvku ve výši 60.000, - Kč pro TJ Sokol Krhanice, IČ 61664723, Krhanice 162, 257 42 Krhanice na akci „Oslavy 80 let založení fotbalu TJ Sokol Krhanice“. S organizací bude uzavřena veřejnoprávní smlouva.",
          "poskytnutí finančního příspěvku do veřejné sbírky na pomoc obci:\n- Hrušky na území Jihomoravského kraje zasažené živelní pohromou (tornádem) dne 24.6.2021, a to ve výši 10.000, - Kč na transparentní účet – číslo účtu: 123-4548350207/0100\n- Mikulčice na území Jihomoravského kraje zasažené živelní pohromou (tornádem) dne 24.6.2021, a to ve výši 10.000, - Kč na transparentní účet – číslo účtu: 299222440/0300.\n- Lužice na území Jihomoravského kraje zasažené živelní pohromou (tornádem) dne 24.6.2021, a to ve výši 10.000, - Kč na transparentní účet – číslo účtu: 123-3116370277/0100.\n- Moravská Nová Ves na území Jihomoravského kraje zasažené živelní pohromou (tornádem) dne 24.6.2021, a to ve výši 10.000, - Kč na transparentní účet – číslo účtu: 6013203349/0800.",
          "rozpočtové opatření č. 4/2021.",
          "uzavření Smlouvy o zřízení věcného břemene – služebnosti č. IV-12-6023937/1 na pozemku parc. č. 102/42 k.ú. Krhanice a parc. č. 102/51 k. ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 6.000, - Kč na umístění zařízení distribuční soustavy – nové kabelové vedení NN, spojka na kabelu, pojistkový pilíř včetně pojistkové skříně, zemnění.",
          "záměr koupit pozemek parc.č. 148/51 k.ú. Krhanice o výměře cca 1410 m², který vznikne na základě geometrického plánu č. 1049-5116/2021 za cenu 55 Kč/1 m² od Ing. B.K. a J.K., Krhanice.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu uzavřením a podpisem smlouvy o dílo na akci na akci „Krhanice – revitalizace a VZT budovy ZŠ“ s firmou Intermont, Opatrný, s.r.o., IČO: 49900854, se sídlem: Vrskmaň 74, 431 15 Vrskmaň.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice neschvaluje",
        items: [
          "záměr rozšíření prodeje pozemků Správě železnic, státní organizaci, Dlážděná 1003/7, Praha 1, IČO: 70994234 o pozemky: část pozemků parc.č. 2053/2 a parc.č. 1981/1 k.ú. Krhanice.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
