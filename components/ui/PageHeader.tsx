import type { ReactNode } from "react";
import { DemoBadge } from "./Badge";

export function PageHeader({
  title,
  subtitle,
  actions,
  demo = false,
  icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  demo?: boolean;
  icon?: string;
}) {
  return (
    <div className="page-head row-between">
      <div>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {icon ? <i className={icon} aria-hidden="true" style={{ color: "var(--brand-1)", fontSize: "1.2rem" }} /> : null}
          {title}
          {demo ? <DemoBadge /> : null}
        </h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="row">{actions}</div> : null}
    </div>
  );
}

export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="user-avatar-circle"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {initials || "?"}
    </span>
  );
}
