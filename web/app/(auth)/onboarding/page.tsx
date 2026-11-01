import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/auth/OnboardingFlow";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Personnalisez votre espace Campusly en quelques étapes.",
};

export default function OnboardingPage() {
  return (
    <div className="onboarding-wrap">
      <OnboardingFlow />
    </div>
  );
}
