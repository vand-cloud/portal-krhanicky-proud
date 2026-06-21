/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "návrhovou komisi ve složení: Jana Laboutková, Petr Dub.",
  "ověřovatele zápisu ve složení Aleš Kozel, Tomáš Kratochvíl.",
  "program zasedání zastupitelstva obce.",
  "v souladu s usnesením Zastupitelstva obce Krhanice č. 6/2022 ze dne 7.11.2022 výši odměny neuvolněné člence zastupitelstva H.S.: člen zastupitelstva : 1 083,- Kč, a to s platností od 16.6.2023.",
  "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2022; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "Protokol o schvalování účetní závěrky za rok 2022 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
  "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2022; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "rozdělení hospodářského výsledku příspěvkové organizace Základní škola Krhanice za rok 2022 ve výši 30.480,82 Kč do rezervního fondu.",
  "Protokol o schvalování účetní závěrky za rok 2022 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
  "účetní závěrku obce Krhanice za rok 2022; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "výsledek hospodaření ve schvalovacím řízení za rok 2022 obce Krhanice a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
  "Protokol o schvalování účetní závěrky za rok 2022 obce Krhanice.",
  "Závěrečný účet obce Krhanice za rok 2022 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
  "Ing. Jaroslava Mikynu jako technický dozor pro akci Krhanice – Okružní křižovatka silnic, část 2 – chodníky a další SO a schvaluje uzavření smlouvy na výkon technického dozoru v částce 65 000,- Kč.",
  "Pravidla pro poskytování finančních darů v roce 2023 – pravomoc starosty.",
  "Pravidla pro poskytování finančních příspěvků pro občany s trvalým pobytem v obci Krhanice na pořízení kompostéru v obci Krhanice.",
  "navýšení provozního příspěvku Základní škole Krhanice, okres Benešov o 145 tisíc Kč (regionální učebnice, oprava střechy budovy).",
  "uzavření Dodatku č.3 ke Smlouvě o dílo se společností Intermont, Opatrný. s.r.o., IČO: 49900854, Mostecká 1973, 431 11 Jirkov pro stavební práce Krhanice – revitalizace a VZT budovy ZŠ. Cena díla včetně DPH se navyšuje o 270 956,70 Kč.",
  "rozpočtové opatření č. 6/2023.",
  "Obecně závaznou vyhlášku obce, kterou se stanoví část společného školského obvodu základní školy.",
  "Obecně závaznou vyhlášku obce o nočním klidu.",
  "Obecně závaznou vyhlášku obce Krhanice o stanovení obecního systému odpadového hospodářství.",
  "Obecně závaznou vyhlášku obce o stanovení místního koeficientu pro výpočet daně z nemovitých věcí.",
  "pronajmout část pozemku parc. č. 132/1 k.ú. Krhanice o výměře 430 m² ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m²/rok od 1.7.2023 na dobu 4 let M.K., Praha.",
  "pronajmout část pozemku parc. č. 132/1 k.ú. Krhanice o výměře 131 m² ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m2/rok od 1.9.2023 na dobu 4 let J.H., Praha.",
  "pronajmout část pozemku parc. č. 1884/2 k.ú. Krhanice o výměře 494 m2 ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m2/rok od 14.10.2023 na dobu 4 let P.P.,Praha.",
  "pronajmout část pozemku parc. č. 1954/1 k.ú. Krhanice o výměře 24 m² k dočasnému umístění dětských herních prvků a stolů za cenu 10,- Kč/1 m²/rok od 1.10.2023 na dobu 4 let M.K., Chrást nad Sázavou.",
  "uzavřít smlouvu o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 365/1 k.ú. Krhanice na pozemku parc.č. 1983/1 k.ú. Krhanice dle geometrického plánu č. 1094-38/2022 na dobu neurčitou za cenu 3.000,- Kč s M.M., Krhanice.",
  "uzavřít smlouvu o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 365/2 k.ú. Krhanice na pozemku parc.č. 1981/1 k.ú. Krhanice dle geometrického plánu č. 1115-16/2023 na dobu neurčitou za cenu 3.000,- Kč s L.S., Krhanice.",
  "uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IE-12-6028834/VB/001 Krhanice-kNN-parc.č.336/3 na pozemcích parc. č. 319 k.ú. Krhanice a parc. č. 324/1 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 16 900 Kč na umístění zařízení kabelového vedení a pojistkové skříně.",
  "bezúplatné nabytí stavby veřejného osvětlení (v počtu 4 ks Led svítidel) na p.č. 299/1 k.ú. Krhanice zkolaudovaného Městským úřadem Týnec nad Sázavou do vlastnictví obce Krhanice v hodnotě 251 680 Kč od B.M. a I.M., Jílové u Prahy.",
  "uzavření Dodatku č.1 ke Smlouvě o dílo SoD č. 2022/2 se společností LAROS s.r.o., IČO: 49826514, Jana Nohy 1285, 256 01 Benešov pro stavební práce Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice, prodloužení termínu do 30.9.2023.",
  "a souhlasí s účastí obce Krhanice v rámci projektu Úřadu práce Příbram, pobočka Benešov v zaměstnávání osob se sníženou možností získání zaměstnání – 1 pracovní místo.",
  "cenu oběda pro cizí strávníky Školní jídelny Základní školy Krhanice v částce 81,- Kč od 1.9.2023.",
];

const naVedomi = [
  "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2022 ze dne 26.4.2023.",
  "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2022 ze dne 26.4.2023.",
  "rozpočtové opatření č. 4/2023 a č. 5/2023.",
  "Závěrečný účet dobrovolného svazku obcí BENE-BUS za rok 2022 a Zprávu o výsledku přezkoumání hospodaření za rok 2022 dobrovolného svazku obcí BENE-BUS.",
  "Závěrečný účet Týnecko-svazek obcí za rok 2022 a Zprávu o výsledku přezkoumání hospodaření za rok 2022 Týnecko – svazek obcí.",
  "Závěrečný účet Posázavský vodovod – dobrovolný svazek obcí za rok 2022 a Zprávu o výsledku přezkoumání hospodaření za rok 2022 Posázavský vodovod – dobrovolný svazek obcí.",
  "Kalkulaci vodného za kalendářní rok 2022 od VHS Benešov a.s. pro obec Krhanice a Posázavský vodovod.",
  "informaci o připravovaném podání žádosti o dotaci na projekt „Krhanice – rekonstrukce veřejného osvětlení“.",
];

const poveruje = [
  "starostu obce podpisem Dodatku č.3 ke Smlouvě o dílo se společností Intermont, Opatrný. s.r.o., IČO: 49900854, Mostecká 1973, 431 11 Jirkov pro stavební práce Krhanice – revitalizace a VZT budovy ZŠ.",
  "starostu obce podpisem Dodatku č.1 ke Smlouvě o dílo SoD č. 2022/2 se společností LAROS s.r.o., IČO: 49826514, Jana Nohy 1285, 256 01 Benešov pro stavební práce Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice.",
];

const neschvaluje = [
  "posunutí hlasování o uzavření Dodatku č. 3 ke smlouvě o dílo se společností Intermont, Opatrný. s.r.o., IČO: 49900854, Mostecká 1973, 431 11 Jirkov pro stavební práce Krhanice – revitalizace a VZT budovy ZŠ na příští zasedání Zastupitelstva obce Krhanice.",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "2",
    rok: "2023",
    isoDate: "2023-06-15",
    dateLabel: "15. 6. 2023",
    fullDateDot: "15.6.2023",
    pdfPath: "scripts/zapisy-pdf/usneseni-2023-2.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice bere na vědomí", items: naVedomi },
      { heading: "Zastupitelstvo obce Krhanice pověřuje", items: poveruje },
      { heading: "Zastupitelstvo obce Krhanice neschvaluje", items: neschvaluje },
    ],
  });
  console.log(
    "OK",
    r.docId,
    "blocks",
    r.blocks,
    "| schvaluje",
    schvaluje.length,
    "naVedomi",
    naVedomi.length,
    "poveruje",
    poveruje.length,
    "neschvaluje",
    neschvaluje.length,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
