import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  SpecialistCard,
  type Specialist,
} from "@/components/sections/SpecialistCard";

export type ContactBlockProps = {
  /** ID for hero CTA anchor scroll. Defaults to "nabidka". */
  anchorId?: string;
  /** Section heading. */
  heading?: string;
  /** Lead text under heading. */
  lead?: string;
  /** Phone, prominent. */
  phone: string;
  /** E-mail, prominent. */
  email: string;
  /** Specialist shown above contact info. */
  specialist?: Specialist;
  /** Form submit endpoint. */
  formAction?: string;
  /** Privacy note shown under submit button. */
  privacyNote?: string;
  /** Textarea placeholder for the message field. */
  messagePlaceholder?: string;
};

const DEFAULT_HEADING = "Nezávazná cenová nabídka";

const DEFAULT_LEAD =
  "Zavolejte specialistovi níže, nebo nám pošlete formulář. Ozveme se do druhého pracovního dne.";

const DEFAULT_MESSAGE_PLACEHOLDER =
  "Stručně popište, o co máte zájem a v jakém termínu.";

export function ContactBlock({
  anchorId = "nabidka",
  heading = DEFAULT_HEADING,
  lead = DEFAULT_LEAD,
  phone,
  email,
  specialist,
  formAction = "/api/contact",
  privacyNote = "Odesláním souhlasíte se zpracováním osobních údajů pro účel komunikace. Nikomu neposíláme nic dál, neuchováváme déle, než je nutné.",
  messagePlaceholder = DEFAULT_MESSAGE_PLACEHOLDER,
}: ContactBlockProps) {
  return (
    <section
      id={anchorId}
      className="py-[var(--spacing-section)] bg-[var(--color-surface)] scroll-mt-20"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] mb-4">
                {heading}
              </h2>
              {lead && (
                <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  {lead}
                </p>
              )}
            </div>

            {specialist && (
              <SpecialistCard specialist={specialist} variant="inline" />
            )}

            <ul className="space-y-4 pt-8 border-t border-[var(--color-border)]">
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1">
                  Telefon
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-xl md:text-2xl font-bold text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
                >
                  {phone}
                </a>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1">
                  E-mail
                </p>
                <a
                  href={`mailto:${email}`}
                  className="text-xl md:text-2xl font-bold text-[var(--color-text)] hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)] break-all"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <form
            action={formAction}
            method="POST"
            className="grid gap-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 md:p-8"
          >
            <div>
              <label
                htmlFor="cb-name"
                className="block text-sm font-medium mb-1"
              >
                Jméno
              </label>
              <Input
                id="cb-name"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cb-company"
                className="block text-sm font-medium mb-1"
              >
                Firma <span className="text-[var(--color-text-tertiary)]">(volitelné)</span>
              </label>
              <Input
                id="cb-company"
                name="company"
                type="text"
                autoComplete="organization"
              />
            </div>
            <div>
              <label
                htmlFor="cb-email"
                className="block text-sm font-medium mb-1"
              >
                E-mail
              </label>
              <Input
                id="cb-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cb-phone"
                className="block text-sm font-medium mb-1"
              >
                Telefon <span className="text-[var(--color-text-tertiary)]">(volitelné)</span>
              </label>
              <Input
                id="cb-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
            </div>
            <div>
              <label
                htmlFor="cb-message"
                className="block text-sm font-medium mb-1"
              >
                O co jde
              </label>
              <Textarea
                id="cb-message"
                name="message"
                rows={5}
                placeholder={messagePlaceholder}
                required
              />
            </div>
            <Button type="submit" size="lg" className="mt-2">
              Odeslat poptávku
            </Button>
            {privacyNote && (
              <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                {privacyNote}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
