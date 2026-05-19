# 🔐 Sécurité Campusly — Guide des clés API

## Architecture de sécurité

```
Navigateur (client)              Supabase Edge Function           APIs externes
──────────────────               ──────────────────────           ─────────────
HTML/JS (public)                 groq-ai/index.ts                 Groq API
  - SUPABASE_URL ✅ public   ──▶  GROQ_API_KEY 🔒 secret    ──▶  IA
  - SUPABASE_ANON ✅ public        (var d'env Supabase)
  - Firebase config ✅ public
```

## Clés et leur niveau de sécurité

| Clé | Où | Public/Secret | Pourquoi |
|-----|----|---------------|----------|
| `SUPABASE_URL` | `js/supabase-config.js` | ✅ Public | Conçu pour être exposé |
| `SUPABASE_ANON` | `js/supabase-config.js` | ✅ Public | Clé "anon" = RLS protège les données |
| Firebase `apiKey` | `js/firebase-config.js` | ✅ Public | Identifiant app, pas un secret |
| `GROQ_API_KEY` | Supabase Edge Function env | 🔒 Secret | Ne JAMAIS mettre côté client |
| `OPENAI_API_KEY` | `functions/.env` (local) | 🔒 Secret | Ne JAMAIS commiter |

## Où mettre les vrais secrets

### 1. Groq API Key → Variables d'environnement Supabase
```bash
# Via CLI Supabase
supabase secrets set GROQ_API_KEY=gsk_votre_cle_ici

# Ou via Dashboard : Supabase → Edge Functions → Secrets
```

### 2. Variables Vercel → Dashboard Vercel
```
https://vercel.com/[votre-projet]/settings/environment-variables
```

### 3. Local → .env (jamais commité)
Copier `.env.example` → `.env` et remplir les vraies valeurs.
