"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Compatibilité des anciens liens internes.
 * L'ancien `dashboard.html` utilisait des ancres (`#epreuves`, `#revision`…) pour
 * changer de vue. Ces ancres n'arrivent jamais au serveur : ce composant les
 * traduit côté navigateur vers les nouvelles routes, sans casser les liens
 * partagés par les utilisateurs.
 */
const LEGACY_HASHES: Record<string, string> = {
  overview: "/dashboard",
  revision: "/dashboard/revision",
  classrooms: "/dashboard/classrooms",
  composition: "/dashboard/compositions",
  epreuves: "/dashboard/epreuves",
  forum: "/dashboard/forum",
  credits: "/dashboard/credits",
  notifications: "/dashboard/notifications",
  profil: "/dashboard/profil",
  teacher: "/enseignant",
  admin: "/admin",
};

export function LegacyHashRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/dashboard") return;
    const legacy = window.location.hash.replace("#", "").split("?")[0];
    const target = LEGACY_HASHES[legacy];
    if (!target) return;
    window.history.replaceState(null, "", window.location.pathname);
    router.replace(target);
  }, [pathname, router]);

  return null;
}
