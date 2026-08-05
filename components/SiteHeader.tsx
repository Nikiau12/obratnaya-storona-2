"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  ["Материалы", "/materials"],
  ["Рубрики", "/rubrics"],
  ["Авторы", "/authors"],
  ["Книги", "/books"],
  ["О медиа", "/about"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Обратная сторона — на главную">
          <span className="brand-mark" aria-hidden="true" />
          <span>Обратная<br />сторона</span>
        </Link>
        <div className="edition"><span>выпуск 01</span><span>5 августа 2026</span></div>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <Link className="search-link" href="/search" aria-label="Поиск">⌕</Link>
          <Link className="shop-nav" href="/books">Магазин ↗</Link>
        </nav>
        <button className="menu-button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu">Меню</button>
      </header>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <div className="mobile-menu-top">
          <span>Навигация</span>
          <button onClick={() => setOpen(false)} aria-label="Закрыть меню">Закрыть ×</button>
        </div>
        <nav aria-label="Мобильная навигация">
          {links.map(([label, href], index) => <Link href={href} key={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>)}
          <Link href="/search" onClick={() => setOpen(false)}><span>06</span>Поиск</Link>
        </nav>
        <Link className="mobile-shop" href="/books" onClick={() => setOpen(false)}>Перейти в магазин ↗</Link>
      </div>
    </>
  );
}
