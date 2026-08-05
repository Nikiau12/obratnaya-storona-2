import type { Metadata } from "next";
import { BookArchive } from "@/components/BookArchive";
import { books } from "@/lib/content";
export const metadata: Metadata = { title: "Книги и магазин — Обратная сторона", description: "Книжная витрина редакции и переходы в магазины издательств." };
export default function BooksPage() { return <main className="inner-page"><section className="page-hero page-hero-acid"><span>Книжная витрина</span><h1>Книги</h1><p>Выбор редакции: независимые издательства, теория, поэзия и проза. Покупка происходит на сайте издательства.</p></section><BookArchive books={books} /></main>; }
