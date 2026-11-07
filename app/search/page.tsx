import { SearchPanel } from "@/components/SearchPanel";
import { searchEntries } from "@/lib/site-search";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Поиск — Обратная сторона"};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const {q}=await searchParams;return <main className={s.page}><header className={s.hero}><h1 className={s.title}>Поиск</h1></header><SearchPanel entries={searchEntries} initialQuery={typeof q==="string"?q:""}/></main>;}
