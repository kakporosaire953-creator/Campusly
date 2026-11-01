import type { Metadata } from "next";
import { CreditsCenter } from "@/features/credits/CreditsCenter";

export const metadata: Metadata = {
  title: "Campusly Credits",
  description: "Solde, historique et rechargement de crédits Campusly — simulation.",
};

export default function CreditsPage() {
  return <CreditsCenter />;
}
