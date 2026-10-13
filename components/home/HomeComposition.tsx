"use client";

import { useState, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/content";
import type { HomeFeature } from "@/lib/home-content";
import { SiteHeader } from "../SiteHeader";
import { BookCover } from "./BookCover";
import styles from "./HomeComposition.module.css";

type Props = { features: HomeFeature[]; books: Book[]; quote: { text: string; attribution: string } };

export function HomeComposition({ features, books, quote }: Props) {
  const [theme, setTheme] = useState<"petrol" | "earth">("petrol");
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = features.find((feature) => feature.id === (focused ?? hovered));
  const selected = active?.mentionedBookSlugs.filter((slug) => books.some((book) => book.slug === slug)) ?? [];
  const hasSelection = selected.length > 0;

  function clearFocus(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null);
  }

  return (
    <div className={styles.root} data-theme={theme}>
      <SiteHeader home />
      <div className={styles.layout}>
        <main id="main-content" tabIndex={-1} className={styles.main}>
          <div className={styles.intro}>
            <h1>Медленное литературное медиа</h1>
            <div className={styles.themePicker} role="group" aria-label="Цвет фона">
              <span>Фон</span>
              <button type="button" onClick={() => setTheme("petrol")} aria-pressed={theme === "petrol"} aria-label="Нефтяной фон" title="Нефтяной"><i className={styles.petrolSwatch} /></button>
              <button type="button" onClick={() => setTheme("earth")} aria-pressed={theme === "earth"} aria-label="Землисто-коричневый фон" title="Землисто-коричневый"><i className={styles.earthSwatch} /></button>
            </div>
          </div>
          <div className={styles.composition}>
            {features.map((feature, index) => {
              const relatedBooks = feature.mentionedBookSlugs.flatMap((slug) => books.filter((book) => book.slug === slug));
              return (
                <article key={feature.id} id={feature.id} className={index === 0 ? styles.review : styles.weekly}
                  onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(feature.id); }}
                  onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(feature.id)} onBlur={clearFocus}>
                  <a className={styles.featureLink} href={feature.href} target="_blank" rel="noreferrer" aria-label={`${feature.rubric}: ${feature.title} — открыть текст в новой вкладке`}>
                    <div className={index === 0 ? styles.coverGroup : styles.singleCover} aria-hidden="true">
                      {relatedBooks.map((book) => <BookCover key={book.slug} book={book} priority={index === 0} decorative />)}
                    </div>
                    <div className={styles.featureCopy}>
                      <span className={styles.kicker}>{feature.rubric}</span>
                      <h2>{feature.title}</h2>
                      {feature.subtitle ? <p className={styles.subtitle}>{feature.subtitle}</p> : null}
                      <p className={styles.excerpt}>{feature.excerpt}</p>
                      <span className={styles.read}>Читать</span>
                    </div>
                  </a>
                  {relatedBooks.length > 0 ? <div className={styles.inlineBooks}>
                    <span className={styles.inlineLabel}>Книги из материала</span>
                    <div>{relatedBooks.map((book) => <Link key={book.slug} href={`/books/${book.slug}`}><BookCover book={book} decorative /><span>{book.title}</span></Link>)}</div>
                  </div> : null}
                </article>
              );
            })}
            <figure className={styles.quote}><blockquote>«{quote.text}»</blockquote><figcaption>{quote.attribution}</figcaption></figure>
            <figure className={styles.object}><Image src="/nosorog/cutouts/swinging-man.png" alt="Вырезанная фигура человека на качелях" width={600} height={600} sizes="(max-width: 700px) 50vw, 300px" unoptimized /></figure>
          </div>
          <div className={styles.archiveLink}><Link href="/materials">Медиа</Link></div>
        </main>

        <aside className={styles.shelf} aria-label="Книжная полка">
          <div className={styles.shelfSticky}>
            <Link className={styles.shelfHeading} href="/books">Книжный</Link>
            <div className={styles.shelfBooks} data-active={hasSelection}>
              {books.map((book) => <Link className={styles.shelfBook} data-selected={selected.includes(book.slug)} data-book={book.slug} href={`/books/${book.slug}`} key={book.slug} aria-label={`${book.author}. ${book.title}`}>
                <BookCover book={book} decorative />
                <span className={styles.bookCaption}>{book.title}</span>
              </Link>)}
            </div>
            <Link href="/books" className={styles.allBooks}>Все книги</Link>
          </div>
        </aside>
      </div>

      <footer className={styles.homeFooter}><span>Обратная сторона</span><p>Медиа и книжный.<br />Независимые издательства и самиздат.</p><Link href="/about">О нас</Link></footer>
    </div>
  );
}
