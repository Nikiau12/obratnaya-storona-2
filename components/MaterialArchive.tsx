"use client";

import { useMemo, useState } from "react";
import type { Material } from "@/lib/content";
import { MaterialCard } from "./MaterialCard";

export function MaterialArchive({ materials }: { materials: Material[] }) {
  const [format, setFormat] = useState("Все");
  const [sort, setSort] = useState("new");
  const formats = ["Все", ...Array.from(new Set(materials.map((item) => item.format)))];
  const visible = useMemo(() => {
    const filtered = format === "Все" ? materials : materials.filter((item) => item.format === format);
    return sort === "new" ? filtered : [...filtered].reverse();
  }, [format, materials, sort]);

  return (
    <>
      <div className="archive-controls">
        <div className="filter-row" aria-label="Фильтр по формату">
          {formats.map((item) => <button className={format === item ? "active" : ""} onClick={() => setFormat(item)} key={item}>{item}</button>)}
        </div>
        <label>Порядок
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="new">Сначала новые</option>
            <option value="old">Сначала старые</option>
          </select>
        </label>
      </div>
      <div className="archive-count">Показано: {visible.length}</div>
      <div className="archive-grid">{visible.map((material) => <MaterialCard material={material} compact key={material.slug} />)}</div>
    </>
  );
}
