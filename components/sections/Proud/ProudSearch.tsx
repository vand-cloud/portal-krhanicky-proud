"use client";

import { useMemo, useState } from "react";
import { Folder, FileText, User } from "lucide-react";
import {
  type ProudCategoryDef,
  type ProudItem,
  proudCategoryLabels,
} from "@/content/proud";
import { unaccent } from "@/content/entries";
import { SearchBar } from "@/components/sections/Hybrid/SearchBar";

const CATEGORY_LIMIT = 4;
const PEOPLE_LIMIT = 4;
const ITEM_LIMIT = 6;

interface SearchHit {
  id: string;
  href: string;
  title: string;
  meta: string;
  description?: string;
}

function buildCategoryHref(catSlug: string): string {
  const params = new URLSearchParams({ kat: catSlug });
  return `/proud?${params.toString()}#proud-content`;
}

function findCategoryHits(
  categories: ProudCategoryDef[],
  q: string,
): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const cat of categories) {
    const haystack = unaccent(`${cat.label} ${cat.description ?? ""}`);
    if (haystack.includes(q)) {
      hits.push({
        id: `cat-${cat.slug}`,
        href: buildCategoryHref(cat.slug),
        title: cat.label,
        meta: "Sekce",
        description: cat.description,
      });
    }
  }
  return hits;
}

// Item hits split into candidates (items with personId in "kandidati"
// category) and posts. Candidate matches outrank post matches when the
// query touches a person's name.
function findItemHits(items: ProudItem[], q: string) {
  const matched = items.filter((item) =>
    unaccent(`${item.title} ${item.description ?? ""}`).includes(q),
  );

  const candidates: SearchHit[] = [];
  const posts: SearchHit[] = [];

  for (const item of matched) {
    const meta = proudCategoryLabels[item.category];
    const hit: SearchHit = {
      id: item.id,
      href: item.href,
      title: item.title,
      meta,
      description: item.description,
    };
    if (item.category === "kandidati") {
      candidates.push(hit);
    } else {
      posts.push(hit);
    }
  }

  return { candidates, posts };
}

// Search box for the /proud context. Looks across:
//   1. Categories (e.g. "Doprava") -- jumps to category landing
//   2. Candidates -- jumps to /proud/kandidat-... keeping sidebar
//   3. Policy posts -- jumps to /proud/[slug] keeping sidebar
// Same interaction model as ObecSearch and HomeSearch.
export function ProudSearch({
  categories,
  items,
  placeholder,
}: {
  categories: ProudCategoryDef[];
  items: ProudItem[];
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const hits = useMemo(() => {
    if (!trimmed) {
      return {
        categories: [] as SearchHit[],
        candidates: [] as SearchHit[],
        posts: [] as SearchHit[],
      };
    }
    const q = unaccent(trimmed);
    const cats = findCategoryHits(categories, q).slice(0, CATEGORY_LIMIT);
    const { candidates, posts } = findItemHits(items, q);
    return {
      categories: cats,
      candidates: candidates.slice(0, PEOPLE_LIMIT),
      posts: posts.slice(0, ITEM_LIMIT),
    };
  }, [categories, items, trimmed]);

  const showDropdown = trimmed.length > 0;
  const totalResults =
    hits.categories.length + hits.candidates.length + hits.posts.length;

  return (
    <div className="relative">
      <SearchBar
        query={query}
        onChange={setQuery}
        placeholder={placeholder}
        size="large"
        ariaLabel="Hledat v sekci Proud"
      />

      {showDropdown ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
          {totalResults === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
              Pro „{query}“ jsme v sekci Proud nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {hits.categories.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="folder" />
              ))}
              {hits.candidates.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="user" />
              ))}
              {hits.posts.map((hit) => (
                <ResultRow key={hit.id} hit={hit} icon="file" />
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ResultRow({
  hit,
  icon,
}: {
  hit: SearchHit;
  icon: "folder" | "user" | "file";
}) {
  const Icon = icon === "folder" ? Folder : icon === "user" ? User : FileText;
  return (
    <li>
      <a
        href={hit.href}
        className="block px-4 py-3 outline-none hover:bg-[var(--color-bg-elev)] focus-visible:bg-[var(--color-bg-elev)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          <Icon size={12} aria-hidden />
          {hit.meta}
        </div>
        <div className="mt-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
          {hit.title}
        </div>
        {hit.description ? (
          <div className="mt-0.5 line-clamp-1 text-xs text-[var(--color-text-secondary)]">
            {hit.description}
          </div>
        ) : null}
      </a>
    </li>
  );
}
