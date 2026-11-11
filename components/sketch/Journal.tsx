"use client";
import { useState } from "react";
import Link from "next/link";
import { sketchFeatures,featureBooks,type SketchFeature } from "@/lib/sketch-feature";
import { FeatureVisual } from "./FeatureVisual";
export { FeatureVisual } from "./FeatureVisual";
import { EditorialStory } from "../editorial/EditorialStory";
import c from "../editorial/Collection.module.css";
import controls from "../editorial/Controls.module.css";
import { Cover } from "./Cover";
import s from "./Sketch.module.css";

export const pieces = sketchFeatures;

export function Piece({index,feature,onHover,onFocus,inlineBook=false}:{index:number;feature?:SketchFeature;onHover?:(index:number|null)=>void;onFocus?:(index:number|null)=>void;inlineBook?:boolean}) {
  const item=feature??pieces[index];
  const visual=<><span className={s.pieceDrawing}><FeatureVisual feature={item}/></span><span className={s.pieceTitle}>{item.materialTitle}</span></>;
  return <article className={s.piece} data-piece={index} onPointerEnter={event=>{if(event.pointerType!=="touch")onHover?.(index);}} onPointerLeave={()=>onHover?.(null)} onFocus={()=>onFocus?.(index)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))onFocus?.(null);}}><Link className={s.pieceButton} href={item.materialHref} aria-label={`Читать публикацию: ${item.materialTitle}`}>{visual}</Link>{inlineBook&&featureBooks(item).map(book=><Link key={book.slug} className={s.inlineBook} href={book.href} aria-label={`Книга в публикации: ${book.title}`}><Cover book={book}/><span>{book.title}</span></Link>)}</article>;
}

export function SketchJournal(){
  const [query,setQuery]=useState("");
  const visible=pieces.map((piece,index)=>({...piece,index})).filter(p=>`${p.name} ${p.materialTitle}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  return <main className={`${s.page} ${c.page}`}><div className={c.heading}><h1>Журнал</h1><label className={controls.search}><span className="sr-only">Поиск публикаций</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название публикации"/></label></div><div className={c.journal} data-filtered={Boolean(query.trim())}>{visible.map(p=><EditorialStory key={p.slug} feature={p} className={c.entry}/>)}</div>{!visible.length&&<p role="status">По этому запросу ничего не найдено.</p>}</main>;
}
