"use client";
import {useEffect,useId,useRef,useState} from "react";
import type {EditorialMedia} from "@/lib/home-media";
import {DrawnObject} from "./Objects";
import s from "./MediaObject.module.css";

function time(value:number){if(!Number.isFinite(value))return "0:00";return `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,"0")}`;}

function Player({source}:{source:EditorialMedia}){
  const media=useRef<HTMLMediaElement|null>(null);
  const id=useId();
  const [playing,setPlaying]=useState(false),[started,setStarted]=useState(false),[position,setPosition]=useState(0),[duration,setDuration]=useState(0),[muted,setMuted]=useState(false),[error,setError]=useState(false),[loading,setLoading]=useState(false);
  useEffect(()=>{
    const node=media.current;
    if(node&&node.readyState>=1)setDuration(Number.isFinite(node.duration)?node.duration:0);
    const pause=()=>node?.pause();
    const hidden=()=>{if(document.hidden)pause();};
    const another=(event:Event)=>{if((event as CustomEvent).detail!==id)pause();};
    document.addEventListener("visibilitychange",hidden);window.addEventListener("pagehide",pause);window.addEventListener("obratnaya:media-play",another);
    return()=>{pause();document.removeEventListener("visibilitychange",hidden);window.removeEventListener("pagehide",pause);window.removeEventListener("obratnaya:media-play",another);};
  },[id]);
  async function toggle(){
    const node=media.current;if(!node)return;
    if(!node.paused){node.pause();return;}
    setError(false);setLoading(true);
    try{if(node.ended)node.currentTime=0;await node.play();}catch{setError(true);}finally{setLoading(false);}
  }
  function stop(){const node=media.current;if(!node)return;node.pause();if(node.readyState>0)node.currentTime=0;setPosition(0);setStarted(false);}
  const events={
    onLoadedMetadata:()=>setDuration(Number.isFinite(media.current?.duration)?media.current!.duration:0),
    onDurationChange:()=>setDuration(Number.isFinite(media.current?.duration)?media.current!.duration:0),
    onTimeUpdate:()=>setPosition(media.current?.currentTime??0),
    onPlay:()=>{setPlaying(true);setStarted(true);window.dispatchEvent(new CustomEvent("obratnaya:media-play",{detail:id}));},
    onPause:()=>setPlaying(false),onEnded:()=>{setPlaying(false);setStarted(false);},onError:()=>{setError(true);setLoading(false);setPlaying(false);},
  };
  return <div className={s.player} data-kind={source.kind} data-playing={playing}>
    {source.kind==="audio"?<><div className={s.soundDrawing}><DrawnObject kind="wave"/></div><audio ref={node=>{media.current=node;}} src={source.src} preload="metadata" {...events}/></>:<video ref={node=>{media.current=node;}} src={source.src} poster={source.poster} playsInline preload="metadata" aria-label={source.label??"Видео"} {...events}/>}
    <div className={s.controls}><button onClick={toggle} disabled={loading} aria-pressed={playing}>{loading?"Загрузка…":playing?"Пауза":started?"Продолжить":source.kind==="audio"?"Послушать":"Смотреть"}</button>{started&&<button onClick={stop}>Остановить</button>}{source.kind==="video"&&<button aria-pressed={muted} onClick={()=>{const next=!muted;if(media.current)media.current.muted=next;setMuted(next);}}>{muted?"Включить звук":"Без звука"}</button>}</div>
    {duration>0&&<div className={s.timeline}><input type="range" min={0} max={duration} step={.1} value={Math.min(position,duration)} aria-label="Позиция воспроизведения" aria-valuetext={`${time(position)} из ${time(duration)}`} onChange={event=>{const next=Number(event.target.value);if(media.current)media.current.currentTime=next;setPosition(next);}}/><span>{time(position)} / {time(duration)}</span></div>}
    {error&&<p role="status">Не удалось воспроизвести файл.</p>}
  </div>;
}

export function MediaObject({source}:{source:EditorialMedia|null}){
  return source?<Player key={source.src} source={source}/>:<div className={s.empty} aria-hidden="true"><DrawnObject kind="wave"/></div>;
}
