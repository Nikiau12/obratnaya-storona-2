import type { Metadata } from "next";
import { MaterialArchive } from "@/components/MaterialArchive";
import { materials } from "@/lib/content";
export const metadata: Metadata = { title: "Все материалы — Обратная сторона", description: "Архив публикаций литературного медиа «Обратная сторона»." };
export default function MaterialsPage() {
  return (
    <main className="inner-page materials-index">
      <section className="materials-index-hero">
        <div><span>Редакционный архив · выпуск 01</span><h1>Все<br />материалы</h1></div>
        <p>Большие тексты, разговоры, коллективные разборы, звук и видео. Архив можно читать подряд или собирать собственный маршрут с помощью фильтров.</p>
        <aside><b>06</b><span>материалов<br />в первом выпуске</span></aside>
      </section>
      <MaterialArchive materials={materials} />
    </main>
  );
}
