import Image from "next/image";
import { FragClassroom, FragQuiz } from "@/components/landing/AppFragments";

/**
 * Composition du hero.
 * ---------------------------------------------------------------------------
 * Une grande photographie de campus qui déborde de la grille, deux extraits
 * d'interface posés dessus (classe et quiz), une légende en pied et une
 * étiquette verticale.
 *
 * Détail de la mise en scène :
 *  - `hero__stage` est le repère des cartes : le quiz chevauche le bas de la
 *    photo, la classe déborde à gauche sur la gouttière ;
 *  - la légende reste à gauche, sous la photo, pour ne jamais passer derrière
 *    une carte ;
 *  - la photo reçoit une parallaxe très légère (désactivée sous 768 px).
 */
export function HeroComposition() {
  return (
    <div className="hero__media" data-hero-media>
      <figure className="hero__figure">
        <div className="hero__stage">
          <div className="hero__photo-wrap" data-hero-photo data-parallax data-parallax-depth="10">
            <Image
              src="/images/hero-students.jpg"
              alt="Étudiants réunis autour d'une table de travail, cahiers et ordinateur ouverts"
              width={1400}
              height={933}
              priority
              sizes="(max-width: 1024px) 94vw, 54vw"
              className="hero__photo"
            />
          </div>

          <div className="hero__frag hero__frag--quiz" data-hero-card>
            <FragQuiz />
          </div>
        </div>

        <figcaption className="hero__caption">
          <span className="hero__caption-label">Campus d&apos;Abomey-Calavi</span>
          <span className="hero__caption-text">
            Des amphis aux salles de travail : un seul espace pour les ressources du semestre.
          </span>
          <span className="hero__caption-note">Visuel d&apos;illustration</span>
        </figcaption>
      </figure>

      <div className="hero__frag hero__frag--class" data-hero-card>
        <FragClassroom />
      </div>

      <p className="hero__vertical" aria-hidden="true">
        UAC · Bénin · Semestre 1
      </p>
    </div>
  );
}
