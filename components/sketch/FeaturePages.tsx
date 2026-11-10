import Link from "next/link";
import {FeatureVisual} from "./Journal";
import { sketchFeature, sketchBooks, bookFeatures, featureBooks, type SketchFeature, type SketchBook } from "@/lib/sketch-feature";
import { DrawnObject } from "./Objects";
import { Cover } from "./Cover";
import { TextSpace, PublicationBlocks } from "./PublicationBlocks";
import s from "./FeaturePages.module.css";

function PageNavigation({ book = false }: { book?: boolean }) {
  return <nav className={s.navigation} aria-label="Разделы">
    <Link href="/">Главная</Link><Link href={book ? "/books" : "/materials"}>{book ? "Витрина" : "Журнал"}</Link>
  </nav>;
}

export function SketchPublicationPage({feature=sketchFeature}:{feature?:SketchFeature}) {
  const books=featureBooks(feature);
  const showAside=books.length>0&&feature.format!=="cover-reviews";
  return <main className={s.page} data-format={feature.format}>
    <PageNavigation />
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
          <p className={s.eyebrow}>Книга в публикации</p>
          {books.map(book=><div key={book.slug}><Link href={book.href} className={s.relatedBookLink} aria-label={`Открыть книгу: ${book.title}`}><Cover book={book}/><h2>{book.title}</h2></Link><Link className={s.textLink} href={book.href}>О книге</Link></div>)}
        </aside>}
      </div>
    </article>
    <nav className={s.bottomNav} aria-label="Продолжить чтение"><Link href="/materials">Весь журнал</Link><Link href="/">На главную</Link></nav>
  </main>;
}

export function SketchBookPage({book=sketchBooks[0]}:{book?:SketchBook}) {
  const related=bookFeatures(book.slug);
  return <main className={s.page}>
    <PageNavigation book />
    <section className={s.bookHero} aria-labelledby="book-title">
      <div className={s.bookCover}><Cover book={book} priority/></div>
      <div className={s.bookInfo}>
        <h1 id="book-title">{book.title}</h1>
        <p className={s.author}>{book.author}</p>
        <TextSpace label="Описание книги" lines={4} />
        <dl className={s.bookDetails}>
          <div><dt>Издательство</dt><dd>{book.publisher.name}</dd></div><div><dt>Год издания</dt><dd>—</dd></div><div><dt>Страницы</dt><dd>—</dd></div>
        </dl>
        {book.purchaseUrl ? <div className={s.purchase}><a className={s.textLink} href={book.purchaseUrl} target="_blank" rel="noreferrer">Купить книгу</a></div> : null}
      </div>
    </section>
    {related.length>0&&<section className={s.bookJournal} aria-labelledby="book-journal-title">
      <h2 id="book-journal-title">Об этой книге<br />в журнале</h2>
      <div>{related.map(feature=><Link key={feature.slug} href={feature.materialHref} className={s.relatedArticle}>
        <div><FeatureVisual feature={feature}/></div>
        <span className={s.relatedArticleTitle}>{feature.materialTitle}</span>
        <span className={s.textLink}>Читать публикацию</span>
      </Link>)}</div>
    </section>}
    <nav className={s.bottomNav} aria-label="Продолжить просмотр"><Link href="/books">Вся витрина</Link><Link href="/">На главную</Link></nav>
  </main>;
}
