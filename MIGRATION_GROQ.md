# Migration vers l'API Groq

## Pourquoi Groq?

- ⚡ **Ultra rapide**: 10x plus rapide que GPT
- 💰 **Moins cher**: Coûts réduits
- 🎯 **Performant**: Modèles Llama 3, Mixtral, Gemma
- 🔓 **Généreux**: Limites plus élevées

## Modèles Groq recommandés

1. **llama-3.3-70b-versatile** (Recommandé)
   - Meilleur rapport qualité/prix
   - Excellent pour les quiz et questions
   - Rapide et précis

2. **mixtral-8x7b-32768**
   - Très rapide
   - Bon pour les conversations

3. **llama-3.1-8b-instant**
   - Ultra rapide
   - Pour les réponses courtes

## Plan de migration

### Étape 1: Créer un compte Groq
1. Allez sur https://console.groq.com
2. Créez un compte gratuit
3. Générez une clé API

### Étape 2: Créer une Edge Function Groq
Créer `supabase/functions/groq-ai/index.ts`

### Étape 3: Mettre à jour les pages
- `revision.html` → Utiliser `/groq-ai` au lieu de `/generate-quiz`
- `chatbot.html` → Utiliser `/groq-ai` au lieu de `/chat-ai`
- `dashboard.html` → Utiliser `/groq-ai` pour les questions

### Étape 4: Tester et déployer

## Avantages

✅ Réponses 10x plus rapides
✅ Coûts réduits de 80%
✅ Limites plus généreuses
✅ Même qualité de réponses
