import Image from "next/image";
import Link from "next/link";

const issueItems = [
  ["001", "Убийцы вы дураки", "/material/poetics-of-error"],
  ["002", "Толкование сновидений", "/material/archive-machine"],
  ["003", "Обзор обложек. Vol I", "/material/paper-remembers"],
  ["004", "Интервью с Роном Силлиманом", "/material/voice-of-paper"],
  ["005", "Мы посмотрели «Одиссею»", "/materials"],
  ["006", "Play me something, Джон Берджер", "/material/signal-in-static"],
] as const;

export default function Home() {
  return (
    <main className="editorial-territory">
      <nav className="territory-nav" aria-label="Навигация по выпуску">
        <Link className="territory-brand" href="/">Обратная<br />сторона</Link>
        <div className="territory-edition">
          <span>Онлайн-медиа ОС</span>
          <span>Выпуск 01 · август 2026</span>
        </div>
        <div className="territory-nav-links">
          <Link href="/materials">Все материалы</Link>
          <Link href="/books">Книги</Link>
          <Link href="/search">Поиск</Link>
        </div>
      </nav>

      <details className="territory-index">
        <summary><span>Содержание выпуска</span><b>01—06</b></summary>
        <div className="territory-index-panel">
          <div className="territory-index-heading"><span>Обратная сторона · выпуск 01</span><b>Содержание</b></div>
          <nav aria-label="Содержание первого выпуска">
            {issueItems.map(([number, title, href]) => (
              <Link href={href} key={number}><small>{number}</small><span>{title}</span></Link>
            ))}
          </nav>
          <div className="territory-index-footer">
            <Link href="/materials">Редакционный архив</Link>
            <Link href="/books">Книжная витрина</Link>
          </div>
        </div>
      </details>

      <section className="territory-scene territory-scene-one" aria-labelledby="territory-main-title">
        <Link className="territory-object territory-link territory-lead" href="/material/poetics-of-error">
          <span className="territory-kicker">История текста · материал 001</span>
          <h1 id="territory-main-title">Роман Александра Введенского «Убийцы вы дураки»: история потерянной рукописи</h1>
          <span className="territory-action">Открыть материал</span>
        </Link>

        <div className="territory-connection connection-one" aria-hidden="true"><span>тот же текст · другой вход</span><i /></div>

        <Link className="territory-object territory-link territory-absence" href="/material/poetics-of-error">
          <span className="territory-kicker">Фрагмент материала 001</span>
          <p>Название сохранилось.<br />Рукопись исчезла.<br />История осталась.</p>
          <span className="territory-action">Продолжить с этого места</span>
        </Link>

        <figure className="territory-found territory-found-eye">
          <Image src="/references/os/max-ernst-eye.png" width={573} height={691} alt="Коллаж Макса Эрнста с глазом" sizes="(max-width: 700px) 46vw, 18vw" />
          <figcaption>Найденный объект · визуальная пауза</figcaption>
        </figure>

        <div className="territory-object territory-static territory-word">
          <span className="territory-kicker">Слово дня · редакционная вставка</span>
          <strong>наизнанку</strong>
          <p>внутренней стороной наружу</p>
        </div>

        <Link className="territory-object territory-link territory-berger" href="/material/signal-in-static">
          <span className="territory-kicker">Эссе + плейлист · материал 006</span>
          <h2>Play me something,<br />Джон Берджер</h2>
          <span className="territory-action">Слушать и читать</span>
        </Link>

        <p className="territory-editor-note">Не лента новостей, а территория одного выпуска</p>
      </section>

      <section className="territory-scene territory-scene-two" aria-labelledby="territory-dreams-title">
        <Link className="territory-object territory-link territory-dreams" href="/material/archive-machine">
          <span className="territory-kicker">Коллективный разбор · материал 002</span>
          <h2 id="territory-dreams-title">Психоаналитики толкуют сновидения Беньямина, Адорно и Сумарокова</h2>
          <span className="territory-action">Читать разбор</span>
        </Link>

        <div className="territory-connection connection-two" aria-hidden="true"><span>цитата из материала 002</span><i /></div>

        <Link className="territory-object territory-link territory-dream-quote" href="/material/archive-machine">
          <span className="territory-kicker">Один фрагмент · тот же вход</span>
          <blockquote>«Сновидение — это черновик, который отказывается становиться окончательным текстом»</blockquote>
          <span className="territory-action">Откуда эта цитата?</span>
        </Link>

        <figure className="territory-found territory-found-orchid">
          <Image src="/references/os/mapplethorpe-orchid.png" width={573} height={632} alt="Фотография орхидеи Роберта Мэпплторпа" sizes="(max-width: 700px) 52vw, 20vw" />
          <figcaption>Найденный объект · без обязательного объяснения</figcaption>
        </figure>

        <div className="territory-object territory-static territory-eye-note">
          <span className="territory-kicker">Глаз дня · редакционная вставка</span>
          <b aria-hidden="true">◉</b>
          <p>Сегодня смотрит на место, где изображения ещё нет.</p>
        </div>

        <Link className="territory-object territory-link territory-covers" href="/material/paper-remembers">
          <span className="territory-kicker">Три коротких текста · материал 003</span>
          <h2>Обзор книжных обложек. Vol I</h2>
          <span className="territory-action">Смотреть материал</span>
        </Link>

        <Link className="territory-object territory-link territory-book-trace" href="/books/vesele-krushenii">
          <span className="territory-kicker">Книга внутри выпуска</span>
          <strong>«Веселье крушений»</strong>
          <p>Упомянута в материале 001</p>
          <span className="territory-action">В книжную витрину</span>
        </Link>

        <p className="territory-editor-note">Конец территории · дальше архив и книжная витрина</p>
      </section>
    </main>
  );
}
