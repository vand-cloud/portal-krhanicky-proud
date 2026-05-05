# Krhanický Proud — handover protokol

Operační manuál pro období, kdy realizaci webu drží Simon Anfilov (studio ANFILOV) a všechny provozní zdroje (doména, repo, CMS, hosting) **už od května 2026 vlastní Ivan Dvořák** (org `vand-cloud`). Detailní pravidla pro Claude Code najdete v [CLAUDE.md](./CLAUDE.md); tady je shrnutí pro lidi, co repem prochází bez Clauda.

## Kdo co drží (model B — full handover)

| Vrstva | Vlastník | Detail |
|---|---|---|
| Doména `krhanicky-proud.cz` | **Ivan Dvořák** | DNS u jeho registrátora. Při launchi nastaví A/AAAA záznamy na Vercel (DNS-only mode na Cloudflare, šedý mráček). |
| GitHub repo | **Ivan Dvořák** (`vand-cloud/portal-krhanicky-proud`) | Single `origin` remote. Simon má `Write` collaborator přístup pro push. |
| Hosting (Vercel **Hobby**) | **Ivan Dvořák** | Projekt v jeho osobním účtu. Auto-deploy z `main`. Simon přidaný jako collaborator (až Ivan dokončí setup, viz IVAN_SETUP.md). |
| Sanity (CMS) | **Ivan Dvořák** | Projekt `4nb8kl4e` v org `vand-cloud`. Simon Administrator collaborator. Plán Growth Trial (30 dní), pak rozhodne Ivan o paid plánu nebo Free. |
| Resend (transakční e-maily) | **Ivan Dvořák** (až bude potřeba) | Zatím neaktivní, formuláře jsou v Phase 2 wireframe placeholder. Až bude aktivace formulářů, Ivan si vytvoří Resend Free účet a zařídí domain verification. |
| Obsah (texty, fotky, kontakty) | **Ivan Dvořák** | Wireframe fáze: hardcoded v `content/*.ts` ze Simonova scrape datasetu. Po schválení designu se obsah migruje do Sanity (4nb8kl4e), dál ho spravuje klient. |

## Push protokol

Jediný `origin` ukazuje na klientovo repo. Push je **deliberativní akt**, ne každodenní snapshot — triggeruje Vercel auto-deploy a Ivan dostane preview URL.

```bash
# Po dokončené prezentační iteraci, kterou Simon schválil:
git push origin main    # → vand-cloud/portal-krhanicky-proud → Ivanův Vercel deploy
```

**Drobné iterace ladíme lokálně přes `npm run dev`.** Vercel Hobby má 100 deploys/den a žádné build-minute limity, takže technicky není proč šetřit, ale klient by viděl rozpracovanou verzi a dostal failed-deploy maily při každém build erroru. Push až je iterace hotová.

## Rozdělení účtů a přístupů

### Pro Simona (dnes)

| Zdroj | Přístup | Jak se přihlásí |
|---|---|---|
| GitHub `vand-cloud/portal-krhanicky-proud` | Outside collaborator (Write) | osobní účet `Anfilov`, ověř přes `gh api /repos/vand-cloud/portal-krhanicky-proud --jq .permissions` |
| Sanity projekt 4nb8kl4e | Administrator | login `simon@anfilov.cz` na [sanity.io/manage](https://www.sanity.io/manage/project/4nb8kl4e) |
| Vercel Hobby projekt | Collaborator (až ho Ivan přidá v IVAN_SETUP.md kroku C) | login Vercel účtem `Anfilov` |

### Pro Ivana (dnes a do budoucna)

Ivan dostane separátní setup checklist v [IVAN_SETUP.md](./IVAN_SETUP.md) — 2 kroky (Sanity token + Vercel import) a pak může web jet.

## Plánovaný launch (kdy se web pustí na produkční doménu)

Až bude wireframe schválený a brand fáze hotová:

1. Ivan přidá produkční doménu `krhanicky-proud.cz` ve svém Vercel projektu.
2. DNS A/AAAA záznamy nastaví na Vercel (DNS-only mode na Cloudflare, pokud používá CF).
3. Simon přidá CORS origin pro `https://krhanicky-proud.cz` a `https://www.krhanicky-proud.cz` v Sanity.
4. Ivan otevře `https://krhanicky-proud.cz/studio` a zaregistruje Studio (klikne „Register this studio" — Sanity to vyžaduje od přelomu 2025/2026).
5. Když budou potřeba formuláře, Ivan zařídí Resend Free účet a doménovou verifikaci.

## Kontakty

- **Simon Anfilov** (realizátor) — `simon@anfilov.cz`, GitHub `Anfilov`, web [anfilov.cz](https://anfilov.cz)
- **Ivan Dvořák** (provozovatel / majitel) — GitHub org `vand-cloud`

## Změny v tomto dokumentu

Pokud studio nebo klient mění rolová pravidla (přidání další osoby s admin přístupem, přesun domény, změna Sanity plánu z Trial na Free / Growth), aktualizace patří sem **i** do [CLAUDE.md](./CLAUDE.md), aby Claude Code i lidi pracovali ze stejného obrazu.
