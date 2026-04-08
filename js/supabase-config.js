// ============================================================
// CAMPUSLY — Configuration Supabase
// Remplace tes valeurs depuis : Supabase → Settings → API
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL  = "https://zozffwagdcljgmhlznpd.supabase.co";
const SUPABASE_ANON = "sb_publishable_ZUZ1OnQvHQTDnrnRksoxGA_2KO4Bnd";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;
