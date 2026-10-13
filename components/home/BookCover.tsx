import Image from "next/image";
import type { Book } from "@/lib/content";
import styles from "./HomeComposition.module.css";

export function BookCover({ book, priority = false, decorative = false }: { book: Book; priority?: boolean; decorative?: boolean }) {
  const size = book.imageSize;
  return (
    <span style={book.imageCrop ? undefined : { aspectRatio: `${size.width} / ${size.height}` }} className={`${styles.cover} ${book.imageCrop === "nosorog" ? styles.croppedCover : ""}`}>
      <Image src={book.image} alt={decorative ? "" : `Обложка книги «${book.title}»`} width={size.width} height={size.height} sizes="(max-width: 700px) 40vw, 260px" priority={priority} unoptimized />
    </span>
  );
}
