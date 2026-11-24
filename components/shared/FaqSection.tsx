"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/motion/Icon";
import { Marker } from "@/components/editorial/Chapter";

const CATEGORIES = [
  { id: "all", label: "Toutes" },
  { id: "ai", label: "Campusly AI" },
  { id: "learning", label: "Apprentissage" },
  { id: "teachers", label: "Professeurs" },
  { id: "compositions", label: "Compositions" },
  { id: "credits", label: "Crédits" },
  { id: "privacy", label: "Confidentialité" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const FAQ_ITEMS: Array<{
  id: string;
  category: Exclude<CategoryId, "all">;
  question: string;
  answer: string;
}> = [
  {
    id: "q1",
    category: "ai",
    question: "Comment fonctionne la génération de quiz avec Campusly AI ?",
    answer:
      "Vous importez votre support (cours, TD, épreuve ou notes). Campusly AI en extrait la structure pédagogique, dégage les concepts fondamentaux et formule des questions (QCM, Q/R, Vrai/Faux) avec corrections et justifications. Vous pouvez relire, modifier ou régénérer chaque question avant de lancer l'exercice. L'analyse de document n'est pas encore ouverte sur cette version : elle est annoncée comme telle sur la page d'accueil.",
  },
  {
    id: "q2",
    category: "learning",
    question: "Qu'est-ce que le Marathon Adaptatif ?",
    answer:
      "Le Marathon Adaptatif cible en priorité les notions où votre taux de réussite nécessite un renforcement. Le moteur vous soumet de nouvelles questions progressives jusqu'à ce que votre score atteigne le palier de maîtrise.",
  },
  {
    id: "q3",
    category: "teachers",
    question: "Comment un enseignant peut-il créer une classe amphi et suivre ses apprenants ?",
    answer:
      "Lors de l'inscription, sélectionnez « Je suis professeur ». Vous accédez au panneau de création de classe, recevez un code d'invitation à transmettre à vos étudiants, et profitez du centre de pilotage avec alertes pédagogiques automatiques.",
  },
  {
    id: "q4",
    category: "compositions",
    question: "Comment se déroule la surveillance des compositions en ligne ?",
    answer:
      "La salle de composition active un compte à rebours strict, un mode plein écran et consigne les changements d'onglets. Les événements restent sur l'appareil et sont revus par l'enseignant avant validation de la note : aucune sanction n'est automatique.",
  },
  {
    id: "q5",
    category: "credits",
    question: "À quoi servent les Campusly Credits ?",
    answer:
      "Les crédits financeront les analyses de documents, la génération de quiz et certains téléchargements d'épreuves. Le paiement n'est pas encore ouvert : aucun pack n'est vendu, aucune carte ni aucun Mobile Money n'est débité, et l'accès aux exercices reste libre.",
  },
  {
    id: "q6",
    category: "privacy",
    question: "Que deviennent mes documents importés ?",
    answer:
      "Vos documents restent privés. Ils ne sont jamais publiés sans votre autorisation et ne sont utilisés que pour produire vos entraînements. La politique de confidentialité détaille les durées de conservation et vos droits. Dans cette version de préfiguration, tout reste sur votre appareil.",
  },
  {
    id: "q7",
    category: "teachers",
    question: "Comment obtenir le statut « Enseignant vérifié » ?",
    answer:
      "La vérification est réalisée par le secrétariat académique après dépôt d'une attestation de fonction. Le statut conditionne la création de classrooms et la publication de compositions.",
  },
];

/**
 * Questions fréquentes — chapitre 09.
 * ---------------------------------------------------------------------------
 * Présentation compacte et éditoriale : une liste numérotée, un filtre en
 * capitales, et `<details>` natifs. Rien n'est caché derrière du JavaScript :
 * sans script, chaque réponse s'ouvre normalement.
 *
 * Le contenu est celui de la version précédente, à la formulation près ; il
 * continue de signaler les fonctions encore fermées (analyse de document,
 * paiement).
 *
 * L'animation de hauteur (reprise du vocabulaire Kraken) est conservée dans
 * `MotionScope` via `data-faq-row` : le panneau glisse, la question qui
 * traverse le centre de l'écran s'ouvre d'elle-même.
 */
export function FaqSection() {
  const [category, setCategory] = useState<CategoryId>("all");

  const items = useMemo(
    () => (category === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category)),
    [category],
  );

  return (
    <section className="ed-rail faq-ed" id="faq" aria-labelledby="faq-title">
      <header className="faq-ed__head">
        <p className="ed-eyebrow">
          <span className="ed-num">09</span>
          <span>Questions fréquentes</span>
        </p>
        <h2 className="ed-display faq-ed__title" id="faq-title" data-reveal>
          Ce qu&apos;on nous demande <em>le plus souvent.</em>
        </h2>
        <p className="ed-note faq-ed__note">
          {FAQ_ITEMS.length} questions · {CATEGORIES.length - 1} thèmes. Les fonctions encore
          fermées sont signalées comme telles, ici comme sur le reste de la page.
        </p>
      </header>

      <div className="faq-ed__body">
        <div className="faq-ed__filters" role="group" aria-label="Filtrer les questions par thème">
          {CATEGORIES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`faq-ed__chip ${category === entry.id ? "is-active" : ""}`}
              aria-pressed={category === entry.id}
              onClick={() => setCategory(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="faq-ed__list" data-hover-root>
          {items.map((item, index) => (
            <details key={item.id} className="faq-ed__row" data-faq-row>
              <summary>
                <span className="faq-ed__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="faq-ed__question">{item.question}</span>
                <span className="faq-ed__sign" aria-hidden="true" />
              </summary>
              <div className="faq-ed__panel">
                <p className="faq-ed__answer">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="faq-ed__more">
        <Marker num="↳">Une question qui n&apos;est pas ici&nbsp;?</Marker>
        <a href="/a-propos#contact" className="ed-link">
          Écrire à l&apos;équipe
          <Icon name="arrow-right" size={15} />
        </a>
      </div>
    </section>
  );
}
