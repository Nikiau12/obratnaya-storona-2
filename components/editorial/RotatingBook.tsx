"use client";

import { useEffect, useRef, useState } from "react";
import s from "./RotatingBook.module.css";

export function RotatingBook() {
  const root = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <span ref={root} className={s.stage} data-book-turn={visible} aria-hidden="true">
    <span className={s.book}>
      <span className={s.pages} />
      <svg className={s.front} viewBox="461 331 752 1038" width={752} height={1038} focusable="false">
        <image href="/books/saturn-autumn.png" width={1680} height={1680} />
      </svg>
    </span>
  </span>;
}
