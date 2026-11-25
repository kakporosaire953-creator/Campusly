import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation de la plateforme Campusly.",
};

const SECTIONS = [
  {
    title: "Acceptation des conditions",
    body: "En utilisant Campusly, vous acceptez les présentes conditions. Si vous ne les acceptez pas, n'utilisez pas la plateforme.",
  },
  {
    title: "Utilisation du service",
    body: "Campusly est destiné aux étudiants de l'Université d'Abomey-Calavi. La plateforme s'utilise à des fins académiques légitimes ; le compte est personnel.",
  },
  {
    title: "Contenu et contributions",
    body: "Les épreuves soumises doivent être des documents académiques légitimes. Tout contenu inapproprié, protégé sans autorisation ou trompeur est retiré. La modération reste humaine.",
  },
  {
    title: "Données personnelles",
    body: "Seules les données nécessaires au fonctionnement sont collectées (matricule, faculté, historique d'utilisation). Vous pouvez demander la suppression de votre compte à tout moment.",
  },
  {
    title: "Abonnement Premium",
    body: "Les packs de crédits ne sont pas ouverts : aucun paiement n'est accepté dans cette version, et aucun tarif n'est publié.",
  },
  {
    title: "Limitation de responsabilité",
    body: "Campusly fournit les ressources « en l'état ». L'exactitude et l'exhaustivité des épreuves ne sont pas garanties.",
  },
] as const;

export default function TermsPage() {
  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">Conditions</p>
          <h1 className="ed-display doc__title">
            Conditions <em>d&apos;utilisation.</em>
          </h1>
          <p className="ed-note doc__date">Dernière mise à jour : novembre 2026</p>
        </header>

        <div className="doc__body">
          {SECTIONS.map((section, index) => (
            <section key={section.title}>
              <h2>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}

          <section>
            <h2>
              <span aria-hidden="true">07</span>
              Contact
            </h2>
            <p>
              Pour toute question, utilisez la page <Link href="/contribuer">Contribuer</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
