import type { Book } from "@/lib/content";
import Image from "next/image";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-item">
      <a className="book-cover-link" href={`/books/${book.slug}`} aria-label={`${book.title} — подробнее`}>
        <Image className="book-cover" src={book.image} alt={`Обложка книги «${book.title}»`} width={800} height={1180} sizes="(max-width: 700px) 50vw, 240px" unoptimized />
        <span className="availability">{book.availability}</span>
      </a>
      <div className="book-card-copy">
        <p>{book.publisher}</p>
        <h3><a href={`/books/${book.slug}`}>{book.title}</a></h3>
        <p>{book.author}</p>
        <div className="book-actions">
          <strong>{book.price}</strong>
          <a className="text-link" href={`/books/${book.slug}`}>О книге ↗</a>
        </div>
      </div>
    </article>
  );
}
