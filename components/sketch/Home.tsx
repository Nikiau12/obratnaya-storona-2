"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { sketchFeatures } from "@/lib/sketch-feature";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { BlackHole, DrawnObject, DummyCover } from "./Objects";
import { AudioObject, Note } from "./Interactions";
import { Piece } from "./Journal";
import { PortalLink } from "./Portal";
import { useReadingPiece } from "./useReadingPiece";
import s from "./Sketch.module.css";

export function SketchHome(){
  const shelf = useRef<HTMLDivElement>(null);
  const {flow,active,setHovered,setFocused}=useReadingPiece();
  const piece=(index:number)=><Piece index={index} onHover={setHovered} onFocus={setFocused} inlineBook/>;
  useEffect(() => {
    const reveal=() => {
      const container=shelf.current;
      const item=container?.querySelector<HTMLElement>('[data-selected="true"]');
      if(!container||!item||matchMedia("(max-width:760px)").matches)return;
      const frame=container.getBoundingClientRect(), book=item.getBoundingClientRect();
      if(book.top<frame.top+8||book.bottom>frame.bottom-8){
        container.scrollTo({top:container.scrollTop+book.top-frame.top-(container.clientHeight-book.height)/2,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
      }
    };
    reveal();
    window.addEventListener("resize",reveal);
    return () => window.removeEventListener("resize",reveal);
  },[active]);
  return <div className={s.root}><SiteHeader home/><main id="main-content" tabIndex={-1} className={s.home}>
    <div className={s.editorial}>
      <div className={s.opening}><PortalLink className={s.portal} label="Чёрная дыра: открыть визитку Обратной стороны" animate><BlackHole/></PortalLink><h1 className="sr-only">Журнал</h1><div className={s.eye}><Note label="Открыть заметку у глаза" content={<div className={s.textLines} aria-hidden="true"><i/><i/><i/></div>}><DrawnObject kind="eye"/></Note></div></div>
      <div className={s.homeFlow} ref={flow}>
        {piece(0)}{piece(1)}{piece(2)}
        {piece(3)}<div className={s.sound}><AudioObject/></div>
        <div className={s.quote}><Note label="Прочитать цитату" content={<div className={s.textLines} aria-hidden="true"><i/><i/><i/></div>}><span className={s.uh}>Ух…</span></Note></div>
        {piece(4)}{piece(5)}
      </div><Link className={s.more} href="/materials">Весь журнал</Link>
    </div>
    <aside className={s.shelf} aria-label="Витрина книг"><div className={s.shelfTop}><Link href="/books">Витрина</Link></div><div className={s.shelfBooks} ref={shelf} data-reading-piece={active}>{sketchFeatures.map(item=><Link href={item.bookHref} key={item.slug} className={s.shelfBook} data-book={item.slug} data-selected={item.index===active} aria-label={`Открыть книгу: ${item.bookTitle}`}><DummyCover index={item.index}/><span>{item.bookTitle}</span></Link>)}</div><Link href="/books" className={s.more}>Вся витрина</Link></aside>
  </main><SiteFooter/></div>;
}
