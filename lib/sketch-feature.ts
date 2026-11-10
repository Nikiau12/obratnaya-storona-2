import { publishers } from "./publishers";

// Existing sketch titles and drawings. Keep content separate from presentation.
// Client headlines and verified publisher metadata; purchase URLs remain unconfirmed.
export type SketchImage = { src: string; width: number; height: number; alt?: string; viewport?: [number,number,number,number]; sourceWidth?:number; sourceHeight?:number };
const publisher=(slug:string)=>publishers.find(p=>p.slug===slug)!;
const selection=[
 {title:"Острые крыши",author:"Дороти Ричардсон",publisher:publisher("nosorog"),image:{src:"/katya/cover-0.png",width:752,height:1038,sourceWidth:1680,sourceHeight:1680,viewport:[461,331,752,1038]}},
 {title:"Кровь на свободе: стихотворения и проза",author:"Хосе Мария Инохоса",publisher:publisher("chlorine-city"),image:{src:"/katya/cover-1.png",width:494,height:756,sourceWidth:1680,sourceHeight:1260,viewport:[595,259,494,756]}},
 {title:"Тень мадемуазель де Гурне",author:"Мари де Гурне",publisher:publisher("jaromir-hladik-press"),image:{src:"/katya/cover-2.png",width:532,height:808,sourceWidth:1000,sourceHeight:1000,viewport:[234,96,532,808]}},
 {title:"Река без берегов. Часть первая: Деревянный корабль",author:"Ханс Хенни Янн",publisher:publisher("ivan-limbakh"),image:{src:"/katya/cover-3.jpg",width:818,height:1200}},
 {title:"Сто взглядов на войну и другие хайку",author:"Жюльен Воканс",publisher:publisher("chlorine-city"),image:{src:"/katya/cover-4.png",width:536,height:756,sourceWidth:1680,sourceHeight:1260,viewport:[574,259,536,756]}},
 {title:"Зависимость, отвлечение, скука: эмоциональные среды цифровой повседневности",author:"Сусанна Паасонен",publisher:publisher("teller-books"),image:{src:"/katya/cover-5.png",width:674,height:1038,sourceWidth:1680,sourceHeight:1680,viewport:[500,331,674,1038]}},
];
export const sketchBooks=selection.map((book,index)=>({...book,index,slug:`sketch-${String(index+1).padStart(2,"0")}`,href:`/books/sketch-${String(index+1).padStart(2,"0")}`,image:book.image as SketchImage,purchaseUrl:null as string|null}));
export type SketchBook = (typeof sketchBooks)[number] & {year?:string;pages?:number};
// Items reached through quotations and media belong to the catalog, not the six-book shelf.
export const catalogBooks:SketchBook[]=[...sketchBooks,
 {index:6,slug:"nosorog-19",href:"/books/nosorog-19",title:"Носорог №19",author:"",publisher:publisher("nosorog"),year:"2024",pages:208,purchaseUrl:null,image:{src:"/katya/nosorog-19.png",width:366,height:512,sourceWidth:720,sourceHeight:720,viewport:[177,104,366,512]}},
 {index:7,slug:"iguana",href:"/books/iguana",title:"Игуана",author:"Анна-Мария Ортезе",publisher:publisher("nosorog"),purchaseUrl:null,image:{src:"/katya/iguana.png",width:752,height:1038,sourceWidth:1680,sourceHeight:1680,viewport:[461,331,752,1038]}},
];
export function getSketchBook(slug:string) { return catalogBooks.find(book=>book.slug===slug); }

const sketches = [
  {kind:"spider",name:"Паучок",materialTitle:"Название публикации"},
  {kind:"cube",name:"Куб",materialTitle:"Ещё один текст"},
  {kind:"cloud",name:"Облако",materialTitle:"Текст с облаком"},
  {kind:"cup",name:"Чашка",materialTitle:"Текст, ещё немного текста"},
  {kind:"stone",name:"Камень",materialTitle:"Другой текст"},
  {kind:"flower",name:"Цветок",materialTitle:"И ещё один текст"},
] as const;
export const sketchFormats=["essay","cover-reviews","book-week","interview","object-week","visual"] as const;
export type SketchFormat=(typeof sketchFormats)[number];

export const demoFeatures = sketches.map((item,index) => {
  const number = String(index + 1).padStart(2,"0");
  const slug = `sketch-${number}`;
  return {...item,index,slug,format:sketchFormats[index],materialHref:`/material/${slug}`,bookSlugs:[slug],bookHref:`/books/${slug}`,bookTitle:`Название книги ${number}`,purchaseUrl:null as string | null};
});
export type SketchFeature = Omit<(typeof demoFeatures)[number],"materialTitle"|"name"> & {materialTitle:string;name:string;image?:SketchImage;isClientDraft?:boolean};
const headlines=[
 "Переводчик Петр Епифанов о божественной педагогике и «невинности» как о главной цели своего поэтического поиска Джузеппе Унгаретти",
 "Психоаналитик имярек толкует сны Вальтера Беньямина",
 "Рецензии на книжные обложки: Брехт, Сен-Сеньков, Бордуновский",
 "Печень: Пять книг самиздат-проекта «Другарня ШАЛАШ»",
 "Карта русскоязычного независимого книгоиздания",
];
const illustrations=[{"src": "/katya/ungaretti.png", "width": 2172, "height": 724, "alt": ""}, {"src": "/katya/gold.png", "width": 1536, "height": 1024, "alt": ""}, {"src": "/katya/head.png", "width": 1078, "height": 1459, "alt": ""}, {"src": "/katya/printer.png", "width": 1536, "height": 1024, "alt": ""}];
export const sketchFeatures:SketchFeature[]=headlines.map((materialTitle,index)=>({...demoFeatures[index],materialTitle,name:materialTitle,bookSlugs:[],isClientDraft:true,image:index<4?illustrations[index]:undefined}));
export const sketchFeature = sketchFeatures[0];
export function getSketchFeature(slug:string) { return sketchFeatures.find(feature=>feature.slug===slug); }
export function featureBooks(feature:Pick<SketchFeature,"bookSlugs">) { return feature.bookSlugs.map(getSketchBook).filter((book):book is SketchBook=>Boolean(book)); }
export function bookFeatures(slug:string) { return sketchFeatures.filter(feature=>feature.bookSlugs.includes(slug)); }
