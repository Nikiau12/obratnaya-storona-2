// Existing sketch titles and drawings, with one book per publication.
// Editorial copy, real book metadata and purchase URLs are still pending.
const sketches = [
  {kind:"spider",name:"Паучок",materialTitle:"Название публикации"},
  {kind:"cube",name:"Куб",materialTitle:"Ещё один текст"},
  {kind:"cloud",name:"Облако",materialTitle:"Текст с облаком"},
  {kind:"cup",name:"Чашка",materialTitle:"Текст, ещё немного текста"},
  {kind:"stone",name:"Камень",materialTitle:"Другой текст"},
  {kind:"flower",name:"Цветок",materialTitle:"И ещё один текст"},
] as const;

export const sketchFeatures = sketches.map((item,index) => {
  const number = String(index + 1).padStart(2,"0");
  const slug = `sketch-${number}`;
  return {...item,index,slug,materialHref:`/material/${slug}`,bookHref:`/books/${slug}`,bookTitle:`Название книги ${number}`,purchaseUrl:null as string | null};
});
export type SketchFeature = (typeof sketchFeatures)[number];
export const sketchFeature = sketchFeatures[0];
export function getSketchFeature(slug:string) { return sketchFeatures.find(feature=>feature.slug===slug); }
