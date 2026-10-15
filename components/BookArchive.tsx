"use client";
import { useId, useState } from "react";
import type { Book } from "@/lib/content";
import { BookCard } from "./BookCard";
import s from "./editorial/Editorial.module.css";
import c from "./editorial/Composition.module.css";

export function BookArchive({books}:{books:Book[]}) {
  const [query,setQuery]=useState(""),[publisher,setPublisher]=useState("Все"),[sort,setSort]=useState("catalog");
  const [availability,setAvailability]=useState(false),[expanded,setExpanded]=useState(false);
  const filterId=useId();
  const active=publisher!=="Все" || availability || sort!=="catalog";
  const visible=books.filter(book=>(publisher==="Все"||book.publisher===publisher)&&(!availability||book.availability==="В наличии")&&[book.title,book.author,book.publisher].join(" ").toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  if(sort==="title")visible.sort((a,b)=>a.title.localeCompare(b.title,"ru"));
  function reset(){setQuery("");setPublisher("Все");setSort("catalog");setAvailability(false);}
  return <section className={c.bookArchive} aria-label="Каталог книг">
    <div className={c.bookControls}>
      <label className={s.searchField}>Поиск по книгам<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, автор или издательство" /></label>
      <div className={c.filterActions}><button className={s.share} aria-expanded={expanded} aria-controls={filterId} onClick={()=>setExpanded(!expanded)}>{expanded ? "Скрыть фильтры" : "Издательства и порядок"}{active ? " · применены" : ""}</button>{active || query.trim() ? <button className={s.share} onClick={reset}>Сбросить фильтры</button> : null}</div>
      <div id={filterId} hidden={!expanded}>
        <div className={s.filterRow} aria-label="Фильтр по издательству">{["Все",...new Set(books.map(b=>b.publisher))].map(name=><button key={name} aria-pressed={name===publisher} onClick={()=>setPublisher(name)}>{name}</button>)}</div>
        <div className={`${s.selectRow} ${c.bookOptions}`}><label>Порядок<select value={sort} onChange={e=>setSort(e.target.value)}><option value="catalog">Порядок каталога</option><option value="title">По названию</option></select></label><label className={s.muted}><span><input type="checkbox" checked={availability} onChange={e=>setAvailability(e.target.checked)} /> Только в наличии</span></label></div>
      </div>
    </div>
    <p className={s.count} aria-live="polite">Найдено: {visible.length}</p>
    {visible.length ? <div className={c.bookFlow}>{visible.map(book=><BookCard book={book} key={book.slug} />)}</div> : <p className={s.empty}>Книги не найдены. Измените запрос или сбросьте фильтры.</p>}
  </section>;
}
