"use client";
import { useState } from "react";
import Link from "next/link";
import { sketchFeature } from "@/lib/sketch-feature";
import { DrawnObject, type ObjectKind } from "./Objects";
import { SketchDialog } from "./Dialog";
import s from "./Sketch.module.css";

export const pieces: {kind:ObjectKind;name:string;title:string}[] = [
  {kind:"spider",name:"Паучок",title:sketchFeature.materialTitle},
  {kind:"cube",name:"Куб",title:"Ещё один текст"},
  {kind:"cloud",name:"Облако",title:"Текст с облаком"},
  {kind:"cup",name:"Чашка",title:"Текст, ещё немного текста"},
  {kind:"stone",name:"Камень",title:"Другой текст"},
  {kind:"flower",name:"Цветок",title:"И ещё один текст"},
];

export function Piece({index,onOpen}:{index:number;onOpen:(index:number)=>void}) {
  const item=pieces[index];
  const visual=<><span className={s.pieceDrawing}><DrawnObject kind={item.kind}/></span><span className={s.pieceTitle}>{item.title}</span></>;
  return <article className={s.piece} data-piece={index}>{index===0?<Link className={s.pieceButton} href={sketchFeature.materialHref} aria-label={`Читать публикацию: ${item.title}`}>{visual}</Link>:<button className={s.pieceButton} onClick={()=>onOpen(index)} aria-label={`Открыть эскиз: ${item.name}`}>{visual}</button>}</article>;
}

export function PieceDialog({index,close}:{index:number;close:()=>void}) {
  return <SketchDialog title={pieces[index].title} close={close}><div className={s.dialogDrawing}><DrawnObject kind={pieces[index].kind}/></div></SketchDialog>;
}

export function SketchJournal(){
  const [query,setQuery]=useState("");const [selected,setSelected]=useState<number|null>(null);
  const visible=pieces.map((piece,index)=>({...piece,index})).filter(p=>`${p.name} ${p.title}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  return <main className={s.page}><div className={s.journalHeading}><h1>Журнал</h1><label className={s.search}>Поиск<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className={s.journalFlow}>{visible.map(p=><Piece key={p.index} index={p.index} onOpen={setSelected}/>)}</div>{!visible.length&&<p role="status">По этому запросу ничего не найдено.</p>}{selected!==null&&<PieceDialog index={selected} close={()=>setSelected(null)}/>}</main>;
}
