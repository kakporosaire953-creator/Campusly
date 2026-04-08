// ============================================================
// CAMPUSLY — supabase-db.js
// Couche d'accès aux données (remplace firestore.js)
// ============================================================
import { supabase } from "./supabase-config.js";

// ── Profils ──────────────────────────────────────────────────
export async function getUserProfile(uid) {
  const { data } = await supabase.from("users").select("*").eq("id", uid).single();
  return data;
}

export function checkIsPremium(profile) {
  if (!profile?.is_premium || !profile?.premium_expiry) return false;
  return new Date(profile.premium_expiry) > new Date();
}

// ── Épreuves ─────────────────────────────────────────────────
export async function getEpreuves(filters = {}) {
  let query = supabase.from("epreuves").select("*").order("date_ajout", { ascending: false });

  if (filters.faculte)     query = query.eq("faculte",     filters.faculte);
  if (filters.departement) query = query.eq("departement", filters.departement);
  if (filters.semestre)    query = query.eq("semestre",    filters.semestre);
  if (filters.annee)       query = query.eq("annee",       filters.annee);
  if (filters.isPremium !== undefined) query = query.eq("is_premium", filters.isPremium);

  const { data } = await query;
  return data || [];
}

export async function getEpreuveById(id) {
  const { data } = await supabase.from("epreuves").select("*").eq("id", id).single();
  return data;
}

// ── Historique ───────────────────────────────────────────────
export async function saveDownload(uid, epreuve) {
  await supabase.from("history").insert({
    user_id:    uid,
    epreuve_id: epreuve.id,
    titre:      epreuve.titre,
    faculte:    epreuve.faculte || "",
    annee:      epreuve.annee   || "",
  });
}

export async function getDownloadHistory(uid) {
  const { data } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  return data || [];
}

// ── Favoris ──────────────────────────────────────────────────
export async function toggleFavorite(uid, epreuveId, isFav) {
  if (isFav) {
    await supabase.from("favorites").insert({ user_id: uid, epreuve_id: epreuveId });
  } else {
    await supabase.from("favorites").delete().eq("user_id", uid).eq("epreuve_id", epreuveId);
  }
}

export async function getFavorites(uid) {
  const { data } = await supabase.from("favorites").select("epreuve_id").eq("user_id", uid);
  return (data || []).map(d => d.epreuve_id);
}

// ── Quiz ─────────────────────────────────────────────────────
export async function saveQuizResult(uid, result) {
  await supabase.from("quiz_results").insert({
    user_id: uid,
    sujet:   result.sujet   || "",
    score:   result.score   ?? 0,
    total:   result.total   ?? 0,
    faculte: result.faculte || "",
  });
}

export async function getQuizResults(uid) {
  const { data } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  return data || [];
}
