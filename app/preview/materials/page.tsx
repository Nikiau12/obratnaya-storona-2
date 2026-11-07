import { MaterialArchive } from "@/components/MaterialArchive";
import { materials } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export default function Page(){return <main className={s.page}><h1 className={s.title}>Архив исходных материалов</h1><MaterialArchive materials={materials}/></main>;}
