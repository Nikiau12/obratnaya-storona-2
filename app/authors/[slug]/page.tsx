import { notFound } from "next/navigation";
import { MaterialCard } from "@/components/MaterialCard";
import { authors,getAuthor,materials } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export function generateStaticParams(){return authors.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const a=getAuthor((await params).slug);return {title:a?`${a.name} — Обратная сторона`:"Автор не найден"};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const a=getAuthor((await params).slug);if(!a)notFound();return <main className={s.page}><header className={s.hero}><span className={s.draft}>Макет авторской страницы</span><h1 className={s.title}>{a.name}</h1><p className={s.kicker}>{a.role}</p><p className={s.intro}>{a.bio}</p></header><section><h2 className={s.sectionTitle}>Материалы автора</h2><div className={s.articleList}>{materials.filter(m=>m.authorSlug===a.slug).map(m=><MaterialCard key={m.slug} material={m}/>)}</div></section></main>;}
