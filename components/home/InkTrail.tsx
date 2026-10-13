"use client";

import { useEffect, useRef } from "react";
import { inkOpacity, inkWidth, INK_LIFETIME, type InkPoint } from "@/lib/ink-trail";
import styles from "./InkTrail.module.css";

type Sample = InkPoint & { time: number; width: number };
type Segment = { from: InkPoint; control: InkPoint; to: InkPoint; time: number; width: number };

export function InkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !root || !context) return;
    const surface = canvas;
    const ctx = context;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let frame = 0;
    let dirty = true;
    let previous: Sample | null = null;
    let tail: InkPoint | null = null;
    let segments: Segment[] = [];
    let width = 0;
    let height = 0;
    let scale = 1;

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      tail = null;
      segments = [];
      ctx.clearRect(0, 0, width, height);
    }

    function measure() {
      dirty = false;
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const nextScale = Math.min(window.devicePixelRatio || 1, 2);
      if (width !== nextWidth || height !== nextHeight || scale !== nextScale) {
        width = nextWidth;
        height = nextHeight;
        scale = nextScale;
        surface.width = Math.round(width * scale);
        surface.height = Math.round(height * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
    }

    function render(now: number) {
      frame = 0;
      if (!enabled) return;
      if (dirty) measure();
      segments = segments.filter((segment) => now - segment.time < INK_LIFETIME);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#d8c6aa";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const segment of segments) {
        ctx.globalAlpha = inkOpacity(now - segment.time);
        ctx.lineWidth = segment.width;
        ctx.beginPath();
        ctx.moveTo(segment.from.x - window.scrollX, segment.from.y - window.scrollY);
        ctx.quadraticCurveTo(segment.control.x - window.scrollX, segment.control.y - window.scrollY,
          segment.to.x - window.scrollX, segment.to.y - window.scrollY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (segments.length) frame = requestAnimationFrame(render);
    }

    function requestRender() {
      if (enabled && !frame) frame = requestAnimationFrame(render);
    }

    function liftPen() { previous = null; tail = null; }

    function beginPointer(event: PointerEvent) {
      liftPen();
      if (!enabled || event.pointerType !== "mouse" || event.button !== 0) return;
      // A deliberate stroke on empty paper should not select nearby text.
      // This only controls drag selection; ink itself draws over all content.
      const target = event.target;
      if (target instanceof Element && !target.closest("a, button, input, textarea, select, [contenteditable], p, h1, h2, h3, blockquote, figcaption")) event.preventDefault();
    }

    function move(event: PointerEvent) {
      if (!enabled || event.pointerType !== "mouse") { liftPen(); return; }
      if (dirty) measure();
      const now = performance.now();
      const point = { x: event.clientX, y: event.clientY };
      const next = { x: point.x + window.scrollX, y: point.y + window.scrollY };
      if (!previous || now - previous.time > 180) {
        previous = { ...next, time: now, width: .7 };
        tail = next;
        return;
      }
      const distance = Math.hypot(next.x - previous.x, next.y - previous.y);
      if (distance < 1) return;
      if (distance > 180) { liftPen(); return; }
      const targetWidth = inkWidth(distance / Math.max(8, now - previous.time));
      const strokeWidth = previous.width * .7 + targetWidth * .3;
      const midpoint = { x: (previous.x + next.x) / 2, y: (previous.y + next.y) / 2 };
      segments.push({ from: tail!, control: previous, to: midpoint, time: now, width: strokeWidth });
      if (segments.length > 1800) segments.splice(0, segments.length - 1800);
      tail = midpoint;
      previous = { ...next, time: now, width: strokeWidth };
      requestRender();
    }

    function invalidate() { dirty = true; liftPen(); requestRender(); }
    function configure() {
      enabled = finePointer.matches && !reducedMotion.matches && navigator.maxTouchPoints === 0;
      surface.dataset.enabled = String(enabled);
      clear();
      if (enabled) { dirty = true; measure(); }
    }
    function onVisibility() { if (document.hidden) clear(); }

    const observer = new ResizeObserver(invalidate);
    observer.observe(root);
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", liftPen);
    root.addEventListener("pointerdown", beginPointer);
    root.addEventListener("load", invalidate, true);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", onVisibility);
    finePointer.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);
    configure();
    return () => {
      clear();
      observer.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", liftPen);
      root.removeEventListener("pointerdown", beginPointer);
      root.removeEventListener("load", invalidate, true);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", onVisibility);
      finePointer.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.ink} aria-hidden="true" data-ink-trail data-enabled="false" />;
}
