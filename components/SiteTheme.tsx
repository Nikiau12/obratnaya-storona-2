"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type SiteTheme = "black" | "white";

const ThemeContext = createContext<{
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}>({ theme: "black", setTheme: () => undefined });

const storageKey = "obratnaya-storona-theme";
const changeEvent = "obratnaya-storona-theme-change";

function readTheme(): SiteTheme {
  try {
    return window.localStorage.getItem(storageKey) === "white" ? "white" : "black";
  } catch {
    return "black";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "black");

  function setTheme(nextTheme: SiteTheme) {
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The current page still changes even when browser storage is unavailable.
    }
    document.documentElement.dataset.siteTheme = nextTheme;
    window.dispatchEvent(new Event(changeEvent));
  }

  useEffect(() => {
    document.documentElement.dataset.siteTheme = theme;
    document.documentElement.style.colorScheme = theme === "black" ? "dark" : "light";
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useSiteTheme() {
  return useContext(ThemeContext);
}
