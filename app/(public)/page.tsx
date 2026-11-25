import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroEditorial } from "@/components/editorial/Hero";
import { Asterisk, LongArrow } from "@/components/editorial/Marks";
import { Icon } from "@/components/motion/Icon";

export const metadata: Metadata = {
  title: { absolute: "Campusly — Apprendre avec une longueur d'avance" },
  description:
    "Les annales de votre faculté, vos espaces de cours et vos entraînements, au même endroit. Projet indépendant, pensé pour l'UAC.",
  alternates: { canonical: "/" },
};

/**
 * Accueil public — quatre temps.
 * ---------------------------------------------------------------------------
 * Une ouverture, ce que la plateforme fait aujourd'hui, une rupture en encre,
 * puis les questions. Les séquences de mise en scène (sommaire numéroté,
 * manifeste, progression, établissements) ont été retirées : le visiteur a
 * besoin de savoir ce qu'il peut faire, pas de visiter un sommaire.
 *
 * Vérité éditoriale tenue : la génération de document n'est pas ouverte, le
 * paiement non plus, les données restent sur l'appareil, et Campusly n'a aucun
 * adossement officiel à l'UAC.
 */

/* Ce que la plateforme fait réellement, en une ligne chacune. */
const FEATURES = [
  {
    num: "01",
    title: "Les annales de votre faculté",
    text: "Épreuves et supports classés par faculté, département, niveau et année — la logique de vos maquettes, pas un dossier partagé.",
    href: "/dashboard/epreuves",
    link: "Ouvrir la bibliothèque",
  },
  {
    num: "02",
    title: "Vos classes, au même endroit",
    text: "Un code d'amphi à transmettre en cours, les supports, les annonces et les rendus réunis dans une seule classe.",
    href: "/dashboard/classrooms",
    link: "Voir les espaces de cours",
  },
  {
    num: "03",
    title: "S'entraîner, puis mesurer",
    text: "Des questions tirées de vos supports, corrigées localement, et les notions à revoir regroupées par matière.",
    href: "/dashboard/revision",
    link: "Lancer un entraînement",
  },
] as const;

/* Les quatre gestes d'une composition surveillée. */
const EXAM = [
  { num: "a", title: "Un temps imparti", text: "Chronomètre fixé par l'enseignant, jamais par l'étudiant." },
  { num: "b", title: "Une salle à part", text: "Un espace plein écran, ouvert par le code de composition." },
  { num: "c", title: "Un journal local", text: "Les changements d'onglet restent sur l'appareil, revus par l'enseignant." },
  { num: "d", title: "Une copie personnelle", text: "Chacun retrouve sa copie et les commentaires reçus." },
] as const;

export default function HomePage() {
  return (
    <div className="ed">
      {/* ═══════════ 01 — OUVERTURE ═══════════ */}
      <HeroEditorial />

      {/* ═══════════ 02 — CE QUE FAIT LA PLATEFORME ═══════════ */}
      <section className="ed-features" id="experience" aria-labelledby="features-title">
        <div className="ed-rail">
          <header className="ed-features__head">
            <p className="ed-eyebrow">
              <Asterisk size={11} color="var(--ember)" />
              Disponible aujourd&apos;hui
            </p>
            <h2 className="ed-display ed-features__title" id="features-title">
              Trois gestes, <em>dès maintenant.</em>
            </h2>
          </header>

          <div className="ed-features__list">
            {FEATURES.map((item) => (
              <article className="ed-feature" key={item.num}>
                <span className="ed-feature__num" aria-hidden="true">
                  {item.num}
                </span>
                <h3 className="ed-feature__title">{item.title}</h3>
                <p className="ed-feature__text">{item.text}</p>
                <Link href={item.href} className="ed-link">
                  {item.link}
                  <LongArrow size={20} />
                </Link>
              </article>
            ))}
          </div>

          <figure className="ed-features__figure">
            <Image
              src="/images/library-study.jpg"
              alt="Étudiante travaillant ses cours à la bibliothèque universitaire"
              width={1200}
              height={700}
              sizes="(max-width: 900px) 92vw, 620px"
              className="ed-media-img"
            />
            <figcaption>Salle de lecture — visuel d&apos;illustration.</figcaption>
          </figure>
        </div>
      </section>

      {/* ═══════════ 03 — CAMPUSLY AI (rupture en encre) ═══════════ */}
      <section className="ink-field ed-ai" id="campusly-ai" aria-labelledby="ai-title">
        <div className="ed-rail">
          <div className="ed-ai__inner">
            <div>
              <p className="ed-eyebrow ed-ai__eyebrow">
                <span className="ed-num">03</span>
                <span>Campusly AI</span>
                <span className="ed-state ed-state--soon">En préparation</span>
              </p>

              <h2 className="ed-display ed-ai__title" id="ai-title">
                Un support entre. <em>Des questions sortent.</em>
              </h2>

              <p className="ed-lede ed-ai__text">
                Vous déposez un cours, un TD ou une épreuve ; les notions en sont tirées, puis
                transformées en questions que vous relisez avant de vous entraîner. L&apos;analyse
                de document n&apos;est pas encore ouverte — les entraînements, eux, le sont.
              </p>

              <div className="ed-ai__actions">
                <Link href="/dashboard/revision" className="ed-btn ed-btn--ink">
                  Ouvrir les entraînements
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>

            <ul className="ed-ai__steps">
              <li>
                <span aria-hidden="true">01</span>
                <div>
                  <b>Déposer</b>
                  <p>Un support de cours, une fiche, une annale.</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">02</span>
                <div>
                  <b>Relire</b>
                  <p>Les questions proposées, à corriger ou à garder.</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">03</span>
                <div>
                  <b>Réviser</b>
                  <p>Les notions fragiles reviennent à l&apos;entraînement suivant.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════ 04 — COMPOSITIONS ═══════════ */}
      <section className="ed-exams" id="compositions" aria-labelledby="exams-title">
        <div className="ed-rail">
          <header className="ed-exams__head">
            <p className="ed-eyebrow">
              <span className="ed-num">04</span>
              <span>Compositions</span>
            </p>
            <h2 className="ed-display ed-exams__title" id="exams-title">
              Évaluer à distance, <em>sans perdre la main.</em>
            </h2>
            <p className="ed-lede ed-exams__lede">
              La salle consigne ce qui s&apos;y passe, mais la décision reste humaine : Campusly
              n&apos;annule aucune note et ne sanctionne personne automatiquement.
            </p>
          </header>

          <div className="ed-exams__grid">
            {EXAM.map((item) => (
              <article className="ed-exams__item" key={item.num}>
                <span className="ed-num" aria-hidden="true">
                  {item.num}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="ed-exams__actions">
            <Link href="/dashboard/compositions" className="ed-btn">
              Accéder aux compositions
              <LongArrow size={22} />
            </Link>
            <Link href="/dashboard/epreuves" className="ed-btn ed-btn--ghost">
              Voir les épreuves
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 05 — QUESTIONS ═══════════ */}
      <section className="ed-faq" id="faq" aria-labelledby="faq-title">
        <div className="ed-rail">
          <header className="ed-faq__head">
            <p className="ed-eyebrow">
              <span className="ed-num">05</span>
              <span>Questions</span>
            </p>
            <h2 className="ed-display ed-faq__title" id="faq-title">
              L&apos;essentiel, <em>en cinq réponses.</em>
            </h2>
          </header>

          <dl className="ed-faq__list">
            <div>
              <dt>Que puis-je faire dès aujourd&apos;hui&nbsp;?</dt>
              <dd>
                Consulter les annales de votre faculté, rejoindre une classe avec un code
                d&apos;amphi, vous entraîner et suivre vos notions fragiles.
              </dd>
            </div>
            <div>
              <dt>La génération de questions est-elle ouverte&nbsp;?</dt>
              <dd>
                Pas encore. L&apos;analyse de document est annoncée « en préparation » partout où
                elle apparaît, y compris sur cette page.
              </dd>
            </div>
            <div>
              <dt>Faut-il payer quelque chose&nbsp;?</dt>
              <dd>
                Non. Les packs de crédits ne sont pas ouverts et aucun tarif n&apos;est publié
                avant l&apos;activation des paiements.
              </dd>
            </div>
            <div>
              <dt>Où vont mes données&nbsp;?</dt>
              <dd>
                Dans cette version, tout ce que vous saisissez reste sur votre appareil : rien
                n&apos;est envoyé à un serveur.
              </dd>
            </div>
            <div>
              <dt>Campusly est-il lié à l&apos;UAC&nbsp;?</dt>
              <dd>
                C&apos;est un projet indépendant. Il n&apos;est ni édité ni approuvé officiellement
                par l&apos;Université d&apos;Abomey-Calavi.
              </dd>
            </div>
          </dl>

          <p className="ed-faq__more">
            <Link href="/a-propos#contact" className="ed-link">
              Écrire à l&apos;équipe
              <LongArrow size={20} />
            </Link>
          </p>
        </div>
      </section>

      {/* Le colophon d'appel a été retiré : le pied de page portait déjà
          l'invitation aux établissements, les deux blocs d'encre se
          confondaient en un seul aplat. */}
    </div>
  );
}
