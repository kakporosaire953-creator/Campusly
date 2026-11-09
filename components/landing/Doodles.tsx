/**
 * Traits dessinés à la main — décor uniquement.
 * ---------------------------------------------------------------------------
 * Repris du site Kraken, redessinés dans la palette Campusly. Chaque trait est
 * animé en boucle par `MotionScope` (`data-float` = burst · star · squiggle ·
 * arrow) : éventail qui respire, étoile qui tourne, vague qui se retrace,
 * flèche qui avance et revient.
 *
 * Tous `aria-hidden` : ils n'ajoutent aucune information, seulement du rythme.
 */

type DoodleProps = {
  className?: string;
  color?: string;
  size?: number;
};

/** Traits en éventail. */
export function Burst({ className, color = "currentColor", size = 34, flip = false }: DoodleProps & { flip?: boolean }) {
  return (
    <svg
      data-float="burst"
      className={className ? `doodle ${className}` : "doodle"}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {flip ? (
        <>
          <path d="M34 30 L26 24" />
          <path d="M26 10 L21 18" />
          <path d="M10 6 L12 16" />
        </>
      ) : (
        <>
          <path d="M6 30 L14 24" />
          <path d="M14 10 L19 18" />
          <path d="M30 6 L28 16" />
        </>
      )}
    </svg>
  );
}

/** Étoile à quatre branches. */
export function Star({ className, color = "currentColor", size = 22 }: DoodleProps) {
  return (
    <svg
      data-float="star"
      className={className ? `doodle ${className}` : "doodle"}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 2 C21 13 24 17 38 20 C24 23 21 27 20 38 C19 27 16 23 2 20 C16 17 19 13 20 2 Z" fill={color} />
    </svg>
  );
}

/** Vague soulignée, retracée en boucle. */
export function Squiggle({ className, color = "currentColor", width = 96 }: Omit<DoodleProps, "size"> & { width?: number }) {
  return (
    <svg
      data-float="squiggle"
      className={className ? `doodle ${className}` : "doodle"}
      width={width}
      height={14}
      viewBox="0 0 110 16"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 10 C12 2 18 2 25 9 S40 15 48 8 S63 1 71 8 S86 15 94 8 S104 4 107 6" />
    </svg>
  );
}

/** Flèche courbe. */
export function CurlyArrow({ className, color = "currentColor", size = 44 }: DoodleProps) {
  return (
    <svg
      data-float="arrow"
      className={className ? `doodle ${className}` : "doodle"}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 8 C10 30 24 44 48 46" />
      <path d="M38 38 L49 46 L39 54" />
    </svg>
  );
}
