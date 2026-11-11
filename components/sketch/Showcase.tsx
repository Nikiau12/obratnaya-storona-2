"use client";
import { useState } from "react";
import Link from "next/link";
import { catalogBooks as sketchBooks } from "@/lib/sketch-feature";
import { publishers } from "@/lib/publishers";
import { Cover } from "./Cover";
import { PublisherList } from "./PublisherList";
import s from "./Sketch.module.css";
import c from "../editorial/Collection.module.css";
import controls from "../editorial/Controls.module.css";
import { ChoiceMenu } from "../editorial/ChoiceMenu";

export function SketchShowcase({initialPublisher="",initialQuery="",initialSort="order"}:{initialPublisher?:string;initialQuery?:string;initialSort?:string}){
  const [publisher,setPublisherState]=useState(initialPublisher);const [sort,setSortState]=useState(initialSort);const [query,setQueryState]=useState(initialQuery);
  function remember(key:string,value:string){const url=new URL(location.href);if(value&&value!=="order")url.searchParams.set(key,value);else url.searchParams.delete(key);history.replaceState(history.state,"",url);}
  function setPublisher(value:string){setPublisherState(value);remember("publisher",value);}
  function setQuery(value:string){setQueryState(value);remember("q",value);}
  function setSort(value:string){setSortState(value);remember("sort",value);}
  const visible=sketchBooks.filter(e=>(!publisher||e.publisher.slug===publisher)&&`${e.title} ${e.author} ${e.publisher.name}`.toLocaleLowerCase("ru").replaceAll("ё","е").includes(query.toLocaleLowerCase("ru").trim().replaceAll("ё","е")));
  const selectedPublisher=publishers.find(item=>item.slug===publisher);
  if(sort==="reverse")visible.reverse();
  return <main className={`${s.page} ${c.page} ${c.store}`}>
    <h1 className="sr-only">Витрина</h1>
    <div className={s.storeLayout} data-store-layout><section className={s.storeMain} aria-label="Каталог книг">
      <div className={s.mobilePublishers}><ChoiceMenu label="Издательства" value={publisher} onChange={setPublisher} options={[{value:"",label:"Все издательства"},...publishers.map(item=>({value:item.slug,label:item.name}))]}/>{selectedPublisher?.description&&<p>{selectedPublisher.description}</p>}</div>
      <div className={s.storeControls} data-store-controls><label className={controls.search}><span className="sr-only">Поиск книг</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Книга или издательство"/></label><ChoiceMenu label="Порядок книг" value={sort} onChange={setSort} options={[{value:"order",label:"Порядок витрины"},{value:"reverse",label:"В обратном порядке"}]}/></div>
      <div className={s.bookGrid} data-catalog>{visible.map(book=><article key={book.slug} className={s.storeBook}><Link href={book.href} aria-label={`Открыть книгу: ${book.title}`}><span className={s.coverStage}><Cover book={book}/></span><span className={s.bookTitle}>{book.title}</span></Link><p>{book.author}</p><small>{book.publisher.name}</small></article>)}</div>{!visible.length&&<p>Ничего не найдено. Попробуйте другой запрос.</p>}
    </section><PublisherList selected={publisher} onSelect={setPublisher}/></div>
  </main>;
}
