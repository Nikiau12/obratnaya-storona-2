import { getBook, type Material } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "./home/BookCover";
import s from "./editorial/Editorial.module.css";
export function MaterialCard({ material }: { material: Material; compact?: boolean }) {
 const book = material.template === "book-week" ? getBook(material.mentionedBookSlugs?.[0] ?? "") : undefined;
 return <Link className={s.material} data-material-card data-template={material.template} href={`/material/${material.slug}`}><div className={s.materialImage} data-material-image aria-hidden="true">{material.template === "cover-reviews" ? <div className={s.materialCoverGroup} data-cover-group>{material.mentionedBookSlugs?.map(slug => <BookCover key={slug} book={getBook(slug)!} decorative />)}</div> : book ? <BookCover book={book} decorative /> : material.image ? <Image src={material.image} alt="" width={800} height={600} unoptimized /> : null}</div><div data-material-copy><div className={s.materialMeta}><span>{material.rubric}</span>{material.draft ? <span>Макет</span> : null}</div><h3>{material.title}</h3>{material.excerpt ? <p>{material.excerpt}</p> : null}</div></Link>;
}
