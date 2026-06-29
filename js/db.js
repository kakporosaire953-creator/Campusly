// ============================================================
// CAMPUSLY — js/db.js
// Couche d'accès aux données Supabase.
// Chaque fonction retourne des données ou lance une Error.
// ── users · epreuves · history · favorites · quiz
//    forum · contributions · transactions
// ============================================================

import { supabase } from "./supabase.js";

// ─────────────────────────────────────────────────────────────
// USERS — Profils utilisateurs
// ─────────────────────────────────────────────────────────────

/**
 * Récupère le profil complet d'un utilisateur.
 * @param {string} uid — UUID Supabase Auth
 */
export async function getProfile(uid) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uid)
    .single();
  if (error) throw new Error(`[db.getProfile] ${error.message}`);
  return data;
}

/**
 * Met à jour les champs d'un profil utilisateur.
 * @param {string} uid
 * @param {Partial<Record<string,any>>} fields
 */
export async function updateProfile(uid, fields) {
  const { error } = await supabase
    .from("users")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", uid);
  if (error) throw new Error(`[db.updateProfile] ${error.message}`);
}

/**
 * Vérifie si l'utilisateur est premium et que l'abonnement est actif.
 * @param {{ is_premium: boolean, premium_expiry: string|null }} profile
 */
export function checkIsPremium(profile) {
  if (!profile?.is_premium || !profile?.premium_expiry) return false;
  return new Date(profile.premium_expiry) > new Date();
}

// ─────────────────────────────────────────────────────────────
// ÉPREUVES
// ─────────────────────────────────────────────────────────────

/**
 * Liste les épreuves avec des filtres optionnels.
 * @param {{ faculte?: string, departement?: string, semestre?: string, annee?: string, isPremium?: boolean, search?: string, limit?: number }} filters
 */
export async function getEpreuves(filters = {}) {
  let query = supabase
    .from("epreuves")
    .select("*")
    .order("date_ajout", { ascending: false });

  if (filters.faculte)     query = query.eq("faculte",     filters.faculte);
  if (filters.departement) query = query.eq("departement", filters.departement);
  if (filters.semestre)    query = query.eq("semestre",    filters.semestre);
  if (filters.annee)       query = query.eq("annee",       filters.annee);
  if (filters.isPremium !== undefined) query = query.eq("is_premium", filters.isPremium);
  if (filters.search)      query = query.ilike("titre",   `%${filters.search}%`);
  if (filters.limit)       query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(`[db.getEpreuves] ${error.message}`);
  return data || [];
}

/**
 * Récupère une épreuve par son ID.
 * @param {string} id
 */
export async function getEpreuveById(id) {
  const { data, error } = await supabase
    .from("epreuves")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(`[db.getEpreuveById] ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────
// HISTORIQUE DES TÉLÉCHARGEMENTS
// ─────────────────────────────────────────────────────────────

/**
 * Enregistre un téléchargement dans l'historique.
 * @param {string} uid
 * @param {{ id: string, titre: string, faculte?: string, annee?: string }} epreuve
 */
export async function saveDownload(uid, epreuve) {
  const { error } = await supabase.from("history").insert({
    user_id:    uid,
    epreuve_id: epreuve.id,
    titre:      epreuve.titre,
    faculte:    epreuve.faculte || "",
    annee:      epreuve.annee   || "",
  });
  if (error) throw new Error(`[db.saveDownload] ${error.message}`);
}

/**
 * Récupère l'historique de téléchargements d'un utilisateur.
 * @param {string} uid
 * @param {number} [limit=50]
 */
export async function getHistory(uid, limit = 50) {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`[db.getHistory] ${error.message}`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// FAVORIS
// ─────────────────────────────────────────────────────────────

/**
 * Ajoute ou retire une épreuve des favoris.
 * @param {string} uid
 * @param {string} epreuveId
 * @param {boolean} add — true = ajouter, false = retirer
 */
export async function toggleFavorite(uid, epreuveId, add) {
  if (add) {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: uid, epreuve_id: epreuveId });
    if (error && !error.message.includes("duplicate")) {
      throw new Error(`[db.toggleFavorite] ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", uid)
      .eq("epreuve_id", epreuveId);
    if (error) throw new Error(`[db.toggleFavorite] ${error.message}`);
  }
}

/**
 * Retourne la liste des IDs d'épreuves favorites d'un utilisateur.
 * @param {string} uid
 * @returns {Promise<string[]>}
 */
export async function getFavorites(uid) {
  const { data, error } = await supabase
    .from("favorites")
    .select("epreuve_id")
    .eq("user_id", uid);
  if (error) throw new Error(`[db.getFavorites] ${error.message}`);
  return (data || []).map((d) => d.epreuve_id);
}

// ─────────────────────────────────────────────────────────────
// QUIZ
// ─────────────────────────────────────────────────────────────

/**
 * Enregistre le résultat d'un quiz.
 * @param {string} uid
 * @param {{ sujet: string, score: number, total: number, faculte?: string }} result
 */
export async function saveQuizResult(uid, result) {
  const { error } = await supabase.from("quiz_results").insert({
    user_id: uid,
    sujet:   result.sujet   || "",
    score:   result.score   ?? 0,
    total:   result.total   ?? 0,
    faculte: result.faculte || "",
  });
  if (error) throw new Error(`[db.saveQuizResult] ${error.message}`);
}

/**
 * Récupère l'historique des quiz d'un utilisateur.
 * @param {string} uid
 * @param {number} [limit=30]
 */
export async function getQuizResults(uid, limit = 30) {
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`[db.getQuizResults] ${error.message}`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// FORUM
// ─────────────────────────────────────────────────────────────

/**
 * Liste les questions du forum, avec auteur joint.
 * @param {{ faculte?: string, limit?: number, offset?: number }} filters
 */
export async function getForumQuestions(filters = {}) {
  let query = supabase
    .from("forum_questions")
    .select(`
      *,
      author:users!user_id (prenom, nom, faculte, photo_url)
    `)
    .order("created_at", { ascending: false });

  if (filters.faculte) query = query.eq("faculte", filters.faculte);
  if (filters.limit)   query = query.limit(filters.limit);
  if (filters.offset)  query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);

  const { data, error } = await query;
  if (error) throw new Error(`[db.getForumQuestions] ${error.message}`);
  return data || [];
}

/**
 * Publie une question sur le forum.
 * @param {string} uid
 * @param {{ titre: string, contenu: string, faculte?: string }} question
 */
export async function postQuestion(uid, question) {
  const { data, error } = await supabase
    .from("forum_questions")
    .insert({ user_id: uid, ...question })
    .select()
    .single();
  if (error) throw new Error(`[db.postQuestion] ${error.message}`);
  return data;
}

/**
 * Récupère les réponses à une question, avec auteur joint.
 * @param {string} questionId
 */
export async function getForumAnswers(questionId) {
  const { data, error } = await supabase
    .from("forum_answers")
    .select(`
      *,
      author:users!user_id (prenom, nom, faculte, photo_url)
    `)
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`[db.getForumAnswers] ${error.message}`);
  return data || [];
}

/**
 * Publie une réponse à une question du forum.
 * @param {string} uid
 * @param {string} questionId
 * @param {string} contenu
 */
export async function postAnswer(uid, questionId, contenu) {
  const { data, error } = await supabase
    .from("forum_answers")
    .insert({ user_id: uid, question_id: questionId, contenu })
    .select()
    .single();
  if (error) throw new Error(`[db.postAnswer] ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────
// CONTRIBUTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Soumet une contribution (épreuve déposée par un étudiant).
 * @param {string} uid
 * @param {{ titre: string, faculte: string, annee: string, file_url?: string }} contribution
 */
export async function submitContribution(uid, contribution) {
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      contributor_id: uid,
      status:         "pending",
      ...contribution,
    })
    .select()
    .single();
  if (error) throw new Error(`[db.submitContribution] ${error.message}`);
  return data;
}

/**
 * Récupère les contributions d'un utilisateur.
 * @param {string} uid
 */
export async function getMyContributions(uid) {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("contributor_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`[db.getMyContributions] ${error.message}`);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// TRANSACTIONS / PAIEMENTS
// ─────────────────────────────────────────────────────────────

/**
 * Récupère les transactions d'un utilisateur (lecture seule côté client).
 * L'écriture se fait uniquement via les Edge Functions webhook.
 * @param {string} uid
 */
export async function getTransactions(uid) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`[db.getTransactions] ${error.message}`);
  return data || [];
}
