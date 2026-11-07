"use client";
import Link from "next/link";
import { useState } from "react";
import { sketchFeature } from "@/lib/sketch-feature";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { BlackHole, DrawnObject, DummyCover } from "./Objects";
import { AudioObject, Note } from "./Interactions";
import { Piece, PieceDialog } from "./Journal";
import s from "./Sketch.module.css";

export function SketchHome(){
  const [selected,setSelected]=useState<number|null>(null);
  return <div className={s.root}><SiteHeader home/><main id="main-content" tabIndex={-1} className={s.home}>
    <div className={s.editorial}>
      <div className={s.opening}><Link className={s.portal} href="/constellation" aria-label="Чёрная дыра: открыть визитку Обратной стороны"><BlackHole/></Link><h1 className="sr-only">Журнал</h1><div className={s.eye}><Note label="Открыть заметку у глаза" content={<div className={s.textLines} aria-hidden="true"><i/><i/><i/></div>}><DrawnObject kind="eye"/></Note></div></div>
      <div className={s.homeFlow}>
        <Piece index={0} onOpen={setSelected}/><Piece index={1} onOpen={setSelected}/><Piece index={2} onOpen={setSelected}/>
        <Piece index={3} onOpen={setSelected}/><div className={s.sound}><AudioObject/></div>
        <div className={s.quote}><Note label="Прочитать цитату" content={<div className={s.textLines} aria-hidden="true"><i/><i/><i/></div>}><span className={s.uh}>Ух…</span></Note></div>
        <Piece index={4} onOpen={setSelected}/><Piece index={5} onOpen={setSelected}/>
      </div><Link className={s.more} href="/materials">Весь журнал</Link>
    </div>
    <aside className={s.shelf} aria-label="Витрина книг"><div className={s.shelfTop}><Link href="/books">Витрина</Link></div><div className={s.shelfBooks}>{[0,1,2,3,4].map(i=><Link href={i===0?sketchFeature.bookHref:"/books"} key={i} className={s.shelfBook} aria-label={i===0?`Открыть книгу: ${sketchFeature.bookTitle}`:`В витрину: макет книги ${i+1}`}><DummyCover index={i}/><span>{i===0?sketchFeature.bookTitle:"Название книги"}</span></Link>)}</div><Link href="/books" className={s.more}>Вся витрина</Link></aside>
  </main><SiteFooter/>{selected!==null&&<PieceDialog index={selected} close={()=>setSelected(null)}/>}</div>;
}
