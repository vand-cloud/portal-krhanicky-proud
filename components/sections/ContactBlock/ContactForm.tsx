"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const json = await res.json();
      if (json.success) {
        setState("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMsg(json.message ?? "Nastala chyba, zkuste to prosím znovu.");
        setState("error");
      }
    } catch {
      setErrorMsg("Zprávu se nepodařilo odeslat. Zkontrolujte prosím připojení.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
        Zpráva odeslána. Ozveme se vám zpravidla do dvou pracovních dnů.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input type="hidden" name="access_key" value="b3e25777-ccde-4c24-afeb-2316d9cd82a8" />
      <input type="hidden" name="subject" value="Zpráva z webu Krhanický PROUD" />
      {/* honeypot – boty vyplní, web3forms odmítne */}
      <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" tabIndex={-1} />

      <div>
        <label htmlFor="cf-name" className="block text-sm font-medium text-[var(--color-text)]">
          Jméno
        </label>
        <input
          id="cf-name"
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Jan Novák"
          className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium text-[var(--color-text)]">
          E-mail
        </label>
        <input
          id="cf-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="jan@example.com"
          className="mt-1 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-[var(--color-text)]">
          Zpráva
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Váš vzkaz…"
          className="mt-1 block w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-on-brand)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {state === "submitting" ? "Odesílám…" : "Odeslat zprávu"}
      </button>
    </form>
  );
}