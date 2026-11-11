"use client";

import Link from "next/link";
import { sketchBooks, sketchFeatures } from "@/lib/sketch-feature";
import { homeMedia } from "@/lib/home-media";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { EditorialStory as Story } from "./EditorialStory";
import { Cover } from "../sketch/Cover";
import { Note } from "../sketch/Interactions";
import { MediaObject } from "../sketch/MediaObject";
import { PaintedEye } from "./PaintedEye";
import s from "./EditorialStudy.module.css";

// The editorial composition with the original business-card motion. No relationships are
// inferred from the proximity of stories and books.
export function EditorialStudy() {
  return <div className={s.root} data-composition="editorial">
    <SiteHeader home />
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
          <div className={s.eye} aria-hidden="true"><PaintedEye /></div>
        </div>

        <Story feature={sketchFeatures[3]} className={s.press} />
        <Story feature={sketchFeatures[4]} className={s.map} />
        <div className={s.film}>
          <MediaObject source={homeMedia} />
          <Link href="/books/iguana">Игуана</Link>
        </div>
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
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
