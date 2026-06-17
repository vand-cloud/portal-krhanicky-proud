// Demo rich-text body shared by the blog detail and the programme post
// detail. Phase 2 placeholder: shows what a Sanity rich-text (portable
// text) body will look like once the editor writes real content --
// headings (H2/H3/H4), paragraphs, bullet + numbered lists, and inline
// captioned images. The copy is dummy "lorem ipsum" on purpose so it
// reads as a layout preview, not real content. Same demo everywhere.
//
// Phase 4 (Sanity) replaces this with a PortableText serializer that maps
// the same block/heading/list/image marks onto this exact typography.

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 text-xl font-bold leading-tight tracking-tight text-[var(--color-text-accent)] sm:text-2xl">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-8 mb-2 text-lg font-bold leading-snug tracking-tight text-[var(--color-text-accent)]">
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-6 mb-2 text-base font-semibold text-[var(--color-text-accent)]">
      {children}
    </h4>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
      {children}
    </p>
  );
}

// Inline captioned image. Sits at the natural ratio inside the reading
// column, with a small caption underneath -- the Sanity image block.
function Figure({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- Phase 2 wireframe; next/image comes in Phase 4 with Sanity assets. */}
        <img src={src} alt="" className="block h-auto w-full" />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function ArticleBodyDemo() {
  return (
    <div className="mt-10">
      <P>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </P>

      <H2>Proč na tom záleží</H2>
      <P>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </P>
      <P>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
        ab illo inventore veritatis et quasi architecto beatae vitae dicta
        sunt explicabo.
      </P>

      <Figure
        src="/blog/co-se-chysta-na-jaro-2026.webp"
        caption="Lorem ipsum dolor sit amet — popisek k fotografii, který upřesní, co je na snímku."
      />

      <H3>Co konkrétně navrhujeme</H3>
      <P>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
        fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
        sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
        sit amet.
      </P>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-text-tertiary)]">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</li>
        <li>Duis aute irure dolor in reprehenderit in voluptate velit.</li>
        <li>Excepteur sint occaecat cupidatat non proident.</li>
      </ul>

      <H3>Jak na to půjdeme krok za krokem</H3>
      <P>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati.
      </P>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-text-tertiary)]">
        <li>Temporibus autem quibusdam et aut officiis debitis aut rerum.</li>
        <li>Itaque earum rerum hic tenetur a sapiente delectus.</li>
        <li>Ut aut reiciendis voluptatibus maiores alias consequatur.</li>
      </ol>

      <Figure
        src="/blog/letni-vylet-po-posazavi-na-kole.webp"
        caption="Popisek druhé fotografie. Slepý text slouží jen pro náhled rozložení."
      />

      <H4>Doplňující poznámka</H4>
      <P>
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas nulla pariatur.
      </P>
      <P>
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero
        tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
        minus id quod maxime placeat facere possimus.
      </P>
    </div>
  );
}
