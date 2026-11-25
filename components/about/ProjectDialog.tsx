"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { AboutProject } from "@/lib/constellation/projects";
import s from "./Constellation.module.css";

export function ProjectDialog({ project, id, trigger, close }: {
  project: AboutProject; id: string; trigger: HTMLButtonElement | null; close: () => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = panel.current;
    if (!dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [trigger]);

  return (
    <dialog ref={panel} id={id} className={s.projectPanel} tabIndex={-1}
      aria-labelledby={`${id}-title`} aria-describedby={project?.description ? `${id}-copy` : undefined}
      onCancel={event => { event.preventDefault(); close(); }}
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
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) close();
      }}>
      {project && <div className={s.projectContent}>
        <div className={s.projectControls}><button type="button" className={s.closeProject} onClick={() => close()}>Закрыть</button></div>
        <h2 id={`${id}-title`}>{project.title}</h2>
        {project.description && <p id={`${id}-copy`}>{project.description}{project.emphasis && <> <em>{project.emphasis}</em></>}</p>}
        {project.href && (project.href.startsWith("/")
          ? <Link className={s.projectLink} href={project.href} onClick={() => close()}>{project.linkLabel}</Link>
          : <a className={s.projectLink} href={project.href} target="_blank" rel="noopener noreferrer">{project.linkLabel}</a>)}
      </div>}
    </dialog>
  );
}
