import { BookCard } from "@/components/BookCard";
import { MaterialCard } from "@/components/MaterialCard";
import { WordCard } from "@/components/WordCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { books, getAuthor, materials } from "@/lib/content";
import Link from "next/link";

export default function Home() {
  const lead = materials[0];
  return (
    <main>
      <div className="ticker" aria-label="Бегущая строка"><div className="ticker-track">
        <span>Литература меняет форму</span><i>●</i><span>Слово дня: наизнанку</span><i>●</i><span>Новые тексты ежедневно</span><i>●</i><span>Магазин уже близко</span><i>●</i><span>Литература меняет форму</span><i>●</i>
      </div></div>

      <section className="lead-grid" id="top">
        <article className="lead-story">
          <div className="eyebrow"><span>{lead.format} · {lead.rubric}</span><span>{lead.readTime}</span></div>
          <h1>Как читать<br />то, чего<br />не было</h1>
          <p className="standfirst">{lead.excerpt}</p>
          <a className="read-link" href={`/material/${lead.slug}`}>Читать дальше<span className="link-arrow" aria-hidden="true"> ↗</span></a>
        </article>
        <div className="gravity-field" aria-label="Знаки падают в чёрную дыру">
          <span className="floating glyph-one">О</span><span className="floating glyph-two">Ϝ</span><span className="floating glyph-three">наоборот</span><span className="floating glyph-four">✦</span>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="black-hole"><span>другая<br />сторона<br />чтения</span></div>
        </div>
        <aside className="micro-column">
          <WordCard />
          <div className="quote-card"><span className="quote-mark">“</span><blockquote>Читать — значит находить отверстия в привычном порядке вещей.</blockquote><cite>из редакционного блокнота</cite></div>
        </aside>
      </section>

      <section className="materials" id="materials">
        <div className="section-heading">
          <div><span className="section-kicker">Редакционный выбор · Выпуск 01</span><h2>Сегодня<br />на стороне</h2></div>
          <div className="section-action"><p>Тексты, разговоры, изображения и несколько странных сигналов.</p><a className="button" href="/materials">Все материалы<span className="link-arrow" aria-hidden="true"> ↗</span></a></div>
        </div>
        <div className="story-grid home-stories">{materials.slice(0, 3).map((material) => <MaterialCard material={material} key={material.slug} />)}</div>
      </section>

      <section className="latest-section">
        <div className="latest-title"><span>Последние публикации</span><a href="/materials">Открыть архив<span className="link-arrow" aria-hidden="true"> ↗</span></a></div>
        <div className="latest-list">
          {materials.slice(3).map((material) => {
            const author = getAuthor(material.authorSlug);
            return <a href={`/material/${material.slug}`} key={material.slug}><span>{material.date}</span><strong>{material.title}</strong><span>{material.format}</span><span>{author?.name}</span><i className="link-arrow" aria-hidden="true">↗</i></a>;
          })}
        </div>
      </section>

      <section className="daily-rubric">
        <div className="rubric-title"><span>Рубрика дня · меняется ежедневно</span><h2>Глаз дня</h2></div>
        <div className="eye" aria-hidden="true"><div /></div>
        <div className="rubric-copy"><p>Сегодня он смотрит на поля книги — туда, где читатель пишет собственный параллельный текст.</p><details><summary>Что он увидел?</summary><p>Карандашную птицу, дату без года и трижды подчёркнутое слово «вдруг».</p></details><a className="text-link" href="/rubrics">Все рубрики<span className="link-arrow" aria-hidden="true"> ↗</span></a></div>
      </section>

      <section className="book-section" id="books">
        <div className="section-heading books-heading">
          <div><span className="section-kicker">Носорог · Teller Books · партнёры</span><h2>Книжная<br />витрина</h2></div>
          <div className="section-action"><p>Книги независимых издательских проектов, собранные на одной стороне.</p><Link className="button button-dark" href="/books">Все книги и магазин<span className="link-arrow" aria-hidden="true"> ↗</span></Link></div>
        </div>
        <div className="bookshelf">{books.map((book) => <BookCard book={book} key={book.slug} />)}</div>
      </section>

      <section className="newsletter-section">
        <div><span>Письмо с обратной стороны</span><h2>Один раз<br />в неделю</h2></div>
        <div><p>Новые тексты, книги и маленькие редакционные находки — без алгоритмического шума.</p><NewsletterForm /><a href="https://t.me/obratno_io">Или читать нас в Telegram<span className="link-arrow" aria-hidden="true"> ↗</span></a></div>
      </section>
    </main>
  );
}
