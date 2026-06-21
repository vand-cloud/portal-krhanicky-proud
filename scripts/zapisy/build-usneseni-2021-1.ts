/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "1",
    rok: "2021",
    isoDate: "2021-03-17",
    dateLabel: "17. 3. 2021",
    fullDateDot: "17.3.2021",
    pdfPath: "scripts/zapisy-pdf/usneseni-2021-1.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "program zasedání zastupitelstva obce.",
          "návrhovou komisi ve složení Jaroslav Mixa, Petr Dub.",
          "ověřovatele zápisu Tomáš Kratochvíl, Martin Jiřička.",
          "bere na vědomí a schvaluje rozpočtové opatření č. 1/2021.",
          "navýšení provozního příspěvku Mateřské škole Krhanice o 30.000,- Kč na nákup počítače s operačním systémem Windows 10 Pro a Office 2019.",
          "rozpočtové opatření č. 2/2021.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IP-12-6019047/VB/2, Krhanice-kNN-č.parc. 277/2 na pozemcích parc. č. 326/2 a 1979/3 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 6.000,- Kč na umístění kabelového vedení NN.",
          "prodej pozemku parc.č. 312/1 k.ú. Krhanice o výměře 84 m2 za cenu 500 Kč/1 m2 J. Š., Krhanice. Náklady na vklad do katastru nemovitostí hradí kupující.",
          "pronájem části pozemku st. p. 675 k.ú. Krhanice o výměře 17,5 m2 k umístění plechové garáže k podnikání za cenu 20 Kč/m2/rok od 1.9.2021 na dobu 10 let J.M., Krhanice.",
          "uzavření Smlouvy o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6027954/VB/016, Krhanice-kNN-p.č.272/11,10,6,5 na pozemcích parc. č. 1981/1, 272/11 k.ú. Krhanice s ČEZ Distribuce, a.s., IČ 24729035, DIČ CZ24729035, se sídlem Děčín IV-Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 26.700,- Kč na umístění kabelového vedení NN.",
          "prodej oddělené části 1972/10 o výměře 6 m2 z pozemku parc. č. 1972/1 k.ú. Krhanice, která vznikne na základě geometrického plánu č. 926-46/2018 za cenu 500 Kč/1 m2 J. a P.B. Krhanice. Náklady na vklad do katastru nemovitostí hradí kupující.",
          "prodej poměrné části stavebního pozemku st.p. 674 k.ú. Krhanice včetně souvisejících nebytových prostor na pozemku st.p. 674 k.ú. Krhanice:\npoměr 16,67% za cenu 17206 Kč (pozemek 7150 Kč, stavba 10056 Kč) – J.M. Krhanice\npoměr 16,67% za cenu 17206 Kč (pozemek 7150 Kč, stavba 10056 Kč) – J.M., Krhanice\npoměr 16,67% za cenu 14128 Kč (pozemek 7150 Kč, stavba 6978 Kč) – V.S., Týnec nad Sázavou\npoměr 16,67% za cenu 14128 Kč (pozemek 7150 Kč, stavba 6978 Kč) – D.M., Krhanice",
          "prodej poměrné části stavebního pozemku st.p. 676 k.ú. Krhanice včetně souvisejících nebytových prostor na pozemku st.p. 676 k.ú. Krhanice:\npoměr 24,49% za cenu 9371 Kč (pozemek 5460 Kč, stavba 3911 Kč) – F.B., Krhanice\npoměr 23,76% za cenu 9092 Kč (pozemek 5298 Kč, stavba 3794 Kč) – J.S., Krhanice\npoměr 25,60% za cenu 9796 Kč (pozemek 5708 Kč, stavba 4088 Kč) – D.R., Krhanice\npoměr 26,15% za cenu 10006 Kč (pozemek 5830 Kč, stavba 4176 Kč) – Z.K., Krhanice",
          "koupi pozemku parc.č. 148/6 k.ú. Krhanice o výměře 660 m2 za cenu 55 Kč/1 m2 od B.K. a J.K., Krhanice. Náklady na vklad do katastru nemovitostí hradí kupující.",
          "záměr koupit část pozemku parc.č. 148/32 k.ú. Krhanice o výměře cca 260 m2 za cenu 55 Kč/1 m2 od B.K. a J.K., Krhanice. Náklady na zhotovení geometrického plánu na dělení a náklady na vklad do katastru nemovitostí hradí kupující.",
          "koupi pozemku parc.č. 148/45 k.ú. Krhanice o výměře 295 m2 za cenu 55 Kč/1 m2 od J.D., Praha. Náklady na vklad do katastru nemovitostí hradí kupující.",
          "oddělené části z pozemku 1435/42 k.ú. Krhanice díl a o výměře 42 m2, který vznikne na základě geometrického plánu č. 1036-5065/2020 za cenu 500 Kč/1 m2 od P.S., Kamenný Přívoz. Geometrický plán a náklady na vklad do katastru nemovitostí hradí kupující.",
          "záměr prodat oddělenou část z pozemku 346/2 k.ú. Krhanice o výměře cca 185 m2 za cenu 110 Kč/1 m2 a oddělenou část z pozemku 1881/1 k.ú. Krhanice o výměře cca 110 m2 za cenu 110 Kč/1m2, a to včetně inženýrských sítí. Po vyhotovení geometrického plánu bude záměr prodeje s konkrétními výměrami znovu projednán.",
          "bere na vědomí a schvaluje výroční zprávu za rok 2020 o činnosti v oblasti poskytování informací.",
          "Inventarizační zprávu obce Krhanice za rok 2020.",
          "podání žádosti o dotaci z Fondu sportu a volného času Středočeského kraje pro rok 2021 na rekonstrukci tréninkového hřiště před základní školou a souhlasí s podmínkami žádosti včetně finanční spoluúčasti.",
          "předběžný souhlas s umístěním lavičky na pozemku parc.č. 312/12 k.ú. Krhanice projektu „Lavičky do krajiny“ pro Aktivní Krhanice, z.s., IČO: 09017429, Krhanice 35, 257 42 Krhanice",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "akceptaci dotace Nové stromy na Sokolce v Krhanicích od Státní fond životního prostředí.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
