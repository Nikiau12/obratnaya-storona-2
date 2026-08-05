import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MaterialCard } from "@/components/MaterialCard";
import { authors, getAuthor, materials } from "@/lib/content";
export function generateStaticParams() { return authors.map((author) => ({ slug: author.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const author = getAuthor((await params).slug); return author ? { title: `${author.name} — Обратная сторона`, description: author.bio } : {}; }
export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) { const author = getAuthor((await params).slug); if (!author) notFound(); const authorMaterials = materials.filter((item) => item.authorSlug === author.slug); return <main className="inner-page"><section className="author-hero"><div className="author-monogram large">{author.initials}</div><div><span>{author.role}</span><h1>{author.name}</h1><p>{author.bio}</p></div></section><section className="author-materials"><div className="simple-heading"><h2>Материалы автора</h2><span>{authorMaterials.length}</span></div><div className="archive-grid">{authorMaterials.map((material) => <MaterialCard material={material} key={material.slug} />)}</div></section></main>; }
