"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { aboutConnections, aboutPoints, aboutProjects } from "@/lib/about-projects";
import { CardHole } from "../sketch/CardScene";
import s from "./About.module.css";

type Anchor = { id: string; x: number; y: number; side: "left" | "right"; width: number; height: number; element: HTMLElement };

// Adapt the existing graph to the available screen and measured label sizes.
// Lines use those same final anchors, so they always meet the actual dots.
function layoutConstellation(root: HTMLElement) {
  const width = root.clientWidth, height = root.clientHeight;
  if (!width || !height) return;
  const phone = width < 640;
  const anchors: Anchor[] = aboutPoints.map(point => {
    const element = root.querySelector<HTMLElement>(`[data-point="${point.id}"]`)!;
    const [x, y, side] = point[phone ? "phone" : "desktop"];
    element.dataset.side = side;
    return { id: point.id, x: width * x / 100, y: height * y / 100, side,
      width: element.offsetWidth, height: element.offsetHeight, element };
  });
  const bounds = (a: Anchor) => {
    const project = a.element.tagName === "BUTTON";
    const left = project ? a.side === "left" ? a.x + 22 - a.width : a.x - 22 : a.x - a.width / 2;
    return { left, right: left + a.width, top: a.y - a.height / 2, bottom: a.y + a.height / 2 };
  };
  const constrain = (a: Anchor) => {
    const b = bounds(a);
    a.x += Math.max(0, 8 - b.left) - Math.max(0, b.right - width + 8);
    a.y += Math.max(0, 12 - b.top) - Math.max(0, b.bottom - height + 12);
  };
  const holeW = Math.min(width * (phone ? .29 : .25), height * .30);
  for (let pass = 0; pass < 24; pass++) {
    let changed = false;
    for (const a of anchors) {
      constrain(a);
      if (a.element.tagName !== "BUTTON") continue;
      const b = bounds(a), cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
      const rx = holeW * .72 + a.width / 2 + 8;
      const ry = holeW * .245 + a.height / 2 + 8;
      const dx = cx - width / 2, dy = cy - height * .75;
      const distance = Math.hypot(dx / rx, dy / ry);
      if (distance < 1) {
        const angle = distance > .001 ? Math.atan2(dy / ry, dx / rx) : -Math.PI / 2;
        a.x += width / 2 + Math.cos(angle) * rx - cx;
        a.y += height * .75 + Math.sin(angle) * ry - cy;
        changed = true;
      }
    }
    for (let i = 0; i < anchors.length; i++) for (let j = i + 1; j < anchors.length; j++) {
      const a = anchors[i], b = anchors[j], ra = bounds(a), rb = bounds(b);
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left) + 6;
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top) + 6;
      if (ox <= 0 || oy <= 0) continue;
      if (oy <= ox) {
        const amount = oy / 2 + .5, direction = a.y <= b.y ? -1 : 1;
        a.y += amount * direction; b.y -= amount * direction;
      } else {
        const amount = ox / 2 + .5, direction = a.x <= b.x ? -1 : 1;
        a.x += amount * direction; b.x -= amount * direction;
      }
      changed = true;
    }
    if (!changed) break;
  }
  anchors.forEach(a => {
    constrain(a);
    a.element.style.setProperty("--node-x", `${a.x}px`);
    a.element.style.setProperty("--node-y", `${a.y}px`);
  });
  root.querySelectorAll<SVGLineElement>("line[data-from]").forEach(line => {
    const a = anchors.find(point => point.id === line.dataset.from)!;
    const b = anchors.find(point => point.id === line.dataset.to)!;
    line.setAttribute("x1", `${a.x / width * 1000}`); line.setAttribute("y1", `${a.y / height * 1000}`);
    line.setAttribute("x2", `${b.x / width * 1000}`); line.setAttribute("y2", `${b.y / height * 1000}`);
  });
}

export function AboutRoom() {
  const [opened, setOpened] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const room = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const project = aboutProjects.find(item => item.id === opened);
  const active = opened ?? hovered ?? focused;

  useEffect(() => {
    if (!room.current) return;
    const node = room.current;
    let disposed = false, frame = 0;
    const measure = () => { if (!disposed) layoutConstellation(node); };
    const schedule = () => { if (disposed) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    node.querySelectorAll("button[data-point]").forEach(button => resize.observe(button));
    measure();
    document.fonts.ready.then(schedule);
    return () => { disposed = true; resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!opened || !panel.current) return;
    const dialog = panel.current;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal(); dialog.scrollTop = 0;
    dialog.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [opened]);

  return <>
    <section ref={room} className={s.room} data-room data-project-open={Boolean(opened)} aria-label="Карта проектов Обратной стороны">
      <CardHole paused={Boolean(opened)} />
      <svg className={s.connections} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {aboutConnections.map(([from, to]) => {
          const a = aboutPoints.find(p => p.id === from)!, b = aboutPoints.find(p => p.id === to)!;
          return <line key={`${from}-${to}`} data-from={from} data-to={to}
            x1={a.desktop[0] * 10} y1={a.desktop[1] * 10} x2={b.desktop[0] * 10} y2={b.desktop[1] * 10}
            data-active={active === from || active === to} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <svg className={s.dust} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {Array.from({ length: 34 }, (_, index) => {
          const angle = -1.2 + index * 2.399963, spread = .3 + index % 8 / 10 + Math.sqrt((index + 1) / 42) * .32;
          return <circle key={index} cx={500 + Math.cos(angle) * 290 * spread} cy={440 + Math.sin(angle) * 200 * spread} r={1 + index % 4 * .35} />;
        })}
      </svg>
      {aboutPoints.map(point => {
        const entry = aboutProjects.find(item => item.id === point.id);
        const style = { "--node-x": `${point.desktop[0]}%`, "--node-y": `${point.desktop[1]}%` } as CSSProperties;
        if (!entry) return <span key={point.id} className={s.point} data-point={point.id} style={style} aria-hidden="true" />;
        return <button key={point.id} type="button" className={s.projectPoint} style={style} data-point={point.id}
          data-side={point.desktop[2]} data-active={active === point.id} aria-haspopup="dialog" aria-expanded={opened === point.id} aria-controls={id}
          onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(point.id); }} onPointerLeave={() => setHovered(null)}
          onFocus={() => setFocused(point.id)} onBlur={() => setFocused(null)}
          onClick={event => { trigger.current = event.currentTarget; setOpened(point.id); }}>
          <span className={s.pointTarget} aria-hidden="true"><span /></span><span className={s.pointLabel}>{entry.title}</span>
        </button>;
      })}
    </section>
    <dialog ref={panel} id={id} className={s.projectPanel} tabIndex={-1}
      aria-labelledby={`${id}-title`} aria-describedby={project?.description ? `${id}-copy` : undefined}
      onCancel={event => { event.preventDefault(); setOpened(null); }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"));
        if (!controls.length) return;
        event.preventDefault();
        const current = controls.indexOf(document.activeElement as HTMLElement);
        const next = current < 0 ? (event.shiftKey ? controls.length - 1 : 0)
          : (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
        controls[next].focus();
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const b = event.currentTarget.getBoundingClientRect();
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) setOpened(null);
      }}>
      {project && <div className={s.projectContent}>
        <div className={s.projectControls}><button type="button" className={s.closeProject} onClick={() => setOpened(null)}>Закрыть</button></div>
        <h2 id={`${id}-title`}>{project.title}</h2>
        {project.description && <p id={`${id}-copy`}>{project.description}{project.emphasis && <> <em>{project.emphasis}</em></>}</p>}
        {project.href && (project.href.startsWith("/")
          ? <Link className={s.projectLink} href={project.href} onClick={() => setOpened(null)}>{project.linkLabel}</Link>
          : <a className={s.projectLink} href={project.href} target="_blank" rel="noopener noreferrer">{project.linkLabel}</a>)}
      </div>}
    </dialog>
  </>;
}
