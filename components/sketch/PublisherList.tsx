"use client";
import {useState,useRef,useEffect} from "react";
import {publishers} from "@/lib/publishers";
import s from "./Sketch.module.css";

export function PublisherList({selected,onSelect}:{selected:string;onSelect:(slug:string)=>void}){
  const [open,setOpen]=useState<string|null>(null);
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(null);};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[]);
  return <aside ref={root} className={s.publishers} aria-label="Издательства" onKeyDown={event=>{if(event.key==="Escape"){setOpen(null);event.stopPropagation();}}}>
    <h2>Издательства</h2><button className={s.publisherButton} aria-pressed={!selected} onClick={()=>{onSelect("");setOpen(null);}}>Все</button>
    {publishers.map(pub=><div key={pub.slug} className={s.publisherItem} onPointerEnter={event=>{if(event.pointerType!=="touch"&&pub.description)setOpen(pub.slug);}} onPointerLeave={()=>setOpen(null)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setOpen(null);}}>
      <button className={s.publisherButton} aria-pressed={pub.slug===selected} aria-describedby={open===pub.slug&&pub.description?`publisher-${pub.slug}`:undefined} onFocus={()=>setOpen(pub.description?pub.slug:null)} onClick={()=>{onSelect(pub.slug);setOpen(pub.description?pub.slug:null);}}>{pub.name}</button>
      {pub.description&&<div className={s.publisherDescription} id={`publisher-${pub.slug}`} role="tooltip" hidden={open!==pub.slug}><p>{pub.description}</p></div>}
    </div>)}
  </aside>;
}
