// ============================================================
// CAMPUSLY — Configuration Supabase
// Remplace tes valeurs depuis : Supabase → Settings → API
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL  = "https://zozffwagdcljgmhlznpd.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvemZmd2FnZGNsamdtaGx6bnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU4OTQsImV4cCI6MjA5MTIzMTg5NH0.rTvQd6OqgHE_6VerQVsAwWNlUbwHCm0LLe2j9Z8TwJU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
