// ============================================================
// CAMPUSLY — Edge Function: chat-ai
// Chatbot IA académique via Groq (LLaMA 3)
// POST { message: string, history: { role, content }[] }
// ============================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama3-8b-8192";

const SYSTEM_PROMPT = `Tu es CampusBot, l'assistant académique intelligent de la plateforme Campusly.
Tu aides les étudiants de l'Université d'Abomey-Calavi (UAC) au Bénin.
Tu réponds en français, de façon claire, concise et pédagogique.
Tu peux aider avec : les révisions, les explications de cours, les conseils pour les examens,
les méthodes de travail, et les questions sur les épreuves passées.
Si une question sort du domaine académique, redirige poliment.`;

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Lire le corps de la requête ───────────────────────────
    const { message, history = [] } = await req.json();
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message vide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Construire les messages pour Groq ────────────────────
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      // Historique de conversation (max 10 derniers échanges)
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role:    m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

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
        messages,
        max_tokens:  1024,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error ${groqRes.status}: ${errText}`);
    }

    const groqData   = await groqRes.json();
    const botMessage = groqData.choices?.[0]?.message?.content || "Je n'ai pas pu générer une réponse.";

    return new Response(
      JSON.stringify({ reply: botMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[chat-ai] Erreur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur. Réessayez." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
