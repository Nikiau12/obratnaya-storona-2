"use client";

import { useEffect, useId, useRef, useState } from "react";
import s from "./Controls.module.css";

export function ChoiceMenu({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return <div className={s.choice} ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  }}>
    <button ref={trigger} className={s.trigger} type="button" aria-label={`${label}: ${options.find(option => option.value === value)?.label ?? ""}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {options.find(option => option.value === value)?.label}
      <span className={s.choiceMark} aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    {open && <div id={id} className={s.options} role="group" aria-label={label}>
      {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => {
        onChange(option.value);
        setOpen(false);
        trigger.current?.focus();
      }}>{option.label}</button>)}
    </div>}
  </div>;
}
