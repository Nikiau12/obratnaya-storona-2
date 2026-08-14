"use client";

import { useMemo, useState, type ReactNode } from "react";
import { authors, type Material } from "@/lib/content";
import { MaterialCard } from "./MaterialCard";

export function MaterialArchive({ materials, children }: { materials: Material[]; children?: ReactNode }) {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("Все");
  const [sort, setSort] = useState("new");
  const [rubric, setRubric] = useState("Все рубрики");
  const [author, setAuthor] = useState("Все авторы");
  const [tag, setTag] = useState("Все теги");
  const formats = ["Все", ...Array.from(new Set(materials.map((item) => item.format)))];
  const rubrics = ["Все рубрики", ...Array.from(new Set(materials.map((item) => item.rubric)))];
  const materialAuthors = authors.filter((item) => materials.some((material) => material.authorSlug === item.slug));
  const tags = ["Все теги", ...Array.from(new Set(materials.flatMap((item) => item.tags)))];
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const filtered = materials.filter((item) => {
      const itemAuthor = authors.find((candidate) => candidate.slug === item.authorSlug);
      const searchableText = [item.title, item.excerpt, item.rubric, item.format, itemAuthor?.name, ...item.tags]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ru");

      return (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (format === "Все" || item.format === format) &&
        (rubric === "Все рубрики" || item.rubric === rubric) &&
        (author === "Все авторы" || item.authorSlug === author) &&
        (tag === "Все теги" || item.tags.includes(tag));
    });
    return sort === "new" ? filtered : [...filtered].reverse();
  }, [author, format, materials, query, rubric, sort, tag]);

  return (
    <section className="materials-archive" aria-label="Архив публикаций">
      <div className="archive-controls">
        <div className="archive-search">
          <label htmlFor="archive-search">Поиск по материалам</label>
          <div>
            <span aria-hidden="true">⌕</span>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название, автор, рубрика или тег"
            />
          </div>
        </div>
        <div className="archive-filter-area">
          <div className="filter-row" aria-label="Фильтр по формату">
            {formats.map((item) => <button className={format === item ? "active" : ""} onClick={() => setFormat(item)} key={item}>{item}</button>)}
          </div>
          <div className="select-filters">
            <label>Рубрика<select value={rubric} onChange={(event) => setRubric(event.target.value)}>{rubrics.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Автор<select value={author} onChange={(event) => setAuthor(event.target.value)}><option>Все авторы</option>{materialAuthors.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
            <label>Тег<select value={tag} onChange={(event) => setTag(event.target.value)}>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Порядок<select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="new">Сначала новые</option>
              <option value="old">Сначала старые</option>
            </select></label>
          </div>
        </div>
      </div>
      {children}
      <div className="archive-count"><span>Найдено</span><b>{String(visible.length).padStart(2, "0")}</b></div>
      <div className="archive-grid">{visible.map((material) => <MaterialCard material={material} compact key={material.slug} />)}</div>
    </section>
  );
}
