"use client";

import { useCallback, useId, useRef, useState, type CSSProperties } from "react";
import { aboutConnections, aboutPoints, aboutProjects } from "@/lib/constellation/projects";
import { CardHole } from "../sketch/CardScene";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectDialog } from "./ProjectDialog";
import { useConstellation } from "./useConstellation";
import s from "./Constellation.module.css";

export function AboutRoom() {
  const [opened, setOpened] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [previewAnchor, setPreviewAnchor] = useState<HTMLButtonElement | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const pointerType = useRef("");
  const id = useId();
  const project = aboutProjects.find(item => item.id === opened);
  const active = opened ?? focused ?? hovered;
  const previewId = opened ? null : focused ?? hovered;
  const preview = aboutProjects.find(item => item.id === previewId);

  const dismissPreview = useCallback(() => { setHovered(null); setFocused(null); }, []);
  const { room, ignoreClick } = useConstellation(dismissPreview);

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
            if (ignoreClick() || (event.detail !== 0 && pointerType.current !== "touch")) return;
            setTrigger(event.currentTarget); setOpened(point.id);
          }}>
          <span className={s.pointTarget} aria-hidden="true"><span /></span><span className={s.pointLabel}>{entry.title}</span>
        </button>;
      })}
    </section>
    {preview && previewAnchor && <ProjectPreview key={preview.id} project={preview} anchor={previewAnchor} id={`${id}-preview`} />}
    {project && <ProjectDialog key={project.id} project={project} id={id} trigger={trigger} close={() => setOpened(null)} />}
  </>;
}
