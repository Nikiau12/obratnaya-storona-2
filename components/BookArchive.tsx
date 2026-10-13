"use client";
import { useState } from "react";
import type { Book } from "@/lib/content";
import { BookCard } from "./BookCard";
import s from "./editorial/Editorial.module.css";
export function BookArchive({books}:{books:Book[]}) {
 const [query,setQuery]=useState(""),[publisher,setPublisher]=useState("Все"),[sort,setSort]=useState("catalog");
 const [availability,setAvailability]=useState(false);
 const visible=books.filter(book=>(publisher==="Все"||book.publisher===publisher)&&(!availability||book.availability==="В наличии")&&[book.title,book.author,book.publisher].join(" ").toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
 if(sort==="title")visible.sort((a,b)=>a.title.localeCompare(b.title,"ru"));
 function reset(){setQuery("");setPublisher("Все");setSort("catalog");setAvailability(false);}
 return <section aria-label="Каталог книг"><div className={s.controls}><label className={s.searchField}>Поиск по книгам<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, автор или издательство" /></label><div className={s.filterRow} aria-label="Фильтр по издательству">{["Все",...new Set(books.map(b=>b.publisher))].map(name=><button key={name} aria-pressed={name===publisher} onClick={()=>setPublisher(name)}>{name}</button>)}</div><div className={s.selectRow}><label>Порядок<select value={sort} onChange={e=>setSort(e.target.value)}><option value="catalog">Порядок каталога</option><option value="title">По названию</option></select></label><label className={s.muted}><span><input type="checkbox" checked={availability} onChange={e=>setAvailability(e.target.checked)} /> Только в наличии</span></label><button className={s.share} onClick={reset}>Сбросить фильтры</button></div></div><p className={s.count} aria-live="polite">Найдено: {visible.length}</p>{visible.length ? <div className={s.catalog}>{visible.map(book=><BookCard book={book} key={book.slug} />)}</div> : <p className={s.empty}>Книги не найдены. Измените запрос или сбросьте фильтры.</p>}</section>;
}
