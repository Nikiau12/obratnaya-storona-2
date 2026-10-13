import { SearchPanel } from "@/components/SearchPanel";
import { materials,books,authors } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Поиск — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><h1 className={s.title}>Поиск</h1></header><SearchPanel materials={materials} books={books} authors={authors}/></main>;}
