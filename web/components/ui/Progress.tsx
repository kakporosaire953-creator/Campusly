import type { ReactNode } from "react";

export function ProgressBar({
  value,
  tone = "brand",
  label,
}: {
  value: number;
  tone?: "brand" | "success" | "danger" | "accent";
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progression"}
      >
        <div
          className={`progress-fill ${tone !== "brand" ? `is-${tone}` : ""}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label ? (
        <div className="row-between" style={{ marginTop: 6 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{label}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-2)" }}>{clamped}%</span>
        </div>
      ) : null}
    </div>
  );
}

/** Carte statistique — reprend `.stat-card` de modern.css. */
export function StatCard({
  label,
  value,
  icon,
  tone = "blue",
  hint,
  action,
}: {
  label: string;
  value: ReactNode;
  icon: string;
  tone?: "blue" | "orange" | "green" | "purple";
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${tone}`} aria-hidden="true">
        <i className={icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {hint ? (
          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 4 }}>{hint}</div>
        ) : null}
      </div>
      {action}
    </div>
  );
}
