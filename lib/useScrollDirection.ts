"use client";

import { useEffect, useState } from "react";

export type ScrollState = { direction: "up" | "down"; y: number };

/**
 * Sens et position du défilement, mis à jour au plus une fois par frame.
 * Un seuil évite de basculer sur les micro-mouvements (trackpad, inertie).
 *
 * Sert à deux choses : masquer la barre de navigation quand on descend et la
 * réafficher dès qu'on remonte, faire apparaître le bouton « revenir en haut ».
 */
export function useScrollDirection(threshold = 8): ScrollState {
  const [state, setState] = useState<ScrollState>({ direction: "up", y: 0 });

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < threshold && y > 0) return;
      setState({ direction: delta > 0 ? "down" : "up", y });
      last = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}
