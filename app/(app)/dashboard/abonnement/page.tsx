import type { Metadata } from "next";
import { SubscriptionView } from "@/features/credits/SubscriptionView";

export const metadata: Metadata = {
  title: "Abonnement",
  description: "État de l'abonnement Campusly — service pas encore ouvert.",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
