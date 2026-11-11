import Link from "next/link";
import {FeatureVisual} from "./Journal";
import { sketchFeature, sketchBooks, bookFeatures, featureBooks, type SketchFeature, type SketchBook } from "@/lib/sketch-feature";
import { DrawnObject } from "./Objects";
import { Cover } from "./Cover";
import { PublicationBlocks } from "./PublicationBlocks";
import s from "./FeaturePages.module.css";

export function SketchPublicationPage({feature=sketchFeature}:{feature?:SketchFeature}) {
  const books=featureBooks(feature);
  const showAside=books.length>0&&feature.format!=="cover-reviews";
  return <main className={s.page} data-format={feature.format}>
    <article>
      <header className={s.articleHero}>
        <div className={s.heroDrawing}>{feature.format==="book-week"&&books[0]?<Link href={books[0].href} aria-label={`Открыть книгу: ${books[0].title}`}><Cover book={books[0]} priority/></Link>:<FeatureVisual feature={feature}/>}</div>
        <div className={s.articleTitle}>
          <h1>{feature.materialTitle}</h1>
        </div>
      </header>
      <div className={s.readingLayout} data-has-books={showAside}>
        <div className={s.reading}>
          {!feature.isClientDraft&&<PublicationBlocks feature={feature}/>}
        </div>
        {showAside&&<aside className={s.relatedBook} aria-label="Книга в публикации">
          {books.map(book=><div key={book.slug}><Link href={book.href} className={s.relatedBookLink} aria-label={`Открыть книгу: ${book.title}`}><Cover book={book}/><h2>{book.title}</h2></Link></div>)}
        </aside>}
      </div>
    </article>
  </main>;
}

export function SketchBookPage({book=sketchBooks[0]}:{book?:SketchBook}) {
  const related=bookFeatures(book.slug);
  return <main className={s.page}>
    <section className={s.bookHero} aria-labelledby="book-title">
      <div className={s.bookCover}><Cover book={book} priority/></div>
      <div className={s.bookInfo}>
        <h1 id="book-title">{book.title}</h1>
        {book.author&&<p className={s.author}>{book.author}</p>}
        <dl className={s.bookDetails}>
          <div><dt>Издательство</dt><dd>{book.publisher.name}</dd></div>{book.year&&<div><dt>Год издания</dt><dd>{book.year}</dd></div>}{book.pages&&<div><dt>Страницы</dt><dd>{book.pages}</dd></div>}
        </dl>
        {book.purchaseUrl ? <div className={s.purchase}><a className={s.textLink} href={book.purchaseUrl} target="_blank" rel="noreferrer">Купить книгу</a></div> : null}
      </div>
    </section>
    {related.length>0&&<section className={s.bookJournal} aria-labelledby="book-journal-title">
      <h2 id="book-journal-title">Об этой книге<br />в журнале</h2>
      <div>{related.map(feature=><Link key={feature.slug} href={feature.materialHref} className={s.relatedArticle}>
        <div><FeatureVisual feature={feature}/></div>
        <span className={s.relatedArticleTitle}>{feature.materialTitle}</span>
      </Link>)}</div>
    </section>}
  </main>;
}
