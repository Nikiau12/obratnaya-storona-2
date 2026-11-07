"use client";
import { useState } from "react";
import Link from "next/link";
import type { SearchEntry } from "@/lib/site-search";
import s from "./editorial/Editorial.module.css";
export function SearchPanel({entries,initialQuery=""}:{entries:SearchEntry[];initialQuery?:string}){
 const [query,setQueryState]=useState(initialQuery);const normalized=query.trim().toLocaleLowerCase("ru").replaceAll("ё","е");
 function setQuery(value:string){setQueryState(value);const url=new URL(location.href);if(value)url.searchParams.set("q",value);else url.searchParams.delete("q");history.replaceState(history.state,"",url);}
 const results=normalized.length<2?[]:entries.filter(r=>r.search.toLocaleLowerCase("ru").replaceAll("ё","е").includes(normalized));
 return <section><label className={s.searchField}>Что вы хотите найти?<input type="search" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, автор, издательство" /></label><div className={s.filterRow}>{["обложки","Петербург","Носорог"].map(word=><button key={word} onClick={()=>setQuery(word)}>{word}</button>)}{query?<button onClick={()=>setQuery("")}>Очистить поиск</button>:null}</div><p className={s.count} aria-live="polite">{normalized.length<2?"Введите не менее двух букв":`Найдено: ${results.length}`}</p><div className={s.results}>{results.map(r=><Link href={r.href} key={r.href}><span className={s.kicker}>{r.type}</span><h2>{r.title}</h2><p>{r.subtitle}</p></Link>)}</div>{normalized.length>=2&&!results.length?<p className={s.empty}>Ничего не найдено. Попробуйте другое слово.</p>:null}</section>;
}
