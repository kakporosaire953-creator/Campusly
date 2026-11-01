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
        <div style={{ maxWidth: 520, margin: "80px auto", padding: 20, minHeight: "70vh" }}>
          <SkeletonCard lines={5} />
        </div>
      }
    >
      <AuthForms />
    </Suspense>
  );
}
