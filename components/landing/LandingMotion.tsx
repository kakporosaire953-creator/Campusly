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
 * Un seul contexte GSAP pour toute la page. Chaque section possède son propre
 * mouvement, déclenché une seule fois (`once: true`) :
 *
 *  - hero      : lignes du titre en masque, texte, puis cartes flottantes ;
 *  - reveil    : tout `[data-reveal]` monte de 24 px ;
 *  - quotidien : lignes qui entrent en décalage latéral ;
 *  - features  : bloc éditorial + ses éléments internes ;
 *  - cadres    : photos dévoilées par `clip-path` (jamais de zoom brusque) ;
 *  - IA        : rail qui se trace, panneaux successifs, repère actif ;
 *  - parcours  : frise dessinée de gauche à droite ;
 *  - bandeau   : ouverture centrale du volet photo ;
 *  - parallaxe : ±8 px, desktop uniquement.
 *
 * Règles tenues partout :
 *  - `gsap.from` uniquement : sans JavaScript, rien n'est masqué ;
 *  - `prefers-reduced-motion` → aucune animation n'est même créée ;
 *  - `useGSAP` révoque le contexte (et les ScrollTrigger) au démontage.
 */

const REVEAL_START = "top 86%";

export function LandingMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  registerGsap();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);

      /* ── 1. Hero ─────────────────────────────────────────── */
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.08 });

      if (q("[data-hero-eyebrow]").length) {
        timeline.from(q("[data-hero-eyebrow]"), { y: 12, opacity: 0, duration: 0.5 });
      }

      const lines = q("[data-hero-line]");
      if (lines.length) {
        timeline.from(lines, { yPercent: 118, opacity: 0, duration: 0.95, stagger: 0.1 }, "-=0.2");
      }

      if (q("[data-hero-body]").length) {
        timeline.from(q("[data-hero-body]"), { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.6");
      }

      if (q("[data-hero-photo]").length) {
        timeline.from(
          q("[data-hero-photo]"),
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "power3.inOut" },
          "-=0.85",
        );
      }

      if (q("[data-hero-card]").length) {
        timeline.from(
          q("[data-hero-card]"),
          { y: 26, opacity: 0, rotate: -1.5, duration: 0.85, stagger: 0.14 },
          "-=0.75",
        );
      }

      /* ── 2. Révélations simples ───────────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: REVEAL_START, once: true },
        });
      });

      /* ── 3. Le quotidien : lignes décalées ────────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="daily"]', root).forEach((list) => {
        const items = Array.from(list.children) as HTMLElement[];
        items.forEach((item, index) => {
          gsap.from(item, {
            x: index % 2 === 0 ? -30 : 24,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true },
          });
          const num = item.querySelector(".daily__num");
          if (num) {
            gsap.from(num, {
              scale: 0.7,
              opacity: 0,
              duration: 0.6,
              delay: 0.1,
              ease: "back.out(1.6)",
              scrollTrigger: { trigger: item, start: "top 90%", once: true },
            });
          }
        });
      });

      /* ── 4. Blocs fonctionnalités ─────────────────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="feat"]', root).forEach((block) => {
        const text = block.querySelectorAll<HTMLElement>(
          ".feat__tag, .feat__title, .feat__lede, .feat__list li, .feat__steps li, .feat__link, .feat__rules li",
        );
        const visuals = block.querySelectorAll<HTMLElement>(".feat__frag, .feat__photo, .feat__flow");

        if (text.length) {
          gsap.from(text, {
            y: 18,
            opacity: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: block, start: REVEAL_START, once: true },
          });
        }

        if (visuals.length) {
          gsap.from(visuals, {
            y: 30,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: REVEAL_START, once: true },
          });
        }
      });

      /* ── 5. Cadres photo : voile qui se lève ──────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="frame"]', root).forEach((frame) => {
        const photo = frame.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: frame, start: REVEAL_START, once: true },
        });
        tl.from(frame, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "power3.inOut" });
        if (photo) tl.from(photo, { scale: 1.09, duration: 1.3, ease: "power2.out" }, 0);
      });

      /* ── 6. Bandeau photo (compositions) ──────────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="mask"]', root).forEach((band) => {
        const photo = band.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: band, start: REVEAL_START, once: true },
        });
        tl.from(band, { clipPath: "inset(0% 50% 0% 50%)", duration: 1.05, ease: "power3.inOut" });
        if (photo) tl.from(photo, { scale: 1.1, duration: 1.4, ease: "power2.out" }, 0);
        const caption = band.querySelector(".compo-band__caption");
        if (caption) tl.from(caption, { y: 12, opacity: 0, duration: 0.5 }, "-=0.55");
        const frag = band.querySelector(".compo-band__frag");
        if (frag) tl.from(frag, { y: 18, opacity: 0, duration: 0.6 }, "-=0.4");
      });

      /* ── 7. Séquence IA ───────────────────────────────────── */
      const rail = q('[data-anim="rail"]')[0] as HTMLElement | undefined;
      if (rail) {
        gsap.from(Array.from(rail.children) as HTMLElement[], {
          y: 14,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: rail, start: REVEAL_START, once: true },
        });
        const lines = rail.querySelectorAll(".ai-rail__line");
        if (lines.length) {
          gsap.from(lines, {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.inOut",
            scrollTrigger: { trigger: rail, start: REVEAL_START, once: true },
          });
        }
      }

      const panels = gsap.utils.toArray<HTMLElement>("[data-ai-panel]", root);
      panels.forEach((panel, index) => {
        gsap.from(panel.querySelectorAll(".ai-panel__head, .ai-panel__text, .ai-panel__visual, .ai-panel__caption, .ai-concepts li, .ai-formats li"), {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: panel, start: REVEAL_START, once: true },
        });
      });

      // Repère actif du rail : simple bascule de classe, aucun mouvement.
      const railItems = gsap.utils.toArray<HTMLElement>("[data-ai-step]", root);
      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => {
            if (!self.isActive) return;
            railItems.forEach((item, itemIndex) => {
              item.classList.toggle("is-current", itemIndex === index);
            });
          },
        });
      });

      /* ── 8. Frise de progression ──────────────────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="track"]', root).forEach((track) => {
        const steps = Array.from(track.children) as HTMLElement[];
        gsap.from(steps, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: { trigger: track, start: REVEAL_START, once: true },
        });
        const nodes = track.querySelectorAll(".track__node");
        if (nodes.length) {
          gsap.from(nodes, {
            scale: 0.4,
            opacity: 0,
            duration: 0.5,
            stagger: 0.14,
            ease: "back.out(2)",
            scrollTrigger: { trigger: track, start: REVEAL_START, once: true },
          });
        }
      });

      /* ── 9. Listes éditoriales (compositions) ─────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="editorial"]', root).forEach((group) => {
        (Array.from(group.children) as HTMLElement[]).forEach((item, index) => {
          gsap.from(item, {
            x: index % 2 === 0 ? -24 : 24,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 92%", once: true },
          });
        });
      });

      /* ── 10. Lignes (enseignants) ─────────────────────────── */
      gsap.utils.toArray<HTMLElement>('[data-anim="rows"]', root).forEach((group) => {
        gsap.from(Array.from(group.children) as HTMLElement[], {
          x: -22,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
        });
      });

      /* ── 11. Parallaxe (desktop) ──────────────────────────── */
      if (!isCompactViewport()) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((element) => {
          const depth = Number(element.dataset.parallaxDepth ?? 10);
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
                scrub: 0.8,
              },
            },
          );
        });
      }

      // Les polices web modifient la hauteur des blocs : un seul recalcul.
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
