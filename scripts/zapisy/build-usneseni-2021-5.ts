/* eslint-disable no-console */
// Faithful visual transcript of Usnesení č. 5/2021 (10.12.2021), transcribed
// page-by-page from the official PDF. Sections by action verb: schvaluje,
// pověřuje, bere na vědomí. Signatures / Vyvěšeno-Sejmuto omitted. GDPR note
// is present in the source. Item 21 is a multi-row nested resolution kept as a
// single numbered point with soft line breaks (\n).
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "program zasedání zastupitelstva obce.",
  "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
  "ověřovatele zápisu Tomáš Kratochvíl, Bohuslav Kadeřábek.",
  "bere na vědomí a schvaluje rozpočtové opatření č. 6/2021, 7/2021 a 8/2021.",
  "zvýšení provozního příspěvku Mateřské škole Krhanice o 10.000, - Kč (telekomunikační služby).",
  "odvod z Fondu investic Základní školy Krhanice ve výši 300.000,- Kč do rozpočtu obce Krhanice.",
  "snížení a vratku provozního příspěvku Základní školy Krhanice ve výši 210.000,- Kč do rozpočtu obce Krhanice do konce roku 2021. Jedná se o snížení položky energií.",
  "rozpočtové opatření č. 9/2021.",
  "Střednědobý výhled rozpočtu na období 2022 – 2025.",
  "Rozpočet Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice pro rok 2022.",
  "Rozpočet Bene-Bus na rok 2022 jako schodkový, schodek bude kryt finančními prostředky z minulých let.",
  "Střednědobý výhled rozpočtu Bene-Bus na období 2023-2025.",
  "Rozpočet Týnecko-svazek obcí na rok 2022 jako vyrovnaný.",
  "Střednědobý výhled rozpočtu Týnecko-svazek obcí na období 2023-2024.",
  "Přílohu č. 1 Rozpočtu obce Krhanice na rok 2022: Závazné ukazatele a pravidla pro poskytování prostředků z rozpočtu obce Krhanice.",
  "Přílohu č. 2 Rozpočtu obce Krhanice na rok 2022: Poskytování dotací – veřejnoprávní smlouvy a poskytování neúčelových finančních darů – darovací smlouvy.",
  "Přílohu č. 3 Rozpočtu obce Krhanice na rok 2022: Pravidla pro provádění rozpočtových opatření a rozpisu rozpočtu obce Krhanice.",
  "Rozpočet obce Krhanice na rok 2022 jako schodkový. Schodek bude kryt finančními prostředky z minulých let.",
  "Obecně závaznou vyhlášku obce Krhanice č. 2/2021, o stanovení obecního systému odpadového hospodářství.",
  "Obecně závaznou vyhlášku obce Krhanice č. 3/2021, o místním poplatku za obecní systém odpadového hospodářství.",
  "Usnesení o vydání změny č. 1 územního plánu Krhanice\nZastupitelstvo obce\nI. bere na vědomí „Předkládací zprávu ke změně č. 1 územního plánu (dále též „ÚP“) Krhanice“;\nII. ověřilo soulad s ustanovením § 54 odst. 2 zákona č. 183/2006 Sb., o územním plánování a stavebním řádu (stavební zákon) v platném znění, že zpracovaná dokumentace není v rozporu:\n1. s Politikou územního rozvoje ČR, ve znění Aktualizací,\n2. s územně plánovací dokumentací vydanou krajem – se Zásadami územního rozvoje Středočeského kraje, ve znění Aktualizací,\n3. s výsledkem řešení rozporů (nebyly řešeny),\n4. se stanovisky dotčených orgánů,\n5. se stanoviskem krajského úřadu ze dne 3.11.2021;\nIII. rozhodlo o námitkách v souladu s kap. 15. odůvodnění změny;\nIV. vydává změnu č. 1 územního plánu Krhanice podle ustanovení § 6 odst. 5 písm. c) stavebního zákona formou opatření obecné povahy;\nV. ukládá pořizovateli:\n1. zajistit po nabytí účinnosti změny č. 1 ÚP Krhanice povinnosti vyplývající z ustanovení § 165 stavebního zákona a z § 14 vyhlášky č. 500/2006 Sb., o územně analytických podkladech, územně plánovací dokumentace a způsobu evidence územně plánovací činnosti,\n2. zaslat registrační list Krajskému úřadu Středočeského kraje ve smyslu ustanovení § 162 stavebního zákona.",
  "schvaluje pronájem pozemku parc. č. 59/1 k. ú. Krhanice o výměře 1223 m² od 1.1.2022 do 31.12.2022 za cenu 10,- Kč/1 m²/rok za účelem zřízení zahrádky J. a J.K., Praha.",
  "pronájem části pozemku parc. č. 509/16 k. ú. Krhanice o výměře 92 m² a část pozemku parc. č. 510/4 k. ú. Krhanice o výměře 58 m² od 1.1.2022 do 31.12.2022 za cenu 5,- Kč/1 m²/rok za účelem zřízení zahrádky P.R., Krhanice.",
  "pronájem části pozemku parc.č. 312/19 k.ú. Krhanice o výměře 105 m² za účelem zřízení zahrádky na dobu 4 let za cenu 5,- Kč/1 m²/rok od 1.1.2022 J.M., Krhanice.",
  "pronájem části pozemku parc. č. 312/8 k.ú. Krhanice o výměře 18 m² za účelem umístění vozíku za auto na dobu 4 let za cenu 5,- Kč/1 m²/rok od 1.3.2022 P.P., Krhanice.",
  "pronájem části pozemku parc. č. 110/1 k.ú. Krhanice o výměře 150 m² za účelem dočasného zřízení zahrádky na dobu 4 let za cenu 5,- Kč/1 m²/rok od 1.3.2022 J.B., Krhanice.",
  "koupi oddělené části pozemku parc.č. 1953/9 k.ú. Krhanice o výměře 89 m² za cenu 55,- Kč/1m² od Altstaedter Investments a.s., Radlická 180/20, 150 00 Praha 5. Náklady na geodetické oddělení a náklady na vklad do katastru nemovitostí hradí kupující.",
  "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby na pozemku parc. č. 1944/4 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 7.200,- Kč na kabelové vedení NN.",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice splátkový kalendář.",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice splátkový kalendář",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice zřízení trvalého příkazu z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí na splátku jistiny od 25.3.2023 do 31.12.2032 ve výši 161.827,04 Kč, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000735 (číslo Smlouvy projektu), specifický symbol: 21 dle splátkového kalendáře.",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice souhlas s inkasem z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí v max. výši součtu prvních tří splátek úroků, tj. 20 754,32 Kč od 30.6.2023 do 31.1.2033, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000735 (číslo Smlouvy projektu), specifický symbol: 23 dle splátkového kalendáře.",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice zřízení trvalého příkazu z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí na splátku jistiny od 25.3.2023 do 31.12.2032 ve výši 10.040,48 Kč, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000745 (číslo Smlouvy projektu), specifický symbol: 21.",
  "pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice souhlas s inkasem z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí v max. výši součtu prvních tří splátek úroků, tj. 1.287,70 Kč od 30.6.2023 do 31.1.2033, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000745 (číslo Smlouvy projektu), specifický symbol: 23.",
  "uzavření příkazní smlouvy na činnost koordinátora BOZP v rámci akce „Krhanice – revitalizace a VZT budovy ZŠ“ za maximální výši 45.000,- Kč s Martinem Michálkem, IČO: 42567980, se sídlem Senohrabská 2943/10, 141 00 Praha 4.",
  "zvolení kandidáta na funkci přísedícího u Okresního soudu Benešov: D.N., dle zákona č. 6/2000 Sb., o soudech a soudcích, v platném znění.",
  "schvaluje a souhlasí se vznikem pracovněprávních vztahů mezi obcí a členem zastupitelstva obce s platností od 1.1.2022 do 31.12.2022, a to Oblast požární ochrana: Ing. Tomáš Kratochvíl, Ing. Martin Jiřička; Oblast veřejná zeleň: Ing. Bohuslav Kadeřábek, Ing. Tomáš Kratochvíl; Oblast komunální služby: Ing. Bohuslav Kadeřábek, Ing. Tomáš Kratochvíl; Oblast lesní hospodářství: Ing. Bohuslav Kadeřábek, Ing. Tomáš Kratochvíl; Oblast Činnosti knihovnické: Bc. Petr Dub. Dohody budou uzavírány v průběhu roku 2022 dle konkrétních potřeb obce.",
  "cenu vodného pro rok 2022 ve výši 60,40 Kč s DPH/1 m³.",
  "ceník palivového dřeva od 1.1.2022.",
  "podání žádosti o dotaci na Rekonstrukci hrobu rudoarmějců na hřbitově v Krhanicích z programu 107290 – Zachování a obnova historických hodnot I, Česká republika – Ministerstvo obrany v rámci IV. Výzvy k podání žádosti o dotaci na zabezpečení péče o válečné hroby (čj. MO 278239/2021-7460).",
  "podání žádosti o dotaci na Státní fond dopravní infrastruktury na opatření ke zvýšení bezpečnosti nebo plynulosti dopravy pro rok 2022 pro projekt Krhanice – chodník podél silnice III/1066.",
  "spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO: 27129772 při vyhotovení a podání žádosti o dotaci (20.000,- kč bez DPH) a pro zajištění poradenství při realizaci výběrového řízení (15.000,- Kč) na Státní fond dopravní infrastruktury – opatření ke zvýšení bezpečnosti nebo plynulosti dopravy pro rok 2022 pro projekt Krhanice – chodník podél silnice III/1066.",
  "Dodatek č. 12 k Příloze č. 1 Knihovního řádu Obecní knihovny Krhanice Výpůjční řád.",
];

const poveruje = [
  "starostu obce pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice zřízením trvalého příkazu z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí na splátku jistiny od 25.3.2023 do 31.12.2032 ve výši 161.827,04 Kč, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000735 (číslo Smlouvy projektu), specifický symbol: 21 dle splátkového kalendáře.",
  "starostu obce pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice zajištěním souhlasu s inkasem z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí v max. výši součtu prvních tří splátek úroků, tj. 20 754,32 Kč od 30.6.2023 do 31.1.2033, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000735 (číslo Smlouvy projektu), specifický symbol: 23 dle splátkového kalendáře.",
  "starostu obce pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice zřízením trvalého příkazu z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí na splátku jistiny od 25.3.2023 do 31.12.2032 ve výši 10.040,48 Kč, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000745 (číslo Smlouvy projektu), specifický symbol: 21.",
  "starostu obce pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice zajištěním souhlasu s inkasem z bankovního účtu obce č.ú. 320094309/0800 vedeného u ČS a.s. ve prospěch Státního fondu životního prostředí v max. výši součtu prvních tří splátek úroků, tj. 1.287,70 Kč od 30.6.2023 do 31.1.2033, bankovní spojení Fondu: č.ú. 30007-9025001/0710, variabilní symbol: 19000745 (číslo Smlouvy projektu), specifický symbol: 23.",
];

const naVedomi = [
  "zprávu finančního výboru o kontrole hospodaření obce Krhanice v roce 2021 ze dne 25.10.2021.",
  "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice v roce 2021 ze dne 25.10.2021.",
  "Rozhodnutí o poskytnutí dotace (změna) pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a Rozhodnutí o poskytnutí dotace (změna) pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice.",
  "Zápis z dílčího přezkoumání hospodaření obce ze dne 1.12.2021.",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "5",
    rok: "2021",
    isoDate: "2021-12-10",
    dateLabel: "10. 12. 2021",
    fullDateDot: "10.12.2021",
    pdfPath: "scripts/zapisy-pdf/usneseni-2021-5.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice pověřuje", items: poveruje },
      { heading: "Zastupitelstvo obce Krhanice bere na vědomí", items: naVedomi },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks, "| schvaluje", schvaluje.length, "poveruje", poveruje.length, "naVedomi", naVedomi.length);
}
run().catch((e) => { console.error(e); process.exit(1); });
