import { materials, books, authors } from "./content";
import { publishers } from "./publishers";
import { sketchFeatures, sketchBooks } from "./sketch-feature";

export type SearchEntry = {type:string;title:string;subtitle:string;href:string;search:string};
// Current journal and showcase first; earlier editorial sources remain findable.
export const searchEntries:SearchEntry[] = [
  ...sketchFeatures.map(p=>({type:"Материал",title:p.materialTitle,subtitle:"",href:p.materialHref,search:`${p.materialTitle} ${p.name}`})),
  ...sketchBooks.map(b=>({type:"Книга",title:b.title,subtitle:`${b.author} · ${b.publisher.name}`,href:b.href,search:`${b.title} ${b.author} ${b.publisher.name}`})),
  ...materials.map(m=>({type:m.draft?"Материал · макет":"Материал",title:m.title,subtitle:m.rubric,href:`/material/${m.slug}`,search:[m.title,m.excerpt,m.rubric,...m.tags].join(" ")})),
  ...books.map(b=>({type:"Книга",title:b.title,subtitle:`${b.author} · ${b.publisher}`,href:`/books/${b.slug}`,search:[b.title,b.author,b.publisher].join(" ")})),
  ...publishers.map(p=>({type:"Издательство",title:p.name,subtitle:"",href:`/books?publisher=${p.slug}`,search:p.name})),
  ...authors.map(a=>({type:"Автор · макет",title:a.name,subtitle:"",href:`/authors/${a.slug}`,search:[a.name,a.role].join(" ")})),
];
