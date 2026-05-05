# Krhanický Proud — handover protokol

Tento dokument slouží jako **operační manuál** pro období, kdy realizaci webu drží Simon Anfilov (studio ANFILOV) a budoucím provozovatelem, správcem i majitelem je Ivan Dvořák (org `vand-cloud`). Detailní pravidla pro Claude Code najdete v [CLAUDE.md](./CLAUDE.md); tady je shrnutí pro lidi, co repem prochází bez Clauda.

## Kdo co drží (současný stav, fáze wireframe)

| Vrstva | Vlastník | Detail |
|---|---|---|
| Doména `krhanicky-proud.cz` | **Klient** (Ivan Dvořák) | DNS u registrátora klienta. Při launchi nastavíme A/AAAA záznamy na Vercel v DNS-only modu (Cloudflare šedý mráček). |
| Kód v repu | **Studio** (Simon) implementuje, **klient** (vand-cloud org) drží paralelní backup | Dva remoty: `origin` (studio) + `client` (vand-cloud). Při launchi se dořeší primární vlastnictví. |
| Hosting (Vercel Pro) | **Studio** | Projekt `client-krhanicky-proud-web` pod teamem `Anfilov Studio`. Auto-deploy z `origin/main`. |
| Sanity (CMS) | **Studio** | Projekt `euod3b9r` v org „ANFILOV". Klient bude přidán jako Administrator (Free plán) nebo Editor (Growth plán) při dokončení wireframe fáze. |
| Resend (transakční e-maily) | **Studio** Pro účet | Klientova doména verifikovaná pod studio účtem. Klient nastaví DNS records, dedicated API key žije v `.env.local` projektu. |
| Obsah (texty, fotky, kontakty) | **Klient** (po migraci do Sanity) | Wireframe fáze: hardcoded v `content/*.ts`. Po schválení designu obsah migrujeme do Sanity, dál ho spravuje klient. |

## Push protokol

Push do kteréhokoli remotu je **deliberativní akt**, ne každodenní snapshot. Drobné iterace ladíme lokálně přes `npm run dev`.

```bash
# Po dokončené prezentační iteraci, kterou Simon schválil:
git push origin main    # 1. studio repo → spustí Vercel auto-deploy → klient vidí preview
git push client main    # 2. klientův repo → záloha + viditelnost u Ivana
```

**Nepushovat** drobné WIP commity. Vercel by trigerl deploy s nehotovou verzí a klient by viděl rozpracovaný stav. Interní snapshoty držíme jen lokálně až do schváleného milestonu.

Pokud někdy potřebujete pushnout najednou na oba remoty, lokálně si můžete nastavit alias:

```bash
git config --local alias.pushall '!git push origin main && git push client main'
git pushall
```

## Plánovaný launch (kdy přejde repo na klienta)

Až bude web připravený pro produkci a klient potvrdí, že ho chce provozovat sám:

1. Spustíme `/launch-web` skill (detail v `~/.claude/skills/launch-web/`).
2. Rozhodneme model:
   - **Model A (recurring fee, doporučené):** studio dál drží Vercel + Sanity + Resend, klient platí měsíční hosting fee. Repo `client` se stane primárním pro Ivana, `origin` zůstává jako studio kopie.
   - **Model B (full handover):** Vercel projekt + Sanity + Resend přejdou pod klientův účet. Studio zachovává jen referenční kopii kódu na `origin`, klient si pak vše spravuje sám.
3. DNS u domény klienta směřujeme na produkční Vercel (DNS-only mode na Cloudflare, pokud klient používá CF).
4. Generujeme finální verzi tohoto HANDOVER.md s konkrétními přihlašovacími údaji a checklistem pro klienta.

## Kontakty

- **Simon Anfilov** (realizátor) — `simon@anfilov.cz`, GitHub `Anfilov`, web [anfilov.cz](https://anfilov.cz)
- **Ivan Dvořák** (provozovatel / majitel) — GitHub org `vand-cloud`

## Změny v tomto dokumentu

Pokud studio nebo klient mění rolová pravidla (např. handover modelu, přidání další osoby s admin přístupem, přesun domény), aktualizace patří sem **i** do [CLAUDE.md](./CLAUDE.md), aby Claude Code i lidi pracovali ze stejného obrazu.
