/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "2",
    rok: "2021",
    isoDate: "2021-06-14",
    dateLabel: "14. 6. 2021",
    fullDateDot: "14.6.2021",
    pdfPath: "scripts/zapisy-pdf/usneseni-2021-2.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Petr Dub.",
          "ověřovatele zápisu ve složení Václav Zíta, Bohuslav Kadeřábek.",
          "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2020; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "Protokol o schvalování účetní závěrky za rok 2020 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
          "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2020; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "rozdělení hospodářského výsledku příspěvkové organizace Základní škola Krhanice za rok 2020 ve výši 26.035,24 Kč do rezervního fondu.",
          "Protokol o schvalování účetní závěrky za rok 2020 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
          "účetní závěrku obce Krhanice za rok 2020; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "výsledek hospodaření ve schvalovacím řízení za rok 2020 obce Krhanice a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
          "Protokol o schvalování účetní závěrky za rok 2020 obce Krhanice.",
          "Závěrečný účet obce Krhanice za rok 2020 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
          "Obecně závaznou vyhlášku obce Krhanice č. 1/2021, o nočním klidu.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6028567/VB/002, Krhanice-kNN-č.parc. 276/2 na pozemku parc. č. 1981/1 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 4.000,- Kč na umístění kabelového vedení NN.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6028834/VB/001, Krhanice – kNN – parc. č. 336/3 na pozemcích parc. č. 318/2 a 319 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 6.100,- Kč na umístění kabelového vedení NN.",
          "uzavření Smlouvu o zřízení věcného břemene – vodovodní přípojky pro pozemek parc.č. st. 310 k.ú. Krhanice na pozemku parc.č. 1435/20 k.ú. Krhanice na dobu neurčitou za cenu 3.000,- Kč s Bc. J.S a K.S., Pohoří.",
          "uzavření Smlouvy o zřízení věcného břemene – na umístění elektrické přípojky pro pozemek parc.č. 1429/2 k.ú. Krhanice na pozemku parc.č. 1435/20 k.ú. Krhanice na dobu neurčitou za cenu 3.000,- Kč s R.N., Krhanice.",
          "z důvodu odprodeje budoucích oddělených částí pozemků parc. č. 2051/8 o výměře 80 m2 a 2051/9 o výměře 88 m2 Správě železnic, státní organizaci, IČ 70994234, Dlážděná 1003/7, 110 00 Praha 1 dělení pozemku parc.č. 2051/5 k.ú. Krhanice dle geometrického plánu č. 1039-6/2021.",
          "z důvodu odprodeje budoucí oddělené části pozemku parc. č. 1981/3 o výměře 138 m2 Správě železnic, státní organizaci, IČ 70994234, Dlážděná 1003/7, 110 00 Praha 1 dělení pozemku parc.č. 1981/2 k.ú. Krhanice dle geometrického plánu č. 1038-5/2021.",
          "pojistnou smlouvu odpovědnosti za újmu a pojištění úrazu Jednotky sboru dobrovolných hasičů obce Krhanice s Hasičskou vzájemnou pojišťovnou, a.s.",
          "investiční příspěvek ve výši 141.038,- Kč Základní škole Krhanice pro zajištění podílu školy pro dotaci z Programu rozvoje venkova pro pořízení tabulí s interaktivním systémem do kmenových učeben v roce 2021. V případě neobdržení této dotace z Programu rozvoje venkova bude celá částka poskytnutého příspěvku vrácena obci Krhanice v termínu do 10.12.2021.",
          "předložený odpisový plán na elektrickou pánev pro Základní školu Krhanice.",
          "navýšení provozního příspěvku o 89.000,- Kč pro Základní školu Krhanice na navýšení odpisů a na dovybavení IT učebny.",
          "rozpočtové opatření č. 3/2021.",
          "Závěrečný účet DSO BENE-BUS za rok 2020 a souhlasí s celoročním hospodařením, a to bez výhrad.",
          "Závěrečný účet DSO Týnecko-svazek obcí za rok 2020 a souhlasí s celoročním hospodařením, a to bez výhrad.",
          "bere na vědomí návrh projektu budoucího zajištění společného provozu vodohospodářské infrastruktury v regionech Benešovska a Vlašimska a okresech Praha-západ a Praha-východ, za účasti zastoupení skupiny SUEZ Groupe v České republice a schvaluje uzavření předloženého návrhu memoranda o vzájemné spolupráci jako podkladu pro zahájení realizace projektu.",
          "výběr firmy Intermont, Opatrný, s.r.o., IČO: 49900854, se sídlem: Vrskmaň 74, 431 15 Vrskmaň pro realizaci akce „Krhanice – revitalizace a VZT budovy ZŠ“.",
          "uzavření smlouvy o dílo na stavební dozor na akci „Krhanice – revitalizace a VZT budovy ZŠ“ s Ing. Jaroslavem Mikynou, IČO: 45128359, Vlašimská 1924, 256 01 Benešov ve výši 180.000,- Kč bez DPH.",
          "na další funkční období do Školské rady Základní školy Krhanice tyto členy: Aleš Papoušek, Jaroslav Mixa, Jana Laboutková.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2020 ze dne 17.5.2021.",
          "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2020 ze dne 17.5.2021.",
          "Zprávu o výsledku přezkoumání hospodaření obce za rok 2020.",
          "účast obce Krhanice v rámci aktivní politiky zaměstnanosti (veřejně prospěšné práce).",
          "Zprávu o výsledku přezkoumání hospodaření za rok 2020 DSO BENE-BUS.",
          "Zprávu o výsledku přezkoumání hospodaření za rok 2020 DSO Týnecko – svazek obcí.",
          "pokračování Lenky Houzarové ve funkci ředitelky Mateřské školy Krhanice na čtyřleté období od 1.7.2021.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice neschvaluje",
        items: [
          "poskytnutí finančního příspěvku ve výši 5.000,- Kč pro TAJV, z.s., IČ 09287094, Sportovní 158, 290 01 Poděbrady na pořádání sportovního dne mládeže s TAJV v Krhanicích v roce 2021.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce Mgr. Aleše Papouška k podpisu předloženého návrhu memoranda o vzájemné spolupráci tak, aby se podpis uskutečnil nejpozději do 30.6.2021 a k provedení všech dalších právních jednání v rámci plnění práv a povinností vyplývajících z memoranda o vzájemné spolupráci.",
          "starostu obce Mgr. Aleše Papouška uzavřením a podpisem smlouvy o dílo na stavební dozor na akci „Krhanice – revitalizace a VZT budovy ZŠ“ s Ing. Jaroslavem Mikynou, IČO: 45128359, Vlašimská 1924, 256 01 Benešov.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
