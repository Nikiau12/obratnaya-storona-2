import { BookArchive } from "@/components/BookArchive";
import { books } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export default function Page(){return <main className={s.page}><h1 className={s.title}>Каталог с исходными книгами</h1><BookArchive books={books}/></main>;}
