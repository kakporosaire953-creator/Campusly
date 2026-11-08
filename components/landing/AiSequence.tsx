import Image from "next/image";
import { FragQuiz } from "@/components/landing/AppFragments";

/**
 * Séquence Campusly AI — section signature.
 * ---------------------------------------------------------------------------
 * Quatre temps : le support → les notions → les questions → l'entraînement.
 * Les panneaux reprennent la structure réelle du parcours (voir
 * `services/aiService.ts` et l'écran /dashboard/revision) mais restent des
 * APERÇUS : les valeurs sont en pointillés, aucune question n'est inventée.
 *
 * L'analyse de document n'étant pas encore ouverte, la section l'annonce
 * explicitement sous la séquence. Rien ici ne prétend être disponible.
 */

const STEPS = [
  {
    num: "01",
    label: "Support",
    title: "Un document entre",
    text: "Cours magistral, TD, épreuve ou notes personnelles — le format que vous avez déjà sous la main.",
  },
  {
    num: "02",
    label: "Notions",
    title: "Les concepts sont isolés",
    text: "Définitions, théorèmes, méthodes et exemples : la structure pédagogique du document est dégagée.",
  },
  {
    num: "03",
    label: "Questions",
    title: "Des exercices sont proposés",
    text: "QCM, vrai/faux ou question ouverte, selon ce que vous voulez travailler.",
  },
  {
    num: "04",
    label: "Entraînement",
    title: "Vous relisez, puis vous lancez",
    text: "Chaque question reste modifiable. La correction locale est signalée comme non officielle.",
  },
];

const CONCEPTS = ["Définition", "Théorème", "Méthode", "Exemple"];
const FORMATS = [
  { name: "QCM", detail: "quatre propositions, une réponse" },
  { name: "Vrai / Faux", detail: "justification attendue" },
  { name: "Question ouverte", detail: "réponse rédigée, corrigée à la main" },
];

export function AiSequence() {
  return (
    <div className="ai-seq">
      <ol className="ai-rail" data-anim="rail">
        {STEPS.map((step) => (
          <li className="ai-rail__item" key={step.num} data-ai-step>
            <span className="ai-rail__num" aria-hidden="true">
              {step.num}
            </span>
            <span className="ai-rail__label">{step.label}</span>
            <span className="ai-rail__line" aria-hidden="true" />
          </li>
        ))}
      </ol>

      <div className="ai-panels">
        <article className="ai-panel" data-ai-panel>
          <div className="ai-panel__head">
            <span className="ai-panel__num" aria-hidden="true">
              01
            </span>
            <h3>{STEPS[0].title}</h3>
          </div>
          <p className="ai-panel__text">{STEPS[0].text}</p>

          <div className="ai-panel__visual">
            <div className="ai-sheet" aria-hidden="true">
              <span className="ai-sheet__title" />
              <span className="ai-sheet__line" />
              <span className="ai-sheet__line is-short" />
              <span className="ai-sheet__line" />
              <span className="ai-sheet__line is-shorter" />
            </div>
            <figure className="ai-photo" data-anim="frame">
              <Image
                src="/images/notes-desk.jpg"
                alt="Notes de cours manuscrites et polycopiés posés sur un bureau"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 40vw, 18vw"
                className="ai-photo__img"
              />
            </figure>
          </div>
          <p className="ai-panel__caption">Aperçu d&apos;interface — les valeurs restent à renseigner.</p>
        </article>

        <article className="ai-panel" data-ai-panel>
          <div className="ai-panel__head">
            <span className="ai-panel__num" aria-hidden="true">
              02
            </span>
            <h3>{STEPS[1].title}</h3>
          </div>
          <p className="ai-panel__text">{STEPS[1].text}</p>
          <ul className="ai-concepts">
            {CONCEPTS.map((concept) => (
              <li key={concept}>
                {concept}
                <span aria-hidden="true">· · ·</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="ai-panel" data-ai-panel>
          <div className="ai-panel__head">
            <span className="ai-panel__num" aria-hidden="true">
              03
            </span>
            <h3>{STEPS[2].title}</h3>
          </div>
          <p className="ai-panel__text">{STEPS[2].text}</p>
          <ul className="ai-formats">
            {FORMATS.map((format) => (
              <li key={format.name}>
                <span className="ai-formats__name">{format.name}</span>
                <span className="ai-formats__detail">{format.detail}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="ai-panel ai-panel--quiz" data-ai-panel>
          <div className="ai-panel__head">
            <span className="ai-panel__num" aria-hidden="true">
              04
            </span>
            <h3>{STEPS[3].title}</h3>
          </div>
          <p className="ai-panel__text">{STEPS[3].text}</p>
          <FragQuiz className="ai-panel__frag" />
        </article>
      </div>

      <p className="ai-seq__status" data-reveal>
        <strong>État réel :</strong> l&apos;analyse de document n&apos;est pas encore ouverte. Les
        formats décrits ci-dessus sont ceux du parcours prévu ; en attendant, la banque
        d&apos;exercices et les modes d&apos;entraînement restent utilisables, avec une correction
        locale explicitement non officielle.
      </p>
    </div>
  );
}
