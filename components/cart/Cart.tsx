"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { cartCatalog, type CartItem } from "@/lib/cart";
import { subscribeCart, cartSnapshot, serverCartSnapshot, updateCart } from "@/lib/cart-store";
import { CartPanel } from "./CartPanel";
import s from "./Cart.module.css";

type CartState = {
  items: CartItem[];
  open: (trigger: HTMLElement) => void;
  add: (slug: string, trigger: HTMLElement) => void;
};
const CartContext = createContext<CartState | null>(null);

function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider is required");
  return cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, cartSnapshot, serverCartSnapshot);
  const [opened, setOpened] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  function open(trigger: HTMLElement) { setTrigger(trigger); setOpened(true); }
  function close() { setOpened(false); setTrigger(null); }

  function add(slug: string, trigger: HTMLElement) {
    if (!cartCatalog.some(book => book.slug === slug)) return;
    updateCart(current => current.some(item => item.slug === slug)
      ? current.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item)
      : [...current, { slug, quantity: 1 }]);
    open(trigger);
  }

  function setQuantity(slug: string, quantity: number) {
    updateCart(current => quantity < 1
      ? current.filter(item => item.slug !== slug)
      : current.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, quantity) } : item));
  }

  return <CartContext.Provider value={{ items, open, add }}>
    {children}
    <CartPanel opened={opened} trigger={trigger} close={close} items={items} setQuantity={setQuantity} />
  </CartContext.Provider>;
}

export function CartButton({ onOpen }: { onOpen?: () => void }) {
  const cart = useCart();
  return <button type="button" className={s.trigger} onClick={event => { cart.open(event.currentTarget); onOpen?.(); }}>Корзина</button>;
}

export function AddToCart({ slug }: { slug: string }) {
  const cart = useCart();
  const selected = cart.items.some(item => item.slug === slug);
  return <button type="button" className={s.add} onClick={event => selected ? cart.open(event.currentTarget) : cart.add(slug, event.currentTarget)}>
    {selected ? "В корзине" : "В корзину"}
  </button>;
}
