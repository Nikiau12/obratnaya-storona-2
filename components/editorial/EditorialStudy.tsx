"use client";

import Link from "next/link";
import { sketchBooks, sketchFeatures, type SketchFeature } from "@/lib/sketch-feature";
import { homeMedia } from "@/lib/home-media";
import { SiteFooter } from "../SiteFooter";
import { useSiteTheme } from "../SiteTheme";
import { CardHole, RoomLines } from "../sketch/CardScene";
import { Cover } from "../sketch/Cover";
import { Note } from "../sketch/Interactions";
import { FeatureVisual } from "../sketch/Journal";
import { MediaObject } from "../sketch/MediaObject";
import { DrawnObject } from "../sketch/Objects";
import s from "./EditorialStudy.module.css";

const navigation = [["О нас", "/about"], ["Журнал", "/materials"], ["Витрина", "/books"]] as const;

function Masthead() {
  const { theme, setTheme } = useSiteTheme();

  return <header className={s.masthead}>
    <Link href="#main-content" className={s.skip}>К содержанию</Link>
    <div className={s.identity}>
      <Link href="/" className={s.wordmark} aria-label="Обратная сторона — на главную">Обратная<br />сторона</Link>
      <p>Констелляция независимых книжных практик</p>
    </div>
    <div className={s.room} aria-hidden="true"><RoomLines /><CardHole paused /></div>
    <div className={s.navigation}>
      <nav aria-label="Основная навигация">
        {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className={s.utilities}>
        <div className={s.themes} role="group" aria-label="Цвет фона">
          <button type="button" aria-label="Чёрный фон" aria-pressed={theme === "black"} onClick={() => setTheme("black")}><i className={s.black} /></button>
          <button type="button" aria-label="Белый фон" aria-pressed={theme === "white"} onClick={() => setTheme("white")}><i className={s.white} /></button>
        </div>
        <Link href="/search">Поиск</Link>
      </div>
    </div>
  </header>;
}

function Story({ feature, className }: { feature: SketchFeature; className: string }) {
  return <article className={`${s.story} ${className}`}>
    <Link href={feature.materialHref} aria-label={`Читать публикацию: ${feature.materialTitle}`}>
      {feature.image && <div className={s.visual}><FeatureVisual feature={feature} /></div>}
      <h2>{feature.materialTitle}</h2>
    </Link>
  </article>;
}

// The approved, still editorial composition. No editorial relationships are
// inferred from the proximity of stories and books.
export function EditorialStudy() {
  return <div className={s.root} data-composition="editorial">
    <Masthead />
    <main id="main-content" tabIndex={-1} className={s.layout}>
      <div className={s.journal}>
        <h1 className="sr-only">Журнал</h1>
        <Story feature={sketchFeatures[0]} className={s.lead} />
        <Story feature={sketchFeatures[1]} className={s.dreams} />
        <Story feature={sketchFeatures[2]} className={s.reviews} />

        <div className={s.interlude}>
          <Link className={s.engraving} href="/books/nosorog-19" aria-label="Открыть издание: Носорог №19">
            <img src="/katya/engraving.png" alt="" width={1380} height={1140} loading="lazy" />
          </Link>
          <div className={s.quotation}>
            <Note label="Мы уже завели наши часы — источник цитаты" content={<Link href="/books/nosorog-19">Икозамерон. Джакомо Казанова, «Носорог» №19</Link>}>
              <span>Мы уже завели<br />наши часы</span>
            </Note>
          </div>
          <div className={s.eye} aria-hidden="true"><DrawnObject kind="eye" /></div>
        </div>

        <Story feature={sketchFeatures[3]} className={s.press} />
        <Story feature={sketchFeatures[4]} className={s.map} />
        <div className={s.film}>
          <MediaObject source={homeMedia} />
          <Link href="/books/iguana">Игуана</Link>
        </div>
        <Link className={s.allJournal} href="/materials">Весь журнал</Link>
      </div>

      <aside className={s.shelf} aria-label="Витрина книг">
        <h2><Link href="/books">Витрина</Link></h2>
        <ol>
          {sketchBooks.map((book, index) => <li key={book.slug}>
            <Link href={book.href} data-book={book.slug} aria-label={`Открыть книгу: ${book.title}`}>
              <Cover book={book} priority={index < 2} />
              <span className={s.bookTitle}>{book.title}</span>
            </Link>
          </li>)}
        </ol>
        <Link className={s.allBooks} href="/books">Вся витрина</Link>
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
