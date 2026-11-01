import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Pied de page — même structure et même ton que la version historique. */
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo-text">
            <span className="logo-campus">Campus</span>
            <span className="logo-ly">ly</span>
          </span>
          <p>
            Accélérez votre parcours universitaire à l&apos;Université d&apos;Abomey-Calavi (UAC) avec des
            outils d&apos;apprentissage de nouvelle génération.
          </p>
          <div style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text-3)" }}>
            Bénin 🇧🇯 · {siteConfig.version}
          </div>
        </div>

        <nav className="footer-col" aria-label="Plateforme">
          <h4>Plateforme</h4>
          <Link href="/dashboard/epreuves">Épreuves &amp; Annales</Link>
          <Link href="/dashboard/revision">Campusly AI</Link>
          <Link href="/dashboard/classrooms">Classrooms</Link>
          <Link href="/dashboard/compositions">Compositions</Link>
          <Link href="/dashboard">Tableau de bord</Link>
        </nav>

        <nav className="footer-col" aria-label="Facultés UAC">
          <h4>Facultés UAC</h4>
          <Link href="/dashboard/epreuves?faculte=FAST">FAST</Link>
          <Link href="/dashboard/epreuves?faculte=FASEG">FASEG</Link>
          <Link href="/dashboard/epreuves?faculte=FADESP">FADESP</Link>
          <Link href="/dashboard/epreuves?faculte=EPAC">EPAC</Link>
          <Link href="/dashboard/epreuves?faculte=FSS">FSS</Link>
        </nav>

        <nav className="footer-col" aria-label="Ressources et légal">
          <h4>Ressources &amp; Légal</h4>
          <Link href="/a-propos">À propos</Link>
          <Link href="/conditions">Conditions Générales</Link>
          <Link href="/politique-de-confidentialite">Confidentialité</Link>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-whatsapp" aria-hidden="true" /> Support WhatsApp
          </a>
        </nav>
      </div>
      <div className="footer-bottom">
        © 2026 Campusly — Conçu pour l&apos;excellence académique à l&apos;UAC.
      </div>
    </footer>
  );
}
