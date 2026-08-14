import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { materials, rubrics } from "@/lib/content";
export const metadata: Metadata = { title: "Рубрики — Обратная сторона" };
export default function RubricsPage() {
  return (
    <main className="inner-page rubrics-index">
      <section className="rubrics-hero">
        <span>Редакционная карта · 06 направлений</span>
        <h1>Рубрики</h1>
        <p>Шесть способов войти в выпуск: через рукопись, чужой сон, обложку, разговор, кино или звук.</p>
      </section>
      <div className="rubric-list">
        {rubrics.map((rubric, index) => {
          const material = materials.find((item) => item.rubric === rubric.name);
          return (
            <section className={`rubric-row ${material ? `tone-${material.tone}` : ""}`} id={rubric.name} key={rubric.name}>
              <span className="rubric-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="rubric-description">
                <span>Рубрика</span>
                <h2>{rubric.name}</h2>
                <p>{rubric.description}</p>
              </div>
              {material ? (
                <Link className={`rubric-preview ${material.image?.includes("/nosorog/cutouts/") ? "has-cutout" : ""} ${material.image?.includes("/references/os/") ? "has-reference" : ""}`} href={`/material/${material.slug}`}>
                  <figure>
                    {material.image ? <Image src={material.image} alt="" width={900} height={900} sizes="(max-width: 700px) 100vw, 55vw" /> : null}
                  </figure>
                  <div className="rubric-preview-meta"><span>{material.format}</span><span>№ {material.number}</span></div>
                  <h3>{material.title}</h3>
                  <span className="rubric-preview-link">Открыть материал</span>
                </Link>
              ) : null}
            </section>
          );
        })}
      </div>
    </main>
  );
}
