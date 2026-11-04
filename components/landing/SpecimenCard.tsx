import Link from "next/link";

/**
 * Fiche d'épreuve « spécimen » — pièce centrale du hero.
 * ---------------------------------------------------------------------------
 * C'est un formulaire vierge du registre, pas une fausse épreuve : les champs
 * de nomenclature sont remplis avec la nomenclature réelle de l'UAC (faculté,
 * département, niveau, semestre), les valeurs de mesure restent en pointillés
 * et l'étiquette SPÉCIMEN est explicite. Aucun titre d'épreuve n'est inventé,
 * aucun nombre ne prétend décrire un fonds documentaire.
 */
export function SpecimenCard() {
  const fields: Array<[string, string]> = [
    ["Faculté", "FAST"],
    ["Département", "Informatique"],
    ["Niveau", "L2"],
    ["Semestre", "S1"],
    ["Année universitaire", "2025 — 2026"],
    ["Durée de l'épreuve", "· · · · · · · ·"],
    ["Nombre de pages", "· · · · · · · ·"],
  ];

  return (
    <article className="specimen" aria-label="Fiche d'épreuve — formulaire spécimen du registre">
      <div className="specimen-punch" aria-hidden="true" />

      <header className="specimen-head">
        <p className="specimen-univ">Université d&apos;Abomey-Calavi</p>
        <p className="specimen-registre">Registre des épreuves</p>
        <span className="specimen-stamp" aria-hidden="true">
          Spécimen
        </span>
      </header>

      <dl className="specimen-fields">
        {fields.map(([label, value]) => (
          <div className="specimen-field" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <footer className="specimen-foot">
        <span className="specimen-code">UAC — REG / 2025-2026</span>
        <Link href="/dashboard/epreuves" className="specimen-link">
          Ouvrir le registre <span aria-hidden="true">→</span>
        </Link>
      </footer>

      <p className="specimen-note">
        Formulaire du registre. Aucune épreuve n&apos;est encore déposée : la bibliothèque ouvrira
        avec ses premiers fichiers.
      </p>
    </article>
  );
}
