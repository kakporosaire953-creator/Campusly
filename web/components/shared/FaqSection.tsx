"use client";

import { useMemo, useState } from "react";

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
      "Vous importez votre support (cours, TD, épreuve ou notes). Campusly AI en extrait la structure pédagogique, dégage les concepts fondamentaux et formule des questions (QCM, Q/R, Vrai/Faux) avec corrections et justifications. Vous pouvez relire, modifier ou régénérer chaque question avant de lancer l'exercice.",
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
      "La salle de composition active un compte à rebours strict, un mode plein écran et consigne les changements d'onglets. Les événements sont revus par l'enseignant avant validation de la note : aucune sanction n'est automatique.",
  },
  {
    id: "q5",
    category: "credits",
    question: "À quoi servent les Campusly Credits ?",
    answer:
      "Les crédits financent les analyses de documents, la génération de quiz et certains téléchargements d'épreuves premium. Ils se rechargent par packs via Mobile Money ou carte bancaire (FedaPay).",
  },
  {
    id: "q6",
    category: "privacy",
    question: "Que deviennent mes documents importés ?",
    answer:
      "Vos documents restent privés. Ils ne sont jamais publiés sans votre autorisation et ne sont utilisés que pour produire vos entraînements. La politique de confidentialité détaille les durées de conservation et vos droits.",
  },
  {
    id: "q7",
    category: "teachers",
    question: "Comment obtenir le statut « Enseignant vérifié » ?",
    answer:
      "La vérification est réalisée par le secrétariat académique après dépôt d'une attestation de fonction. Le statut conditionne la création de classrooms et la publication de compositions.",
  },
];

/** FAQ filtrable — même comportement que l'ancienne page d'accueil. */
export function FaqSection() {
  const [category, setCategory] = useState<CategoryId>("all");

  const items = useMemo(
    () => (category === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category)),
    [category],
  );

  return (
    <section className="section" id="faq" style={{ padding: "70px 5%", maxWidth: 1100, margin: "0 auto" }}>
      <div className="section-center">
        <span className="section-tag">Support &amp; FAQ</span>
        <h2 className="section-title">
          Questions <span>fréquentes</span>
        </h2>
        <p className="section-desc">
          Toutes les réponses pour maîtriser Campusly en tant qu&apos;étudiant ou enseignant.
        </p>
      </div>

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 28 }}
        role="group"
        aria-label="Filtrer les questions par thème"
      >
        {CATEGORIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`faq-category-btn ${category === entry.id ? "active" : ""}`}
            aria-pressed={category === entry.id}
            onClick={() => setCategory(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }} id="faqList">
        {items.map((item) => (
          <details key={item.id} className="faq-item" style={{ padding: "18px 20px" }}>
            <summary
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-1)",
                cursor: "pointer",
                listStyle: "none",
              }}
            >
              {item.question}
            </summary>
            <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.65, margin: "10px 0 0" }}>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
