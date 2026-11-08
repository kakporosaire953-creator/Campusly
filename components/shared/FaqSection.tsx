"use client";

import { useMemo, useState } from "react";
import { SectionHead } from "@/components/landing/SectionHead";

const CATEGORIES = [
  { id: "all", label: "Toutes" },
  { id: "ai", label: "Campusly AI" },
  { id: "learning", label: "Apprentissage" },
  { id: "teachers", label: "Professeurs & Classrooms" },
  { id: "compositions", label: "Compositions" },
  { id: "credits", label: "Crédits & Paiement" },
  { id: "privacy", label: "Confidentialité" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const FAQ_ITEMS: Array<{ id: string; category: Exclude<CategoryId, "all">; question: string; answer: string }> = [
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
 * FAQ — chapitre 08 de l'accueil.
 * Le contenu est celui de l'ancienne page d'accueil ; seuls la mise en page et
 * les mentions d'état ont été reprises pour rester alignées sur ce qui est
 * réellement disponible (paiement fermé, analyse de document non ouverte).
 *
 * Accessibilité : accordéons natifs `<details>` (clavier et lecteurs d'écran
 * gratuits), filtre en `<button aria-pressed>`, questions numérotées pour
 * annoncer le nombre de réponses.
 */
export function FaqSection() {
  const [category, setCategory] = useState<CategoryId>("all");

  const items = useMemo(
    () => (category === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category)),
    [category],
  );

  return (
    <section className="section faq" id="faq">
      <SectionHead
        index="08"
        label="Questions fréquentes"
        title={
          <>
            Ce qu&apos;on nous demande <em>le plus souvent.</em>
          </>
        }
        note={`${FAQ_ITEMS.length} questions · ${CATEGORIES.length - 1} thèmes`}
      >
        Réponses décrivant les fonctions de la plateforme. Les fonctions encore fermées sont
        signalées comme telles, ici comme sur le reste de la page.
      </SectionHead>

      <div className="faq__filters" role="group" aria-label="Filtrer les questions par thème">
        {CATEGORIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`faq__chip ${category === entry.id ? "is-active" : ""}`}
            aria-pressed={category === entry.id}
            onClick={() => setCategory(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="faq__list">
        {items.map((item, index) => (
          <details key={item.id} className="faq__item">
            <summary>
              <span className="faq__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="faq__question">{item.question}</span>
              <span className="faq__sign" aria-hidden="true" />
            </summary>
            <p className="faq__answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
