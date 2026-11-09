import type { SVGProps } from "react";

/**
 * Icônes animées.
 * ---------------------------------------------------------------------------
 * Le dessin est statique ; l'animation est portée par `data-icon` et jouée par
 * `MotionScope` au survol, au focus clavier ou au clic du parent. Aucune
 * dépendance supplémentaire (pas de bibliothèque d'icônes animées) : les
 * tracés sont ceux de Campusly, seuls les gestes viennent de Kraken.
 *
 * `aria-hidden` par défaut : l'icône double toujours un texte visible.
 */

type Name = "arrow-right" | "arrow-up" | "arrow-up-right" | "plus" | "star";

const PATHS: Record<Name, React.ReactNode> = {
  "arrow-right": (
    <>
      <path data-icon-shape d="M4 12h15" />
      <path data-icon-shape d="M13 6l6 6-6 6" />
    </>
  ),
  "arrow-up": (
    <>
      <path data-icon-shape d="M12 19V5" />
      <path data-icon-shape d="M6 11l6-6 6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path data-icon-shape d="M6 18L18 6" />
      <path data-icon-shape d="M9 6h9v9" />
    </>
  ),
  plus: (
    <>
      <path data-icon-shape d="M12 5v14" />
      <path data-icon-shape d="M5 12h14" />
    </>
  ),
  star: (
    <path data-icon-shape d="M12 3c.6 5 2.3 7 8 9-5.7 2-7.4 4-8 9-.6-5-2.3-7-8-9 5.7-2 7.4-4 8-9Z" />
  ),
};

export function Icon({
  name,
  size = 18,
  ...props
}: { name: Name; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      data-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
