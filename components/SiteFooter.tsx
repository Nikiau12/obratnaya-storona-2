import Link from "next/link";
import s from "./editorial/Editorial.module.css";
export function SiteFooter() {
 return <footer className={s.footer}><Link className={s.footerBrand} href="/">Обратная сторона</Link><nav aria-label="Навигация внизу страницы"><Link href="/materials">Медиа</Link><Link href="/books">Книжный</Link><Link href="/publishers">Издательства</Link><Link href="/rubrics">Рубрики</Link><Link href="/about">О нас</Link><Link href="/bureau">Бюро</Link><Link href="/search">Поиск</Link></nav><Link href="/">На главную</Link></footer>;
}
