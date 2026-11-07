import Link from "next/link";
import { PortalLink } from "./sketch/Portal";
import s from "./editorial/Editorial.module.css";
export function SiteFooter() {
 return <footer className={s.footer}><Link className={s.footerBrand} href="/">Обратная сторона</Link><nav aria-label="Навигация внизу страницы"><Link href="/about">О нас</Link><Link href="/materials">Журнал</Link><Link href="/books">Витрина</Link></nav><PortalLink>Созвездие проектов</PortalLink></footer>;
}
