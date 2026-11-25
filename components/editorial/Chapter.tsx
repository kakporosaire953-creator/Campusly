import type { ReactNode } from "react";
import { Cross } from "@/components/editorial/Marks";

/**
 * Chapitre éditorial — l'ossature répétée des neuf séquences.
 * ---------------------------------------------------------------------------
 * Un en-tête, puis une composition libre. Ce qui change d'un chapitre à
 * l'autre, c'est la composition ; ce qui ne change pas, c'est le repère :
 * un numéro, un libellé, un filet.
 *
 * `SectionHead` du registre précédent (titre à gauche, chapeau à droite) est
 * remplacé : ici le titre est monumental et le chapeau se glisse dans la
 * marge, sous un filet vertical.
 */

export function Chapter({
  id,
  index,
  label,
  title,
  note,
  lede,
  tone = "paper",
  children,
}: {
  id?: string;
  index: string;
  label: string;
  title: ReactNode;
  note?: string;
  lede?: ReactNode;
  tone?: "paper" | "ink";
  children?: ReactNode;
}) {
  const dark = tone === "ink";

  return (
    <section className={dark ? "ink-field ed-chapter-block is-dark" : "ed-chapter-block"} id={id}>
      <div className="ed-rail">
        <header className="ed-chapter">
          <div className="ed-chapter__top">
            <p className="ed-eyebrow">
              <span className="ed-chapter__index">{index}</span>
              <span>{label}</span>
            </p>
            <p className="ed-eyebrow ed-chapter__note">
              <Cross />
              {note}
            </p>
          </div>

          <h2 className="ed-display ed-chapter__title" data-reveal>
            {title}
          </h2>

          {lede ? (
            <div className="ed-chapter__aside" data-reveal-soft>
              <p className="ed-lede">{lede}</p>
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}

/**
 * Intertitre de colonne — pour les compositions qui ont besoin d'un
 * sous-repère à l'intérieur d'un chapitre.
 */
export function Marker({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className="ed-eyebrow ed-marker">
      <span className="ed-num">{num}</span>
      <span>{children}</span>
    </p>
  );
}
