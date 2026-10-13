"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Author, Book, Material } from "@/lib/content";

type SearchResult = { type: string; title: string; subtitle: string; href: string };

export function SearchPanel({ materials, books, authors }: { materials: Material[]; books: Book[]; authors: Author[] }) {
  const [query, setQuery] = useState("");
  const suggestions = ["архив", "обложка", "интервью", "книга"];
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
      <div className="search-surface">
        <label htmlFor="site-search">Что вы хотите найти?</label>
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true" />
          <input id="site-search" type="search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Введите запрос" />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Очистить поиск">Очистить</button> : null}
        </div>
        <div className="search-suggestions" aria-label="Примеры поисковых запросов">
          <span>Например</span>
          {suggestions.map((suggestion) => <button type="button" onClick={() => setQuery(suggestion)} key={suggestion}>{suggestion}</button>)}
        </div>
      </div>
      <div className="search-status" aria-live="polite"><span>{query.length < 2 ? "Введите не менее двух букв" : "Результаты"}</span><b>{query.length < 2 ? "—" : String(results.length).padStart(2, "0")}</b></div>
      <div className="search-results">
        {results.map((result, index) => <Link href={result.href} key={`${result.type}-${result.href}`}><span>{String(index + 1).padStart(2, "0")} · {result.type}</span><h2>{result.title}</h2><p>{result.subtitle}</p></Link>)}
        {query.length >= 2 && results.length === 0 ? <p className="empty-state">На этой стороне ничего не найдено. Попробуйте другое слово.</p> : null}
      </div>
    </section>
  );
}
