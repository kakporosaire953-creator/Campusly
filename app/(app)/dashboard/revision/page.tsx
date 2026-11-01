import { Suspense } from "react";
import type { Metadata } from "next";
import { RevisionHub } from "@/features/revision/RevisionHub";
import { LoadingGrid } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Campusly AI & révision",
  description: "Générez des quiz et des synthèses, entraînez-vous avec les 5 modes d'apprentissage Campusly.",
};

export default function RevisionPage() {
  return (
    <Suspense fallback={<LoadingGrid count={2} />}>
      <RevisionHub />
    </Suspense>
  );
}
