// ============================================================
// CAMPUSLY — js/supabase.js
// Client Supabase — source unique de vérité
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL  = "https://votre-project.supabase.co";
const SUPABASE_ANON = "votre-anon-key-ici";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken:  true,
    persistSession:    true,
    detectSessionInUrl: true,
  },
});

export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
