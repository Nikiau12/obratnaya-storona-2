"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type SiteTheme = "black" | "white";

const ThemeContext = createContext<{
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}>({ theme: "black", setTheme: () => undefined });

const storageKey = "obratnaya-storona-theme";
const changeEvent = "obratnaya-storona-theme-change";
let fallbackTheme: SiteTheme = "black";
let volatileTheme: SiteTheme | null = null;

function readTheme(): SiteTheme {
  if (volatileTheme) return volatileTheme;
  try {
    return window.localStorage.getItem(storageKey) === "white" ? "white" : "black";
  } catch {
    return fallbackTheme;
  }
}

function subscribe(onChange: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    volatileTheme = null;
    onChange();
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<SiteTheme>(subscribe, readTheme, () => "black");

  function setTheme(nextTheme: SiteTheme) {
    fallbackTheme = nextTheme;
    try {
      window.localStorage.setItem(storageKey, nextTheme);
      volatileTheme = null;
    } catch {
      // The current page still changes even when browser storage is unavailable.
      volatileTheme = nextTheme;
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
