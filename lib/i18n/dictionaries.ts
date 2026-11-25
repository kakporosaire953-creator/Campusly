/**
 * Campusly — chargement des dictionnaires.
 * ---------------------------------------------------------------------------
 * Côté serveur, un **seul** dictionnaire est chargé : celui de la langue
 * active. Les sept dictionnaires ne partent donc jamais dans le bundle
 * client, et changer de langue recharge la page (ce qui est le comportement
 * attendu pour du contenu rendu côté serveur : `<html lang>`, `<title>` et
 * les `meta` suivent).
 *
 * Les imports sont explicites (et non dynamiques par nom de fichier) : le
 * bundler peut ainsi les inclure sans deviner les chemins.
 */

import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";
import type { Messages } from "./types";

import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import de from "@/messages/de.json";
import zhCN from "@/messages/zh-CN.json";
import fon from "@/messages/fon.json";
import yo from "@/messages/yo.json";

const DICTIONARIES: Record<Locale, Messages> = {
  fr: fr as Messages,
  en: en as Messages,
  es: es as Messages,
  de: de as Messages,
  "zh-CN": zhCN as Messages,
  fon: fon as Messages,
  yo: yo as Messages,
};

/** Dictionnaire d'une langue ; repli sur le français si la langue est inconnue. */
export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Résout une clé pointée. Utilisé côté serveur comme côté client.
 * Une clé absente renvoie la clé elle-même : c'est visible en développement et
 * sans danger en production (jamais d'écran vide).
 */
export function resolveMessage(messages: Messages, key: string): string | undefined {
  const segments = key.split(".");
  let current: unknown = messages;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : undefined;
}

/** Interpole les paramètres `{nom}` d'une chaîne. */
export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}
