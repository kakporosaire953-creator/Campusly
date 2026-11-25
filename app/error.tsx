"use client";

import { useEffect } from "react";
import { useT } from "@/lib/i18n/provider";

/** Frontière d'erreur globale (racine) — identité visuelle préservée. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();

  useEffect(() => {
    console.error("[Campusly] erreur globale :", error.message);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="state-card" role="alert">
        <div className="state-card-icon" aria-hidden="true">
          <i className="fa-solid fa-plug-circle-xmark" />
        </div>
        <h3>{t("common.pageErrorTitle")}</h3>
        <p>{t("common.pageErrorBody")}</p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> {t("common.retry")}
        </button>
      </div>
    </div>
  );
}
