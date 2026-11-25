/**
 * Campusly — type des dictionnaires.
 * ---------------------------------------------------------------------------
 * `fr.json` est la référence : il définit la forme du type `Messages`.
 * Toute autre langue doit fournir exactement les mêmes clés (le typecheck
 * échoue sinon, au lieu de produire un écran avec des clés brutes).
 *
 * Le dictionnaire est **imbriqué par domaine** (préfixe pointé à l'usage) :
 *   "nav.features"  →  messages.nav.features
 *
 * Les valeurs peuvent contenir des **paramètres** entre accolades :
 *   "Voir les {count} résultats"  →  t("exam.count", { count: 3 })
 * C'est le seul mécanisme d'interpolation, volontairement minimal : pas de
 * HTML dans les chaînes, pas de logique conditionnelle.
 */

import type fr from "@/messages/fr.json";

/** Structure de référence, dérivée du dictionnaire français. */
export type Messages = typeof fr;

/**
 * Chemin pointé valide dans les messages.
 * Calcule les clés littérales : `"nav.features"` est accepté, une faute de
 * frappe ne l'est pas.
 */
type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;

/** Valeurs d'interpolation acceptées. */
export type MessageParams = Record<string, string | number>;
