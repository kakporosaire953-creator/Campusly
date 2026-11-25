"use client";

/**
 * Fragments d'interface — maquettes typographiques, pas des captures truquées.
 * ---------------------------------------------------------------------------
 * Chaque fragment reprend la STRUCTURE d'un écran réellement présent dans
 * l'application (bibliothèque, classe, entraînement, chronomètre, suivi) en
 * laissant les valeurs en pointillés : aucun titre d'épreuve, aucun score,
 * aucun nom d'étudiant n'est inventé.
 *
 * Deux marqueurs d'honnêteté :
 *  - la barre de titre porte « Aperçu d'interface » ;
 *  - les zones encore vides disent pourquoi elles le sont.
 *
 * Les fragments ne sont pas des composants de l'application : ce sont des
 * mises en scène. Les vrais écrans gardent leurs composants (`features/*`).
 */

import { useId, useState } from "react";

type FragProps = {
  className?: string;
  "data-pop"?: boolean;
  "data-reveal"?: boolean;
  "data-lift"?: boolean;
};

function Shell({
  label,
  tag = "Aperçu d'interface",
  className = "",
  children,
  ...motion
}: {
  label: string;
  tag?: string;
  children: React.ReactNode;
} & FragProps) {
  return (
    <div className={`ed-frag ${className}`.trim()} {...motion}>
      <div className="ed-frag__bar">
        <span className="ed-frag__label">{label}</span>
        <span className="ed-frag__tag">{tag}</span>
      </div>
      <div className="ed-frag__body">{children}</div>
    </div>
  );
}

function Ph({ width = "62%" }: { width?: string }) {
  return <span className="ed-ph" style={{ width }} aria-hidden="true" />;
}

/* ── Bibliothèque ─────────────────────────────────────────────────────────
   Reprend l'écran /dashboard/epreuves : recherche, filtres de maquette,
   liste de documents. Le catalogue est vide dans la version actuelle, et le
   fragment le dit au lieu d'afficher des documents de remplissage. */

const FILTERS = ["FAST", "L2", "S1", "2025 — 2026"];

export function FragLibrary({ className, ...rest }: FragProps) {
  const [active, setActive] = useState(0);
  const id = useId();

  return (
    <Shell label="Épreuves et annales" className={className} {...rest}>
      <p className="ef-search">
        <span className="ef-search__icon" aria-hidden="true" />
        Rechercher une matière, un mot-clé…
      </p>

      <ul className="ef-chips" aria-label={`Filtres de la bibliothèque (exemple ${id})`}>
        {FILTERS.map((filter, index) => (
          <li key={filter}>
            <button
              type="button"
              className={index === active ? "ef-chip is-active" : "ef-chip"}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              {filter}
            </button>
          </li>
        ))}
      </ul>

      <ul className="ef-rows">
        {[0, 1, 2].map((row) => (
          <li key={row}>
            <span className="ef-rows__index" aria-hidden="true">
              {String(row + 1).padStart(2, "0")}
            </span>
            <Ph width={["74%", "56%", "64%"][row]} />
            <span className="ef-rows__pill">Document</span>
          </li>
        ))}
      </ul>

      <p className="ed-frag__foot">
        Le catalogue ouvrira avec ses premiers fichiers : aucune entrée de
        remplissage n&apos;est affichée ici.
      </p>
    </Shell>
  );
}

/* ── Classe d'amphi ─────────────────────────────────────────────────────── */

export function FragClassroom({ className, ...rest }: FragProps) {
  return (
    <Shell label="Classe · Amphi" className={className} {...rest}>
      <div className="ef-meta">
        <span className="ed-label">Code d&apos;amphi</span>
        <span className="ef-code">· · · · · ·</span>
      </div>
      <ul className="ef-list">
        {["Annonce", "Ressource", "Devoir"].map((row) => (
          <li key={row}>
            <span className="ef-list__name">{row}</span>
            <Ph width="44%" />
          </li>
        ))}
      </ul>
      <p className="ed-frag__foot">Le code est généré à la création de la classe.</p>
    </Shell>
  );
}

/* ── Entraînement ───────────────────────────────────────────────────────── */

export function FragQuiz({ className, ...rest }: FragProps) {
  return (
    <Shell label="Entraînement · QCM" className={className} {...rest}>
      <p className="ef-question">
        <Ph width="86%" />
        <Ph width="52%" />
      </p>
      <ul className="ef-options">
        {["A", "B", "C", "D"].map((letter, index) => (
          <li key={letter} className={index === 0 ? "is-current" : ""}>
            <span className="ef-letter">{letter}</span>
            <Ph width={`${70 - index * 9}%`} />
          </li>
        ))}
      </ul>
      <p className="ed-frag__foot">Chaque question reste modifiable avant l&apos;entraînement.</p>
    </Shell>
  );
}

/* ── Suivi ──────────────────────────────────────────────────────────────── */

export function FragProgress({ className, ...rest }: FragProps) {
  return (
    <Shell label="Suivi" className={className} {...rest}>
      <div className="ef-stats">
        {["Cette semaine", "Notions suivies", "Dernière session"].map((label) => (
          <div key={label}>
            <span className="ed-label">{label}</span>
            <span className="ef-stats__value">· · ·</span>
          </div>
        ))}
      </div>
      <ul className="ef-list">
        {["Entraînement en cours", "Notions à consolider"].map((row) => (
          <li key={row}>
            <span className="ef-list__name">{row}</span>
            <Ph width="38%" />
          </li>
        ))}
      </ul>
      <p className="ed-frag__foot">
        Les repères apparaissent après le premier entraînement — aucun chiffre
        n&apos;est simulé avant.
      </p>
    </Shell>
  );
}

/* ── Salle de composition ───────────────────────────────────────────────── */

export function FragComposition({ className, ...rest }: FragProps) {
  return (
    <Shell label="Composition" tag="Écran réel · aperçu" className={className} {...rest}>
      <div className="ef-timer" aria-hidden="true">
        <span className="ef-timer__digits">00:00</span>
        <span className="ed-label">Temps imparti</span>
      </div>
      <div className="ef-meta">
        <span className="ed-label">Classe</span>
        <span className="ef-code">· · · · · ·</span>
      </div>
      <ul className="ef-chips ef-chips--static">
        {["Plein écran", "Chronomètre", "Copie rendue"].map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>
      <p className="ed-frag__foot">
        Le journal d&apos;intégrité reste sur l&apos;appareil : aucune sanction
        n&apos;est automatique.
      </p>
    </Shell>
  );
}

/* ── Espace enseignant ──────────────────────────────────────────────────── */

export function FragTeacher({ className, ...rest }: FragProps) {
  return (
    <Shell label="Espace enseignant" className={className} {...rest}>
      <ol className="ef-steps">
        {["Créer une classe", "Déposer un support", "Suivre les rendus"].map((step, index) => (
          <li key={step}>
            <span className="ef-steps__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <p className="ed-frag__foot">
        La vérification du statut enseignant reste faite par le secrétariat
        académique.
      </p>
    </Shell>
  );
}

/* ── Séquence Campusly AI ───────────────────────────────────────────────── */

const AI_STEPS = [
  { num: "01", name: "Importer", detail: "PDF, TD, notes de cours" },
  { num: "02", name: "Identifier", detail: "Définitions, théorèmes, méthodes" },
  { num: "03", name: "Générer", detail: "QCM, vrai/faux, question ouverte" },
  { num: "04", name: "S'entraîner", detail: "Relire, corriger, recommencer" },
];

/**
 * La séquence est une MAQUETTE : l'analyse de document n'est pas ouverte dans
 * cette version. Elle est donc présentée sur fond d'encre, avec une mention
 * d'état explicite, et sans aucune valeur produite.
 */
export function AiTrail({ className }: { className?: string }) {
  const [step, setStep] = useState(0);

  return (
    <div className={`ai-trail ${className ?? ""}`.trim()}>
      <ol className="ai-trail__steps" aria-label="Parcours Campusly AI">
        {AI_STEPS.map((item, index) => (
          <li key={item.num}>
            <button
              type="button"
              className={index === step ? "ai-trail__step is-current" : "ai-trail__step"}
              aria-pressed={index === step}
              onClick={() => setStep(index)}
            >
              <span className="ai-trail__num">{item.num}</span>
              <span className="ai-trail__name">{item.name}</span>
              <span className="ai-trail__detail">{item.detail}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="ai-stage" aria-live="polite">
        <div className="ai-stage__head">
          <span className="ed-label">
            Étape {AI_STEPS[step].num} — {AI_STEPS[step].name}
          </span>
          <span className="ed-state ed-state--soon">En préparation</span>
        </div>

        {step === 0 ? (
          <div className="ai-sheet" aria-hidden="true">
            <span className="ai-sheet__tab">cours-magistral.pdf</span>
            <span className="ai-sheet__line" />
            <span className="ai-sheet__line is-short" />
            <span className="ai-sheet__line" />
            <span className="ai-sheet__line is-shorter" />
            <span className="ai-sheet__line" />
          </div>
        ) : null}

        {step === 1 ? (
          <ul className="ai-notions">
            {["Définition", "Théorème", "Méthode", "Exemple"].map((concept, index) => (
              <li key={concept} style={{ ["--i" as string]: index }}>
                <span>{concept}</span>
                <span className="ai-notions__dots" aria-hidden="true">
                  · · ·
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {step === 2 ? (
          <ul className="ai-formats">
            {[
              ["QCM", "quatre propositions, une réponse"],
              ["Vrai / Faux", "justification attendue"],
              ["Question ouverte", "réponse rédigée, corrigée à la main"],
            ].map(([name, detail]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {step === 3 ? (
          <div className="ai-runner">
            <div className="ai-runner__q">
              <Ph width="88%" />
              <Ph width="46%" />
            </div>
            <div className="ai-runner__bar">
              <span />
              <span className="is-on" />
              <span />
              <span />
            </div>
          </div>
        ) : null}
      </div>

      <p className="ai-trail__note">
        <strong>État réel :</strong> l&apos;analyse de document n&apos;est pas
        encore ouverte. Les quatre temps ci-dessus décrivent le parcours prévu ;
        la banque d&apos;exercices et les modes d&apos;entraînement, eux, sont
        utilisables dès maintenant, avec une correction locale explicitement non
        officielle.
      </p>
    </div>
  );
}
