import Link from "next/link";

/**
 * Composition du hero (colonne de droite).
 * ---------------------------------------------------------------------------
 * Volontairement construite en React + SVG, sans aucune donnée chiffrée :
 * ni faux profils, ni scores, ni statistiques inventées. Elle présente les
 * trois surfaces réellement présentes dans l'application (ressources,
 * révision, évaluations) sous forme de planche éditoriale numérotée.
 */

const CHAPTERS = [
  {
    index: "01",
    title: "Ressources",
    text: "Épreuves, annales et supports, classés par faculté, niveau et semestre.",
    href: "/dashboard/epreuves",
  },
  {
    index: "02",
    title: "Révision",
    text: "Quiz, fiches et modes d'entraînement construits à partir de vos cours.",
    href: "/dashboard/revision",
  },
  {
    index: "03",
    title: "Évaluations",
    text: "Compositions chronométrées, copies corrigées et suivi des classes.",
    href: "/dashboard/compositions",
  },
];

export function HeroComposition() {
  return (
    <figure className="hero-plate">
      <svg className="hero-plate-orbit" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
        <circle cx="120" cy="120" r="96" className="hero-plate-orbit-ring" />
        <circle cx="120" cy="120" r="66" className="hero-plate-orbit-ring" />
        <path d="M120 24a96 96 0 0 1 83 48" className="hero-plate-orbit-arc" />
        <circle cx="203" cy="72" r="4.5" className="hero-plate-orbit-dot" />
        <circle cx="120" cy="54" r="3" className="hero-plate-orbit-dot is-soft" />
      </svg>

      <div className="hero-plate-inner">
        <div className="hero-plate-head">
          <span className="hero-plate-mark" aria-hidden="true">
            C
          </span>
          <span className="hero-plate-label">Plateforme académique · UAC</span>
        </div>

        <ol className="hero-plate-list">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.index} data-hero-plate-item>
              <Link href={chapter.href} className="hero-plate-item">
                <span className="hero-plate-index" aria-hidden="true">
                  {chapter.index}
                </span>
                <span className="hero-plate-body">
                  <span className="hero-plate-title">{chapter.title}</span>
                  <span className="hero-plate-text">{chapter.text}</span>
                </span>
                <span className="hero-plate-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <figcaption className="hero-plate-foot">
          Étudiants, enseignants et administration — un seul environnement.
        </figcaption>
      </div>
    </figure>
  );
}
