import { pageMetadata } from "@/lib/i18n/metadata";
import { CreditsCenter } from "@/features/credits/CreditsCenter";

export async function generateMetadata() {
  return pageMetadata("creditsTitle", "/dashboard/credits");
}

export default function CreditsPage() {
  return <CreditsCenter />;
}
