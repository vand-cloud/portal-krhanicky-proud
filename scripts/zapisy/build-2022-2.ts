/* eslint-disable no-console */
// Faithful visual transcript of Zápis č. 2/2022 (11.3.2022), transcribed from
// the official PDF pages as images. Structure per scripts/build-zapis-2026-1.ts.
import { h3, h4, h5, p, vote, nl, ul, publishZapis, type Block } from "../zapis-lib";

const V7 = "PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 0 )";

const transcript: Block[] = [
  h4("Přítomni"),
  p("Aleš Papoušek, Tomáš Kratochvíl, Petr Dub, Martin Jiřička, Jana Laboutková, Edita Jarošová, Bohuslav Kadeřábek"),
  h4("Omluveni"),
  p("Jaroslav Mixa, Václav Zíta"),

  h3("1) Zahájení, přivítání přítomných, konstatování přítomnosti"),
  p("Starosta konstatoval, že zasedání bylo svoláno dne 2.3.2022 bylo vyvěšeno na úřední desce obecního úřadu, tj. tedy nejméně 7 dní před zasedáním. Bylo tedy svoláno řádně a včas v souladu se zákonem o obcích v platném znění. Starosta konstatoval, že podle prezenční listiny je přítomno 7 členů zastupitelstva, tedy nadpoloviční většina členů zastupitelstva. K předchozímu zápisu nebyly vzneseny námitky."),
  h5("Určení zapisovatele"),
  p("Zápisem zasedání zastupitelstva obce byla pověřena Ing. Alena Kratochvílová."),
  p("Starosta přečetl program."),
  ...nl([
    "Zahájení",
    "Volba návrhové komise a ověřovatelů zápisu",
    "Pomoc Ukrajině od obce Krhanice",
    "Rozpočtové opatření",
    "Různé",
    "Diskuse",
  ]),
  h5("Návrh"),
  p("ZO schvaluje program zasedání zastupitelstva obce."),
  vote(V7),

  h3("2) Volba návrhové komise a ověřovatelů zápisu"),
  p("Starosta přednesl návrh návrhové komise a ověřovatelů zápisu."),
  h5("Návrh"),
  p("ZO schvaluje návrhovou komisi ve složení Petr Dub, Jana Laboutková."),
  h5("Návrh"),
  p("ZO schvaluje ověřovatele zápisu ve složení Bohuslav Kadeřábek, Martin Jiřička."),
  vote(V7),

  h3("3) Pomoc Ukrajině od obce Krhanice"),
  p("V souvislosti s válkou na Ukrajině se do naší obce dostali ukrajinští občané, kteří získali víza pro azyl a jsou ubytováni u našich občanů. Zastupitelé se rozhodli, že z obecního rozpočtu nebudou poskytnuty finanční prostředky různým celonárodním organizacím nebo Ukrajinské ambasádě. Po dohodě zastupitelů si každý zastupitel přispěje sám za sebe a zvolí si, komu chce finančně přispět. Což se už stalo."),
  p("Obec Krhanice v rozpočtu vyčlení částku 120.000,- Kč."),
  p("Pomoc bude poskytována ve formě finančních příspěvků ukrajinským občanům, kteří získali víza pro azyl na území naší obce (jsou ubytováni zejména u našich občanů). Termínově do 30.6.2022 a pomoc zahrnuje následující:"),
  ...nl([
    "obědy pro děti mateřské školy (včetně svačinek) a žáky základní školy ve školních jídelnách,",
    "školní pomůcky a věci dětem do mateřské školy – jednorázový příspěvek 500,- Kč,",
    "školní pomůcky a věci dětem do základní školy – jednorázový příspěvek 2000,- Kč,",
    "školné v mateřské škole a školné v družině v základní škole,",
    "jednorázová finanční částka 3 000,- Kč na osobu.",
  ]),
  p("Starosta poděkoval všem, kteří poskytují ubytování ukrajinským občanům vyhnaným válkou z jejich země."),
  h5("Rozprava"),
  p("Z.Bartoňková: Pokud by ukrajinské dítě jelo se školou na výlet, kdo to uhradí? Starosta: Podle konkrétní situace budeme řešit."),
  p("D.Nováková: Kde se dozvíme, že tady jsou ukrajinští občané ubytovaní a kolik jich je? Starosta: Obecní úřad takové informace zatím nezveřejňuje."),
  p("Z.Bartoňková: Pokud budou mít Ukrajinci např. nedostatek hygienických potřeb, na koho se mají obrátit. Starosta: Je třeba se obrátit na obecní úřad. Máme určené 2 osoby, které se tím zabývají (zaměstnankyně a zastupitelka)."),
  h5("Návrh"),
  p("ZO schvaluje pravidla pro poskytování humanitární pomoci na území obce Krhanice zahraničním uprchlíkům z Ukrajiny."),
  vote(V7),

  h3("4) Rozpočtové opatření"),
  h4("Rozpočtové opatření č. 2/2022"),
  ...ul([
    "Smlouva o poskytnutí podpory ze SFŽP ČR č. 19000735 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a Smlouva o poskytnutí podpory ze SFŽP ČR č. 19000745 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice",
  ]),
  p("Informace starosty: Jedná se o smlouvy na zápůjčky na obě dotace v základní škole. Jde o další krok. Minulé zastupitelstvo projednalo zřízení trvalých příkazů a souhlasů s inkasem pro SFŽP a nyní budou podepsány příslušné smlouvy."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000735 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a uzavření Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000745 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice."),
  vote(V7),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000735 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010073 Zateplení, výměna zdroje tepla v ZŠ v obci Krhanice a Smlouvy o poskytnutí podpory ze SFŽP ČR č. 19000745 pro projekt CZ.05.5.18/0.0/0.0/19_121/0010072 Pořízení centrální vzduchotechniky do ZŠ Krhanice."),
  vote(V7),
  p("Informace předsedy finančního výboru Bohuslava Kadeřábka o rozpočtovém opatření č. 2/2022."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje rozpočtové opatření č. 2/2022."),
  vote(V7),

  h3("5) Různé"),
  h4("Zpráva o výsledku přezkoumání hospodaření obce Krhanice"),
  p("Starosta seznámil se Zprávou o výsledku přezkoumání hospodaření obce ze dne 23.2.2022 s výsledkem nebyly zjištěny chyby a nedostatky – kontrolu provedl Krajský úřad Středočeského kraje, Odbor interního auditu a kontroly."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO bere na vědomí Zápis z celoročního přezkoumání hospodaření obce za rok 2021 ze dne 23.2.2022."),

  h4("Aktualizace cen pronájmů obecních pozemků a nebytových prostor pro občany"),
  p("Informace starosty: V pronájmech obecních pozemků a nebytových prostor jsme rozlišovali občany s trvalým pobytem a občany bez trvalého pobytu. Je to diskriminační. Musíme mít pro všechny stejné ceny. Proto aktualizujeme pronájmy a sjednocujeme ceny pro občany nezávisle na místě trvalého pobytu. Ostatní druhy pronájmu zůstávají beze změny."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje ceny za pronájmy obecních pozemků a nebytových prostor pro občany jako nájemce pro smlouvy uzavírané od 1.4.2022."),
  vote(V7),

  h4("Pořízení územní studie v ploše ZK10"),
  p("Informace starosty: Jedná se o územní studii na pozemku pod fotovoltaickou elektrárnou. Vlastník pozemku předložil studii zastavěnosti. Se studií se seznámili také zastupitelé. Vyjádřili s ní souhlas. U paní Bechyňové, pořizovatelky územního plánu Krhanice bylo ověřeno, že studie je v souladu s územním plánem. Studii bude pořizovat obec, ale financovat ji budou majitelé pozemku parc.č. 162 k.ú. Krhanice."),
  p("Pozemku p.č. 162, katastrální území: Krhanice, výměra: 13946 m², současné využití: orná půda, vlastníci: SJM Černý Tomáš a Černá Dana PhDr."),
  p("Pozemku p.č. 163, katastrální území: Krhanice, výměra: 5408 m², současné využití: orná půda, vlastníci: SJM Novotný Jaroslav a Novotná Alena"),
  p("Smlouva bude na: Černý Tomáš a Černá Dana PhDr., Jana Zajíce 2000, 258 01 Vlašim"),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("Zastupitelstvo obce Krhanice:"),
  p("I. Rozhodlo o pořízení územní studie v ploše ZK10, kde je zástavba ve vydaném územním plánu Krhanice podmíněna zpracováním územní studie. Vyznačení plochy je vymezeno v příloze tohoto usnesení."),
  p("II. Schválilo pořízení územní studie ve smyslu § 6 odst. 2 stavebního zákona fyzickou osobou oprávněnou pro výkon územně plánovací činnosti podle § 24 stavebního zákona."),
  p("III. Ukládá starostovi obce uzavřít smlouvu s fyzickou osobou oprávněnou k výkonu územně plánovací činnosti s Pavlou Bechyňovou, která tímto zajistí obecnímu úřadu splnění kvalifikačních požadavků pro výkon územně plánovací činnosti."),
  vote(V7),

  h3("6) Diskuse"),
  ...ul([
    "D.Nováková: Nabídla přítomným zajímavou výstavu v hotelu Sen – Výstava k výročí vystěhování obcí za 2.světové války mezi Sázavou a Vltavou.",
    "Starosta: Podal informace k Panské skále – výhled – dotaz z minulého zastupitelstva: Stromy nejblíže vyhlídce jsou zkroucené. Z vyhlídky je teď vidět. V delší vzdálenosti vadí 2 stromy, ale ty nikdo zkracovat nebude.",
    "Starosta: Informace k poslednímu odstřelu v lomu, kdy byl podstatně silnější než obvykle. Vysvětlil příčinu a návaznost na vznik místa pro novou drtičku. Proběhla diskuse bez přijetí závěru.",
    "Z.Bartoňková: Řešila se volnočasová aktivita ukrajinských dětí? Starosta: Neřešila a ani o tom neuvažujeme.",
  ]),

  h3("7) Usnesení a závěr"),
  p("Návrhová komise přečetla usnesení zastupitelstva obce."),
  vote(V7),
  p("Závěr: Zastupitelstvo obce bylo ukončeno v 17:25 hod."),

  p("Datum pořízení zápisu: 16.3.2022"),
  p("Ověřovatelé zápisu a starosta obce, podepsáno v listinné podobě."),
  h4("Přílohy"),
  ...nl(["Svolání zastupitelstva obce", "Prezenční listina zastupitelů", "Prezenční listina občanů"]),
];

async function run() {
  const r = await publishZapis({
    cislo: "2",
    rok: "2022",
    isoDate: "2022-03-11",
    dateLabel: "11. 3. 2022",
    fullDateDot: "11.3.2022",
    pdfPath: "scripts/zapisy-pdf/zapis-2022-2.pdf",
    transcript,
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
