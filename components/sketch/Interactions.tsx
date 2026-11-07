"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { DrawnObject } from "./Objects";
import s from "./Sketch.module.css";

export function Note({ label, children, content }: {label:string;children:ReactNode;content:ReactNode}) {
  const [open,setOpen]=useState(false);
  const id=useId();
  return <div className={s.noteObject} onPointerEnter={e=>{if(e.pointerType!=="touch")setOpen(true);}} onPointerLeave={()=>setOpen(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==="Escape")setOpen(false);}}>
    <button className={s.objectButton} aria-label={label} aria-expanded={open} aria-controls={id} onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))setOpen(true);}} onClick={()=>setOpen(true)}>{children}</button>
    <div id={id} className={s.popover} hidden={!open}>{content}</div>
  </div>;
}

export function AudioObject() {
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState("");
  const audio=useRef<AudioContext|null>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);void audio.current?.close();},[]);
  async function play(){
    if(playing){if(timer.current)clearTimeout(timer.current);await audio.current?.close();audio.current=null;setPlaying(false);return;}
    try{
      const ctx=new AudioContext();audio.current=ctx;await ctx.resume();
      [220,293.66,329.63].forEach((hz,i)=>{
        const tone=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*.36;
        tone.type="sine";tone.frequency.value=hz;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.08,start+.07);gain.gain.exponentialRampToValueAtTime(.001,start+.75);
        tone.connect(gain);gain.connect(ctx.destination);tone.start(start);tone.stop(start+.8);
      });
      setPlaying(true);setError("");timer.current=setTimeout(()=>{setPlaying(false);void ctx.close();audio.current=null;},1700);
    }catch{setError("Звук недоступен в этом браузере.");}
  }
  return <div className={s.audioObject} data-playing={playing}><DrawnObject kind="wave"/><button onClick={play} aria-pressed={playing}>{playing?"Остановить":"Послушать"}</button><span>Пробный звук · 2 сек.</span>{error&&<span role="status">{error}</span>}</div>;
}
