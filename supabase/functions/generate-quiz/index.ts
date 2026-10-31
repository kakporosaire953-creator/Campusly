// ============================================================
// CAMPUSLY — Edge Function: generate-quiz
// Génération de quiz QCM via Groq (LLaMA 3)
// POST { sujet: string, faculte: string, niveau?: string, nombre?: number }
// ============================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_URL    = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL      = "llama3-8b-8192";
const DAILY_LIMIT     = 5;   // quiz gratuits / jour
const PREMIUM_LIMIT   = 30;  // quiz premium / jour

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Vérifier l'authentification ───────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Client avec les droits de l'utilisateur
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Client service_role pour mise à jour du compteur
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Vérifier la limite quotidienne ────────────────────────
    const { data: profile } = await supabaseUser
      .from("users")
      .select("is_premium, premium_expiry, quiz_count_today, quiz_reset_date")
      .eq("id", user.id)
      .single();

    const today = new Date().toISOString().slice(0, 10);
    const isPremium = profile?.is_premium && profile?.premium_expiry
      ? new Date(profile.premium_expiry) > new Date()
      : false;
    const limit = isPremium ? PREMIUM_LIMIT : DAILY_LIMIT;

    // Réinitialiser le compteur si on est un nouveau jour
    let quizCountToday = profile?.quiz_reset_date !== today ? 0 : (profile?.quiz_count_today || 0);

    if (quizCountToday >= limit) {
      return new Response(
        JSON.stringify({
          error: isPremium
            ? `Limite premium atteinte (${PREMIUM_LIMIT} quiz/jour).`
            : `Limite gratuite atteinte (${DAILY_LIMIT} quiz/jour). Passe à Premium !`,
          limitReached: true,
          isPremium,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Lire le corps ─────────────────────────────────────────
    const { sujet, faculte, niveau = "licence", nombre = 10 } = await req.json();
    if (!sujet?.trim()) {
      return new Response(JSON.stringify({ error: "Sujet vide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Prompt de génération ──────────────────────────────────
    const prompt = `Tu es un professeur expert de la faculté ${faculte} à l'Université d'Abomey-Calavi.
Génère exactement ${Math.min(nombre, 20)} questions QCM sur le sujet : "${sujet}" (niveau ${niveau}).

Retourne UNIQUEMENT un tableau JSON valide (aucun texte avant ou après), selon ce format :
[
  {
    "question": "Énoncé de la question ?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Explication courte de la bonne réponse."
  }
]

- correct = index (0-3) de la bonne réponse dans options
- Les questions doivent être variées et pédagogiques
- Niveau adapté aux études universitaires au Bénin`;

    // ── Appel Groq ───────────────────────────────────────────
    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) throw new Error("GROQ_API_KEY non configurée");

    const groqRes = await fetch(GROQ_API_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [{ role: "user", content: prompt }],
        max_tokens:  2048,
        temperature: 0.6,
      }),
    });

    if (!groqRes.ok) {
      throw new Error(`Groq API error: ${groqRes.status}`);
    }

    const groqData = await groqRes.json();
    const rawText  = groqData.choices?.[0]?.message?.content || "[]";

    // ── Parser le JSON retourné par Groq ─────────────────────
    let questions;
    try {
      const match = rawText.match(/\[[\s\S]*\]/);
      questions   = match ? JSON.parse(match[0]) : [];
    } catch {
      throw new Error("Impossible de parser le JSON du quiz");
    }

    // ── Mettre à jour le compteur ─────────────────────────────
    await supabaseAdmin
      .from("users")
      .update({
        quiz_count_today: quizCountToday + 1,
        quiz_reset_date:  today,
      })
      .eq("id", user.id);

    return new Response(
      JSON.stringify({
        questions,
        sujet,
        faculte,
        quizCountToday: quizCountToday + 1,
        limit,
        isPremium,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[generate-quiz] Erreur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur. Réessayez." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
