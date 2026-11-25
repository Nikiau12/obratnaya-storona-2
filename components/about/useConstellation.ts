"use client";

import { useEffect, useRef } from "react";
import { GraphGestures } from "@/lib/constellation/gestures";
import { layoutConstellation } from "@/lib/constellation/layout";

export function useConstellation(onManipulate: () => void) {
  const room = useRef<HTMLElement>(null);
  const gestures = useRef<GraphGestures | null>(null);

  useEffect(() => {
    const node = room.current;
    if (!node) return;
    const graph = new GraphGestures();
    gestures.current = graph;
    let disposed = false, frame = 0;
    const draw = () => {
      frame = 0;
      if (disposed) return;
      graph.resize(node.clientWidth, node.clientHeight, node.clientWidth < 1100 || matchMedia("(any-pointer: coarse)").matches);
      layoutConstellation(node, graph.view);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(draw); };
    const capture = () => {
      for (const id of graph.ids) {
        try { if (!node.hasPointerCapture(id)) node.setPointerCapture(id); } catch { /* Pointer already ended. */ }
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || (node.clientWidth >= 1100 && !matchMedia("(any-pointer: coarse)").matches)) return;
      graph.down(event.pointerId, { x: event.clientX, y: event.clientY });
      if (graph.manipulating) { onManipulate(); capture(); }
    };
    const move = (event: PointerEvent) => {
      if (!graph.move(event.pointerId, { x: event.clientX, y: event.clientY }, performance.now())) return;
      event.preventDefault();
      onManipulate(); capture(); schedule();
    };
    const end = (event: PointerEvent) => graph.up(event.pointerId, performance.now());
    const lost = (event: PointerEvent) => {
      // Moving capture from a touched label to the room also bubbles a lost
      // event from that label. Only losing the room's own capture ends a finger.
      if (event.target === node && !node.hasPointerCapture(event.pointerId)) end(event);
    };
    const cancel = () => graph.cancel(performance.now());
    const hidden = () => { if (document.hidden) cancel(); };
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", move, { passive: false });
    node.addEventListener("pointerup", end);
    node.addEventListener("pointercancel", cancel);
    node.addEventListener("lostpointercapture", lost);
    document.addEventListener("visibilitychange", hidden);
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    node.querySelectorAll("button[data-point]").forEach(button => resize.observe(button));
    document.fonts.ready.then(schedule);
    draw();
    return () => {
      disposed = true; gestures.current = null;
      cancelAnimationFrame(frame); resize.disconnect();
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", end);
      node.removeEventListener("pointercancel", cancel);
      node.removeEventListener("lostpointercapture", lost);
      document.removeEventListener("visibilitychange", hidden);
      graph.cancel(performance.now());
    };
  }, [onManipulate]);

  return { room, ignoreClick: () => gestures.current?.ignoreClick(performance.now()) ?? false };
}
