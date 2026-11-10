"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import s from "./Sketch.module.css";

export function Note({ label, children, content }: {label:string;children:ReactNode;content:ReactNode}) {
  const [open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const id=useId();
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(false);};
    document.addEventListener("pointerdown",outside);
    return()=>document.removeEventListener("pointerdown",outside);
  },[open]);
  return <div ref={root} className={s.noteObject} onPointerEnter={e=>{if(e.pointerType!=="touch")setOpen(true);}} onPointerLeave={()=>{if(!root.current?.contains(document.activeElement))setOpen(false);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==="Escape"){trigger.current?.focus();setOpen(false);}}}>
    <button ref={trigger} className={s.objectButton} aria-label={label} aria-expanded={open} aria-controls={id} onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))setOpen(true);}} onClick={()=>setOpen(true)}>{children}</button>
    <div id={id} className={s.popover} hidden={!open}>{content}</div>
  </div>;
}
