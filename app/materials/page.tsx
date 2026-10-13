import Link from "next/link";
import { MaterialArchive } from "@/components/MaterialArchive";
import { materials } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Медиа — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><span className={s.kicker}>Обратная сторона</span><h1 className={s.title}>Медиа</h1><nav className={s.links}><Link className={s.textLink} href="/rubrics">Рубрики</Link><Link className={s.textLink} href="/authors">Авторы</Link></nav></header><MaterialArchive materials={materials}/></main>;}
