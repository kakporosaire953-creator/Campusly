import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FACULTIES } from "@/types";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext, pageMetadata } from "@/lib/i18n/metadata";
import { SplitAccent } from "@/components/editorial/SplitAccent";

export async function generateMetadata() {
  return pageMetadata("aboutTitle", "/a-propos", "description");
}

/**
 * « Le projet ».
 * Aucune phrase n'est en dur : les vingt segments de cette page viennent du
 * bloc `pages.*` des sept dictionnaires. Le nom des facultés est un code
 * (`FASHS`, `FADESP`…) : c'est une donnée de l'université, pas une chaîne
 * d'interface, elle n'est donc pas traduite.
 */
export default async function AboutPage() {
  const { locale } = await localeContext();
  const pages = getMessages(locale).pages;

  const offers = [pages.aboutOffer1, pages.aboutOffer2, pages.aboutOffer3];

  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">{pages.aboutEyebrow}</p>
          <h1 className="ed-display doc__title">
            <SplitAccent text={pages.aboutTitle} accent={pages.aboutTitleAccent} />
          </h1>
          <p className="ed-lede doc__lede">{pages.aboutLede}</p>
        </header>

        <div className="doc__body">
          <section>
            <h2>{pages.aboutWhyTitle}</h2>
            <p>{pages.aboutWhyBody}</p>
          </section>

          <section>
            <h2>{pages.aboutOffersTitle}</h2>
            <ul>
              {offers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{pages.aboutFacultiesTitle}</h2>
            <p className="doc__faculties">
              {FACULTIES.map((faculty) => (
                <span key={faculty.code}>{faculty.code}</span>
              ))}
            </p>
          </section>

          <section id="demonstration">
            <h2>{pages.aboutStateTitle}</h2>
            <p>{pages.aboutStateBody}</p>
          </section>

          <section id="contact">
            <h2>{pages.aboutContactTitle}</h2>
            <p>
              {pages.aboutContactBody}{" "}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
            </p>
            <p>
              <Link href="/contribuer">{pages.contributeTitle}</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
