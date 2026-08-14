import type { Metadata } from "next";
import Link from "next/link";
import { authors, materials } from "@/lib/content";

export const metadata: Metadata = { title: "Авторы — Обратная сторона" };

function materialLabel(count: number) {
  return `${count} ${count === 1 ? "материал" : "материала"}`;
}

export default function AuthorsPage() {
  return (
    <main className="authors-index">
      <section className="authors-field">
        <div className="authors-kicker"><span>Люди на стороне</span><span>Выпуск 01 · 2026</span></div>
        <div className="authors-title">
          <h1>Авторы</h1>
          <p>Исследователи, художники, критики и редакторы. У каждого — собственный способ смотреть на текст, изображение и книгу.</p>
        </div>

        <aside className="authors-stamp" aria-label={`${authors.length} автора и ${materials.length} материалов`}>
          <b>{String(authors.length).padStart(2, "0")}</b>
          <span>голоса</span>
          <small>{String(materials.length).padStart(2, "0")} материалов</small>
        </aside>

        <div className="authors-objects">
          {authors.map((author, index) => {
            const authorMaterials = materials.filter((item) => item.authorSlug === author.slug);
            const latest = authorMaterials[0];
            return (
              <Link className={`author-object author-object-${index + 1}`} href={`/authors/${author.slug}`} key={author.slug}>
                <span className="author-object-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="author-object-initials" aria-hidden="true">{author.initials}</span>
                <div className="author-object-copy">
                  <span>{author.role}</span>
                  <h2>{author.name}</h2>
                  <p>{author.bio}</p>
                </div>
                <div className="author-object-footer">
                  <span>{materialLabel(authorMaterials.length)}</span>
                  {latest ? <span>Последнее: {latest.shortTitle}</span> : null}
                  <b>Открыть автора</b>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="authors-note" aria-hidden="true">
          <span>редакционная<br />констелляция</span>
          <i>↘</i>
        </div>
      </section>
    </main>
  );
}
