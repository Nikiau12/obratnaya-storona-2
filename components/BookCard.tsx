import Link from "next/link";
import type { Book } from "@/lib/content";
import { publisherHref } from "@/lib/publishers";
import { BookCover } from "./home/BookCover";
import s from "./editorial/Editorial.module.css";
export function BookCard({ book }: { book: Book }) {
 return <article className={s.bookCard}><Link className={s.bookImage} href={`/books/${book.slug}`} aria-label={book.title}><BookCover book={book} /></Link><Link className={s.publisher} href={publisherHref(book.publisher)}>{book.publisher}</Link><h3><Link href={`/books/${book.slug}`}>{book.title}</Link></h3><p>{book.author}</p>{book.price ? <small>{book.price}</small> : null}{book.availability ? <small>{book.availability}</small> : null}</article>;
}
