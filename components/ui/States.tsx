import type { ReactNode } from "react";
import { Button } from "./Button";

/** État vide — reprend la structure `.state-card` (alignée sur `.empty-state`). */
export function EmptyState({
  icon = "fa-regular fa-folder-open",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-card" role="status">
      <div className="state-card-icon" aria-hidden="true">
        <i className={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Impossible de charger les données",
  message,
  onRetry,
  action,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  /** Action supplémentaire affichée sous le bouton « Réessayer ». */
  action?: ReactNode;
}) {
  return (
    <div className="state-card" role="alert" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
      <div className="state-card-icon" aria-hidden="true" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger)" }}>
        <i className="fa-solid fa-triangle-exclamation" />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" icon="fa-solid fa-rotate-right" onClick={onRetry}>
          Réessayer
        </Button>
      ) : null}
      {action}
    </div>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card" aria-hidden="true">
      <div className="skeleton skeleton-line" style={{ width: "45%", height: 16 }} />
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton skeleton-line"
          style={{ width: `${90 - index * 12}%`, marginTop: 10 }}
        />
      ))}
    </div>
  );
}

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">
        Chargement des données de démonstration…
      </span>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/** Indicateur de chargement plein cadre (salle d'examen, écrans dédiés). */
export function Loader({ label = "Chargement…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        color: "var(--text-2)",
        fontSize: "0.9rem",
      }}
    >
      <span className="loader-spinner" style={{ width: 28, height: 28 }} aria-hidden="true" />
      {label}
    </div>
  );
}
