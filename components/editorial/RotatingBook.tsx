"use client";

import { useEffect, useRef, useState } from "react";
import s from "./RotatingBook.module.css";

export function RotatingBook() {
  const root = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    const book = root.current.firstElementChild as HTMLElement;
    function measure() {
      book.style.setProperty("--book-width", `${book.offsetWidth}px`);
      book.style.setProperty("--book-height", `${book.offsetHeight}px`);
    }
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(book);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    });
    observer.observe(root.current);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, []);

  return <span ref={root} className={s.stage} data-book-turn={visible} aria-hidden="true">
    <span className={s.book}>
      <span className={s.shadow} />
      <span className={s.back} />
      <span className={s.backLining} />
      <span className={s.spine} />
      <span className={s.pages} />
      <span className={s.top} />
      <span className={s.bottom} />
      <span className={`${s.coverEdge} ${s.frontEdge}`} />
      <span className={`${s.coverEdge} ${s.backEdge}`} />
      <span className={`${s.coverTop} ${s.frontTop}`} />
      <span className={`${s.coverTop} ${s.backTop}`} />
      <span className={`${s.coverBottom} ${s.frontBottom}`} />
      <span className={`${s.coverBottom} ${s.backBottom}`} />
      <span className={s.front} />
    </span>
  </span>;
}
