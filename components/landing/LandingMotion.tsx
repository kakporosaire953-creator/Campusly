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
 *  1. timeline d'entrée du hero (lignes du titre → texte → cadre photo) ;
 *  2. révélation au défilement de tout élément `[data-reveal]` ;
 *  3. apparition en cascade des enfants de `[data-stagger]` ;
 *  4. parallaxe légère sur `[data-parallax]` (désactivée sur mobile) ;
 *  5. une animation propre à chaque section qui énumère quelque chose :
 *       [data-anim="rows"]      → lignes éditoriales qui glissent latéralement
 *       [data-anim="steps"]     → étapes qui montent en se dévoilant
 *       [data-anim="numerals"]  → numéros révélés par masque vertical
 *       [data-anim="editorial"] → liste alternée gauche / droite
 *       [data-anim="frame"]     → fiche encadrée : voile + pose
 *       [data-anim="mask"]      → bandeau dévoilé par `clip-path`
 *       [data-anim="chapter"]   → en-tête de chapitre : filet, méta, titre
 *       [data-anim="rule"]      → filet d'encre qui se trace de gauche à droite
 *       [data-anim="index"]     → index tabulaire : colonnes puis lignes
 *       [data-anim="plate"]     → planche : volet vertical + parallaxe
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

      /* ── 4. Animations propres aux sections énumérées ──────── */

      // Lignes éditoriales : entrée latérale, une par une.
      gsap.utils.toArray<HTMLElement>('[data-anim="rows"]', root).forEach((group) => {
        const rows = Array.from(group.children) as HTMLElement[];
        if (rows.length === 0) return;
        gsap.from(rows, {
          x: -28,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
        });
      });

      // Étapes : montée douce avec léger flou de départ.
      gsap.utils.toArray<HTMLElement>('[data-anim="steps"]', root).forEach((group) => {
        const steps = Array.from(group.children) as HTMLElement[];
        if (steps.length === 0) return;
        gsap.from(steps, {
          y: 22,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.62,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
          clearProps: "filter",
        });
      });

      // Numéros : masque vertical (le chiffre sort de son cadre).
      gsap.utils.toArray<HTMLElement>('[data-anim="numerals"]', root).forEach((group) => {
        const cards = Array.from(group.children) as HTMLElement[];
        if (cards.length === 0) return;
        gsap.from(cards, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
        });
        const indices = gsap.utils.toArray<HTMLElement>(
          ".progression-index, .movement-index, .ledger-num",
          group,
        );
        if (indices.length > 0) {
          gsap.from(indices, {
            yPercent: 120,
            rotate: 4,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.12,
            scrollTrigger: { trigger: group, start: REVEAL_START, once: true },
          });
        }
      });

      // Listes éditoriales : alternance gauche / droite.
      gsap.utils.toArray<HTMLElement>('[data-anim="editorial"]', root).forEach((group) => {
        const items = Array.from(group.children) as HTMLElement[];
        items.forEach((item, index) => {
          gsap.from(item, {
            x: index % 2 === 0 ? -34 : 34,
            y: 14,
            opacity: 0,
            duration: 0.66,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 92%", once: true },
          });
        });
      });

      // Photos : le cadre se dévoile puis la photo se stabilise (zoom lent).
      gsap.utils.toArray<HTMLElement>('[data-anim="frame"]', root).forEach((frame) => {
        const photo = frame.querySelector("img");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: frame, start: REVEAL_START, once: true },
        });

        // Voile qui se retire du haut vers le bas : la fiche se « pose ».
        timeline.from(frame, {
          clipPath: "inset(0% 0% 100% 0%)",
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        if (photo) {
          timeline.from(photo, { scale: 1.08, duration: 1.1, ease: "power2.out" }, 0);
        }
      });

      // Bandes dévoilées : voile qui s'ouvre du centre.
      gsap.utils.toArray<HTMLElement>('[data-anim="mask"]', root).forEach((band) => {
        const photo = band.querySelector("img");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: band, start: REVEAL_START, once: true },
        });

        timeline.from(band, {
          clipPath: "inset(0% 50% 0% 50%)",
          duration: 1,
          ease: "power3.inOut",
        });

        if (photo) {
          timeline.from(photo, { scale: 1.12, duration: 1.4, ease: "power2.out" }, 0);
        }
      });

      // En-tête de chapitre : le filet se trace, puis la méta et le titre.
      gsap.utils.toArray<HTMLElement>('[data-anim="chapter"]', root).forEach((chapter) => {
        const rule = chapter.querySelector<HTMLElement>(".chapter-rule");
        const meta = chapter.querySelector<HTMLElement>(".chapter-meta");
        const title = chapter.querySelector<HTMLElement>(".chapter-title");
        const lede = chapter.querySelector<HTMLElement>(".chapter-lede");

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
        });

        if (rule) {
          timeline.from(rule, { scaleX: 0, duration: 0.55, ease: "power2.inOut" });
        }
        if (meta) {
          timeline.from(meta, { y: 10, opacity: 0, duration: 0.5 }, "-=0.25");
        }
        if (title) {
          // Masque typographique : le titre sort de son cadre par le bas.
          timeline.from(
            title,
            { clipPath: "inset(0% 0% 100% 0%)", yPercent: 14, duration: 0.85 },
            "-=0.2",
          );
        }
        if (lede) {
          timeline.from(lede, { y: 14, opacity: 0, duration: 0.55 }, "-=0.45");
        }
      });

      // Filets isolés (hors en-tête) : tracé depuis la gauche.
      gsap.utils.toArray<HTMLElement>('[data-anim="rule"]', root).forEach((rule) => {
        if (rule.closest('[data-anim="chapter"]')) return;
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: rule, start: "top 90%", once: true },
        });
      });

      // Index tabulaire : les colonnes, puis la ligne d'échantillon.
      gsap.utils.toArray<HTMLElement>('[data-anim="index"]', root).forEach((wrap) => {
        const head = wrap.querySelector<HTMLElement>("thead");
        const row = wrap.querySelector<HTMLElement>("tbody tr");
        const caption = wrap.querySelector<HTMLElement>(".index-caption");
        const rest = gsap.utils.toArray<HTMLElement>(".index-empty, .index-actions", wrap);

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: wrap, start: REVEAL_START, once: true },
        });

        if (caption) timeline.from(caption, { x: -14, opacity: 0, duration: 0.5 });
        if (head) {
          timeline.from(
            Array.from(head.querySelectorAll("th")) as HTMLElement[],
            { y: 8, opacity: 0, duration: 0.4, stagger: 0.05 },
            "-=0.3",
          );
        }
        if (row) timeline.from(row, { opacity: 0, duration: 0.55 }, "-=0.15");
        if (rest.length) {
          timeline.from(rest, { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");
        }
      });

      // Planche photographique : volet vertical, puis parallaxe légère.
      gsap.utils.toArray<HTMLElement>('[data-anim="plate"]', root).forEach((plate) => {
        const photo = plate.querySelector<HTMLElement>("img");
        const caption = plate.querySelector<HTMLElement>(".plate-caption");

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: plate, start: REVEAL_START, once: true },
        });

        timeline.from(plate, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.05,
          ease: "power3.inOut",
        });

        if (photo) {
          timeline.from(photo, { scale: 1.08, duration: 1.4, ease: "power2.out" }, 0);
          if (!isCompactViewport()) {
            gsap.fromTo(
              photo,
              { y: 6 },
              {
                y: -6,
                ease: "none",
                scrollTrigger: {
                  trigger: plate,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          }
        }

        if (caption) {
          timeline.from(caption, { y: 10, opacity: 0, duration: 0.5 }, "-=0.6");
        }
      });

      /* ── 5. Parallaxe (desktop uniquement) ─────────────────── */
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
