import type { Metadata } from "next";
import { TeacherOverview } from "@/features/dashboard/TeacherOverview";

export const metadata: Metadata = {
  title: "Espace enseignant",
  description: "Centre de pilotage pédagogique : classrooms, devoirs, compositions et suivi des apprenants.",
};

export default function TeacherPage() {
  return <TeacherOverview />;
}
