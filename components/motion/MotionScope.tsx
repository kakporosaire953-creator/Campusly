"use client";

import { useRef, type ReactNode } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  registerGsap,
  prefersReducedMotion,
} from "@/lib/gsap";

/**
 * Chef d'orchestre des animations — même vocabulaire que le site Kraken.
 * ---------------------------------------------------------------------------
 * Tout est piloté par attributs `data-*`, jamais par des effets éparpillés :
 * un seul contexte GSAP par zone, révoqué au démontage (animations et
 * ScrollTriggers compris).
 *
 * Effets repris tels quels de Kraken (`components/motion/page-motion.tsx`) :
 *
 *  - `data-reveal` : fondu + montée de 48 px, rejoué quand on remonte ;
 *  - `data-pop`    : cartes qui « pop » (échelle .55, y 90, rotation aléatoire) ;
 *  - `data-split`  : titre découpé en caractères qui tombent ;
 *  - `data-slam`   : bloc mis en avant qui s'écrase (échelle 2.2 → 1) ;
 *  - `data-stamp`  : étiquette tamponnée (échelle 2.6 → 1) ;
 *  - `data-fill`   : barre qui se remplit de gauche à droite ;
 *  - `data-float`  : dessins en boucle (burst, star, squiggle, arrow) ;
 *  - `data-lift`   : carte qui se soulève en traversant le centre de l'écran ;
 *  - survol        : `data-hover-lift` (soulèvement + retour élastique) ;
 *  - clic          : `data-press` (le bouton s'écrase) ;
 *  - icônes        : `data-icon` à l'intérieur d'un élément survolable.
 *
 * Deux ajouts propres à Campusly, conservés parce qu'ils racontent la page :
 * `data-parallax` (desktop uniquement) et `data-rail` (repère actif de la
 * séquence Campusly AI).
 *
 * Règles tenues partout :
 *  - `prefers-reduced-motion` → aucune animation créée, tout est rendu visible ;
 *  - les éléments masqués le sont par `.js` + CSS, donc jamais sans JavaScript ;
 *  - un filet de sécurité rend visibles les éléments restés cachés dans la vue.
 */

const REVEAL_START = "top 88%";

type Ctx = {
  add: (cleanup: () => void) => void;
};

export function MotionScope({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  registerGsap();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      const cleanups: Array<() => void> = [];
      const splits: SplitText[] = [];
      const ctx: Ctx = { add: (fn) => cleanups.push(fn) };

      /* Survol, clic et icônes sont branchés globalement (MotionGlobal) :
         ils doivent aussi fonctionner dans la navigation, sur /auth et dans
         l'espace connecté, hors de cette portée. */
      wireParallax(root, ctx);
      wireRail(root, ctx);

      /* ── Animations d'entrée ─────────────────────────────────────────── */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Titres découpés en caractères qui tombent. */
        gsap.utils.toArray<HTMLElement>("[data-split]", root).forEach((el) => {
          // Le parent est masqué par le CSS `.js` : on le rend visible avant
          // de découper, pour qu'aucune panne de découpage ne cache le texte.
          gsap.set(el, { autoAlpha: 1 });
          if (typeof SplitText === "undefined") return;
          const instance = SplitText.create(el, {
            type: "words,chars",
            wordsClass: "split-word",
            charsClass: "split-char",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: -130,
                rotation: () => gsap.utils.random(-25, 25),
                autoAlpha: 0,
                duration: 0.75,
                ease: "back.out(2)",
                stagger: 0.025,
              }),
          });
          splits.push(instance);
        });

        /* Bloc mis en avant qui s'écrase à l'entrée à l'écran. */
        gsap.utils.toArray<HTMLElement>("[data-slam]", root).forEach((el, i) => {
          gsap.from(el, {
            scale: Number(el.dataset.slamScale ?? 2.2),
            rotation: Number(el.dataset.slamRotation ?? -14),
            autoAlpha: 0,
            duration: 0.7,
            ease: "back.out(2.2)",
            delay: 0.45 + i * 0.1,
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          });
        });

        /* Révélation douce : aucun état masqué au chargement, donc utilisable
           là où un contenu ne doit jamais dépendre de JavaScript (formulaire
           de connexion). */
        gsap.utils.toArray<HTMLElement>("[data-reveal-soft]", root).forEach((el) => {
          gsap.from(el, {
            y: 16,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        /* Révélations en lot : rejouées quand on remonte la page. */
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
        if (reveals.length) {
          gsap.set(reveals, { autoAlpha: 0, y: 48 });
          ScrollTrigger.batch(reveals, {
            start: REVEAL_START,
            onEnter: (els) =>
              gsap.to(els, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.08,
                overwrite: true,
              }),
            onLeaveBack: (els) =>
              gsap.to(els, { autoAlpha: 0, y: 48, duration: 0.3, ease: "power1.in", overwrite: true }),
          });
        }

        /* Cartes qui « pop ». */
        const pops = gsap.utils.toArray<HTMLElement>("[data-pop]", root);
        if (pops.length) {
          gsap.set(pops, { autoAlpha: 0, scale: 0.55, y: 90, rotation: () => gsap.utils.random(-12, 12) });
          ScrollTrigger.batch(pops, {
            start: "top 90%",
            onEnter: (els) =>
              gsap.to(els, {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 0.9,
                ease: "back.out(1.7)",
                stagger: 0.12,
                overwrite: true,
              }),
            onLeaveBack: (els) =>
              gsap.to(els, {
                autoAlpha: 0,
                scale: 0.55,
                y: 90,
                rotation: () => gsap.utils.random(-12, 12),
                duration: 0.35,
                ease: "power2.in",
                overwrite: true,
              }),
          });
        }

        /* Étiquettes tamponnées. */
        gsap.utils.toArray<HTMLElement>("[data-stamp]", root).forEach((el) => {
          gsap.from(el, {
            scale: 2.6,
            autoAlpha: 0,
            duration: 0.55,
            ease: "back.out(2.5)",
            delay: 0.4,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          });
        });

        /* Barres qui se remplissent. */
        gsap.utils.toArray<HTMLElement>("[data-fill]", root).forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          });
        });

        /* Cartes soulevées au passage du centre de l'écran. */
        gsap.utils.toArray<HTMLElement>("[data-lift]", root).forEach((el) => {
          const tl = gsap
            .timeline({ paused: true })
            .to(el, { y: -22, scale: 1.045, rotation: 0.8, duration: 0.45, ease: "back.out(2.4)" });
          const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            end: "bottom 38%",
            onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
          });
          ctx.add(() => {
            trigger.kill();
            tl.kill();
          });
        });

        /* Dessins en boucle. */
        Array.from(root.querySelectorAll<SVGElement>("[data-float]")).forEach((el) => {
          const kind = el.getAttribute("data-float");
          const delay = gsap.utils.random(0, 1.2);
          if (kind === "burst") {
            gsap.to(el, { scale: 1.2, rotation: 10, duration: 0.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay });
          } else if (kind === "star") {
            gsap.to(el, { rotation: 360, duration: 6, ease: "none", repeat: -1 });
            gsap.to(el, { scale: 0.72, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true, delay });
          } else if (kind === "squiggle") {
            const path = el.querySelector("path");
            if (path) {
              const len = path.getTotalLength();
              gsap.fromTo(
                path,
                { strokeDasharray: len, strokeDashoffset: len },
                {
                  strokeDashoffset: -len,
                  duration: 2.4,
                  ease: "power1.inOut",
                  repeat: -1,
                  repeatDelay: 0.4,
                  delay,
                },
              );
            }
          } else if (kind === "arrow") {
            gsap.to(el, { x: 6, y: 6, duration: 0.7, ease: "sine.inOut", repeat: -1, yoyo: true, delay });
          }
        });
      });

      /* ── Mouvement réduit : tout est visible, rien ne bouge ──────────── */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-reveal], [data-pop], [data-split], [data-slam]"), {
          autoAlpha: 1,
          clearProps: "transform",
        });
      });

      /* ── Filet de sécurité ────────────────────────────────────────────
         Si un déclencheur n'a pas pu se créer (police tardive, image cassée,
         conteneur redimensionné après coup), l'élément déjà dans la fenêtre
         ne doit pas rester invisible. */
      const rescue = window.setTimeout(() => {
        if (prefersReducedMotion()) return;
        gsap.utils.toArray<HTMLElement>("[data-reveal], [data-pop], [data-slam]", root).forEach((el) => {
          const rect = el.getBoundingClientRect();
          const visible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
          if (visible && gsap.getProperty(el, "autoAlpha") === 0) {
            gsap.to(el, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.4, overwrite: true });
          }
        });
      }, 2600);
      cleanups.push(() => window.clearTimeout(rescue));

      /* ── Recalculs ────────────────────────────────────────────────────
         Les polices et les images changent la hauteur des blocs. */
      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts?.ready) void document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      const t = window.setTimeout(refresh, 400);

      return () => {
        window.removeEventListener("load", refresh);
        window.clearTimeout(t);
        cleanups.forEach((fn) => fn());
        // Les titres découpés doivent retrouver leur texte d'origine.
        splits.forEach((instance) => instance.revert());
        mm.revert();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={className ? `motion ${className}` : "motion"}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Gestes : survol, clic, icônes, parallaxe, repère de séquence
   ══════════════════════════════════════════════════════════════════════════ */

/** Parallaxe légère, desktop uniquement. */
function wireParallax(root: HTMLElement, ctx: Ctx) {
  const compact = window.matchMedia("(max-width: 768px)").matches;
  if (compact) return;

  Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]")).forEach((el) => {
    const depth = Number(el.dataset.parallaxDepth ?? 10);
    const tween = gsap.fromTo(
      el,
      { y: depth },
      {
        y: -depth,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      },
    );
    ctx.add(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    });
  });
}

/** Repère actif d'une séquence : `[data-rail]` + `[data-rail-item]` / `[data-rail-panel]`. */
function wireRail(root: HTMLElement, ctx: Ctx) {
  Array.from(root.querySelectorAll<HTMLElement>("[data-rail]")).forEach((rail) => {
    const items = Array.from(rail.querySelectorAll<HTMLElement>("[data-rail-item]"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-panel]"));
    if (!items.length || !panels.length) return;

    const triggers = panels.map((panel, index) =>
      ScrollTrigger.create({
        trigger: panel,
        start: "top 62%",
        end: "bottom 38%",
        onToggle: (self) => {
          if (!self.isActive) return;
          items.forEach((item, itemIndex) => item.classList.toggle("is-current", itemIndex === index));
        },
      }),
    );

    ctx.add(() => triggers.forEach((trigger) => trigger.kill()));
  });
}
