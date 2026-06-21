/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2022",
    isoDate: "2022-02-21",
    dateLabel: "21. 2. 2022",
    fullDateDot: "21.2.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-1.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Petr Dub, Václav Zíta.",
          "bere na vědomí a schvaluje rozpočtové opatření č. 10/2021.",
          "rozpočtové opatření č. 1/2022.",
          "podání žádosti o dotaci na Středočeský kraj v rámci programu Program 2022 pro poskytování dotací z rozpočtu Středočeského kraje ze Středočeského Infrastrukturního fondu v rámci Tematického zadání Drobné vodohospodářské projekty pro projekt Rekonstrukce hlavního vodovodního přivaděče do obce Krhanice a souhlasí s podmínkami dotace a finanční spoluúčastí obce.",
          "pronajmout část pozemku parc.č. 224/4 k.ú. Krhanice o výměře 1 m² od 1.3.2022 do 28.2.2026 za cenu 1,- Kč/1 m²/rok za účelem propagace činnosti Unie rodičů ZŠ Krhanice, z.s., Krhanice 149, 257 42 Krhanice, IČO: 22877177.",
          "uzavření smlouvy o zřízení věcného břemene – uložení vodovodní přípojky pro pozemek parc.č. 127/7 k.ú. Krhanice na pozemcích parc.č. 128/9 a 127/8 Krhanice na dobu neurčitou za cenu 6.000,- Kč s M.V., Týnec nad Sázavou.",
          "odkoupení pozemku parc.č. 109/13 k.ú. Krhanice, který vznikne oddělením z pozemku parc.č. 109/8 k.ú. Krhanice na základě geometrického plánu č. 1040-22969/2020 o výměře 103 m² za cenu 450,- Kč/1 m² od A.K., Krhanice.",
          "vzdání se předkupního práva ke koupi nemovitosti Krhanice č. ev. 34 na pozemku parc.č. st.p. 474 k.ú. Krhanice ve vlastnictví obce Krhanice.",
          "bezúplatný převod majetku (Renault Trafic a VW Transporter) pro JSDHO Krhanice od Ministerstva vnitra České republiky, se sídlem Nad Štolou 936/3, 170 34 Praha 7, zastoupeného Správou logistického zabezpečení Policejního prezidia ČR.",
          "Podmínky krátkodobého jednorázového pronájmu klubovny zázemí víceúčelového hřiště.",
          "investiční záměr realizace akce Rekonstrukci hrobu rudoarmějců na hřbitově v Krhanicích při podání žádosti o dotaci na Rekonstrukci hrobu rudoarmějců na hřbitově v Krhanicích z programu 107290 – Zachování a obnova historických hodnot I, Česká republika – Ministerstvo obrany v rámci IV. Výzvy k podání žádosti o dotaci na zabezpečení péče o válečné hroby (čj. MO 278239/2021-7460).",
          "Inventarizační zprávu obce Krhanice za rok 2021.",
          "rozpočet Posázavského vodovodu – dobrovolného svazku obcí, Masarykovo náměstí 194,254 01 Jílové u Prahy, IČ: 14117223 pro rok 2022, jako přebytkový.",
          "Střednědobý výhled rozpočtu 2023-2025 Posázavského vodovodu – dobrovolného svazku obcí, Masarykovo náměstí 194,254 01 Jílové u Prahy, IČ: 14117223.",
          "bere na vědomí a souhlasí s účastí obce Krhanice v rámci aktivní politiky zaměstnanosti (veřejně prospěšné práce).",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu kontrolního výboru ze dne 22.12.2022.",
          "Zprávu o poskytování informací podle zákona č.10611999 Sb., o svobodném přístupu k informacím za rok 2021.",
          "Zprávu Obecní knihovny Krhanice za rok 2021.",
          "kontrolu hospodaření s veřejnými prostředky z poskytnuté dotace na akci Zázemí víceúčelového hřiště Krhanice ze strany Středočeského kraje s výsledkem – bez zjištěných nedostatků.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
