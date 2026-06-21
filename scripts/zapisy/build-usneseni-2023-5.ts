/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "5",
    rok: "2023",
    isoDate: "2023-12-15",
    dateLabel: "15. 12. 2023",
    fullDateDot: "15.12.2023",
    pdfPath: "scripts/zapisy-pdf/usneseni-2023-5.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Petr Dub, Tomáš Kratochvíl.",
          "program zasedání zastupitelstva obce.",
          "Střednědobý výhled rozpočtu obce Krhanice na období 2023 – 2027.",
          "Rozpočet Fondu financování obnovy vodovodů obcí Krhanice a Prosečnice pro rok 2024 jako vyrovnaný.",
          "Přílohu Rozpočtu obce Krhanice na rok 2024.",
          "Rozpočet obce Krhanice na rok 2024 jako schodkový. Schodek bude hrazen finančními prostředky z minulých let.",
          "rozpočtové opatření č. 10/2023.",
          "obecně závaznou vyhlášku obce Krhanice, kterou se zrušuje Obecně závazná vyhláška obce Krhanice č. 6/2023 o stanovení místního koeficientu pro výpočet daně z nemovitých věcí, ze dne 15.6.2023.",
          "Obecně závaznou vyhlášku obce Krhanice o místním poplatku ze psů.",
          "Obecně závaznou vyhlášku obce Krhanice o místním poplatku ze vstupného.",
          "Obecně závaznou vyhlášku obce Krhanice o místním poplatku za užívání veřejného prostranství",
          "Obecně závaznou vyhlášku obce Krhanice o místním poplatku za obecní systém odpadového hospodářství",
          "pronajmout část pozemku parc. č. 59/1 k.ú. Krhanice o výměře 1206 m² ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m²/rok od 1.1.2024 do 31.12.2024 J. a J.K., Praha.",
          "pronajmout část pozemku parc. č. 1957/5 k.ú. Krhanice o výměře 170 m² ke zřízení dočasné zahrádky za cenu 10,- Kč/1 m²/rok od 1.1.2024 na dobu 4 let A.Ch., Praha.",
          "pronajmout část pozemku parc. č. 502 k.ú. Krhanice a část pozemku parc.č. 498 k.ú. Krhanice o výměře 2.700 m² od 21.12.2023 na dobu 4 let, a to k chovu ryb za účelem vsazení do řeky Sázavy za cenu 1,- Kč/1 m²/rok Českému rybářskému svazu, z.s., místní organizaci Týnec nad Sázavou, IČO: 45064296, K Náklí 404, 257 41 Týnec nad Sázavou.",
          "uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6034250/VB/2 BN-Krhanice-KNN-parc.č. 152/3,2 na pozemcích parc. č. 142/28 k.ú. Krhanice a parc. č. 148/18 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 9 300 Kč na umístění zařízení kabelového vedení.",
          "uzavření Smlouvy o právu o provedení stavby pro projekt Tůně u Gabčíkova v Krhanicích se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429.",
          "uzavření Pojistné smlouvy č. 0111115018 náhrada PS č. 0007419015 s Hasičskou vzájemnou pojišťovnou, a.s., IČO: 46973451, se sídlem Praha 2, Římská 45, 120 00, Česká republika",
          "a souhlasí se vznikem pracovněprávních vztahů mezi obcí a členem zastupitelstva obce s platností od 1.1.2024 do 31.12.2024, a to oblast Činnosti knihovnické: Bc. Petr Dub. Dohody budou uzavírány v průběhu roku 2024 dle konkrétních potřeb obce.",
          "uzavření smlouvy o dílo na akci Krhanice – rekonstrukce veřejného osvětlení s firmou Yunex, s.r.o., IČO: 09962638, se sídlem V parku 2308/8, 148 00 Praha 11 – Chodov na celkovou částku 2.592.256 Kč s DPH.",
          "Dodatek č. 14 k Příloze č. 1 Knihovního řádu Obecní knihovny Krhanice Výpůjční řád.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "že Rozpočet Bene-Bus dobrovolný svazek obcí na rok 2024 je přebytkový a bere na vědomí Střednědobý výhled rozpočtu Bene-Bus dobrovolný svazek obcí na období 2025-2027.",
          "že Rozpočet 2024 Týnecko-svazek obcí je vyrovnaný a bere na vědomí Střednědobý výhled rozpočtu na období 2023-2026.",
          "že Rozpočet 2024 Posázavský vodovod – dobrovolný svazek obcí je schodkový a bude kryt finančními prostředky z minulých let, bere na vědomí Střednědobý výhled rozpočtu Posázavský vodovod – dobrovolný svazek obcí na období 2024-2027 a bere na vědomí Rozpočtové opatření č. 3/2023.",
          "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice v roce 2023 ze dne 30.10.2023.",
          "zprávu finančního výboru o kontrole hospodaření obce Krhanice v roce 2023\nze dne 30.10.2023.",
          ", že spolek Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429 provedl na základě výzvy poskytovatele dotace Obce Krhanice vratku neoprávněně čerpané poměrné části poskytnuté dotace ve výši 6 250 Kč v souladu s uzavřenou veřejnoprávní smlouvou DOTAKCE/2023/04 Aktivní Krhanice – Letní kino 2023–2 produkce v souvislosti s neuskutečněním konání jedné produkce letního kina.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením a podpisem smlouvy o dílo na akci Krhanice – rekonstrukce veřejného osvětlení s firmou Yunex, s.r.o., IČO: 09962638, se sídlem V parku 2308/8, 148 00 Praha 11 – Chodov.",
          "starostu obce realizací výběrového řízení na projekt „Krhanice - chodník podél silnice III/1066“ ve spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO 27129772.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
