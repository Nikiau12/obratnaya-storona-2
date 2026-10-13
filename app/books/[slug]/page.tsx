import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/home/BookCover";
import { MaterialCard } from "@/components/MaterialCard";
import { books,getBook,materials } from "@/lib/content";
import { publisherHref } from "@/lib/publishers";
import s from "@/components/editorial/Editorial.module.css";
export function generateStaticParams(){return books.map(b=>({slug:b.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const b=getBook((await params).slug);return b?{title:`${b.title} — Обратная сторона`,description:b.description||undefined}:{};}
export default async function BookPage({params}:{params:Promise<{slug:string}>}){
 const book=getBook((await params).slug);if(!book)notFound();
 const related=books.filter(b=>b.slug!==book.slug&&b.publisher===book.publisher);
 const texts=materials.filter(m=>m.mentionedBookSlugs?.includes(book.slug));
 return <main className={s.page}><nav className={s.breadcrumbs} aria-label="Разделы"><Link href="/">Главная</Link><Link href="/books">Книжный</Link><Link href={publisherHref(book.publisher)}>{book.publisher}</Link></nav><section className={s.bookHero}><div className={s.bookHeroCover}><BookCover book={book} priority/></div><div><span className={s.kicker}>{book.publisher}</span><h1 className={s.title}>{book.title}</h1><p className={s.bookAuthor}>{book.author}</p>{book.description?<p className={s.bookDescription}>{book.description}</p>:null}<dl className={s.details}>{book.year?<div><dt>Год</dt><dd>{book.year}</dd></div>:null}{book.isbn?<div><dt>ISBN</dt><dd>{book.isbn}</dd></div>:null}{book.availability?<div><dt>Наличие</dt><dd>{book.availability}</dd></div>:null}{book.price?<div><dt>Цена</dt><dd>{book.price}</dd></div>:null}</dl><div className={s.bookLinks}>{book.externalUrl?<><a className={s.action} href={book.externalUrl} target="_blank" rel="noreferrer">Купить у издательства</a><span className={s.muted}>Цена и наличие — на сайте издательства.</span></>:null}{book.sourceUrl?<a className={s.textLink} href={book.sourceUrl} target="_blank" rel="noreferrer">Об издании</a>:null}{texts.map(m=><Link className={s.textLink} key={m.slug} href={`/material/${m.slug}${m.template==="cover-reviews"?"#"+book.slug:""}`}>{m.rubric}</Link>)}</div></div></section>{texts.length?<section className={s.section}><h2 className={s.sectionTitle}>Об этой книге</h2><div className={s.articleList}>{texts.map(m=><MaterialCard material={m} key={m.slug}/>)}</div></section>:null}{related.length?<section className={s.section}><div className={s.sectionHead}><h2 className={s.sectionTitle}>У этого издательства</h2><Link className={s.textLink} href={publisherHref(book.publisher)}>Все книги издательства</Link></div><div className={s.catalog}>{related.map(b=><BookCard book={b} key={b.slug}/>)}</div></section>:null}</main>;
}
