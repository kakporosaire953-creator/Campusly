/**
 * Campusly — accès à la langue côté serveur.
 * ---------------------------------------------------------------------------
 * La langue est lue dans un cookie (`campusly.lang`), jamais dans l'URL : les
 * adresses existantes restent intactes (le porteur du projet a explicitement
 * écarté les préfixes `/fr/…`).
 *
 * Les pages qui appellent `getLocale()` deviennent dynamiques pour le rendu.
 * C'est le prix assumé de l'absence de préfixe : en échange, `<html lang>`,
 * les titres et les descriptions sont corrects dès la première réponse HTTP,
 * sans mélange de langues ni bascule visible.
 */

import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALES, type Locale } from "./config";

/** Langue active de la requête courante. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  const decoded = value ? decodeURIComponent(value) : undefined;
  return isLocale(decoded) ? decoded : DEFAULT_LOCALE;
}

/** Langues alternatives, pour `hreflang` et le sélecteur. */
export function languageAlternates(path: string): Record<string, string> {
  const separator = path.includes("?") ? "&" : "?";
  return Object.fromEntries(LOCALES.map((code) => [code, `${path}${separator}lang=${code}`]));
}
