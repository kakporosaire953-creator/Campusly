import { pageMetadata } from "@/lib/i18n/metadata";
import { SubscriptionView } from "@/features/credits/SubscriptionView";

export async function generateMetadata() {
  return pageMetadata("subscriptionTitle", "/dashboard/abonnement");
}

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
