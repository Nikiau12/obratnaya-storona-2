"use client";
import { useState } from "react";
import Link from "next/link";
import { sketchFeatures,featureBooks,type SketchFeature } from "@/lib/sketch-feature";
import { DrawnObject } from "./Objects";
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
  return <main className={s.page} data-static="true"><div className={s.journalHeading}><h1>Журнал</h1><label className={s.search}>Поиск<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className={s.journalFlow}>{visible.map(p=><Piece key={p.index} index={p.index}/>)}</div>{!visible.length&&<p role="status">По этому запросу ничего не найдено.</p>}</main>;
}

export function FeatureVisual({feature}:{feature:SketchFeature}) {
 if(feature.image)return <img className={s.editorialImage} src={feature.image.src} width={feature.image.width} height={feature.image.height} alt={feature.image.alt??""}/>;
 if(feature.isClientDraft)return null;
 return <DrawnObject kind={feature.kind}/>;
}
