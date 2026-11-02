"use client";

import { useRef, type ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  registerGsap,
  prefersReducedMotion,
  isCompactViewport,
} from "@/lib/gsap";

/**
 * Mise en scène de la page d'accueil.
 * ---------------------------------------------------------------------------
 * Un seul contexte GSAP pour toute la landing page :
 *
 *  1. timeline d'entrée du hero (surtitre → lignes du titre → texte → visuel) ;
 *  2. révélation au défilement de tout élément `[data-reveal]` ;
 *  3. apparition en cascade des enfants de `[data-stagger]` ;
 *  4. parallaxe légère sur `[data-parallax]` (désactivée sur mobile).
 *
 * Sécurité et sobriété :
 *  - `prefers-reduced-motion` → aucune animation n'est créée, le contenu est
 *    déjà visible dans le HTML ;
 *  - les animations partent d'un état décalé (`gsap.from`), jamais d'un
 *    `opacity: 0` en CSS : sans JavaScript, la page reste lisible ;
 *  - `useGSAP` révoque le contexte (donc tous les ScrollTrigger) au démontage
 *    et lors des changements de route ;
 *  - aucun mouvement permanent, `once: true` sur les révélations pour éviter
 *    tout travail pendant le défilement.
 */

const REVEAL_START = "top 88%";

export function LandingMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  registerGsap();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);

      /* ── 1. Hero ───────────────────────────────────────────── */
      const titleLines = q("[data-hero-line]");
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      if (q("[data-hero-eyebrow]").length) {
        timeline.from(q("[data-hero-eyebrow]"), {
          y: 14,
          opacity: 0,
          duration: 0.55,
        });
      }

      if (titleLines.length) {
        timeline.from(
          titleLines,
          { yPercent: 112, opacity: 0, duration: 0.9, stagger: 0.11 },
          "-=0.25",
        );
      }

      if (q("[data-hero-body]").length) {
        timeline.from(
          q("[data-hero-body]"),
          { y: 16, opacity: 0, duration: 0.7, stagger: 0.09 },
          "-=0.5",
        );
      }

      if (q("[data-hero-visual]").length) {
        timeline.from(
          q("[data-hero-visual]"),
          { y: 26, opacity: 0, scale: 0.985, duration: 1.05, ease: "power2.out" },
          "-=0.85",
        );
      }

      if (q("[data-hero-plate-item]").length) {
        timeline.from(
          q("[data-hero-plate-item]"),
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 },
          "-=0.75",
        );
      }

      /* ── 2. Révélations au défilement ──────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((element) => {
        gsap.from(element, {
          y: 26,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
        });
      });

      /* ── 3. Cascades ───────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-stagger]", root).forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        if (children.length === 0) return;
        gsap.from(children, {
          y: 20,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
        });
      });

      /* ── 4. Parallaxe (desktop uniquement) ─────────────────── */
      if (!isCompactViewport()) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((element) => {
          const depth = Number(element.dataset.parallaxDepth ?? 12);
          gsap.fromTo(
            element,
            { y: depth },
            {
              y: -depth,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });
      }

      // Les polices web changent la hauteur des blocs : on recalcule une fois.
      if (document.fonts?.ready) {
        void document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className="landing-motion">
      {children}
    </div>
  );
}
