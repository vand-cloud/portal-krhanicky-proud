// Embedded Sanity Studio sits outside the [locale] route tree, so it needs
// its own <html>/<body>. The locale layout's chrome (header, footer, fonts,
// NextIntlProvider) intentionally does NOT wrap Studio -- Studio is a
// self-contained admin UI for content editors.

export const metadata = {
  title: "Sanity Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
