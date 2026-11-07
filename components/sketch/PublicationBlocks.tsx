import Link from "next/link";
import { type SketchFeature, featureBooks } from "@/lib/sketch-feature";
import {DrawnObject} from "./Objects";
import {Cover} from "./Cover";
import s from "./FeaturePages.module.css";

export function TextSpace({label,lines=5}:{label:string;lines?:number}){
  return <div className={s.textSpace} role="img" aria-label={`Место для текста: ${label}`}><div className={s.lines} aria-hidden="true">{Array.from({length:lines},(_,i)=><i key={i}/>)}</div></div>;
}

// These use the same reading structures as the retained editorial templates,
// with empty text instead of invented questions, quotations or descriptions.
export function PublicationBlocks({feature}:{feature:SketchFeature}){
  const books=featureBooks(feature);
  if(feature.format==="cover-reviews")return <div className={s.reviewSequence}>{books.map(book=><section key={book.slug} className={s.reviewSection}><Link href={book.href} aria-label={`Открыть книгу: ${book.title}`}><Cover book={book}/><h2>{book.title}</h2></Link><div><TextSpace label="Рецензия" lines={8}/><TextSpace label="Продолжение рецензии" lines={5}/></div></section>)}</div>;
  if(feature.format==="interview")return <div className={s.interviewSequence}>{[0,1,2].map(index=><section key={index} className={s.interviewTurn}><div className={s.questionSpace}><TextSpace label="Вопрос" lines={2}/></div><div className={s.answerSpace}><TextSpace label="Ответ" lines={6}/>{index===1&&<div className={s.poemSpace}><TextSpace label="Стихотворение" lines={4}/></div>}{index===2&&<div className={s.quoteSpace}><TextSpace label="Цитата" lines={2}/></div>}</div></section>)}</div>;
  if(feature.format==="visual")return <div className={s.visualSequence}><div className={s.visualPair}><DrawnObject kind={feature.kind}/><DrawnObject kind="cube"/></div><TextSpace label="Фрагмент текста" lines={2}/><div className={s.visualWide}><DrawnObject kind="cloud"/></div><div className={s.visualPair}><DrawnObject kind="stone"/><DrawnObject kind={feature.kind}/></div><TextSpace label="Фрагмент текста" lines={3}/></div>;
  if(feature.format==="object-week")return <><TextSpace label="Об объекте" lines={3}/><TextSpace label="Текст публикации" lines={7}/><TextSpace label="Продолжение текста" lines={5}/></>;
  return <><TextSpace label="Лид" lines={3}/><TextSpace label="Текст публикации" lines={7}/><div className={s.quoteSpace}><TextSpace label="Цитата" lines={2}/></div><TextSpace label="Продолжение текста" lines={6}/>{feature.format==="book-week"&&<div className={s.notesSpace}><TextSpace label="Сноски" lines={3}/></div>}</>;
}
