"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale, localeConfig } from "./config";
import { interpolate, resolveMessage } from "./dictionaries";
import { relativeAmount } from "@/services/mocks/store";
import type { Messages, MessageKey, MessageParams } from "./types";

/**
 * Fournisseur de langue (côté client).
 * ---------------------------------------------------------------------------
 * Le dictionnaire de la langue active est **rendu par le serveur** puis passé
 * ici : aucune requête, aucun chargement différé, et le premier rendu client
 * est déjà dans la bonne langue (donc pas de désaccord d'hydratation).
 *
 * `useT()` renvoie une fonction typée : une clé inconnue est une erreur de
 * compilation, pas un texte brut affiché à l'utilisateur.
 */

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  t: (key: MessageKey | (string & {}), params?: MessageParams) => string;
  /** Nom du locale pour `Intl` (dates, nombres). */
  dateLocale: string;
  /** Devise affichée — le montant n'est jamais converti. */
  currency: string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const config = localeConfig(locale);

  const t = useCallback(
    (key: MessageKey | (string & {}), params?: MessageParams) => {
      const value = resolveMessage(messages, key as string);
      if (value === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] clé manquante : ${String(key)} (${locale})`);
        }
        return String(key);
      }
      return interpolate(value, params);
    },
    [messages, locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, messages, t, dateLocale: config.dateLocale, currency: config.currency, dir: config.dir }),
    [locale, messages, t, config.dateLocale, config.currency, config.dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n doit être utilisé dans un <I18nProvider>.");
  }
  return context;
}

/**
 * Contexte facultatif : les primitives d'interface (états, bouton de retour en
 * haut, pastilles) peuvent être montées hors du fournisseur — dans un test
 * unitaire, ou dans le squelette suspendu d'une route. Dans ce cas on rend le
 * français, jamais une exception : une erreur de contexte ne doit pas vider un
 * écran d'erreur.
 */
export function useOptionalI18n(): I18nContextValue | null {
  return useContext(I18nContext);
}

/** Raccourci pour les composants qui n'ont besoin que de traduire. */
export function useT(): I18nContextValue["t"] {
  return useI18n().t;
}

/**
 * Change la langue : écrit le cookie puis recharge la page.
 * ---------------------------------------------------------------------------
 * Le rechargement est volontaire : `<html lang>`, les métadonnées et tout le
 * contenu rendu côté serveur doivent suivre, et c'est le seul moyen de rester
 * cohérent sans préfixe d'URL. On préserve **tout** le parcours courant :
 * même chemin, mêmes paramètres de requête, même ancre.
 *
 * Aucun état n'est perdu côté client : les préférences (thème, favoris,
 * progression) sont dans `localStorage`.
 */
export function changeLocale(next: Locale): void {
  if (typeof document === "undefined") return;
  const current = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];

  if (!current || current !== next) {
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    try {
      window.localStorage.setItem(LOCALE_COOKIE, next);
    } catch {
      // Stockage indisponible : le cookie suffit.
    }
  }

  const { pathname, search, hash } = window.location;
  window.location.replace(`${pathname}${search}${hash}`);
}

/** Langue par défaut, réexportée pour les composants serveur. */
export { DEFAULT_LOCALE };

/**
 * Temps relatif localisé (« il y a 3 min », « 3 分钟前 »…).
 * La date reste une donnée, le paraphe vient du dictionnaire : aucune chaîne
 * française ne subsiste dans un écran non francophone.
 */
export function useRelativeTime() {
  const t = useT();
  const { dateLocale } = useI18n();
  return (iso: string): string => {
    const { unit, count } = relativeAmount(iso);
    if (unit === "now") return t("common.now");
    if (unit === "minutes") return t("common.minutesAgo", { count });
    if (unit === "hours") return t("common.hoursAgo", { count });
    if (count >= 30) {
      return new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium" }).format(new Date(iso));
    }
    return t("common.daysAgo", { count });
  };
}
