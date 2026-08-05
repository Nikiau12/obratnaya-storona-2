import type { Metadata } from "next";
import { SearchPanel } from "@/components/SearchPanel";
import { authors, books, materials } from "@/lib/content";
export const metadata: Metadata = { title: "Поиск — Обратная сторона" };
export default function SearchPage() { return <main className="inner-page"><section className="page-hero compact"><span>Найти на стороне</span><h1>Поиск</h1></section><SearchPanel materials={materials} books={books} authors={authors} /></main>; }
