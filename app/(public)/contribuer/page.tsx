import type { Metadata } from "next";
import "@/styles/legacy/pages/contribuer.css";
import { ContributionForm } from "@/features/exams/ContributionForm";

export const metadata: Metadata = {
  title: "Contribuer",
  description: "Proposez une épreuve à la bibliothèque Campusly : les documents sont vérifiés avant publication.",
};

export default function ContributePage() {
  return (
    <div className="doc">
      <div className="ed-rail">
        <header className="doc__head">
          <p className="ed-eyebrow">Bibliothèque</p>
          <h1 className="ed-display doc__title">
            Contribuer <em>à Campusly.</em>
          </h1>
          <p className="ed-lede doc__lede">
            Une épreuve, un sujet de TD ou une correction manque&nbsp;? Proposez-le : chaque
            document est relu avant publication, puis rattaché à sa faculté, son niveau et son
            année. Votre nom peut être crédité.
          </p>
        </header>

        <div className="doc__body doc__body--form">
          <ContributionForm />
        </div>
      </div>
    </div>
  );
}
