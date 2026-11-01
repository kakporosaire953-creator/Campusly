import type { MetadataRoute } from "next";

/**
 * Manifeste PWA.
 * Reprend le manifeste historique (theme_color #1565C0) en corrigeant les
 * chemins d'icônes, qui pointaient vers `/assets/logo.png` (inexistant).
 * Le service worker n'est volontairement PAS enregistré dans cette phase
 * (voir docs/FRONTEND_GUIDE.md §PWA) pour éviter tout cache obsolète.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campusly - Plateforme Étudiante UAC",
    short_name: "Campusly",
    description:
      "Accédez aux épreuves, révisez avec l'IA et rejoignez la communauté étudiante de l'UAC",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#1565C0",
    categories: ["education", "productivity"],
    lang: "fr-BJ",
    dir: "ltr",
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "Épreuves", short_name: "Épreuves", description: "Parcourir les épreuves", url: "/dashboard/epreuves" },
      { name: "Révision IA", short_name: "Révision", description: "Réviser avec l'IA", url: "/dashboard/revision" },
      { name: "Dashboard", short_name: "Dashboard", description: "Mon tableau de bord", url: "/dashboard" },
      { name: "Forum", short_name: "Forum", description: "Forum étudiant", url: "/dashboard/forum" },
    ],
  };
}
