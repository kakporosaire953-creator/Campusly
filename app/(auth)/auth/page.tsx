import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForms } from "@/features/auth/AuthForms";
import { SkeletonCard } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Connexion & inscription",
  description: "Connectez-vous ou créez votre compte Campusly (étudiant ou enseignant UAC).",
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="auth">
          <p className="auth__sr" role="status">
            Chargement du formulaire de connexion…
          </p>
          <div className="auth__bar" aria-hidden="true" />
          <div className="auth__main">
            <div className="auth__card" aria-hidden="true">
              <SkeletonCard lines={7} />
            </div>
          </div>
        </div>
      }
    >
      <AuthForms />
    </Suspense>
  );
}
