import Link from "next/link";
import s from "./Editorial.module.css";

export function InfoPage({ kind }: { kind: "about" | "bureau" }) {
  const bureau = kind === "bureau";
  return <main className={s.page}>
    <span className={s.draft}>Макет страницы · тексты будут добавлены</span>
    <header className={s.infoHero}><h1 className={s.title}>{bureau ? "Бюро" : "О нас"}</h1><div>{bureau ? <p className={s.intro}>Место для короткого рассказа о Бюро.</p> : <p className={s.intro}>Обратная сторона.<br/>Медиа и книжный.<br/>Независимые издательства и самиздат.</p>}<nav className={s.links} aria-label="На этой странице"><a className={s.textLink} href="#description">{bureau ? "О Бюро" : "О проекте"}</a><a className={s.textLink} href="#details">{bureau ? "Услуги" : "Медиа и книжный"}</a>{bureau ? <a className={s.textLink} href="#projects">Проекты</a> : null}<a className={s.textLink} href="#contacts">Контакты</a></nav></div></header>
    <section className={s.infoSection} id="description"><span className={s.kicker}>{bureau ? "О Бюро" : "О проекте"}</span><div className={s.contentSpace}><p>{bureau ? "Здесь будет рассказ о подходе Бюро и работе с клиентами." : "Здесь будет утверждённый рассказ об Обратной стороне, её участниках и идее проекта."}</p></div></section>
    <section className={s.infoSection} id="details"><h2 className={s.sectionTitle}>{bureau ? "Услуги" : "Медиа и книжный"}</h2>{bureau ? <div className={s.contentSpace}><p>Перечень услуг и описания будут добавлены после согласования.</p></div> : <div className={s.infoDestinations}><Link href="/materials"><h3>Медиа</h3><span>Читать материалы</span></Link><Link href="/books"><h3>Книжный</h3><span>Смотреть книги</span></Link></div>}</section>
    {bureau ? <section className={s.infoSection} id="projects"><h2 className={s.sectionTitle}>Проекты</h2><div className={s.projectSpace}><div className={s.imageSpace}>Изображения проекта</div><p className={s.muted}>Здесь появятся название, задача, выполненная работа и изображения реального проекта.</p></div></section> : null}
    <section className={s.infoSection} id="contacts"><h2 className={s.sectionTitle}>Контакты</h2><p className={s.muted}>Контакты будут добавлены.</p></section>
    <nav className={s.links} aria-label="Продолжить просмотр"><Link className={s.textLink} href={bureau ? "/about" : "/bureau"}>{bureau ? "О нас" : "Бюро"}</Link><Link className={s.textLink} href="/preview">Все макеты</Link></nav>
  </main>;
}
