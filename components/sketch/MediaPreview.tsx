"use client";
import {useEffect,useRef,useState} from "react";
import {MediaObject} from "./MediaObject";
import type {EditorialMedia} from "@/lib/home-media";
import s from "./MediaObject.module.css";

function LocalMedia({kind}:{kind:EditorialMedia["kind"]}){
  const [source,setSource]=useState<EditorialMedia|null>(null);
  const url=useRef<string|null>(null);
  useEffect(()=>()=>{if(url.current)URL.revokeObjectURL(url.current);},[]);
  return <section><h2>{kind==="audio"?"Аудио":"Видео"}</h2><label className={s.file}>{kind==="audio"?"Выбрать аудио":"Выбрать видео"}<input type="file" accept={`${kind}/*`} onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(url.current)URL.revokeObjectURL(url.current);url.current=URL.createObjectURL(file);setSource({kind,src:url.current});}}/></label><MediaObject source={source}/></section>;
}
export function MediaPreview(){return <main className={s.lab}><h1>Аудио и видео</h1><div className={s.labGrid}><LocalMedia kind="audio"/><LocalMedia kind="video"/></div></main>;}
