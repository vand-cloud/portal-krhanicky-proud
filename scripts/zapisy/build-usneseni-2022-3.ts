/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2022",
    isoDate: "2022-05-02",
    dateLabel: "2. 5. 2022",
    fullDateDot: "2.5.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-3.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Petr Dub.",
          "ověřovatele zápisu ve složení Václav Zíta, Tomáš Kratochvíl.",
          "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2021; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "rozdělení hospodářského výsledku příspěvkové organizace Základní škola Krhanice za rok 2021 ve výši 1 991,81 Kč do rezervního fondu.",
          "Protokol o schvalování účetní závěrky za rok 2021 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
          "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2021; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "rozdělení hospodářského výsledku příspěvkové organizace Základní škola Krhanice za rok 2021 ve výši 36 325,09 Kč do rezervního fondu.",
          "Protokol o schvalování účetní závěrky za rok 2021 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
          "účetní závěrku obce Krhanice za rok 2021; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "výsledek hospodaření ve schvalovacím řízení za rok 2021 obce Krhanice a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
          "Protokol o schvalování účetní závěrky za rok 2021 obce Krhanice.",
          "Závěrečný účet obce Krhanice za rok 2021 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
          "Obecně závaznou vyhlášku obce Krhanice, o nočním klidu.",
          "bere na vědomí a schvaluje rozpočtové opatření č. 3/2022.",
          "nová pravidla pro poskytování humanitární pomoci na území obce Krhanice zahraničním uprchlíkům z Ukrajiny od 3.5.2022 do 31.12.2022.",
          "zřízení spořícího účtu Obce Krhanice u České spořitelny, a.s. a uzavření smlouvy na zřízení spořícího účtu u České spořitelny, a.s.",
          "převod částky 10.000.000,- Kč z běžného účtu 320094309/0800 na spořící účet Obce Krhanice u České spořitelny, a.s. s možností průběžných čerpání.",
          "zřízení vkladového účtu Obce Krhanice u České spořitelny, a.s. a uzavření smlouvy na zřízení vkladového účtu u České spořitelny, a.s.",
          "převod částky 5.000.000,- Kč z běžného účtu 320094309/0800 na vkladový účet Obce Krhanice u České spořitelny a.s. na dobu 3 měsíců s možností automatického prodloužení o 3 měsíce.",
          "pořízení platební karty k běžnému bankovnímu účtu 320094309/0800 a uzavření smlouvy na pořízení platební karty u České spořitelny, a.s.",
          "rozpočtové opatření č. 4/2022.",
          "prodej pozemků parc.č. 460 k.ú. Krhanice o výměře 2691 m² a pozemku parc.č. 496/2 k.ú. Krhanice o výměře 1040 m² za cenu 76 Kč/1 m². E. a M. S., Krhanice. Kupující uhradí náklady na vyhotovení kupní smlouvy a náklady na návrh na vklad do katastru nemovitostí. V kupní smlouvě bude uvedeno předkupní právo obce Krhanice pro případný budoucí prodej pozemků na dobu 15 let.",
          "prodej pozemku parc. č. 1979/4 a části pozemků parc. č. 1981/2 a 2051/5 dle geometrického plánu č. 1038-5/2021 k. ú. Krhanice, které využívá Správa železnic, státní organizace, IČO 70994234, Dlážděná 1003/7, Praha 1 v rámci své činnosti při zajišťování provozování železniční dopravní cesty jako veřejné služby za cenu znaleckého posudku č. 5791 – 23/2022 ve výši 239.780,- Kč. Kupující uhradí náklady na návrh na vklad do katastru nemovitostí.",
          "pronájem části pozemku parc. č. 312/19 o výměře 41 m² k.ú. Krhanice od 1.6.2022 do 31.5.2026 za cenu 10,- Kč/1 m²/rok za účelem ke zřízení zahrádky L.R., Krhanice.",
          "nákup pozemků parc.č. 1942/9 o výměře 288 m² k.ú. Krhanice za cenu 200,- Kč/1m² a parc.č. 1942/14 o výměře 524 m² k.ú. Krhanice za cenu 400,- Kč/1m² od M. S. a J. S. Prosečnice. Vklad do katastru nemovitostí hradí obec.",
          "předběžný souhlas s umístěním truhlíků s květinami a zelenínou napravo vedle chodníku směrem k areálu TJ Sokol Krhanice ze strany vznikajícího spolku Naše Krhanice, z.s.",
          "předběžný souhlas se záměrem zvelebit plochu mezi svahem a pamětní kamennou deskou napravo vedle chodníku směrem k areálu TJ Sokol Krhanice zejména keři ze strany vznikajícího spolku Naše Krhanice, z.s.",
          "9 členů zastupitelstva obce pro volební období 2022 – 2026.",
          "uzavření Dodatku č. 1 ke Smlouvě o dílo na stavební práce „Krhanice – revitalizace a VZT budovy ZŠ“ s firmou Intermont, Opatrný, s.r.o., Vrskmaň 74, 431 15 Vrskmaň, IČO:49900854. Uzavřením Dodatku č. 1 se upravuje termín ukončení díla na 31.8.2023.",
          "Závěrečný účet DSO Týnecko-svazek obcí za rok 2021 a souhlasí s celoročním hospodařením, a to bez výhrad.",
          "podání žádosti o dotaci „Krhanice – rekonstrukce návsi a okolních chodníků“ v rámci Programu 2021-2024 pro poskytování dotací na rozvoj obcí do 2000 obyvatel ze Středočeského Fondu obnovy venkova ve znění Dodatku č. 1. v rámci tematického zadání „Veřejná infrastruktura“ ze Středočeského kraje a souhlasí s podmínkami dotace a finanční spoluúčastí obce.",
          "vypsání výběrového řízení na dodavatele stavby pro projekt „Krhanice – rekonstrukce návsi a okolních chodníků“.",
          "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČ 27129772 při zajištění poradenství při realizaci výběrového řízení pro projekt „Krhanice – rekonstrukce návsi a okolních chodníků“.",
          "podání žádosti o dotaci „Krhanice – rekonstrukce veřejného osvětlení“ pro dotační titul na Ministerstvu práce a obchodu: Výzva č. NPO 1/2022 NÁRODNÍ PLÁN OBNOVY; Rekonstrukce veřejného osvětlení - Komponenta 2.2.2.",
          "uzavření plánovací smlouvy s H.D., Dolní Požáry na zhotovení zpevněné komunikace na pozemku parc.č. 1435/49 k.ú. Krhanice ve vlastnictví obce Krhanice. Plánovací smlouva bude uzavřena na dobu 5 let. Obec Krhanice se na realizaci zpevněné komunikace finančně nepodílí.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2021 ze dne 25.4.2022.",
          "na vědomí protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2021 ze dne 25.4.2022.",
          "Zprávu o výsledku přezkoumání hospodaření za rok 2021 DSO Týnecko – svazek obcí.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce zřízením spořícího účtu Obce Krhanice u České spořitelny, a.s. a uzavřením smlouvy na zřízení spořícího účtu u České spořitelny, a.s.",
          "starostu obce dispozicemi na spořícím účtu Obce Krhanice u České spořitelny, a.s.",
          "starostu obce zřízením vkladového účtu Obce Krhanice u České spořitelny, a.s. a uzavřením smlouvy na zřízení vkladového účtu u České spořitelny, a.s.",
          "starostu obce dispozicemi na vkladovém účtu Obce Krhanice u České spořitelny, a.s.",
          "starostu obce zajištěním platební karty Obce Krhanice u České spořitelny, a.s.",
          "starostu obce realizací vypsání výběrového řízení na dodavatele stavby pro projekt „Krhanice – rekonstrukce návsi a okolních chodníků“.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
