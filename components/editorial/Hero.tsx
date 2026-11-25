import Link from "next/link";
import { Asterisk, Ruler } from "@/components/editorial/Marks";
import { Icon } from "@/components/motion/Icon";
import { localeContext } from "@/lib/i18n/metadata";

/**
 * Ouverture — une composition typographique, aucune image.
 * ---------------------------------------------------------------------------
 * La photographie d'illustration a été retirée. Elle est remplacée par ce que
 * la page sait faire de mieux : un titre monumental, un index de sommaire sur
 * filet gradué, et un **relevé d'état** — les quatre fonctions réellement
 * ouvertes aujourd'hui, et celle qui ne l'est pas encore. Ce bloc porte donc
 * une information vraie au lieu d'une illustration générique.
 *
 * Séquence d'entrée (voir `MotionScope`) : le chapeau, puis le titre mot à
 * mot, puis le texte, puis les deux entrées, puis le relevé en cascade. Aucun
 * rebond, aucun déplacement de plus de 18 px.
 *
 * Le contenu de chaque fragment décoratif est `aria-hidden` : la marque
 * typographique ne doit pas être lue deux fois par un lecteur d'écran.
 */
export async function HeroEditorial() {
  const { messages } = await localeContext();
  const t = messages.hero;

  const ledger = [
    { label: t.ledgerEpreuves, state: t.statusNow, open: true },
    { label: t.ledgerClassrooms, state: t.statusNow, open: true },
    { label: t.ledgerRevision, state: t.statusNow, open: true },
    { label: t.ledgerCompositions, state: t.statusNow, open: true },
    { label: t.ledgerPending, state: t.statusSoon, open: false },
  ];

  return (
    <section className="ed-hero ed-open" id="hero" aria-labelledby="hero-title">
      <div className="ed-rail ed-open__grid">
        <div className="ed-open__copy">
          <p className="ed-eyebrow ed-open__kicker" data-rise>
            <Asterisk size={11} color="var(--ember)" />
            {t.kicker}
          </p>

          <h1 className="ed-display ed-open__title" id="hero-title" data-words>
            {t.titleLead} <em>{t.titleAccent}</em>
          </h1>

          <p className="ed-lede ed-open__lede" data-rise>
            {t.lede}
          </p>

          <div className="ed-open__actions" data-rise>
            <Link href="/auth?tab=register" className="ed-btn">
              {t.primaryCta}
              <Icon name="arrow-right" size={18} />
            </Link>
            <a href="#experience" className="ed-btn ed-btn--ghost">
              {t.secondaryCta}
            </a>
          </div>
        </div>

        {/* ── Relevé d'état : la composition qui remplace la photographie ── */}
        <aside className="ed-ledger" aria-labelledby="hero-ledger-title">
          <div className="ed-ledger__head" data-rise>
            <Ruler ticks={14} color="currentColor" />
            <h2 className="ed-ledger__title" id="hero-ledger-title">
              {t.ledgerLabel}
            </h2>
            <p className="ed-ledger__note">{t.statusNote}</p>
          </div>

          <ul className="ed-ledger__list" data-stagger>
            {ledger.map((item, index) => (
              <li key={item.label} className={item.open ? "is-open" : "is-soon"}>
                <span className="ed-ledger__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="ed-ledger__label">{item.label}</span>
                <span className="ed-ledger__state">{item.state}</span>
              </li>
            ))}
          </ul>

          {/* Index de sommaire — un repère éditorial, pas un contrôle. */}
          <nav className="ed-open__index" aria-label={t.indexLabel} data-rise>
            <a href="#hero" className="is-current">
              <span aria-hidden="true">01</span>
              {t.index1}
            </a>
            <a href="#experience">
              <span aria-hidden="true">02</span>
              {t.index2}
            </a>
            <a href="#campusly-ai">
              <span aria-hidden="true">03</span>
              {t.index3}
            </a>
            <a href="#compositions">
              <span aria-hidden="true">04</span>
              {t.index4}
            </a>
            <a href="#faq">
              <span aria-hidden="true">05</span>
              {t.index5}
            </a>
          </nav>
        </aside>
      </div>
    </section>
  );
}
