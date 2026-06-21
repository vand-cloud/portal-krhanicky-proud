/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "3",
    rok: "2025",
    isoDate: "2025-06-25",
    dateLabel: "25. 6. 2025",
    fullDateDot: "25.6.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-3.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "Zápis č.2/2025 zastupitelstva obce Krhanice ze dne 16.04.2025 (viz příloha).",
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Martin Jiřička, Petr Dub.",
          "program zasedání zastupitelstva obce.",
          "Závěrečný účet obce Krhanice za rok 2024 a dává souhlas s celoročním hospodařením, a to bez výhrad.",
          "účetní závěrku obce Krhanice za rok 2024; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "účetní závěrku příspěvkové organizace Mateřská škola Krhanice, okres Benešov za rok 2024; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "účetní závěrku příspěvkové organizace Základní škola Krhanice, okres Benešov za rok 2024; schvalovaná účetní závěrka poskytuje věrný a poctivý obraz předmětu účetnictví a finanční situace účetní jednotky.",
          "výsledek hospodaření ve schvalovacím řízení za rok 2024 obce Krhanice ve výši 13 778 928,05 Kč a jeho převod na účet 432 výsledek hospodaření předchozích účetních období.",
          "hospodářský výsledek příspěvkové organizace Základní škola Krhanice za rok 2024 ve výši 39 296,43 Kč a jeho příděl do rezervního fondu.",
          "Protokol o schvalování účetní závěrky za rok 2024 obce Krhanice.",
          "Protokol o schvalování účetní závěrky za rok 2024 příspěvkové organizace Mateřská škola Krhanice, okres Benešov.",
          "Protokol o schvalování účetní závěrky za rok 2024 příspěvkové organizace Základní škola Krhanice, okres Benešov.",
          "rozpočtové opatření č. 3/2025.",
          "Smlouvu o dílo číslo SoD/1/2025 na zhotovení díla Krhanice přípolož veřejného osvětlení – dodání a montáž technologie, zemní práce s Elmoz Czech, s.r.o., IČO: 47544929, Černoleská 2326, 256 01 Benešov v částce 248 413,- Kč bez DPH.",
          "zřízení věcného břemene na pozemcích parc.č. 1981/1, 1983/1, 1983/2, 346/2, 272/1 a 363 k.ú. Krhanice a schvaluje uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6036731/VB/4 BN_Krhanice-trafo,kNN-č.parc. 373/5 na pozemcích parc.č. 1981/1, 1983/1, 1983/2, 346/2, 272/1 a 363 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 5 900,- Kč na umístění zařízení distribuční soustavy – kabelové vedení NN.",
          "propachtování části pozemku parc.č. 1420/8 k.ú. Krhanice o výměře 2416 m², části pozemku parc.č.1978/2 k.ú. Krhanice o výměře 761 m² a části pozemku parc.č. 1420/2 k.ú. Krhanice o výměře 278 m² a schvaluje uzavření pachtovní smlouvy pro část pozemku parc.č. 1420/8 k.ú. Krhanice o výměře 2416 m², část pozemku parc.č.1978/2 k.ú. Krhanice o výměře 761 m² a část pozemku parc.č. 1420/2 k.ú. Krhanice o výměře 278 m² pro hospodaření v zemědělství za cenu 4 % z ceny půdy úředně stanovené průměrné ceny pozemků v katastrálním území Krhanice dle vyhlášky č. 298/2014 Sb. o stanovení seznamu katastrálních území s přiřazenými průměrnými základními cenami zemědělských pozemků, v platném znění, na dobu 4 let od 26.6.2025 se STATEK POŽÁRY s.r.o., IČO: 05933498, Římská 1276/36, 120 00, zastoupený Mgr. Janem Cilínkem.",
          "zřídit věcné břemeno na pozemku parc.č. 2086/1 k.ú. Krhanice dle geometrického plánu č. 1196-12/2025 a schvaluje uzavření Smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek 1435/22 k.ú. Krhanice na pozemku parc.č. 2086/1 k.ú. Krhanice dle geometrického plánu č. 1196-12/2025 na dobu neurčitou za cenu 3 000,- Kč s K.B. Krhanice čp. 70, 257 42 Krhanice a J.B., Krhanice.",
          "uzavření Dohody o zrušení věcného břemene chůze a jízdy, kdy dojde ke zrušení věcného břemene pro Oprávněnou stranu z věcného břemene M.N. a Povinnou stranu Obec Krhanice v tomto rozsahu: ruší se věcné břemeno chůze a jízdy – oprávnění pro parcelu č.102/4, povinnost k parcele č.102/20, parcele č.102/38, parcele č.102/39 a parcele č.1439/10 vše k.ú. Krhanice.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "Obecně závaznou vyhlášku obce Krhanice o regulaci hlučných činností.",
          "A.1) Zastupitelstvo obce schvaluje vložení majetku tvořícího vodovody a kanalizace pro veřejnou potřebu ve vlastnictví Obce Krhanice, IČO: 00232025, Krhanice č.p. 46, 257 42 Krhanice specifikovaného v příloze Příloha č. 1 - Specifikace vodohospodářského majetku (dále jen „Vložený majetek“) do hospodaření dle ustanovení § 38 zákona č. 250/2000 Sb., o rozpočtových pravidlech územních rozpočtů, ve znění pozdějších předpisů dobrovolného svazku obcí Společná voda d.s.o., IČO: 17408288, se sídlem Černoleská 1600, 256 01 Benešov (dále jen „Společná voda“);\nA.2) Zastupitelstvo obce schvaluje uzavření smlouvy mezi Obcí Krhanice, IČO: 00232025, Krhanice č.p. 46, 257 42 Krhanice a Společnou vodou d.s.o., IČO: 17408288, se sídlem Černoleská 1600, 256 01 Benešov, na jejímž základě dojde k vložení Vloženého majetku dle předchozího bodu do hospodaření Společné vody a přenesení majetkových práv k Vloženému majetku na Společnou vodu v rozsahu dle stanov Společné vody;\nA.3) Zastupitelstvo obce pověřuje Mgr. Aleše Papouška, starostu Obce Krhanice zabezpečit provedení potřebných úkonů k realizaci bodů A.1) a A.2) tohoto usnesení;\nA.4) Zastupitelstvo obce pověřuje Mgr. Aleše Papouška, starostu Obce Krhanice uzavřením Smlouvy dle bodu A.2).\nB.1) Zastupitelstvo obce schvaluje uzavření smlouvy o přenechání vodohospodářské infrastruktury do užívání za účelem zajištění jejího provozu mezi Obcí Krhanice, IČO: 00232025, Krhanice č.p. 46, 257 42 Krhanice a dobrovolného svazku obcí Společná voda d.s.o., IČO: 17408288, se sídlem Černoleská 1600, 256 01 Benešov (dále jen „Společná voda“) na základě níž dojde k přenechání do užívání majetku tvořícího vodovody a kanalizace pro veřejnou potřebu ve vlastnictví Obce Krhanice specifikovaného v příloze Příloha č.1 - Specifikace svěřeného majetku včetně protokolu o převzetí (dále jen „Svěřený majetek“) Společné vodě za účelem zajištění provozování Svěřeného majetku Společnou vodou;\nB.2) Zastupitelstvo obce pověřuje Mgr. Aleše Papouška, starostu Obce Krhanice zabezpečit provedení potřebných úkonů k realizaci bodu B.1) tohoto usnesení;\nB.3) Zastupitelstvo obce pověřuje Mgr. Aleše Papouška, starostu Obce Krhanice uzavřením Smlouvy dle bodu B.1).",
          "uzavření Dohody vlastníků provozně souvisejících vodovodů dle zákona o vodovodech a kanalizacích mezi Obcí Krhanice a Městem Týnec nad Sázavou, IČO: 00232904, K Náklí 404, 257 41 Týnec nad Sázavou.",
          "ceny pronájmu pozemků a nebytových prostor s účinností od 1.7.2025 dle následující tabulky:\nPronájem pozemku nebo jeho části – občan: 15,00 Kč m²/rok\nPronájem pozemku nebo jeho části – podnikání: 30,00 Kč m²/rok\nPronájem pozemku nebo jeho části – spolky, pobočné spolky a zájmová sdružení: 1,00 Kč m²/rok\nDlouhodobý (nad 30 dnů) pronájem nebytových prostor nebo jejich části vyjma klubovny zázemí víceúčelového hřiště – občan: 70,00 Kč m²/rok\nDlouhodobý (nad 30 dnů) pronájem nebytových prostor nebo jejich části vyjma klubovny zázemí víceúčelového hřiště – podnikání: 330,00 Kč m²/rok\nKrátkodobý (do 30 dnů) pronájem nebytových prostor nebo jejich části vyjma klubovny zázemí víceúčelového hřiště – občan: 15,00 Kč m²/den\nKrátkodobý (do 30 dnů) pronájem nebytových prostor nebo jejich části vyjma klubovny zázemí víceúčelového hřiště – podnikání: 30,00 Kč m²/den\nPronájem pozemku nebo jeho části pro užitný objem pod pronajímaným pozemkem nebo jeho části – občan: 15,00 Kč m²/rok\nPronájem pozemku nebo jeho části pro užitný objem pod pronajímaným pozemkem nebo jeho části – podnikání: 135,00 Kč m²/rok",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Závěrečný účet dobrovolného svazku obcí BENE-BUS za rok 2024 a Zprávu o výsledku přezkoumání hospodaření za rok 2024 dobrovolného svazku obcí BENE-BUS.",
          "Závěrečný účet Týnecko-svazek obcí za rok 2024 a Zprávu o výsledku přezkoumání hospodaření za rok 2024 Týnecko – svazek obcí.",
          "Závěrečný účet Posázavský vodovod – dobrovolný svazek obcí za rok 2024 a Zprávu o výsledku přezkoumání hospodaření za rok 2024 Posázavský vodovod – dobrovolný svazek obcí.",
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice za rok 2024 ze dne 19.5.2025.",
          "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za rok 2024 ze dne 19.5.2025.",
          "Rozpočtové opatření č. 1/2025 DSO BENE-BUS.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením Smlouvy o dílo číslo SoD/1/2025 na zhotovení díla Krhanice přípolož veřejného osvětlení – dodání a montáž technologie, zemní práce s Elmoz Czech, s.r.o., IČO: 47544929, Černoleská 2326, 256 01 Benešov.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
