# Správa katalogu (akce, místa, firmy), krhanicky-proud.cz

Ahoj Ivane, tady je krátký přehled, jak dnes funguje editace akcí, míst a firem v Krhanickém průvodci a jak to změnit na řešení, které si budete moct spravovat sám.

---

## Jak to funguje dnes

Akce, místa a firmy nejsou v Sanity Studiu. Žijí přímo v kódu webu, v jednom souboru `content/entries.ts`. Úpravu proto potřebuje udělat někdo, kdo umí commitnout a pushnout do repozitáře. Máte na výběr dvě cesty, jak to řešit.

---

## Cesta 1: Přidat nebo upravit záznam hned teď

Nejjednodušší způsob: pošlete Simonovi tyto údaje, on je zapíše a nasadí, obvykle do druhého dne.

Pro **akci** pošlete:
- Název
- Místo konání (adresa nebo alespoň obec)
- Datum a čas
- Krátký popis (1–2 věty)
- Web nebo kontakt na pořadatele, pokud existuje

Pro **místo, firmu nebo službu** pošlete:
- Název
- Adresa
- Krátký popis, čím se zabývá
- Telefon, e-mail nebo web, pokud existuje
- Otevírací doba, pokud je relevantní

Stačí poslat přes Signal, Telegram nebo e-mail. Simon údaje zařadí do správné kategorie, commitne a pushne. Změna se na webu objeví během pár minut od pushnutí.

### Pokud chcete zkusit úpravu sami

Repozitář vlastníte, takže máte přístup i přes webové rozhraní GitHubu:

1. Otevřete `content/entries.ts` v repozitáři `vand-cloud/portal-krhanicky-proud`.
2. Najděte podobný existující záznam a zkopírujte jeho strukturu.
3. Upravte hodnoty a uložte jako nový commit rovnou na `main`.
4. Vercel automaticky spustí nový build a nasadí změnu.

Tahle cesta vyžaduje trochu pozornosti. Chybějící čárka nebo špatný název kategorie shodí build. Pro první pokusy doporučujeme cestu přes Simona.

---

## Cesta 2: Zadat migraci do Sanity

Trvalejší řešení: přesunout celý katalog do Sanity, kde si ho budete upravovat sám přes formulář, bez zásahu do kódu.

Stačí napsat Simonovi: **„Chci migraci katalogu do Sanity."**

Co to znamená:
- Simon navrhne a nasadí Sanity schéma pro akce, místa, firmy a služby.
- Všech současných přibližně 160 záznamů se převede automaticky.
- V Sanity Studiu pak přidáte novou akci nebo firmu během pár minut, bez commitů a pushů.
- Je to jednorázová práce v řádu hodin, spravovatelnost pak zůstane natrvalo.

---

## Kterou cestu zvolit

Cesta 1 stačí, pokud přidáváte jen občas pár záznamů. Cesta 2 se vyplatí, jakmile budete chtít katalog udržovat pravidelně sám.

Pokud máte cokoliv nejasného, napište. Děkuju.

Simon
