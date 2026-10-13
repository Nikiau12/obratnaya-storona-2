import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleTools } from "@/components/ArticleTools";
import { MaterialCard } from "@/components/MaterialCard";
import { BookCard } from "@/components/BookCard";
import { MaterialTemplate } from "@/components/editorial/ReadingTemplates";
import { books, getAuthor, getMaterial, materials } from "@/lib/content";
import s from "@/components/editorial/Editorial.module.css";
export function generateStaticParams(){return materials.map(m=>({slug:m.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const m=getMaterial((await params).slug);if(!m)return {};
 const image=m.image?new URL(m.image,"https://obratnaya-storona-2.young-mite-9319.chatgpt.site").href:undefined;
 return {title:`${m.title} — Обратная сторона`,description:m.excerpt,openGraph:{title:m.title,description:m.excerpt,type:"article",images:image?[{url:image}]:[]},twitter:{card:image?"summary_large_image":"summary",title:m.title,images:image?[image]:[]}};
}
export default async function MaterialPage({params}:{params:Promise<{slug:string}>}){
 const material=getMaterial((await params).slug);if(!material)notFound();
 const author=getAuthor(material.authorSlug);
 const mentioned=books.filter(b=>material.mentionedBookSlugs?.includes(b.slug));
 const related=materials.filter(m=>m.slug!==material.slug && !m.draft).slice(0,2);
 return <main className={s.page}><nav className={s.breadcrumbs} aria-label="Разделы"><Link href="/">Главная</Link><Link href="/materials">Медиа</Link></nav><ArticleTools title={material.title}/>{material.draft?<p className={s.draft}>Макет публикации · демонстрационный текст</p>:null}<article><MaterialTemplate material={material}/></article>{author?<p className={s.muted}>Автор в макете: <Link className={s.textLink} href={`/authors/${author.slug}`}>{author.name}</Link></p>:null}{mentioned.length?<section className={s.section} id="books-in-text"><h2 className={s.sectionTitle}>Книги в материале</h2><div className={s.catalog}>{mentioned.map(book=><BookCard book={book} key={book.slug}/>)}</div></section>:null}<section className={s.section}><div className={s.sectionHead}><h2 className={s.sectionTitle}>Другие материалы</h2><Link className={s.textLink} href="/materials">Все материалы</Link></div><div className={s.articleList}>{related.map(m=><MaterialCard material={m} key={m.slug}/>)}</div></section></main>;
}
