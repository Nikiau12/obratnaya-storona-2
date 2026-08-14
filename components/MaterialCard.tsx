import type { Material } from "@/lib/content";
import Image from "next/image";

export function MaterialCard({ material, compact = false }: { material: Material; compact?: boolean }) {
  return (
    <a className={`material-card tone-${material.tone} ${compact ? "is-compact" : ""}`} href={`/material/${material.slug}`}>
      <div className="story-meta"><span>{material.format}</span><span>№ {material.number}</span></div>
      <div className="material-visual" aria-hidden="true">
        {material.image ? <Image src={material.image} alt="" width={900} height={600} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /> : <span>{material.shortTitle.slice(0, 1)}</span>}
      </div>
      <div className="material-card-copy">
        <p className="material-rubric">{material.rubric} · {material.readTime}</p>
        <h3>{material.title}</h3>
        <p>{material.excerpt}</p>
        <span className="text-link">Открыть материал</span>
      </div>
    </a>
  );
}
