import { siteConfig } from "@/config/site";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext, pageMetadata } from "@/lib/i18n/metadata";
import { SplitAccent } from "@/components/editorial/SplitAccent";

export async function generateMetadata() {
  return pageMetadata("privacyTitle", "/politique-de-confidentialite", "description");
}

/**
 * Politique de confidentialité.
 * Le contenu est un texte juridique : traduit pour être compris, la version
 * française faisant foi (mention affichée dans les six autres langues).
 */
export default async function PrivacyPage() {
  const { locale } = await localeContext();
  const { pages } = getMessages(locale);
  const legal = pages.legal;

  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">{legal.privacyEyebrow}</p>
          <h1 className="ed-display doc__title">
            <SplitAccent text={legal.privacyTitle} accent={legal.privacyTitleAccent} />
          </h1>
          <p className="ed-note doc__date">{legal.updated}</p>
        </header>

        {locale !== "fr" ? <p className="doc__notice">{pages.notice}</p> : null}

        <div className="doc__body">
          {legal.privacy.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {"intro" in section && section.intro ? <p>{section.intro}</p> : null}
              <ul>
                {section.items.map((item) => (
                  <li key={item.text}>
                    {"lead" in item && item.lead ? <strong>{item.lead}</strong> : null}
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="doc__contact">
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
          <span aria-hidden="true"> · </span>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}>WhatsApp</a>
        </p>
      </div>
    </div>
  );
}
