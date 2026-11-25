"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { cartCatalog, type CartItem } from "@/lib/cart";
import { Cover } from "../sketch/Cover";
import { BookCover } from "../home/BookCover";
import s from "./Cart.module.css";

export function CartPanel({ opened, trigger, close, items, setQuantity }: {
  opened: boolean;
  trigger: HTMLElement | null;
  close: () => void;
  items: CartItem[];
  setQuantity: (slug: string, quantity: number) => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = panel.current;
    if (!node || !opened) return;
    const opener = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousOverflow = document.documentElement.style.overflow;
    node.showModal();
    node.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      node.close();
      document.documentElement.style.overflow = previousOverflow;
      const canRestore = opener?.isConnected && opener.getClientRects().length
        && opener.matches("button,a[href],input,select,textarea,[tabindex]");
      const target = canRestore ? opener : document.querySelector<HTMLButtonElement>("[data-navigation] > button");
      if (target?.getClientRects().length) target.focus({ preventScroll: true });
    };
  }, [opened, trigger]);

  return <dialog ref={panel} className={s.panel} tabIndex={-1} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); close(); }}>
    <div className={s.heading}>
      <h2 id={titleId}>Корзина</h2>
      <button type="button" onClick={close}>Закрыть</button>
    </div>
    <div className={s.content}>
      {items.length === 0 ? <div className={s.empty}>
        <p>В корзине пока пусто</p>
        <Link href="/books" onClick={close}>Витрина</Link>
      </div> : <ul className={s.list}>{items.map(item => {
        const entry = cartCatalog.find(book => book.slug === item.slug);
        if (!entry) return null;
        return <li key={item.slug} className={s.item}>
          <Link className={s.cover} href={entry.href} onClick={close} aria-label={entry.title}>
            {entry.kind === "sketch" ? <Cover book={entry.book} /> : <BookCover book={entry.book} />}
          </Link>
          <div className={s.copy}>
            <Link className={s.title} href={entry.href} onClick={close}>{entry.title}</Link>
            {entry.author && <p>{entry.author}</p>}
            <p>{entry.publisher}</p>
          </div>
          <div className={s.quantity} role="group" aria-label={`Количество книги «${entry.title}»`}>
            <button type="button" disabled={item.quantity === 1} aria-label={`Уменьшить количество: ${entry.title}`} onClick={() => setQuantity(item.slug, item.quantity - 1)}>−</button>
            <span aria-live="polite">{item.quantity}</span>
            <button type="button" disabled={item.quantity === 99} aria-label={`Увеличить количество: ${entry.title}`} onClick={() => setQuantity(item.slug, item.quantity + 1)}>+</button>
          </div>
          <button type="button" className={s.remove} aria-label={`Удалить: ${entry.title}`} onClick={() => setQuantity(item.slug, 0)}>Удалить</button>
        </li>;
      })}</ul>}
    </div>
  </dialog>;
}
