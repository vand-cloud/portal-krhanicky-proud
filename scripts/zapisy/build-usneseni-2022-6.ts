/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "6",
    rok: "2022",
    isoDate: "2022-11-07",
    dateLabel: "7. 11. 2022",
    fullDateDot: "7.11.2022",
    pdfPath: "scripts/zapisy-pdf/usneseni-2022-6.pdf",
    gdpr: "Z důvodu ochrany osobních údajů GDPR je dokument upraven.",
    sections: [
      {
        heading: "Zastupitelstvo obce Krhanice schvaluje",
        items: [
          "návrhovou komisi ve složení Jaroslav Mixa, Jana Laboutková.",
          "ověřovatele zápisu ve složení Martin Jiřička, Lucie Maršíková.",
          "program zasedání zastupitelstva obce.",
          "výše odměn neuvolněným členům zastupitelstva s platností od 8.11.2022:\nmístostarosta obce: 27 626 Kč, předseda finančního výboru: 2 167 Kč, předseda kontrolního výboru: 2 167 Kč, člen finančního výboru: 1 806 Kč, člen kontrolního výboru: 1 806 Kč, člen zastupitelstva: 1 083 Kč.",
          "přijetí dotace ve výši 1 000 000,- Kč z rozpočtu Středočeského kraje ze Středočeského Infrastrukturního fondu a uzavření veřejnoprávní smlouvy o poskytnutí dotace na realizaci projektu Rekonstrukce hlavního vodovodního přiváděče do obce Krhanice, ev. č. projektu ISF/DVP/047805/2022.",
          "uzavření smlouvy o dílo na akci Rekonstrukce hlavního vodovodního přiváděče do obce Krhanice s firmou LAROS s.r.o., Jana Nohy 1285, 256 01 Benešov, IČO: 49826514 ve výši 3 296 926,71 Kč.",
          "přijetí dotace ve výši 1 059 000,- Kč z rozpočtu Středočeského kraje ze Středočeského Fondu obnovy venkova a uzavření veřejnoprávní smlouvy o poskytnutí dotace na realizaci projektu Krhanice – rekonstrukce návsi a okolních chodníků, ev. č. projektu FRV/VEI/048181/2022.",
          "bere na vědomí a schvaluje rozpočtová opatření č. 6/2022 a 7/2022.",
          "uzavření Dodatku č. 1 Smlouvy o poskytnutí návratné finanční výpomoci z rozpočtu obce Krhanice schválené Zastupitelstvem obce Krhanice č. 4/2021 dne 13.9.2021 – změna termínu vrácení návratné finanční výpomoci ve výši 595.979,- Kč na datum 15.11.2022.",
          "investiční příspěvek ve výši 172.868,- Kč Základní škole Krhanice pro zajištění podílu školy pro dotaci z Programu rozvoje venkova pro pořízení tabulí s interaktivním systémem do kmenových učeben v roce 2022.",
          "navýšení provozního příspěvku Základní škole Krhanice o 41.420,- Kč.",
          "předložené odpisové plány na sestavy interaktivních tabulí Triptych pořízených v rámci dotace z Programu rozvoje venkova pro pořízení tabulí s interaktivním systémem do kmenových učeben v roce 2022.",
          "rozpočtové opatření č. 8/2022.",
          "prodat pozemek parc.č. 1978/15 k.ú. Krhanice o výměře 79 m² , který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1m² K.B., Krhanice.",
          "prodat pozemek parc.č. 1978/16 k.ú. Krhanice o výměře 18 m² , který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1m² V.P., Krhanice.",
          "koupi pozemku parc.č. 2125 k.ú. Krhanice o výměře 20 m² , který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku st.p. 28 k.ú. Krhanice za cenu 30,- Kč/1m² .",
          "záměr prodeje části pozemku parc.č. 1972/1 k.ú. Krhanice o velikosti cca 80 m² za cenu 30,- Kč/1 m² . Geometrický plán na oddělení části pozemku a návrh na vklad do katastru nemovitostí by hradil budoucí kupující.",
          "pronajmout část pozemku parc.č. 132/1 k.ú. Krhanice o výměře 150 m² od 1.1.2023 do 31.12.2026 za cenu 10,- Kč/1 m² /rok za účelem dočasného zřízení zahrádky J. H., Praha.",
          "pronajmout část pozemku parc.č. 128/2 k.ú. Krhanice o výměře 36 m² od 1.1.2023 do 31.12.2026 za cenu 10,- Kč/1 m² /rok za účelem dočasného zřízení zahrádky Z.B., Praha.",
          "pronajmout pozemek parc.č. 59/1 k.ú. Krhanice o výměře 1223 m² od 1.1.2023 do 31.12.2023 za cenu 10,- Kč/1 m² /rok za účelem dočasného zřízení zahrádky J. a J. K. Praha.",
          "složení Komise pro sestavení rozpočtu pro rok 2023: Aleš Papoušek, Jana Laboutková, Bohuslav Kadeřábek, Petr Dub, Alena Kratochvílová a Jana Cachová.",
          "Plán inventur 2022.",
          "Likvidační a škodní komisi ve složení předseda – Tomáš Kratochvíl, členové – Jaroslav Mixa, Petr Dub.",
          "podpisová práva po dispozici k bankovním účtům obce pro Mgr. Aleše Papouška, Jaroslava Mixu, Bc. Petra Duba.",
          "že úředně stanovené místo pro provádění snatečních obřadů je katastrální území Krhanice, správní obvod Krhanice a bere na vědomí, že oddávat bude starosta obce Mgr. Aleš Papoušek, časově kdykoliv. Pro případ jeho nepřítomnosti je zastupující osobou pro provádění snatečních obřadů Jaroslav Mixa, místostarosta obce.",
          "Registraci akce a Rozhodnutí o poskytnutí dotace v rámci programu Ministerstva obrany č. 10729 – Zachování a obnova historických hodnot I, pro projekt Krhanice – rekonstrukce válečného hrobu obětí 2.světové války.",
          "navýšení ceny vodného na 63,70 Kč včetně DPH od 1.1.2023.",
          "Mgr. Aleše Papouška jako osobu jednající za obec Krhanice ve správní radě dobrovolného svazku obcí „Posázavský vodovod – dobrovolný svazek obcí“.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice bere na vědomí",
        items: [
          "Zprávu Kontrolního výboru ze dne 30.8.2022.",
        ],
      },
      {
        heading: "Zastupitelstvo obce Krhanice pověřuje",
        items: [
          "starostu obce uzavřením a podpisem smlouvy o dílo na akci Rekonstrukce hlavního vodovodního přiváděče do obce Krhanice s firmou LAROS s.r.o., Jana Nohy 1285, 256 01 Benešov, IČO: 49826514.",
          "starostu obce podpisem Registraci akce a Rozhodnutí o poskytnutí dotace v rámci programu Ministerstva obrany č. 10729 – Zachování a obnova historických hodnot I, pro projekt Krhanice – rekonstrukce válečného hrobu obětí 2.světové války.",
          "starostu obce realizací výběrového řízení na projekt Krhanice – rekonstrukce válečného hrobu obětí 2.světové války ve spolupráci s Posázavím o.p.s., Zámek Jemniště 1, 257 01 Postupice, IČO: 27129772.",
        ],
      },
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
