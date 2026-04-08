// ============================================================
// CAMPUSLY — auth-guard.js (Supabase)
// ============================================================
import { supabase } from "./supabase-config.js";

export async function requireAuth(onUser) {
  document.body.style.visibility = "hidden";

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.replace("auth.html");
    return;
  }

  document.body.style.visibility = "visible";
  if (typeof onUser === "function") onUser(session.user);
}
