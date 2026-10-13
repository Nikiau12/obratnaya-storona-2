import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/home/BookCover";
import { books, getBook } from "@/lib/content";
import { homeFeatures } from "@/lib/home-content";
import Image from "next/image";
import Link from "next/link";

export function generateStaticParams() { return books.map((book) => ({ slug: book.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const book = getBook((await params).slug);
  return book ? { title: `${book.title} — Обратная сторона`, description: book.description || undefined } : {};
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const book = getBook((await params).slug);
  if (!book) notFound();
  const related = books.filter((item) => item.slug !== book.slug).slice(0, 3);
  const features = homeFeatures.filter((feature) => feature.mentionedBookSlugs.includes(book.slug));
  return <main className="book-page">
    <section className="book-detail">
      <div className="book-detail-cover">
        {book.imageCrop ? <div style={{ width: "min(100%, 340px)" }}><BookCover book={book} priority /></div> : <Image src={book.image} alt={`Обложка книги «${book.title}»`} width={900} height={book.slug === "ideal-museum" ? 900 : 1320} priority unoptimized />}
      </div>
      <div className="book-detail-copy">
        <span className="section-kicker">{book.publisher} · {book.year}</span>
        <h1>{book.title}</h1><p className="book-detail-author">{book.author}</p>
        {book.description ? <p className="book-description">{book.description}</p> : null}
        <dl><div><dt>ISBN</dt><dd>{book.isbn}</dd></div>
          {book.availability ? <div><dt>Наличие</dt><dd>{book.availability}</dd></div> : null}
          {book.price ? <div><dt>Цена</dt><dd>{book.price}</dd></div> : null}
        </dl>
        {book.externalUrl ? <><a className="button button-acid" href={book.externalUrl} target="_blank" rel="noreferrer">Купить у издательства</a><small>Ссылка ведёт во внешний магазин. Цена и наличие могут измениться.</small></> : null}
        {book.sourceUrl ? <a className="text-link" href={book.sourceUrl} target="_blank" rel="noreferrer">Об издании</a> : null}
        {features.map((feature) => <p key={feature.id} style={{ marginTop: 28 }}><Link className="text-link" href={`/#${feature.id}`}>{feature.rubric}</Link></p>)}
      </div>
    </section>
    <section className="related-section"><div className="simple-heading"><h2>Другие книги</h2><Link href="/books">Вся витрина</Link></div><div className="bookshelf catalog-books">{related.map((item) => <BookCard book={item} key={item.slug} />)}</div></section>
  </main>;
}
