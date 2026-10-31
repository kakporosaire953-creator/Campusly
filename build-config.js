// ============================================================
// CAMPUSLY — Build Config Generator
// Génère les fichiers de config à partir des variables d'env
// (Exécuté par Vercel lors du déploiement)
// ============================================================

import { writeFileSync } from 'fs';

// Récupère les variables d'environnement Vercel
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://zozffwagdcljgmhlznpd.supabase.co';
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvemZmd2FnZGNsamdtaGx6bnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTU4OTQsImV4cCI6MjA5MTIzMTg5NH0.rTvQd6OqgHE_6VerQVsAwWNlUbwHCm0LLe2j9Z8TwJU';

// Génère supabase.js avec les variables injectées
const supabaseConfig = `// ============================================================
// CAMPUSLY — js/supabase.js
// Client Supabase — source unique de vérité
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL  = "${SUPABASE_URL}";
const SUPABASE_ANON = "${SUPABASE_ANON}";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken:  true,
    persistSession:    true,
    detectSessionInUrl: true,
  },
});

export const FUNCTIONS_URL = \`\${SUPABASE_URL}/functions/v1\`;
`;

try {
  writeFileSync('js/supabase.js', supabaseConfig);
  console.log('✅ js/supabase.js généré avec succès pour Vercel.');
} catch (err) {
  console.error('❌ Erreur lors de la génération de supabase.js :', err);
  process.exit(1);
}
