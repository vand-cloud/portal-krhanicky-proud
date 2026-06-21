/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2026",
    isoDate: "2026-03-09",
    dateLabel: "9. 3. 2026",
    fullDateDot: "9.3.2026",
    pdfPath: "scripts/zapisy-pdf/usneseni-2026-1.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení: Jana Laboutková, Jaroslav Mixa.",
          "ověřovatele zápisu ve složení Martin Jiřička, Petr Dub.",
          "program zasedání zastupitelstva obce.",
          "navýšení provozního příspěvku Základní škole Krhanice ve výši 44 500 Kč (na odpisy nového majetku).",
          "přijetí nadačního příspěvku ve výši 175 614 Kč na účely požární ochrany, tělovýchovné a sportovní, ochrany životního prostředí nebo prevence a odstraňování živelních a jiných pohrom, tj. na nákup defibrilátoru, zásahových obleků, obuvi, rukavic, přileb, svítilen, batohu s vybavením na lesní požáry, plovoucího sacího koše a hadic k využití jednotkou sboru dobrovolných hasičů zřizovanou obcí Krhanice a schvaluje uzavření Smlouvy o poskytnutí nadačního příspěvku s CSG NADAČNÍ FOND, IČO 23000791, U Rustonky 714/1, Karlín, 186 00 Praha 8.",
          "rozpočtové opatření č. 1/2026.",
          "Obecně závaznou vyhlášku obce Krhanice o nočním klidu.",
          "pronájem části pozemku parc. č. 312/8 k.ú. Krhanice o výměře 18 m2 pro umístění vozíku za auto za cenu 15,- Kč/1 m2/rok od 1.3.2026 do 28.2.2030 s P.P., Krhanice.",
          "zřídit věcné břemeno kabelového vedení NN a uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6039549/VB/3 na pozemku parc.č. 1942/14 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 14 300,- Kč na umístění zařízení distribuční soustavy – kabelové vedení NN.",
          "zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/2 k.ú. Krhanice s M.V., Chrást nad Sázavou.",
          "zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3 000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/3 k.ú. Krhanice s M. V., Chrást nad Sázavou.",
          "uzavření Plánovací smlouvy s firmou Domicon s.r.o., IČO: 23401737, se sídlem Primátorská 296/38, Libeň, 180 00 Praha 8.",
          "uzavření Smlouvy o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové na částku 712 116,19 Kč včetně DPH.",
          "uzavření Smlouvy o dílo č. SoD/02/2026 Přístavba Mateřské školy Krhanice s firmou PRO-REKO, s.r.o., IČO: 21058750, se sídlem Stříbrná Lhota 698, 252 10 Mníšek pod Brdy na částku 3 127 530,12 Kč včetně DPH.",
          "uzavření Dodatku č. 1 Smlouvy o výpůjčce č. SoV/01/2024 se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429.",
          "uzavření Smlouvy o dílo č. SoD/03/2026 pro akci „Krhanice – kanalizace a ČOV I.etapa“ s firmou PROJEKTY VODAM s.r.o., IČO: 26821443, se sídlem Galašova 158, 753 01 Hranice na částku 3 956 700,- Kč včetně DPH.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu kontrolního výboru ze dne 15.12.2025.",
          "Inventarizační zprávu obce Krhanice za rok 2025.",
          "Zprávu o uplatňování Územního plánu Krhanice za uplynulé období 10/2019 – 01/2026.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce podpisem Plánovací smlouvy s firmou Domicon s.r.o., IČO: 23401737, se sídlem Primátorská 296/38, Libeň, 180 00 Praha 8.",
          "starostu obce podpisem Smlouvy o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové.",
          "starostu obce podpisem Smlouvy o dílo č. SoD/02/2026 Přístavba Mateřské školy Krhanice s firmou PRO-REKO, s.r.o., IČO: 21058750, se sídlem Stříbrná Lhota 698, 252 10 Mníšek pod Brdy.",
          "starostu obce podpisem Dodatku č. 1 Smlouvy o výpůjčce č. SoV/01/2024 se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429.",
          "starostu obce podpisem uzavření Smlouvy o dílo č. SoD/03/2026 pro akci „Krhanice – kanalizace a ČOV I.etapa“ s firmou PROJEKTY VODAM s.r.o., IČO: 26821443, se sídlem Galašova 158, 753 01 Hranice.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
