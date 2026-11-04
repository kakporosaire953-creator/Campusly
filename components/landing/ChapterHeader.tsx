import type { ReactNode } from "react";

/**
 * En-tête de chapitre — « Le Registre ».
 * ---------------------------------------------------------------------------
 * Trois informations sur une même grille : le numéro de chapitre + son libellé
 * à gauche, l'annotation technique à droite, puis le titre en display serif.
 * Asymétrie volontaire : c'est ce qui redonne un axe à la page.
 */
export function ChapterHeader({
  index,
  label,
  title,
  note,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <header className="chapter" data-anim="chapter">
      <div className="chapter-rule" data-anim="rule" aria-hidden="true" />
      <div className="chapter-meta">
        <p className="chapter-tag">
          <span className="chapter-index" aria-hidden="true">
            {index}
          </span>
          <span className="chapter-label">{label}</span>
        </p>
        {note ? <p className="chapter-note">{note}</p> : null}
      </div>
      <h2 className="chapter-title">{title}</h2>
      {children ? <div className="chapter-lede">{children}</div> : null}
    </header>
  );
}
