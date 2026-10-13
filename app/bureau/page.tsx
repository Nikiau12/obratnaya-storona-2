import Link from "next/link";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Бюро — Обратная сторона"};
export default function Page(){return <main className={s.page}><span className={s.kicker}>Обратная сторона</span><section className={s.holding}><h1 className={s.title}>Бюро</h1><nav className={s.holdingLinks} aria-label="Разделы проекта"><Link href="/materials">Медиа</Link><Link href="/books">Книжный</Link><Link href="/about">О нас</Link></nav></section>{/* Утверждённый текст будет добавлен сюда. */}</main>;}
