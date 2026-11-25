import type { ReactNode } from "react";
import { roleLabels } from "@/config/site";
import type { UserRole } from "@/types";

type Tone = "brand" | "accent" | "success" | "danger" | "neutral";

/* Toutes les teintes viennent des jetons de `styles/app/brand.css` : elles
   s'inversent avec le thème et gardent le contraste AA. Aucune valeur en dur
   ici — c'est ce qui faisait passer « En cours » à 2,46:1 sur blanc. */
const TONES: Record<Tone, { background: string; color: string; border: string }> = {
  brand: {
    background: "var(--brand-info-soft)",
    color: "var(--brand-on-surface)",
    border: "var(--brand-line-2)",
  },
  accent: {
    background: "var(--ember-soft)",
    color: "var(--accent-text)",
    border: "rgba(253,133,23,0.34)",
  },
  success: {
    background: "var(--brand-success-soft)",
    color: "var(--brand-success)",
    border: "rgba(15,123,82,0.34)",
  },
  danger: {
    background: "var(--brand-danger-soft)",
    color: "var(--brand-danger)",
    border: "rgba(179,38,30,0.34)",
  },
  neutral: {
    background: "var(--surface-2)",
    color: "var(--text-2)",
    border: "var(--border)",
  },
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


export function RoleBadge({ role }: { role: UserRole }) {
  const tone: Tone = role === "admin" ? "danger" : role === "teacher" ? "accent" : "brand";
  const icon = role === "admin" ? "fa-solid fa-shield-halved" : role === "teacher" ? "fa-solid fa-person-chalkboard" : "fa-solid fa-user-graduate";
  return (
    <Badge tone={tone} icon={icon}>
      {roleLabels[role]}
    </Badge>
  );
}
