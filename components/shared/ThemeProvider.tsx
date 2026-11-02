"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Thème clair / sombre.
 * ---------------------------------------------------------------------------
 * - La préférence est stockée dans `localStorage` (`campusly.theme`).
 * - Au premier chargement, on suit `prefers-color-scheme`.
 * - L'attribut `data-theme` est posé sur `<html>` par un script inline (voir
 *   `app/layout.tsx`) AVANT le premier rendu : pas de flash blanc au
 *   chargement d'une page sombre.
 * - La classe historique `theme-light` reste synchronisée : plusieurs feuilles
 *   de `styles/legacy/` s'appuient dessus.
 */

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "campusly.theme";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
  root.classList.toggle("theme-light", mode === "light");
  root.classList.toggle("theme-dark", mode === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  // Synchronise l'état React avec ce que le script inline a déjà appliqué.
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "dark" || current === "light") {
      setThemeState(current);
      return;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: ThemeMode = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    applyTheme(mode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Stockage indisponible (navigation privée) : le thème reste valable
      // pour la session en cours.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un <ThemeProvider>.");
  }
  return context;
}

/** Script exécuté avant le premier rendu : évite tout flash de thème. */
export const themeInitScript = `(function(){try{
var key='${THEME_STORAGE_KEY}';
var stored=localStorage.getItem(key);
var system=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
var mode=(stored==='dark'||stored==='light')?stored:system;
var root=document.documentElement;
root.dataset.theme=mode;
root.style.colorScheme=mode;
root.classList.toggle('theme-light',mode==='light');
root.classList.toggle('theme-dark',mode==='dark');
}catch(e){}})();`;
