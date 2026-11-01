import type { Metadata } from "next";
import { SubscriptionView } from "@/features/credits/SubscriptionView";

export const metadata: Metadata = {
  title: "Abonnement",
  description: "Formules d'abonnement Campusly et parcours de souscription simulé.",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
