import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FACULTIES } from "@/types";
import { FaqSection } from "@/components/shared/FaqSection";
import { SectionHead } from "@/components/landing/SectionHead";
import { HeroComposition } from "@/components/landing/HeroComposition";
import { AiSequence } from "@/components/landing/AiSequence";
import { Marquee } from "@/components/motion/Marquee";
import { Burst, Squiggle, Star } from "@/components/landing/Doodles";
import { Icon } from "@/components/motion/Icon";
import {
  FragClassroom,
  FragComposition,
  FragDashboard,
  FragLibrary,
  FragTeacher,
} from "@/components/landing/AppFragments";

export const metadata: Metadata = {
  title: { absolute: "Campusly — Ressources, cours et révisions à l'UAC" },
  description:
    "Campusly réunit les ressources académiques, les espaces de cours et les outils de révision dans un environnement pensé pour les étudiants et les enseignants de l'Université d'Abomey-Calavi.",
};

/** Situations du quotidien universitaire — le problème, pas la promesse. */
const DAILY = [
  {
    index: "01",
    title: "Retrouver les supports de cours",
    text: "Un polycopié dans une conversation, un TD dans un dossier partagé, la version finale nulle part.",
  },
  {
    index: "02",
    title: "Accéder aux ressources académiques",
    text: "Les anciennes épreuves circulent de main en main, rarement classées par faculté, niveau et année.",
  },
  {
    index: "03",
    title: "Organiser ses révisions",
    text: "Relire le polycopié du début à la fin ne dit pas ce qui est réellement acquis.",
  },
  {
    index: "04",
    title: "Retrouver ses activités pédagogiques",
    text: "Annonces, devoirs et rendus vivent dans des fils différents, parfois en dehors de la plateforme.",
  },
];

const PROGRESSION = [
  {
    step: "Étape 01",
    title: "Un premier entraînement",
    text: "Vous choisissez une matière et un mode. Les questions portent sur le support que vous avez fourni.",
  },
  {
    step: "Étape 02",
    title: "Les notions à revoir",
    text: "Les questions manquées sont regroupées par notion, pas par question : c'est le concept qui est retravaillé.",
  },
  {
    step: "Étape 03",
    title: "L'entraînement suivant",
    text: "La sélection suivante met l'accent sur ces notions, jusqu'à ce qu'elles tiennent.",
  },
];

const TEACHER_ROWS = [
  {
    num: "01",
    title: "Créer la classe",
    text: "Un espace d'amphi par matière, avec un code à transmettre en cours.",
  },
  {
    num: "02",
    title: "Déposer les supports",
    text: "Cours, TD et sujets d'interrogation restent attachés à la classe.",
  },
  {
    num: "03",
    title: "Suivre les rendus",
    text: "Devoirs remis, corrections et commentaires au même endroit.",
  },
];

const COMPOSITIONS = [
  {
    index: "01",
    title: "Durée et chronomètre",
    text: "Un temps imparti, affiché pendant toute l'épreuve.",
  },
  {
    index: "02",
    title: "Salle dédiée",
    text: "Un espace plein écran, distinct du reste de la plateforme.",
  },
  {
    index: "03",
    title: "Correction assistée",
    text: "Des outils d'aide à la correction, la décision restant à l'enseignant.",
  },
  {
    index: "04",
    title: "Copie personnelle",
    text: "Chaque étudiant retrouve sa copie et les commentaires reçus.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="campus-hero" id="hero">
        <div className="hero__grid">
          <div className="hero__text">
            <p className="hero__eyebrow" data-reveal>
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              Université d&apos;Abomey-Calavi · Bénin
              <Star className="hero__star" color="var(--accent)" size={16} />
            </p>

            <h1 className="hero__title">
              <span className="hero__line">
                <span data-split>L&apos;université demande</span>
              </span>
              <span className="hero__line">
                <span data-split>assez d&apos;efforts.</span>
              </span>
              <span className="hero__line hero__line--accent">
                {/* L'écrasement est moins ample que sur Kraken : la ligne
                    accentuée est une phrase entière, pas un mot. */}
                <span data-slam data-slam-scale="1.5" data-slam-rotation="-6">
                  Pas besoin de multiplier les outils.
                </span>
              </span>
            </h1>

            <Squiggle className="hero__squiggle" color="var(--brand-1)" width={86} />

            <p className="hero__lede" data-reveal>
              Campusly réunit les ressources académiques, les espaces de cours et les outils de
              révision dans un environnement pensé pour les étudiants et les enseignants de
              l&apos;UAC.
            </p>

            <div className="hero__actions" data-reveal>
              <a href="#fonctionnalites" className="btn btn-primary btn-lg">
                Découvrir Campusly
                <Icon name="arrow-up-right" size={17} />
              </a>
              <Link href="/auth?tab=register" className="btn btn-outline btn-lg">
                Créer un compte
                <Icon name="arrow-right" size={17} />
              </Link>
            </div>

            <ul className="hero__facts" data-reveal>
              <li>Ressources classées par maquette</li>
              <li>Entraînements corrigés localement</li>
              <li>Projet indépendant, ouvert à l&apos;UAC</li>
            </ul>
          </div>

          <HeroComposition />
        </div>
      </section>

      {/* ══════════════ BANDE DE VEILLE ═══════════════════
          Bandeau défilant repris du site Kraken. Les repères sont des faits
          vérifiables sur cette version — aucun chiffre, aucune promesse. */}
      <div className="site-ticker">
        <Marquee
          speed={34}
          items={[
            "Projet indépendant, ouvert à l'UAC",
            "Ressources classées par maquette",
            "Entraînements corrigés localement",
            "Analyse de document : à venir",
            "Paiement non ouvert",
            "Données conservées sur votre appareil",
          ]}
        />
      </div>

      {/* ══════════════════ LE QUOTIDIEN ════════════════════ */}
      <section className="section daily" id="quotidien">
        <SectionHead
          index="01"
          label="Le quotidien"
          title={
            <>
              Entre les cours, les supports, les compositions et les révisions, l&apos;organisation
              peut vite devenir compliquée.
            </>
          }
          note="Quatre points de friction"
        >
          Rien d&apos;extraordinaire : ce sont les mêmes difficultés chaque semestre. Campusly ne
          les supprime pas, il les range.
        </SectionHead>

        <ol className="daily__list">
          {DAILY.map((item) => (
            <li className="daily__item" key={item.index} data-reveal>
              <span className="daily__num" aria-hidden="true">
                {item.index}
              </span>
              <div className="daily__body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ═════════════════ FONCTIONNALITÉS ══════════════════ */}
      <section className="section features" id="fonctionnalites">
        <span id="piliers" className="anchor-alias" aria-hidden="true" />
        <SectionHead
          index="02"
          label="Fonctionnalités"
          title={
            <>
              Quatre espaces, <em>quatre façons de travailler.</em>
            </>
          }
          note="De la ressource au rendu"
        >
          Chaque espace garde sa propre logique : un cours n&apos;est pas une épreuve, une épreuve
          n&apos;est pas une révision.
        </SectionHead>

        {/* 01 — Espaces de cours */}
        <article className="feat feat--class">
          <div className="feat__text">
            <p className="feat__tag" data-reveal>
              <span aria-hidden="true">01</span> Espaces de cours
            </p>
            <h3 className="feat__title" data-reveal>
              Cours, ressources et activités au même endroit.
            </h3>
            <p className="feat__lede" data-reveal>
              Un enseignant crée sa classe, transmet un code d&apos;amphi, dépose supports et
              annonces. Les étudiants rejoignent la classe et retrouvent ce qui a été partagé, sans
              groupe de messagerie parallèle.
            </p>
            <ul className="feat__list" data-reveal>
              <li>Code d&apos;amphi à transmettre en cours</li>
              <li>Supports de cours et annonces</li>
              <li>Devoirs et rendus suivis</li>
            </ul>
            <Link href="/dashboard/classrooms" className="feat__link">
              Ouvrir les espaces de cours <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="feat__media">
            <figure className="feat__photo" data-reveal>
              <Image
                src="/images/amphi.jpg"
                alt="Cours magistral dans un amphithéâtre, étudiants prenant des notes"
                width={1264}
                height={847}
                sizes="(max-width: 1024px) 92vw, 34vw"
                className="feat__photo-img"
              />
            </figure>
            <FragClassroom className="feat__frag" data-pop />

          </div>
        </article>

        {/* 02 — Épreuves et ressources */}
        <article className="feat feat--library">
          <div className="feat__text">
            <p className="feat__tag" data-reveal>
              <span aria-hidden="true">02</span> Épreuves et ressources
            </p>
            <h3 className="feat__title" data-reveal>
              Les documents au centre, pas les vignettes.
            </h3>
            <p className="feat__lede" data-reveal>
              Recherche par matière ou mot-clé, puis filtres par faculté, département, niveau,
              semestre et année : la même logique que vos maquettes. Le catalogue est encore vide et
              la bibliothèque le dit clairement, au lieu d&apos;afficher des entrées de remplissage.
            </p>
            <ol className="feat__steps" data-reveal>
              <li>
                <span aria-hidden="true">a</span> Rechercher une matière
              </li>
              <li>
                <span aria-hidden="true">b</span> Filtrer par maquette
              </li>
              <li>
                <span aria-hidden="true">c</span> Consulter le document
              </li>
            </ol>
            <Link href="/dashboard/epreuves" className="feat__link">
              Ouvrir la bibliothèque <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="feat__media feat__media--library">
            <figure className="feat__photo feat__photo--small" data-reveal>
              <Image
                src="/images/library-study.jpg"
                alt="Étudiante travaillant ses cours à la bibliothèque universitaire"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 60vw, 22vw"
                className="feat__photo-img"
              />
            </figure>
            <FragLibrary className="feat__frag" data-pop />
          </div>
        </article>

        {/* 03 — Campusly AI (renvoi vers la section signature) */}
        <article className="feat feat--ai">
          <div className="feat__ai-copy">
            <p className="feat__tag feat__tag--dark" data-reveal>
              <span aria-hidden="true">03</span> Campusly AI
            </p>
            <h3 className="feat__title feat__title--dark" data-reveal>
              Vos cours deviennent des questions.
            </h3>
            <p className="feat__lede feat__lede--dark" data-reveal>
              Un support entre, des exercices sortent — que vous relisez avant de vous entraîner.
              L&apos;analyse de document n&apos;est pas encore ouverte ; les modes d&apos;entraînement,
              eux, fonctionnent déjà.
            </p>
          </div>

          <ol className="feat__flow" aria-label="Parcours Campusly AI" data-lift>
            {["Support", "Notions", "Questions"].map((label, index) => (
              <li key={label}>
                <span className="feat__flow-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </li>
            ))}
          </ol>

          <a href="#campusly-ai" className="feat__link feat__link--dark">
            Voir la séquence complète <span aria-hidden="true">→</span>
          </a>
        </article>

        {/* 04 — Suivi pédagogique */}
        <article className="feat feat--track">
          <div className="feat__media feat__media--track">
            <FragDashboard className="feat__frag" data-pop />
            <ol className="feat__rules" data-reveal>
              {[
                ["Repères par entraînement", "Ce qui a été travaillé, ce qui reste fragile."],
                ["Notions à consolider", "Le regroupement se fait par notion, pas par question."],
                ["Historique local", "Les traces restent sur votre appareil en préfiguration."],
              ].map(([title, text], index) => (
                <li key={title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="feat__text">
            <p className="feat__tag" data-reveal>
              <span aria-hidden="true">04</span> Suivi pédagogique
            </p>
            <h3 className="feat__title" data-reveal>
              Savoir où porter l&apos;effort.
            </h3>
            <p className="feat__lede" data-reveal>
              Chaque entraînement laisse des repères : notions travaillées, notions encore fragiles,
              dernière session. Aucun chiffre n&apos;est affiché avant votre premier entraînement —
              et aucune moyenne n&apos;est inventée pour remplir un écran.
            </p>
            <Link href="/dashboard" className="feat__link">
              Ouvrir le tableau de bord <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </section>

      {/* ═══════════════════ CAMPUSLY AI ════════════════════ */}
      <section className="section ai-section" id="campusly-ai">
        <SectionHead
          index="03"
          label="Campusly AI"
          title={
            <>
              D&apos;un support de cours à <em>une séance d&apos;entraînement.</em>
            </>
          }
          note="Aperçu du parcours"
        >
          Le parcours ci-dessous décrit ce que fait Campusly AI — et, en bas de section, ce qu&apos;il
          ne fait pas encore.
        </SectionHead>

        <AiSequence />
      </section>

      {/* ═══════════════════ PROGRESSION ════════════════════ */}
      <section className="section track-section" id="parcours">
        <SectionHead
          index="04"
          label="Progression"
          title={
            <>
              Révisez ce qui bloque, <em>pas tout ce qui existe.</em>
            </>
          }
          note="Trois temps"
        >
          Relire un polycopié du début à la fin coûte du temps. Retravailler les notions qui ont
          coûté des points en coûte moins.
        </SectionHead>

        <div className="track-block">
          <span className="track__fill" aria-hidden="true" data-fill />
          <ol className="track">
            {PROGRESSION.map((item) => (
              <li className="track__step" key={item.step} data-pop>
                <span className="track__node" aria-hidden="true" data-stamp />
                <span className="track__step-label">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="section__note" data-reveal>
          Vos repères personnels apparaissent dans votre espace après un premier entraînement. Aucun
          chiffre n&apos;est affiché ici avant que vous ayez révisé.
        </p>
      </section>

      {/* ═══════════════════ ENSEIGNANTS ════════════════════ */}
      <section className="section teachers" id="enseignants">
        <span id="professeurs" className="anchor-alias" aria-hidden="true" />
        <SectionHead
          index="05"
          label="Enseignants"
          title={
            <>
              Un centre de pilotage <em>pour vos amphis.</em>
            </>
          }
          note="Classe · code · rendus"
        >
          Campusly ne remplace pas votre pédagogie : il évite la dispersion entre messagerie,
          fichiers et tableurs.
        </SectionHead>

        <div className="teachers__grid">
          <ol className="teachers__rows">
            {TEACHER_ROWS.map((row) => (
              <li key={row.num} data-reveal>
                <span className="teachers__num" aria-hidden="true">
                  {row.num}
                </span>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="teachers__panel" data-pop>
            <p className="teachers__panel-label">Espace de travail · aperçu</p>
            <FragTeacher className="teachers__frag" />
            <p className="teachers__panel-note">
              La vérification du statut enseignant reste faite par le secrétariat académique avant
              l&apos;ouverture des classes.
            </p>
            <Link href="/enseignant" className="feat__link">
              Voir l&apos;espace enseignant <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ COMPOSITIONS ════════════════════ */}
      <section className="section compositions" id="compositions">
        <SectionHead
          index="06"
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
        </SectionHead>

        <figure className="compo-band" data-reveal>
          <Image
            src="/images/exam-hall.jpg"
            alt="Étudiants composant dans une salle d'examen de l'université"
            width={1264}
            height={847}
            sizes="100vw"
            className="compo-band__img"
          />
          <figcaption className="compo-band__caption">
            <span className="compo-band__label">Salle d&apos;examen</span>
            <span>
              Un espace plein écran, un chronomètre et un journal d&apos;intégrité qui reste sur
              l&apos;appareil : aucune sanction n&apos;est automatique.
            </span>
            <span className="compo-band__note">Visuel d&apos;illustration</span>
          </figcaption>
          <FragComposition className="compo-band__frag" />
        </figure>

        <ul className="compo-list">
          {COMPOSITIONS.map((item) => (
            <li className="compo-item" key={item.index} data-pop>
              <span className="compo-item__num" aria-hidden="true">
                {item.index}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="section__actions">
          <Link href="/dashboard/compositions" className="btn btn-primary">
            Accéder aux compositions
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>

      {/* ════════════════ ÉTABLISSEMENTS ════════════════════ */}
      <section className="section institutions" id="etablissements">
        <SectionHead
          index="07"
          label="Établissements"
          title={
            <>
              Une plateforme <em>pour vos promotions.</em>
            </>
          }
          note="Facultés · écoles · instituts"
        >
          Facultés, écoles d&apos;ingénieurs et instituts peuvent déployer Campusly comme espace
          commun de ressources, d&apos;évaluations et de suivi. Le déploiement se discute : il ne se
          décrète pas.
        </SectionHead>

        <div className="institutions__body">
          <div className="institutions__type" data-reveal>
            <p className="institutions__lead">
              Campusly est un projet indépendant. Rien sur cette page ne vaut approbation officielle
              de l&apos;Université d&apos;Abomey-Calavi : les facultés ci-dessous sont celles dont
              les maquettes servent de repère au classement des ressources.
            </p>
            <ul className="institutions__list" aria-label="Facultés et instituts de l'UAC">
              {FACULTIES.map((faculty) => (
                <li key={faculty.code}>
                  <span className="institutions__code">{faculty.code}</span>
                  <span className="institutions__name">{faculty.label.split("—")[1]?.trim()}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="institutions__figure" data-lift>
            <Image
              src="/images/campus-building.jpg"
              alt="Bâtiment universitaire et palmiers en fin de journée"
              width={1536}
              height={864}
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="institutions__img"
            />
            <figcaption className="institutions__caption">
              Campus d&apos;Abomey-Calavi · <span>visuel d&apos;illustration</span>
            </figcaption>
          </figure>
        </div>

        <div className="institutions__cta">
          <p>
            Vous représentez un établissement&nbsp;? La discussion commence par vos contraintes,
            pas par une démonstration commerciale.
          </p>
          <div className="institutions__cta-actions">
            <Link href="/a-propos#contact" className="btn btn-outline">
              Demander une démonstration
            </Link>
            <Link href="/a-propos#contact" className="btn btn-ghost">
              Proposer un partenariat
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ═══════════════════ CTA FINAL ══════════════════════ */}
      <section className="cta-band" id="rejoindre">
        <div className="cta-band__inner" data-pop>
          <Burst className="cta-band__burst" color="#FFC078" size={38} flip />
          <p className="cta-band__eyebrow">Commencer maintenant</p>
          <h2 className="cta-band__title">
            Commencez par <em>vos propres cours.</em>
          </h2>
          <p className="cta-band__text">
            Créez votre compte et commencez par les exercices d&apos;entraînement ou la bibliothèque
            d&apos;épreuves. Les autres services ouvriront au fur et à mesure.
          </p>
          <div className="cta-band__actions">
            <Link href="/auth?tab=register" className="btn btn-accent btn-lg">
              Créer un compte
              <Icon name="arrow-right" size={17} />
            </Link>
            <a href="#fonctionnalites" className="btn btn-cta-ghost btn-lg">
              Revoir les fonctionnalités
            </a>
          </div>
          <p className="cta-band__note" id="credits">
            Crédits et paiements : les packs ne sont pas ouverts. Aucun tarif n&apos;est publié
            avant l&apos;activation des paiements.
          </p>
        </div>
      </section>
    </>
  );
}
