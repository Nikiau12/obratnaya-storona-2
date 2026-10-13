"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return children;
  return <><SiteHeader /><div id="page-content" tabIndex={-1}>{children}</div><SiteFooter /></>;
}
