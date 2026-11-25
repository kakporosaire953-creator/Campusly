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
import { DURATION, EASE, SHIFT, STAGGER } from "@/lib/motion/tokens";

/**
 * Chef d'orchestre des animations — vocabulaire sobre, une seule portée.
 * ---------------------------------------------------------------------------
 * Tout est piloté par attributs `data-*` : un seul contexte GSAP par zone,
 * révoqué au démontage (animations et ScrollTriggers compris). Aucun composant
 * n'écrit de durée ni d'easing : ils viennent de `lib/motion/tokens.ts`.
 *
 * Vocabulaire (volontairement court) :
 *
 *  - `data-reveal`  : montée de 18 px + fondu, une seule fois ;
 *  - `data-rise`    : alias de `data-reveal` (nouveau nom) ;
 *  - `data-words`   : titre révélé mot à mot, masque par ligne ;
 *  - `data-split`   : alias historique de `data-words` ;
 *  - `data-line`    : filet qui se trace de gauche à droite ;
 *  - `data-fill`    : alias historique de `data-line` ;
 *  - `data-stagger` : enfants directs révélés en cascade ;
 *  - `data-drift`   : dérive de ±8 px liée au défilement (desktop seulement) ;
 *  - `data-parallax`: alias historique de `data-drift` ;
 *  - `data-rail`    : repère de section (`.is-current` sur les items).
 *
 * Ce qui a été retiré (et ne doit pas revenir) : caractères qui tombent en
 * tournant, cartes qui « popent », étiquettes tamponnées, dessins en boucle
 * perpétuelle. Ce registre donnait une impression de démonstration.
 *
 * Règles tenues partout :
 *  - `prefers-reduced-motion` → aucun tween créé, tout est rendu visible ;
 *  - les éléments masqués le sont par `.js` + CSS, donc jamais sans JavaScript ;
 *  - un filet de sécurité rend visibles les éléments restés cachés dans la vue.
 */

const REVEAL_START = "top 88%";

type Ctx = { add: (cleanup: () => void) => void };

export function MotionScope({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  registerGsap();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      const cleanups: Array<() => void> = [];
      const splits: SplitText[] = [];
      const ctx: Ctx = { add: (fn) => cleanups.push(fn) };

      /* Survol, clic et icônes sont branchés globalement (`MotionGlobal`) :
         ils doivent aussi fonctionner dans la navigation, sur /auth et dans
         l'espace connecté, hors de cette portée. */
      wireDrift(root, ctx);
      wireRail(root, ctx);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ── Titres révélés mot à mot ─────────────────────────────────────
           Le parent est rendu visible avant le découpage : si `SplitText`
           échoue, le texte reste lisible au lieu de disparaître. */
        const titles = gsap.utils.toArray<HTMLElement>("[data-words], [data-split]", root);
        titles.forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          if (typeof SplitText === "undefined") return;
          const instance = SplitText.create(el, {
            type: "words",
            wordsClass: "split-word",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 40,
                autoAlpha: 0,
                duration: DURATION.base,
                ease: EASE.outStrong,
                stagger: STAGGER.word,
              }),
          });
          splits.push(instance);
        });

        /* ── Révélation douce, jouée une fois ─────────────────────────── */
        gsap.utils.toArray<HTMLElement>("[data-reveal-soft]", root).forEach((el) => {
          gsap.from(el, {
            y: SHIFT.small,
            autoAlpha: 0,
            duration: DURATION.short,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        /* ── Révélations groupées ─────────────────────────────────────── */
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal], [data-rise]", root);
        if (reveals.length) {
          gsap.set(reveals, { autoAlpha: 0, y: SHIFT.base });
          ScrollTrigger.batch(reveals, {
            start: REVEAL_START,
            onEnter: (els) =>
              gsap.to(els, {
                autoAlpha: 1,
                y: 0,
                duration: DURATION.base,
                ease: EASE.outStrong,
                stagger: STAGGER.base,
                overwrite: true,
              }),
          });
        }

        /* ── Cascades explicites ──────────────────────────────────────── */
        gsap.utils.toArray<HTMLElement>("[data-stagger]", root).forEach((el) => {
          const children = Array.from(el.children) as HTMLElement[];
          if (!children.length) return;
          gsap.set(children, { autoAlpha: 0, y: SHIFT.small });
          gsap.to(children, {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.outStrong,
            stagger: STAGGER.base,
            scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          });
        });

        /* ── Filets qui se tracent ───────────────────────────────────── */
        gsap.utils.toArray<HTMLElement>("[data-line], [data-fill]", root).forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: DURATION.long,
            ease: EASE.outStrong,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      });

      /* ── Mouvement réduit : tout est visible, rien ne bouge ────────── */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-reveal], [data-rise], [data-words], [data-split]", root), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-stagger] > *", root), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-line], [data-fill]", root), { scaleX: 1 });
      });

      /* ── Filet de sécurité ──────────────────────────────────────────
         Si un déclencheur n'a pas pu se créer (police tardive, conteneur
         redimensionné après coup), l'élément déjà dans la fenêtre ne doit pas
         rester invisible. */
      const rescue = window.setTimeout(() => {
        if (prefersReducedMotion()) return;
        gsap.utils
          .toArray<HTMLElement>("[data-reveal], [data-rise]", root)
          .forEach((el) => {
            const rect = el.getBoundingClientRect();
            const visible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
            if (visible && gsap.getProperty(el, "autoAlpha") === 0) {
              gsap.to(el, { autoAlpha: 1, y: 0, duration: DURATION.short, overwrite: true });
            }
          });
      }, 2600);
      cleanups.push(() => window.clearTimeout(rescue));

      /* ── Recalculs ──────────────────────────────────────────────────
         Les polices changent la hauteur des blocs : un `refresh` après
         chargement évite des déclencheurs décalés. */
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
   Dérive au défilement, repère de section
   ══════════════════════════════════════════════════════════════════════════ */

/** Dérive légère, desktop uniquement. Jamais plus de `SHIFT.drift` pixels. */
function wireDrift(root: HTMLElement, ctx: Ctx) {
  const compact = window.matchMedia("(max-width: 768px)").matches;
  if (compact) return;

  Array.from(root.querySelectorAll<HTMLElement>("[data-drift], [data-parallax]")).forEach((el) => {
    const depth = Math.min(Number(el.dataset.drift ?? el.dataset.parallaxDepth ?? SHIFT.drift), SHIFT.drift);
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
