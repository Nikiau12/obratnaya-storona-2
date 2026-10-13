import Link from "next/link";
import styles from "./SiteHeader.module.css";

const links = [["О нас", "/about"], ["Бюро", "/bureau"], ["Медиа", "/materials"], ["Книжный", "/books"]] as const;

export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className={`${styles.header} ${home ? styles.home : ""}`}>
      <Link href={home ? "#main-content" : "#page-content"} className={styles.skip}>К содержанию</Link>
      <Link className={styles.brand} href="/" aria-label="Обратная сторона — на главную">Обратная<br />сторона</Link>
      <nav className={styles.nav} aria-label="Основная навигация">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <Link className={styles.search} href="/search">Поиск</Link>
    </header>
  );
}
