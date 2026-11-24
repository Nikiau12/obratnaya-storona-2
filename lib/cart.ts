import { books } from "./content";
import { catalogBooks } from "./sketch-feature";

export type CartItem = { slug: string; quantity: number };

export const cartCatalog = [
  ...catalogBooks.map(book => ({ slug: book.slug, title: book.title, author: book.author, publisher: book.publisher.name, href: book.href, book, kind: "sketch" as const })),
  ...books.map(book => ({ slug: book.slug, title: book.title, author: book.author, publisher: book.publisher, href: `/books/${book.slug}`, book, kind: "editorial" as const })),
];

export function readCart(value: string | null): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const quantities = new Map<string, number>();
    for (const item of parsed) {
      if (!item || typeof item.slug !== "string" || !cartCatalog.some(book => book.slug === item.slug)) continue;
      if (!Number.isInteger(item.quantity) || item.quantity < 1) continue;
      quantities.set(item.slug, Math.min(99, (quantities.get(item.slug) ?? 0) + item.quantity));
    }
    return Array.from(quantities, ([slug, quantity]) => ({ slug, quantity }));
  } catch {
    return [];
  }
}
