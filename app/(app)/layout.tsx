import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LegacyHashRedirect } from "@/components/shared/LegacyHashRedirect";

/**
 * Gabarit de l'espace connecté (étudiant, enseignant, admin).
 * En production, ce layout vérifiera la session serveur. Pour l'instant il
 * s'appuie sur la session locale du navigateur (parcours de connexion conservé
 * et signalé sur /auth).
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <LegacyHashRedirect />
      {children}
    </AppShell>
  );
}
