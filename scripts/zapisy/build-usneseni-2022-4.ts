/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "4",
    rok: "2022",
    isoDate: "2022-07-18",
    dateLabel: "18. 7. 2022",
    fullDateDot: "18.7.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-4.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Petr Dub, Bohuslav Kadeřábek.",
          "uzavření smlouvy o dílo na akci Krhanice – rekonstrukce návsi a okolních chodníků s firmou Jaroslav Žaba, Pecerady 69, 257 41 Týnec nad Sázavou, IČO: 86934431 ve výši 6.134.213,44 Kč.",
          "uzavření smlouvy o dílo na akci Krhanice – MK na p.č. 109/11 – obnova MK s firmou: B E S s.r.o., Sukova 625, 256 01 Benešov, IČO: 437 92 553 ve výši 448 117,23 Kč bez DPH.",
          "poskytnutí finančního příspěvku ve výši 10.000,- Kč pro Naše Krhanice, z.s., Krhanice 252, 257 42 Krhanice, IČO: 17149487 na akci Slavnosti sv. Josefa. S organizací bude uzavřena veřejnoprávní smlouva.",
          "poskytnutí finančního příspěvku ve výši 29.232,- Kč pro RUAH, o.p.s., Křižíkova 2158, 256 01 Benešov, IČO: 24312355 na nákup automobilu pro výkon sociální práce v obci. S organizací bude uzavřena veřejnoprávní smlouva.",
          "bezúplatný pronájem tréninkového hřiště v prostoru před Základní školou Krhanice ve dnech 10.9.2022, 17.9.2022, 18.9.2022 pro Naše Krhanice, z.s., Krhanice 252, 257 42 Krhanice, IČO: 17149487.",
          "navýšení provozního příspěvku ve výši 28.000,- Kč pro Základní školu Krhanice, okres Benešov pro středisko školní jídelna.",
          "rozpočtové opatření č. 5/2022.",
          "pronajmout část pozemku parc.č. 1884/4 k.ú. Krhanice o výměře 151 m² od 1.8.2022 do 31.7.2026 za cenu 10,- Kč/1 m²/rok za účelem dočasného zřízení zahrádky H.V., Praha.",
          "pronajmout část pozemku parc.č. 312/19 k.ú. Krhanice o výměře 120 m² od 1.8.2022 do 31.7.2026 za cenu 10,- Kč/1 m²/rok za účelem dočasného zřízení zahrádky D.M., Krhanice.",
          "pronajmout část pozemku parc.č. 312/19 k.ú. Krhanice o výměře 66 m² od 1.8.2022 do 31.7.2026 za cenu 10,- Kč/1 m²/rok za účelem dočasného zřízení zahrádky D.R., Krhanice.",
          "pronajmout část pozemku parc.č. 1884/4 k.ú. Krhanice o výměře 40 m² od 1.10.2022 do 30.9.2026 za cenu 10,- Kč/1 m²/rok za účelem dočasného zřízení zahrádky L.B., Praha.",
          "pronajmout část pozemku parc.č. 229/1 k.ú. Krhanice o výměře 36 m² od 1.11.2022 do 31.10.2026 za cenu 10,- Kč/1 m²/rok za účelem souvisejícím se stáním pro automobily J.H., Krhanice.",
          "pronajmout část pozemku parc.č. 1884/4 k.ú. Krhanice o výměře 166 m² od 1.12.2022 do 30.11.2026 za cenu 10,- Kč/1 m²/rok za účelem dočasného zřízení zahrádky L.P., Praha.",
          "uzavření smlouvy o zřízení věcného břemene – uložení elektrické přípojky pro pozemek parc.č. 1429/2 k.ú. Krhanice na pozemcích parc.č. 1435/20 k.ú. Krhanice na dobu neurčitou za cenu 3.000,- Kč s R.N., Krhanice.",
          "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 1964/4 k.ú. Krhanice na pozemcích parc.č. 1965/1 a parc.č. 2080/1 k.ú. Krhanice na dobu neurčitou za cenu 6.000,- Kč s M.H., Praha.",
          "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 127/7 k.ú. Krhanice na pozemcích parc.č. 127/8 a parc.č. 128/9 k.ú. Krhanice na dobu neurčitou za cenu 6.000,- Kč s M.V., Týnec nad Sázavou.",
          "uzavření smlouvy o smlouvě budoucí o zřízení věcného břemene a dohodu o umístění stavby č. IE-12-6011284/VB1 pro stavbu „Krhanice-demontáž NN – nový kNN“ na pozemcích parc.č. 220/4, 220/3, 1978/13, 241/23, 244/8, 2070/5, 224/1, 227/8, 227/7, 220/8 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO: 24729035, se sídlem, Teplická 874/8, Děčín IV-Podmokly, 405 02 Děčín na dobu neurčitou za cenu 38.600,- Kč.",
          "záměr koupě pozemku parc. č. 148/28 k.ú. Krhanice o výměře 103 m² a nově vzniklý pozemek díl „a“ z pozemku parc.č. 152 k.ú. Krhanice o výměře 75 m², který vznikne na základě geometrického plánu č. 1063-141/2021, za cenu 160,- Kč/m². Obec Krhanice (kupující) uhradí související náklady – vyjmutí ze ZPF a návrhy na vklad do katastru nemovitostí.",
          "Obecně závaznou vyhlášku obce Krhanice, o nočním klidu.",
          "bere na vědomí a schvaluje cenu vodného ve výši 63,15 Kč/m³ s DPH s účinností od 1.7.2022.",
          "Závěrečný účet DSO BENE-BUS za rok 2021 a souhlasí s celoročním hospodařením, a to bez výhrad.",
          "záměr rozšíření ovocné aleje na pozemku parc. č. 2024 k.ú. Krhanice ze strany spolku Aktivní Krhanice, z.s., Krhanice 35, 257 42 Krhanice, IČO: 09017429 s podmínkou udržitelnosti ze strany spolku.",
          "Pravidla pronájmu klubovny zázemí víceúčelového hřiště s účinností od 1.9.2022.",
          "spolupráci při přípravě projektové dokumentace v rámci etapizace prací při budování chodníku od parku nad obecním úřadem po značku konec obce směrem ke statku s firmou LUCIDA s.r.o., Marie Cibulkové 365/34, Praha 4, IČO: 25651099.",
          "přijetí dotace ze Středočeského kraje, Středočeského infrastrukturního fondu – Drobné vodohospodářské projekty na akci Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice a souhlasí s podmínkami dotace.",
          "vypsání výběrového řízení na dodavatele stavby pro projekt „Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice“.",
          "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČ 27129772 při zajištění poradenství při realizaci výběrového řízení pro projekt „Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice“.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu o výsledku přezkoumání hospodaření za rok 2021 DSO BENE-BUS.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu uzavřením a podpisem smlouvy o dílo na akci Krhanice – rekonstrukce návsi a okolních chodníků s firmou Jaroslav Žaba, Pecerady 69, 257 41 Týnec nad Sázavou, IČO: 86934431.",
          "starostu uzavřením a podpisem smlouvy o dílo na akci Krhanice – MK na p.č. 109/11 – obnova MK s firmou: B E S s.r.o., Sukova 625, 256 01 Benešov, IČO: 437 92 553.",
          "starostu obce realizací vypsání výběrového řízení na dodavatele stavby pro projekt „Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice“.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
