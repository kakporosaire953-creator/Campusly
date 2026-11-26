/**
 * Apparence — configuration et script d'amorçage.
 * ---------------------------------------------------------------------------
 * Trois PRÉFÉRENCES possibles, partagées par toute l'application :
 *
 *   light  → mode clair éditorial (« Editorial Glass »)
 *   dark   → mode sombre immersif (« Campusly Nocturne »)
 *   system → suit `prefers-color-scheme` et réagit à ses changements
 *
 * L'attribut posé sur `<html>` est le thème RÉSOLU (`light` | `dark`) : c'est
 * le seul que le CSS lit. La préférence brute est conservée dans
 * `data-theme-pref`, pour le sélecteur (et les tests).
 *
 * Aucun composant n'écrit ces attributs directement : ils passent par
 * `applyTheme()`, pour que le thème reste une seule source de vérité.
 */

export type ThemePreference = "light" | "dark" | "system";
export type ThemeResolved = "light" | "dark";

/** Clé de stockage — conservée depuis la version précédente : les visiteurs
 *  qui avaient choisi un thème le retrouvent à l'identique. */
export const THEME_STORAGE_KEY = "campusly.theme";

/** Ordre d'affichage dans le sélecteur. */
export const THEME_OPTIONS: ReadonlyArray<{
  value: ThemePreference;
  icon: string;
  labelKey: "appearance.light" | "appearance.dark" | "appearance.system";
}> = [
  { value: "light", icon: "fa-regular fa-sun", labelKey: "appearance.light" },
  { value: "dark", icon: "fa-regular fa-moon", labelKey: "appearance.dark" },
  { value: "system", icon: "fa-solid fa-circle-half-stroke", labelKey: "appearance.system" },
];

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/** Thème effectif d'une préférence, selon l'environnement système. */
export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ThemeResolved {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/**
 * Applique une préférence au document.
 * `data-theme` porte le thème résolu (lu par le CSS), `data-theme-pref` la
 * préférence (lu par le sélecteur). Les classes `theme-light` / `theme-dark`
 * restent synchronisées : neuf feuilles historiques s'appuient dessus.
 */
export function applyTheme(preference: ThemePreference, prefersDark: boolean): ThemeResolved {
  const resolved = resolveTheme(preference, prefersDark);
  if (typeof document === "undefined") return resolved;

  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePref = preference;
  root.style.colorScheme = resolved;
  root.classList.toggle("theme-light", resolved === "light");
  root.classList.toggle("theme-dark", resolved === "dark");
  return resolved;
}

/** Lit la préférence stockée, ou `system` par défaut. */
export function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * Script exécuté dans `<head>`, AVANT le premier rendu.
 * ---------------------------------------------------------------------------
 * Il est volontairement en ES5 et sans dépendance : il doit s'exécuter même
 * si le bundle principal échoue. Sans lui, la page s'afficherait en clair puis
 * basculerait en sombre (le « flash » que la consigne interdit).
 */
export const themeInitScript = `(function(){try{
var key='${THEME_STORAGE_KEY}';
var stored=localStorage.getItem(key);
var pref=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';
var mq=window.matchMedia('(prefers-color-scheme: dark)');
var resolved=pref==='system'?(mq.matches?'dark':'light'):pref;
var root=document.documentElement;
root.dataset.theme=resolved;
root.dataset.themePref=pref;
root.style.colorScheme=resolved;
root.classList.toggle('theme-light',resolved==='light');
root.classList.toggle('theme-dark',resolved==='dark');
}catch(e){}})();`;
