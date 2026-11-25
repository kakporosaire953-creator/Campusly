import { Suspense } from "react";
import { AuthForms } from "@/features/auth/AuthForms";
import { SkeletonCard } from "@/components/ui/States";
import { getMessages } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/types";
import { localeContext, pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata() {
  return pageMetadata("authTitle", "/auth", "description");
}

/** Le squelette de chargement suit la langue : il s'affiche avant le formulaire. */
function AuthSkeleton({ system }: { system: Messages["pages"]["system"] }) {
  return (
    <div className="auth">
      <p className="auth__sr" role="status">
        {system.authLoading}
      </p>
      <div className="auth__bar" aria-hidden="true" />
      <div className="auth__main">
        <div className="auth__card" aria-hidden="true">
          <SkeletonCard lines={7} />
        </div>
      </div>
    </div>
  );
}

export default async function AuthPage() {
  const { locale } = await localeContext();
  const system = getMessages(locale).pages.system;

  return (
    <Suspense fallback={<AuthSkeleton system={system} />}>
      <AuthForms />
    </Suspense>
  );
}
