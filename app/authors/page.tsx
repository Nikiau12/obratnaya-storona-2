import Link from "next/link";
import { authors } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Авторы — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><h1 className={s.title}>Авторы</h1></header><div className={s.people}>{authors.map(a=><article className={s.person} key={a.slug}><h2><Link href={`/authors/${a.slug}`}>{a.name}</Link></h2></article>)}</div></main>;}
