"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { useSiteTheme } from "../SiteTheme";
import s from "./Sketch.module.css";

const bookmarkKey = "obratnaya-portal-origin";
const returnKey = "obratnaya-portal-return";
type Bookmark = { path: string; top: number; time: number; focus: string };

function readBookmark(): Bookmark | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(bookmarkKey) || "null");
    if (value && typeof value.path === "string" && value.path.startsWith("/") && !value.path.startsWith("//") && !value.path.startsWith("/constellation") && Number.isFinite(value.top) && Date.now() - value.time < 3600000) return value;
  } catch { /* Navigation works without browser storage. */ }
  return null;
}

function normalClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function PortalLink({ children, className, label, animate = false }: {children: ReactNode; className?: string; label?: string; animate?: boolean}) {
  const router = useRouter();
  const [iris, setIris] = useState<CSSProperties | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function enter(event: MouseEvent<HTMLAnchorElement>) {
    if (!normalClick(event)) return;
    event.preventDefault();
    if (location.pathname === "/constellation") return;
    if (timer.current) return;
    try {
      sessionStorage.setItem(bookmarkKey, JSON.stringify({path: location.pathname + location.search, top: window.scrollY, time: Date.now(), focus: animate ? "hole" : "footer"}));
    } catch { /* The link remains usable when storage is blocked. */ }
    if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push("/constellation"); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const w = rect.width * .72, h = Math.max(24, rect.height * .45);
    setIris({left: rect.left + rect.width / 2 - w / 2, top: rect.top + rect.height / 2 - h / 2, width: w, height: h, "--portal-scale": Math.max(innerWidth / w, innerHeight / h) * 4} as CSSProperties);
    timer.current = setTimeout(() => { router.push("/constellation"); }, 320);
  }
  return <><Link href="/constellation" className={className} aria-label={label} onClick={enter} onPointerEnter={() => router.prefetch("/constellation")} data-portal-origin={animate ? "hole" : "footer"} data-leaving={Boolean(iris)}>{children}</Link>{iris && createPortal(<div className={s.portalIris} style={iris} aria-hidden="true"/>, document.body)}</>;
}

export function PortalRestoration() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  useLayoutEffect(() => {
    let explicit = false;
    try { explicit = sessionStorage.getItem(returnKey) === "true"; } catch { /* Optional persistence. */ }
    const bookmark = readBookmark();
    const restore = (previous.current === "/constellation" || explicit) && bookmark?.path.split("?")[0] === pathname;
    previous.current = pathname;
    if (!restore || !bookmark) return;
    try { sessionStorage.removeItem(returnKey); } catch { /* Optional persistence. */ }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        window.scrollTo({top: bookmark.top, behavior: "instant"});
        document.querySelector<HTMLElement>(`[data-portal-origin="${bookmark.focus === "hole" ? "hole" : "footer"}"]`)?.focus({preventScroll: true});
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}

export function Constellation() {
  const router = useRouter();
  const { theme } = useSiteTheme();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const syncTheme = () => iframe.current?.contentWindow?.postMessage({type: "obratnaya:theme", theme}, location.origin);
  useEffect(() => { syncTheme(); }, [theme]);
  useEffect(() => {
    function navigate(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== iframe.current?.contentWindow || event.data?.type !== "obratnaya:navigate") return;
      if (["/materials", "/books"].includes(event.data.href)) router.push(event.data.href);
    }
    window.addEventListener("message", navigate);
    return () => window.removeEventListener("message", navigate);
  }, [router]);
  function returnToReading(event: MouseEvent<HTMLAnchorElement>) {
    if (!normalClick(event)) return;
    event.preventDefault();
    try { sessionStorage.setItem(returnKey, "true"); } catch { /* Fall back to the homepage. */ }
    router.push(readBookmark()?.path || "/", {scroll: false});
  }
  return <main className={`${s.page} ${s.portalDestination}`}><header className={s.cardIntro}><h1>Обратная сторона</h1><Link href="/" onClick={returnToReading}>Вернуться в журнал</Link></header><iframe ref={iframe} src="/card/index.html" title="Интерактивная визитка Обратной стороны" className={s.constellation} data-ready={ready} onLoad={() => {syncTheme(); setReady(true);}}/></main>;
}
