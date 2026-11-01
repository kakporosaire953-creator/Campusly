import type { ReactNode } from "react";
import { roleLabels } from "@/config/site";
import type { UserRole } from "@/types";

type Tone = "brand" | "accent" | "success" | "danger" | "neutral";

const TONES: Record<Tone, { background: string; color: string; border: string }> = {
  brand: { background: "rgba(21,101,192,0.1)", color: "var(--brand-1)", border: "rgba(21,101,192,0.25)" },
  accent: { background: "rgba(245,124,0,0.12)", color: "var(--accent)", border: "rgba(245,124,0,0.3)" },
  success: { background: "rgba(16,185,129,0.12)", color: "var(--success)", border: "rgba(16,185,129,0.3)" },
  danger: { background: "rgba(239,68,68,0.12)", color: "var(--danger)", border: "rgba(239,68,68,0.3)" },
  neutral: { background: "var(--surface-2)", color: "var(--text-2)", border: "var(--border)" },
};

export function Badge({
  children,
  tone = "brand",
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: string;
}) {
  const palette = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: "var(--r-full)",
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        fontSize: "0.72rem",
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {icon ? <i className={icon} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/**
 * Marqueur de données fictives.
 * Exigence de la mission : toute donnée de démonstration doit être
 * identifiable sans ambiguïté.
 */
export function DemoBadge({ label = "Données de démonstration" }: { label?: string }) {
  return (
    <span className="demo-chip" title="Contenu fictif, sans persistance serveur">
      <i className="fa-solid fa-flask" aria-hidden="true" />
      {label}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const tone: Tone = role === "admin" ? "danger" : role === "teacher" ? "accent" : "brand";
  const icon = role === "admin" ? "fa-solid fa-shield-halved" : role === "teacher" ? "fa-solid fa-person-chalkboard" : "fa-solid fa-user-graduate";
  return (
    <Badge tone={tone} icon={icon}>
      {roleLabels[role]}
    </Badge>
  );
}
