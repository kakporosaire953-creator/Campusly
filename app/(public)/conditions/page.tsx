import Link from "next/link";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext, pageMetadata } from "@/lib/i18n/metadata";
import { SplitAccent } from "@/components/editorial/SplitAccent";

export async function generateMetadata() {
  return pageMetadata("conditionsTitle", "/conditions", "description");
}

/**
 * Conditions d'utilisation.
 * ----------------------------------------------------------------
 * Le corps est un **texte juridique**. Il est traduit pour être compris, mais
 * la version française fait foi : la mention `pages.notice` est affichée en
 * tête dans les six autres langues, jamais en français (où elle serait
 * redondante). Les traductions ne sont pas validées par un juriste.
 */
export default async function TermsPage() {
  const { locale } = await localeContext();
  const { pages } = getMessages(locale);
  const legal = pages.legal;

  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">{legal.termsEyebrow}</p>
          <h1 className="ed-display doc__title">
            <SplitAccent text={legal.termsTitle} accent={legal.termsTitleAccent} />
          </h1>
          <p className="ed-note doc__date">{legal.updated}</p>
        </header>

        {locale !== "fr" ? <p className="doc__notice">{pages.notice}</p> : null}

        <div className="doc__body">
          {legal.terms.map((term, index) => (
            <section key={term.title}>
              <h2>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {term.title}
              </h2>
              <p>{term.body}</p>
            </section>
          ))}

          <section>
            <h2>
              <span aria-hidden="true">{String(legal.terms.length + 1).padStart(2, "0")}</span>
              {legal.termsContactTitle}
            </h2>
            <p>
              {legal.termsContactBody} <Link href="/contribuer">{pages.contributeTitle}</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
