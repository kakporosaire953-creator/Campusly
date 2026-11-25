import Image from "next/image";
import Link from "next/link";
import { Asterisk, LongArrow } from "@/components/editorial/Marks";

/**
 * Ouverture — un titre, une phrase, deux entrées, une image.
 * ---------------------------------------------------------------------------
 * Rien d'autre. Le folio, les coordonnées, le sommaire numéroté et les
 * fragments d'interface ont été retirés : ils occupaient le premier écran sans
 * aider à décider quoi faire. La hauteur utile est rendue au titre.
 *
 * La photographie est un visuel d'illustration, et la légende le dit.
 */
export function HeroEditorial() {
  return (
    <section className="ed-hero" id="hero" aria-labelledby="hero-title">
      <div className="ed-rail ed-open__grid">
        <div className="ed-open__copy">
          <p className="ed-eyebrow ed-open__kicker">
            <Asterisk size={11} color="var(--ember)" />
            Ressources académiques · UAC
          </p>

          <h1 className="ed-display ed-open__title" id="hero-title">
            Apprendre, <em>sans se disperser.</em>
          </h1>

          <p className="ed-lede ed-open__lede">
            Les annales de votre faculté, vos espaces de cours et vos entraînements, au même
            endroit.
          </p>

          <div className="ed-open__actions">
            <Link href="/auth?tab=register" className="ed-btn">
              Créer mon espace
              <LongArrow size={22} />
            </Link>
            <a href="#experience" className="ed-btn ed-btn--ghost">
              Voir les fonctions
            </a>
          </div>
        </div>

        <figure className="ed-open__figure">
          <Image
            src="/images/hero-students.jpg"
            alt="Étudiants réunis autour d'une table de travail, cahiers et ordinateur ouverts"
            width={1376}
            height={860}
            priority
            sizes="(max-width: 900px) 92vw, 480px"
            className="ed-open__img"
          />
          <figcaption className="ed-open__caption">Visuel d&apos;illustration.</figcaption>
        </figure>
      </div>
    </section>
  );
}
