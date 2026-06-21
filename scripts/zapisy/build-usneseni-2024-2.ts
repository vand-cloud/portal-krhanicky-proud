/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "2",
    rok: "2024",
    isoDate: "2024-06-06",
    dateLabel: "6. 6. 2024",
    fullDateDot: "6.6.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-2.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení: Lucie Maršíková, Tomáš Kratochvíl.",
          "program zasedání zastupitelstva obce.",
          "v souladu s usnesením Zastupitelstva obce Krhanice č. 6/2022 ze dne 7.11.2022 výši odměny neuvolněné člence zastupitelstva Šárce Dušové: člen zastupitelstva: 1 083,- Kč, a to s platností od 7.6.2024.",
          "Závěrečný účet obce Krhanice za rok 2023 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
          "účetní závěrku obce Krhanice za rok 2023; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2023; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2023; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "výsledek hospodaření ve schvalovacím řízení za rok 2023 obce Krhanice ve výši 14 004 512,41 Kč a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
          "hospodářský výsledek příspěvkové organizace Základní škola Krhanice za rok 2023 ve výši 43 114,60 Kč a jeho příděl do rezervního fondu.",
          "Protokol o schvalování účetní závěrky za rok 2023 obce Krhanice.",
          "Protokol o schvalování účetní závěrky za rok 2023 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
          "Protokol o schvalování účetní závěrky za rok 2023 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
          "oslovení firmy Jaroslav Žaba k předložení nabídky na realizaci projektu Chodník podél silnice III/106.",
          "navýšení provozního příspěvku Mateřské školy Krhanice ve výši 40.000,- Kč na nákup drobného majetku.",
          "uzavření veřejnoprávní smlouvy o poskytnutí individuální dotace ve výši 23 560,- Kč na vertikulaci fotbalového hřiště s Tělocvičnou jednotou Sokol Krhanice, IČO: 61664723, 257 42 Krhanice č.p. 162.",
          "rozpočtové opatření č. 5/2024.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení služebnosti na pozemku parc. č. 111/2 k.ú. Krhanice s CETIN a.s., IČO: 04084063, se sídlem: Českomoravská 2510/19, 190 00 Praha 9, na dobu neurčitou za cenu 13000 Kč na podzemní kabelové vedení a pilíř elektroměrového rozvaděče.",
          "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 1439/9 k.ú. Krhanice na pozemcích parc.č. 1978/13 a 1439/10 k.ú. Krhanice dle geometrického plánu č. 1145-3/2024 na dobu neurčitou za cenu 6.000,- Kč s Š.S., Praha a L.S. Praha .",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6036043 na pozemku parc. č. 312/61 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 7700,- Kč na umístění zařízení distribuční soustavy – kabelové vedení.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6034244/VB/6 na pozemcích parc. č. 1972/1 a 1977 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 13300,- Kč na umístění zařízení distribuční soustavy – kabelové vedení a podpěrný bod – betonový sloup.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6033714/VB/1 na pozemcích parc. č. 35, 1972/1 a 38/6 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 74400,- Kč na umístění zařízení distribuční soustavy – kabelové vedení a rozpojovací skříně.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6033714/VB/4 na pozemku parc. Č. 35 k.ú. Krhanice s M.J., Krhanice a F.B., Nové Strašecí, na dobu neurčitou za cenu 2000,- Kč na umístění zařízení distribuční soustavy – kabelové vedení a rozpojovací skříně. Investorem akce bude ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6033714/VB/6 na pozemku parc. č. 1972/1 k.ú. Krhanice s M.S., Krhanice, na dobu neurčitou za cenu 2000,- Kč na umístění zařízení distribuční soustavy – kabelové vedení a rozpojovací skříně. Investorem akce bude ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín.",
          "záměr prodeje části pozemku z pozemku parc. č. 1439/10 k.ú. Krhanice o výměře cca 110 m² za cenu 900,- Kč/1 m² a schvaluje záměr koupit část pozemku z pozemku parc.č. 186/26 k.ú. Krhanice o výměře cca za cenu 900,- Kč/1 m².",
          "uzavření nájemní smlouvy o nájmu části pozemku parc.č. 2070/3 o výměře 333 m² – „dočasný zábor k používání veřejností jako chodník“ s firmou: České dráhy, a.s., sídlo: Praha 1, Nábřeží L. Svobody 1222, PSČ 110 15, IČO: 70994226.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "uzavření Smlouvy o dílo na „Dopravní automobil pro JSDHO Krhanice“ (EDS: 014D262004192) s firmou EMBEFOR s.r.o., IČO: 06138900, se sídlem Korunní 2569/108, 101 00 Praha 10 na celkovou částku 1 709 730,- Kč s DPH.",
          "přijetí dotace ve výši 300 000,- Kč z rozpočtu Středočeského kraje ze Středočeského Fondu podpory dobrovolných hasičů a složek IZS a schvaluje uzavření veřejnoprávní smlouvy o poskytnutí dotace na akci „Dopravní automobil pro JSDHO Krhanice“.",
          "cenu vodného 73,16 Kč s DPH/1 m³ s účinností od 1.6.2024.",
          "uzavření Smlouvy o poskytování služeb – DTM ČR s firmou Vodohospodářská společnost Benešov, a.s., Černoleská 1600, 256 13 Benešov u Prahy, IČO: 47535865.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Závěrečný účet dobrovolného svazku obcí BENE-BUS za rok 2023 a Zprávu o výsledku přezkoumání hospodaření za rok 2023 dobrovolného svazku obcí BENE-BUS.",
          "Závěrečný účet Týnecko-svazek obcí za rok 2023 a Zprávu o výsledku přezkoumání hospodaření za rok 2023 Týnecko – svazek obcí.",
          "Závěrečný účet Posázavský vodovod – dobrovolný svazek obcí za rok 2023 a Zprávu o výsledku přezkoumání hospodaření za rok 2023 Posázavský vodovod – dobrovolný svazek obcí.",
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2023 ze dne 22.4.2024.",
          "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2023 ze dne 22.4.2024.",
          "rozpočtové opatření č. 2/2024, 3/2024 a č. 4/2024.",
          "Rozpočtové opatření č. 1/2024 Posázavského vodovodu – dobrovolného svazku obcí.",
          "jmenování Barbory Tejčkové Poldové ředitelkou Mateřské školy Krhanice, okres Benešov s účinností od 1.7.2024.",
          "jmenování členů Školské rady Základní školy Krhanice: Aleš Papoušek, Jaroslav Mixa, Jana Laboutková na další tříleté funkční období za zřizovatele.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením a podpisem smlouvy o dílo na akci „Dopravní automobil pro JSDHO Krhanice“ (EDS: 014D262004192) s firmou EMBEFOR s.r.o., IČO: 06138900, se sídlem Korunní 2569/108, 101 00 Praha 10.",
          "starostu obce uzavřením a podpisem veřejnoprávní smlouvy o poskytnutí dotace na akci „Dopravní automobil pro JSDHO Krhanice“ se Středočeským krajem.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
