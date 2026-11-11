import Link from "next/link";
import { BookCover } from "@/components/home/BookCover";
import { publishers,publisherBooks } from "@/lib/publishers";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Издательства — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><h1 className={s.title}>Издательства</h1><Link className={s.textLink} href="/books">Все книги</Link></header><div className={s.publisherList}>{publishers.map(p=><Link className={s.publisherRow} key={p.slug} href={`/publishers/${p.slug}`}><div><h2>{p.name}</h2></div><div className={s.publisherPreview} aria-hidden="true">{publisherBooks(p.name).slice(0,3).map(b=><BookCover book={b} key={b.slug} decorative/>)}</div></Link>)}</div></main>;}
