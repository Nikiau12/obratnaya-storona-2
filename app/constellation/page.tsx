import Link from "next/link";
import s from "@/components/sketch/Sketch.module.css";
export const metadata={title:"Созвездие проектов — Обратная сторона"};
export default function Page(){return <main className={s.page}><header className={s.cardIntro}><h1>Обратная сторона</h1><Link href="/">Вернуться в журнал</Link></header><iframe src="/card/index.html" title="Интерактивная визитка Обратной стороны" className={s.constellation}/></main>;}
