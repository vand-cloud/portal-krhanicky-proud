/* eslint-disable no-console */
// Faithful transcript of Usnesení č. 5/2025 (19.11.2025), transcribed visually
// from the official PDF (2 pages). Sections by action verb: schvaluje (14),
// bere na vědomí (10), ověřuje (1). GDPR note present. Signatures /
// Vyvěšeno-Sejmuto omitted.
import { publishUsneseni } from "../usneseni-lib";

const schvaluje = [
  "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
  "ověřovatele zápisu ve složení Petr Dub, Martin Jiřička.",
  "program zasedání zastupitelstva obce.",
  "uzavření Darovací smlouvy s organizací Česká republika – Hasičský záchranný sbor Středočeského kraje, IČO 70885371, se sídlem Jana Palacha 1970, 272 01 Kladno na poskytnutí finančního daru ve výši 14 400 Kč na spolufinancování nákupu „Zkušební zařízení pro zkoušky funkčnosti a těsnosti prostředků chemické služby – územní odbor Kladno, stanice HZS Jílové u Prahy“.",
  "poskytnutí investičního příspěvku na nákup konvektomatu s příslušenstvím do příspěvkové organizace Základní škola Krhanice – středisko Školní jídelna ve výši 265 000,- Kč.",
  "rozpočtové opatření č. 6/2025.",
  "prodej části pozemku parc.č. 1985/1 Krhanice o výměře 2 m² – díl a dle geometrického plánu č. 1230-113/2025 za cenu za cenu 1000,- Kč/1 m² M.P., Krhanice.",
  "prodej pozemku parc.č. 312/47 k.ú. Krhanice o výměře 68 m² za cenu 500,- Kč/1 m² L.B, Krhanice.",
  "uzavření Smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek 313/14 k.ú. Krhanice na pozemku parc.č. 313/32 k.ú. Krhanice dle geometrického plánu č. 1294-272/2025 na dobu neurčitou za cenu 3 000,- Kč s K.K, Krhanice.",
  "uzavření Smlouvy o zrušení služebnosti: zrušení věcného břemene chůze a jízdy ve prospěch pozemku parc. č. 244/10 k.ú. Krhanice k tíži pozemku č. parc. 244/5 k.ú. Krhanice pro Oprávněnou stranu z věcného břemene Obec Krhanice a Povinnou stranu z věcného břemene J.T., Chrást nad Sázavou.",
  "uzavření Dohody o zrušení věcného břemene chůze a jízdy: zrušení věcného břemene chůze a jízdy ve prospěch pozemku parc. č. 102/18 k tíži pozemku č. parc. 102/20, 102/38, 102/7 a 87/6 k.ú. Krhanice pro Povinnou stranu z věcného břemene Obec Krhanice a Oprávněnou stranu z věcného břemene J.G., Krhanice.",
  "ZO schvaluje:\nI. souhlas s fúzí svazku Vodovodní přivaděč Javorník – Benešov, dobrovolný svazek obcí, IČO: 02468085, se sídlem: Masarykovo náměstí 100, 256 01 Benešov, sloučením se svazkem Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov, s tím, že zanikající svazek ke dni 1. 1. 2026 zanikne bez likvidace,\nII. návrh smlouvy o fúzi svazku Vodovodní přivaděč Javorník – Benešov, dobrovolný svazek obcí, IČO: 02468085, se sídlem: Masarykovo náměstí 100, 256 01 Benešov, sloučením se svazkem Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov, s rozhodným dnem 1. 1. 2026.",
  "Výpověď smlouvy o poskytování odborné pomoci knihovnám v rámci zajišťování plnění regionálních funkcí a jeho koordinace Středočeským krajem ze dne 09.08.2006 číslo 368/KUL/2006.",
  "uzavření Smlouvy o poskytování služeb v rámci výkonu regionálních funkcí knihoven pro základní knihovnu č. BN/042/2025 (pro Obecní knihovnu Krhanice).",
];

const naVedomi = [
  "Zprávu Kontrolního výboru ze dne 29.9.2025.",
  "zprávu Finančního výboru o kontrole hospodaření obce Krhanice za období leden – září 2025 ze dne 3.11.2025",
  "protokoly o průběhu a výsledcích veřejnosprávních kontrol příspěvkových organizací Základní škola Krhanice a Mateřská škola Krhanice za období leden–září 2025 ze dne 3.11.2025.",
  "Rozpočtové opatření č. 5/2025.",
  "Rozpočtové opatření č. 2 k SR na rok 2025 DSO BENE-BUS.",
  "Rozpočtové opatření č. 4/2025 a 5/2025 Společná voda d.s.o.",
  "cenu vodného od 1.1.2026 ve výši 84,07 Kč s DPH/1 m³.",
  "že Rozpočet Bene-Bus dobrovolný svazek obcí na rok 2026 je schodkový a schodek rozpočtu bude financován z finančních prostředků minulých let a bere na vědomí Střednědobý výhled rozpočtu Bene-Bus dobrovolný svazek obcí na období 2027-2029.",
  "že Rozpočet Společná voda d.s.o. na rok 2026 je schodkový a schodek rozpočtu bude financován z finančních prostředků minulých let a bere na vědomí Střednědobý výhled rozpočtu Společná voda d.s.o. na období 2027-2029.",
  "že Rozpočet Týnecko-svazek obcí na rok 2026 je vyrovnaný a bere na vědomí Střednědobý výhled rozpočtu na rok 2027-2028 Týnecko-svazek obcí.",
];

const overuje = [
  "starostu obce zabezpečit provedení potřebných úkonů vedoucích k realizaci částí I. až II. usnesení o fúzí svazku Vodovodní přivaděč Javorník – Benešov, dobrovolný svazek obcí, IČO: 02468085, se sídlem: Masarykovo náměstí 100, 256 01 Benešov, sloučením se svazkem Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov, zejména hlasovat na valné hromadě nástupnického svazku Společná voda d.s.o., IČO: 17408288, se sídlem: Černoleská 1600, 256 01 Benešov, pro plánovanou fúzi sloučením, podepsat všechny potřebné dohody a smlouvy. Starosta je oprávněn ve stejném rozsahu na základě písemné plné moci zmocnit další osobu k těmto úkonům v případě jeho nepřítomnosti.",
];

async function run() {
  const r = await publishUsneseni({
    cislo: "5",
    rok: "2025",
    isoDate: "2025-11-19",
    dateLabel: "19. 11. 2025",
    fullDateDot: "19.11.2025",
    pdfPath: "scripts/zapisy-pdf/usneseni-2025-5.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: schvaluje },
      { heading: "Zastupitelstvo obce Krhanice bere na vědomí", items: naVedomi },
      { heading: "Zastupitelstvo obce Krhanice ověřuje", items: overuje },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks, "| schvaluje", schvaluje.length, "naVedomi", naVedomi.length, "overuje", overuje.length);
}
run().catch((e) => { console.error(e); process.exit(1); });
