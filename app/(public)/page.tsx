import type { Metadata } from "next";
import Link from "next/link";
import { FACULTIES } from "@/types";
import { FaqSection } from "@/components/shared/FaqSection";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { HeroComposition } from "@/components/landing/HeroComposition";
import { StudyFlow } from "@/components/landing/StudyFlow";

export const metadata: Metadata = {
  title: "Campusly — Ressources, révision et évaluations à l'UAC",
  description:
    "Campusly réunit les ressources académiques, les espaces de cours et les outils de révision des étudiants et enseignants de l'Université d'Abomey-Calavi.",
};

/** Piliers secondaires : traités en lignes éditoriales, pas en cartes identiques. */
const PILLARS = [
  {
    index: "02",
    title: "Campusly AI",
    description:
      "Vos cours, TD et fiches deviennent des questions de révision, relues et corrigées par vous avant l'entraînement.",
    href: "/dashboard/revision",
    cta: "Voir le moteur de révision",
  },
  {
    index: "03",
    title: "Cinq modes d'entraînement",
    description:
      "QCM chronométré, questions-réponses, vrai/faux express, résumé pédagogique ou marathon adaptatif.",
    href: "/dashboard/revision",
    cta: "Découvrir les modes",
  },
  {
    index: "04",
    title: "Classrooms et amphis",
    description:
      "Les enseignants créent leurs classes, partagent les supports et suivent les rendus ; les étudiants rejoignent avec un code.",
    href: "/dashboard/classrooms",
    cta: "Ouvrir les Classrooms",
  },
  {
    index: "05",
    title: "Compositions",
    description:
      "Épreuves chronométrées, remise d'une copie et correction validée par l'enseignant.",
    href: "/dashboard/compositions",
    cta: "Voir les compositions",
  },
  {
    index: "06",
    title: "Progression",
    description:
      "Repères de révision par matière pour savoir où porter l'effort avant l'examen.",
    href: "/dashboard",
    cta: "Ouvrir le tableau de bord",
  },
];

const AI_STEPS = [
  { num: "01", title: "Importer un support", text: "Cours magistral, TD, épreuve ou notes personnelles." },
  { num: "02", title: "Extraire les concepts", text: "Les notions structurantes du document sont dégagées." },
  { num: "03", title: "Choisir les formats", text: "QCM, vrai/faux ou questions ouvertes, selon l'objectif." },
  { num: "04", title: "Relire puis s'entraîner", text: "Chaque question est modifiable avant le lancement." },
];

const PROGRESSION = [
  {
    index: "Étape 01",
    title: "Un premier entraînement",
    text: "Vous choisissez une matière et un mode. Les questions portent sur le support que vous avez fourni.",
  },
  {
    index: "Étape 02",
    title: "Les notions à revoir",
    text: "Les questions manquées sont regroupées par notion, pas par question : c'est le concept qui est retravaillé.",
  },
  {
    index: "Étape 03",
    title: "L'entraînement suivant",
    text: "La sélection suivante met l'accent sur ces notions, jusqu'à ce qu'elles soient stabilisées.",
  },
];

const TEACHER_FEATURES = [
  { num: "01", text: "Création d'une classe et code d'amphi à transmettre aux étudiants." },
  { num: "02", text: "Dépôt des supports de cours et des sujets d'interrogation." },
  { num: "03", text: "Suivi des rendus et repérage des étudiants en difficulté." },
];

const STAGE_ROWS = [
  { title: "Classe créée", text: "L'enseignant ouvre un espace d'amphi et choisit la matière." },
  { title: "Code partagé", text: "Les étudiants rejoignent la classe avec le code transmis en cours." },
  { title: "Rendus suivis", text: "Devoirs, compositions et corrections restent dans un même espace." },
];

const COMPOSITIONS = [
  { index: "01", title: "Durée et chronomètre", text: "Un temps imparti, affiché pendant toute l'épreuve." },
  { index: "02", title: "Salle d'examen dédiée", text: "Un espace plein écran, distinct du reste de la plateforme." },
  { index: "03", title: "Correction assistée", text: "Des outils d'aide à la correction, la décision restant à l'enseignant." },
  { index: "04", title: "Copie personnelle", text: "Chaque étudiant retrouve sa copie et les commentaires reçus." },
];

export default function HomePage() {
  return (
    <LandingMotion>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow" data-hero-eyebrow>
              Plateforme académique · Université d&apos;Abomey-Calavi
            </p>

            <h1 className="hero-title">
              <span className="hero-line">
                <span data-hero-line>L&apos;université demande</span>
              </span>
              <span className="hero-line">
                <span data-hero-line>assez d&apos;efforts.</span>
              </span>
              <span className="hero-line hero-line-accent">
                <span data-hero-line>Pas besoin de multiplier les outils.</span>
              </span>
            </h1>

            <p className="hero-sub" data-hero-body>
              Campusly réunit les ressources académiques, les espaces de cours et les outils de
              révision dans un environnement pensé pour les étudiants et les enseignants de
              l&apos;UAC.
            </p>

            <div className="hero-actions" data-hero-body>
              <a href="#piliers" className="btn btn-primary btn-lg">
                Découvrir Campusly
              </a>
              <Link href="/auth?tab=register" className="btn btn-outline btn-lg">
                Créer un compte
              </Link>
            </div>

            <p className="hero-note" data-hero-body>
              Ressources, révision et évaluations dans une seule interface.
            </p>
          </div>

          <div className="hero-visual" data-hero-visual>
            <HeroComposition />
          </div>
        </div>
      </section>

      {/* ─────────────────────── PILIERS ─────────────────────── */}
      <section className="section landing-section" id="piliers">
        <div className="section-center landing-head" data-reveal>
          <span className="section-tag">Ce que Campusly couvre</span>
          <h2 className="section-title">
            Tout votre parcours <span>académique</span>
          </h2>
          <p className="section-desc">
            Des ressources de révision aux évaluations, sans changer d&apos;outil ni ressaisir vos
            cours.
          </p>
        </div>

        <div className="pillars">
          <article className="pillar-feature" data-reveal>
            <span className="pillar-feature-index">01 — LE CŒUR DE LA PLATEFORME</span>
            <h3>Épreuves et annales, classées comme vos maquettes</h3>
            <p>
              Les sujets sont rangés par faculté, département, niveau, semestre et année
              universitaire : la même logique que vos emplois du temps, pour retrouver un sujet sans
              fouiller.
            </p>
            <ul className="pillar-feature-list">
              <li>Recherche par matière, titre ou mot-clé</li>
              <li>Filtres par faculté, niveau, semestre et année</li>
              <li>Fiches détaillées et documents liés au programme</li>
            </ul>
            <Link href="/dashboard/epreuves" className="btn btn-primary">
              Ouvrir la bibliothèque
            </Link>
          </article>

          <ol className="pillar-rows" data-stagger>
            {PILLARS.map((pillar) => (
              <li className="pillar-row" key={pillar.index}>
                <span className="pillar-row-index" aria-hidden="true">
                  {pillar.index}
                </span>
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                  <Link href={pillar.href} className="pillar-row-link">
                    {pillar.cta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ────────────────────── CAMPUSLY AI ──────────────────── */}
      <section className="section landing-section" id="campusly-ai">
        <div className="ai-grid">
          <div data-reveal>
            <span className="section-tag">Moteur pédagogique</span>
            <h2 className="section-title" style={{ textAlign: "left", marginTop: 12 }}>
              Vos cours deviennent <span>des questions.</span>
            </h2>
            <p className="section-desc" style={{ margin: "0 0 4px", textAlign: "left" }}>
              Un support de cours entre, des exercices sortent. Rien d&apos;automatique dans ce que
              vous révisez : vous validez chaque question.
            </p>

            <ol className="ai-steps">
              {AI_STEPS.map((step) => (
                <li className="ai-step" key={step.num}>
                  <span className="ai-step-num" aria-hidden="true">
                    {step.num}
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            <p className="ai-status">
              Ouverture progressive : l&apos;analyse de document n&apos;est pas encore disponible. En attendant,
              la banque d&apos;exercices permet déjà de s&apos;entraîner, avec une correction locale non officielle.
            </p>

            <p className="ai-assurance">
              <strong>Vos documents restent privés.</strong> Ils ne sont ni publiés ni partagés sans
              votre accord, et ne servent qu&apos;à produire vos entraînements.
            </p>
          </div>

          <div data-reveal data-parallax data-parallax-depth="10">
            <StudyFlow />
          </div>
        </div>
      </section>

      {/* ─────────────────────── PROGRESSION ─────────────────── */}
      <section
        className="section landing-section"
        id="progression"
        style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="section-center landing-head" data-reveal>
          <span className="section-tag">Révision ciblée</span>
          <h2 className="section-title">
            Ne révisez pas tout. Révisez ce qui <span>bloque encore.</span>
          </h2>
          <p className="section-desc">
            Plutôt que de relire un polycopié du début à la fin, vous retravaillez les notions qui
            vous ont fait perdre des points.
          </p>
        </div>

        <div className="progression-grid" data-stagger>
          {PROGRESSION.map((step) => (
            <article className="progression-step" key={step.index}>
              <span className="progression-index">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <p className="progression-note" data-reveal>
          Vos statistiques personnelles apparaîtront dans votre espace après votre premier
          entraînement. Aucun chiffre n&apos;est affiché ici tant que vous n&apos;avez pas révisé.
        </p>
      </section>

      {/* ─────────────────────── ENSEIGNANTS ─────────────────── */}
      <section className="section landing-section" id="professeurs">
        <div className="teachers-grid">
          <div data-reveal>
            <span className="section-tag">Espace enseignants</span>
            <h2 className="section-title" style={{ textAlign: "left", marginTop: 12 }}>
              Un centre de pilotage <span>pour vos amphis.</span>
            </h2>
            <p className="section-desc" style={{ margin: "0 0 4px", textAlign: "left" }}>
              Créez votre classe, déposez vos supports, suivez les rendus. Campusly ne remplace pas
              votre pédagogie : il vous évite la dispersion entre messagerie, fichiers et tableurs.
            </p>

            <ul className="teachers-list">
              {TEACHER_FEATURES.map((item) => (
                <li key={item.num}>
                  <span aria-hidden="true">{item.num}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            <Link href="/dashboard/classrooms" className="btn btn-primary">
              Découvrir les Classrooms
            </Link>
          </div>

          <div className="stage-panel" data-reveal data-parallax data-parallax-depth="8">
            <span className="stage-panel-label">Déroulé d&apos;une classe</span>
            {STAGE_ROWS.map((row) => (
              <div className="stage-row" key={row.title}>
                <span className="stage-dot" aria-hidden="true" />
                <div>
                  <strong>{row.title}</strong>
                  <span>{row.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── COMPOSITIONS ────────────────── */}
      <section
        className="section landing-section"
        id="compositions"
        style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="section-center landing-head" data-reveal>
          <span className="section-tag">Évaluations</span>
          <h2 className="section-title">
            Évaluer à distance, <span>sans perdre le contrôle.</span>
          </h2>
          <p className="section-desc">
            Des compositions d&apos;amphi et des examens blancs, corrigés puis validés par
            l&apos;enseignant.
          </p>
        </div>

        <ul className="compo-list" data-stagger>
          {COMPOSITIONS.map((item) => (
            <li className="compo-item" key={item.index}>
              <span className="compo-index" aria-hidden="true">
                {item.index}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="compo-actions">
          <Link href="/dashboard/compositions" className="btn btn-primary">
            Accéder aux compositions
          </Link>
        </div>
      </section>

      {/* ────────────────────── ÉTABLISSEMENTS ───────────────── */}
      <section className="section landing-section" id="etablissements">
        <div className="institutions" data-reveal>
          <div>
            <span className="section-tag">Enseignement supérieur</span>
            <h2>Une plateforme pour vos promotions.</h2>
            <p>
              Facultés, écoles d&apos;ingénieurs et instituts de l&apos;UAC peuvent déployer
              Campusly comme espace commun de ressources, d&apos;évaluations et de suivi.
            </p>
            <Link href="/a-propos#contact" className="btn btn-primary">
              Nous contacter
            </Link>
          </div>
          <div>
            <span className="stage-panel-label" style={{ paddingBottom: 12 }}>
              Facultés et instituts concernés
            </span>
            <ul className="faculty-list" aria-label="Facultés et instituts de l'UAC">
              {FACULTIES.map((faculty) => (
                <li key={faculty.code}>{faculty.code}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ─────────────────── CRÉDITS & TARIFS ────────────────── */}
      <section className="section landing-section" id="credits">
        <div className="credits-band" data-reveal>
          <p>
            <strong>Crédits &amp; paiements.</strong> Les packs de crédits et les moyens de paiement
            (Mobile Money, carte bancaire) ne sont pas encore ouverts. Les tarifs seront publiés
            avant l&apos;activation des paiements.
          </p>
          <Link href="/a-propos#contact" className="btn btn-outline btn-sm">
            Être informé de l&apos;ouverture
          </Link>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="cta-section">
        <h2 className="cta-title">Commencez par vos propres cours.</h2>
        <p className="cta-desc">
          Créez votre compte et commencez par les exercices d&apos;entraînement ou la bibliothèque
          d&apos;épreuves. Les autres services ouvriront au fur et à mesure.
        </p>
        <div className="cta-actions" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth?tab=register" className="btn btn-primary btn-lg">
            Créer un compte
          </Link>
          <a href="#piliers" className="btn btn-outline btn-lg">
            Découvrir Campusly
          </a>
        </div>
      </section>
    </LandingMotion>
  );
}
