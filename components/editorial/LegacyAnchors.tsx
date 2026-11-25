"use client";

import { useEffect } from "react";

/**
 * Compatibilité des anciennes ancres + atterrissage des fragments.
 * ---------------------------------------------------------------------------
 * 1. Ancienne ancre partagée.
 *    La section d'expérience s'appelait `#fonctionnalites` avant la refonte
 *    éditoriale (KRAFTER-11) ; des liens partagés pointent encore vers ce nom.
 *    On crée une cible de hauteur nulle, dans la section `#experience`, sans
 *    dupliquer une seule ligne de contenu : `#fonctionnalites` mène donc au
 *    même endroit que `#experience`. La cible n'est pas focalisable
 *    (`tabindex="-1"`, `aria-hidden`) et ne s'affiche pas.
 *
 * 2. Atterrissage.
 *    Une feuille historique pose `html { scroll-behavior: smooth }`. Sur ce
 *    document, le saut natif vers un fragment est interrompu pendant
 *    l'initialisation : mesuré, la page s'arrêtait à y≈70 au lieu de la
 *    section. On repositionne donc explicitement la cible, une seule fois, au
 *    chargement, et seulement si l'URL porte un fragment. Le saut est
 *    instantané : pas d'animation, donc aucun défilement inattendu.
 *
 * Aucune autre route n'est concernée (le composant n'est monté que par
 * l'accueil public).
 */
const LEGACY_ANCHORS: Array<{ legacy: string; target: string }> = [
  { legacy: "fonctionnalites", target: "experience" },
];

export function LegacyAnchors() {
  useEffect(() => {
    const created: HTMLElement[] = [];

    /* Cibles de compatibilité : créées une fois, dans la section d'accueil. */
    for (const { legacy, target } of LEGACY_ANCHORS) {
      if (document.getElementById(legacy)) continue;
      const host = document.getElementById(target);
      if (!host) continue;

      const marker = document.createElement("span");
      marker.id = legacy;
      marker.tabIndex = -1;
      marker.setAttribute("aria-hidden", "true");
      marker.style.cssText = "display:block;height:0;overflow:hidden;";
      host.insertBefore(marker, host.firstChild);
      created.push(marker);
    }

    /* Atterrissage au chargement, après deux images : la mise en page (polices,
       images) est alors stabilisée. */
    const rawHash = window.location.hash.replace("#", "");
    let frame = 0;
    let timer: number | undefined;

    if (rawHash) {
      const resolve = () => {
        const legacy = LEGACY_ANCHORS.find((item) => item.legacy === rawHash);
        return document.getElementById(rawHash) ?? (legacy ? document.getElementById(legacy.target) : null);
      };

      const land = () => {
        const target = resolve();
        if (!target) return;
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        root.style.scrollBehavior = previous;
      };

      frame = window.requestAnimationFrame(() => {
        land();
        timer = window.setTimeout(land, 250);
      });
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
      created.forEach((marker) => marker.remove());
    };
  }, []);

  return null;
}
