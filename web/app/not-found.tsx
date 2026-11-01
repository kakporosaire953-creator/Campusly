import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/legacy/pages/404.css";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="not-found">
        <Link href="/" className="logo-text">
          <span className="logo-campus">Campus</span>
          <span className="logo-ly">ly</span>
        </Link>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page introuvable</h1>
        <p className="not-found-desc">
          Oups ! Cette page n&apos;existe pas ou a été déplacée.
          <br />
          Retournez à l&apos;accueil pour continuer votre révision.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house" aria-hidden="true" /> Retour à l&apos;accueil
          </Link>
          <Link href="/dashboard/epreuves" className="btn btn-ghost">
            <i className="fa-solid fa-book" aria-hidden="true" /> Voir les épreuves
          </Link>
        </div>
      </div>
    </div>
  );
}
