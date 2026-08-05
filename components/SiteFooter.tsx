import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark inverse" aria-hidden="true" />
        <h2>Обратная<br />сторона</h2>
      </div>
      <div>
        <p className="footer-about">Независимое онлайн-медиа о литературе и искусстве. Часть констелляции книжных практик «Обратная сторона».</p>
        <Link className="button button-acid" href="/contribute">Предложить текст ↗</Link>
      </div>
      <div className="footer-links">
        <Link href="/about">Редакция</Link>
        <Link href="/authors">Авторы</Link>
        <Link href="/materials">Архив</Link>
        <Link href="/search">Поиск</Link>
        <a href="https://t.me/obratno_io">Telegram ↗</a>
      </div>
      <div className="footer-bottom"><span>© 2026</span><span>obratno.io</span><span>Сделано с другой стороны</span></div>
    </footer>
  );
}
