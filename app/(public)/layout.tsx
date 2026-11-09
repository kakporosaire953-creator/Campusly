import "@/styles/legacy/pages/index.css";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionScope } from "@/components/motion/MotionScope";
import { MotionGlobal } from "@/components/motion/MotionGlobal";
import { BackToTop } from "@/components/motion/BackToTop";

/**
 * Gabarit des pages publiques (accueil, pages légales, à propos, contribuer).
 *
 * `MotionScope` englobe le contenu et le pied de page : c'est la portée
 * unique du contexte GSAP (révélations, cartes, étiquettes, survols).
 * `MotionGlobal` branche les gestes (survol, clic, icônes) par délégation : la
 * barre de navigation, qui est fixe et hors de la portée, en profite aussi.
 *
 * Les pages d'authentification et l'espace connecté ne chargent ni l'un ni
 * l'autre : GSAP n'y est pas nécessaire et n'alourdit pas leur premier
 * chargement.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MotionGlobal />
      <SiteHeader />
      <MotionScope>
        <main id="contenu">{children}</main>
        <SiteFooter />
        <BackToTop />
      </MotionScope>
    </>
  );
}
