"use client";
import { useEffect, useState } from "react";
import s from "./editorial/Editorial.module.css";
export function ArticleTools({title}:{title:string}) {
 const [progress,setProgress]=useState(0),[message,setMessage]=useState("");
 useEffect(()=>{let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?Math.min(1,window.scrollY/max):0);});};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return ()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};},[]);
 async function share(){try{if(navigator.share){await navigator.share({title,url:window.location.href});}else{await navigator.clipboard.writeText(window.location.href);setMessage("Ссылка скопирована");}}catch(error){if(!(error instanceof DOMException && error.name==="AbortError"))setMessage("Не удалось скопировать ссылку");}}
 return <><div className={s.progress} style={{transform:`scaleX(${progress})`}} aria-hidden="true" /><div className={s.tools}><button className={s.share} onClick={share}>{message||"Поделиться"}</button></div></>;
}
