"use client";
import Link from "next/link";
import { useState } from "react";
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
      <div className={s.opening}><Link className={s.portal} href="/constellation" aria-label="Чёрная дыра: открыть визитку Обратной стороны"><BlackHole/><span>На другую сторону</span></Link><h1 className={s.homeTitle}>Журнал независимого<br/>книгоиздания</h1><div className={s.eye}><Note label="Открыть заметку у глаза" content={<p>Здесь будет маленькая заметка. Текст появляется рядом с глазом.</p>}><DrawnObject kind="eye"/></Note></div></div>
      <p className={s.note}>Эскиз · тексты, рисунки и обложки условные</p>
      <div className={s.homeFlow}>
        <Piece index={0} onOpen={setSelected}/><Piece index={1} onOpen={setSelected}/><Piece index={2} onOpen={setSelected}/>
        <Piece index={3} onOpen={setSelected}/><div className={s.sound}><AudioObject/></div>
        <div className={s.quote}><Note label="Прочитать цитату" content={<><p>«Здесь появится цитата»</p><span>Автор, название книги</span></>}><span className={s.uh}>Ух…</span></Note></div>
        <Piece index={4} onOpen={setSelected}/><Piece index={5} onOpen={setSelected}/>
      </div><Link className={s.more} href="/materials">Весь журнал</Link>
    </div>
    <aside className={s.shelf} aria-label="Витрина книг"><div className={s.shelfTop}><Link href="/books">Витрина</Link><p>Независимые издательства<br/>и самиздат</p></div><div className={s.shelfBooks}>{[0,1,2,3,4].map(i=><Link href="/books" key={i} className={s.shelfBook} aria-label={`В витрину: макет книги ${i+1}`}><DummyCover index={i}/><span>Название книги</span></Link>)}</div><Link href="/books" className={s.more}>Вся витрина</Link></aside>
  </main><SiteFooter/>{selected!==null&&<PieceDialog index={selected} close={()=>setSelected(null)}/>}</div>;
}
