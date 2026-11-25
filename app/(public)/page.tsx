import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACULTIES } from "@/types";
import { HeroEditorial } from "@/components/editorial/Hero";
import { Chapter, Marker } from "@/components/editorial/Chapter";
import { Asterisk, Cross, LongArrow, Ruler } from "@/components/editorial/Marks";
import {
  FragClassroom,
  FragComposition,
  FragLibrary,
  FragProgress,
  FragQuiz,
  FragTeacher,
  AiTrail,
} from "@/components/editorial/PaperFragments";
import { FaqSection } from "@/components/shared/FaqSection";
import { LegacyAnchors } from "@/components/editorial/LegacyAnchors";
import { Icon } from "@/components/motion/Icon";

export const metadata: Metadata = {
  title: { absolute: "Campusly — Apprendre avec une longueur d'avance" },
  description:
    "Ressources académiques classées par maquette, espaces de cours, entraînements corrigés localement et suivi de progression : un environnement d'apprentissage pensé pour la réalité universitaire à l'UAC. Projet indépendant.",
  alternates: { canonical: "/" },
};

/**
 * Accueil éditorial — neuf séquences.
 * ---------------------------------------------------------------------------
 * La page est un journal : une ouverture, un manifeste, quatre dossiers, deux
 * ruptures en encre, puis les questions. Chaque séquence a sa composition ; le
 * système typographique, lui, ne change pas.
 *
 * Vérité éditoriale (tenue partout) :
 *  - l'analyse de document de Campusly AI n'est PAS ouverte ;
 *  - le paiement n'est pas ouvert, aucun tarif n'est publié ;
 *  - les données de préfiguration restent sur l'appareil ;
 *  - Campusly est un projet indépendant, sans adossement officiel à l'UAC ;
 *  - les captures d'interface sont des aperçus de structure, jamais des
 *    chiffres ou des contenus inventés.
 */

/* ── Sommaire : les neuf séquences, avec leur état réel ────── */
const SUMMARY = [
  { num: "01", label: "Ouverture", state: "—", href: "#hero" },
  { num: "02", label: "Manifeste", state: "—", href: "#manifeste" },
  { num: "03", label: "L'expérience", state: "Disponible", href: "#experience" },
  { num: "04", label: "Campusly AI", state: "En préparation", href: "#campusly-ai" },
  { num: "05", label: "Espaces pédagogiques", state: "Disponible", href: "#espaces" },
  { num: "06", label: "Épreuves et compositions", state: "Disponible", href: "#epreuves" },
  { num: "07", label: "Progression", state: "Disponible", href: "#progression" },
  { num: "08", label: "Établissements", state: "Dialogue ouvert", href: "#etablissements" },
] as const;

/* ── Manifeste : les quatre piliers, à quatre échelles ─────── */
const PILLARS = [
  {
    num: "01",
    name: "Ressources académiques",
    text: "Épreuves, annales et supports classés par faculté, département, niveau, semestre et année — la logique de vos maquettes, pas un dossier partagé.",
  },
  {
    num: "02",
    name: "Espaces pédagogiques",
    text: "Une classe par matière, un code d'amphi à transmettre en cours, les annonces, les supports et les rendus au même endroit.",
  },
  {
    num: "03",
    name: "Révisions intelligentes",
    text: "Des questions tirées des supports, relues avant l'entraînement, et une correction locale signalée pour ce qu'elle est : non officielle.",
  },
  {
    num: "04",
    name: "Progression personnelle",
    text: "Ce qui a été travaillé, ce qui reste fragile. Aucun chiffre n'apparaît avant le premier entraînement.",
  },
] as const;

/* ── Progression : trois temps ─────────────────────────────── */
const TRACK = [
  {
    step: "Temps 01",
    title: "Un premier entraînement",
    text: "Vous choisissez une matière et un mode. Les questions portent sur le support que vous avez fourni.",
  },
  {
    step: "Temps 02",
    title: "Les notions à revoir",
    text: "Les questions manquées sont regroupées par notion, pas par question : c'est le concept qui est retravaillé.",
  },
  {
    step: "Temps 03",
    title: "L'entraînement suivant",
    text: "La sélection suivante met l'accent sur ces notions, jusqu'à ce qu'elles tiennent.",
  },
] as const;

/* ── Épreuves : ce que fait réellement la salle de composition ─ */
const EXAM_FEATURES = [
  {
    num: "a",
    title: "Un temps imparti",
    text: "Chronomètre affiché pendant toute l'épreuve, fixé par l'enseignant — jamais par l'étudiant.",
  },
  {
    num: "b",
    title: "Une salle à part",
    text: "Un espace plein écran, distinct du reste de la plateforme, accessible par le code de composition.",
  },
  {
    num: "c",
    title: "Un journal local",
    text: "Les changements d'onglet sont consignés sur l'appareil et revus par l'enseignant : aucune sanction n'est automatique.",
  },
  {
    num: "d",
    title: "Une copie personnelle",
    text: "Chaque étudiant retrouve sa copie et les commentaires reçus, une fois la correction validée.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="ed">
      {/* Anciennes ancres partagées : `#fonctionnalites` → `#experience`. */}
      <LegacyAnchors />

      {/* ═══════════ 01 — OUVERTURE ═══════════ */}
      <HeroEditorial />

      {/* Sommaire + manifeste : le lecteur sait où il met les pieds. */}
      <section className="ed-rail ed-summary-block" aria-label="Sommaire de la page">
        <div className="ed-summary-block__col">
          <p className="ed-eyebrow">
            <Asterisk size={12} color="var(--ember)" />
            Sommaire
          </p>
          <nav aria-label="Séquences de la page">
            <ul className="ed-summary">
              {SUMMARY.map((item) => (
                <li key={item.num}>
                  <a className="ed-summary__item" href={item.href}>
                    <span className="ed-summary__num" aria-hidden="true">
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                    <span className="ed-summary__state">{item.state}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <aside className="ed-summary-block__aside" aria-label="État de la plateforme">
          <p className="ed-label">Cette version</p>
          <ul className="ed-summary__states">
            <li>
              <span className="ed-state ed-state--live">Disponible</span>
              Bibliothèque, classes, entraînements, compositions.
            </li>
            <li>
              <span className="ed-state ed-state--soon">En préparation</span>
              Analyse de document par Campusly AI.
            </li>
            <li>
              <span className="ed-state ed-state--soon">Fermé</span>
              Crédits et paiements — aucun tarif publié.
            </li>
          </ul>
          <p className="ed-note">
            Aucune donnée n&apos;est envoyée à un serveur dans cette version : tout ce que vous
            saisissez reste sur votre appareil.
          </p>
        </aside>
      </section>

      {/* ═══════════ 02 — MANIFESTE ═══════════ */}
      <section className="ed-manifesto" id="manifeste">
        <div className="ed-rail">
          <header className="ed-chapter">
            <div className="ed-chapter__top">
              <p className="ed-eyebrow">
                <span className="ed-chapter__index">02</span>
                <span>Manifeste</span>
              </p>
              <p className="ed-eyebrow ed-chapter__note">
                <Cross />
                Quatre piliers
              </p>
            </div>

            <h2 className="ed-display ed-chapter__title" data-reveal>
              Apprendre, ce n&apos;est pas seulement assister à un cours.
            </h2>

            <div className="ed-chapter__aside" data-reveal-soft>
              <p className="ed-lede">
                C&apos;est comprendre, pratiquer, se tromper et recommencer. Campusly organise ces
                quatre gestes au lieu d&apos;ajouter un outil de plus.
              </p>
            </div>
          </header>

          <p className="ed-manifesto__quote" data-reveal-soft>
            « Apprendre, ce n&apos;est pas seulement assister à un cours. C&apos;est{" "}
            <em>comprendre, pratiquer, se tromper et recommencer.</em> »
          </p>

          <ol className="ed-pillars">
            {PILLARS.map((pillar) => (
              <li className="ed-pillar" key={pillar.num} data-reveal>
                <span className="ed-pillar__num" aria-hidden="true">
                  {pillar.num}
                </span>
                <h3 className="ed-pillar__name">{pillar.name}</h3>
                <p className="ed-pillar__text">{pillar.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════ 03 — L'EXPÉRIENCE ═══════════ */}
      <Chapter
        id="experience"
        index="03"
        label="L'expérience"
        note="Deux dossiers, deux usages"
        title={
          <>
            Explorer <em>l&apos;expérience.</em>
          </>
        }
        lede={
          <>
            Les fonctions disponibles aujourd&apos;hui, montrées telles qu&apos;elles se présentent :
            une recherche, un code d&apos;amphi, une question d&apos;entraînement. Les aperçus
            ci-dessous reprennent la structure des écrans réels — les valeurs restent vides tant que
            vous n&apos;avez rien saisi.
          </>
        }
      >
        <div className="ed-dossiers">
          {/* Dossier A — la bibliothèque */}
          <article className="ed-dossier" aria-labelledby="dossier-biblio">
            <div className="ed-dossier__head">
              <Marker num="03 · A">Bibliothèque</Marker>
              <h3 className="ed-dossier__title" id="dossier-biblio">
                Les documents au centre, pas les vignettes.
              </h3>
              <p className="ed-body ed-dossier__body">
                Recherche par matière ou mot-clé, puis filtres par faculté, département, niveau,
                semestre et année : la même logique que vos maquettes. Le catalogue est encore vide
                et la bibliothèque le dit clairement, au lieu d&apos;afficher des entrées de
                remplissage.
              </p>
              <ul className="ed-dossier__list">
                <li>Recherche plein texte sur les titres et les matières</li>
                <li>Filtres alignés sur les maquettes de l&apos;UAC</li>
                <li>Consultation du document sans quitter la page</li>
              </ul>
              <p>
                <Link href="/dashboard/epreuves" className="ed-link">
                  Ouvrir la bibliothèque
                  <LongArrow size={22} />
                </Link>
              </p>
            </div>

            <div className="ed-dossier__media">
              <div data-pop>
                <FragLibrary />
              </div>
              <figure className="ed-dossier__photo ed-mask" data-mask>
                <Image
                  src="/images/library-study.jpg"
                  alt="Étudiante travaillant ses cours à la bibliothèque universitaire"
                  width={1200}
                  height={896}
                  sizes="(max-width: 900px) 92vw, 40vw"
                  className="ed-media-img"
                />
                <figcaption>Fig. 02 — salle de lecture</figcaption>
              </figure>
            </div>
          </article>

          {/* Dossier B — la classe */}
          <article className="ed-dossier ed-dossier--flip" aria-labelledby="dossier-classe">
            <div className="ed-dossier__head">
              <Marker num="03 · B">Espaces de cours</Marker>
              <h3 className="ed-dossier__title" id="dossier-classe">
                Cours, ressources et activités au même endroit.
              </h3>
              <p className="ed-body ed-dossier__body">
                Un enseignant crée sa classe, transmet un code d&apos;amphi, dépose supports et
                annonces. Les étudiants rejoignent la classe et retrouvent ce qui a été partagé, sans
                groupe de messagerie parallèle.
              </p>
              <ul className="ed-dossier__list">
                <li>Code d&apos;amphi à transmettre en cours</li>
                <li>Supports de cours et annonces</li>
                <li>Devoirs et rendus suivis</li>
              </ul>
              <p>
                <Link href="/dashboard/classrooms" className="ed-link">
                  Ouvrir les espaces de cours
                  <LongArrow size={22} />
                </Link>
              </p>
            </div>

            <div className="ed-dossier__media">
              <figure className="ed-dossier__photo ed-mask" data-mask>
                <Image
                  src="/images/amphi.jpg"
                  alt="Cours magistral dans un amphithéâtre, étudiants prenant des notes"
                  width={1264}
                  height={848}
                  sizes="(max-width: 900px) 92vw, 40vw"
                  className="ed-media-img"
                />
                <figcaption>Fig. 03 — amphi de cours</figcaption>
              </figure>
              <div data-pop>
                <FragClassroom />
              </div>
            </div>
          </article>
        </div>
      </Chapter>

      {/* ═══════════ 04 — CAMPUSLY AI (rupture en encre) ═══════════ */}
      <section className="ink-field ink-field--grided ed-ai" id="campusly-ai">
        <div className="ed-rail">
          <header className="ed-chapter">
            <div className="ed-chapter__top">
              <p className="ed-eyebrow">
                <span className="ed-chapter__index">04</span>
                <span>Campusly AI</span>
              </p>
              <p className="ed-eyebrow ed-chapter__note">
                <Cross />
                Séquence signature · en préparation
              </p>
            </div>

            <h2 className="ed-display ed-chapter__title" data-reveal>
              Your courses. Your knowledge. <em>Your next move.</em>
            </h2>

            <div className="ed-chapter__aside" data-reveal-soft>
              <p className="ed-lede">
                Transformez vos supports de cours en opportunités d&apos;apprentissage.
              </p>
              <p className="ed-ai__sub" lang="fr">
                Un support entre, des questions sortent — que vous relisez avant de vous entraîner.
              </p>
            </div>
          </header>

          <AiTrail />

          <div className="ed-ai__cta">
            <Link href="/dashboard/revision" className="ed-btn ed-btn--ink">
              Ouvrir les entraînements
              <LongArrow size={26} />
            </Link>
            <Link href="/dashboard/revision" className="ed-btn ed-btn--ghost-ink">
              Voir la banque d&apos;exercices
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 05 — ESPACES PÉDAGOGIQUES ═══════════ */}
      <Chapter
        id="espaces"
        index="05"
        label="Espaces pédagogiques"
        note="Étudiants · enseignants"
        title={
          <>
            Deux expériences, <em>un même espace.</em>
          </>
        }
        lede={
          <>
            L&apos;étudiant rejoint, consulte, remet. L&apos;enseignant crée, partage, publie, suit.
            Les deux côtés partagent la même classe — ce qui évite de tenir deux listes à jour.
          </>
        }
      >
        <div className="ed-campuses">
          <article className="ed-campus" aria-labelledby="campus-eleve">
            <div className="ed-campus__audience">
              <Marker num="05 · A">Étudiants</Marker>
              <span className="ed-state ed-state--live">Disponible</span>
            </div>
            <h3 className="ed-campus__title" id="campus-eleve">
              Rejoindre, consulter, remettre.
            </h3>
            <ol className="ed-campus__steps">
              <li>
                <span aria-hidden="true">01</span> Rejoindre une classe avec le code d&apos;amphi
              </li>
              <li>
                <span aria-hidden="true">02</span> Consulter les supports et les annonces
              </li>
              <li>
                <span aria-hidden="true">03</span> Remettre un devoir, suivre son état
              </li>
            </ol>
            <div data-pop>
              <FragClassroom />
            </div>
            <p>
              <Link href="/dashboard/classrooms" className="ed-link">
                Mes espaces de cours
                <LongArrow size={22} />
              </Link>
            </p>
          </article>

          <article className="ed-campus ed-campus--teacher" aria-labelledby="campus-pro">
            <div className="ed-campus__audience">
              <Marker num="05 · B">Enseignants</Marker>
              <span className="ed-state ed-state--soon">Statut vérifié requis</span>
            </div>
            <h3 className="ed-campus__title" id="campus-pro">
              Créer, partager, publier, suivre.
            </h3>
            <ol className="ed-campus__steps">
              <li>
                <span aria-hidden="true">01</span> Créer une classe, générer son code
              </li>
              <li>
                <span aria-hidden="true">02</span> Partager les supports, publier les annonces
              </li>
              <li>
                <span aria-hidden="true">03</span> Suivre les rendus et commenter
              </li>
            </ol>
            <div data-pop>
              <FragTeacher />
            </div>
            <p>
              <Link href="/enseignant" className="ed-link">
                Voir l&apos;espace enseignant
                <LongArrow size={22} />
              </Link>
            </p>
          </article>
        </div>
      </Chapter>

      {/* ═══════════ 06 — ÉPREUVES ET COMPOSITIONS ═══════════ */}
      <Chapter
        id="epreuves"
        index="06"
        label="Épreuves et compositions"
        note="Chronomètre · journal local · validation"
        title={
          <>
            Évaluer à distance, <em>sans perdre la main.</em>
          </>
        }
        lede={
          <>
            Une composition s&apos;ouvre avec le code transmis par l&apos;enseignant. La salle
            consigne ce qui s&apos;y passe, mais la décision reste humaine : Campusly n&apos;annule
            aucune note et ne sanctionne personne automatiquement.
          </>
        }
      >
        <div className="ed-exams">
          <figure className="ed-exams__band ed-mask" data-mask>
            <Image
              src="/images/exam-hall.jpg"
              alt="Étudiants composant dans une salle d'examen de l'université"
              width={1264}
              height={848}
              sizes="100vw"
              className="ed-media-img"
            />
            <figcaption className="ed-exams__caption">
              <b>Salle d&apos;examen · visuel d&apos;illustration</b>
              L&apos;écran de composition est un espace plein écran, distinct du reste de la
              plateforme.
            </figcaption>
          </figure>

          <div className="ed-exams__content">
            <div className="ed-exams__grid">
              {EXAM_FEATURES.map((item) => (
                <article className="ed-exams__item" key={item.num} data-reveal>
                  <span className="ed-num" aria-hidden="true">
                    {item.num}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="ed-exams__side" data-pop>
              <FragComposition />
            </div>
          </div>

          <div className="ed-exams__actions">
            <Link href="/dashboard/compositions" className="ed-btn">
              Accéder aux compositions
              <LongArrow size={26} />
            </Link>
            <Link href="/dashboard/epreuves" className="ed-btn ed-btn--ghost">
              Voir les épreuves et annales
            </Link>
          </div>
        </div>
      </Chapter>

      {/* ═══════════ 07 — PROGRESSION ═══════════ */}
      <Chapter
        id="progression"
        index="07"
        label="Progression"
        note="Trois temps, aucune moyenne inventée"
        title={
          <>
            Progresser, c&apos;est aussi savoir <em>ce qu&apos;il reste à apprendre.</em>
          </>
        }
        lede={
          <>
            Relire un polycopié du début à la fin coûte du temps. Retravailler les notions qui ont
            coûté des points en coûte moins — à condition de savoir lesquelles.
          </>
        }
      >
        <div className="ed-track">
          <ol className="ed-track__rail">
            <span className="ed-track__line" data-fill aria-hidden="true" />
            {TRACK.map((item) => (
              <li className="ed-track__step" key={item.step} data-reveal>
                <span className="ed-track__dot" data-stamp aria-hidden="true" />
                <p className="ed-label">{item.step}</p>
                <h3 className="ed-track__title">{item.title}</h3>
                <p className="ed-track__text">{item.text}</p>
              </li>
            ))}
          </ol>

          <div className="ed-track__panel" data-pop>
            <FragProgress />
          </div>

          <p className="ed-note ed-track__note" data-reveal-soft>
            Vos repères personnels apparaissent dans votre espace après un premier entraînement.
            Aucun chiffre, aucune moyenne et aucun taux de réussite ne sont affichés ici avant que
            vous ayez révisé.
          </p>

          <p>
            <Link href="/dashboard" className="ed-link">
              Ouvrir le tableau de bord
              <LongArrow size={22} />
            </Link>
          </p>
        </div>
      </Chapter>

      {/* ═══════════ 08 — ÉTABLISSEMENTS ═══════════ */}
      <section className="ed-institutions" id="etablissements">
        <div className="ed-rail">
          <header className="ed-chapter">
            <div className="ed-chapter__top">
              <p className="ed-eyebrow">
                <span className="ed-chapter__index">08</span>
                <span>Établissements</span>
              </p>
              <p className="ed-eyebrow ed-chapter__note">
                <Cross />
                Projet indépendant · dialogue ouvert
              </p>
            </div>

            <h2 className="ed-display ed-chapter__title" data-reveal>
              Une plateforme <em>pour vos promotions.</em>
            </h2>

            <div className="ed-chapter__aside" data-reveal-soft>
              <p className="ed-lede">
                Facultés, écoles d&apos;ingénieurs et instituts peuvent déployer Campusly comme
                espace commun de ressources, d&apos;évaluations et de suivi. Le déploiement se
                discute : il ne se décrète pas.
              </p>
            </div>
          </header>

          <div className="ed-institutions__body">
            <div>
              <p className="ed-institutions__lead">
                Campusly est un projet indépendant. Rien sur cette page ne vaut approbation
                officielle de l&apos;Université d&apos;Abomey-Calavi : les facultés ci-dessous sont
                celles dont les maquettes servent de repère au classement des ressources.
              </p>

              <ul className="ed-institutions__index" aria-label="Facultés et instituts de l'UAC">
                {FACULTIES.map((faculty) => (
                  <li key={faculty.code}>
                    <span className="ed-institutions__code">{faculty.code}</span>
                    <span className="ed-institutions__name">
                      {faculty.label.split("—")[1]?.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <figure className="ed-institutions__figure ed-mask" data-mask>
                <Image
                  src="/images/campus-building.jpg"
                  alt="Bâtiment universitaire et palmiers en fin de journée"
                  width={1376}
                  height={768}
                  sizes="(max-width: 900px) 92vw, 44vw"
                  className="ed-media-img"
                />
                <figcaption>Campus d&apos;Abomey-Calavi · illustration</figcaption>
              </figure>

              <div className="ed-institutions__call" data-reveal-soft>
                <p>
                  Vous représentez un établissement&nbsp;? La discussion commence par vos
                  contraintes, pas par une démonstration commerciale.
                </p>
                <div className="ed-institutions__actions">
                  <Link href="/a-propos#contact" className="ed-btn">
                    Demander une démonstration
                  </Link>
                  <Link href="/a-propos#contact" className="ed-btn ed-btn--ghost">
                    Proposer un partenariat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 09 — QUESTIONS FRÉQUENTES ═══════════ */}
      <FaqSection />

      {/* ═══════════ COLOPHON D'APPEL ═══════════ */}
      <section className="ink-field ed-final" id="rejoindre">
        <div className="ed-rail">
          <div className="ed-final__inner">
            <div>
              <p className="ed-eyebrow">
                <span className="ed-num">—</span>
                <span>Commencer maintenant</span>
              </p>
              <h2 className="ed-display ed-final__title" data-reveal>
                Commencez par <em>vos propres cours.</em>
              </h2>
              <p className="ed-lede ed-final__text" data-reveal-soft>
                Créez votre espace et commencez par les exercices d&apos;entraînement ou la
                bibliothèque d&apos;épreuves. Les autres services ouvriront au fur et à mesure.
              </p>
            </div>

            <div className="ed-final__aside">
              <div className="ed-final__actions">
                <Link href="/auth?tab=register" className="ed-btn ed-btn--ink">
                  Créer mon espace
                  <Icon name="arrow-right" size={16} />
                </Link>
                <a href="#experience" className="ed-btn ed-btn--ghost-ink">
                  Revoir les fonctions
                </a>
              </div>

              <p className="ed-note ed-final__note" id="credits">
                Crédits et paiements : les packs ne sont pas ouverts. Aucun tarif n&apos;est publié
                avant l&apos;activation des paiements.
              </p>

              <div className="ed-final__meta">
                <Ruler ticks={10} color="rgba(244,241,233,0.35)" />
                <p className="ed-note">Campusly · Bénin · préfiguration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
