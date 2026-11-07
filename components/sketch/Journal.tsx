"use client";
import { useState } from "react";
import { DrawnObject, type ObjectKind } from "./Objects";
import { SketchDialog } from "./Dialog";
import s from "./Sketch.module.css";

export const pieces: {kind:ObjectKind;name:string;title:string}[] = [
  {kind:"spider",name:"Паучок",title:"Текст, текст, текст"},
  {kind:"cube",name:"Куб",title:"Ещё один текст"},
  {kind:"cloud",name:"Облако",title:"Текст с облаком"},
  {kind:"cup",name:"Чашка",title:"Текст, ещё немного текста"},
  {kind:"stone",name:"Камень",title:"Другой текст"},
  {kind:"flower",name:"Цветок",title:"И ещё один текст"},
];

export function Piece({index,onOpen}:{index:number;onOpen:(index:number)=>void}) {
  const item=pieces[index];
  return <article className={s.piece} data-piece={index}><button className={s.pieceButton} onClick={()=>onOpen(index)} aria-label={`Открыть эскиз: ${item.name}`}><span className={s.pieceDrawing}><DrawnObject kind={item.kind}/></span><span className={s.pieceTitle}>{item.title}</span></button><p className={s.byline}>Имя автора</p><p className={s.excerpt}>Здесь начинается текст. Несколько слов, ещё несколько слов…</p></article>;
}

export function PieceDialog({index,close}:{index:number;close:()=>void}) {
  return <SketchDialog title={pieces[index].title} close={close}><div className={s.dialogDrawing}><DrawnObject kind={pieces[index].kind}/></div><p className={s.byline}>Имя автора</p><p className={s.sampleText}>Здесь будет текст публикации. Сейчас это пример композиции: изображение, заголовок, автор и спокойная полоса чтения.</p></SketchDialog>;
}

export function SketchJournal(){
  const [query,setQuery]=useState("");const [selected,setSelected]=useState<number|null>(null);
  const visible=pieces.map((piece,index)=>({...piece,index})).filter(p=>`${p.name} ${p.title}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  return <main className={s.page}><div className={s.journalHeading}><h1>Журнал</h1><label className={s.search}>Поиск<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Текст, облако, чашка…"/></label></div><p className={s.note}>Эскиз · тексты и иллюстрации условные</p><div className={s.journalFlow}>{visible.map(p=><Piece key={p.index} index={p.index} onOpen={setSelected}/>)}</div>{!visible.length&&<p role="status">По этому запросу ничего не найдено.</p>}{selected!==null&&<PieceDialog index={selected} close={()=>setSelected(null)}/>}</main>;
}
