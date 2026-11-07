"use client";
import { useState } from "react";
import Link from "next/link";
import { sketchFeatures } from "@/lib/sketch-feature";
import { DrawnObject, DummyCover } from "./Objects";
import s from "./Sketch.module.css";

export const pieces = sketchFeatures;

export function Piece({index,onHover,onFocus,inlineBook=false}:{index:number;onHover?:(index:number|null)=>void;onFocus?:(index:number|null)=>void;inlineBook?:boolean}) {
  const item=pieces[index];
  const visual=<><span className={s.pieceDrawing}><DrawnObject kind={item.kind}/></span><span className={s.pieceTitle}>{item.materialTitle}</span></>;
  return <article className={s.piece} data-piece={index} onPointerEnter={event=>{if(event.pointerType!=="touch")onHover?.(index);}} onPointerLeave={()=>onHover?.(null)} onFocus={()=>onFocus?.(index)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))onFocus?.(null);}}><Link className={s.pieceButton} href={item.materialHref} aria-label={`Читать публикацию: ${item.materialTitle}`}>{visual}</Link>{inlineBook&&<Link className={s.inlineBook} href={item.bookHref} aria-label={`Книга в публикации: ${item.bookTitle}`}><DummyCover index={item.index}/><span>{item.bookTitle}</span></Link>}</article>;
}

export function SketchJournal(){
  const [query,setQuery]=useState("");
  const visible=pieces.map((piece,index)=>({...piece,index})).filter(p=>`${p.name} ${p.materialTitle}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  return <main className={s.page}><div className={s.journalHeading}><h1>Журнал</h1><label className={s.search}>Поиск<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className={s.journalFlow}>{visible.map(p=><Piece key={p.index} index={p.index}/>)}</div>{!visible.length&&<p role="status">По этому запросу ничего не найдено.</p>}</main>;
}
