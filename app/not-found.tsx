import Link from "next/link";
import { Logo } from "@/components/shared/CampuslyLogo";
import { getMessages } from "@/lib/i18n/dictionaries";
import { localeContext } from "@/lib/i18n/metadata";
import "@/styles/legacy/pages/404.css";

export async function generateMetadata() {
  const { locale } = await localeContext();
  return { title: getMessages(locale).pages.system.notFoundTitle, robots: { index: false, follow: false } };
}

/**
 * 404 — traduite comme le reste de l'interface.
 * `generateMetadata` plutôt qu'un `metadata` statique : la langue est portée
 * par un cookie lu au rendu, elle n'est connue qu'à la requête.
 */
export default async function NotFound() {
  const { locale } = await localeContext();
  const s = getMessages(locale).pages.system;

  return (
    <div className="notfound-page" id="contenu">
      <div className="not-found">
        <Link href="/" className="logo-text">
          <Logo size={30} className="logo-campusly" />
        </Link>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">{s.notFoundTitle}</h1>
        <p className="not-found-desc">{s.notFoundBody}</p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house" aria-hidden="true" /> {s.backHome}
          </Link>
          <Link href="/dashboard/epreuves" className="btn btn-ghost">
            <i className="fa-solid fa-book" aria-hidden="true" /> {s.browseExams}
          </Link>
        </div>
      </div>
    </div>
  );
}
