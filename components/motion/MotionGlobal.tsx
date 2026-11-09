"use client";

import { useEffect } from "react";

/**
 * Gestes du site — survol, clic, icônes.
 * ---------------------------------------------------------------------------
 * Repris du vocabulaire de Kraken (`useHoverLift`, bouton pressé, icône
 * animée), mais branchés par délégation sur `document` : un seul écouteur pour
 * toute l'application, y compris les éléments montés après coup (menu mobile,
 * tableau de bord, formulaire de connexion).
 *
 *   - `[data-hover-lift]` ou `.btn` : soulèvement `back.out(3)` au survol,
 *     retour `elastic.out(1, .55)` à la sortie (et sur focus clavier) ;
 *   - `[data-press]`, `.btn`, `.auth__submit` : le bouton s'écrase au clic ;
 *   - `[data-icon]` dans un élément survolé : la flèche avance, l'étoile tourne.
 *
 * GSAP est chargé **à la demande** : les pages qui n'animent rien au
 * défilement (connexion, espace connecté) ne paient pas la bibliothèque dans
 * leur premier chargement. `prefers-reduced-motion` est relu à chaque geste.
 */

type Gsap = typeof import("@/lib/gsap");

const LIFTABLE = "[data-hover-lift], .btn";
const PRESSABLE = "[data-press], .btn, .auth__submit";

export function MotionGlobal() {
  useEffect(() => {
    let mod: Gsap | null = null;
    let hovered: HTMLElement | null = null;
    let disposed = false;

    /** Élément survolable ou pressable correspondant à la cible d'un événement. */
    const target = (event: Event, selector: string) =>
      (event.target as HTMLElement | null)?.closest<HTMLElement>(selector) ?? null;

    const lift = (el: HTMLElement, on: boolean) => {
      const m = mod;
      if (!m || m.prefersReducedMotion()) return;
      m.gsap.to(el, {
        y: on ? Number(el.dataset.liftY ?? -3) : 0,
        scale: on ? Number(el.dataset.liftScale ?? 1.02) : 1,
        duration: on ? 0.35 : 0.6,
        ease: on ? "back.out(3)" : "elastic.out(1, 0.55)",
        overwrite: "auto",
      });
    };

    /** Micro-mouvement de l'icône du parent survolé. */
    const icons = (host: HTMLElement, on: boolean) => {
      const m = mod;
      if (!m || m.prefersReducedMotion()) return;
      host.querySelectorAll<SVGElement>("[data-icon]").forEach((svg) => {
        const parts = svg.querySelectorAll("[data-icon-shape]");
        const nodes: Element[] = parts.length ? Array.from(parts) : [svg];
        const kind = svg.dataset.icon;

        if (!on) {
          m.gsap.to(nodes, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
          return;
        }
        if (kind === "arrow") m.gsap.to(nodes, { x: 4, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        else if (kind === "arrow-up") m.gsap.to(nodes, { y: -3, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        else if (kind === "arrow-up-right")
          m.gsap.to(nodes, { x: 3, y: -3, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        else if (kind === "plus") m.gsap.to(nodes, { rotation: 90, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
        else if (kind === "star") m.gsap.to(nodes, { rotation: 180, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      });
    };

    const enter = (el: HTMLElement) => {
      if (el === hovered) return;
      if (hovered) {
        lift(hovered, false);
        icons(hovered, false);
      }
      hovered = el;
      lift(el, true);
      icons(el, true);
    };

    const leave = (el: HTMLElement) => {
      if (el !== hovered) return;
      hovered = null;
      lift(el, false);
      icons(el, false);
    };

    const onPointerOver = (event: PointerEvent) => {
      const el = target(event, LIFTABLE);
      if (!el) return;
      const from = event.target as HTMLElement | null;
      if (hovered && from && hovered.contains(from)) return;
      enter(el);
    };

    const onPointerOut = (event: PointerEvent) => {
      const el = target(event, LIFTABLE);
      if (!el) return;
      const next = event.relatedTarget as Node | null;
      if (next && el.contains(next)) return;
      leave(el);
    };

    const onFocusIn = (event: FocusEvent) => {
      const el = target(event, LIFTABLE);
      if (el) enter(el);
    };

    const onFocusOut = (event: FocusEvent) => {
      const el = target(event, LIFTABLE);
      if (el) leave(el);
    };

    const press = (event: Event, down: boolean) => {
      const m = mod;
      if (!m || m.prefersReducedMotion()) return;
      const el = target(event, PRESSABLE);
      if (!el) return;
      m.gsap.to(el, {
        scale: down ? 0.985 : 1,
        y: down ? 1 : hovered === el ? Number(el.dataset.liftY ?? -3) : 0,
        duration: down ? 0.12 : 0.3,
        ease: down ? "power2.out" : "back.out(3)",
        overwrite: "auto",
      });
    };

    const onDown = (event: PointerEvent) => press(event, true);
    const onUp = (event: PointerEvent) => press(event, false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") press(event, true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") press(event, false);
    };

    const attach = () => {
      // Les règles CSS « GSAP pilote le transform » ne s'appliquent qu'ici :
      // /auth et l'espace connecté gardent leurs transitions d'origine.
      document.documentElement.classList.add("motion-ready");
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
      document.addEventListener("focusin", onFocusIn);
      document.addEventListener("focusout", onFocusOut);
      document.addEventListener("pointerdown", onDown);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    };

    void import("@/lib/gsap").then((loaded) => {
      if (disposed) return;
      mod = loaded;
      attach();
    });

    return () => {
      disposed = true;
      document.documentElement.classList.remove("motion-ready");
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      if (mod && hovered) mod.gsap.killTweensOf(hovered);
    };
  }, []);

  return null;
}
