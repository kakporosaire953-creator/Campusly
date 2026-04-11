# 🚀 Déploiement Rapide - Questions Quotidiennes

Guide ultra-rapide pour déployer le système de questions quotidiennes en 5 minutes.

## ⚡ Démarrage rapide (5 minutes)

### Étape 1: Appliquer la migration (2 min)

**Option A - Via Supabase Dashboard** (Recommandé pour débutants)
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu
4. Copiez tout le contenu de `supabase/migrations/20260410_daily_questions.sql`
5. Collez dans l'éditeur
6. Cliquez sur **Run** (bouton vert)
7. ✅ Attendez le message de succès

**Option B - Via CLI** (Pour développeurs)
```bash
# Dans le terminal, à la racine du projet
supabase db push
```

### Étape 2: Vérifier l'installation (1 min)

Exécutez cette requête dans le SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('daily_questions', 'daily_question_answers');
```

✅ Vous devriez voir 2 lignes (les 2 tables)

### Étape 3: Tester (2 min)

1. Ouvrez votre application Campusly
2. Connectez-vous avec un compte
3. Allez sur le Dashboard
4. Cherchez la section "Question du jour" (en haut)
5. ✅ Une question devrait s'afficher

Si la question ne s'affiche pas, vérifiez:
- Que votre profil a une faculté renseignée
- Que l'Edge Function `chat-ai` fonctionne
- Les logs de la console (F12)

## 🎯 C'est tout !

Le système est maintenant opérationnel. Les utilisateurs peuvent:
- Voir une question quotidienne personnalisée
- Répondre et gagner des XP
- Voir l'explication après avoir répondu

## 🔍 Vérification rapide

### Test 1: Affichage de la question
- [ ] La question s'affiche
- [ ] Les 4 options sont visibles
- [ ] La matière et la date sont affichées

### Test 2: Réponse
- [ ] Je peux cliquer sur une option
- [ ] La bonne réponse s'affiche en vert
- [ ] L'explication apparaît
- [ ] Les XP sont ajoutés (+10)

### Test 3: Unicité
- [ ] Je ne peux pas répondre à nouveau
- [ ] Le message "Vous avez déjà répondu" s'affiche
- [ ] Les boutons sont désactivés

## 🐛 Problèmes courants

### "Question indisponible"
**Cause**: Edge Function chat-ai ne répond pas
**Solution**: 
1. Vérifiez que l'Edge Function est déployée
2. Vérifiez les logs Supabase
3. Réessayez dans quelques secondes

### "Erreur lors de la sauvegarde"
**Cause**: Problème de permissions RLS
**Solution**:
1. Vérifiez que les politiques RLS sont créées
2. Réexécutez la migration
3. Vérifiez que l'utilisateur est authentifié

### Pas de question affichée
**Cause**: Profil incomplet
**Solution**:
1. Allez dans "Mon profil"
2. Renseignez votre faculté
3. Rechargez la page

## 📊 Monitoring

### Vérifier les questions générées
```sql
SELECT 
  question_date,
  faculte,
  departement,
  matiere,
  LEFT(question, 50) as apercu
FROM daily_questions
ORDER BY question_date DESC
LIMIT 10;
```

### Vérifier les réponses
```sql
SELECT 
  COUNT(*) as total_reponses,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as bonnes_reponses,
  ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*), 2) as taux_reussite
FROM daily_question_answers;
```

### Vérifier l'engagement
```sql
SELECT 
  DATE(answered_at) as date,
  COUNT(DISTINCT user_id) as utilisateurs_actifs,
  COUNT(*) as reponses_totales
FROM daily_question_answers
WHERE answered_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(answered_at)
ORDER BY date DESC;
```

## 🎉 Félicitations !

Votre système de questions quotidiennes est maintenant en production !

### Prochaines étapes recommandées

1. **Communiquer** aux utilisateurs
   - Annoncez la nouvelle fonctionnalité
   - Expliquez comment l'utiliser
   - Encouragez la participation quotidienne

2. **Monitorer** les performances
   - Vérifiez les logs quotidiennement
   - Surveillez le taux de participation
   - Identifiez les problèmes rapidement

3. **Améliorer** progressivement
   - Collectez les retours utilisateurs
   - Ajustez la difficulté des questions
   - Ajoutez de nouvelles fonctionnalités

## 📚 Documentation complète

Pour plus de détails, consultez:
- `DAILY_QUESTIONS_SYSTEM.md` - Documentation technique
- `GUIDE_UTILISATEUR_QUESTIONS.md` - Guide utilisateur
- `CHANGELOG_DAILY_QUESTIONS.md` - Liste des changements
- `test-daily-questions.sql` - Scripts de test

## 💬 Support

Besoin d'aide ?
1. Consultez la FAQ dans `GUIDE_UTILISATEUR_QUESTIONS.md`
2. Vérifiez les logs Supabase
3. Testez avec `test-daily-questions.sql`
4. Contactez le support technique

---

**Temps total de déploiement**: ~5 minutes
**Difficulté**: ⭐⭐☆☆☆ (Facile)
**Prérequis**: Supabase configuré, Edge Function chat-ai active
