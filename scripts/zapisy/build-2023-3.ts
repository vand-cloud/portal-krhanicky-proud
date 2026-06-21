/* eslint-disable no-console */
// Faithful visual transcript of Zápis č. 3/2023 (19.7.2023), read page-by-page
// from the official PDF. Structure follows the approved golden sample
// scripts/build-zapis-2026-1.ts.
import { h3, h4, h5, p, vote, nl, ul, publishZapis, type Block } from "../zapis-lib";

const V6 = "PRO ( 6 ) – PROTI ( 0 ) – ZDRŽEL SE ( 0 )";

const transcript: Block[] = [
  h4("Přítomni"),
  p("Aleš Papoušek, Tomáš Kratochvíl, Jana Laboutková, Petr Dub, Lucie Maršíková, Hana Strnadová"),
  h4("Omluveni"),
  p("Jaroslav Mixa, Aleš Kozel, Martin Jiřička"),

  h3("1) Zahájení, přivítání přítomných, konstatování přítomnosti"),
  p("Starosta konstatoval, že zasedání bylo svoláno dne 11.7.2023, bylo vyvěšeno na úřední desce obecního úřadu, tj. tedy nejméně 7 dní před zasedáním. Bylo tedy svoláno řádně a včas v souladu se zákonem o obcích v platném znění. Starosta konstatoval, že podle prezenční listiny je přítomno 6 členů zastupitelstva, tedy nadpoloviční většina členů zastupitelstva. K předchozímu zápisu nebyly vzneseny námitky."),
  h5("Určení zapisovatele"),
  p("Zápisem zasedání zastupitelstva obce byla pověřena Ing. Alena Kratochvílová."),

  h3("2) Volba návrhové komise a ověřovatelů zápisu"),
  p("Starosta přednesl návrh návrhové komise a ověřovatelů zápisu."),
  h5("Návrh"),
  p("ZO schvaluje návrhovou komisi ve složení: Jana Laboutková, Petr Dub."),
  h5("Návrh"),
  p("ZO schvaluje ověřovatele zápisu ve složení Tomáš Kratochvíl, Hana Strnadová."),
  vote(V6),

  h3("3) Schválení programu"),
  p("Starosta přečetl program."),
  ...nl([
    "Zahájení",
    "Volba návrhové komise a ověřovatelů zápisu",
    "Schválení programu",
    "Okružní křižovatka silnic II/106 x III/1065 x III/1066 s chodníkem",
    "Rozpočtové opatření",
    "Koupě, prodej, pronájem",
    "Různé",
    "Diskuse",
    "Usnesení a závěr",
  ]),
  p("Starosta: Má někdo návrh na změnu nebo doplnění programu?"),
  h5("Návrh"),
  p("ZO schvaluje program zasedání zastupitelstva obce."),
  vote(V6),
  h5("Návrh"),
  p("ZO schvaluje Petra Duba k podpisu usnesení zastupitelstva."),
  vote(V6),

  h3("4) Okružní křižovatka silnic II/106 x III/1065 x III/1066 s chodníkem"),
  p("Starosta seznámil s předposledním krokem před realizací okružní křižovatky s chodníkem u železničního viaduktu v Krhanicích."),
  h5("Rozprava"),
  p("L.Maršíková: Dotaz na možnost realizace přechodového místa směrem k nádraží. Starosta: Středočeský kraj nechce žádnou změnu v projektové dokumentaci. Je na ní vázána dotace. Připomínky jsme mohli mít v době, kdy se projektová dokumentace připravovala."),
  p("I.Dvořák: Má obec představu, jak se bezpečně dostat na nádraží? Starosta: Byly dvě možnosti. Jedna vybudování přechodu přes koleje, což nepřichází v úvahu. Druhá možnost je stále v řešení – chodník kolem rampy a kolejí. Čekáme na vyjádření Agentury logistiky Armády České republiky. Pokud bude jejich stanovisko zamítavé, nepřichází v úvahu ani tato varianta."),
  p("H. Strnadová: Kdo bude udržovat zeleň? Starosta: 3 roky realizační firma, poté údržba přejde na obec."),
  p("H. Strnadová: Proč není v dokumentaci osazovací plán? Starosta: Firma se soustředila na jiné věci, bude technický dozor."),
  p("P.Bydžovský: Z jakého důvodu bude křižovatka po dobu realizace kruhového objezdu zcela neprůjezdná. Starosta: Aby firma stihla realizaci v termínu."),
  p("P.Bydžovský: Jak bude řešena autobusová doprava? Starosta: To se bude řešit až po podpisu smlouvy s realizační firmou."),
  p("M.Maršík: Částka 4 a půl milionu bude zahrnovat celý chodník až po schody k Hodkovu? Starosta: Ano."),
  p("I.Dvořák: Budou se sankce dělit podle výše plnění mezi kraj a obec? Starosta: Nevím."),
  p("Proběhla diskuse o kabelech, chráničkách a dodržení termínu realizace stavby bez přijatých závěrů."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Smlouvy o dílo č. SoD/02/2023 se společností B E S s.r.o., IČO 43792553, se sídlem Sukova 625, 256 01 Benešov pro stavební práce Okružní křižovatka silnic II/106 x III/1065 x III/1066 – Krhanice“. Cena díla včetně DPH pro obec Krhanice jako zadavatele č. 2 je 4 553 730,48 Kč."),
  vote(V6),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Smlouvy o dílo č. SoD/02/2023 se společností B E S s.r.o., IČO 437 92 553, se sídlem Sukova 625, 256 01 Benešov pro stavební práce Okružní křižovatka silnic II/106 x III/1065 x III/1066 – Krhanice“."),
  vote(V6),

  h3("5) Rozpočtové opatření"),
  h4("Rozpočtové opatření č. 7/2023"),
  p("Předseda finančního výboru Petr Dub seznámil s rozpočtovým opatřením č. 7/2023."),
  p("Starosta podrobněji rozebral 2 významnější položky: veřejné osvětlení a nádrž Gabčíkovo."),
  h5("Rozprava"),
  p("L.Maršíková: Kde skončí osvětlení v ulici Na Vlčím důle? Starosta: Ukázal na mapě (v půlce ulice)."),
  p("P.Bydžovský: V jaké vzdálenosti budou lampy podél hlavní komunikace? Starosta: Podle projektu, cca 30 metrů."),
  p("I.Dvořák: Co dalšího je ve výkopech položeno? Starosta: Elektřina, vodovod, dešťová kanalizace."),
  p("L.Maršíková: Cenová nabídka na položení kabelů je konečná? Starosta: Ano."),
  p("L.Maršíková: Budeme schvalovat smlouvu na připoložení kabelů? Starosta: Ne, zastupitelstvo schválí v rámci rozpočtu tuto částku a podám objednávku s přílohou této nabídky. Nabídka přišla dnes emailem."),
  p("H.Strnadová: Dotaz na částku ke Gabčíkovu, zda je to obvyklá částka? Starosta: Při porovnání geodetického zaměření ano."),
  p("I.Dvořák: Proběhlo již nějaké zaměření v minulosti? Starosta: Ano, v devadesátých letech."),
  p("Proběhla diskuse o vyvěšování plakátů a pravidlech pro vyvěšování se závěrem: Starosta je dohledá."),
  p("Proběhla diskuse o knihobudkách, jejich vzhledu, obsahu umisťovaných knih či dalších věcí se závěrem: Realizace, vzhled a provoz bude v kompetenci paní knihovnice Dubové."),
  p("L.Maršíková: Dotaz na použití částky z pronájmu klubovny? Starosta: Částka pokryje cca náklady na celkový provoz klubovny. Vyhodnocení se provede na konci roku."),
  h5("Návrh"),
  p("ZO schvaluje rozpočtové opatření č. 7/2023."),
  vote("PRO ( 5 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Maršíková )"),

  h3("6) Koupě, prodej, pronájem"),
  p("Informace starosty: V listopadu 2022 jsme schvalovali koupě a prodeje části pozemků u zvoničky. V rámci dělení jsme nezískali souhlas stavebního úřadu, a to ani po jednání s geodetem na stavebním úřadě. Geometrický plán byl přepracován. Nyní nejdříve zrušíme usnesení zastupitelstva č. 6/2022. Potom budeme schvalovat rozměrově stejné výměry ke koupi a prodeji."),
  h5("Návrh"),
  p("ZO ruší následující body z Usnesení č. 6/2022:"),
  ...nl([
    "prodat pozemek parc.č. 1978/15 k.ú. Krhanice o výměře 79 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1 m² Karlovi Boháčkovi, Krhanice č.p. 11, 257 42 Krhanice.",
    "prodat pozemek parc.č. 1978/16 k.ú. Krhanice o výměře 18 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku parc.č. 1978/13 k.ú. Krhanice za cenu 30,- Kč/1 m² Václavu Podroužkovi, Krhanice č.p. 9, 257 42 Krhanice.",
    "koupi pozemku parc.č. 2125 k.ú. Krhanice o výměře 20 m², který vznikne dle geometrického plánu č. 1086-111/2022 oddělením z pozemku st.p. 28 k.ú. Krhanice za cenu 30, Kč/1 m².",
  ]),
  p("(Číslování bodů v PDF pokračuje 14., 15., 16.)"),
  vote(V6),
  ...ul([
    "prodat oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „c“ a díl „d“, o výměře 32 m², které vzniknou dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m²",
  ]),
  h5("Rozprava"),
  p("Do diskuse se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „c“ a díl „d“, o výměře 32 m², které vzniknou dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m² Karlovi Boháčkovi, Krhanice č.p. 11, 257 42 Krhanice."),
  vote(V6),
  ...ul([
    "prodat oddělenou část pozemku parc.č. 1978/1 k.ú. Krhanice, díl „e“, o výměře 22 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m²",
  ]),
  h5("Rozprava"),
  p("Do diskuse se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „e“, o výměře 22 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m² Karlovi Boháčkovi, Krhanice č.p. 11, 257 42 Krhanice."),
  vote(V6),
  ...ul([
    "prodat oddělenou část pozemku parc.č. 1978/1 k.ú. Krhanice, díl „f“, o výměře 14 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m²",
  ]),
  h5("Rozprava"),
  p("Do diskuse se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje prodej oddělené části pozemku parc.č. 1978/1 k.ú. Krhanice, díl „f“, o výměře 14 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m² Václavu Podroužkovi, Krhanice č.p. 9, 257 42 Krhanice."),
  vote(V6),
  ...ul([
    "koupit oddělenou část pozemku st.p. 28 k.ú. Krhanice, díl „a“, o výměře 20 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m²",
  ]),
  p("Informace starosty: Jedná se o pozemek pod zvoničkou a kolem zvoničky v maximálním možném rozsahu."),
  h5("Rozprava"),
  p("Do diskuse se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje koupit oddělenou část pozemku st.p. 28 k.ú. Krhanice, díl „a“, o výměře 20 m², která vznikne dle geometrického plánu č. 1109-38/2023 za cenu 30,- Kč/1m² od Karla Boháčka, Krhanice č.p. 11, 257 42 Krhanice."),
  vote(V6),

  h3("7) Různé"),
  h4("Informace starosty: Uzavírka silnice Lešany - Krhanice"),
  p("Od 20.7. - 29.7.2023 - oprava povrchu komunikace. Objížďka přes Týnec n.Sáz. - Podělusy."),

  h4("Informace starosty: Práce na komunikaci k viaduktu"),
  p("Probíhají stavební práce na pravé straně komunikace směrem k viaduktu – ČEZ Distribuce mění kabelové vedení vrchní za kabelové vedení do země. Obec provádí rekonstrukci veřejného osvětlení a dešťové kanalizace. Tyto akce souvisí s budováním chodníku k viaduktu a přípravou na budoucí přepojení stávajících nemovitostí od viaduktu na dešťovou kanalizaci."),

  h4("Informace starosty: Pumptracková dráha"),
  p("V pondělí 17.7.2023 proběhla schůzka s navrhovateli projektu a zhotovitelem stavby vybraným navrhovateli projektu o pumptrackové dráze, která bude umístěna vedle školní jídelny v areálu základní školy. Realizace se plánuje v měsíci srpnu, dokončení v září."),
  h5("Rozprava"),
  p("L.Maršíková: Dotaz na příjezd k této dráze. Starosta: Nejsou dořešeny všechny podrobnosti. Záměr je po chodníku od školy kolem školní jídelny."),
  p("L.Maršíková: Dotaz na povrch dráhy: Starosta: Finální povrch bude kamenný prach 0 - 4 mm."),
  p("H.Strnadová: Jste pro zachování stromů kolem dráhy? Jak budete dohlížet na to, aby stromy nebyly poškozeny při realizaci? Starosta: Jsem pro zachování stromů. Odsouhlasil jsem prořez větví, které by vadily při užívání dráhy."),
  p("H.Strnadová: Bude se řešit opatření, aby byly stromy zachovány? Starosta: Technika nebude zasahovat do povrchu pod stromy."),
  p("Proběhla diskuse, zda manipulací techniky nebudou poškozeny kořeny a nedojde za několik let k úhynu stromů se závěrem: Opatření proti poškození se provádět nebudou a pan starosta bude provádět kontrolu. Bere na sebe odpovědnost za to, že se stromy nepoškodí."),
  p("Proběhla diskuse o provozním řádu a bezpečnosti pro uživatele pumptrackové dráhy po uvedení do provozu."),
  p("H. Strnadová se nabídla s pomocí ochrany stromů během realizace (návrh opatření)."),
  p("I. Dvořák: Budou lidé, kteří bydlí na sousedních parcelách informováni o vzniku projektu? Starosta: Dostanou přesnější informace. (Zatím jsou obeznámeni pouze s obecnými informacemi.)"),

  h4("Informace starosty: Senior taxi a rehabilitace taxi"),
  p("V období od 1.2.2023 do 30.6.2023 proběhlo:"),
  p("67 jízd (Krhanice – Benešov, Benešov – Krhanice)"),
  p("8 jízd (Krhanice – Týnec nad Sázavou, Týnec nad Sázavou – Krhanice)"),
  p("Bylo vydáno 27 průkazů občanům s trvalým pobytem v obci Krhanice ve věku od 65 let."),
  p("Uhrazeno bylo: 24.690,- Kč."),

  h4("Informace starosty: Kompostéry"),
  p("Na webových stránkách obce v sekci Důležité informace jsou uvedena schválená pravidla pro pořízení kompostéru a průběžně zde aktualizujeme čerpání."),
  p("K 19.7.2023 poskytnuto již celkem 12.000,- Kč (6 příspěvků)"),

  h4("Informace starosty: Rekonstrukce hrobu obětí 2.světové války"),
  p("Rekonstrukce byla dokončena. Bohužel v důsledku veder uschly některé tisy, a to i přes zalévání. Počkáme na příznivější období a poté je realizační firma nahradí novými stromky."),
  h5("Rozprava"),
  p("H.Strnadová: Kdo to bude platit? Starosta: Realizační firma."),
  p("L.Maršíková: Dotaz na záruku – 36 měsíců, vztahuje se i na tisy? Starosta: Ano."),

  h4("Lom Doubí"),
  p("Společnost ABAKRON, s.r.o. mi oznámila, že odstupuje od záměru ukládání skrývkových materiálů v bývalém lomu Doubí. Podle informací ze stavebního úřadu bude řízení zastaveno."),

  h3("8) Diskuse"),
  p("Do diskuse se nikdo nepřihlásil."),

  h3("9) Usnesení a závěr"),
  p("Zastupitelstvo obce bylo ukončeno v 19:20 hod."),

  p("Datum pořízení zápisu: 24.7.2023"),
  p("Ověřovatelé zápisu a starosta obce, podepsáno v listinné podobě."),
  h4("Přílohy"),
  ...nl(["Svolání zastupitelstva obce", "Prezenční listina zastupitelů", "Prezenční listina občanů"]),
];

async function run() {
  const r = await publishZapis({
    cislo: "3",
    rok: "2023",
    isoDate: "2023-07-19",
    dateLabel: "19. 7. 2023",
    fullDateDot: "19.7.2023",
    pdfPath: "scripts/zapisy-pdf/zapis-2023-3.pdf",
    transcript,
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
