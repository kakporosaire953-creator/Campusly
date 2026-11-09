"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useScrollDirection } from "@/lib/useScrollDirection";
import { Icon } from "@/components/motion/Icon";

/**
 * Bouton « revenir en haut » — même comportement que Kraken : il apparaît
 * quand on remonte la page après 500 px, disparaît quand on redescend, se
 * soulève au survol et son icône rebondit régulièrement.
 *
 * Le bouton reste dans le DOM (donc trouvable au clavier quand il est visible)
 * mais sort de l'ordre de tabulation quand il ne l'est pas.
 */
export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const { direction, y } = useScrollDirection();
  const visible = direction === "up" && y > 500;
  const shown = useRef(false);

  useEffect(() => {
    if (ref.current) gsap.set(ref.current, { autoAlpha: 0, scale: 0.4, rotation: -20, y: 30 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === visible) return;
    shown.current = visible;
    const instant = prefersReducedMotion();
    gsap.to(
      el,
      visible
        ? { autoAlpha: 1, scale: 1, rotation: 0, y: 0, duration: instant ? 0 : 0.5, ease: "back.out(2.4)", overwrite: "auto" }
        : { autoAlpha: 0, scale: 0.4, rotation: -20, y: 30, duration: instant ? 0 : 0.3, ease: "power2.in", overwrite: "auto" },
    );
  }, [visible]);

  // L'icône rebondit toutes les 2,6 s tant que le bouton est affiché.
  useEffect(() => {
    if (!visible || !ref.current || prefersReducedMotion()) return;
    const arrow = ref.current.querySelector("[data-icon-shape]");
    if (!arrow) return;
    const id = window.setInterval(() => {
      gsap.fromTo(
        ref.current?.querySelectorAll("[data-icon-shape]") ?? [],
        { y: 0 },
        { y: -3, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 1 },
      );
    }, 2600);
    return () => window.clearInterval(id);
  }, [visible]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toTop}
      aria-label="Revenir en haut de la page"
      tabIndex={visible ? 0 : -1}
      data-hover-lift
      data-lift-y="-3"
      data-lift-scale="1.06"
      className="back-top"
    >
      <Icon name="arrow-up" size={20} />
    </button>
  );
}
