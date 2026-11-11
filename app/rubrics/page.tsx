import { MaterialCard } from "@/components/MaterialCard";
import { materials,rubrics } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export const metadata={title:"Рубрики — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.hero}><h1 className={s.title}>Рубрики</h1></header>{rubrics.map(r=><section className={s.section} key={r.name}><h2 className={s.sectionTitle}>{r.name}</h2><div className={s.articleList}>{materials.filter(m=>m.rubric===r.name).map(m=><MaterialCard key={m.slug} material={m}/>)}</div></section>)}</main>;}
