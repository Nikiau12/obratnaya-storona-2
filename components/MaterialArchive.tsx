"use client";
import { Fragment, useId, useState, type ReactNode } from "react";
import { authors, type Material } from "@/lib/content";
import { homeQuote } from "@/lib/home-content";
import { MaterialCard } from "./MaterialCard";
import s from "./editorial/Editorial.module.css";
import c from "./editorial/Composition.module.css";

export function MaterialArchive({ materials, children }: { materials: Material[]; children?: ReactNode }) {
  const [query,setQuery]=useState(""),[format,setFormat]=useState("Все"),[rubric,setRubric]=useState("Все рубрики");
  const [author,setAuthor]=useState("Все авторы"),[tag,setTag]=useState("Все теги"),[sort,setSort]=useState("catalog");
  const [expanded,setExpanded]=useState(false);
  const filterId=useId();
  const filtered=Boolean(query.trim() || format!=="Все" || rubric!=="Все рубрики" || author!=="Все авторы" || tag!=="Все теги");
  const visible=materials.filter(item => [item.title,item.excerpt,item.rubric,...item.tags,authors.find(a=>a.slug===item.authorSlug)?.name].join(" ").toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")) && (format==="Все" || item.format===format) && (rubric==="Все рубрики" || item.rubric===rubric) && (author==="Все авторы" || item.authorSlug===author) && (tag==="Все теги" || item.tags.includes(tag)));
  if(sort==="title")visible.sort((a,b)=>a.title.localeCompare(b.title,"ru"));
  function reset(){setQuery("");setFormat("Все");setRubric("Все рубрики");setAuthor("Все авторы");setTag("Все теги");setSort("catalog");}
  return <section className={c.archive} aria-label="Архив публикаций">
    <div className={c.controls}>
      <label className={s.searchField}>Поиск по материалам<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, автор, рубрика или тег" /></label>
      <div className={s.filterRow} aria-label="Фильтр по формату">{["Все",...new Set(materials.map(m=>m.format))].map(item=><button key={item} aria-pressed={format===item} onClick={()=>setFormat(item)}>{item}</button>)}</div>
      <div className={c.filterActions}><button className={s.share} aria-expanded={expanded} aria-controls={filterId} onClick={()=>setExpanded(!expanded)}>{expanded ? "Скрыть фильтры" : "Дополнительные фильтры"}</button>{filtered || sort!=="catalog" ? <button className={s.share} onClick={reset}>Сбросить фильтры</button> : null}</div>
      <div id={filterId} hidden={!expanded}><div className={`${s.selectRow} ${c.advanced}`}>
        <label>Рубрика<select value={rubric} onChange={e=>setRubric(e.target.value)}>{["Все рубрики",...new Set(materials.map(m=>m.rubric))].map(r=><option key={r}>{r}</option>)}</select></label>
        <label>Автор<select value={author} onChange={e=>setAuthor(e.target.value)}><option>Все авторы</option>{authors.filter(a=>materials.some(m=>m.authorSlug===a.slug)).map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}</select></label>
        <label>Тег<select value={tag} onChange={e=>setTag(e.target.value)}>{["Все теги",...new Set(materials.flatMap(m=>m.tags))].map(t=><option key={t}>{t}</option>)}</select></label>
        <label>Порядок<select value={sort} onChange={e=>setSort(e.target.value)}><option value="catalog">Порядок каталога</option><option value="title">По названию</option></select></label>
      </div></div>
    </div>{children}<p className={s.count} aria-live="polite">Найдено: {visible.length}</p>
    {visible.length ? <div className={c.mediaFlow}>{visible.map((material,index)=><Fragment key={material.slug}><div className={c.mediaEntry} data-position={index%5}><MaterialCard material={material}/></div>{index===1 && !filtered && sort==="catalog" ? <figure className={c.editorialPause}><blockquote>«{homeQuote.text}»</blockquote><figcaption>{homeQuote.attribution}</figcaption></figure> : null}</Fragment>)}</div> : <p className={s.empty}>Ничего не найдено. Измените запрос или сбросьте фильтры.</p>}
  </section>;
}
