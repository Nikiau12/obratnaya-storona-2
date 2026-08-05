import type { Metadata } from "next";
import { authors, materials } from "@/lib/content";
export const metadata: Metadata = { title: "Авторы — Обратная сторона" };
export default function AuthorsPage() { return <main className="inner-page"><section className="page-hero"><span>Люди на стороне</span><h1>Авторы</h1><p>Исследователи, художники, критики и редакторы, которые создают это медиа.</p></section><div className="authors-grid">{authors.map((author) => <a className="author-card" href={`/authors/${author.slug}`} key={author.slug}><div className="author-monogram">{author.initials}</div><span>{author.role}</span><h2>{author.name}</h2><p>{author.bio}</p><b>{materials.filter((item) => item.authorSlug === author.slug).length} материала ↗</b></a>)}</div></main>; }
