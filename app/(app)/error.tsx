"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/provider";

/**
 * Frontière d'erreur de l'espace applicatif.
 * Aucune donnée sensible n'est affichée : seul un message et un bouton de
 * reprise sont proposés (l'erreur technique est journalisée en console).
 */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();

  useEffect(() => {
    console.error("[Campusly] erreur de rendu :", error.message);
  }, [error]);

  return (
    <div className="state-card" role="alert" style={{ marginTop: 24 }}>
      <div className="state-card-icon" aria-hidden="true" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger)" }}>
        <i className="fa-solid fa-triangle-exclamation" />
      </div>
      <h3>{t("common.appErrorTitle")}</h3>
      <p>{t("common.appErrorBody")}</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Button variant="outline" icon="fa-solid fa-rotate-right" onClick={reset}>
          {t("common.retry")}
        </Button>
        <Button href="/dashboard" variant="ghost">
          {t("common.backToDashboard")}
        </Button>
      </div>
    </div>
  );
}
