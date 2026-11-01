import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation de la plateforme Campusly.",
};

const SECTIONS = [
  {
    title: "1. Acceptation des conditions",
    body: "En utilisant Campusly, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.",
  },
  {
    title: "2. Utilisation du service",
    body: "Campusly est destiné aux étudiants de l'Université d'Abomey-Calavi. Vous vous engagez à utiliser la plateforme uniquement à des fins académiques légitimes et à ne pas partager votre compte.",
  },
  {
    title: "3. Contenu et contributions",
    body: "Les épreuves soumises doivent être des documents académiques légitimes. Tout contenu inapproprié, protégé par des droits d'auteur sans autorisation ou trompeur sera supprimé. Campusly se réserve le droit de modérer tout contenu soumis.",
  },
  {
    title: "4. Données personnelles",
    body: "Nous collectons uniquement les données nécessaires au fonctionnement du service (matricule, faculté, historique d'utilisation). Ces données ne sont pas partagées avec des tiers. Vous pouvez demander la suppression de votre compte à tout moment.",
  },
  {
    title: "5. Abonnement Premium",
    body: "Les abonnements sont non remboursables une fois activés. En cas de problème technique, contactez le support.",
  },
  {
    title: "6. Limitation de responsabilité",
    body: "Campusly fournit les ressources « en l'état ». Nous ne garantissons pas l'exactitude ou l'exhaustivité des épreuves disponibles. L'utilisation de la plateforme est à vos propres risques.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ paddingTop: 88, minHeight: "100vh", maxWidth: 800, margin: "0 auto", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="card" style={{ padding: 40, marginBottom: 24 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>Conditions d&apos;utilisation</h1>
        <p style={{ color: "var(--text-3)", marginBottom: 32 }}>Dernière mise à jour : novembre 2026</p>
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>{section.title}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 24 }}>{section.body}</p>
          </div>
        ))}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>7. Contact</h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8 }}>
          Pour toute question, utilisez la page{" "}
          <Link href="/contribuer" style={{ color: "var(--brand-1)" }}>
            Contribuer
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
