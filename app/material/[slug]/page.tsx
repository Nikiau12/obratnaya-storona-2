import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTools } from "@/components/ArticleTools";
import { MaterialCard } from "@/components/MaterialCard";
import { getAuthor, getMaterial, materials } from "@/lib/content";
import Image from "next/image";

export function generateStaticParams() { return materials.map((material) => ({ slug: material.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const material = getMaterial((await params).slug);
  return material ? { title: `${material.title} — Обратная сторона`, description: material.excerpt } : {};
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const material = getMaterial((await params).slug);
  if (!material) notFound();
  const author = getAuthor(material.authorSlug);
  const currentIndex = materials.findIndex((item) => item.slug === material.slug);
  const next = materials[(currentIndex + 1) % materials.length];
  const related = materials.filter((item) => item.slug !== material.slug).slice(0, 2);

  return (
    <main className={`article-page article-${material.format.toLowerCase()}`}>
      <ArticleTools title={material.title} />
      <article>
        <section className="article-hero">
          <div className="eyebrow"><span>{material.format} · {material.rubric}</span><span>{material.date}</span></div>
          <h1>{material.title}</h1>
          <div className="article-intro"><p>{material.intro}</p><div className="article-byline"><a href={`/authors/${author?.slug}`}>{author?.name}</a><span>{author?.role}</span><span>{material.readTime}</span></div></div>
        </section>

        {material.image ? <figure className="article-cover"><Image src={material.image} alt="" width={1600} height={1000} priority /><figcaption>Изображение к материалу · Архив «Обратной стороны»</figcaption></figure> : null}

        <section className="article-body">
          <aside><b>Содержание</b><a href="#start">Начало</a>{material.questions?.map((item, index) => <a href={`#question-${index}`} key={item.question}>{item.question}</a>)}<a href="#related">Связанные материалы</a></aside>
          <div id="start">
            {material.format === "Аудио" ? <div className="media-player"><button aria-label="Воспроизвести аудио">▶</button><div><b>Голос бумаги</b><span>00:00 / 22:14</span><div className="waveform" /></div></div> : null}
            {material.format === "Видео" ? <div className="video-placeholder"><div className="black-hole-small" /><button>Смотреть видео ▶</button></div> : null}
            {material.body.map((paragraph, index) => <p className={index === material.body.length - 1 && material.format === "Лонгрид" ? "pull-quote" : ""} key={paragraph}>{paragraph}</p>)}
            {material.questions?.map((item, index) => <div className="qa" id={`question-${index}`} key={item.question}><h2>{item.question}</h2><p>{item.answer}</p></div>)}
            {material.format === "Галерея" ? <div className="article-gallery"><Image src="/editorial/black-hole-room.png" alt="Чёрная дыра в пространстве" width={900} height={900} /><Image src="/editorial/cyclonopedia.png" alt="Обложка книги Циклонопедия" width={900} height={900} /><div className="gallery-text">Оборот<br />изображения<br />№ 03</div></div> : null}
          </div>
        </section>
      </article>

      <section className="author-strip"><div className="author-monogram">{author?.initials}</div><div><span>Об авторе</span><h2>{author?.name}</h2><p>{author?.bio}</p><a className="text-link" href={`/authors/${author?.slug}`}>Все материалы автора<span className="link-arrow" aria-hidden="true"> ↗</span></a></div></section>
      <section className="related-section" id="related"><div className="simple-heading"><h2>Связанные материалы</h2></div><div className="related-grid">{related.map((item) => <MaterialCard material={item} compact key={item.slug} />)}</div></section>
      <a className="next-material" href={`/material/${next.slug}`}><span>Следующий материал</span><strong>{next.title}</strong><i className="link-arrow" aria-hidden="true">↗</i></a>
    </main>
  );
}
