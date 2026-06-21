/* eslint-disable no-console */
// One-off: faithful transcript of Zápis č. 1/2026 (9.3.2026), transcribed
// visually from the official PDF, written into the existing úřední příspěvek.
// Structure approved with Simon: H2 title, H4 Přítomni/Omluveni, H3 agenda
// sections, numbered list for the read-aloud program, H4 named sub-items,
// H5 for Návrh/Rozprava/Určení, bold vote tallies, PDF download bar.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
  }),
);
const c = createClient({ projectId: "4nb8kl4e", dataset: "production", apiVersion: "2026-04-27", token: env.SANITY_WRITE_TOKEN, useCdn: false });

const PDF_ASSET = "file-04568331434bd2aa04a71de8e5f5675f1cee0b20-pdf";
const DOC_ID = "uradPost-zapis-2026-1-zasedani-9-3-2026";
const TITLE = "Zápis č. 1/2026 ze zasedání zastupitelstva obce Krhanice konaného dne 9.3.2026";

let k = 0;
const key = () => `b${k++}`;
const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: key(), text, marks });
const blk = (style: string, text: string, marks: string[] = []) => ({ _type: "block", _key: key(), style, markDefs: [], children: [span(text, marks)] });
const h2 = (t: string) => blk("h2", t);
const h3 = (t: string) => blk("h3", t);
const h4 = (t: string) => blk("h4", t);
const h5 = (t: string) => blk("h5", t);
const p = (t: string) => blk("normal", t);
const vote = (t: string) => blk("normal", t, ["strong"]);
const li = (style: "bullet" | "number", t: string) => ({ _type: "block", _key: key(), style: "normal", listItem: style, level: 1, markDefs: [], children: [span(t)] });
const nl = (items: string[]) => items.map((t) => li("number", t));
const ul = (items: string[]) => items.map((t) => li("bullet", t));
const fileBar = () => ({ _type: "fileDownload", _key: key(), file: { _type: "file", asset: { _type: "reference", _ref: PDF_ASSET } }, name: TITLE, fileType: "PDF" });
const warnNote = () => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children: [span("Upozornění: ", ["strong"]), span("Následující přepis dokumentu může obsahovat stylistické nebo strukturální chyby.")] });

const V8 = "PRO ( 8 ) – PROTI ( 0 ) – ZDRŽEL SE ( 0 )";

const body = [
  fileBar(),
  warnNote(),

  h4("Přítomni"),
  p("Aleš Papoušek, Jaroslav Mixa, Tomáš Kratochvíl, Aleš Kozel, Jana Laboutková, Martin Jiřička, Petr Dub, Šárka Dušová"),
  h4("Omluveni"),
  p("Lucie Maršíková"),

  h3("1) Zahájení, přivítání přítomných, konstatování přítomnosti"),
  p("Starosta konstatoval, že zasedání bylo svoláno dne 27.2.2026, bylo vyvěšeno na úřední desce obecního úřadu, tj. tedy nejméně 7 dní před zasedáním. Bylo tedy svoláno řádně a včas v souladu se zákonem o obcích v platném znění. Starosta konstatoval, že podle prezenční listiny je přítomno 8 členů zastupitelstva, tedy nadpoloviční většina členů zastupitelstva. K předchozímu zápisu nebyly vzneseny námitky."),
  h5("Určení zapisovatele"),
  p("Zápisem zasedání zastupitelstva obce byla pověřena Ing. Alena Kratochvílová."),

  h3("2) Volba návrhové komise a ověřovatelů zápisu"),
  p("Starosta přednesl návrh návrhové komise a ověřovatelů zápisu."),
  h5("Návrh"),
  p("ZO schvaluje návrhovou komisi ve složení: Jaroslav Mixa, Jana Laboutková."),
  h5("Návrh"),
  p("ZO schvaluje ověřovatele zápisu ve složení Martin Jiřička, Petr Dub."),
  vote(V8),

  h3("3) Schválení programu"),
  p("Starosta přečetl program."),
  ...nl(["Zahájení", "Volba návrhové komise a ověřovatelů zápisu", "Schválení programu", "Zpráva Kontrolního výboru", "Rozpočtové opatření", "Obecně závazná vyhláška obce o nočním klidu", "Koupě, prodej, pronájem", "Různé", "Diskuse", "Závěr"]),
  p("Starosta: Má někdo návrh na změnu nebo doplnění programu?"),
  h5("Návrh"),
  p("ZO schvaluje program zasedání zastupitelstva obce."),
  vote(V8),

  h3("4) Zpráva kontrolního výboru"),
  p("Předseda kontrolního výboru Martin Jiřička seznámil se zprávou kontrolního výboru ze dne 15.12.2025."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO bere na vědomí Zprávu kontrolního výboru ze dne 15.12.2025."),

  h3("5) Rozpočtové opatření"),
  h4("Rozpočtové opatření č. 1/2026"),
  p("Informace starosty: Základní škola Krhanice předložila odpisové plány na nové vybavení školní jídelny. Dále seznámil s přijetím nadačního příspěvku na účely požární ochrany."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje navýšení provozního příspěvku Základní škole Krhanice ve výši 44 500 Kč (na odpisy nového majetku)."),
  vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Dušová )"),
  h5("Návrh"),
  p("ZO schvaluje přijetí nadačního příspěvku ve výši 175 614 Kč na účely požární ochrany, tělovýchovné a sportovní, ochrany životního prostředí nebo prevence a odstraňování živelních a jiných pohrom, tj. na nákup defibrilátoru, zásahových obleků, obuvi, rukavic, přileb, svítilen, batohu s vybavením na lesní požáry, plovoucího sacího koše a hadic k využití jednotkou sboru dobrovolných hasičů obcí zřizovanou obcí Krhanice a schvaluje uzavření Smlouvy o poskytnutí nadačního příspěvku s CSG NADAČNÍ FOND, IČO 23000791, U Rustonky 714/1, Karlín, 186 00 Praha 8."),
  vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Dušová )"),
  p("Předseda finančního výboru Petr Dub seznámil s rozpočtovým opatřením č. 1/2026."),
  h5("Rozprava"),
  p("I.Dvořák: Dotaz na položku silnice. Které silnice se budou rekonstruovat? Starosta – cesta k Bažantům – odvodnění a asfaltování."),
  p("I.Dvořák: Připadá mu částka dost vysoká – kolik je to metrů? Starosta informoval, odkud a kam cesta vede."),
  h5("Návrh"),
  p("ZO schvaluje rozpočtové opatření č. 1/2026."),
  vote(V8),

  h3("6) Obecně závazná vyhláška obce Krhanice o nočním klidu"),
  p("Místostarosta obce seznámil s OZV o nočním klidu – dochází k zahrnutí nových kulturních akcí, kdy dojde k omezení nočního klidu."),
  h5("Rozprava"),
  p("Š.Dušová: Proč jsou u akcí různé časy ukončení? Starosta: Akce Krhanice Open Air začíná již ve 13 hodin, ostatní až večer, proto jsou rozdílné časy."),
  h5("Návrh"),
  p("ZO schvaluje Obecně závaznou vyhlášku obce Krhanice o nočním klidu."),
  vote(V8),

  h3("7) Koupě, prodej, pronájem"),
  ...ul(["pronajmout část pozemku parc. č. 312/8 k.ú. Krhanice o výměře 18 m² pro umístění vozíku za auto za cenu 15,- Kč/1 m²/rok od 1.3.2026 do 28.2.2030."]),
  p("Informace starosty: Seznámil přítomné s tím, že budou osloveni ještě další obyvatelé, kteří parkují v dané lokalitě na pozemcích obce – pan Mixa a pan Mlejnek. Přišlo na ně upozornění. Pan Mixa tam parkuje vozík za auto, který používá ve velké míře i pro potřeby obce. Nemá se zaplacením částky za pronájem problém. Pan Mlejnek bude osloven."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje pronájem části pozemku parc. č. 312/8 k.ú. Krhanice o výměře 18 m² pro umístění vozíku za auto za cenu 15,- Kč/1 m²/rok od 1.3.2026 do 28.2.2030 s Petrem Pospíšilem, Krhanice 216, 257 42 Krhanice."),
  vote(V8),
  ...ul(["zřídit věcné břemeno kabelového vedení NN a uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6039549/VB/3 na pozemku parc. č. 1942/14 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 14 300,- Kč na umístění zařízení distribuční soustavy – kabelové vedení NN."]),
  p("Informace starosty: Jedná se o lokalitu v Prosečnici, nová elektrická přípojka k pozemku parc.č. 1942/26 k.ú. Krhanice."),
  h5("Rozprava"),
  p("Š.Dušová: Cena 14.300 Kč za zřízení věcného břemene je cena standardní? Starosta: Ceny jsou stanovené ceníkem k horní hranici."),
  h5("Návrh"),
  p("ZO schvaluje zřídit věcné břemeno kabelového vedení NN a uzavřít Smlouvu o budoucí smlouvě o zřízení věcného břemene a dohodu o umístění stavby č. IV-12-6039549/VB/3 na pozemku parc.č. 1942/14 k.ú. Krhanice s ČEZ Distribuce, a.s., IČO 24729035, DIČ CZ24729035, se sídlem Děčín IV Podmokly, Teplická 874/8, 405 02 Děčín na dobu neurčitou za cenu 14 300,- Kč na umístění zařízení distribuční soustavy – kabelové vedení NN."),
  vote(V8),
  ...ul(["zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/2 k.ú. Krhanice."]),
  p("Informace starosty: Jedná se o vodovodní přípojku ke stavebnímu pozemku vedle místní komunikace Pod Sádkem, k lomu."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/2 k.ú. Krhanice s Michaelou Vaněčkovou, Chrást nad Sázavou 249, 257 41 Týnec n.Sáz."),
  vote(V8),
  ...ul(["zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3 000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/3 k.ú. Krhanice."]),
  p("Informace starosty: Jedná se o vodovodní přípojku ke stavebnímu pozemku vedle místní komunikace Pod Sádkem, k lomu."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje zřídit věcné břemeno vodovodní přípojky a uzavřít Smlouvu o zřízení věcného břemene na pozemku parc.č. 1981/1 k.ú. Krhanice na dobu neurčitou za cenu 3 000,- Kč na umístění vodovodní přípojky pro pozemek parc.č. 276/3 k.ú. Krhanice s Michaelou Vaněčkovou, Chrást nad Sázavou 249, 257 41 Týnec n.Sáz."),
  vote(V8),

  h3("8) Různé"),
  h4("Inventarizační zpráva obce Krhanice za rok 2025"),
  p("Předseda inventarizační komise Aleš Papoušek přečetl inventarizační zprávu o proběhlé inventarizaci za rok 2025."),
  p("Inventarizace proběhla v řádném termínu, informace o stavu na jednotlivých účtech jsou uvedeny v příloze. Zhodnocení hospodaření obce bude projednáno v rámci Závěrečného účtu a schválení účetní závěrky na příštím zastupitelstvu."),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO bere na vědomí Inventarizační zprávu obce Krhanice za rok 2025."),

  h4("Zpráva o uplatňování územního plánu obce Krhanice"),
  p("Informace starosty: Byla dokončena Zpráva o uplatňování územního plánu. Zpráva bude ze strany zastupitelstva brána na vědomí. Zpráva bude postoupena dotčeným orgánům a zveřejněna k připomínkám veřejnou vyhláškou veřejnosti."),
  p("Bylo vyhodnoceno, jak se naplňuje územní plán z hlediska reálné zastavěnosti za 10/2019 – 01/2026. Zpráva obsahuje i požadavky na změnu územního plánu."),
  h5("Rozprava"),
  p("I.Dvořák: Jaký bude další postup? Starosta: Nyní byly zapracovány všechny žádosti. Teď bude zpráva postoupena všem dotčeným orgánům a bude zveřejněna k připomínkám."),
  p("I.Dvořák: Dotaz na pozemek pro mateřskou školu pod lomem. Starosta: Tento pozemek využívá mateřská škola. Špatně se udržuje, protože ho znehodnocují divoká prasata. Chtěli bychom ho oplotit."),
  p("J.Bydžovská: Dotaz na pozemek vedle kamenictví. Starosta: Lze připomínkovat v rámci veřejné vyhlášky."),
  h5("Návrh"),
  p("ZO bere na vědomí Zprávu o uplatňování Územního plánu Krhanice za uplynulé období 10/2019 – 01/2026."),

  h4("Plánovací smlouva – obec Krhanice Domicon"),
  p("Informace starosty: V územním plánu je plocha na východ od Prosečnice, kde má pozemky obec, paní Machová a firma Domicon s jednatelem Jiřím Moulíkem. Veškeré postupy od dělení pozemků v dané lokalitě až po tuto plánovací smlouvu byly osobně předloženy a řešeny na pracovních sezení zastupitelů. Dělení a sítě, které bude provádět na vlastní náklady firma Domicon, budou až na hranici obecních pozemků. Obec parcelaci a zasíťování pozemků nebude řešit."),
  h5("Rozprava"),
  p("Š.Dušová: Proč došlo k ponížení původní částky 100 tisíc na 50 tisíc? Starosta: Chtěl jsem převod na obec bezúplatně, ale dle daňové poradkyně firmy Domicon to nelze. Tak se částka jen snížila."),
  p("I.Dvořák: Jaký je záměr s pozemky obce v této lokalitě? Starosta: Zatím žádný."),
  p("I.Dvořák: Máte představu, kdy se obec stane plátcem DPH? Starosta: Až obec začne provozovat čistírnu odpadních vod."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Plánovací smlouvy s firmou Domicon s.r.o., IČO: 23401737, se sídlem Primátorská 296/38, Libeň, 180 00 Praha 8."),
  vote("PRO ( 6 ) – PROTI ( 0 ) – ZDRŽEL SE ( 2 – Dušová, Papoušek )"),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Plánovací smlouvy s firmou Domicon s.r.o., IČO: 23401737, se sídlem Primátorská 296/38, Libeň, 180 00 Praha 8."),
  vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Papoušek )"),

  h4("FVE klubovna"),
  p("Informace starosty: Na zastupitelstvu obce 19.11.2025 jsem informoval, že obec žádala o dotaci na projekt: Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích z výzvy Modernizačního fondu RES+, který pomáhá obcím do 3000 obyvatel s výstavbou fotovoltaických elektráren. Obdrželi jsme Rozhodnutí o poskytnutí finančních prostředků ze Státního fondu životního prostředí České republiky v rámci Programu financovaného z prostředků Modernizačního fondu. Výše dotace bude 303 283,40 Kč. Předpokládané náklady projektu byly zaokrouhleně 510 tisíc Kč."),
  p("Na prosincovém zastupitelstvu 12.12.2025 jsem byl zastupitelstvem obce pověřen realizací výběrového řízení na projekt Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích ve spolupráci s Posázavím o.p.s."),
  p("Výběrové řízení bylo vyhlášeno v únoru 2026. Byly osloveny 4 firmy. Nabídku předložily 3 firmy. Hodnotícím kritériem byla nejnižší nabídková cena."),
  p("Nejnižší nabídkovou cenu předložila firma VA ELECTRICS s.r.o.: 712 116,19 Kč včetně DPH."),
  p("Komise doporučila firmu VA ELECTRICS s.r.o. jako vítěze výběrového řízení."),
  p("Návratnost řešíme. Vhodná je forma sdílené elektřiny přes energetické datové centrum – do všech objektů – řešíme distribuční složku, nebo do školy napřímo."),
  p("Doba návratnosti 12 let. To je konzervativní odhad s pokrytím spotřeby pouze klubovny. Záměrem je přebytky posílat do základní školy, potom je návratnost tak 10 let. Kdybychom se do budoucna stali plátci DPH, tak je návratnost cca 7 let. Sdílení elektrické energie se řeší přes EDC (elektroenergetické datové centrum)."),
  h5("Rozprava"),
  p("P.Bydžovský: Jaká jsou bateriová úložiště? Starosta: Kvůli dotaci 16 kWh. Ale můžeme po uvedení do provozu přikoupit."),
  p("Proběhla diskuse o využívání přebytků vyrobené elektrické energie."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Smlouvy o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové na částku 712 116,19 Kč včetně DPH."),
  vote(V8),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Smlouvy o dílo č. SoD/01/2026 Fotovoltaika na střeše klubovny zázemí víceúčelového hřiště v Krhanicích s firmou VA ELECTRICS s.r.o., IČO: 23491213, se sídlem Okružní 871/6, 500 03 Hradec Králové."),
  vote(V8),

  h4("Přístavba mateřské školy"),
  p("Informace starosty: Zastupitelstvo obce dne 26.8.2025 schválilo podání žádosti o dotaci pro projekt „Přístavba Mateřské školy Krhanice“ z rozpočtu Středočeského kraje Program 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel ze Středočeského Fondu obnovy venkova a schválilo finanční spoluúčast obce. Dále mě zastupitelstvo pověřilo realizací výběrového řízení na dodavatele stavby pro projekt „Přístavba Mateřské školy Krhanice“. Výběrové řízení bylo vyhlášeno v únoru 2026. Byly osloveny 4 firmy. Nabídku předložily 3. Hodnotícím kritériem byla nejnižší nabídková cena."),
  p("Nejnižší nabídkovou cenu předložila firma PRO-REKO, s.r.o., IČO: 21058750, se sídlem Stříbrná Lhota 698, 252 10 Mníšek pod Brdy: 3 127 530,12 Kč včetně DPH"),
  p("Komise firmu PRO-REKO, s.r.o. doporučila jako vítěze výběrového řízení."),
  p("Podáme žádost o dotaci na Středočeský kraj do Programu 2025-2028 pro poskytování dotací na rozvoj obcí do 2000 obyvatel ze Středočeského Fondu obnovy venkova – tematické zadání „Veřejná infrastruktura“: c) občanské vybavení (např. stavby sloužící pro vzdělávání a výchovu, ...)"),
  p("Žádost o dotaci – dle počtu obyvatel k 1.1.2025: 1 135"),
  p("Dotace maximální výše 1 000,- Kč /1 obyvatele obce."),
  p("Dle smlouvy o dílo by realizace proběhla v období 06/2026–10/2026. Firma předpokládá vlastní realizaci 07-08/2026."),
  p("Předpoklad – plot se nebude posuzovat."),
  p("Předpokládaná hodnota zakázky dle rozpočtu projektanta: je 3 351 547,17 s DPH"),
  p("Cena vítězné nabídky byla oproti rozpočtu o 224 017,05 Kč nižší. Druhá nabídka byla 3 346 885,41 Kč. Třetí nabídka byla 4 061 086,72 Kč."),
  p("Stávající vnitřní dveře mají železnou zárubeň."),
  h5("Rozprava"),
  p("Š.Dušová: Dotaz, zda zůstane mezi plotem a stavbou jeden metr? Starosta: Tak to je v plánu."),
  p("Š.Dušová: Upozornila na nízkou částku penále z prodlení. Starosta: Je to standardní, smlouvu připravil právník."),
  p("I.Dvořák: Dotaz, zda firmy, které byly osloveny, pro nás něco dělaly? Starosta: Všechny."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Smlouvy o dílo č. SoD/02/2026 Přístavba Mateřské školy Krhanice s firmou PRO-REKO, s.r.o., IČO: 21058750, se sídlem Stříbrná Lhota 698, 252 10 Mníšek pod Brdy na částku 3 127 530,12 Kč včetně DPH."),
  vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Dušová )"),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Smlouvy o dílo č. SoD/02/2026 Přístavba Mateřské školy Krhanice s firmou PRO-REKO, s.r.o., IČO: 21058750, se sídlem Stříbrná Lhota 698, 252 10 Mníšek pod Brdy."),
  vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Dušová )"),

  h4("Dodatek č. 1 ke Smlouvě o výpůjčce č. SoV/01/2024"),
  p("Informace starosty: V důsledku změny číslování pozemku na katastru nemovitostí uzavřeme dodatek č. 1 Smlouvy o výpůjčce, která byla projednána zastupitelstvem obce dne 7.3.2024 za účelem výstavby a udržování 3 tůní se spolkem Aktivní Krhanice, z.s.,"),
  h5("Rozprava"),
  p("Do rozpravy se nikdo nepřihlásil."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Dodatku č. 1 Smlouvy o výpůjčce č. SoV/01/2024 se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429."),
  vote(V8),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem Dodatku č. 1 Smlouvy o výpůjčce č. SoV/01/2024 se spolkem Aktivní Krhanice, z.s., se sídlem Krhanice č.p. 35, 257 42 Krhanice, IČO: 09017429."),
  vote(V8),

  h4("ČOV Krhanice"),
  p("Informace starosty: V rozpočtu obce máme naplánované finance na projektovou dokumentaci na projekt ČOV Krhanice a kanalizační řady I.etapa. Po několika jednáních se zástupci firmy PROJEKTY VODAM s.r.o., která v minulosti zpracovávala dokumentaci na územní rozhodnutí ČOV a kanalizace Krhanice a dále nám zpracovávala zprávy a finanční rozvahy k ČOV a kanalizaci, nám firma předložila nabídku a dále smlouvu o dílo, která bude řešit projektové dokumentace a stavební povolení na ČOV Krhanice a kanalizační řady I.etapa. Na pracovním sezení zastupitelů bylo dohodnuto v návaznosti na povinnost sídelních útvarů do 1000 ekvivalentních obyvatel mít centrální čistírnu odpadních vod do roku 2035. Zahájíme tento proces. Minulý týden ve středu jsem jednal s firmou PROJEKTY VODAM, se kterou dlouhodobě spolupracujeme. Dnes mi byla zaslána nabídka a smlouva. Peníze v rozpočtu na rok 2026 jsou naplánované. Není důvod nezahájit projektovou přípravu na I.etapu."),
  h5("Rozprava"),
  p("I.Dvořák: Máte ověřeno, že kanalizace bude pro nás povinností? Starosta: Do budoucna ano."),
  p("I.Dvořák: Dotaz, zda je plán financování? Starosta: Dělali jsme i rozvahy na půjčky, které bychom si na realizaci museli vzít."),
  p("I.Dvořák: Jak s tím budou seznámeni občané? Starosta: Budou informováni průběžně."),
  h5("Návrh"),
  p("ZO schvaluje uzavření Smlouvy o dílo č. SoD/03/2026 pro akci „Krhanice – kanalizace a ČOV I.etapa“ s firmou PROJEKTY VODAM s.r.o., IČO: 26821443, se sídlem Galašova 158, 753 01 Hranice na částku 3 956 700,- Kč včetně DPH."),
  vote(V8),
  h5("Návrh"),
  p("ZO pověřuje starostu obce podpisem uzavření Smlouvy o dílo č. SoD/03/2026 pro akci „Krhanice – kanalizace a ČOV I.etapa“ s firmou PROJEKTY VODAM s.r.o., IČO: 26821443, se sídlem Galašova 158, 753 01 Hranice."),
  vote(V8),

  h3("9) Diskuse"),
  ...ul([
    "I.Dvořák: U tůní u Gabčíkova byla instalována lavička. Potřebujeme rozhodnout, zda je lavička pevně spojená se zemí či nikoliv. Aktivní Krhanice mají na vyjádření do 31.3.2026. Proběhla diskuse o tom, kdy se věc považuje za pevně spojenou se zemí a kdy ne.",
    "I.Zahrádková: Dotaz, zda se někde v okolí nebude budovat větrná elektrárna? Starosta: Nevím o tom.",
    "P.Bydžovský: Poděkoval všem sponzorům za masopust. Obci poděkoval za vypůjčení stanů. Proběhla diskuse o spolupořadatelích masopustu, kterých nebylo tolik jako v předešlém roce. Dále proběhla diskuse o záborech veřejných prostranství, vylepování cedulí, …",
  ]),

  h3("10) Závěr"),
  p("Zastupitelstvo obce bylo ukončeno v 19:45 hod."),

  p("Datum pořízení zápisu: 18.3.2026"),
  p("Ověřovatelé zápisu a starosta obce, podepsáno v listinné podobě."),
  h4("Přílohy"),
  ...nl(["Svolání zastupitelstva obce", "Prezenční listina zastupitelů", "Prezenční listina občanů"]),
];

async function run() {
  const tx = c.transaction();
  tx.createOrReplace({
    _id: DOC_ID,
    _type: "uradPost",
    title: "Zápis č. 1/2026, zasedání 9. 3. 2026",
    slug: { _type: "slug", current: "zapis-2026-1-zasedani-9-3-2026" },
    date: "2026-03-09",
    summary: "Řádné zasedání zastupitelstva obce Krhanice dne 9. 3. 2026. Plný přepis i originál ke stažení.",
    category: { _type: "reference", _ref: "uradCategory-zastupitelstvo" },
    subcategory: "archiv-schuzi",
    body,
  });
  await tx.commit();
  // cleanup the earlier demo draft (superseded by this enriched published doc)
  await c.delete("drafts.zapis-import-2026-03-09").catch(() => {});
  console.log("OK. body blocks:", body.length, "| doc:", DOC_ID);
}
run().catch((e) => { console.error(e); process.exit(1); });
