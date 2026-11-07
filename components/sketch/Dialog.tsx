"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import s from "./Sketch.module.css";
export function SketchDialog({ title, close, children }: {title:string; close:()=>void; children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  const id=useId();
  useEffect(()=>{
    const dialog=ref.current;
    const previous=document.activeElement as HTMLElement | null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    dialog?.showModal();
    return ()=>{dialog?.close();document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return <dialog ref={ref} className={s.dialog} aria-labelledby={id} onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}}><div className={s.dialogBody}><button className={s.close} onClick={close}>Закрыть</button><h2 id={id}>{title}</h2>{children}</div></dialog>;
}
