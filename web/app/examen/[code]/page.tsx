import type { Metadata } from "next";
import "@/styles/legacy/pages/exam-room.css";
import "@/styles/app/exam-room.css";
import { ExamRoom } from "@/features/exams/ExamRoom";

export const metadata: Metadata = {
  title: "Salle d'examen",
  description: "Salle d'examen surveillée Campusly — démonstration locale.",
  robots: { index: false, follow: false },
};

export default async function ExamRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ExamRoom code={decodeURIComponent(code)} />;
}
