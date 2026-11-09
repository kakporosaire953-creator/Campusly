"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHead } from "@/components/landing/SectionHead";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "@/components/motion/Icon";

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
 * ---------------------------------------------------------------------------
 * Le contenu est celui de l'ancienne page d'accueil ; seuls la mise en page et
 * les mentions d'état ont été reprises pour rester alignées sur ce qui est
 * réellement disponible (paiement fermé, analyse de document non ouverte).
 *
 * Animation (reprise de l'accordéon du site Kraken) :
 *  - la hauteur du panneau est animée par GSAP, ouverture en `back.out` ;
 *  - la question qui traverse le centre de l'écran s'ouvre seule au défilement ;
 *  - pendant 2,5 s après un clic, l'ouverture automatique est suspendue pour ne
 *    pas reprendre la main sur un choix explicite ;
 *  - `prefers-reduced-motion` : aucune animation, `<details>` se comporte
 *    nativement (aucun JavaScript requis pour lire une réponse).
 *
 * Accessibilité : `<details>`/`<summary>` natifs (clavier, lecteurs d'écran),
 * filtre en `<button aria-pressed>`, questions numérotées.
 */
export function FaqSection() {
  const [category, setCategory] = useState<CategoryId>("all");
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDetailsElement | null>>({});
  const manualUntil = useRef(0);

  const items = useMemo(
    () => (category === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category)),
    [category],
  );

  /** Ouvre ou ferme une ligne en animant la hauteur du panneau. */
  const setRow = (id: string | null, animate = true) => {
    const smooth = animate && !prefersReducedMotion();
    Object.entries(rowRefs.current).forEach(([rowId, details]) => {
      if (!details) return;
      const panel = details.querySelector<HTMLElement>(".faq__panel");
      const shouldOpen = rowId === id;
      if (!panel) {
        details.open = shouldOpen;
        return;
      }
      gsap.killTweensOf(panel);
      if (shouldOpen) {
        details.open = true;
        if (!smooth) {
          gsap.set(panel, { height: "auto", autoAlpha: 1 });
          return;
        }
        const height = panel.scrollHeight;
        gsap.fromTo(
          panel,
          { height: 0, autoAlpha: 0 },
          {
            height,
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            onComplete: () => {
              gsap.set(panel, { height: "auto" });
              ScrollTrigger.refresh();
            },
          },
        );
      } else {
        if (!details.open) return;
        if (!smooth) {
          details.open = false;
          gsap.set(panel, { height: 0, autoAlpha: 0 });
          return;
        }
        gsap.to(panel, {
          height: 0,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => {
            details.open = false;
            gsap.set(panel, { height: 0 });
            ScrollTrigger.refresh();
          },
        });
      }
    });
  };

  /* Première ligne ouverte à l'arrivée, puis cascade des lignes à chaque filtre. */
  useGSAP(
    () => {
      setRow(items[0]?.id ?? null, false);
      if (prefersReducedMotion()) return;
      gsap.from(Object.values(rowRefs.current).filter(Boolean), {
        y: 18,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { scope: listRef, dependencies: [items], revertOnUpdate: true },
  );

  /* Ouverture automatique de la question qui passe au centre de l'écran. */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const triggers = items
        .map((item) => {
          const row = rowRefs.current[item.id];
          if (!row) return null;
          return ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            end: "bottom 38%",
            onToggle: (self) => {
              if (!self.isActive || Date.now() < manualUntil.current) return;
              setRow(item.id);
            },
          });
        })
        .filter((trigger): trigger is ScrollTrigger => trigger !== null);
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: listRef, dependencies: [items], revertOnUpdate: true },
  );

  useEffect(() => {
    // Nettoyage des références quand le filtre retire des lignes.
    const ids = new Set(items.map((item) => item.id));
    Object.keys(rowRefs.current).forEach((id) => {
      if (!ids.has(id)) delete rowRefs.current[id];
    });
  }, [items]);

  const onToggle = (id: string, event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return; // comportement natif, aucune animation
    event.preventDefault();
    const details = rowRefs.current[id];
    const willOpen = !details?.open;
    manualUntil.current = Date.now() + 2500;
    setRow(willOpen ? id : null);
  };

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

      <div className="faq__list" ref={listRef} data-hover-root>
        {items.map((item, index) => (
          <details
            key={item.id}
            className="faq__item"
            data-faq-row
            ref={(node) => {
              rowRefs.current[item.id] = node;
            }}
          >
            <summary onClick={(event) => onToggle(item.id, event)}>
              <span className="faq__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="faq__question">{item.question}</span>
              <span className="faq__sign" aria-hidden="true" />
            </summary>
            <div className="faq__panel">
              <p className="faq__answer">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <p className="faq__more">
        <a href="/a-propos#contact">
          Une question qui n&apos;est pas ici ?
          <Icon name="arrow-right" size={15} />
        </a>
      </p>
    </section>
  );
}
