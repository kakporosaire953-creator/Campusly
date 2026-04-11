# 🚀 Instructions de Déploiement - À FAIRE MAINTENANT

## ✅ Étape 1: Appliquer la migration SQL (2 minutes)

### Méthode recommandée: Via Supabase Dashboard

1. **Ouvrez votre navigateur** et allez sur: https://app.supabase.com

2. **Sélectionnez votre projet**: `zozffwagdcljgmhlznpd`

3. **Cliquez sur "SQL Editor"** dans le menu de gauche

4. **Copiez TOUT le contenu** du fichier `supabase/migrations/20260410_daily_questions.sql`
   - Le fichier est ouvert dans votre éditeur
   - Sélectionnez tout (Ctrl+A)
   - Copiez (Ctrl+C)

5. **Collez dans l'éditeur SQL** de Supabase
   - Cliquez dans la zone de texte
   - Collez (Ctrl+V)

6. **Cliquez sur le bouton "Run"** (bouton vert en haut à droite)

7. **Attendez le message de succès** ✅
   - Vous devriez voir "Success. No rows returned"
   - Ou un message confirmant la création des tables

## ✅ Étape 2: Vérifier l'installation (1 minute)

Dans le même SQL Editor, exécutez cette requête:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('daily_questions', 'daily_question_answers');
```

**Résultat attendu**: Vous devriez voir 2 lignes:
- daily_questions
- daily_question_answers

## ✅ Étape 3: Tester (2 minutes)

1. **Ouvrez votre application Campusly** dans le navigateur

2. **Connectez-vous** avec votre compte

3. **Allez sur le Dashboard**

4. **Cherchez la section "Question du jour"** (en haut de la page)

5. **Vérifiez qu'une question s'affiche**
   - Si oui: ✅ Tout fonctionne!
   - Si non: Vérifiez que votre profil a une faculté renseignée

6. **Répondez à la question**

7. **Vérifiez que vous avez gagné +10 XP** (si bonne réponse)

8. **Essayez de répondre à nouveau**
   - Vous devriez voir: "Vous avez déjà répondu aujourd'hui"

## 🎉 C'est terminé!

Si tout fonctionne, votre système de questions quotidiennes est maintenant en production!

## 🐛 En cas de problème

### La question ne s'affiche pas
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs
3. Vérifiez que votre profil a une faculté renseignée (Mon profil → Faculté)

### Erreur lors de la migration SQL
1. Vérifiez que vous avez copié TOUT le contenu du fichier
2. Vérifiez qu'il n'y a pas d'erreur de syntaxe
3. Essayez de supprimer les tables existantes si elles existent déjà:
   ```sql
   DROP TABLE IF EXISTS public.daily_question_answers CASCADE;
   DROP TABLE IF EXISTS public.daily_questions CASCADE;
   ```
   Puis réexécutez la migration complète

### "Question indisponible"
1. Vérifiez que l'Edge Function `chat-ai` fonctionne
2. Vérifiez les logs Supabase (Logs → Edge Functions)
3. Réessayez dans quelques secondes

## 📞 Besoin d'aide?

Consultez:
- **DEPLOIEMENT_RAPIDE.md** pour plus de détails
- **test-daily-questions.sql** pour des requêtes de vérification
- Les logs Supabase pour voir les erreurs

---

**Temps total**: ~5 minutes
**Difficulté**: ⭐⭐☆☆☆ (Facile)
