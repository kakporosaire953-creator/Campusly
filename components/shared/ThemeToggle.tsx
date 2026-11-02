"use client";

import { useTheme } from "@/components/shared/ThemeProvider";

/**
 * Bascule clair / sombre.
 * Bouton réel (pas un simple lien) : `aria-pressed` et libellé explicite pour
 * les lecteurs d'écran, icône Font Awesome déjà chargée par le site.
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Passer au thème clair" : "Passer au thème sombre";

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "is-compact" : ""}`}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <i className="fa-solid fa-sun theme-toggle-sun" />
        <i className="fa-solid fa-moon theme-toggle-moon" />
      </span>
      {compact ? null : <span className="theme-toggle-label">{isDark ? "Sombre" : "Clair"}</span>}
    </button>
  );
}
