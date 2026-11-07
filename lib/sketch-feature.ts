import { publishers } from "./publishers";

// Existing sketch titles and drawings. Keep content separate from presentation.
// Editorial copy, real book metadata and purchase URLs are still pending.
export type SketchImage = { src: string; width: number; height: number; alt?: string };
export const sketchBooks = Array.from({length:12},(_,index) => {
  const number=String(index+1).padStart(2,"0"),slug=`sketch-${number}`;
  return {index,slug,title:`Название книги ${number}`,href:`/books/${slug}`,author:"Имя автора",publisher:publishers[index%publishers.length],image:null as SketchImage|null,purchaseUrl:null as string|null};
});
export type SketchBook = (typeof sketchBooks)[number];
export function getSketchBook(slug:string) { return sketchBooks.find(book=>book.slug===slug); }

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

export const sketchFeatures = sketches.map((item,index) => {
  const number = String(index + 1).padStart(2,"0");
  const slug = `sketch-${number}`;
  return {...item,index,slug,format:sketchFormats[index],materialHref:`/material/${slug}`,bookSlugs:[slug],bookHref:`/books/${slug}`,bookTitle:`Название книги ${number}`,purchaseUrl:null as string | null};
});
export type SketchFeature = (typeof sketchFeatures)[number];
export const sketchFeature = sketchFeatures[0];
export function getSketchFeature(slug:string) { return sketchFeatures.find(feature=>feature.slug===slug); }
export function featureBooks(feature:Pick<SketchFeature,"bookSlugs">) { return feature.bookSlugs.map(getSketchBook).filter((book):book is SketchBook=>Boolean(book)); }
export function bookFeatures(slug:string) { return sketchFeatures.filter(feature=>feature.bookSlugs.includes(slug)); }
