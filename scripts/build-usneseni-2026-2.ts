/* eslint-disable no-console */
// DEMO: faithful transcript of Usnesení č. 2/2026 (8.6.2026), transcribed
// visually from the official PDF. Structure proposal for resolutions:
//   PDF download bar + "Upozornění" note + GDPR note
//   then each action-verb section as H3 ("…schvaluje", "…bere na vědomí",
//   "…projednalo", "…pověřuje") followed by a numbered list that reproduces
//   the document's own P.č. numbering. Signatures / Vyvěšeno-Sejmuto omitted.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { client, h3, p, nl, warnNote, type Block } from "./zapis-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));

let k = 0;
const key = () => `u${k++}`;
const PDF_PATH = resolve(__dirname, "zapisy-pdf/usneseni-2026-2.pdf");
const DOC_ID = "uradPost-usneseni-2026-2-zasedani-8-6-2026";
const FULL_TITLE = "Usnesení č. 2/2026 Zastupitelstva obce Krhanice ze dne 8.6.2026";

const gdprNote = (): Block => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text: "Z důvodu ochrany osobních údajů (GDPR) je dokument upraven.", marks: ["em"] }],
});

const schvaluje = [
  "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
  "ověřovatele zápisu ve složení Petr Dub, Tomáš Kratochvíl.",
  "program zasedání zastupitelstva obce.",
  "Závěrečný účet obce Krhanice za rok 2025 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
  "účetní závěrku obce Krhanice za rok 2025; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2025; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2025; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
  "výsledek hospodaření ve schvalovacím řízení za rok 2025 obce Krhanice ve výši 14 266 797,32 Kč a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
  "hospodářský výsledek příspěvkové organizace Základní škola Krhanice za rok 2025 ve výši 51 971,67 Kč a jeho příděl do rezervního fondu.",
  "hospodářský výsledek příspěvkové organizace Mateřská škola Krhanice za rok 2025 ve výši 2 140 Kč a jeho příděl do rezervního fondu.",
  "Protokol o schvalování účetní závěrky za rok 2025 obce Krhanice.",
  "Protokol o schvalování účetní závěrky za rok 2025 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
  "Protokol o schvalování účetní závěrky za rok 2025 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
  "navýšení provozního příspěvku Základní škole Krhanice ve výši 50 000 Kč (příspěvek na provoz ZŠ Krhanice – vybavení jídelna).",
  "navýšení příspěvku na financování nepedagogických pracovníků a ostatních neinvestičních výdajů Základní školy Krhanice ve výši 214 000 Kč (na zajištění plavání a v souvislosti se změnou tabulek na platy od 1.4.2026).",
  "navýšení příspěvku na financování nepedagogických pracovníků a ostatních neinvestičních výdajů Mateřské školy Krhanice ve výši 17 000 Kč (v souvislosti se změnou tabulek na platy od 1.4.2026).",
  "rozpočtové opatření č. 2/2026.",
  "v souladu s ustanovením § 107 zákona č. 283/2021 Sb., stavební zákon, v platném znění, ve spojení s § 27 stavebního zákona „Územní plán Krhanice s prvky regulačního plánu, Zprávu o uplatňování za uplynulé období 10/2019 – 01/2026“, obsahující zadání změny č. 2, z května 2026, uvedenou v příloze č. 1 tohoto usnesení.",
  "pronajmout část pozemku parc. č. 224/4 k.ú. Krhanice o výměře 1 m² pro propagaci činnosti spolku za cenu 1,- Kč/1 m²/rok od 9.6.2026 do 8.6.2030 Unii rodičů ZŠ Krhanice, z.s., IČO 22877177, Krhanice 149, 257 42 Krhanice.",
  "zřídit věcné břemeno podzemního/nadzemního komunikačního vedení veřejné komunikační sítě a uzavřít Smlouvu o budoucí smlouvě o zřízení služebnosti č. 11010-110319 na pozemcích parc.č. 1972/1, 2109, 2095, 1978/13, 1972/6, 111/2, 1985/12, 1978/6, 224/7, 224/4, 224/25, 224/6, 227/8, 227/7, 224/1, 220/4, 220/3, 244/8, 241/23, 244/10, 241/22, 241/16, 313/40, 312/54, 312/48, 312/53, 312/67 a 1981/1 k.ú. Krhanice s CETIN a.s., IČO 04084063, Českomoravská 2510/19, Libeň, 190 00 Praha 9 na dobu neurčitou za cenu 164 400,- Kč.",
  "pronajmout část pozemku parc. č. 1884/4 k.ú. Krhanice o výměře 92 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.8.2026 do 31.7.2030 H.V., Praha 5.",
  "pronajmout část pozemku parc. č. 1884/4 k.ú. Krhanice o výměře 40 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.10.2026 do 30.9.2030 L.B., Praha 4.",
  "pronajmout část pozemku parc. č. 1884/4 k.ú. Krhanice o výměře 166 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.12.2026 do 30.11.2030 L.P., Praha 5.",
  "pronajmout část pozemku parc. č. 312/19 k.ú. Krhanice o výměře 120 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.8.2026 do 31.7.2030 D.M., Krhanice.",
  "pronajmout část pozemku parc. č. 312/19 k.ú. Krhanice o výměře 66 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 1.8.2026 do 31.7.2030 D.R., Krhanice.",
  "pronajmout část pozemku parc. č. 312/19 k.ú. Krhanice o výměře 50 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 9.6.2026 do 8.6.2030 L.R., Krhanice.",
  "pronajmout část pozemku parc. č. 312/19 k.ú. Krhanice o výměře 105 m² pro zřízení dočasné zahrádky za cenu 15,- Kč/1 m²/rok od 9.6.2026 do 8.6.2030 a pronajmout část pozemku parc. č. 312/19 k.ú. Krhanice o výměře 7,5 m² pro uložení movitých věcí za cenu 15,- Kč/1 m²/rok od 9.6.2026 do 8.6.2030 J.M., Krhanice.",
  "pronajmout část pozemku parc. č. 312/8 k.ú. Krhanice o výměře 11,25 m² pro umístění vozíku za auto za cenu 15,- Kč/1 m²/rok od 9.6.2026 do 8.6.2030 J.H., Krhanice.",
  "prodat oddělenou část pozemku parc. č. 403/8 k.ú. Krhanice o výměře 7 000 m², který vznikne oddělením z pozemku parc. č. 403/2 k.ú. Krhanice na základě geometrického plánu č. 1177-114/2024 za celkovou cenu 321 680 Kč, stanovenou na základě znaleckého posudku číslo 5088/69/26 kupujícímu NATY TERRA, s.r.o., IČO 09462741, Žitavského 1178, Zbraslav, 156 00 Praha 5. Do kupní ceny bude připočten výdaj na znalecký posudek ve výši 4 000 Kč. Vklad na katastr nemovitostí hradí kupující a koupit oddělenou část pozemku parc.č. 361/3 k.ú. Krhanice o výměře 7 000 m², který vznikne oddělením z pozemku parc.č. 361/1 k.ú. Krhanice na základě geometrického plánu č. 1177-114/2024 za celkovou cenu 303 590 Kč, stanovenou na základě znaleckého posudku číslo 5089/70/26 od prodávajícího NATY TERRA, s.r.o., IČO 09462741, Žitavského 1178, Zbraslav, 156 00 Praha 5. Do kupní ceny bude připočten výdaj na znalecký posudek ve výši 4 000 Kč. Vklad na katastr nemovitostí hradí kupující.",
  "zřídit věcné břemeno kabelového vedení NN a skříně a uzavřít Smlouvu o zřízení věcného břemene – služebnosti č. IV-12-6033714/1 Krhanice na pozemcích parc.č. 38/6, 1972/1 a 1977 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 68 378 Kč.",
  "zřídit věcné břemeno kabelového vedení NN a uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6035954/VB01 na pozemcích parc.č. 1435/20 a 1435/49 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 100 500 Kč na umístění zařízení distribuční soustavy – kabelové vedení NN.",
  "koupit pozemek oddělenou část pozemku parc.č. 1978/13 k.ú. Krhanice, a to díl „a“ o výměře 23 m² a díl „b“ o výměře 25 m², které budou sloučeny do pozemku parc.č. 1978/13 k.ú. Krhanice na základě geometrického plánu č. 1321/59/2025 za cenu 1 000,- Kč/1 m² od T.Č. a D.Č., Vlašim. Náklady spojené s odkoupením bude hradit obec (geometrický plán, vklad na katastr, …).",
  "koupit pozemek parc. č. 148/7 k.ú. Krhanice o výměře 162 m² a koupit oddělenou část pozemku parc.č. 148/52 k.ú. Krhanice o výměře 1 977 m², který vznikne oddělením z pozemku parc.č. 148/32 k.ú. Krhanice na základě geometrického plánu č. 1316/5635/2025 za cenu 35,- Kč/1 m² od J.K., Krhanice. Náklady spojené s odkoupením bude hradit obec (geometrický plán, vklad na katastr, …).",
  "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
  "uzavření Smlouvy č. 7251300013 o poskytnutí podpory ze Státního fondu životního prostředí České republiky pro projekt „Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích“ se Státním fondem životního prostředí České republiky v rámci Programu financovaného z prostředků Modernizačního fondu a schvaluje přijetí dotace ve výši 303 283,33 Kč.",
  "uzavření Dodatku č. 1 ke Smlouvě o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové.",
  "cenu vodného od 1.7.2026 v částce 84,45 Kč vč. DPH.",
];

const naVedomi = [
  "Závěrečný účet dobrovolného svazku obcí BENE-BUS za rok 2025 a Zprávu o výsledku přezkoumání hospodaření za rok 2025 dobrovolného svazku obcí BENE-BUS.",
  "Závěrečný účet Týnecko-svazek obcí za rok 2025 a Zprávu o výsledku přezkoumání hospodaření za rok 2025 Týnecko – svazek obcí.",
  "Závěrečný účet Společná voda d.s.o. za rok 2025 a Zprávu o výsledku přezkoumání hospodaření za rok 2025 Společná voda d.s.o.",
  "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2025 ze dne 6.5.2026.",
  "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2025 ze dne 6.5.2026.",
  "rozpočtové opatření č. 1/2026 Bene-Bus.",
  "rozpočtové opatření č. 1/2026 a č. 2/2026 Společná voda d.s.o.",
  "„Důvodovou zprávu, výsledek vyhodnocení projednání Zprávy o uplatňování Územního plánu Krhanice obsahující zadání změny č. 2 územního plánu Krhanice s vyhodnocením stanovisek, připomínek, požadavků a podnětů“.",
  "rozhodnutí Valné hromady Týnecko-svazek obcí o zrušení svazku s likvidací, a to ke dni 31.5.2026.",
  "jmenování Mgr. Bc. Věry Ráblové, ředitelkou Základní školy Krhanice, okres Benešov s účinností od 1.7.2026.",
];

const projednalo = [
  "výslednou verzi „Územního plánu Krhanice s prvky regulačního plánu, Zprávy o uplatňování za uplynulé období 10/2019 – 01/2026“, obsahující zadání změny č. 2, z května 2026.",
];

const poveruje = [
  "starostu obce uzavřením Smlouvy č. 7251300013 o poskytnutí podpory ze Státního fondu životního prostředí České republiky pro projekt „Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích“ se Státním fondem životního prostředí České republiky v rámci Programu financovaného z prostředků Modernizačního fondu.",
  "starostu obce podpisem Dodatku č. 1 ke Smlouvě o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové.",
];

async function run() {
  const buffer = readFileSync(PDF_PATH);
  const asset = await client.assets.upload("file", buffer, { filename: "usneseni-2-2026-krhanice.pdf" });
  const fileBar: Block = {
    _type: "fileDownload",
    _key: key(),
    file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    name: FULL_TITLE,
    fileType: "PDF",
  };

  const body: Block[] = [
    fileBar,
    warnNote(),
    gdprNote(),
    h3("Zastupitelstvo obce Krhanice schvaluje"),
    ...nl(schvaluje),
    h3("Zastupitelstvo obce Krhanice bere na vědomí"),
    ...nl(naVedomi),
    h3("Zastupitelstvo obce Krhanice projednalo"),
    ...nl(projednalo),
    h3("Zastupitelstvo obce Krhanice pověřuje"),
    ...nl(poveruje),
  ];

  await client.createOrReplace({
    _id: DOC_ID,
    _type: "uradPost",
    title: "Usnesení č. 2/2026, zasedání 8. 6. 2026",
    slug: { _type: "slug", current: "usneseni-2026-2-zasedani-8-6-2026" },
    date: "2026-06-08",
    summary: "Usnesení ze zasedání zastupitelstva obce Krhanice dne 8. 6. 2026. Plný přepis i originál ke stažení.",
    category: { _type: "reference", _ref: "uradCategory-zastupitelstvo" },
    subcategory: "archiv-schuzi",
    body,
  });

  console.log("OK", DOC_ID, "blocks", body.length, "| schvaluje", schvaluje.length, "naVedomi", naVedomi.length, "projednalo", projednalo.length, "poveruje", poveruje.length);
}
run().catch((e) => { console.error(e); process.exit(1); });
