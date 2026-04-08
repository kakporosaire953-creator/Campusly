# Déploiement Campusly sur Supabase

## 1. Créer le projet Supabase
- Va sur https://supabase.com → New project
- Note : Project URL + anon key (Settings → API)

## 2. Configurer js/supabase-config.js
Remplace les valeurs :
```js
const SUPABASE_URL  = "https://VOTRE_PROJECT_ID.supabase.co";
const SUPABASE_ANON = "VOTRE_ANON_KEY";
```

## 3. Créer les tables
Dans Supabase → SQL Editor → colle et exécute le contenu de `schema.sql`

## 4. Activer Google OAuth (optionnel)
Supabase → Authentication → Providers → Google
→ Ajoute Client ID + Secret depuis Google Cloud Console

## 5. Installer Supabase CLI
```bash
npm install -g supabase
supabase login
supabase link --project-ref VOTRE_PROJECT_ID
```

## 6. Configurer les secrets des Edge Functions
```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set FLUTTERWAVE_SECRET_HASH=ton_hash
```

## 7. Déployer les Edge Functions
```bash
supabase functions deploy generate-quiz
supabase functions deploy chat-ai
supabase functions deploy flutterwave-webhook
```

## 8. Héberger le site (Netlify — recommandé)
```bash
# Installer Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```
Ton site sera sur : https://ton-site.netlify.app

## 9. Configurer Flutterwave
Dans le dashboard Flutterwave → Webhooks :
URL : https://VOTRE_PROJECT_ID.supabase.co/functions/v1/flutterwave-webhook

## Variables d'environnement Edge Functions
- SUPABASE_URL (auto)
- SUPABASE_SERVICE_ROLE_KEY (auto)
- OPENAI_API_KEY
- FLUTTERWAVE_SECRET_HASH
