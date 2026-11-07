"use client";
import { useEffect, useRef, useState } from "react";
import { readingStops, readingIndex } from "@/lib/sketch-reading";

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
      const boxes = sections.map(node => {const rect=node.getBoundingClientRect();return {top:rect.top+scrollY,height:rect.height};});
      const stops = readingStops(boxes, innerHeight, document.documentElement.scrollHeight-innerHeight);
      const section = sections[readingIndex(scrollY, stops)];
      if (section) setReading(Number(section.dataset.piece));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    // Focusing a link can scroll the browser automatically. Preserve that
    // selection; only an intentional reading gesture should clear it.
    const resumeReading = (event?: Event) => {
      if (event?.target instanceof Element && event.target.closest("[data-reading-piece]")) return;
      setHovered(null); setFocused(null);
    };
    const scroll = () => { setHovered(null); schedule(); };
    const keyScroll = (event: KeyboardEvent) => {
      if (["PageDown","PageUp","Home","End","ArrowDown","ArrowUp"].includes(event.key)) resumeReading();
    };
    const pointerScroll = (event: PointerEvent) => {
      if (event.target === document.documentElement) resumeReading();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    window.addEventListener("scroll", scroll, {passive: true});
    window.addEventListener("wheel", resumeReading, {passive: true});
    window.addEventListener("touchmove", resumeReading, {passive: true});
    window.addEventListener("keydown", keyScroll);
    window.addEventListener("pointerdown", pointerScroll);
    window.addEventListener("resize", schedule);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule); window.removeEventListener("wheel", resumeReading); window.removeEventListener("touchmove", resumeReading); window.removeEventListener("keydown", keyScroll); window.removeEventListener("pointerdown", pointerScroll); };
  }, []);
  return {flow, active: focused ?? hovered ?? reading, setHovered, setFocused};
}
