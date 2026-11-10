"use client";
import { useEffect, useRef } from "react";
import { mountCardScene } from "@/lib/card-scene";
import s from "./Sketch.module.css";

export function CardHole({paused=false}:{paused?:boolean}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const scene=useRef<ReturnType<typeof mountCardScene>|null>(null);
  useEffect(()=>{
    if(!canvas.current)return;
    const mounted=mountCardScene(canvas.current);scene.current=mounted;
    return()=>{mounted.destroy();scene.current=null;};
  },[]);
  useEffect(()=>{scene.current?.setPaused(paused);},[paused]);
  return <canvas ref={canvas} className={s.cardHole} width={1200} height={825} aria-hidden="true"/>;
}

export function RoomLines() {
  return <svg className={s.roomLines} viewBox="0 0 320 220" aria-hidden="true" focusable="false">
    <path d="M150 0V104M0 140L150 104L320 145" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke"/>
  </svg>;
}
