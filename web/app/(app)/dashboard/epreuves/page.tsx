import type { Metadata } from "next";
import { ExamLibrary } from "@/features/exams/ExamLibrary";

export const metadata: Metadata = {
  title: "Épreuves & annales",
  description: "Bibliothèque d'épreuves de l'UAC : recherche, filtres, favoris et téléchargements.",
};

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ faculte?: string }>;
}) {
  const { faculte } = await searchParams;
  return <ExamLibrary initialFaculty={faculte} />;
}
