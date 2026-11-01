import type { Metadata } from "next";
import { CompositionList } from "@/features/compositions/CompositionList";

export const metadata: Metadata = {
  title: "Compositions",
  description: "Évaluations surveillées Campusly : accès par code, minuterie, copies et résultats.",
};

export default function CompositionsPage() {
  return <CompositionList />;
}
