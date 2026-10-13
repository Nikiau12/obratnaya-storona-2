import Image from "next/image";
import type { Book } from "@/lib/content";
import styles from "./HomeComposition.module.css";

export function BookCover({ book, priority = false, decorative = false }: { book: Book; priority?: boolean; decorative?: boolean }) {
  return (
    <span style={book.slug === "beyond-horizon" ? { aspectRatio: "725 / 1200" } : undefined} className={`${styles.cover} ${book.imageCrop === "nosorog" ? styles.croppedCover : ""} ${book.slug === "ideal-museum" ? styles.squareCover : ""}`}>
      <Image src={book.image} alt={decorative ? "" : `Обложка книги «${book.title}»`} width={600} height={book.slug === "ideal-museum" ? 600 : 900} sizes="(max-width: 700px) 40vw, 260px" priority={priority} unoptimized />
    </span>
  );
}
