// ============================================================
// CAMPUSLY — Build Config Generator
// Génère les fichiers de config à partir des variables d'env
// ============================================================

import { writeFileSync } from 'fs';

// Récupère les variables d'environnement
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || '';
const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = process.env.VITE_FIREBASE_AUTH_DOMAIN || '';
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET = process.env.VITE_FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_MESSAGING_SENDER_ID = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
const FIREBASE_APP_ID = process.env.VITE_FIREBASE_APP_ID || '';

// Génère supabase.js
const supabaseConfig = `// ============================================================
// CAMPUSLY — Configuration Supabase (AUTO-GÉNÉRÉ)
// ⚠️ NE PAS MODIFIER CE FICHIER DIRECTEMENT
// Modifie les variables d'environnement à la place
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL  = "${SUPABASE_URL}";
const SUPABASE_ANON = "${SUPABASE_ANON}";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
export const SUPABASE_FUNCTIONS_URL = \`\${SUPABASE_URL}/functions/v1\`;
`;

// Génère # firebase supprimé
const firebaseConfig = `// ============================================================
// CAMPUSLY — Firebase Config (AUTO-GÉNÉRÉ)
// ⚠️ NE PAS MODIFIER CE FICHIER DIRECTEMENT
// Modifie les variables d'environnement à la place
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "${FIREBASE_API_KEY}",
  authDomain:        "${FIREBASE_AUTH_DOMAIN}",
  projectId:         "${FIREBASE_PROJECT_ID}",
  storageBucket:     "${FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
  appId:             "${FIREBASE_APP_ID}"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");

export { auth, provider, signInWithPopup };
`;

// Écrit les fichiers
writeFileSync('js/supabase.js', supabaseConfig);
writeFileSync('js/# firebase supprimé', firebaseConfig);

console.log('✅ Fichiers de configuration générés avec succès');
