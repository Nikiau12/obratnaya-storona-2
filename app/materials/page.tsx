import type { Metadata } from "next";
import { MaterialArchive } from "@/components/MaterialArchive";
import { materials } from "@/lib/content";
export const metadata: Metadata = { title: "Все материалы — Обратная сторона", description: "Архив публикаций литературного медиа «Обратная сторона»." };
export default function MaterialsPage() { return <main className="inner-page"><section className="page-hero"><span>Редакционный архив</span><h1>Все материалы</h1><p>Лонгриды, разговоры, короткие наблюдения, галереи, аудио и видео — в одном месте.</p></section><MaterialArchive materials={materials} /></main>; }
