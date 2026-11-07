import Link from "next/link";
import s from "@/components/editorial/Editorial.module.css";
export default function Page(){return <main className={s.page}><span className={s.kicker}>404</span><h1 className={s.title}>Эта сторона пока пуста</h1><nav className={s.links}><Link className={s.textLink} href="/">Главная</Link><Link className={s.textLink} href="/materials">Журнал</Link><Link className={s.textLink} href="/books">Витрина</Link></nav></main>;}
