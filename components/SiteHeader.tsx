"use client";

import Link from "next/link";
import { useSiteTheme } from "./SiteTheme";
import styles from "./SiteHeader.module.css";

const links = [["О нас", "/about"], ["Журнал", "/materials"], ["Витрина", "/books"]] as const;

export function SiteHeader({ home = false }: { home?: boolean }) {
  const { theme, setTheme } = useSiteTheme();
  return (
    <header className={`${styles.header} ${home ? styles.home : ""}`}>
      <Link href={home ? "#main-content" : "#page-content"} className={styles.skip}>К содержанию</Link>
      <Link className={styles.brand} href="/" aria-label="Обратная сторона — на главную">Обратная<br />сторона</Link>
      <nav className={styles.nav} aria-label="Основная навигация">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className={styles.actions}>
        <div className={styles.themePicker} role="group" aria-label="Цвет фона">
          <span>Фон</span>
          <button type="button" onClick={() => setTheme("black")} aria-pressed={theme === "black"} aria-label="Чёрный фон" title="Чёрный фон"><i className={styles.blackSwatch} /></button>
          <button type="button" onClick={() => setTheme("white")} aria-pressed={theme === "white"} aria-label="Белый фон" title="Белый фон"><i className={styles.whiteSwatch} /></button>
        </div>
        <Link className={styles.search} href="/search">Поиск</Link>
      </div>
    </header>
  );
}
