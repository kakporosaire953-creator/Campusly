import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LegacyHashRedirect } from "@/components/shared/LegacyHashRedirect";

/**
 * Gabarit de l'espace connecté (étudiant, enseignant, admin).
 * En production, ce layout vérifiera la session serveur ; en démonstration,
 * il s'appuie sur la session simulée et affiche le bandeau de démonstration.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <LegacyHashRedirect />
      {children}
    </AppShell>
  );
}
