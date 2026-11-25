"use client";

import { useLayoutEffect, useRef } from "react";
import type { AboutProject } from "@/lib/constellation/projects";
import s from "./Constellation.module.css";

export function ProjectPreview({ project, anchor, id }: { project: AboutProject; anchor: HTMLButtonElement; id: string }) {
  const card = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = card.current;
    if (!node) return;
    let frame = 0, viewportWidth = 0, viewportHeight = 0;
    function position() {
      if (!node) return;
      if (viewportWidth !== innerWidth || viewportHeight !== innerHeight) {
        node.style.width = ""; node.style.maxHeight = "";
        viewportWidth = innerWidth; viewportHeight = innerHeight;
      }
      const a = anchor.getBoundingClientRect();
      const width = node.offsetWidth, height = node.offsetHeight;
      const pad = 12, gap = 20;
      const maxX = innerWidth - width - pad, maxY = innerHeight - height - pad;
      const clampX = (x: number) => Math.max(pad, Math.min(maxX, x));
      const clampY = (y: number) => Math.max(pad, Math.min(maxY, y));
      // Prefer a neighbouring side with enough room. Above/below works for
      // narrower screens. Clamping must never move the card across its anchor.
      const candidates = [
        { x: a.right + gap, y: clampY(a.top + a.height / 2 - height / 2) },
        { x: a.left - gap - width, y: clampY(a.top + a.height / 2 - height / 2) },
        { x: clampX(a.left + a.width / 2 - width / 2), y: a.top - gap - height },
        { x: clampX(a.left + a.width / 2 - width / 2), y: a.bottom + gap },
      ];
      const fits = (p: { x: number; y: number }) => p.x >= pad && p.x <= maxX && p.y >= pad && p.y <= maxY;
      let next = candidates.find(fits);
      if (!next) {
        // At a short viewport, make the card narrower and use the largest
        // side of the point, preserving the point's interaction target.
        const left = a.left - gap - pad, right = innerWidth - pad - a.right - gap;
        const available = Math.max(left, right);
        if (available > 200 && width > available) {
          node.style.width = `${Math.floor(available)}px`;
          position();
          return;
        }
        // A desktop pointer can also be used on a narrow portrait screen.
        // Reduce the preview's height to the space above/below its trigger.
        const above = a.top - gap - pad, below = innerHeight - pad - a.bottom - gap;
        const useAbove = above >= below;
        node.style.maxHeight = `${Math.max(1, useAbove ? above : below)}px`;
        next = { x: clampX(a.left + a.width / 2 - width / 2), y: useAbove ? a.top - gap - node.offsetHeight : a.bottom + gap };
      }
      node.style.left = `${next.x}px`;
      node.style.top = `${next.y}px`;
      node.style.visibility = "visible";
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    const room = anchor.closest("[data-room]");
    if (room) resize.observe(room);
    window.addEventListener("resize", schedule);
    position();
    return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); };
  }, [anchor]);

  return <div ref={card} id={id} className={s.projectPreview} role="tooltip" data-project-preview={project.id}>
    <h2>{project.title}</h2>
    {project.description && <p>{project.description}{project.emphasis && <> <em>{project.emphasis}</em></>}</p>}
  </div>;
}
