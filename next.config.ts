import type { NextConfig } from "next";

/**
 * Configuration Next.js — Campusly (phase frontend, sans backend).
 *
 * Contraintes prises en compte :
 *  - Aucune API Route, aucune Server Action métier, aucun accès base de données.
 *  - Compatibilité Cloudflare Workers via l'adaptateur OpenNext (`@opennextjs/cloudflare`).
 *    On désactive donc l'optimiseur d'images auto-hébergé (sharp) et on garde
 *    un build 100 % Node/Edge compatible.
 *  - Les anciennes URLs (`.html`) sont conservées sous forme de redirections
 *    permanentes vers les nouvelles routes App Router.
 *  - Le frontend Next.js occupe désormais la racine du dépôt ; la version
 *    statique historique est archivée dans `legacy/` (référence visuelle).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Le build Cloudflare Workers ne peut pas embarquer sharp.
  images: { unoptimized: true },
  // Autorise la prévisualisation de l'environnement de développement (proxy sandbox)
  // sans jamais ouvrir les Server Actions à des origines inconnues.
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  experimental: {
    // Les Server Actions ne sont pas utilisées dans cette phase.
    serverActions: { allowedOrigins: [] },
  },
  async redirects() {
    return [
      // ── Pages publiques historiques ─────────────────────────────
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/apropos.html", destination: "/a-propos", permanent: true },
      { source: "/conditions.html", destination: "/conditions", permanent: true },
      { source: "/politique.html", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/offline.html", destination: "/offline", permanent: true },

      // ── Authentification ────────────────────────────────────────
      { source: "/auth.html", destination: "/auth", permanent: true },
      { source: "/onboarding.html", destination: "/onboarding", permanent: true },

      // ── Espace applicatif ───────────────────────────────────────
      { source: "/dashboard.html", destination: "/dashboard", permanent: true },
      { source: "/epreuves.html", destination: "/dashboard/epreuves", permanent: true },
      { source: "/forum.html", destination: "/dashboard/forum", permanent: true },
      { source: "/classrooms.html", destination: "/dashboard/classrooms", permanent: true },
      { source: "/composition.html", destination: "/dashboard/compositions", permanent: true },
      { source: "/revision.html", destination: "/dashboard/revision", permanent: true },
      { source: "/chatbot.html", destination: "/assistant-ia", permanent: true },
      { source: "/exam-room.html", destination: "/examen/ALGO1", permanent: true },
      { source: "/contribuer.html", destination: "/contribuer", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },

      // ── Anciennes entrées raccourcies ───────────────────────────
      { source: "/dashboard.html", has: [{ type: "query", key: "view" }], destination: "/dashboard", permanent: false },
      { source: "/examen", destination: "/dashboard/compositions", permanent: false },
      { source: "/404.html", destination: "/404", permanent: true },
    ];
  },
};

export default nextConfig;
