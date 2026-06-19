import type { BlogPost } from "@/content/blog";
import { blogCategoryLabels } from "@/content/blog";
import type { BlogPostVM } from "@/lib/sanity/content-types";

// Adapter for the still-static homepage / rozcestník blog bands, which keep
// reading from content/blog.ts (out of the Sanity migration wave) but render
// the BlogCard component, which now expects a BlogPostVM.
export function contentBlogToVM(p: BlogPost): BlogPostVM {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    author: p.author,
    categories: p.categories,
    categoryLabels: p.categories.map((c) => ({
      slug: c,
      label: blogCategoryLabels[c],
    })),
    tags: p.tags,
    href: p.href,
    heroImage: p.heroImage,
  };
}
