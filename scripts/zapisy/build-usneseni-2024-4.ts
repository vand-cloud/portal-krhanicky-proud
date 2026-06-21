/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
  "ověřovatele zápisu ve složení: Petr Dub, Aleš Kozel.",
  "program zasedání zastupitelstva obce.",
  "pronájem části pozemku parc. č. 312/19 k.ú. Krhanice o výměře 101 m² ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m²/rok od 1.10.2024 na dobu 4 let J.M., Krhanice.",
  "pronájem části pozemku parc. č. 312/8 k.ú. Krhanice o výměře 10 m² k umístění vozíku za auto pro účely podnikání za cenu 20,- Kč/1 m²/rok od 1.10.2024 na dobu 4 let M.R., Krhanice.",
  "pronájem nebytových prostor – místnost v přízemí budovy Obecního úřadu Krhanice o výměře 15 m² k uskladnění malířských potřeb za cenu 250,- Kč/1 m²/rok od 1.1.2025 na dobu 4 let P.F., Krhanice.",
  "pronájem části pozemku parc. č. 1941/21 o výměře 1028 m² a pozemek parc.č. 1943/1 pro hospodaření v zemědělství za cenu 4% z ceny půdy úředně stanovené průměrné ceny pozemků v katastrálním území Krhanice dle vyhlášky č. 298/2014 Sb. o stanovení seznamu katastrálních území s přiřazenými průměrnými základními cenami zemědělských pozemků, v platném znění, na dobu 4 let od 1.11.2024 AG AGROPRIM, s.r.o., IČO 256 49 213, Netvořice č.p. 300, 257 44 Netvořice.",
  "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a umístění stavby č. IV-12-6035207 na pozemcích parc. č. 2053/5, 1956/68, 2053/8 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 11 300,- Kč na umístění zařízení distribuční soustavy – kabelové vedení.",
  "uzavření Dodatku č.1 ke Smlouvě o budoucí smlouvě o zřízení věcného břemene a dohodě o umístění stavby č. IV-12-6034244/VB/6 na pozemcích parc. č. 1972/1, 1977 a 35 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou na umístění zařízení distribuční soustavy – kabelové vedení a podpěrný bod – betonový sloup.",
  "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6035376/VB/1 K_BN-KRHANICE-KNN-PARC.Č. 132/9 na pozemku parc.č. 132/5 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 2 000,- Kč na umístění zařízení distribuční soustavy – kabelové vedení.",
  "uzavření Smlouvy o věcném břemeni – služebnosti pro kabely veřejného osvětlení na pozemcích parc.č. 100/3 a 1439/9 k.ú. Krhanice za cenu 6.000,- Kč s vlastníky pozemku (strana povinná) Ing. Š.S.,Praha a L.S.,Praha. Vklad na katastrálním úřadě bude hradit Obec Krhanice jako strana oprávněná.",
  "tyto body usnesení týkající se pořízení Zprávy o uplatňování územního plánu Krhanice\nI. Zastupitelstvo obce rozhodlo o pořízení zprávy o uplatňování územního plánu Krhanice;\nII. Zastupitelstvo obce schvaluje\na) pořízení zprávy o uplatňování územního plánu Krhanice prostřednictvím Obecního úřadu Krhanice postupem podle § 46 odst. 2, písm. c) zákona č. 283/2021 Sb., stavební zákon, v platném znění,\nb) uzavření smlouvy s osobou splňující předpoklady pro výkon územně plánovací činnosti Pavlou Bechyňovou,\nc) uzavření smlouvy s projektantem Ing. arch. Zuzanou Hrochovou, ČKA 00 773, na technickou pomoc při zpracování zprávy;\nIV. Zastupitelstvo obce určilo\nMgr. Aleše Papouška, člena zastupitelstva obce, který bude spolupracovat s pořizovatelem při pořizování územně plánovací dokumentace pro zbytek volebního období;\nV. Zastupitelstvo obce pověřilo starostu obce\na) zajistit naplnění požadavku vyplývajícího z ustanovení § 47 odst. 1 stavebního zákona,\nb) uzavřením smluv s Ing. arch Zuzanou Hrochovou a po obdržení potvrzení dle bodu a) se zástupcem pořizovatele, Pavlou Bechyňovou,\nc) předat po obdržení potvrzení zástupci pořizovatele podněty na změny územního plánu uložené v zásobníku žádostí od vydání změny č. 1 a další podněty obce.",
  "uzavření Smlouvy o dílo na pořízení zprávy o uplatňování územního plánu pro obec Krhanice s Pavlou Bechyňovou, IČO: 70789444, Pražského povstání 2266, 256 01 Benešov.",
  "uzavření Smlouvy o dílo na technickou pomoc při zpracování Zprávy o uplatňování Územního plánu Krhanice s Ing. arch. Zuzanou Hrochovou, IČO: 47147334, Matoušova 18, 150 00 Praha 5.",
  "záměr vstupu obce Krhanice do dobrovolného svazku obcí Společná voda d.s.o., IČO: 17408288, se sídlem Černoleská 1600, 256 01 Benešov, a to na základě Smlouvy o fúzi sloučením svazků Posázavský vodovod – dobrovolný svazek obcí, IČO: 14117223, se sídlem Masarykovo náměstí 194, 254 01 Jílové u Prahy a Společná voda d.s.o., IČO:17408288, se sídlem Černoleská 1600, 256 01 Benešov k rozhodnému dni.",
  "uzavření Dodatku č. 1 k Nájemní smlouvě ze dne 21.1.1999 s Vodohospodářská společnost Benešov a.s., IČO: 47535865, se sídlem Černoleská 1600, 256 01 Benešov.",
  "poskytnutí finančních prostředků v rámci ostatní správy v oblasti hospodářských opatření pro krizové stavy takto: 20.000,- Kč jednotlivě\npro obec Bohdíkov, IČO: 00302376, se sídlem Bohdíkov 163, 789 64 Bohdíkov;\npro město Žulová, IČO: 00303682, se sídlem Hlavní 36, 790 65 Žulová;\npro obec Brantice, IČO: 00295884, se sídlem Brantice 121, 793 93 Brantice\na pro město Vidnava, IČO: 00303585, se sídlem Mírové náměstí 80, 790 55 Vidnava.",
  "rozpočtové opatření obce Krhanice č. 9/2024.",
  "uzavření Dodatku č. 1 ke smlouvě o dílo č. SoD/02/2024 ze dne 24.7.2024 na akci „Krhanice – chodník podél silnice III/1066 – 2.etapa“ s firmou Jaroslav Žaba, IČO: 86934431, Pecerady 69, 257 41 Týnec nad Sázavou na celkovou částku 1 215 648,01 Kč s DPH.",
  "Plán inventur 2024.",
  "složení Komise pro sestavení rozpočtu pro rok 2025: Aleš Papoušek, Jana Laboutková, Petr Dub, Alena Kratochvílová, Markéta Vaňková a Jana Cachová.",
];

const naVedomi = [
  "Zápis z jednání Kontrolního výboru Zastupitelstva obce Krhanice dne 2.9.2024.",
  "rozpočtové opatření č. 7/2024 a č. 8/2024.",
  "získání dotace ve výši 450 tisíc Kč na nový dopravní automobil od Ministerstva vnitra ČR pro JSDHO Krhanice.",
];

const poveruje = [
  "starostu k zajištění činností směřujících ke vstupu obce Krhanice do dobrovolného svazku obcí Společná voda d.s.o., IČO:17408288, se sídlem Černoleská 1600, 256 01 Benešov",
  "starostu obce uzavřením a podpisem Dodatku č. 1 ke smlouvě o dílo č. SoD/03/2024 ze dne 2.4.2024 na akci „Krhanice – chodník podél silnice III/1066 – 2.etapa“ s firmou Jaroslav Žaba, IČO 86934431, Pecerady 69, 257 41 Týnec nad Sázavou",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "4",
    rok: "2024",
    isoDate: "2024-09-24",
    dateLabel: "24. 9. 2024",
    fullDateDot: "24.9.2024",
    pdfPath: "scripts/zapisy-pdf/usneseni-2024-4.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice bere na vědomí", items: naVedomi },
      { heading: "Zastupitelstvo obce Krhanice pověřuje", items: poveruje },
    ],
  });
  console.log(
    "OK", r.docId, "blocks", r.blocks,
    "| schvaluje", schvaluje.length,
    "naVedomi", naVedomi.length,
    "poveruje", poveruje.length,
  );
}
run().catch((e) => { console.error(e); process.exit(1); });
