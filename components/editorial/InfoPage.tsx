import Link from "next/link";
import s from "./Editorial.module.css";
import c from "./Composition.module.css";
import about from "./About.module.css";

export function InfoPage({ kind }: { kind: "about" | "bureau" }) {
  const bureau = kind === "bureau";
  if (!bureau) return <main className={about.page}>
    <h1>О нас</h1>
    <div className={about.composition}>
      <p className={about.statement}><span>Констелляция</span><span>независимых</span><span>книжных практик</span></p>
      <nav className={about.destinations} aria-label="Разделы Обратной стороны"><Link href="/materials">Журнал</Link><Link href="/books">Витрина</Link></nav>
    </div>
  </main>;
  return <main className={`${s.page} ${c.infoPage}`} data-kind={kind}>
    <header className={s.infoHero}><h1 className={s.title}>{bureau ? "Бюро" : "О нас"}</h1></header>
    <section className={s.infoSection} id="details"><h2 className={s.sectionTitle}>{bureau ? "Услуги" : "Журнал и витрина"}</h2>{bureau ? <div className={s.contentSpace} aria-hidden="true"/> : <div className={s.infoDestinations}><Link href="/materials"><h3>Журнал</h3></Link><Link href="/books"><h3>Витрина</h3></Link></div>}</section>
    {bureau ? <section className={s.infoSection} id="projects"><h2 className={s.sectionTitle}>Проекты</h2><div className={s.projectSpace}><div className={s.imageSpace} aria-hidden="true"/></div></section> : null}
    <section className={s.infoSection} id="contacts"><h2 className={s.sectionTitle}>Контакты</h2></section>
  </main>;
}
