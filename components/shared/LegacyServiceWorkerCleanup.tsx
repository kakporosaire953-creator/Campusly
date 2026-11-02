"use client";

import { useEffect } from "react";

/**
 * Nettoyage du service worker de l'ancienne version statique.
 *
 * L'ancien site (aujourd'hui archivé dans `legacy/`) enregistrait un service
 * worker PWA (`/sw.js`, cache `campusly-v3.1.0`). Le nouveau frontend n'en
 * embarque aucun : ce service worker n'a donc plus rien à mettre à jour et
 * reste pourtant actif chez les visiteurs déjà venus, où il peut :
 *   - servir des pages HTML et des charges RSC depuis un cache périmé ;
 *   - renvoyer vers `/offline.html`, fichier qui n'existe plus.
 *
 * Ce composant désinstalle ces service workers et supprime les caches
 * `campusly-*` une seule fois par visite. Il n'effectue aucun appel réseau et
 * ne touche à aucune donnée applicative (localStorage compris).
 */
export function LegacyServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const cleanup = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      } catch {
        // Navigateur sans support complet : on n'interrompt jamais l'application.
      }

      if (typeof caches === "undefined") return;
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys.filter((key) => key.startsWith("campusly")).map((key) => caches.delete(key)),
        );
      } catch {
        // Idem : le stockage de cache peut être indisponible (mode privé strict).
      }
    };

    void cleanup();
  }, []);

  return null;
}
