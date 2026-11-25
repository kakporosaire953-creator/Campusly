"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  isThemePreference,
  readStoredPreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
  type ThemeResolved,
} from "./config";

/**
 * Fournisseur d'apparence — source de vérité unique.
 * ---------------------------------------------------------------------------
 * Remplace l'ancien `ThemeProvider` à deux états (`light` / `dark`). Ce qui
 * change :
 *
 *  - trois préférences, dont `system` (valeur par défaut) ;
 *  - le thème RÉSOLU est recalculé quand le système change, tant que la
 *    préférence est `system` ;
 *  - la préférence `system` n'écrit rien dans `localStorage` : on ne fige pas
 *    un choix que l'utilisateur n'a pas fait ;
 *  - un changement demandé par l'utilisateur déclenche une transition courte
 *    (`is-theme-switching`, 220 ms) — jamais au premier rendu ;
 *  - l'attribut `data-theme` est déjà posé par le script inline du `<head>`,
 *    donc aucun état React n'est nécessaire au rendu serveur : pas de
 *    désaccord d'hydratation.
 *
 * Le composant ne rend aucun balisage : il ne peut pas décaler la mise en page.
 */

interface ThemeContextValue {
  /** Préférence choisie. */
  preference: ThemePreference;
  /** Thème réellement appliqué. */
  resolved: ThemeResolved;
  systemPrefersDark: boolean;
  setPreference: (value: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Durée de la transition de surface entre deux environnements. */
const SWITCH_DURATION = 240;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [resolved, setResolved] = useState<ThemeResolved>("light");
  /* Garde d'hydratation. Sans elle, l'effet « suivre le système » s'exécute au
     PREMIER passage avec les valeurs initiales (`system`, clair) et réécrit
     `data-theme="light"` avant que la préférence mémorisée n'ait été relue :
     un visiteur qui avait choisi le sombre voyait la page s'éclaircir juste
     après le chargement. Vérifié en navigateur : `data-theme` valait « dark »
     au chargement, puis « light » 800 ms plus tard. */
  const [hydrated, setHydrated] = useState(false);

  /* Au montage : on relit ce que le script inline a déjà appliqué. React ne
     décide de rien au premier rendu, il se cale sur le document. */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(media.matches);

    const fromDom = document.documentElement.dataset.themePref;
    const initial = isThemePreference(fromDom) ? fromDom : readStoredPreference();
    const current = document.documentElement.dataset.theme;
    setPreferenceState(initial);
    setResolved(current === "dark" ? "dark" : resolveTheme(initial, media.matches));
    setHydrated(true);

    const onSystemChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  /* La préférence `system` suit le système en direct — mais seulement APRÈS
     avoir relu la préférence réelle (voir la garde d'hydratation). */
  useEffect(() => {
    if (!hydrated || preference !== "system") return;
    setResolved(applyTheme("system", systemPrefersDark));
  }, [hydrated, preference, systemPrefersDark]);

  const setPreference = useCallback(
    (value: ThemePreference) => {
      const next = resolveTheme(value, window.matchMedia("(prefers-color-scheme: dark)").matches);

      /* Transition de surface : on ne l'applique que si le thème change
         réellement (cliquer « clair » en mode clair ne doit rien animer). */
      const root = document.documentElement;
      const changed = root.dataset.theme !== next;
      if (changed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("is-theme-switching");
        window.setTimeout(() => root.classList.remove("is-theme-switching"), SWITCH_DURATION);
      }

      setPreferenceState(value);
      setResolved(applyTheme(value, window.matchMedia("(prefers-color-scheme: dark)").matches));

      try {
        /* `system` est une absence de choix : on efface l'entrée plutôt que
           d'y écrire la valeur, pour que « automatique » le reste vraiment. */
        if (value === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
        else window.localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        // Stockage indisponible (navigation privée) : le choix vaut pour la
        // session en cours.
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ preference, resolved, systemPrefersDark, setPreference }),
    [preference, resolved, systemPrefersDark, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un <ThemeProvider>.");
  }
  return context;
}
