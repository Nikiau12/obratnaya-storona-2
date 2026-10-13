import { getBook, type Material } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "./home/BookCover";
import s from "./editorial/Editorial.module.css";
export function MaterialCard({ material }: { material: Material; compact?: boolean }) {
 return <Link className={s.material} href={`/material/${material.slug}`}><div className={s.materialImage} aria-hidden="true">{material.template === "cover-reviews" ? <div className={s.materialCoverGroup}>{material.mentionedBookSlugs?.map(slug => <BookCover key={slug} book={getBook(slug)!} decorative />)}</div> : material.image ? <Image src={material.image} alt="" width={800} height={600} unoptimized /> : null}</div><div className={s.materialMeta}><span>{material.rubric}</span>{material.draft ? <span>Макет</span> : null}</div><h3>{material.title}</h3>{material.excerpt ? <p>{material.excerpt}</p> : null}</Link>;
}
