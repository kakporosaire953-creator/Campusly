import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/legacy/pages/offline.css";

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false, follow: false },
};

/**
 * Page de secours hors ligne.
 * Elle est statique : elle pourra être mise en cache par un service worker
 * lorsque le mode PWA sera réactivé (voir docs/FRONTEND_GUIDE.md).
 */
export default function OfflinePage() {
  return (
    <div className="offline-page">
      <div className="offline-container">
        <div className="logo-brand">
          <i className="fa-solid fa-graduation-cap" aria-hidden="true" style={{ color: "#1565C0" }} /> Campus
          <span>ly</span>
        </div>
        <div className="offline-icon" aria-hidden="true">
          <i className="fa-solid fa-wifi" />
        </div>
        <h1>Vous êtes hors ligne</h1>
        <p>
          Impossible de joindre Campusly. Vérifiez votre connexion internet pour continuer à réviser.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Réessayer
        </Link>
        <div className="tips">
          <h3>
            <i className="fa-solid fa-lightbulb" aria-hidden="true" style={{ color: "#F57C00" }} /> Conseils
          </h3>
          <ul>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> Vérifiez votre connexion Wi-Fi ou données mobiles
            </li>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> Désactivez le mode avion si activé
            </li>
            <li>
              <i className="fa-solid fa-check" aria-hidden="true" /> Vos données de démonstration restent dans le navigateur
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
