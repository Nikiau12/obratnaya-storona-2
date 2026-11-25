import { readCart, type CartItem } from "./cart";

const storageKey = "obratnaya-storona-cart-v1";
const empty: CartItem[] = [];
const listeners = new Set<() => void>();
let snapshot = empty;
let initialized = false;
let volatile = false;

function notify() { listeners.forEach(listener => listener()); }
function load() {
  if (volatile) return;
  try { snapshot = readCart(localStorage.getItem(storageKey)); } catch { /* Keep the in-memory cart. */ }
  initialized = true;
}
function storage(event: StorageEvent) {
  if (event.key !== storageKey && event.key !== null) return;
  snapshot = readCart(event.newValue); initialized = true; volatile = false; notify();
}

export function subscribeCart(listener: () => void) {
  if (listeners.size === 0) {
    // Refresh after a period without subscribers (for example hot reload).
    load();
    window.addEventListener("storage", storage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", storage);
  };
}
export function cartSnapshot() {
  if (!initialized) load();
  return snapshot;
}
export function serverCartSnapshot() { return empty; }
export function updateCart(update: (current: CartItem[]) => CartItem[]) {
  snapshot = update(cartSnapshot());
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
    volatile = false;
  } catch {
    // A later subscription must not replace unsaved choices with stale storage.
    volatile = true;
  }
  notify();
}
