/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2023",
    isoDate: "2023-07-19",
    dateLabel: "19. 7. 2023",
    fullDateDot: "19.7.2023",
    pdfPath: "scripts/zapisy-pdf/usneseni-2023-3.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jana Laboutková, Petr Dub.",
          "ověřovatele zápisu ve složení Tomáš Kratochvíl, Hana Strnadová.",
          "program zasedání zastupitelstva obce.",
          "Petra Duba k podpisu usnesení zastupitelstva.",
          "uzavření Smlouvy o dílo č. SoD/02/2023 se společností B E S s.r.o., IČO 43792553, se sídlem Sukova 625, 256 01 Benešov pro stavební práce „Okružní křižovatka silnic II/106 x III/1065 x III/1066 – Krhanice“. Cena díla včetně DPH pro obec Krhanice jako zadavatele č. 2 je 4 553 730,48 Kč.",
          "rozpočtové opatření č. 7/2023.",
          "prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „c“ a díl „d“, o výměře 32 m², které vzniknou dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1 m² K.B., Krhanice.",
          "prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „e“, o výměře 22 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1 m² K.B., Krhanice.",
          "prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „f“, o výměře 14 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1 m² V.P., Krhanice.",
          "koupit oddělenou část pozemku st.p. 28 k.ú. Krhanice, díl „a“, o výměře 20 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1 m² od K.B., Krhanice.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce podpisem Smlouvy o dílo č. SoD/02/2023 se společností B E S s.r.o., IČO 437 92 553, se sídlem Sukova 625, 256 01 Benešov pro stavební práce „Okružní křižovatka silnic II/106 x III/1065 x III/1066 – Krhanice“.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice ruší",
        items: [
          "následující body z Usnesení č. 6/2022:\n14. prodat pozemek parc.č. 1978/15 k.ú. Krhanice o výměře 79 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1 m² K.B., Krhanice.\n15. prodat pozemek parc.č. 1978/16 k.ú. Krhanice o výměře 18 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1 m² V.P., Krhanice.\n16 .koupí pozemku parc.č. 2125 k.ú. Krhanice o výměře 20 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku st.p. 28 k.ú. Krhanice za cenu 30,  Kč/1 m².",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
