"use client";
import Link from "next/link";
import {useState,useEffect,type MouseEvent} from "react";
import {SketchHome} from "./Home";
import s from "../typography/TypographyStudy.module.css";

export function CompositionStudy({initialVariant}:{initialVariant:"current"|"roomier"}){
  const [variant,setVariant]=useState(initialVariant);
  useEffect(()=>{const sync=()=>setVariant(new URLSearchParams(location.search).get("variant")==="roomier"?"roomier":"current");window.addEventListener("popstate",sync);return()=>window.removeEventListener("popstate",sync);},[]);
  function choose(event:MouseEvent<HTMLAnchorElement>,next:"current"|"roomier"){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();const top=scrollY;setVariant(next);const url=new URL(location.href);url.searchParams.set("variant",next);history.replaceState(history.state,"",url);requestAnimationFrame(()=>window.scrollTo({top,behavior:"instant"}));
  }
  return <div className={s.composition}><div className={s.toolbar}><div className={s.controls}><span className={s.label}>Композиция главной</span><nav className={s.choices} aria-label="Вариант композиции"><a href="?variant=current" onClick={e=>choose(e,"current")} aria-current={variant==="current"?"page":undefined}>Текущая</a><a href="?variant=roomier" onClick={e=>choose(e,"roomier")} aria-current={variant==="roomier"?"page":undefined}>Новая</a></nav><Link href="/" className={s.original}>Главная</Link></div></div><SketchHome composition={variant}/></div>;
}
