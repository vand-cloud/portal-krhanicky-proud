/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
  "ověřovatele zápisu ve složení Petr Dub, Tomáš Kratochvíl.",
  "program zasedání zastupitelstva obce.",
  "rozpočtové opatření č. 9/2022.",
  "Střednědobý výhled rozpočtu obce Krhanice na období 2023 – 2026.",
  "Rozpočet Bene-Bus na rok 2023 jako přebytkový.",
  "Střednědobý výhled rozpočtu Bene-Bus na období 2024-2026.",
  "Rozpočet Týnecko-svazek obcí na rok 2023 jako vyrovnaný.",
  "Střednědobý výhled rozpočtu Týnecko-svazek obcí na období 2024-2025.",
  "Rozpočet Posázavský vodovod – dobrovolný svazek obcí na rok 2023 jako schodkový, schodek bude krytý finančními prostředky z minulých let.",
  "Rozpočet Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice pro rok 2023 jako schodkový, schodek bude krytý finančními prostředky z minulých let.",
  "Pravidla pro Občanský návrhový projektový rozpočet na rok 2023.",
  "Přílohu Rozpočtu obce Krhanice na rok 2023.",
  "Rozpočet obce Krhanice na rok 2023 včetně změny jako schodkový. Schodek bude hrazen finančními prostředky z minulých let a smluvně zabezpečenou půjčkou v souvislosti s projekty „Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice“ a „Pořízení centrální vzduchotechniky do ZŠ Krhanice“.",
  "prodej dílu „a“ z pozemku parc.č. 346/2 k.ú. Krhanice o výměře 176 m² dle geometrického plánu č. 1065-139/2021 za cenu 110,- Kč/1 m² firmě NATY TERRA, s. r. o., IČO: 09462741, Žitavského 1178, 156 00  Praha 5 - Zbraslav.",
  "prodej dílu „b“ z pozemku parc.č. 1981/1 k.ú. Krhanice o výměře 85 m² dle geometrického plánu č. 1065-139/2021 za cenu 110,- Kč/1 m² firmě NATY TERRA, s. r. o., IČO: 09462741, Žitavského 1178, 156 00  Praha 5 - Zbraslav.",
  "prodej pozemku parc.č. 1985/5 k.ú. Krhanice o výměře 77 m² a pozemku parc.č. 132/9 k.ú. Krhanice o výměře 60 m² za cenu 900,- Kč/1 m² O.P. a V.P., Krhanice.",
  "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 272/7 k.ú. Krhanice na pozemku parc.č. 1981/1 k.ú. Krhanice dle geometrického plánu č. 1100-140/2022 na dobu neurčitou za cenu 3.000,- Kč s Bc. T. R.,  Praha.",
  "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 272/7 k.ú. Krhanice na pozemku parc.č. 1981/1 k.ú. Krhanice dle geometrického plánu č. 1099-139/2022 na dobu neurčitou za cenu 3.000,- Kč s Ing. M. H., Libiš.",
  "prodej pozemku parc. č. 224/95 k.ú. Krhanice o výměře 20 m², který vznikne dle geometrického plánu č. 1104-150/2022 oddělením z pozemku parc. č. 224/65 za cenu 500,- Kč/1 m² S.V. a J.V., Krhanice.",
  "a souhlasí se vznikem pracovněprávních vztahů mezi obcí a členem zastupitelstva obce s platností od 1.1.2023 do 31.12.2023, a to oblast Činnosti knihovnické: Bc. Petr Dub. Dohody budou uzavírány v průběhu roku 2023 dle konkrétních potřeb obce.",
  "Dodatek č. 13 k Příloze č. 1 Knihovního řádu Obecní knihovny Krhanice Výpůjční řád.",
  "uzavření Smlouvy o zřízení části pozemní komunikace na pozemku parc.č. st. 42/3 a parc.č. 1980 k.ú. Krhanice.",
];

const naVedomi = [
  "zprávu finančního výboru o kontrole hospodaření obce Krhanice v roce 2022 ze dne 16.11.2022.",
  "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice v roce 2022 ze dne 16.11.2022 a 24.11.2022.",
  "Zápis z dílčího přezkoumání hospodaření obce ze dne 1.12.2022.",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "7",
    rok: "2022",
    isoDate: "2022-12-22",
    dateLabel: "22. 12. 2022",
    fullDateDot: "22.12.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-7.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice bere na vědomí", items: naVedomi },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks, "| schvaluje", schvaluje.length, "naVedomi", naVedomi.length);
}
run().catch((e) => { console.error(e); process.exit(1); });
