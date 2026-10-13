import Link from "next/link";
import { authors } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Авторы — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><span className={s.kicker}>Медиа</span><h1 className={s.title}>Авторы</h1><p className={s.muted}>Макеты авторских страниц</p></header><div className={s.people}>{authors.map(a=><article className={s.person} key={a.slug}><span className={s.kicker}>{a.role}</span><h2><Link href={`/authors/${a.slug}`}>{a.name}</Link></h2><p>{a.bio}</p><Link className={s.textLink} href={`/authors/${a.slug}`}>Материалы автора</Link></article>)}</div></main>;}
