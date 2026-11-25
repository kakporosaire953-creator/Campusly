"use client";

/**
 * Vocabulaire de mouvement — la seule source de durées et d'easings.
 * ---------------------------------------------------------------------------
 * Les valeurs sont regroupées ici pour qu'aucun composant n'écrive une durée
 * « au hasard ». Le vocabulaire est volontairement **sobre** : des entrées de
 * 300 à 800 ms, des déplacements courts, aucun rebond. L'ancien registre
 * (caractères qui tombent de 130 %, cartes qui « popent » en tournant,
 * étiquettes tamponnées à ×2,6) donnait une impression de démonstration ;
 * il a été retiré.
 *
 * Règles tenues par tous les effets de `MotionScope` :
 *  - `transform` et `opacity` uniquement (jamais `filter`, `width`, `box-shadow`
 *    en boucle : ce sont des recalculs coûteux) ;
 *  - aucune distance supérieure à 24 px ;
 *  - tout est réversible et nettoyé au démontage (contexte GSAP) ;
 *  - `prefers-reduced-motion` : aucun tween n'est créé, tout reste visible.
 */

/** Durées, en secondes (convention GSAP). */
export const DURATION = {
  /** Micro-état : changement de couleur, reflet. */
  micro: 0.16,
  /** Entrée discrète : opacité, décalage court. */
  short: 0.42,
  /** Entrée standard d'un bloc éditorial. */
  base: 0.62,
  /** Filet tracé, révélation de titre. */
  long: 0.85,
  /** Survol / sortie d'un élément interactif. */
  hover: 0.3,
} as const;

/** Easings : trois courbes, pas une de plus. */
export const EASE = {
  /** Sortie douce — entrées et sorties standard. */
  out: "power2.out",
  /** Sortie ample — titres, tracés de filets. */
  outStrong: "power3.out",
  /** Aller-retour symétrique — déplacements liés au défilement. */
  inOut: "power2.inOut",
} as const;

/** Décalages, en secondes. */
export const STAGGER = {
  /** Entre deux éléments d'une même liste. */
  base: 0.06,
  /** Entre deux mots d'un titre. */
  word: 0.024,
  /** Entre deux lignes d'un filet. */
  line: 0.08,
} as const;

/** Amplitudes en pixels — plafonnées pour ne jamais faire « sauter » la page. */
export const SHIFT = {
  /** Élément de contenu. */
  base: 18,
  /** Petit élément (étiquette, index). */
  small: 10,
  /** Parallaxe maximale (desktop). */
  drift: 8,
} as const;

/**
 * Une animation doit-elle être jouée ?
 * ---------------------------------------------------------------------------
 * `false` si l'utilisateur a demandé moins de mouvement. Les composants
 * n'ont pas à interroger `matchMedia` : ils passent par cette fonction, pour
 * que la règle reste unique.
 */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
