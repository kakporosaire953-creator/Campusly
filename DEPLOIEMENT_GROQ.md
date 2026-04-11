# 🚀 Déploiement de l'Edge Function Groq

## Étape 1: Obtenir une clé API Groq (2 minutes)

1. **Allez sur** https://console.groq.com
2. **Créez un compte** (gratuit)
3. **Générez une clé API**:
   - Cliquez sur "API Keys" dans le menu
   - Cliquez sur "Create API Key"
   - Copiez la clé (elle commence par `gsk_...`)

## Étape 2: Configurer la clé dans Supabase (1 minute)

### Via Dashboard Supabase (Recommandé)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Edge Functions**
4. Cliquez sur **Add secret**
5. Nom: `GROQ_API_KEY`
6. Valeur: Collez votre clé Groq
7. Cliquez sur **Save**

### Via CLI

```bash
.\supabase.exe secrets set GROQ_API_KEY=votre_cle_groq_ici
```

## Étape 3: Déployer la fonction (1 minute)

```bash
.\supabase.exe functions deploy groq-ai
```

## Étape 4: Tester la fonction

### Test 1: Génération de quiz

```bash
curl -X POST https://zozffwagdcljgmhlznpd.supabase.co/functions/v1/groq-ai \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "quiz",
    "sujet": "Microéconomie",
    "faculte": "FASEG",
    "nbQuestions": 5
  }'
```

### Test 2: Chat

```bash
curl -X POST https://zozffwagdcljgmhlznpd.supabase.co/functions/v1/groq-ai \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "chat",
    "messages": [
      {"role": "user", "content": "Explique-moi le PIB"}
    ]
  }'
```

### Test 3: Question quotidienne

```bash
curl -X POST https://zozffwagdcljgmhlznpd.supabase.co/functions/v1/groq-ai \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "daily-question",
    "faculte": "FAST"
  }'
```

## Étape 5: Mettre à jour les pages web

Les fichiers suivants seront automatiquement mis à jour:
- ✅ `revision.html` - Quiz IA
- ✅ `chatbot.html` - Assistant IA
- ✅ `dashboard.html` - Questions quotidiennes

## Vérification

Si tout fonctionne, vous devriez voir:
- ✅ Réponses ultra rapides (< 2 secondes)
- ✅ Quiz générés correctement
- ✅ Chat fonctionnel
- ✅ Questions quotidiennes

## Avantages de Groq

- ⚡ **10x plus rapide** que GPT
- 💰 **Moins cher** (80% d'économies)
- 🎯 **Même qualité** de réponses
- 🔓 **Limites généreuses** (gratuit jusqu'à 14,400 requêtes/jour)

## Modèles disponibles

La fonction utilise automatiquement le meilleur modèle selon le contexte:

- **llama-3.1-8b-instant**: Ultra rapide, réponses courtes
- **llama-3.3-70b-versatile**: Recommandé, meilleur rapport qualité/prix
- **mixtral-8x7b-32768**: Très intelligent, contexte long

## Dépannage

### Erreur "GROQ_API_KEY non configurée"
→ Vérifiez que vous avez bien ajouté le secret dans Supabase

### Erreur 401
→ Vérifiez que l'utilisateur est bien authentifié

### Erreur 429 "Limite atteinte"
→ Normal pour les utilisateurs gratuits (3 quiz/jour)

### Réponse vide ou invalide
→ Vérifiez les logs de la fonction:
```bash
.\supabase.exe functions logs groq-ai
```

## Rollback (si problème)

Si vous voulez revenir à l'ancien système:

1. Les anciennes fonctions sont toujours là
2. Modifiez les URLs dans les pages HTML
3. Redéployez

## Support

- Documentation Groq: https://console.groq.com/docs
- Limites gratuites: https://console.groq.com/docs/rate-limits
- Support Campusly: Consultez le forum

---

**Temps total**: ~5 minutes
**Difficulté**: ⭐⭐☆☆☆ (Facile)
**Coût**: Gratuit (jusqu'à 14,400 requêtes/jour)
