// ============================================================
// CAMPUSLY — Edge Function : chat-ai
// ============================================================
// @ts-nocheck
import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  quiz:    "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Quand on te demande un quiz, génère EXACTEMENT 50 questions à choix multiples. Réponds UNIQUEMENT avec un JSON valide : {\"questions\":[{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"reponseCorrecte\":0,\"explication\":\"...\"}]}",
  explain: "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Tu fournis des explications très détaillées avec des exemples concrets adaptés au contexte béninois.",
  chat:    "Tu es un assistant pédagogique expert pour les étudiants de l'UAC au Bénin. Tu es conversationnel, précis et encourageant.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (error || !user) return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: corsHeaders });

    const { messages, mode = "chat" } = await req.json();
    if (!messages || !Array.isArray(messages)) return new Response(JSON.stringify({ error: "Messages invalides" }), { status: 400, headers: corsHeaders });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat },
          ...messages.slice(-20),
        ],
        temperature: 0.7,
        max_tokens: mode === "quiz" ? 12000 : 2000,
      }),
    });

    const data = await openaiRes.json();
    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500, headers: corsHeaders });
  }
});
