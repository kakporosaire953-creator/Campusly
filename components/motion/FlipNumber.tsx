"use client";

import { useEffect, useRef } from "react";

/**
 * Chiffre qui bascule quand sa valeur change.
 * ---------------------------------------------------------------------------
 * Reprise de l'animation des unités du compte à rebours de Kraken : le chiffre
 * part de 60 % au-dessus, basculé de 90° sur l'axe horizontal, puis retombe
 * avec un léger rebond (`back.out`).
 *
 * Web Animations API plutôt que GSAP : ce composant vit dans la salle
 * d'examen, une route qui n'a aucune autre raison de charger une
 * bibliothèque d'animation. `prefers-reduced-motion` coupe tout.
 */
export function FlipNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;

    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.animate(
      [
        { transform: "translateY(-60%) rotateX(90deg)", opacity: 0 },
        { transform: "translateY(0) rotateX(0deg)", opacity: 1 },
      ],
      { duration: 450, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  }, [value]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", transformOrigin: "center" }}>
      {value}
    </span>
  );
}
