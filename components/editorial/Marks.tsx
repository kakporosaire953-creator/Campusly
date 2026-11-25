/**
 * Marques éditoriales — géométrie fine, rien de dessiné à la main.
 * ---------------------------------------------------------------------------
 * Trois signes suffisent à ponctuer la page : une astérisque de renvoi, un
 * filet gradué et une croix de repère. Ils remplacent les traits « doodle »
 * du registre précédent, trop illustratifs pour une maquette de magazine.
 *
 * Tous `aria-hidden` : ils n'ajoutent aucune information.
 */

/** Astérisque de renvoi — tourne lentement en boucle (`data-float`). */
export function Asterisk({
  size = 14,
  className,
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      data-float="star"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
    </svg>
  );
}

/** Filet gradué : une règle d'imprimeur, en marge. */
export function Ruler({
  ticks = 12,
  className,
  color = "currentColor",
}: {
  ticks?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      width={ticks * 8}
      height={9}
      viewBox={`0 0 ${ticks * 8} 9`}
      fill="none"
      stroke={color}
      strokeWidth={1}
      aria-hidden="true"
      focusable="false"
    >
      <path d={`M0 1h${ticks * 8}`} />
      {Array.from({ length: ticks + 1 }, (_, index) => (
        <path
          key={index}
          d={`M${index * 8} 0v${index % 4 === 0 ? 9 : 4}`}
          strokeWidth={index % 4 === 0 ? 1 : 0.8}
        />
      ))}
    </svg>
  );
}

/** Croix de repère (recadrage, maquette). */
export function Cross({ className }: { className?: string }) {
  return <span className={className ? `ed-cross ${className}` : "ed-cross"} aria-hidden="true" />;
}

/** Flèche de renvoi en pied de section — dessinée au trait, sans emphase. */
export function LongArrow({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.42}
      viewBox="0 0 34 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 7h32" />
      <path d="M26 1.5 32.5 7 26 12.5" />
    </svg>
  );
}
