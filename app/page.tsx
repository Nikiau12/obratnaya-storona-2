import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { books } from "@/lib/content";

const bookBySlug = Object.fromEntries(books.map((book) => [book.slug, book]));

export default function Home() {
  const vesele = bookBySlug["vesele-krushenii"];
  const pruzhina = bookBySlug.pruzhina;
  const aloe = bookBySlug.aloe;

  return (
    <main className="home-collage">
      <section className="object-field" aria-labelledby="home-field-title">
        <div className="field-intro"><span>Онлайн-медиа ОС · литература и искусство</span><p>Выпуск 01 · август 2026</p></div>

        <Link className="field-object fragment-link title-object title-object-main" href="/material/poetics-of-error">
          <span className="object-type">История текста · 18 минут</span>
          <h1 id="home-field-title">Роман Александра Введенского «Убийцы вы дураки»: история потерянной рукописи</h1>
          <span className="open-mark">читать</span>
        </Link>
        <Link className="field-object fragment-link image-object image-object-swing" href="/material/poetics-of-error" aria-label="Открыть материал о потерянной рукописи">
          <Image src="/nosorog/cutouts/swinging-man.png" alt="Человек, раскачивающийся на верёвках" width={1254} height={1254} priority />
          <span className="image-caption">Фрагмент изображения из архива «Носорога»</span>
        </Link>
        <div className="field-object fragment-static word-object">
          <span className="static-mark">только на главной</span><p>Слово дня</p><strong>наизнанку</strong><small>наречие · внутренней стороной наружу</small>
        </div>

        <Link className="field-object fragment-link title-object title-object-berger" href="/material/signal-in-static">
          <span className="object-type">Эссе + плейлист</span><h2>Play me something, Джон Берджер</h2><span className="open-mark">слушать и читать</span>
        </Link>
        <Link className="field-object fragment-link image-object image-object-speakers" href="/material/signal-in-static" aria-label="Открыть материал Play me something, Джон Берджер">
          <Image src="/nosorog/cutouts/loudspeakers.png" alt="Композиция из громкоговорителей" width={1254} height={1254} />
        </Link>
        <div className="field-object fragment-static eye-object">
          <span className="static-mark">рубрика главной</span><div className="collage-eye" aria-hidden="true"><i /></div><strong>Глаз дня</strong><p>Сегодня смотрит не на изображение, а на место, где оно должно было быть.</p>
        </div>
        <Link className="field-object fragment-link quote-object" href="/material/archive-machine">
          <span className="object-type">Фрагмент будущего материала</span><blockquote>«Сновидение — это черновик, который отказывается становиться окончательным текстом»</blockquote><span className="open-mark">откуда эта цитата?</span>
        </Link>

        <Link className="field-object fragment-link title-object title-object-dreams" href="/material/archive-machine">
          <span className="object-type">Коллективный разбор</span><h2>Психоаналитики толкуют сновидения Беньямина, Адорно и Сумарокова</h2><span className="open-mark">читать</span>
        </Link>
        <Link className="field-object fragment-link image-object image-object-bat" href="/material/archive-machine" aria-label="Открыть материал о сновидениях">
          <Image src="/nosorog/cutouts/bat-jar.png" alt="Летучая мышь под стеклянным колпаком" width={1254} height={1254} />
        </Link>
        <Link className="field-object fragment-link title-object title-object-covers" href="/material/paper-remembers">
          <span className="object-type">Три обложки · три коротких текста</span><h2>Обзор книжных обложек. Vol I</h2><span className="open-mark">смотреть</span>
        </Link>
        <Link className="field-object fragment-link image-object image-object-watercolor" href="/material/paper-remembers" aria-label="Открыть обзор книжных обложек">
          <Image src="/nosorog/cutouts/watercolor-figures.png" alt="Акварель с цветными фигурами" width={1254} height={1254} />
        </Link>
        <Link className="field-object fragment-link title-object title-object-silliman" href="/material/voice-of-paper">
          <span className="object-type">Интервью</span><h2>Интервью с Роном Силлиманом</h2><p>О длинном предложении, паузах и чтении как физической работе.</p><span className="open-mark">разговор целиком</span>
        </Link>
        <Link className="field-object fragment-link title-object title-object-odyssey" href="/material/reverse-side-of-image">
          <span className="object-type">Просмотр с пристрастием</span><h2>Мы заставили Григория Стариковского посмотреть «Одиссею»</h2><span className="open-mark">узнать, что произошло</span>
        </Link>
        <div className="field-object fragment-static animal-object" aria-label="Некликабельное изображение из архива Носорога">
          <span className="static-mark">найденный знак</span><Image src="/nosorog/cutouts/green-animal.png" alt="Зелёный силуэт прыгающего животного" width={1254} height={1254} />
        </div>

        <div className="field-object shelf-label" id="books"><span>Онлайн-книжный · встроен в медиа</span><h2>Книги тоже говорят</h2><Link href="/books">Вся книжная витрина</Link></div>
        <Link className="field-object fragment-link book-object book-object-vesele" href={`/books/${vesele.slug}`}>
          <Image src={vesele.image} alt={`Обложка книги «${vesele.title}»`} width={590} height={590} unoptimized /><span>{vesele.publisher}</span><strong>{vesele.title}</strong><small>{vesele.price}</small><span className="open-mark">о книге</span>
        </Link>
        <Link className="field-object fragment-link book-object book-object-pruzhina" href={`/books/${pruzhina.slug}`}>
          <Image src={pruzhina.image} alt={`Обложка книги «${pruzhina.title}»`} width={590} height={590} unoptimized /><span>{pruzhina.publisher}</span><strong>{pruzhina.title}</strong><small>{pruzhina.price}</small><span className="open-mark">о книге</span>
        </Link>
        <Link className="field-object fragment-link book-object book-object-aloe" href={`/books/${aloe.slug}`}>
          <Image src={aloe.image} alt={`Обложка книги «${aloe.title}»`} width={590} height={590} unoptimized /><span>{aloe.publisher}</span><strong>{aloe.title}</strong><small>{aloe.price}</small><span className="open-mark">о книге</span>
        </Link>
        <Link className="field-object fragment-link book-mention" href={`/books/${vesele.slug}`}>
          <span>Книга упоминается в материале</span><strong>«Веселье крушений»</strong><p>Можно перейти в витрину и найти, где её купить.</p><span className="open-mark">к книге</span>
        </Link>
        <div className="field-source">Временные изображения: архив издательства и журнала «Носорог»</div>
      </section>

      <section className="collage-newsletter">
        <div><span>Письмо с обратной стороны</span><h2>Иногда<br />по четвергам</h2></div>
        <div><p>Новые тексты, книги, изображения и то, что не поместилось на главную.</p><NewsletterForm /><a href="https://t.me/obratno_io">Или читать нас в Telegram</a></div>
      </section>
    </main>
  );
}
