import type { ReactNode } from "react";

/** Carte de base — reprend `.card` de modern.css. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Tag className={`card ${className}`.trim()}>{children}</Tag>;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="row-between" style={{ marginBottom: 16 }}>
      <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
        {icon ? (
          <span
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(21,101,192,0.1)",
              color: "var(--brand-1)",
              flexShrink: 0,
            }}
          >
            <i className={icon} />
          </span>
        ) : null}
        <div>
          <h3 className="card-title" style={{ marginBottom: subtitle ? 2 : 0 }}>
            {title}
          </h3>
          {subtitle ? (
            <p style={{ fontSize: "0.8rem", color: "var(--text-3)", margin: 0 }}>{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
