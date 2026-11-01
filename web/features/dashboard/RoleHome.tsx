"use client";

import { useSession } from "@/features/auth/SessionProvider";
import { LearnerOverview } from "./LearnerOverview";
import { TeacherOverview } from "./TeacherOverview";
import { AdminPanel } from "./AdminPanel";
import { LoadingGrid } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Point d'entrée du tableau de bord : affiche l'espace correspondant au rôle
 * de la session de démonstration. Le rôle ne protège aucun accès — il choisit
 * simplement la vue présentée.
 */
export function RoleHome() {
  const { role, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <PageHeader title="Chargement" subtitle="Ouverture de votre espace…" />
        <LoadingGrid count={4} />
      </div>
    );
  }

  if (role === "admin") return <AdminPanel />;
  if (role === "teacher") return <TeacherOverview />;
  return <LearnerOverview />;
}
