"use client";

/**
 * Point d'entrée unique pour GSAP.
 * ---------------------------------------------------------------------------
 * - L'enregistrement des plugins se fait une seule fois, côté navigateur.
 * - `useGSAP` est réexporté pour que les composants n'importent qu'un module
 *   (et non deux librairies d'animation concurrentes).
 * - `prefersReducedMotion()` centralise le respect de `prefers-reduced-motion` :
 *   quand il est actif, aucune animation n'est créée et le contenu reste
 *   immédiatement visible (le HTML est rendu visible par défaut, GSAP ne fait
 *   que « partir » d'un état décalé : sans JS, rien n'est masqué).
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Évite les recalculs parasites lors du redimensionnement lié au clavier mobile.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Les effets de parallaxe sont désactivés sous 768 px (coût / confort). */
export function isCompactViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(max-width: 768px)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
