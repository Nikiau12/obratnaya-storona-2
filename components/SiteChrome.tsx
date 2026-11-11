"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SiteThemeProvider } from "./SiteTheme";
import { PortalRestoration } from "./sketch/Portal";
import s from "./editorial/Editorial.module.css";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = pathname === "/" || pathname === "/preview/home" || pathname === "/preview/typography" || pathname === "/preview/composition" || pathname === "/preview/relations" || pathname === "/preview/editorial" || pathname === "/preview/previous"
    ? children
    : <div className={s.shell}><SiteHeader /><div id="page-content" tabIndex={-1}>{children}</div><SiteFooter /></div>;
  return <SiteThemeProvider><PortalRestoration />{content}</SiteThemeProvider>;
}
