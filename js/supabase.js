// ============================================================
// CAMPUSLY — js/supabase.js
// Client Supabase — source unique de vérité
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ── Coordonnées du projet ─────────────────────────────────────
const SUPABASE_URL  = "https://zozffwagdcljgmhlznpd.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvemZmd2FnZGNsamdtaGx6bnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU4OTQsImV4cCI6MjA5MTIzMTg5NH0.rTvQd6OqgHE_6VerQVsAwWNlUbwHCm0LLe2j9Z8TwJU";

// ── Création du client ────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken:  true,
    persistSession:    true,
    detectSessionInUrl: true, // nécessaire pour le callback OAuth Google
  },
});

// ── URL de base des Edge Functions ───────────────────────────
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
