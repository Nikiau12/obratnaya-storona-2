"use client";
import { useEffect, useRef, useState } from "react";

export function useReadingPiece() {
  const flow = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  useEffect(() => {
    const container = flow.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = [...container.querySelectorAll<HTMLElement>("[data-piece]")];
      // Read in editorial order across each loose row, then move to the next.
      const section = sections.find(node => node.getBoundingClientRect().bottom > innerHeight * .4) ?? sections.at(-1);
      if (section) setReading(Number(section.dataset.piece));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const scroll = () => { setHovered(null); setFocused(null); schedule(); };
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    window.addEventListener("scroll", scroll, {passive: true});
    window.addEventListener("resize", schedule);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule); };
  }, []);
  return {flow, active: focused ?? hovered ?? reading, setHovered, setFocused};
}
