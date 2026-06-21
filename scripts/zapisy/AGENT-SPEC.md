# Přepis zápisu ze zastupitelstva → Sanity (kontrakt pro agenta)

Tvým úkolem je přepsat JEDEN úřední zápis ze zasedání zastupitelstva obce
Krhanice z PDF do věrného, vyhledatelného textu a publikovat ho do Sanity.

## ⛔ Přesnost je úplně nejdůležitější

Je to úřední dokument. **Přepis musí být doslovný.** Nepřeformulovávej,
neshrnuj, nepřehazuj pořadí, nic „neopravuj", nic nevynechávej (kromě
explicitně uvedených výjimek níže). Zachovej přesně: česká diakritika, jména,
data, čísla parcel, částky, IČO, adresy, časy.

## Jak číst PDF (VIZUÁLNĚ, ne textová vrstva)

Textová vrstva v těchto PDF je **rozbitá** (dělá „I)" z „1)", „S)" z „5)",
„vyveseno" z „vyvěšeno"). Proto čteš **obrázky stránek** přes Read tool:

```
Read scripts/zapisy-pdf/<SOUBOR>.pdf            # do 10 stran
Read scripts/zapisy-pdf/<SOUBOR>.pdf pages="1-10"
Read scripts/zapisy-pdf/<SOUBOR>.pdf pages="11-20"   # zbytek po dávkách
```

Přečti **každou stránku**. Po přepisu si znovu projeď stránky a zkontroluj, že
v textu nejsou žádné OCR artefakty typu „I)"/„S)"/„lO)" — pokud na ně narazíš,
oprav je na správné číslo podle vizuálu.

## Struktura (přesně podle schváleného vzoru `scripts/build-zapis-2026-1.ts`)

PDF download bar a úvodní upozornění přidává knihovna automaticky —
**ty je do `transcript` NEdáváš**. `transcript` začíná rovnou obsahem:

- `h4("Přítomni")` → `p("jméno, jméno, …")` (jména přesně, oddělená čárkou)
- `h4("Omluveni")` → `p("…")` — jen pokud někdo chybí (jinak vynech celý blok)
- pro každý bod programu: `h3("N) Název bodu")` (číslo + závorka jako v PDF)
- pojmenovaná podpoložka uvnitř bodu (typicky v „Různé"): `h4("Název")`
- procesní mezinadpisy: `h5("Návrh")`, `h5("Rozprava")`, `h5("Určení zapisovatele")` apod.
- běžný text: `p("…")`
- **hlasování VŽDY tučně přes `vote(...)`**: `vote("PRO ( 8 ) – PROTI ( 0 ) – ZDRŽEL SE ( 0 )")`
  - používej **en dash „–"**, NIKDY em dash „—"
  - když se někdo zdržel/byl proti se jménem: `vote("PRO ( 7 ) – PROTI ( 0 ) – ZDRŽEL SE ( 1 - Dušová )")`
- program, který starosta přečetl = **číslovaný seznam** `...nl(["Zahájení", "…", "Závěr"])`
  (NE samostatné nadpisy — je to jen výčet bodů)
- dílčí odrážky (např. seznam pozemků v „Koupě, prodej, pronájem") = `...ul(["…"])`
- na konci: `h3("Závěr")` nebo poslední číslovaný bod, čas ukončení, datum
  pořízení zápisu, řádek o ověřovatelích, a `h4("Přílohy")` + `...nl([...])`
  pokud je v PDF seznam příloh

### Co vynechat
Podpisy, oddíl „vyvěšeno/sňato", razítka a ryze formální patičku není nutné
přepisovat. Vše věcné (body, návrhy, rozpravy, hlasování) přepiš.

## Skript, který napíšeš a spustíš

Vytvoř `scripts/zapisy/build-<rok>-<cislo>.ts` (čísla doplň podle zadání):

```ts
/* eslint-disable no-console */
import { h3, h4, h5, p, vote, nl, ul, publishZapis, type Block } from "../zapis-lib";

const transcript: Block[] = [
  h4("Přítomni"),
  p("…"),
  // … celý věrný přepis …
];

async function run() {
  const r = await publishZapis({
    cislo: "<CISLO>",
    rok: "<ROK>",
    isoDate: "<YYYY-MM-DD>",
    dateLabel: "<D. M. YYYY>",
    fullDateDot: "<D.M.YYYY>",
    pdfPath: "scripts/zapisy-pdf/zapis-<ROK>-<CISLO>.pdf",
    transcript,
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
```

Spusť z adresáře `clients/krhanicky-proud/web`:

```
node_modules/.bin/tsx scripts/zapisy/build-<rok>-<cislo>.ts
```

Hotovo, když vypíše `OK uradPost-… blocks <N>`. Knihovna sama nahraje PDF jako
asset, přidá download bar + upozornění a publikuje dokument (createOrReplace,
takže opětovné spuštění je bezpečné).

## Pozor na češtinu v TS stringu
Uvnitř českých uvozovek „…" nikdy nepiš ASCII `"` (rozbije TS string).
Když potřebuješ uvozovky v textu, použij „české" nebo přeformuluj.

## Výstup (co mi vrátíš)
Jen krátké shrnutí: číslo zápisu, počet stran PDF, počet bloků `transcript`,
počet hlasování, a `docId`. Žádný dlouhý text.
