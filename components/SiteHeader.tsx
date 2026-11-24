"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CardHole, RoomLines } from "./sketch/CardScene";
import { useSiteTheme } from "./SiteTheme";
import { CartButton } from "./cart/Cart";
import styles from "./SiteHeader.module.css";

const links = [["О нас", "/about"], ["Журнал", "/materials"], ["Витрина", "/books"]] as const;

export function SiteHeader({ home = false, showRoom = false, className = "" }: { home?: boolean; showRoom?: boolean; className?: string }) {
  const pathname = usePathname();
  return (
    <header className={`${styles.header} ${className}`} data-home={home}>
      <Link href={home ? "#main-content" : "#page-content"} className={styles.skip}>К содержанию</Link>
      <div className={styles.brandGroup} data-brand-group><Link className={styles.brand} data-brand href="/" aria-label="Обратная сторона — на главную">Обратная сторона</Link>{home&&<p className={styles.tagline} data-tagline>Констелляция независимых книжных практик</p>}</div>
      {showRoom&&<div className={styles.room} data-room aria-hidden="true"><RoomLines/><CardHole/></div>}
      <SiteNavigation key={pathname} pathname={pathname} />
    </header>
  );
}

function SiteNavigation({ pathname }: { pathname: string }) {
  const { theme, setTheme } = useSiteTheme();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: Event) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function handleResize() {
      if (!trigger.current?.getClientRects().length) setOpen(false);
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return <div ref={container} className={styles.navigation} data-navigation>
    <button ref={trigger} type="button" className={styles.menuToggle}
      aria-label={open ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
    <div id={panelId} className={styles.menuPanel} data-open={open}>
      <nav className={styles.nav} data-navigation-links aria-label="Основная навигация">
        {links.map(([label, href]) => <Link key={href} href={href}
          onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        <CartButton onOpen={() => setOpen(false)} />
      </nav>
      <div className={styles.actions} data-theme-actions>
        <div className={styles.themePicker} role="group" aria-label="Цвет фона">
          <button type="button" onClick={() => setTheme("black")} aria-pressed={theme === "black"} aria-label="Чёрный фон" title="Чёрный фон"><i className={styles.blackSwatch} /></button>
          <button type="button" onClick={() => setTheme("white")} aria-pressed={theme === "white"} aria-label="Белый фон" title="Белый фон"><i className={styles.whiteSwatch} /></button>
        </div>
      </div>
    </div>
  </div>;
}
