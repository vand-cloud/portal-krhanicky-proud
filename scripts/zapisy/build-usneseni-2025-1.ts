/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2025",
    isoDate: "2025-03-11",
    dateLabel: "11. 3. 2025",
    fullDateDot: "11.3.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-1.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Šárka Dušová, Martin Jiřička.",
          "program zasedání zastupitelstva obce.",
          "odvod z Fondu investic Základní školy Krhanice ve výši 250 000,- Kč.",
          "navýšení provozního příspěvku Základní škole Krhanice ve výši 32 890,- Kč (navýšení odpisů pro nový majetek – server).",
          "navýšení provozního příspěvku Mateřské škole Krhanice ve výši 17 500,- Kč (spoluúčast k dotaci z OP JAK II).",
          "rozpočtové opatření č. 1/2025.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "souhlas s fúzí svazku Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223, se sídlem: Masarykovo náměstí 194, 254 01 Jílové u Prahy, sloučením se svazkem Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov.",
          "smlouvu o fúzi svazku Posázavský vodovod – dobrovolný svazek obcí, IČO: 141 17 223, se sídlem: Masarykovo náměstí 194, 254 01 Jílové u Prahy, sloučením se svazkem Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov, s rozhodným dnem 1. 7. 2025.",
          "vstup do dobrovolného svazku Společná voda d.s.o., IČO: 174 08 288, se sídlem Černoleská 1600, 256 01 Benešov, fúzí sloučením k rozhodnému dni 1. 7. 2025.",
          "souhlas s účastí ve svazku Společná voda d.s.o., IČO: 174 08 288, se sídlem Černoleská 1600, 256 01 Benešov, a s podmínkami smlouvy o vytvoření dobrovolného svazku obcí ze dne 28.07.2022 a se stanovami svazku Společná voda d.s.o., IČO: 174 08 288, se sídlem Černoleská 1600, 256 01 Benešov, a s podmínkami smlouvy o společném zadávání veřejných zakázek včetně koncesí ze dne 30.12.2022 a přistupuje k nim.",
          "poskytnutí vstupního vkladu, příspěvku nad rámec základního vkladu člena svazku obcí Společná voda d.s.o., jehož je členem, pro Společná voda d.s.o., se sídlem Černoleská 1600, 256 01 Benešov, IČO 174 08 288, ve výši 542.088,- Kč.",
          "uzavření smlouvy o vstupním vkladu, příspěvku nad rámec základního vkladu člena svazku obcí Společná voda d.s.o., jehož se stane členem, se svazkem obcí Společná voda d.s.o., se sídlem Černoleská 1600, 256 01 Benešov, IČO 174 08 288.",
          "dohodu o úpravě majetkových poměrů o bezúplatném převodu části Posázavského vodovodu na svazek Společná voda d.s.o., ke dni 1. 7. 2025, a to IČME 2101-674362-00232025-1/3, název části: Posázavský vodovod (Prosečnice-Krhanice), k.ú.: Krhanice, IČME: 2101-674362-00232025-1/4, název části: Posázavský vodovod (Kam. Újezdec-Prosečnice), k.ú.: Krhanice. Tento vodohospodářský majetek je detailně popsán v příloze č. 1 této dohody, která tvoří její nedílnou součást.",
          "souhlas s tím, že v rámci ukončení účasti obce Krhanice v zanikajícím svazku jeho zánikem k rozhodnému dni, nedojde v souladu se stanovami svazku Posázavský vodovod – dobrovolný svazek obcí, k vypořádání této obce, tj., že ukončením její účasti jí nevzniká nárok na majetkové a finanční vypořádání.",
          "uzavření Smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek 272/5 k.ú. Krhanice na pozemku parc.č. 1981/1 k.ú. Krhanice dle geometrického plánu č. 1183-56/2024 na dobu neurčitou za cenu 3 000,- Kč s J.S., Chrást nad Sázavou.",
          "uzavření Smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek 272/4 k.ú. Krhanice na pozemku parc.č. 1981/1 k.ú. Krhanice dle geometrického plánu č. 1184-57/2024 na dobu neurčitou za cenu 3 000,- Kč s K.S., Hostěradice.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu Kontrolního výboru ze dne 16.12.2024.",
          "Inventarizační zprávu obce Krhanice za rok 2024.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce zabezpečit provedení potřebných úkonů vedoucích k realizaci usnesení bodu č.7 Zastupitelstva obce Krhanice pro vstup obce do Společná voda d.s.o., zejména hlasovat na správní radě svazku Posázavský vodovod – dobrovolný svazek obcí, IČO: 14117223, se sídlem: Masarykovo náměstí 194, 254 01 Jílové u Prahy, pro plánovanou fúzi sloučením tohoto svazku se svazkem Společná voda d.s.o., se sídlem Černoleská 1600, 256 01 Benešov, IČO 174 08 288, podepsat všechny potřebné dohody a smlouvy.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
