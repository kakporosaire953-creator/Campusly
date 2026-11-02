import type { Metadata } from "next";
import "@/styles/legacy/pages/contribuer.css";
import { Badge } from "@/components/ui/Badge";
import { ContributionForm } from "@/features/exams/ContributionForm";

export const metadata: Metadata = {
  title: "Contribuer",
  description: "Proposez une épreuve à la bibliothèque Campusly : les documents sont vérifiés avant publication.",
};

export default function ContributePage() {
  return (
    <div style={{ paddingTop: 88, minHeight: "100vh", maxWidth: 860, margin: "0 auto", paddingLeft: "5%", paddingRight: "5%", paddingBottom: 60 }}>
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
          <i className="fa-solid fa-upload" aria-hidden="true" /> Contribuer à Campusly
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14 }}>
          Une épreuve, un sujet de TD ou une correction manque dans la bibliothèque ? Proposez-le : chaque
          document est relu avant publication, puis rattaché à sa faculté, son niveau et son année.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Badge tone="brand" icon="fa-solid fa-check">
            Document vérifié avant publication
          </Badge>
          <Badge tone="neutral" icon="fa-solid fa-user-pen">
            Votre nom peut être crédité
          </Badge>
        </div>
      </div>

      <ContributionForm />
    </div>
  );
}
