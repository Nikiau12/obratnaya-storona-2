"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { aboutConnections, aboutPoints, aboutProjects, type AboutProject } from "@/lib/about-projects";
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

function ProjectPreview({ project, anchor, id }: { project: AboutProject; anchor: HTMLButtonElement; id: string }) {
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
        // side of the point. The visible point keeps its full 44px target.
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

export function AboutRoom() {
  const [opened, setOpened] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [previewAnchor, setPreviewAnchor] = useState<HTMLButtonElement | null>(null);
  const room = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const pointerType = useRef("");
  const id = useId();
  const project = aboutProjects.find(item => item.id === opened);
  const active = opened ?? focused ?? hovered;
  const previewId = opened ? null : focused ?? hovered;
  const preview = aboutProjects.find(item => item.id === previewId);

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
    <section ref={room} className={s.room} data-room data-project-open={Boolean(opened || previewId)} aria-label="Карта проектов Обратной стороны">
      <CardHole />
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
          data-side={point.desktop[2]} data-active={active === point.id} aria-haspopup="dialog" aria-expanded={opened === point.id || previewId === point.id} aria-controls={id}
          aria-describedby={previewId === point.id ? `${id}-preview` : undefined}
          onPointerEnter={event => { if (event.pointerType !== "touch") { setPreviewAnchor(event.currentTarget); setFocused(null); setHovered(point.id); } }}
          onPointerLeave={() => { setHovered(null); setFocused(null); }}
          onPointerDown={event => { pointerType.current = event.pointerType; }}
          onFocus={event => { if (pointerType.current !== "touch" && event.currentTarget.matches(":focus-visible")) { setPreviewAnchor(event.currentTarget); setFocused(point.id); } }}
          onBlur={() => setFocused(null)}
          onKeyDown={event => { if (event.key === "Escape") { setHovered(null); setFocused(null); } }}
          onClick={event => {
            // Hover is transient on pointer devices. Touch and keyboard users
            // can open the existing reading panel and reach its project link.
            if (event.detail !== 0 && pointerType.current !== "touch") return;
            trigger.current = event.currentTarget; setOpened(point.id);
          }}>
          <span className={s.pointTarget} aria-hidden="true"><span /></span><span className={s.pointLabel}>{entry.title}</span>
        </button>;
      })}
    </section>
    {preview && previewAnchor && <ProjectPreview key={preview.id} project={preview} anchor={previewAnchor} id={`${id}-preview`} />}
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
