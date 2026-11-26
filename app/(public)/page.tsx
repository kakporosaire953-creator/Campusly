import Link from "next/link";
import { HeroEditorial } from "@/components/editorial/Hero";
import { Asterisk, Ruler } from "@/components/editorial/Marks";
import { Icon } from "@/components/motion/Icon";
import { pageMetadata, localeContext } from "@/lib/i18n/metadata";

export async function generateMetadata() {
  const { messages, locale } = await localeContext();
  const base = await pageMetadata("homeTitle", "/", "homeDescription");
  return {
    ...base,
    title: { absolute: messages.meta.homeTitle },
    alternates: { canonical: "/", languages: { fr: "/", en: "/?lang=en" } },
    other: { "content-language": locale },
  };
}

/**
 * Accueil public — quatre temps, aucune photographie.
 * ---------------------------------------------------------------------------
 * Le visuel ne repose plus sur des images mais sur la typographie, les filets,
 * les index numérotés et trois fragments d'interface réels (une ligne de
 * résultat, une fosse de composition, une carte de notion). Chaque fragment
 * est `aria-hidden` : il illustre, il ne prétend pas être un contrôle.
 *
 * Vérité éditoriale tenue : la génération de document n'est pas ouverte, le
 * paiement non plus, les données restent sur l'appareil, et Campusly n'a aucun
 * adossement officiel à l'UAC. Tous les textes viennent des dictionnaires.
 */

type Feature = { num: string; title: string; text: string; href: string; link: string };

export default async function HomePage() {
  const { messages } = await localeContext();
  const t = messages;

  const features: Feature[] = [
    { num: t.features.oneNum, title: t.features.oneTitle, text: t.features.oneText, href: "/dashboard/epreuves", link: t.features.oneLink },
    { num: t.features.twoNum, title: t.features.twoTitle, text: t.features.twoText, href: "/dashboard/classrooms", link: t.features.twoLink },
    { num: t.features.threeNum, title: t.features.threeTitle, text: t.features.threeText, href: "/dashboard/revision", link: t.features.threeLink },
  ];

  const exams = [
    { num: "a", title: t.exams.itemATitle, text: t.exams.itemAText },
    { num: "b", title: t.exams.itemBTitle, text: t.exams.itemBText },
    { num: "c", title: t.exams.itemCTitle, text: t.exams.itemCText },
    { num: "d", title: t.exams.itemDTitle, text: t.exams.itemDText },
  ];

  const questions = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
  ];

  return (
    <div className="ed">
      {/* ═══════════ 01 — OUVERTURE ═══════════ */}
      <HeroEditorial />

      {/* ═══════════ 02 — CE QUE FAIT LA PLATEFORME ═══════════ */}
      <section className="ed-features" id="experience" aria-labelledby="features-title">
        <div className="ed-rail">
          <header className="ed-features__head">
            <p className="ed-eyebrow" data-rise>
              <Asterisk size={11} color="var(--ember)" />
              {t.features.eyebrow}
            </p>
            <h2 className="ed-display ed-features__title" id="features-title" data-words>
              {t.features.titleLead} <em>{t.features.titleAccent}</em>
            </h2>
            <p className="ed-lede ed-features__lede" data-rise>
              {t.features.intro}
            </p>
          </header>

          <div className="ed-features__list" data-stagger>
            {features.map((item) => (
              <article className="ed-feature" key={item.num}>
                <span className="ed-feature__num" aria-hidden="true">
                  {item.num}
                </span>
                <h3 className="ed-feature__title">{item.title}</h3>
                <p className="ed-feature__text">{item.text}</p>
                <Link href={item.href} className="ed-link">
                  {item.link}
                  <Icon name="arrow-right" size={18} />
                </Link>
              </article>
            ))}
          </div>

          {/* Fragment d'interface réel : une ligne de résultat de la
              bibliothèque. Il remplace la photographie de la salle de lecture
              — même rôle d'accroche, mais il montre le produit. */}
          <figure className="ed-specimen" data-rise aria-hidden="true">
            <div className="ed-specimen__bar">
              <span className="ed-specimen__dot" />
              <span className="ed-specimen__dot" />
              <span className="ed-specimen__dot" />
              <span className="ed-specimen__url">{t.meta.examLibraryTitle}</span>
            </div>
            <div className="ed-specimen__body">
              <div className="ed-specimen__row">
                <div>
                  <p className="ed-specimen__title">Annales · Algorithmique</p>
                  <p className="ed-specimen__meta">L2 Informatique · 2024 · corrigé inclus</p>
                </div>
                <span className="ed-specimen__tag">PDF</span>
              </div>
              <div className="ed-specimen__row">
                <div>
                  <p className="ed-specimen__title">TD · Structures de données</p>
                  <p className="ed-specimen__meta">L2 Informatique · 2023</p>
                </div>
                <span className="ed-specimen__tag">PDF</span>
              </div>
              <div className="ed-specimen__row ed-specimen__row--muted">
                <div>
                  <p className="ed-specimen__title">Examen · Analyse</p>
                  <p className="ed-specimen__meta">L1 Mathématiques · 2024</p>
                </div>
                <span className="ed-specimen__tag ed-specimen__tag--soft">À vérifier</span>
              </div>
            </div>
            <figcaption className="ed-specimen__caption">
              <Ruler ticks={10} color="currentColor" />
              <span>Aperçu de la bibliothèque — fragment d&apos;interface</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══════════ 03 — CAMPUSLY AI (rupture en encre) ═══════════ */}
      <section className="ink-field ed-ai" id="campusly-ai" aria-labelledby="ai-title">
        <div className="ed-rail">
          <div className="ed-ai__inner">
            <div>
              <p className="ed-eyebrow ed-ai__eyebrow" data-rise>
                <span className="ed-num">03</span>
                <span>{t.ai.eyebrow}</span>
                <span className="ed-state ed-state--soon">{t.ai.state}</span>
              </p>

              <h2 className="ed-display ed-ai__title" id="ai-title" data-words>
                {t.ai.titleLead} <em>{t.ai.titleAccent}</em>
              </h2>

              <p className="ed-lede ed-ai__text" data-rise>
                {t.ai.lede}
              </p>

              <div className="ed-ai__actions" data-rise>
                <Link href="/dashboard/revision" className="ed-btn ed-btn--ink">
                  {t.ai.cta}
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>

            <ol className="ed-ai__steps" data-stagger aria-label={t.ai.flowLabel}>
              <li>
                <span aria-hidden="true">01</span>
                <div>
                  <b>{t.ai.step1Title}</b>
                  <p>{t.ai.step1Text}</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">02</span>
                <div>
                  <b>{t.ai.step2Title}</b>
                  <p>{t.ai.step2Text}</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">03</span>
                <div>
                  <b>{t.ai.step3Title}</b>
                  <p>{t.ai.step3Text}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ═══════════ 04 — COMPOSITIONS ═══════════ */}
      <section className="ed-exams" id="compositions" aria-labelledby="exams-title">
        <div className="ed-rail">
          <header className="ed-exams__head">
            <p className="ed-eyebrow" data-rise>
              <span className="ed-num">04</span>
              <span>{t.exams.eyebrow}</span>
            </p>
            <h2 className="ed-display ed-exams__title" id="exams-title" data-words>
              {t.exams.titleLead} <em>{t.exams.titleAccent}</em>
            </h2>
            <p className="ed-lede ed-exams__lede" data-rise>
              {t.exams.lede}
            </p>
          </header>

          <div className="ed-exams__grid" data-stagger>
            {exams.map((item) => (
              <article className="ed-exams__item" key={item.num}>
                <span className="ed-num" aria-hidden="true">
                  {item.num}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="ed-exams__actions" data-rise>
            <Link href="/dashboard/compositions" className="ed-btn">
              {t.exams.cta}
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link href="/dashboard/epreuves" className="ed-btn ed-btn--ghost">
              {t.exams.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 05 — QUESTIONS ═══════════ */}
      <section className="ed-faq" id="faq" aria-labelledby="faq-title">
        <div className="ed-rail">
          <header className="ed-faq__head">
            <p className="ed-eyebrow" data-rise>
              <span className="ed-num">05</span>
              <span>{t.faq.eyebrow}</span>
            </p>
            <h2 className="ed-display ed-faq__title" id="faq-title" data-words>
              {t.faq.titleLead} <em>{t.faq.titleAccent}</em>
            </h2>
          </header>

          <dl className="ed-faq__list" data-stagger>
            {questions.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>

          <p className="ed-faq__more" data-rise>
            <Link href="/a-propos#contact" className="ed-link">
              {t.faq.contact}
              <Icon name="arrow-right" size={18} />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
