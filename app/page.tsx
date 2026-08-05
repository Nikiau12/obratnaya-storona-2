const books = [
  { className: "book black", title: "Тёмный лес интернета", author: "Йорам Вийнгарден" },
  { className: "book acid", title: "Зависимые, рассеянные, скучающие", author: "Доминик Петтман" },
  { className: "book paper", title: "Циклонопедия", author: "Реза Негарестани" },
  { className: "book signal", title: "Сигналы без адресата", author: "Сборник" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Обратная сторона — на главную">
          <span className="brand-mark" aria-hidden="true" />
          <span>Обратная<br />сторона</span>
        </a>
        <div className="edition">
          <span>выпуск 01</span>
          <span>среда, 5 августа</span>
        </div>
        <nav aria-label="Основная навигация">
          <a href="#materials">Материалы</a>
          <a href="#books">Книги</a>
          <a href="#about">О медиа</a>
        </nav>
      </header>

      <div className="ticker" aria-label="Бегущая строка">
        <div className="ticker-track">
          <span>Литература меняет форму</span><i>●</i>
          <span>Слово дня: наизнанку</span><i>●</i>
          <span>Новые тексты ежедневно</span><i>●</i>
          <span>Литература меняет форму</span><i>●</i>
          <span>Слово дня: наизнанку</span><i>●</i>
        </div>
      </div>

      <section className="lead-grid" id="top">
        <article className="lead-story">
          <div className="eyebrow"><span>Длинный текст</span><span>18 мин</span></div>
          <h1>Как читать<br />то, чего<br />не было</h1>
          <p className="standfirst">
            Литература начинается не со слова, а с пропуска между словами. Что мы находим в текстах, которые исчезли, не случились или были придуманы задним числом?
          </p>
          <a className="read-link" href="/material/poetics-of-error">Читать дальше <span>↗</span></a>
        </article>

        <div className="gravity-field" aria-label="Анимация: знаки падают в чёрную дыру">
          <span className="floating glyph-one">О</span>
          <span className="floating glyph-two">Ϝ</span>
          <span className="floating glyph-three">наоборот</span>
          <span className="floating glyph-four">✦</span>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="black-hole"><span>другая<br />сторона<br />чтения</span></div>
        </div>

        <aside className="micro-column">
          <div className="word-card">
            <div className="eyebrow"><span>Слово дня</span><span>05.08</span></div>
            <button className="word" aria-describedby="word-definition">наизнанку</button>
            <div className="word-definition" id="word-definition">
              <p><b>наречие</b></p>
              <p>Внутренней стороной наружу; не так, как принято видеть.</p>
              <p className="quote">«Каждая книга немного выворачивает мир наизнанку».</p>
            </div>
            <p className="hint">наведите, чтобы раскрыть</p>
          </div>
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <blockquote>Читать — значит находить отверстия в привычном порядке вещей.</blockquote>
            <cite>из редакционного блокнота</cite>
          </div>
        </aside>
      </section>

      <section className="materials" id="materials">
        <div className="section-heading">
          <h2>Сегодня<br />на стороне</h2>
          <p>Тексты, разговоры, изображения<br />и несколько странных сигналов.</p>
        </div>

        <div className="story-grid">
          <a className="story story-dark" href="/material/poetics-of-error">
            <div className="story-meta"><span>Эссе</span><span>№ 001</span></div>
            <div className="eclipse" />
            <h3>Поэтика ошибки:<br />зачем тексту сбой</h3>
            <p>Опечатка как соавтор, шум как метод и литература, которая отказывается работать правильно.</p>
            <span className="story-arrow">↗</span>
          </a>

          <a className="story story-interview" href="/material/poetics-of-error">
            <div className="story-meta"><span>Интервью</span><span>27 мин</span></div>
            <div className="portrait-type" aria-hidden="true">А</div>
            <h3>«Архив — это машина воображения»</h3>
            <p>Разговор с исследовательницей Анной Соколовой о памяти, документах и вымышленных источниках.</p>
            <span className="story-arrow">↗</span>
          </a>

          <a className="story story-short" href="/material/poetics-of-error">
            <div className="story-meta"><span>Коротко</span><span>4 мин</span></div>
            <div className="paper-cut"><span>бу</span></div>
            <h3>Бумага помнит сгиб</h3>
            <p>Шесть заметок о материальности книги — от залома страницы до запаха типографской краски.</p>
            <span className="story-arrow">↗</span>
          </a>
        </div>
      </section>

      <section className="daily-rubric">
        <div className="rubric-title">
          <span>Рубрика дня</span>
          <h2>Глаз дня</h2>
        </div>
        <div className="eye" aria-hidden="true"><div /></div>
        <div className="rubric-copy">
          <p>Сегодня он смотрит на поля книги — туда, где читатель пишет собственный параллельный текст.</p>
          <details>
            <summary>Что он увидел?</summary>
            <p>Карандашную птицу, дату без года и трижды подчёркнутое слово «вдруг».</p>
          </details>
        </div>
      </section>

      <section className="book-section" id="books">
        <div className="section-heading books-heading">
          <h2>Книжная<br />витрина</h2>
          <a href="#books">Все книги ↗</a>
        </div>
        <div className="bookshelf">
          {books.map((book, index) => (
            <article className="book-item" key={book.title}>
              <div className={book.className}>
                <span className="book-index">0{index + 1}</span>
                <strong>{book.title}</strong>
                <span className="book-shape" />
              </div>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <button>В магазин ↗</button>
            </article>
          ))}
        </div>
      </section>

      <footer id="about">
        <div className="footer-brand">
          <span className="brand-mark inverse" aria-hidden="true" />
          <h2>Обратная<br />сторона</h2>
        </div>
        <p className="footer-about">Независимое онлайн-медиа о литературе и искусстве. Часть констелляции книжных практик «Обратная сторона».</p>
        <div className="footer-links">
          <a href="#materials">Редакция</a>
          <a href="#materials">Авторы</a>
          <a href="#materials">Предложить текст</a>
          <a href="https://t.me/obratno_io">Telegram ↗</a>
        </div>
        <div className="footer-bottom"><span>© 2026</span><span>obratno.io</span><span>Сделано с другой стороны</span></div>
      </footer>
    </main>
  );
}
