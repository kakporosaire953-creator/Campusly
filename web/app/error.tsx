"use client";

import { useEffect } from "react";

/** Frontière d'erreur globale (racine) — identité visuelle préservée. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Campusly] erreur globale :", error.message);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="state-card" role="alert">
        <div className="state-card-icon" aria-hidden="true">
          <i className="fa-solid fa-plug-circle-xmark" />
        </div>
        <h3>La page n&apos;a pas pu se charger</h3>
        <p>Réessayez : l&apos;environnement de démonstration n&apos;utilise aucun serveur métier.</p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Réessayer
        </button>
      </div>
    </div>
  );
}
