import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArticleTools } from "@/components/ArticleTools";
import { MaterialCard } from "@/components/MaterialCard";
import { books, getAuthor, getMaterial, materials } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

export function generateStaticParams() { return materials.map((material) => ({ slug: material.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const material = getMaterial((await params).slug);
  if (!material) return {};
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const image = material.image && host ? new URL(material.image, `${protocol}://${host}`).toString() : undefined;
  return {
    title: `${material.title} — Обратная сторона`,
    description: material.excerpt,
    openGraph: { title: material.title, description: material.excerpt, type: "article", images: image ? [{ url: image }] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title: material.title, description: material.excerpt, images: image ? [image] : [] },
  };
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const material = getMaterial((await params).slug);
  if (!material) notFound();
  const author = getAuthor(material.authorSlug);
  const currentIndex = materials.findIndex((item) => item.slug === material.slug);
  const next = materials[(currentIndex + 1) % materials.length];
  const related = materials.filter((item) => item.slug !== material.slug).slice(0, 2);
  const mentionedBooks = books.filter((book) => material.mentionedBookSlugs?.includes(book.slug));
  const hasCutout = material.image?.includes("/nosorog/cutouts/");
  const hasReference = material.image?.includes("/references/os/");

  return (
    <main className={`article-page article-${material.format.toLowerCase()} article-tone-${material.tone} ${hasCutout ? "has-cutout" : ""} ${hasReference ? "has-reference" : ""}`}>
      <ArticleTools title={material.title} />
      <article>
        <section className="article-hero">
          <div className="eyebrow"><span>{material.format} · {material.rubric}</span><span>{material.date}</span></div>
          <div className="article-hero-layout">
            <div><h1>{material.title}</h1><p className="article-deck">{material.intro}</p></div>
            {material.image ? <figure className="article-hero-image"><Image src={material.image} alt={`Изображение к материалу «${material.shortTitle}»`} width={900} height={900} priority /><figcaption>{material.imageCaption ?? "Фрагмент материала · временное изображение"}</figcaption></figure> : null}
          </div>
          <div className="article-byline"><Link href={`/authors/${author?.slug}`}>{author?.name}</Link><span>{author?.role}</span><span>{material.readTime}</span></div>
        </section>

        <section className="article-body">
          <aside><b>В материале</b><a href="#start">Начало</a>{material.sections?.map((item, index) => <a href={`#section-${index}`} key={item.title}>{String(index + 1).padStart(2, "0")} · {item.title}</a>)}{material.questions?.map((item, index) => <a href={`#question-${index}`} key={item.question}>Вопрос {String(index + 1).padStart(2, "0")}</a>)}{mentionedBooks.length ? <a href="#books-in-text">Книги в тексте</a> : null}<a href="#related">Дальше</a></aside>
          <div id="start">
            {material.format === "Аудио" ? <div className="media-player"><button aria-label="Воспроизвести аудио">▶</button><div><b>{material.shortTitle}</b><span>Демонстрационный плейлист · {material.readTime}</span><div className="waveform" /></div></div> : null}
            {material.format === "Видео" ? <div className="video-placeholder"><div className="black-hole-small" /><button>Смотреть видео ▶</button></div> : null}
            {material.body.map((paragraph, index) => <p className={index === material.body.length - 1 && material.format === "Лонгрид" ? "pull-quote" : ""} key={paragraph}>{paragraph}</p>)}
            {material.sections?.map((item, index) => <section className="review-block" id={`section-${index}`} key={item.title}><div><span>Фрагмент {String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.text}</p></div>{item.image ? <figure><Image src={item.image} alt={item.title} width={900} height={900} /><figcaption>{item.caption}</figcaption></figure> : null}</section>)}
            {material.questions?.map((item, index) => <section className="interview-turn" id={`question-${index}`} key={item.question}><span>Вопрос {String(index + 1).padStart(2, "0")}</span><h2>{item.question}</h2><div><b>Рон Силлиман</b><p>{item.answer}</p></div></section>)}
            {material.format === "Галерея" ? <div className="article-gallery"><Image src="/editorial/black-hole-room.png" alt="Чёрная дыра в пространстве" width={900} height={900} /><Image src="/editorial/cyclonopedia.png" alt="Обложка книги Циклонопедия" width={900} height={900} /><div className="gallery-text">Оборот<br />изображения<br />№ 03</div></div> : null}
            {mentionedBooks.length ? <section className="article-book-links" id="books-in-text"><div className="article-book-links-heading"><span>Отмечено в тексте</span><h2>Книги можно открыть в витрине</h2></div><div>{mentionedBooks.map((book) => <Link href={`/books/${book.slug}`} key={book.slug}><Image src={book.image} alt={`Обложка книги «${book.title}»`} width={590} height={590} unoptimized /><span>{book.publisher}</span><strong>{book.title}</strong><small>{book.author}</small><b>В витрину</b></Link>)}</div></section> : null}
          </div>
        </section>
      </article>

      <section className="author-strip"><div className="author-monogram">{author?.initials}</div><div><span>Об авторе</span><h2>{author?.name}</h2><p>{author?.bio}</p><Link className="text-link" href={`/authors/${author?.slug}`}>Все материалы автора</Link></div></section>
      <section className="related-section" id="related"><div className="simple-heading"><h2>Связанные материалы</h2></div><div className="related-grid">{related.map((item) => <MaterialCard material={item} compact key={item.slug} />)}</div></section>
      <Link className="next-material" href={`/material/${next.slug}`}><span>Следующий материал</span><strong>{next.title}</strong></Link>
    </main>
  );
}
