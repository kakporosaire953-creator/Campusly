/**
 * Schéma explicatif de Campusly AI (colonne de droite de la section IA).
 * ---------------------------------------------------------------------------
 * Construit à partir de formes et de composants : aucun chiffre, aucun
 * document fictif, aucun résultat inventé. Il décrit le parcours réel —
 * document → concepts → exercices — tel qu'il est proposé dans l'application.
 */

const CONCEPTS = ["Définition", "Théorème", "Méthode", "Exemple"];
const FORMATS = ["QCM", "Vrai / Faux", "Question ouverte"];

export function StudyFlow() {
  return (
    <div className="study-flow" role="img" aria-label="Schéma : un document de cours est analysé, ses concepts clés sont extraits, puis transformés en exercices de plusieurs formats.">
      <div className="study-flow-step">
        <span className="study-flow-label">Document</span>
        <div className="study-sheet" aria-hidden="true">
          <span className="study-sheet-title" />
          <span className="study-sheet-line" />
          <span className="study-sheet-line is-short" />
          <span className="study-sheet-line" />
          <span className="study-sheet-line is-shorter" />
        </div>
      </div>

      <span className="study-flow-link" aria-hidden="true">
        <svg viewBox="0 0 12 44" focusable="false">
          <path d="M6 0v34" />
          <path d="M2 30l4 6 4-6" />
        </svg>
      </span>

      <div className="study-flow-step">
        <span className="study-flow-label">Concepts clés</span>
        <ul className="study-chips" aria-hidden="true">
          {CONCEPTS.map((concept) => (
            <li key={concept}>{concept}</li>
          ))}
        </ul>
      </div>

      <span className="study-flow-link" aria-hidden="true">
        <svg viewBox="0 0 12 44" focusable="false">
          <path d="M6 0v34" />
          <path d="M2 30l4 6 4-6" />
        </svg>
      </span>

      <div className="study-flow-step">
        <span className="study-flow-label">Entraînement</span>
        <ul className="study-chips is-formats" aria-hidden="true">
          {FORMATS.map((format) => (
            <li key={format}>{format}</li>
          ))}
        </ul>
      </div>

      <p className="study-flow-note">
        Vous relisez et corrigez chaque question avant de lancer l&apos;entraînement.
      </p>
    </div>
  );
}
