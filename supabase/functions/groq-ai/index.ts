// ============================================================
// CAMPUSLY — Edge Function Groq AI
// Fonction unifiée pour toutes les interactions IA via Groq
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Modèles Groq disponibles
const MODELS = {
  fast: "llama-3.1-8b-instant",        // Ultra rapide, réponses courtes
  balanced: "llama-3.3-70b-versatile", // Recommandé, meilleur rapport qualité/prix
  smart: "mixtral-8x7b-32768",         // Très intelligent, contexte long
};

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Vérifier la clé API Groq
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY non configurée");
    }

    // Parser la requête
    const { mode, messages, sujet, faculte, nbQuestions = 7, model = "balanced" } = await req.json();

    // Vérifier l'authentification Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non authentifié" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier les limites pour les utilisateurs gratuits
    const { data: profile } = await supabaseClient
      .from("users")
      .select("is_premium, premium_expiry, quiz_count_today, quiz_reset_date")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.is_premium && 
                     profile?.premium_expiry && 
                     new Date(profile.premium_expiry) > new Date();

    // Vérifier les limites de quiz pour les utilisateurs gratuits
    if (mode === "quiz" && !isPremium) {
      const today = new Date().toISOString().split("T")[0];
      const resetDate = profile?.quiz_reset_date || "";
      let quizCount = profile?.quiz_count_today || 0;

      // Réinitialiser le compteur si nouveau jour
      if (resetDate !== today) {
        quizCount = 0;
        await supabaseClient
          .from("users")
          .update({ quiz_count_today: 0, quiz_reset_date: today })
          .eq("id", user.id);
      }

      // Limite de 3 quiz gratuits par jour
      if (quizCount >= 3) {
        return new Response(
          JSON.stringify({ 
            error: "Limite de 3 quiz gratuits atteinte",
            message: "Passez Premium pour des quiz illimités !"
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Incrémenter le compteur
      await supabaseClient
        .from("users")
        .update({ quiz_count_today: quizCount + 1 })
        .eq("id", user.id);
    }

    // Sélectionner le modèle Groq
    const selectedModel = MODELS[model as keyof typeof MODELS] || MODELS.balanced;

    // Construire le prompt selon le mode
    let groqMessages: Array<{ role: string; content: string }> = [];

    switch (mode) {
      case "quiz":
        // Générer un quiz
        groqMessages = [
          {
            role: "system",
            content: `Tu es un assistant pédagogique expert qui génère des quiz universitaires de haute qualité. 
Tu dois créer des questions pertinentes, claires et éducatives adaptées au niveau universitaire.
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.`
          },
          {
            role: "user",
            content: `Génère un quiz de ${nbQuestions} questions sur le sujet "${sujet}"${faculte ? ` pour la faculté ${faculte}` : ""}.

Format JSON attendu:
{
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "reponseCorrecte": 0,
      "explication": "Explication détaillée de la bonne réponse"
    }
  ]
}

Règles:
- Questions de niveau universitaire
- 4 options par question (A, B, C, D)
- reponseCorrecte est l'index (0-3)
- Explications claires et pédagogiques
- Variété dans les types de questions`
          }
        ];
        break;

      case "chat":
      case "explain":
        // Chat ou explication
        groqMessages = messages || [
          {
            role: "system",
            content: "Tu es un assistant pédagogique expert qui aide les étudiants universitaires. Réponds de manière claire, structurée et pédagogique en français."
          }
        ];
        break;

      case "daily-question":
        // Question quotidienne
        groqMessages = [
          {
            role: "system",
            content: "Tu es un assistant pédagogique qui génère des questions quotidiennes pour tester les connaissances des étudiants. Réponds UNIQUEMENT avec un JSON valide."
          },
          {
            role: "user",
            content: `Génère UNE seule question de cours universitaire${faculte ? ` pour un étudiant de ${faculte}` : ""}.

Format JSON attendu:
{
  "question": "Texte de la question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "reponseCorrecte": 0,
  "explication": "Explication détaillée",
  "matiere": "Nom de la matière"
}

La question doit être pertinente, éducative et adaptée au niveau universitaire.`
          }
        ];
        break;

      default:
        throw new Error("Mode non supporté");
    }

    // Appeler l'API Groq
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: groqMessages,
        temperature: mode === "quiz" || mode === "daily-question" ? 0.7 : 0.8,
        max_tokens: mode === "quiz" ? 2000 : 1000,
        top_p: 1,
        stream: false,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Erreur Groq:", errorData);
      throw new Error(`Erreur API Groq: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0]?.message?.content || "";

    // Pour les modes quiz et daily-question, parser le JSON
    if (mode === "quiz" || mode === "daily-question") {
      try {
        // Nettoyer le contenu (enlever les backticks markdown si présents)
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanContent);
        
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (parseError) {
        console.error("Erreur parsing JSON:", content);
        throw new Error("Réponse IA invalide");
      }
    }

    // Pour le mode chat/explain, retourner le contenu directement
    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erreur:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erreur serveur",
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
