"use client";
import { useState } from "react";
import Link from "next/link";
import type { Author,Book,Material } from "@/lib/content";
import { publishers } from "@/lib/publishers";
import s from "./editorial/Editorial.module.css";
export function SearchPanel({materials,books,authors}:{materials:Material[];books:Book[];authors:Author[]}){
 const [query,setQuery]=useState("");const normalized=query.trim().toLocaleLowerCase("ru");
 const results=normalized.length<2?[]:[
 ...materials.map(m=>({type:m.draft?"Материал · макет":"Материал",title:m.title,subtitle:m.rubric,href:`/material/${m.slug}`,search:[m.title,m.excerpt,m.rubric,...m.tags].join(" ")})),
 ...books.map(b=>({type:"Книга",title:b.title,subtitle:`${b.author} · ${b.publisher}`,href:`/books/${b.slug}`,search:[b.title,b.author,b.publisher].join(" ")})),
 ...publishers.map(p=>({type:"Издательство",title:p.name,subtitle:"Книги издательства",href:`/publishers/${p.slug}`,search:p.name})),
 ...authors.map(a=>({type:"Автор · макет",title:a.name,subtitle:a.role,href:`/authors/${a.slug}`,search:[a.name,a.role].join(" ")}))
 ].filter(r=>r.search.toLocaleLowerCase("ru").includes(normalized));
 return <section><label className={s.searchField}>Что вы хотите найти?<input type="search" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, автор, издательство" /></label><div className={s.filterRow}>{["обложки","Петербург","Носорог"].map(word=><button key={word} onClick={()=>setQuery(word)}>{word}</button>)}{query?<button onClick={()=>setQuery("")}>Очистить поиск</button>:null}</div><p className={s.count} aria-live="polite">{normalized.length<2?"Введите не менее двух букв":`Найдено: ${results.length}`}</p><div className={s.results}>{results.map(r=><Link href={r.href} key={r.href}><span className={s.kicker}>{r.type}</span><h2>{r.title}</h2><p>{r.subtitle}</p></Link>)}</div>{normalized.length>=2&&!results.length?<p className={s.empty}>Ничего не найдено. Попробуйте другое слово.</p>:null}</section>;
}
