import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FACULTIES } from "@/types";

export const metadata: Metadata = {
  title: "À propos",
  description: "La mission de Campusly : centraliser les ressources académiques de l'UAC.",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: 88, minHeight: "100vh", maxWidth: 800, margin: "0 auto", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="card" style={{ padding: 40, marginBottom: 24 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>À propos de Campusly</h1>
        <p style={{ color: "var(--text-3)", marginBottom: 32 }}>La plateforme académique des étudiants de l&apos;UAC</p>

        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>Notre mission</h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 16 }}>
          Campusly est née d&apos;un constat simple : les étudiants de l&apos;Université d&apos;Abomey-Calavi (UAC)
          au Bénin manquent d&apos;accès facile aux ressources académiques. Anciennes épreuves, supports de cours,
          outils de révision — tout est dispersé et difficile à trouver.
        </p>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 24 }}>
          Notre mission est de centraliser ces ressources et de les rendre accessibles à tous les étudiants de
          l&apos;UAC, quelle que soit leur faculté.
        </p>

        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>Ce que nous offrons</h2>
        <ul style={{ color: "var(--text-2)", lineHeight: 2, marginBottom: 24, paddingLeft: 20 }}>
          <li>
            <i className="fa-solid fa-book" aria-hidden="true" /> Bibliothèque d&apos;anciennes épreuves classées
            par faculté, département et année
          </li>
          <li>
            <i className="fa-solid fa-robot" aria-hidden="true" /> Révision assistée par IA avec quiz personnalisés
          </li>
          <li>
            <i className="fa-solid fa-chart-bar" aria-hidden="true" /> Suivi de progression et statistiques personnelles
          </li>
          <li>
            <i className="fa-solid fa-handshake" aria-hidden="true" /> Plateforme de contribution communautaire
          </li>
          <li>
            <i className="fa-solid fa-mobile-screen" aria-hidden="true" /> Interface mobile installable (PWA)
          </li>
        </ul>

        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>Facultés couvertes</h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 24 }}>
          {FACULTIES.map((faculty) => faculty.code).join(" · ")}
        </p>

        <h2
          id="demonstration"
          style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12, scrollMarginTop: 96 }}
        >
          État actuel : version de démonstration
        </h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 12 }}>
          Cette version présente l&apos;interface complète de Campusly avec des{" "}
          <strong>données fictives</strong>. Les épreuves, classrooms, compositions, crédits et
          notifications servent à parcourir les écrans ; rien n&apos;est enregistré sur un serveur.
        </p>
        <ul style={{ color: "var(--text-2)", lineHeight: 1.8, marginBottom: 24, paddingLeft: 20 }}>
          <li>Les téléchargements de PDF sont simulés (aucun fichier n&apos;est servi).</li>
          <li>Les paiements sont simulés (aucun débit Mobile Money, aucune page FedaPay).</li>
          <li>Les réponses de l&apos;assistant IA proviennent d&apos;une banque locale.</li>
          <li>Les remises de copies et les décisions d&apos;administration restent dans le navigateur.</li>
        </ul>

        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>Contact</h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.8 }}>
          Pour toute question ou suggestion, écrivez-nous via la page{" "}
          <Link href="/contribuer" style={{ color: "var(--brand-1)" }}>
            Contribuer
          </Link>{" "}
          ou à <a href={`mailto:${siteConfig.supportEmail}`} style={{ color: "var(--brand-1)" }}>{siteConfig.supportEmail}</a>.
        </p>
      </div>
    </main>
  );
}
