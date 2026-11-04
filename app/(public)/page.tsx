import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACULTIES } from "@/types";
import { FaqSection } from "@/components/shared/FaqSection";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { ChapterHeader } from "@/components/landing/ChapterHeader";
import { SpecimenCard } from "@/components/landing/SpecimenCard";
import { StudyFlow } from "@/components/landing/StudyFlow";
import { Ticker } from "@/components/landing/Ticker";

export const metadata: Metadata = {
  title: "Campusly — Le registre académique de l'UAC",
  description:
    "Épreuves classées par maquette, révision assistée et compositions : Campusly réunit les ressources académiques des étudiants et enseignants de l'Université d'Abomey-Calavi.",
};

const AI_STEPS = [
  { num: "01", title: "Déposer un support", text: "Cours magistral, TD, épreuve ou notes personnelles." },
  { num: "02", title: "Dégager les notions", text: "Les concepts structurants du document sont isolés." },
  { num: "03", title: "Choisir les formats", text: "QCM, vrai/faux ou question ouverte, selon l'objectif." },
  { num: "04", title: "Relire avant de lancer", text: "Chaque question est modifiable avant l'entraînement." },
];

const PROGRESSION = [
  {
    index: "I",
    title: "Un premier entraînement",
    text: "Une matière, un mode. Les questions portent sur le support que vous avez fourni.",
  },
  {
    index: "II",
    title: "Les notions à revoir",
    text: "Les erreurs sont regroupées par notion, pas par question : c'est le concept qui est retravaillé.",
  },
  {
    index: "III",
    title: "L'entraînement suivant",
    text: "La sélection suivante insiste sur ces notions, jusqu'à ce qu'elles tiennent.",
  },
];

const TEACHER_ROWS = [
  { num: "01", text: "Création d'une classe et code d'amphi à transmettre aux étudiants." },
  { num: "02", text: "Dépôt des supports de cours et des sujets d'interrogation." },
  { num: "03", text: "Suivi des rendus et repérage des étudiants en difficulté." },
];

const COMPOSITIONS = [
  { index: "01", title: "Durée et chronomètre", text: "Un temps imparti, affiché pendant toute l'épreuve." },
  { index: "02", title: "Salle dédiée", text: "Un espace plein écran, distinct du reste de la plateforme." },
  { index: "03", title: "Correction assistée", text: "Des outils d'aide à la correction, la décision restant à l'enseignant." },
  { index: "04", title: "Copie personnelle", text: "Chaque étudiant retrouve sa copie et les commentaires reçus." },
];

const INDEX_COLUMNS = ["Matière", "Faculté", "Niveau", "Semestre", "Année", "Statut"];

export default function HomePage() {
  return (
    <LandingMotion>
      <div className="registre">
        {/* ─────────────── BANDEAU DE TÊTE (masthead) ─────────────── */}
        <div className="masthead">
          <p className="masthead-title">
            Registre académique · <span>Université d&apos;Abomey-Calavi</span>
          </p>
          <p className="masthead-edition">Édition 2025 — 2026</p>
        </div>

        {/* ───────────────────── COUVERTURE ──────────────────────── */}
        <section className="cover" id="hero">
          <div className="cover-text">
            <h1 className="cover-title">
              <span className="cover-line">
                <span data-hero-line>L&apos;université demande</span>
              </span>
              <span className="cover-line">
                <span data-hero-line>assez d&apos;efforts.</span>
              </span>
              <span className="cover-line cover-line-accent">
                <span data-hero-line>Pas besoin de multiplier les outils.</span>
              </span>
            </h1>

            <p className="cover-lede" data-hero-body>
              Épreuves, cours et révisions dans un seul registre. Campusly range les ressources de
              l&apos;UAC comme vos maquettes les rangent déjà : par faculté, par niveau, par semestre.
            </p>

            <div className="cover-actions" data-hero-body>
              <a href="#epreuves" className="btn btn-primary btn-lg">
                Ouvrir le registre
              </a>
              <Link href="/auth?tab=register" className="btn btn-outline btn-lg">
                Créer un compte
              </Link>
            </div>

            <p className="cover-annotation" data-hero-body>
              Inscription libre · Aucun frais demandé · Ressources accessibles sans compte
            </p>
          </div>

          <div className="cover-plate" data-hero-visual>
            <SpecimenCard />
          </div>
        </section>

        <Ticker />

        {/* ─────────────────── 01 — ÉPREUVES ─────────────────────── */}
        <section className="chapter-block" id="epreuves">
          <ChapterHeader
            index="01"
            label="Épreuves"
            title={
              <>
                Un sujet se retrouve <em>en trois secondes</em>, pas en trois onglets.
              </>
            }
            note={`${FACULTIES.length} facultés · L1 → M2 · S1 → S2`}
          >
            Recherche par matière ou mot-clé, puis filtres par faculté, département, niveau, semestre
            et année universitaire.
          </ChapterHeader>

          <div className="index-wrap" data-anim="index">
            <table className="index-table">
              <caption className="index-caption">
                Index des épreuves — colonnes du registre
              </caption>
              <thead>
                <tr>
                  {INDEX_COLUMNS.map((column) => (
                    <th scope="col" key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="index-specimen">
                  <td>Ligne de démonstration</td>
                  <td>FAST</td>
                  <td>L2</td>
                  <td>S1</td>
                  <td>2025-2026</td>
                  <td>
                    <span className="index-chip">Spécimen</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="index-empty">
              Aucune épreuve n&apos;est encore déposée. Le registre s&apos;ouvrira avec ses premiers
              fichiers ; la ligne ci-dessus montre seulement la forme d&apos;une entrée.
            </p>

            <div className="index-actions">
              <Link href="/dashboard/epreuves" className="btn btn-primary btn-sm">
                Voir la bibliothèque
              </Link>
              <Link href="/contribuer" className="btn btn-ghost btn-sm">
                Déposer une épreuve
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────── 02 — CAMPUSLY AI ──────────────────── */}
        <section className="chapter-block" id="campusly-ai">
          <ChapterHeader
            index="02"
            label="Campusly AI"
            title={
              <>
                Vos cours deviennent <em>des questions.</em>
              </>
            }
            note="Relu par vous avant chaque entraînement"
          >
            Un support entre, des exercices sortent. Rien n&apos;est lancé sans votre validation :
            chaque question reste modifiable.
          </ChapterHeader>

          <div className="ai-layout">
            <ol className="ledger" data-anim="steps">
              {AI_STEPS.map((step) => (
                <li className="ledger-row" key={step.num}>
                  <span className="ledger-num" aria-hidden="true">
                    {step.num}
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="ai-artefact" data-reveal>
              <StudyFlow />
              <p className="artefact-note">
                Schéma du parcours — aucune donnée de démonstration, aucun résultat simulé.
              </p>
            </div>
          </div>

          <p className="chapter-status">
            <strong>Ouverture progressive.</strong> L&apos;analyse de document n&apos;est pas encore
            disponible ; la banque d&apos;exercices permet déjà de s&apos;entraîner, avec une correction
            locale signalée comme non officielle.
          </p>
        </section>

        {/* ─────────────────── 03 — RÉVISION ─────────────────────── */}
        <section className="chapter-block" id="revision">
          <ChapterHeader
            index="03"
            label="Révision"
            title={
              <>
                Ne révisez pas tout. <em>Révisez ce qui bloque.</em>
              </>
            }
            note="Trois mouvements"
          >
            Relire un polycopié du début à la fin coûte du temps. Retravailler les notions qui ont
            coûté des points en coûte moins.
          </ChapterHeader>

          <ol className="movements" data-anim="numerals">
            {PROGRESSION.map((step) => (
              <li className="movement" key={step.index}>
                <span className="movement-index" aria-hidden="true">
                  {step.index}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>

          <p className="chapter-status">
            Vos repères personnels apparaîtront dans votre espace après un premier entraînement.
            Aucun chiffre n&apos;est affiché ici avant que vous ayez révisé.
          </p>
        </section>

        <Ticker inverted />

        {/* ─────────────────── 04 — ENSEIGNANTS ──────────────────── */}
        <section className="chapter-block" id="enseignants">
          <ChapterHeader
            index="04"
            label="Enseignants"
            title={
              <>
                Un centre de pilotage <em>pour vos amphis.</em>
              </>
            }
            note="Classe · code · rendus"
          >
            Créez votre classe, déposez vos supports, suivez les rendus. Campusly ne remplace pas
            votre pédagogie : il vous évite la dispersion entre messagerie, fichiers et tableurs.
          </ChapterHeader>

          <div className="teacher-layout">
            <ol className="ledger" data-anim="steps">
              {TEACHER_ROWS.map((row) => (
                <li className="ledger-row" key={row.num}>
                  <span className="ledger-num" aria-hidden="true">
                    {row.num}
                  </span>
                  <div>
                    <strong>{row.text}</strong>
                  </div>
                </li>
              ))}
            </ol>

            <div className="class-sheet" data-anim="frame" aria-label="Formulaire de classe — spécimen">
              <span className="class-sheet-tag">Spécimen</span>
              <p className="class-sheet-head">Fiche de classe</p>
              <dl className="class-sheet-fields">
                <div>
                  <dt>Classe</dt>
                  <dd>· · · · · · · · · ·</dd>
                </div>
                <div>
                  <dt>Code d&apos;amphi</dt>
                  <dd>· · · · · ·</dd>
                </div>
                <div>
                  <dt>Matière</dt>
                  <dd>· · · · · · · · · ·</dd>
                </div>
                <div>
                  <dt>Effectif</dt>
                  <dd>· · ·</dd>
                </div>
              </dl>
              <p className="class-sheet-foot">
                Le code est généré à la création de la classe et transmis en cours.
              </p>
            </div>
          </div>

          <div className="chapter-actions">
            <Link href="/dashboard/classrooms" className="btn btn-primary btn-sm">
              Ouvrir les Classrooms
            </Link>
          </div>
        </section>

        {/* ─────────────────── 05 — COMPOSITIONS ─────────────────── */}
        <section className="chapter-block" id="compositions">
          <ChapterHeader
            index="05"
            label="Compositions"
            title={
              <>
                Évaluer à distance, <em>sans perdre la main.</em>
              </>
            }
            note="Chronomètre · journal local · validation"
          >
            Des compositions d&apos;amphi et des examens blancs, corrigés puis validés par
            l&apos;enseignant.
          </ChapterHeader>

          <div className="bordereau" data-anim="mask" aria-label="Bordereau de composition — spécimen">
            <div className="bordereau-head">
              <p className="bordereau-title">Bordereau de composition</p>
              <span className="bordereau-tag">Spécimen</span>
            </div>
            <div className="bordereau-grid">
              <div>
                <span className="bordereau-label">Épreuve</span>
                <span className="bordereau-value">· · · · · · · · · · · ·</span>
              </div>
              <div>
                <span className="bordereau-label">Classe</span>
                <span className="bordereau-value">· · · · · · · ·</span>
              </div>
              <div>
                <span className="bordereau-label">Ouverture</span>
                <span className="bordereau-value">· · · · · · · ·</span>
              </div>
              <div>
                <span className="bordereau-label">Durée</span>
                <span className="bordereau-value">· · · · · ·</span>
              </div>
            </div>
            <p className="bordereau-foot">
              Le journal d&apos;intégrité (onglet, plein écran, copie de texte) reste sur l&apos;appareil
              et n&apos;entraîne aucune sanction automatique.
            </p>
          </div>

          <ul className="index-list" data-anim="editorial">
            {COMPOSITIONS.map((item) => (
              <li className="index-item" key={item.index}>
                <span className="index-item-num" aria-hidden="true">
                  {item.index}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="chapter-actions">
            <Link href="/dashboard/compositions" className="btn btn-primary btn-sm">
              Accéder aux compositions
            </Link>
          </div>
        </section>

        {/* ──────────────── 06 — ÉTABLISSEMENTS ──────────────────── */}
        <section className="chapter-block" id="etablissements">
          <ChapterHeader
            index="06"
            label="Établissements"
            title={
              <>
                Une plateforme <em>pour vos promotions.</em>
              </>
            }
            note="Facultés · écoles · instituts"
          >
            Facultés, écoles d&apos;ingénieurs et instituts de l&apos;UAC peuvent déployer Campusly
            comme espace commun de ressources, d&apos;évaluations et de suivi.
          </ChapterHeader>

          <figure className="plate" data-anim="plate">
            <Image
              src="/images/campus-building.jpg"
              alt="Illustration : bâtiment universitaire et palmiers en fin de journée"
              width={1536}
              height={864}
              sizes="(max-width: 1024px) 94vw, 78vw"
              className="plate-photo"
            />
            <figcaption className="plate-caption">
              <span className="plate-num">Planche 01</span>
              <span className="plate-text">
                Illustration du campus — une plateforme commune pour des facultés qui partagent
                déjà les mêmes maquettes. Visuel d&apos;illustration, sans valeur documentaire.
              </span>
            </figcaption>
          </figure>

          <div className="faculty-row">
            <span className="faculty-label">Facultés et instituts concernés</span>
            <ul className="faculty-list" aria-label="Facultés et instituts de l'UAC">
              {FACULTIES.map((faculty) => (
                <li key={faculty.code}>{faculty.code}</li>
              ))}
            </ul>
            <Link href="/a-propos#contact" className="btn btn-ghost btn-sm">
              Nous contacter
            </Link>
          </div>
        </section>

        {/* ─────────────────── 07 — CRÉDITS ──────────────────────── */}
        <section className="chapter-block chapter-block-compact" id="credits">
          <ChapterHeader
            index="07"
            label="Crédits & paiement"
            title={
              <>
                Le paiement <em>n&apos;est pas encore ouvert.</em>
              </>
            }
            note="Aucun frais · aucune carte · aucun Mobile Money"
          >
            Les crédits financeront l&apos;analyse de cours et les téléchargements d&apos;épreuves.
            Tant que le service est fermé, rien n&apos;est vendu, rien n&apos;est débité, et
            l&apos;accès aux exercices reste libre.
          </ChapterHeader>

          <div className="chapter-actions">
            <Link href="/a-propos#contact" className="btn btn-outline btn-sm">
              Être informé de l&apos;ouverture
            </Link>
          </div>
        </section>

        <FaqSection />

        {/* ─────────────────────── COLOPHON ──────────────────────── */}
        <footer className="colophon">
          <p className="colophon-main">
            Campusly — dossier académique de l&apos;UAC. Épreuves, révision, compositions.
          </p>
          <dl className="colophon-meta">
            <div>
              <dt>Version</dt>
              <dd>3.0.0 · web</dd>
            </div>
            <div>
              <dt>Édition</dt>
              <dd>2025 — 2026</dd>
            </div>
            <div>
              <dt>État</dt>
              <dd>Registre en préparation</dd>
            </div>
          </dl>
          <div className="colophon-actions">
            <Link href="/auth?tab=register" className="btn btn-primary btn-sm">
              Créer un compte
            </Link>
            <a href="#hero" className="btn btn-ghost btn-sm">
              Revenir au sommaire
            </a>
          </div>
        </footer>
      </div>
    </LandingMotion>
  );
}
