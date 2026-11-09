import "@/styles/legacy/pages/auth.css";
import "@/styles/legacy/pages/onboarding.css";
import "@/styles/app/auth.css";
import type { ReactNode } from "react";
/**
 * Gabarit des pages d'authentification et d'onboarding.
 * `/auth` est une colonne unique centrée (le formulaire est le point focal) ;
 * l'onboarding garde sa carte centrée. Ce layout ne monte pas de navbar.
 *
 * Animations volontairement limitées : la carte entre en fondu (CSS, aucune
 * bibliothèque d'animation chargée sur cette route) et les boutons s'enfoncent
 * au clic. Aucune animation par caractères, aucune carte qui « pop ».
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>
      <main id="contenu">{children}</main>
    </>
  );
}
