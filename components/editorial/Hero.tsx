import Image from "next/image";
import Link from "next/link";
import { Asterisk, Cross, LongArrow, Ruler } from "@/components/editorial/Marks";
import { FragQuiz } from "@/components/editorial/PaperFragments";

/**
 * Ouverture — composition asymétrique du hero.
 * ---------------------------------------------------------------------------
 * Le titre occupe presque toute la largeur ; le texte, les appels à l'action et
 * la photographie se répartissent ensuite sur une grille décalée, sans jamais
 * revenir à la colonne « texte à gauche / image à droite ».
 *
 * Trois repères éditoriaux :
 *  - un folio (`N° 01 / 09`) et la position géographique en marge ;
 *  - une légende sous l'image, qui dit ce que la photo est ;
 *  - un fragment d'interface posé en débord, découpé par la même diagonale que
 *    la photo.
 *
 * La photographie est un visuel d'illustration : aucune capture ne prétend
 * montrer un écran réel.
 */
export function HeroEditorial() {
  return (
    <section className="ed-hero" id="hero" aria-labelledby="hero-title">
      <div className="ed-rail">
        <div className="ed-hero__meta">
          <p className="ed-eyebrow">
            <Cross />
            <span className="ed-num">N° 01</span>
            <span>Campus d&apos;Abomey-Calavi</span>
          </p>
          <p className="ed-eyebrow ed-hero__geo">
            <span>Bénin</span>
            <span aria-hidden="true">/</span>
            <span>6.4° N — 2.4° E</span>
            <span aria-hidden="true">/</span>
            <span>Semestre 1</span>
          </p>
        </div>

        <h1 className="ed-display ed-hero__title" id="hero-title">
          <span className="ed-hero__line" data-split>
            L&apos;université ne devrait{" "}
          </span>
          <span className="ed-hero__line" data-split>
            pas être{" "}
          </span>
          <span className="ed-hero__line ed-hero__line--accent">
            <em data-slam data-slam-scale="1.35" data-slam-rotation="-4">
              un parcours désorganisé.
            </em>
          </span>
        </h1>

        <div className="ed-hero__compose">
          <div className="ed-hero__copy">
            <p className="ed-hero__tagline" data-reveal>
              <Asterisk size={13} className="ed-hero__asterisk" color="var(--ember)" />
              Apprenez avec une longueur d&apos;avance.
            </p>

            <p className="ed-lede ed-hero__lede" data-reveal>
              Un environnement pour apprendre, réviser et progresser, pensé pour la réalité
              universitaire.
            </p>

            <div className="ed-hero__actions" data-reveal>
              <a href="#experience" className="ed-btn">
                Explorer Campusly
                <LongArrow size={26} />
              </a>
              <Link href="/auth?tab=register" className="ed-btn ed-btn--ghost">
                Créer mon espace
              </Link>
            </div>

            <dl className="ed-hero__facts" data-reveal>
              <div>
                <dt>Ressources</dt>
                <dd>classées par maquette</dd>
              </div>
              <div>
                <dt>Entraînements</dt>
                <dd>corrigés localement</dd>
              </div>
              <div>
                <dt>Statut</dt>
                <dd>projet indépendant, ouvert à l&apos;UAC</dd>
              </div>
            </dl>
          </div>

          <figure className="ed-hero__figure" data-reveal>
            <div className="ed-hero__frame">
              <Image
                src="/images/hero-students.jpg"
                alt="Étudiants réunis autour d'une table de travail, cahiers et ordinateur ouverts"
                width={1376}
                height={768}
                priority
                sizes="(max-width: 900px) 94vw, 46vw"
                className="ed-hero__img"
              />
            </div>

            <figcaption className="ed-caption">
              <b>Fig. 01</b>
              <span>Une table de travail, quatre cahiers ouverts.</span>
              <span>Visuel d&apos;illustration.</span>
            </figcaption>

            <span className="ed-hero__folio" aria-hidden="true">
              01 / 09
            </span>
          </figure>

          <div className="ed-hero__frag" data-pop>
            <FragQuiz />
            <p className="ed-note ed-hero__frag-note">
              <span className="ed-state ed-state--live">Utilisable</span>
              Les modes d&apos;entraînement fonctionnent dès aujourd&apos;hui.
            </p>
          </div>
        </div>

        <div className="ed-hero__foot">
          <Ruler ticks={16} className="ed-hero__ruler" color="rgba(18,45,69,0.4)" />
          <p className="ed-note">
            Campusly est un projet indépendant. Il n&apos;est ni édité ni approuvé officiellement
            par l&apos;Université d&apos;Abomey-Calavi.
          </p>
          <a href="#manifeste" className="ed-link ed-hero__scroll">
            Lire le manifeste
          </a>
        </div>
      </div>
    </section>
  );
}
