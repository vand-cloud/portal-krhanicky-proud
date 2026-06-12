import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { ContactFormProps } from "./types";

export default function Form({
  heading,
  subheading,
  fields = ["name", "email", "message"],
  submitLabel = "Odeslat",
  action = "/api/contact",
}: ContactFormProps) {
  return (
    <section className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <Container size="narrow">
        <div className="text-center mb-[var(--spacing-block-gap)]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
              {subheading}
            </p>
          )}
        </div>
        <form action={action} method="POST" className="grid gap-4">
          {fields.includes("name") && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Jméno
              </label>
              <Input id="name" name="name" type="text" autoComplete="name" required />
            </div>
          )}
          {fields.includes("email") && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-mail
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
          )}
          {fields.includes("phone") && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Telefon
              </label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          )}
          {fields.includes("company") && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Firma
              </label>
              <Input id="company" name="company" type="text" autoComplete="organization" />
            </div>
          )}
          {fields.includes("message") && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Zpráva
              </label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
          )}
          <Button type="submit" size="lg" className="mt-2">
            {submitLabel}
          </Button>
        </form>
      </Container>
    </section>
  );
}
