"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import t from "./HomeComparison.module.css";

export type HomeVariant = "collage" | "balanced";

// The editorial composition with the original business-card motion. No relationships are
// inferred from the proximity of stories and books.
export function EditorialStudy({ initialVariant = "collage" }: { initialVariant?: HomeVariant }) {
  const [variant, setVariant] = useState<HomeVariant>(initialVariant);
  useEffect(() => {
    const restore = () => setVariant(new URLSearchParams(location.search).get("composition") === "balanced" ? "balanced" : "collage");
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function selectVariant(next: HomeVariant) {
    setVariant(next);
    const url = new URL(location.href);
    url.searchParams.set("composition", next);
    history.replaceState(history.state, "", url);
  }
  return <div className={`${s.root} ${t.trial}`} data-composition="editorial" data-home-variant={variant}>
    <div className={t.switcher} role="group" aria-label="Вариант композиции главной">
      <button type="button" aria-pressed={variant === "collage"} onClick={() => selectVariant("collage")}>А · В коллаже</button>
      <button type="button" aria-pressed={variant === "balanced"} onClick={() => selectVariant("balanced")}>Б · Собранная</button>
    </div>
    <SiteHeader home className={t.header} />
    <main id="main-content" tabIndex={-1} className={`${s.layout} ${t.layout}`}>
      <div className={`${s.journal} ${t.journal}`}>
        <h1 className="sr-only">Журнал</h1>
        <Story feature={sketchFeatures[0]} className={`${s.lead} ${t.lead}`} />
        <Story feature={sketchFeatures[1]} className={`${s.dreams} ${t.dreams}`} />
        <Story feature={sketchFeatures[2]} className={`${s.reviews} ${t.reviews}`} />

        <div className={`${s.interlude} ${t.interlude}`}>
          <Link className={s.engraving} href="/books/nosorog-19" aria-label="Открыть издание: Носорог №19">
            <img src="/katya/engraving.png" alt="" width={1380} height={1140} loading="lazy" />
          </Link>
          <div className={`${s.quotation} ${t.quotation}`}>
            <Note label="Мы уже завели наши часы — источник цитаты" content={<Link href="/books/nosorog-19">Икозамерон. Джакомо Казанова, «Носорог» №19</Link>}>
              <span>Мы уже завели<br />наши часы</span>
            </Note>
          </div>
          <div className={s.eye} aria-hidden="true"><PaintedEye /></div>
        </div>

        <Story feature={sketchFeatures[3]} className={`${s.press} ${t.press}`} />
        <Story feature={sketchFeatures[4]} className={`${s.map} ${t.map}`} />
        <div className={`${s.film} ${t.film}`}>
          <MediaObject source={homeMedia} />
          <Link href="/books/iguana">Игуана</Link>
        </div>
      </div>

      <aside className={`${s.shelf} ${t.shelf}`} aria-label="Витрина книг">
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
