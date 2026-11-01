import "@/styles/legacy/pages/auth.css";
import "@/styles/legacy/pages/onboarding.css";
import type { ReactNode } from "react";
/**
 * Gabarit des pages d'authentification et d'onboarding.
 * La page `/auth` reprend le split-screen historique ; l'onboarding utilise
 * une carte centrée. Ce layout ne monte donc pas de navbar.
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
