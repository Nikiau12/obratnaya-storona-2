import Link from "next/link";
import s from "./editorial/Editorial.module.css";
export function SiteFooter() {
 return <footer className={s.footer}><Link className={s.footerBrand} href="/">Обратная сторона</Link></footer>;
}
