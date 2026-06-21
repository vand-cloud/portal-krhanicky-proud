# Přepis usnesení ze zastupitelstva → Sanity (kontrakt pro agenta)

Přepíšeš JEDNO úřední usnesení (Usnesení č. X/ROK) z PDF do věrného,
vyhledatelného textu a publikuješ do Sanity. Stejná pravidla přesnosti jako
u zápisů.

## ⛔ Přesnost je nejdůležitější
Doslovný přepis. Nepřeformulovávej, neshrnuj, neopravuj. Zachovej diakritiku,
jména/iniciály, čísla parcel, částky, IČO, data, § a čísla smluv přesně.
Pokud je dokument kvůli GDPR upravený (jména zkrácená na iniciály jako „H.V.“),
přepiš iniciály přesně tak, jak jsou.

## Jak číst PDF (VIZUÁLNĚ)
Textová vrstva je rozbitá → čti obrázky stránek přes Read tool:
`Read scripts/zapisy-pdf/<SOUBOR>.pdf` (do 10 stran), u delších po dávkách
`pages="1-10"`, `pages="11-20"`. Přečti každou stránku.

## Struktura usnesení (schváleno se Simonem)
PDF download bar a upozornění přidává knihovna automaticky — do `sections` je
NEdáváš. Usnesení je členěné podle sloves. Pro každou sekci, která v dokumentu
je, vytvoříš jednu položku `sections`:

```ts
{ heading: "Zastupitelstvo obce Krhanice schvaluje", items: [ "...", "..." ] }
```

Typické nadpisy (použij JEN ty, které v dokumentu opravdu jsou, v pořadí dle PDF):
- „Zastupitelstvo obce Krhanice schvaluje"
- „Zastupitelstvo obce Krhanice bere na vědomí"
- „Zastupitelstvo obce Krhanice projednalo"
- „Zastupitelstvo obce Krhanice pověřuje"
- „Zastupitelstvo obce Krhanice ověřuje" / „ukládá" / „volí" / „revokuje" (pokud jsou)

`items` = jednotlivé body P.č. v daném pořadí. Číslování řeší seznam sám
(reprodukuje 1, 2, 3 … přesně jako v PDF, protože každá sekce začíná od 1).

### ⚠️ Tabulkové body přes víc řádků / odstavců (DŮLEŽITÉ)
Některé body jsou v tabulce rozepsané do několika odstavců (např. „prodat …“
a pod tím „a koupit …“). Takový bod zůstává JAKO JEDEN číslovaný bod, ale
jednotlivé části oddělíš měkkým enterem `\n` přímo v textu položky:

```ts
"prodat oddělenou část pozemku parc. č. 403/8 … kupujícímu NATY TERRA, s.r.o. …\na koupit oddělenou část pozemku parc.č. 361/3 … od prodávajícího NATY TERRA, s.r.o. …"
```

Renderer měkké entery zobrazí jako zalomení uvnitř bodu, číslování zůstane
nedotčené. NErozděluj jeden bod na dvě čísla.

### GDPR poznámka
Pokud je hned pod titulkem věta typu „Z důvodu ochrany osobních údajů GDPR je
dokument upraven.", předej ji přesně přes `gdpr: "…"`.

### Co vynechat
Podpisy (starosta/místostarosta), „Vyvěšeno/Sejmuto", razítka.

## Skript, který napíšeš a spustíš
Vytvoř `scripts/zapisy/build-usneseni-<rok>-<cislo>.ts`:

```ts
/* eslint-disable no-console */
import { publishUsneseni } from "../usneseni-lib";

async function run() {
  const r = await publishUsneseni({
    cislo: "<CISLO>", rok: "<ROK>",
    isoDate: "<YYYY-MM-DD>", dateLabel: "<D. M. YYYY>", fullDateDot: "<D.M.YYYY>",
    pdfPath: "scripts/zapisy-pdf/usneseni-<ROK>-<CISLO>.pdf",
    gdpr: "Z důvodu ochrany osobních údajů (GDPR) je dokument upraven.", // jen pokud je v PDF
    sections: [
      { heading: "Zastupitelstvo obce Krhanice schvaluje", items: [ /* … */ ] },
      // další sekce dle PDF …
    ],
  });
  console.log("OK", r.docId, "blocks", r.blocks);
}
run().catch((e) => { console.error(e); process.exit(1); });
```

Spusť z `clients/krhanicky-proud/web`:
`node_modules/.bin/tsx scripts/zapisy/build-usneseni-<rok>-<cislo>.ts`

## Čeština v TS stringu
Uvnitř českých uvozovek „…" nikdy nepiš ASCII `"` (rozbije string). Použij
„české" uvozovky nebo přeformuluj. En dash „–", nikdy em dash „—".

## Výstup
Krátké shrnutí: počet stran, názvy sekcí + počty bodů, počet bloků, docId, OK/chyba.
