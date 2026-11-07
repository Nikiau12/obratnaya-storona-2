"use client";
import { useState } from "react";
import Link from "next/link";
import { sketchFeature } from "@/lib/sketch-feature";
import { publishers } from "@/lib/publishers";
import { DummyCover } from "./Objects";
import { SketchDialog } from "./Dialog";
import s from "./Sketch.module.css";

const entries=Array.from({length:12},(_,index)=>({index,publisher:publishers[index%publishers.length]}));
export function SketchShowcase(){
  const [publisher,setPublisher]=useState("");const [sort,setSort]=useState("order");const [query,setQuery]=useState("");const [selected,setSelected]=useState<number|null>(null);
  const visible=entries.filter(e=>(!publisher||e.publisher.slug===publisher)&&`книга ${String(e.index+1).padStart(2,"0")} ${e.publisher.name}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  if(sort==="reverse")visible.reverse();
  return <main className={s.page}>
    <div className={s.storeHeading}><h1>Витрина</h1><p>Кураторская выборка<br/>независимых издательств<br/>и самиздата.</p></div>
    <div className={s.storeLayout}><section className={s.storeMain} aria-label="Каталог книг">
      <div className={s.storeControls}><label className={s.search}>Поиск<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Книга или издательство"/></label><label className={s.sort}>Порядок<select value={sort} onChange={e=>setSort(e.target.value)}><option value="order">Порядок витрины</option><option value="reverse">В обратном порядке</option></select></label></div>
      <p className={s.resultCount} role="status">{publisher?publishers.find(p=>p.slug===publisher)?.name:"Все издательства"} · {visible.length}</p>
      <div className={s.bookGrid}>{visible.map(({index,publisher:pub})=>{
        const cover=<><DummyCover index={index}/><span className={s.bookTitle}>Название книги {String(index+1).padStart(2,"0")}</span></>;
        return <article key={index} className={s.storeBook}>{index===0?<Link href={sketchFeature.bookHref} aria-label={`Открыть книгу: ${sketchFeature.bookTitle}`}>{cover}</Link>:<button aria-label={`Открыть макет книги ${index+1}`} onClick={()=>setSelected(index)}>{cover}</button>}<p>Имя автора</p><small>{pub.name}</small></article>;
      })}</div>{!visible.length&&<p>Ничего не найдено. Попробуйте другой запрос.</p>}
    </section><aside className={s.publishers} aria-label="Издательства"><h2>Издательства</h2><button className={s.publisherButton} aria-pressed={!publisher} onClick={()=>setPublisher("")}>Все</button>{publishers.map(pub=><div key={pub.slug} className={s.publisherItem}><button className={s.publisherButton} aria-pressed={pub.slug===publisher} onClick={()=>setPublisher(pub.slug)} aria-describedby={`publisher-${pub.slug}`}>{pub.name}</button><div className={s.publisherDescription} id={`publisher-${pub.slug}`}><strong>{pub.name}</strong>{pub.slug==="nosorog"?<p>Независимое издательство, выросшее из одноимённого литературного журнала.</p>:null}</div></div>)}</aside></div>
    {selected!==null&&<SketchDialog title={`Название книги ${String(selected+1).padStart(2,"0")}`} close={()=>setSelected(null)}><div className={s.bookDialog}><DummyCover index={selected}/><div><p>Имя автора</p><p>{entries[selected].publisher.name}</p></div></div></SketchDialog>}
  </main>;
}
