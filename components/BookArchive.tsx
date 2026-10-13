"use client";

import { useMemo, useState } from "react";
import type { Book } from "@/lib/content";
import { BookCard } from "./BookCard";

export function BookArchive({ books }: { books: Book[] }) {
  const [publisher, setPublisher] = useState("Все");
  const [availability, setAvailability] = useState(false);
  const publishers = ["Все", ...Array.from(new Set(books.map((book) => book.publisher)))];
  const visible = useMemo(() => books.filter((book) =>
    (publisher === "Все" || book.publisher === publisher) &&
    (!availability || book.availability === "В наличии")
  ), [availability, books, publisher]);
  const bookNoun = new Intl.PluralRules("ru").select(visible.length);

  return (
    <section className="book-archive">
      <div className="book-toolbar">
        <div className="filter-row" aria-label="Фильтр по издательству">
          {publishers.map((item) => <button className={publisher === item ? "active" : ""} onClick={() => setPublisher(item)} key={item}>{item}</button>)}
        </div>
        <div className="book-toolbar-meta"><span>{visible.length} {bookNoun === "one" ? "книга" : bookNoun === "few" ? "книги" : "книг"}</span><label className="check-label"><input type="checkbox" checked={availability} onChange={(event) => setAvailability(event.target.checked)} /> Только в наличии</label></div>
      </div>
      <div className="bookshelf catalog-books book-catalog">{visible.map((book) => <BookCard book={book} key={book.slug} />)}</div>
    </section>
  );
}
