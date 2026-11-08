import type { ReactNode } from "react";

/**
 * En-tête de section éditoriale.
 * ---------------------------------------------------------------------------
 * Une seule famille d'en-tête pour toute la page : un numéro + un libellé
 * au-dessus, puis un titre sur la colonne de gauche et une annotation sur la
 * colonne de droite. C'est l'asymétrie qui donne le rythme ; le contenu, lui,
 * change à chaque section.
 */
export function SectionHead({
  index,
  label,
  title,
  note,
  children,
  tone = "light",
}: {
  index: string;
  label: string;
  title: ReactNode;
  note?: string;
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <header className={`sec-head sec-head--${tone}`} data-reveal>
      <p className="sec-head__tag">
        <span className="sec-head__index" aria-hidden="true">
          {index}
        </span>
        <span className="sec-head__label">{label}</span>
      </p>
      <div className="sec-head__grid">
        <h2 className="sec-head__title">{title}</h2>
        <div className="sec-head__aside">
          {note ? <p className="sec-head__note">{note}</p> : null}
          {children ? <div className="sec-head__lede">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
