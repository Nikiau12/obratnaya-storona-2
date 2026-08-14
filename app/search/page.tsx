import type { Metadata } from "next";
import { SearchPanel } from "@/components/SearchPanel";
import { authors, books, materials } from "@/lib/content";
export const metadata: Metadata = { title: "Поиск — Обратная сторона" };
export default function SearchPage() {
  return (
    <main className="inner-page search-page">
      <section className="search-page-hero">
        <span>Найти на стороне</span>
        <h1>Поиск</h1>
        <p>Материалы, авторы и книги собраны в одном поле. Можно искать по названию, имени, рубрике или теме.</p>
      </section>
      <SearchPanel materials={materials} books={books} authors={authors} />
    </main>
  );
}
