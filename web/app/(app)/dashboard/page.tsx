import type { Metadata } from "next";
import { RoleHome } from "@/features/dashboard/RoleHome";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Tableau de bord académique de suivi et d'apprentissage Campusly UAC.",
};

export default function DashboardPage() {
  return <RoleHome />;
}
