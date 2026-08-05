"use client";

import { useMemo, useState } from "react";
import type { Author, Book, Material } from "@/lib/content";

type SearchResult = { type: string; title: string; subtitle: string; href: string };

export function SearchPanel({ materials, books, authors }: { materials: Material[]; books: Book[]; authors: Author[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo<SearchResult[]>(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    if (normalized.length < 2) return [];
    return [
      ...materials.map((item) => ({ type: "Материал", title: item.title, subtitle: `${item.format} · ${item.rubric}`, href: `/material/${item.slug}`, search: `${item.title} ${item.excerpt} ${item.rubric} ${item.tags.join(" ")}` })),
      ...books.map((item) => ({ type: "Книга", title: item.title, subtitle: `${item.author} · ${item.publisher}`, href: `/books/${item.slug}`, search: `${item.title} ${item.author} ${item.publisher}` })),
      ...authors.map((item) => ({ type: "Автор", title: item.name, subtitle: item.role, href: `/authors/${item.slug}`, search: `${item.name} ${item.role} ${item.bio}` })),
    ].filter((item) => item.search.toLocaleLowerCase("ru").includes(normalized));
  }, [authors, books, materials, query]);

  return (
    <section className="search-panel">
      <label htmlFor="site-search">Поиск по материалам, книгам и авторам</label>
      <div className="search-input-wrap"><span>⌕</span><input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Начните вводить слово" /></div>
      <div className="search-status" aria-live="polite">{query.length < 2 ? "Введите не менее двух букв" : `Найдено: ${results.length}`}</div>
      <div className="search-results">
        {results.map((result) => <a href={result.href} key={`${result.type}-${result.href}`}><span>{result.type}</span><h2>{result.title}</h2><p>{result.subtitle}</p><i>↗</i></a>)}
        {query.length >= 2 && results.length === 0 ? <p className="empty-state">На этой стороне ничего не найдено. Попробуйте другое слово.</p> : null}
      </div>
    </section>
  );
}
