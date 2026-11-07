"use client";
import { useId, useState, type ReactNode } from "react";
import s from "./Sketch.module.css";

export function Note({ label, children, content }: {label:string;children:ReactNode;content:ReactNode}) {
  const [open,setOpen]=useState(false);
  const id=useId();
  return <div className={s.noteObject} onPointerEnter={e=>{if(e.pointerType!=="touch")setOpen(true);}} onPointerLeave={()=>setOpen(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==="Escape")setOpen(false);}}>
    <button className={s.objectButton} aria-label={label} aria-expanded={open} aria-controls={id} onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))setOpen(true);}} onClick={()=>setOpen(true)}>{children}</button>
    <div id={id} className={s.popover} hidden={!open}>{content}</div>
  </div>;
}
