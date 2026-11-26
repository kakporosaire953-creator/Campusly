import "@/styles/legacy/pages/contribuer.css";
import { ContributionForm } from "@/features/exams/ContributionForm";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext, pageMetadata } from "@/lib/i18n/metadata";
import { SplitAccent } from "@/components/editorial/SplitAccent";

export async function generateMetadata() {
  return pageMetadata("contribuerTitle", "/contribuer", "description");
}

/** Page de contribution : le formulaire est un composant client traduit à part. */
export default async function ContributePage() {
  const { locale } = await localeContext();
  const pages = getMessages(locale).pages;

  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">{pages.contributeEyebrow}</p>
          <h1 className="ed-display doc__title">
            <SplitAccent text={pages.contributeTitle} accent={pages.contributeTitleAccent} />
          </h1>
          <p className="ed-lede doc__lede">{pages.contributeLede}</p>
        </header>

        <div className="doc__body doc__body--form">
          <ContributionForm />
        </div>
      </div>
    </div>
  );
}
