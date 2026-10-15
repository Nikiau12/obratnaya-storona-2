import Link from "next/link";
import { notFound } from "next/navigation";
import { previewMaterials } from "@/lib/preview-content";
import { MaterialTemplate, MentionedBooks } from "@/components/editorial/ReadingTemplates";
import s from "@/components/editorial/Editorial.module.css";
export function generateStaticParams() { return previewMaterials.map(({slug}) => ({slug})); }
export default async function PreviewMaterial({params}:{params:Promise<{slug:string}>}) {
  const slug = (await params).slug;
  const entry = previewMaterials.find(m => m.slug === slug);
  if (!entry) notFound();
  return <main className={s.page}><nav className={s.breadcrumbs}><Link href="/preview">Все макеты</Link><Link href="/preview/home">Расширенная главная</Link></nav><p className={s.draft}>Макет публикации · текст и изображения для проверки вёрстки</p><article><MaterialTemplate material={entry}/></article>{entry.mentionedBookSlugs?.length ? <section className={s.section}><h2 className={s.sectionTitle}>Книги для пробы связи с книжным</h2><MentionedBooks material={entry}/></section> : null}</main>;
}
