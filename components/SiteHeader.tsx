"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CardHole, RoomLines } from "./sketch/CardScene";
import { useSiteTheme } from "./SiteTheme";
import styles from "./SiteHeader.module.css";

const links = [["О нас", "/about"], ["Журнал", "/materials"], ["Витрина", "/books"]] as const;

export function SiteHeader({ home = false, showRoom = false, className = "" }: { home?: boolean; showRoom?: boolean; className?: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useSiteTheme();
  return (
    <header className={`${styles.header} ${className}`} data-home={home}>
      <Link href={home ? "#main-content" : "#page-content"} className={styles.skip}>К содержанию</Link>
      <div className={styles.brandGroup} data-brand-group><Link className={styles.brand} data-brand href="/" aria-label="Обратная сторона — на главную">Обратная сторона</Link>{home&&<p className={styles.tagline} data-tagline>Констелляция независимых книжных практик</p>}</div>
      {showRoom&&<div className={styles.room} data-room aria-hidden="true"><RoomLines/><CardHole/></div>}
      <div className={styles.navigation} data-navigation>
      <nav className={styles.nav} data-navigation-links aria-label="Основная навигация">
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname===href?"page":undefined}>{label}</Link>)}
      </nav>
      <div className={styles.actions}>
        <div className={styles.themePicker} role="group" aria-label="Цвет фона">
          <button type="button" onClick={() => setTheme("black")} aria-pressed={theme === "black"} aria-label="Чёрный фон" title="Чёрный фон"><i className={styles.blackSwatch} /></button>
          <button type="button" onClick={() => setTheme("white")} aria-pressed={theme === "white"} aria-label="Белый фон" title="Белый фон"><i className={styles.whiteSwatch} /></button>
        </div>
      </div>
      </div>
    </header>
  );
}
