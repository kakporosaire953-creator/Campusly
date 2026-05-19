// ============================================================
// CAMPUSLY — Edge Function : generate-quiz
// Supabase Edge Functions (Deno)
// ============================================================
import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: corsHeaders });

    const { sujet, faculte, nbQuestions = 7 } = await req.json();
    if (!sujet?.trim()) return new Response(JSON.stringify({ error: "Sujet requis" }), { status: 400, headers: corsHeaders });

    const nbQ = Math.min(Math.max(nbQuestions, 5), 10);

    // Vérifier limite quotidienne
    const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
    const today     = new Date().toISOString().slice(0, 10);
    const resetDate = profile?.quiz_reset_date;
    const quizToday = resetDate === today ? (profile?.quiz_count_today || 0) : 0;
    const isPremium = profile?.is_premium && profile?.premium_expiry && new Date(profile.premium_expiry) > new Date();

    if (!isPremium && quizToday >= 3) {
      return new Response(JSON.stringify({ error: "Limite de 3 quiz gratuits atteinte aujourd'hui. Passez Premium." }), { status: 429, headers: corsHeaders });
    }

    // Appel OpenAI
    const prompt = `Tu es un assistant pédagogique pour des étudiants de l'Université d'Abomey-Calavi (Bénin).
Génère un quiz de ${nbQ} questions à choix multiples sur le sujet : "${sujet}"${faculte ? ` (Faculté : ${faculte})` : ""}.
Réponds UNIQUEMENT avec un JSON valide :
{"questions":[{"question":"...","options":["A","B","C","D"],"reponseCorrecte":0,"explication":"..."}]}
Règles : exactement ${nbQ} questions, 4 options, reponseCorrecte = index 0-3, niveau universitaire, en français.`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    const openaiData = await openaiRes.json();
    const quizData   = JSON.parse(openaiData.choices[0].message.content);

    // Mettre à jour le compteur
    await supabase.from("users").update({
      quiz_count_today: quizToday + 1,
      quiz_reset_date:  today,
    }).eq("id", user.id);

    return new Response(JSON.stringify({ questions: quizData.questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500, headers: corsHeaders });
  }
});
