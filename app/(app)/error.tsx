"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Frontière d'erreur de l'espace applicatif.
 * Aucune donnée sensible n'est affichée : seul un message et un bouton de
 * reprise sont proposés (l'erreur technique est journalisée en console).
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Campusly] erreur de rendu :", error.message);
  }, [error]);

  return (
    <div className="state-card" role="alert" style={{ marginTop: 24 }}>
      <div className="state-card-icon" aria-hidden="true" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger)" }}>
        <i className="fa-solid fa-triangle-exclamation" />
      </div>
      <h3>Une erreur est survenue</h3>
      <p>
        Cette section n&apos;a pas pu s&apos;afficher. Vos données de démonstration sont conservées dans votre
        navigateur.
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Button variant="outline" icon="fa-solid fa-rotate-right" onClick={reset}>
          Réessayer
        </Button>
        <Button href="/dashboard" variant="ghost">
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
