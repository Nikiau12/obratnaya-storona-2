import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { books, getBook, type Book, type Material } from "@/lib/content";
import { publisherHref } from "@/lib/publishers";
import { BookCover } from "../home/BookCover";
import { InlineText } from "./InlineText";
import s from "./Editorial.module.css";

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return <>{paragraphs.map((paragraph, index) => <p key={index}><InlineText text={paragraph} /></p>)}</>;
}

function ReadingBlocks({ material }: { material: Material }) {
  return <>{material.readingBlocks?.map((block, index) => block.type === "image" ? <figure className={s.essayImage} key={index}><Image src={block.src} alt={block.alt} width={1000} height={750} unoptimized />{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure> : block.type === "quote" ? <blockquote className={s.pullQuote} key={index}><InlineText text={block.text} /></blockquote> : block.type === "poem" ? <div className={s.poem} key={index}><InlineText text={block.text} /></div> : <p key={index}><InlineText text={block.text} /></p>)}</>;
}

export function BookReadingLinks({ book }: { book: Book }) {
  return <div className={s.bookLinks}>
    <Link className={s.textLink} href={`/books/${book.slug}`}>Книга в книжном</Link>
    <Link className={s.textLink} href={publisherHref(book.publisher)}>{book.publisher}</Link>
    {book.externalUrl ? <a className={s.action} href={book.externalUrl} target="_blank" rel="noreferrer">Купить у издательства</a> : null}
  </div>;
}

export function CoverReviewsTemplate({ material }: { material: Material }) {
  const chapters = material.reviewChapters ?? [];
  return <>
    <header className={s.readingHeader}>
      <span className={s.kicker}>{material.rubric}</span>
      <h1 className={s.title}>{material.shortTitle}</h1>
      <nav className={s.contents} aria-label="Обложки в материале">{chapters.map((chapter) => <a key={chapter.bookSlug} href={`#${chapter.bookSlug}`}>{chapter.author}</a>)}</nav>
    </header>
    {chapters.map((chapter) => {
      const book = getBook(chapter.bookSlug)!;
      return <section className={s.reviewChapter} id={chapter.bookSlug} key={chapter.bookSlug}>
        <aside className={s.chapterCover}><Link href={`/books/${book.slug}`} aria-label={`${book.title} — открыть книгу`}><BookCover book={book} /></Link><BookReadingLinks book={book} /></aside>
        <div className={s.chapterCopy}><span className={s.kicker}>{chapter.author}</span><h2>{chapter.title}</h2><div className={s.prose}><Paragraphs paragraphs={chapter.paragraphs} /></div></div>
      </section>;
    })}
  </>;
}

export function BookWeekTemplate({ material }: { material: Material }) {
  const book = getBook(material.mentionedBookSlugs?.[0] ?? "");
  if (!book) return <EssayTemplate material={material} />;
  return <>
    <header className={s.weeklyHero}>
      <Link className={s.weeklyCover} href={`/books/${book.slug}`}><BookCover book={book} priority /></Link>
      <div><span className={s.kicker}>{material.rubric}</span><h1 className={s.title}>{material.shortTitle}</h1>{material.subtitle ? <p className={s.intro}>{material.subtitle}</p> : null}<p className={s.muted}>{book.author}<br />{book.publisher} · {book.year}</p></div>
    </header>
    <div className={s.readingGrid}>
      <aside className={s.readingAside} aria-label="Книга и навигация"><BookReadingLinks book={book} /><div className={s.links}><a className={s.textLink} href="#essay-start">Текст</a>{material.footnotes?.length ? <a className={s.textLink} href="#footnotes">Сноски</a> : null}</div></aside>
      <div className={s.prose} id="essay-start">
        {material.body.map((paragraph, index) => <Fragment key={index}><p><InlineText text={paragraph} /></p>{material.pullQuotes?.filter(quote => quote.afterParagraph === index).map(quote => <blockquote className={s.pullQuote} key={quote.text}><InlineText text={quote.text} /></blockquote>)}</Fragment>)}
        {material.footnotes?.length ? <section className={s.footnotes} id="footnotes" role="doc-endnotes"><h2>Сноски</h2><ol>{material.footnotes.map((note) => <li key={note.id} id={`note-${note.id}`}><p><InlineText text={note.text} /></p><a href={`#note-ref-${note.id}`} role="doc-backlink" aria-label={`Вернуться к сноске ${note.id} в тексте`}>К тексту</a></li>)}</ol></section> : null}
      </div>
    </div>
  </>;
}

function MaterialHeading({ material }: { material: Material }) {
  return <header className={s.readingHeader}><span className={s.kicker}>{material.format} · {material.rubric}</span><h1 className={s.title}>{material.title}</h1>{material.intro ? <p className={s.intro}>{material.intro}</p> : null}</header>;
}

function MaterialImage({ material }: { material: Material }) {
  return material.image ? <figure className={s.essayImage}><Image src={material.image} alt={material.imageCaption || material.title} width={1100} height={750} unoptimized />{material.imageCaption ? <figcaption>{material.imageCaption}</figcaption> : null}</figure> : null;
}

export function EssayTemplate({ material }: { material: Material }) {
  return <><MaterialHeading material={material} /><MaterialImage material={material} /><div className={`${s.essayText} ${s.prose}`}><Paragraphs paragraphs={material.body} /><ReadingBlocks material={material} /></div></>;
}

export function InterviewTemplate({ material }: { material: Material }) {
  return <><MaterialHeading material={material} /><div className={s.interview}><div className={s.prose}><Paragraphs paragraphs={material.body} /></div>{material.questions?.map((turn, index) => <section className={s.question} id={`question-${index + 1}`} key={turn.question}><h2>{turn.question}</h2><div className={s.prose}><p><InlineText text={turn.answer} /></p></div></section>)}<ReadingBlocks material={material} /></div></>;
}

export function VisualTemplate({ material }: { material: Material }) {
  return <><MaterialHeading material={material} /><div className={`${s.essayText} ${s.prose}`}><Paragraphs paragraphs={material.body} /></div><div className={s.visualSequence}>{!material.sections?.length ? <MaterialImage material={material} /> : null}<ReadingBlocks material={material} />{material.sections?.map((section, index) => <section className={s.visualItem} id={`section-${index + 1}`} key={section.title}>{section.image ? <figure><Image src={section.image} alt={section.caption || section.title} width={900} height={900} unoptimized />{section.caption ? <figcaption className={s.muted}>{section.caption}</figcaption> : null}</figure> : null}<div><h2 className={s.sectionTitle}>{section.title}</h2><div className={s.prose}><p><InlineText text={section.text} /></p></div></div></section>)}</div></>;
}

export function MediaTemplate({ material }: { material: Material }) {
  return <><MaterialHeading material={material} /><div className={s.mediaArea}>{material.mediaUrl ? material.format === "Видео" ? <video controls preload="metadata" src={material.mediaUrl} poster={material.image} aria-label={material.title} /> : <audio controls preload="metadata" src={material.mediaUrl} aria-label={material.title} /> : <p className={s.mediaMissing}>{material.format === "Видео" ? "Видеозапись пока не добавлена." : "Аудиозапись пока не добавлена."}</p>}</div><div className={`${s.essayText} ${s.prose}`}><Paragraphs paragraphs={material.body} /></div></>;
}

export function ObjectWeekTemplate({ material }: { material: Material }) {
  return <><MaterialHeading material={material} /><MaterialImage material={material} /><div className={`${s.essayText} ${s.prose}`}><Paragraphs paragraphs={material.body} /></div></>;
}

export function MaterialTemplate({ material }: { material: Material }) {
  if (material.template === "cover-reviews") return <CoverReviewsTemplate material={material} />;
  if (material.template === "book-week") return <BookWeekTemplate material={material} />;
  if (material.template === "object-week" || material.format === "Объект") return <ObjectWeekTemplate material={material} />;
  const templates = { "Лонгрид": EssayTemplate, "Интервью": InterviewTemplate, "Обзор": VisualTemplate, "Галерея": VisualTemplate, "Аудио": MediaTemplate, "Видео": MediaTemplate };
  const Template = templates[material.format];
  return <Template material={material} />;
}

export function MentionedBooks({ material }: { material: Material }) {
  const mentioned = books.filter((book) => material.mentionedBookSlugs?.includes(book.slug));
  return mentioned.length ? <nav className={s.links} aria-label="Книги в материале">{mentioned.map((book) => <Link className={s.textLink} key={book.slug} href={`/books/${book.slug}`}>{book.title}</Link>)}</nav> : null;
}
