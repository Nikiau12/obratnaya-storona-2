import Link from "next/link";
import { BookArchive } from "@/components/BookArchive";
import { books } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
import c from "@/components/editorial/Composition.module.css";
export const metadata={title:"Книжный — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={`${c.archiveHero} ${c.bookHeading}`}><span className={s.kicker}>Обратная сторона</span><h1 className={s.title}>Книжный</h1><Link className={s.textLink} href="/publishers">Издательства</Link></header><BookArchive books={books}/></main>;}
