import type { Metadata } from "next";
import "@/styles/legacy/pages/contribuer.css";
import { Badge } from "@/components/ui/Badge";
import { ContributionForm } from "@/features/exams/ContributionForm";

export const metadata: Metadata = {
  title: "Contribuer",
  description: "Partagez vos épreuves avec la communauté UAC et gagnez des récompenses Campusly.",
};

export default function ContributePage() {
  return (
    <div style={{ paddingTop: 88, minHeight: "100vh", maxWidth: 860, margin: "0 auto", paddingLeft: "5%", paddingRight: "5%", paddingBottom: 60 }}>
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
          <i className="fa-solid fa-upload" aria-hidden="true" /> Contribuer à Campusly
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14 }}>
          Partagez vos épreuves avec la communauté UAC. Chaque contribution aide des milliers d&apos;étudiants à
          mieux préparer leurs examens.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Badge tone="accent" icon="fa-solid fa-star">
            +50 XP par épreuve validée
          </Badge>
          <Badge tone="brand" icon="fa-solid fa-crown">
            1 semaine Premium offerte à 5 contributions
          </Badge>
          <Badge tone="success" icon="fa-solid fa-award">
            Badge « Contributeur » débloqué
          </Badge>
        </div>
        <p style={{ fontSize: "0.76rem", color: "var(--text-3)", marginTop: 12 }}>
          Les récompenses sont annoncées à titre indicatif : aucune attribution réelle n&apos;est effectuée dans
          cette version de démonstration.
        </p>
      </div>

      <ContributionForm />
    </div>
  );
}
