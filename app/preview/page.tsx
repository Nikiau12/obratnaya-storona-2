import Link from "next/link";
import s from "@/components/editorial/Editorial.module.css";
const items = [
  ["/preview/interview", "Интервью", "Реплики, стихи с отступами, цитаты внутри ответа. Исходное интервью пока недоступно."],
  ["/preview/object", "Объект недели", "Вырезанный предмет, сведения и текст. Пока используется временная иллюстрация."],
  ["/preview/visual", "Визуальный материал", "Парные изображения с подписями и пояснениями. Нужны редакционные сопоставления и фотографии."],
  ["/preview/home", "Расширенная главная", "Пять анонсов: группы книг, одна книга и материалы без книг. Три новых анонса — макеты."],
  ["/preview/shop", "Сценарий покупки", "Два варианта собственного магазина и вопросы для решения с Катей."],
  ["/bureau", "Бюро", "Структура рассказа, услуг и проектов. Утверждённые тексты ожидаются."],
  ["/about", "О нас", "Структура страницы о проекте. Утверждённый текст ожидается."],
];
export default function PreviewIndex() { return <main className={s.page}><header className={s.hero}><span className={s.kicker}>Рабочая версия</span><h1 className={s.title}>Макеты для согласования</h1><p className={s.intro}>Здесь можно проверить устройство новых страниц до появления окончательных текстов и изображений.</p><Link className={s.textLink} href="/">Основная главная</Link></header><div className={s.previewIndex}>{items.map(([href,title,text],index) => <section key={href}><span className={s.kicker}>{String(index+1).padStart(2,"0")}</span><div><h2 className={s.sectionTitle}><Link href={href}>{title}</Link></h2><p className={s.muted}>{text}</p><Link href={href} className={s.textLink}>Открыть макет</Link></div></section>)}</div></main>; }
