import Link from "next/link";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Предложить текст — Обратная сторона"};
export default function Page(){return <main className={s.page}><section className={s.holding}><h1 className={s.title}>Предложить текст</h1><nav className={s.holdingLinks} aria-label="Разделы проекта"><Link href="/materials">Журнал</Link><Link href="/books">Витрина</Link><Link href="/bureau">Бюро</Link></nav></section>{/* Утверждённый текст будет добавлен сюда. */}</main>;}
