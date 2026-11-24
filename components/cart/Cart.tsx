"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cartCatalog, readCart, type CartItem } from "@/lib/cart";
import { Cover } from "../sketch/Cover";
import { BookCover } from "../home/BookCover";
import s from "./Cart.module.css";

const storageKey = "obratnaya-storona-cart-v1";

type CartState = {
  items: CartItem[];
  open: () => void;
  add: (slug: string) => void;
};
const CartContext = createContext<CartState | null>(null);

function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider is required");
  return cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    try { setItems(readCart(localStorage.getItem(storageKey))); } catch {}
    setReady(true);
    function sync(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) setItems(readCart(event.newValue));
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  function add(slug: string) {
    if (!ready || !cartCatalog.some(book => book.slug === slug)) return;
    setItems(current => current.some(item => item.slug === slug)
      ? current.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item)
      : [...current, { slug, quantity: 1 }]);
    setOpened(true);
  }

  function setQuantity(slug: string, quantity: number) {
    setItems(current => quantity < 1
      ? current.filter(item => item.slug !== slug)
      : current.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, quantity) } : item));
  }

  return <CartContext.Provider value={{ items, open: () => setOpened(true), add }}>
    {children}
    <CartPanel opened={opened} close={() => setOpened(false)} items={items} setQuantity={setQuantity} />
  </CartContext.Provider>;
}

export function CartButton({ onOpen }: { onOpen?: () => void }) {
  const cart = useCart();
  return <button type="button" className={s.trigger} onClick={() => { onOpen?.(); cart.open(); }}>Корзина</button>;
}

export function AddToCart({ slug }: { slug: string }) {
  const cart = useCart();
  const selected = cart.items.some(item => item.slug === slug);
  return <button type="button" className={s.add} onClick={() => selected ? cart.open() : cart.add(slug)}>
    {selected ? "В корзине" : "В корзину"}
  </button>;
}

function CartPanel({ opened, close, items, setQuantity }: {
  opened: boolean;
  close: () => void;
  items: CartItem[];
  setQuantity: (slug: string, quantity: number) => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    if (!opened) { node.close(); return; }
    node.showModal();
    node.focus({ preventScroll: true });
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      node.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [opened]);

  return <dialog ref={panel} className={s.panel} aria-labelledby={titleId} onCancel={close}
    onClick={event => { if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    } }}>
    <div className={s.heading}><h2 id={titleId}>Корзина</h2><button type="button" onClick={close}>Закрыть</button></div>
    {items.length === 0 ? <div className={s.empty}><p>В корзине пока пусто</p><Link href="/books" onClick={close}>Витрина</Link></div>
      : <ul className={s.list}>{items.map(item => {
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
            <div className={s.itemActions}>
              <div className={s.quantity} role="group" aria-label={`Количество книги «${entry.title}»`}>
                <button type="button" disabled={item.quantity === 1} aria-label={`Уменьшить количество: ${entry.title}`} onClick={() => setQuantity(item.slug, item.quantity - 1)}>−</button>
                <span aria-live="polite">{item.quantity}</span>
                <button type="button" disabled={item.quantity === 99} aria-label={`Увеличить количество: ${entry.title}`} onClick={() => setQuantity(item.slug, item.quantity + 1)}>+</button>
              </div>
              <button type="button" className={s.remove} aria-label={`Удалить: ${entry.title}`} onClick={() => setQuantity(item.slug, 0)}>Удалить</button>
            </div>
          </div>
        </li>;
      })}</ul>}
  </dialog>;
}
