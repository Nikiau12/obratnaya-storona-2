import Link from "next/link";
import { BookArchive } from "@/components/BookArchive";
import { books } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Книжный — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><span className={s.kicker}>Обратная сторона</span><h1 className={s.title}>Книжный</h1><Link className={s.textLink} href="/publishers">Издательства</Link></header><BookArchive books={books}/></main>;}
