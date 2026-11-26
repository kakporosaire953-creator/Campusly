"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { useOptionalI18n } from "@/lib/i18n/provider";
import { getMessages } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

/**
 * Traduction avec repli français, sans exiger le fournisseur : ces primitives
 * sont aussi rendues hors contexte (tests unitaires, squelettes de route).
 */
function useFallbackT() {
  const context = useOptionalI18n();
  return (
    context?.t ??
    ((key: string, params?: Record<string, string | number>) => {
      const messages = getMessages(DEFAULT_LOCALE);
      const raw = key.split(".").reduce<unknown>(
        (node, segment) => (typeof node === "object" && node ? (node as Record<string, unknown>)[segment] : undefined),
        messages,
      );
      const text = typeof raw === "string" ? raw : key;
      return params
        ? text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
        : text;
    })
  );
}

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
  title,
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
  const t = useFallbackT();
  return (
    <div className="state-card" role="alert" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
      <div className="state-card-icon" aria-hidden="true" style={{ background: "rgba(239,68,68,0.12)", color: "var(--danger)" }}>
        <i className="fa-solid fa-triangle-exclamation" />
      </div>
      <h3>{title ?? t("common.loadError")}</h3>
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" icon="fa-solid fa-rotate-right" onClick={onRetry}>
          {t("common.retry")}
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
  const t = useFallbackT();
  return (
    <div className="grid-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("common.loading")}</span>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/** Indicateur de chargement plein cadre (salle d'examen, écrans dédiés). */
export function Loader({ label }: { label?: string }) {
  const t = useFallbackT();
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
      {label ?? t("common.loading")}
    </div>
  );
}
