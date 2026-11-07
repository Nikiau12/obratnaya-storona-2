import Link from "next/link";
import { sketchFeature, type SketchFeature } from "@/lib/sketch-feature";
import { DrawnObject, DummyCover } from "./Objects";
import s from "./FeaturePages.module.css";

function TextSpace({ label, lines = 5 }: { label: string; lines?: number }) {
  return <div className={s.textSpace} role="img" aria-label={`Место для текста: ${label}`}>
    <div className={s.lines} aria-hidden="true">{Array.from({ length: lines }, (_, i) => <i key={i} />)}</div>
  </div>;
}

function PageNavigation({ book = false }: { book?: boolean }) {
  return <nav className={s.navigation} aria-label="Разделы">
    <Link href="/">Главная</Link><Link href={book ? "/books" : "/materials"}>{book ? "Витрина" : "Журнал"}</Link>
  </nav>;
}

export function SketchPublicationPage({feature=sketchFeature}:{feature?:SketchFeature}) {
  return <main className={s.page}>
    <PageNavigation />
    <article>
      <header className={s.articleHero}>
        <div className={s.heroDrawing}><DrawnObject kind={feature.kind} /></div>
        <div className={s.articleTitle}>
          <h1>{feature.materialTitle}</h1>
        </div>
      </header>
      <div className={s.readingLayout}>
        <div className={s.reading}>
          <TextSpace label="Лид" lines={3} />
          <TextSpace label="Текст публикации" lines={7} />
          <div className={s.quoteSpace}><TextSpace label="Цитата" lines={2} /></div>
          <TextSpace label="Продолжение текста" lines={6} />
        </div>
        <aside className={s.relatedBook} aria-label="Книга в публикации">
          <p className={s.eyebrow}>Книга в публикации</p>
          <Link href={feature.bookHref} className={s.relatedBookLink} aria-label={`Открыть книгу: ${feature.bookTitle}`}>
            <DummyCover index={feature.index} /><h2>{feature.bookTitle}</h2>
          </Link>
          <Link className={s.textLink} href={feature.bookHref}>О книге</Link>
        </aside>
      </div>
    </article>
    <nav className={s.bottomNav} aria-label="Продолжить чтение"><Link href="/materials">Весь журнал</Link><Link href="/">На главную</Link></nav>
  </main>;
}

export function SketchBookPage({feature=sketchFeature}:{feature?:SketchFeature}) {
  return <main className={s.page}>
    <PageNavigation book />
    <section className={s.bookHero} aria-labelledby="book-title">
      <div className={s.bookCover}><DummyCover index={feature.index} /></div>
      <div className={s.bookInfo}>
        <h1 id="book-title">{feature.bookTitle}</h1>
        <p className={s.author}>Имя автора книги</p>
        <TextSpace label="Описание книги" lines={4} />
        <dl className={s.bookDetails}>
          <div><dt>Издательство</dt><dd>—</dd></div><div><dt>Год издания</dt><dd>—</dd></div><div><dt>Страницы</dt><dd>—</dd></div>
        </dl>
        {feature.purchaseUrl ? <div className={s.purchase}><a className={s.textLink} href={feature.purchaseUrl} target="_blank" rel="noreferrer">Купить книгу</a></div> : null}
      </div>
    </section>
    <section className={s.bookJournal} aria-labelledby="book-journal-title">
      <h2 id="book-journal-title">Об этой книге<br />в журнале</h2>
      <Link href={feature.materialHref} className={s.relatedArticle}>
        <div><DrawnObject kind={feature.kind} /></div>
        <span className={s.relatedArticleTitle}>{feature.materialTitle}</span>
        <span className={s.textLink}>Читать публикацию</span>
      </Link>
    </section>
    <nav className={s.bottomNav} aria-label="Продолжить просмотр"><Link href="/books">Вся витрина</Link><Link href="/">На главную</Link></nav>
  </main>;
}
