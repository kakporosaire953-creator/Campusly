import type { Metadata } from "next";
import { CreditsCenter } from "@/features/credits/CreditsCenter";

export const metadata: Metadata = {
  title: "Campusly Credits",
  description: "Crédits Campusly : état du service, historique et actions à venir.",
};

export default function CreditsPage() {
  return <CreditsCenter />;
}
