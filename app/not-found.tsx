import Link from "next/link";
export default function NotFound() { return <main className="not-found"><span>404</span><h1>Эта сторона пока пуста</h1><p>Страница могла переехать или ещё не была опубликована.</p><Link className="button button-dark" href="/">Вернуться на главную</Link></main>; }
