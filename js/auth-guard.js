// ============================================================
// CAMPUSLY — js/auth-guard.js
// Protège les pages réservées aux utilisateurs connectés.
// Utilise getUser() (vérification serveur) plutôt que getSession()
// ============================================================

import { supabase } from "./supabase.js";

/**
 * Redirige vers auth.html si aucune session valide.
 * Sinon, exécute le callback avec l'objet User Supabase.
 *
 * @param {(user: import("@supabase/supabase-js").User) => void} onUser
 */
export async function requireAuth(onUser) {
  // Masquer la page pendant la vérification (évite le flash de contenu)
  document.body.style.visibility = "hidden";

  try {
    // getUser() contacte le serveur Supabase pour valider le token.
    // Plus sécurisé que getSession() qui lit uniquement le localStorage.
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.replace("auth.html");
      return;
    }

    // Session valide — afficher la page et passer l'user au callback
    document.getElementById("body-hidden-guard")?.remove();
    document.body.style.visibility = "visible";

    if (typeof onUser === "function") onUser(user);

  } catch (err) {
    // En cas d'erreur réseau, rediriger par sécurité
    console.error("[auth-guard] Erreur de vérification de session:", err);
    window.location.replace("auth.html");
  }
}
