import type { Metadata } from "next";
import { MaterialCard } from "@/components/MaterialCard";
import { materials, rubrics } from "@/lib/content";
export const metadata: Metadata = { title: "Рубрики — Обратная сторона" };
export default function RubricsPage() { return <main className="inner-page"><section className="page-hero"><span>Редакционная карта</span><h1>Рубрики</h1><p>Шесть направлений, через которые мы рассматриваем литературу, изображение и культуру.</p></section><div className="rubric-list">{rubrics.map((rubric, index) => { const material = materials.find((item) => item.rubric === rubric.name); return <section className="rubric-row" id={rubric.name} key={rubric.name}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{rubric.name}</h2><p>{rubric.description}</p></div>{material ? <MaterialCard material={material} compact /> : null}</section>; })}</div></main>; }
