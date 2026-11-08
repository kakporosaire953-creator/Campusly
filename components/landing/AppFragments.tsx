import type { ReactNode } from "react";

/**
 * Fragments d'interface — matière première graphique de l'accueil.
 * ---------------------------------------------------------------------------
 * Ces cartes reprennent la STRUCTURE des écrans réels de Campusly (filtres de
 * la bibliothèque, classes, quiz, suivi) mais laissent les valeurs en
 * pointillés. Aucun chiffre, aucun titre d'épreuve, aucune réponse n'est
 * inventé : c'est un aperçu de l'interface, pas une capture truquée.
 *
 * Elles sont décoratives pour les technologies d'assistance (`aria-hidden`) ;
 * la légende visible, elle, reste lisible et dit ce qu'elles sont.
 */

function Fragment({
  label,
  tag = "Aperçu d'interface",
  children,
  className = "",
}: {
  label: string;
  tag?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`frag ${className}`.trim()} aria-hidden="true">
      <div className="frag__bar">
        <span className="frag__label">{label}</span>
        <span className="frag__tag">{tag}</span>
      </div>
      <div className="frag__body">{children}</div>
    </div>
  );
}

/** Ligne de valeur « en attente » : un pointillé, jamais un faux chiffre. */
function Placeholder({ width = "64%" }: { width?: string }) {
  return <span className="frag__ph" style={{ width }} />;
}

export function FragLibrary({ className }: { className?: string }) {
  return (
    <Fragment label="Épreuves et annales" className={className}>
      <p className="frag__search">Rechercher une matière, un mot-clé…</p>
      <ul className="frag__chips">
        {["FAST", "L2", "S1", "2025 — 2026"].map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
      <ul className="frag__rows">
        {[74, 58, 66].map((width, index) => (
          <li key={index}>
            <span className="frag__index">{String(index + 1).padStart(2, "0")}</span>
            <Placeholder width={`${width}%`} />
            <span className="frag__pill">Document</span>
          </li>
        ))}
      </ul>
      <p className="frag__foot">La bibliothèque ouvrira avec ses premiers fichiers.</p>
    </Fragment>
  );
}

export function FragClassroom({ className }: { className?: string }) {
  return (
    <Fragment label="Classe · Amphi" className={className}>
      <div className="frag__meta">
        <span>Code d&apos;amphi</span>
        <span className="frag__code">· · · · · ·</span>
      </div>
      <ul className="frag__list">
        {["Annonce", "Ressource", "Devoir"].map((row) => (
          <li key={row}>
            <span>{row}</span>
            <Placeholder width="42%" />
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export function FragQuiz({ className }: { className?: string }) {
  return (
    <Fragment label="Entraînement · QCM" className={className}>
      <p className="frag__question">
        <Placeholder width="86%" />
        <Placeholder width="54%" />
      </p>
      <ul className="frag__options">
        {["A", "B", "C", "D"].map((letter, index) => (
          <li key={letter} className={index === 0 ? "is-current" : ""}>
            <span className="frag__letter">{letter}</span>
            <Placeholder width={`${72 - index * 9}%`} />
          </li>
        ))}
      </ul>
      <p className="frag__foot">Chaque question reste modifiable avant l&apos;entraînement.</p>
    </Fragment>
  );
}

export function FragDashboard({ className }: { className?: string }) {
  return (
    <Fragment label="Suivi" className={className}>
      <div className="frag__stats">
        {["Cette semaine", "Notions suivies", "Dernière session"].map((label) => (
          <div key={label}>
            <span className="frag__stat-label">{label}</span>
            <span className="frag__stat-value">· · ·</span>
          </div>
        ))}
      </div>
      <ul className="frag__list">
        {["Entraînement en cours", "Notions à consolider"].map((row) => (
          <li key={row}>
            <span>{row}</span>
            <Placeholder width="38%" />
          </li>
        ))}
      </ul>
      <p className="frag__foot">Vos repères apparaissent après le premier entraînement.</p>
    </Fragment>
  );
}

export function FragComposition({ className }: { className?: string }) {
  return (
    <Fragment label="Composition" className={className}>
      <div className="frag__meta">
        <span>Durée</span>
        <span className="frag__code">fixée par l&apos;enseignant</span>
      </div>
      <div className="frag__meta">
        <span>Classe</span>
        <span className="frag__code">· · · · · ·</span>
      </div>
      <ul className="frag__chips">
        {["Plein écran", "Chronomètre", "Copie rendue"].map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
      <p className="frag__foot">Le journal d&apos;intégrité reste sur l&apos;appareil.</p>
    </Fragment>
  );
}

export function FragTeacher({ className }: { className?: string }) {
  return (
    <Fragment label="Espace enseignant" className={className}>
      <ol className="frag__steps">
        {["Créer une classe", "Déposer un support", "Suivre les rendus"].map((step, index) => (
          <li key={step}>
            <span className="frag__index">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="frag__foot">Le code d&apos;amphi est généré à la création de la classe.</p>
    </Fragment>
  );
}
