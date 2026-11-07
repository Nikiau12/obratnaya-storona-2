"use client";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { SketchHome } from "@/components/sketch/Home";
import "./fonts.css";
import s from "./TypographyStudy.module.css";

export function TypographyStudy({ variant: initialVariant }: { variant: "a" | "b" }) {
  const [variant, setVariant] = useState(initialVariant);
  useEffect(() => {
    const sync = () => setVariant(new URLSearchParams(window.location.search).get("variant") === "b" ? "b" : "a");
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function choose(event: MouseEvent<HTMLAnchorElement>, next: "a" | "b") {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const top = window.scrollY;
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState(window.history.state, "", url);
    requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
  }
  return <div className={s.study} data-typography={variant}>
    <link rel="preload" href="/fonts/study/literata-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/study/literata-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <div className={s.toolbar} role="region" aria-label="Сравнение типографики">
      <div className={s.controls}>
        <span className={s.label}>Два варианта главной</span>
        <nav className={s.choices} aria-label="Вариант типографики">
          <a href="/preview/typography?variant=a" onClick={event => choose(event, "a")} aria-current={variant === "a" ? "page" : undefined}>А · Книжный</a>
          <a href="/preview/typography?variant=b" onClick={event => choose(event, "b")} aria-current={variant === "b" ? "page" : undefined}>Б · Журнальный</a>
        </nav>
        <Link href="/" className={s.original}>Текущая главная</Link>
      </div>
    </div>
    <SketchHome />
  </div>;
}
