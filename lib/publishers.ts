import { books } from "./content";

export type Publisher = {slug:string;name:string;description?:string};
export const publishers:Publisher[] = [
  {slug:"teller-books",name:"Teller Books"},
  {slug:"chlorine-city",name:"Издательство города Хлор"},
  { slug: "individuum", name: "Individuum" },
  { slug: "jaromir-hladik-press", name: "Jaromir Hladik press" },
  { slug: "nosorog", name: "Носорог", description:"Независимое издательство, выросшее из одноимённого литературного журнала." },
  { slug: "ivan-limbakh", name: "Издательство Ивана Лимбаха" },
  { slug: "teller-books-mit-press", name: "Teller Books / MIT Press" },
];
export function getPublisher(slug: string) { return publishers.find((publisher) => publisher.slug === slug); }
export function publisherHref(name: string) { return `/publishers/${publishers.find((publisher) => publisher.name === name)?.slug ?? ""}`; }
export function publisherBooks(name: string) { return books.filter((book) => book.publisher === name); }
