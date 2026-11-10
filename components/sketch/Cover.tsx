import type {SketchBook} from "@/lib/sketch-feature";
import type {CSSProperties} from "react";
import {DummyCover} from "./Objects";
import s from "./Cover.module.css";

export function Cover({book,priority=false}:{book:Pick<SketchBook,"image"|"title"|"index">;priority?:boolean}){
  if(!book.image)return <DummyCover index={book.index}/>;
  if(book.image.viewport){const [x,y,w,h]=book.image.viewport;return <span className={s.cover} style={{aspectRatio:`${w}/${h}`,"--cover-ratio":w/h} as CSSProperties}><svg role="img" aria-label={`Обложка книги «${book.title}»`} viewBox={`${x} ${y} ${w} ${h}`} width={w} height={h} style={{display:"block",width:"100%",height:"auto",overflow:"hidden"}}><image href={book.image.src} width={book.image.sourceWidth} height={book.image.sourceHeight}/></svg></span>;}
  return <span className={s.cover} style={{aspectRatio:`${book.image.width}/${book.image.height}`,"--cover-ratio":book.image.width/book.image.height} as CSSProperties}><img src={book.image.src} alt={book.image.alt??`Обложка книги «${book.title}»`} width={book.image.width} height={book.image.height} loading={priority?"eager":"lazy"} decoding="async"/></span>;
}
