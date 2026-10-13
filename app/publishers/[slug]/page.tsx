import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { MaterialCard } from "@/components/MaterialCard";
import { materials } from "@/lib/content";
import { publishers,getPublisher,publisherBooks } from "@/lib/publishers";
import s from "@/components/editorial/Editorial.module.css";
export function generateStaticParams(){return publishers.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const p=getPublisher((await params).slug);return {title:p?`${p.name} — Обратная сторона`:"Издательство не найдено"};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const p=getPublisher((await params).slug);if(!p)notFound();const books=publisherBooks(p.name);const texts=materials.filter(m=>!m.draft&&m.mentionedBookSlugs?.some(slug=>books.some(b=>b.slug===slug)));return <main className={s.page}><nav className={s.breadcrumbs}><Link href="/books">Книжный</Link><Link href="/publishers">Издательства</Link></nav><header className={s.hero}><span className={s.kicker}>Издательство</span><h1 className={s.title}>{p.name}</h1></header><section><h2 className={s.sectionTitle}>Книги</h2><div className={s.catalog}>{books.map(b=><BookCard book={b} key={b.slug}/>)}</div></section>{texts.length?<section className={s.section}><h2 className={s.sectionTitle}>В медиа</h2><div className={s.articleList}>{texts.map(m=><MaterialCard material={m} key={m.slug}/>)}</div></section>:null}</main>;}
