# 🧠 Système de Questions Quotidiennes - Campusly

> Un système intelligent de questions quotidiennes personnalisées par filière pour engager les étudiants et renforcer leurs connaissances.

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](CHANGELOG_DAILY_QUESTIONS.md)
[![Status](https://img.shields.io/badge/status-production%20ready-green.svg)](DEPLOIEMENT_RAPIDE.md)
[![Documentation](https://img.shields.io/badge/docs-complete-brightgreen.svg)](INDEX_QUESTIONS_QUOTIDIENNES.md)

## 🎯 Qu'est-ce que c'est ?

Le système de questions quotidiennes permet à chaque étudiant de recevoir **chaque jour** une question personnalisée en fonction de sa filière (faculté et département). Les questions sont générées par IA et adaptées au domaine d'études de l'étudiant.

### ✨ Fonctionnalités principales

- 📚 **Questions personnalisées** par faculté et département
- 🎯 **Une question unique** par jour et par filière
- 🏆 **+10 XP** pour chaque bonne réponse
- 💡 **Explications détaillées** après chaque réponse
- 🔒 **Une seule réponse** par utilisateur et par jour
- 📊 **Suivi des performances** et statistiques

## 🚀 Démarrage rapide

### Installation en 3 étapes (5 minutes)

1. **Appliquer la migration SQL**
   ```bash
   # Via CLI
   supabase db push
   
   # Ou via Dashboard Supabase
   # Copiez le contenu de supabase/migrations/20260410_daily_questions.sql
   # Collez dans SQL Editor et exécutez
   ```

2. **Vérifier l'installation**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('daily_questions', 'daily_question_answers');
   ```

3. **Tester**
   - Connectez-vous à Campusly
   - Allez sur le Dashboard
   - La section "Question du jour" devrait afficher une question

✅ **C'est prêt !** Les utilisateurs peuvent maintenant répondre aux questions quotidiennes.

📖 **Guide détaillé**: [DEPLOIEMENT_RAPIDE.md](DEPLOIEMENT_RAPIDE.md)

## 📚 Documentation

### Pour démarrer
- 🚀 [Guide de déploiement rapide](DEPLOIEMENT_RAPIDE.md) - 5 minutes
- 📑 [Index de la documentation](INDEX_QUESTIONS_QUOTIDIENNES.md) - Navigation

### Documentation technique
- 🔧 [Architecture du système](DAILY_QUESTIONS_SYSTEM.md) - Technique
- 📋 [Résumé de l'implémentation](RESUME_IMPLEMENTATION.md) - Vue d'ensemble
- 📝 [Changelog](CHANGELOG_DAILY_QUESTIONS.md) - Historique des changements

### Guides utilisateur
- 👤 [Guide utilisateur](GUIDE_UTILISATEUR_QUESTIONS.md) - Pour les étudiants
- 📖 [Exemples de questions](EXEMPLES_QUESTIONS_PAR_FILIERE.md) - Par filière

### Tests et maintenance
- 🧪 [Scripts de test](test-daily-questions.sql) - Validation
- 🔄 [Guide de migration](apply-daily-questions-migration.md) - Installation détaillée

## 🎓 Filières supportées

Le système génère des questions adaptées pour toutes les filières de l'UAC:

| Faculté | Exemples de questions |
|---------|----------------------|
| 📊 FASEG | Économie, Gestion, Comptabilité |
| 🔬 FAST | Mathématiques, Physique, Informatique |
| 🏥 FSS | Médecine, Pharmacie, Biologie |
| 🌾 FSA | Agronomie, Zootechnie |
| 📚 FASHS | Sociologie, Psychologie, Histoire |
| 📖 FLLAC | Littérature, Linguistique |
| 🏛️ FADESP | Droit, Science Politique |
| 🏗️ EPAC | Génie Civil, Génie Électrique |
| 🏃 INJEPS | Éducation Physique, Physiologie |
| 🔧 ENEAM | Management, Économie Appliquée |

📖 **Voir les exemples**: [EXEMPLES_QUESTIONS_PAR_FILIERE.md](EXEMPLES_QUESTIONS_PAR_FILIERE.md)

## 🏗️ Architecture

### Base de données

```
daily_questions
├── id (UUID)
├── question_date (DATE)
├── faculte (TEXT)
├── departement (TEXT)
├── question (TEXT)
├── options (JSONB)
├── correct_answer (INT)
├── explication (TEXT)
└── matiere (TEXT)

daily_question_answers
├── id (UUID)
├── user_id (UUID)
├── question_id (UUID)
├── user_answer (INT)
├── is_correct (BOOLEAN)
└── answered_at (TIMESTAMPTZ)
```

### Flux de fonctionnement

```
1. Utilisateur ouvre le dashboard
   ↓
2. Système vérifie si question existe pour aujourd'hui + filière
   ↓
3. Si non → Génère nouvelle question via IA
   ↓
4. Vérifie si utilisateur a déjà répondu
   ↓
5. Affiche question avec état approprié
   ↓
6. Utilisateur répond
   ↓
7. Enregistre réponse + Ajoute XP si correct
   ↓
8. Affiche explication + Empêche nouvelle réponse
```

📖 **Architecture détaillée**: [DAILY_QUESTIONS_SYSTEM.md](DAILY_QUESTIONS_SYSTEM.md)

## 🎮 Gamification

### Récompenses
- ✅ **+10 XP** pour chaque bonne réponse
- 🏆 **Badges** débloqués avec la progression
- 📈 **Niveaux** basés sur l'XP total
- 🔥 **Streak** de révision quotidienne

### Engagement
- 📅 **Une question par jour** encourage la régularité
- 💡 **Explications détaillées** pour apprendre
- 🎯 **Questions adaptées** à la filière
- 📊 **Statistiques** de progression

## 📊 Statistiques

### Métriques disponibles

```sql
-- Taux de réussite par filière
SELECT 
  faculte,
  COUNT(*) as total,
  ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*), 2) as taux
FROM daily_question_answers dqa
JOIN daily_questions dq ON dqa.question_id = dq.id
GROUP BY faculte;

-- Utilisateurs les plus actifs
SELECT 
  u.prenom, u.nom,
  COUNT(*) as questions_repondues,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as bonnes_reponses
FROM daily_question_answers dqa
JOIN users u ON dqa.user_id = u.id
GROUP BY u.id
ORDER BY questions_repondues DESC;
```

📖 **Plus de requêtes**: [test-daily-questions.sql](test-daily-questions.sql)

## 🔒 Sécurité

### Row Level Security (RLS)

- ✅ Questions lisibles par tous les utilisateurs authentifiés
- ✅ Réponses accessibles uniquement à leur propriétaire
- ✅ Contraintes uniques pour éviter les doublons
- ✅ Validation côté serveur

### Politiques implémentées

```sql
-- Questions: lecture pour tous
create policy "daily_questions_read" on daily_questions
  for select using (auth.role() = 'authenticated');

-- Réponses: propriétaire uniquement
create policy "daily_answers_self" on daily_question_answers
  for all using (auth.uid() = user_id);
```

## 🧪 Tests

### Vérification rapide

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('daily_questions', 'daily_question_answers');

-- Vérifier les questions du jour
SELECT faculte, departement, matiere, LEFT(question, 50)
FROM daily_questions
WHERE question_date = CURRENT_DATE;

-- Vérifier les réponses
SELECT COUNT(*) as total, 
       SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correctes
FROM daily_question_answers
WHERE DATE(answered_at) = CURRENT_DATE;
```

📖 **Tests complets**: [test-daily-questions.sql](test-daily-questions.sql)

## 🐛 Dépannage

### Problèmes courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Question ne s'affiche pas | Profil incomplet | Renseigner la faculté dans le profil |
| "Question indisponible" | API IA ne répond pas | Vérifier l'Edge Function chat-ai |
| Erreur de sauvegarde | Permissions RLS | Vérifier les politiques RLS |
| Pas de XP ajoutés | Erreur de mise à jour | Vérifier les logs console |

📖 **Dépannage détaillé**: [DEPLOIEMENT_RAPIDE.md](DEPLOIEMENT_RAPIDE.md#-problèmes-courants)

## 🚀 Prochaines améliorations

### Court terme
- [ ] Indicateur de chargement pendant génération
- [ ] Amélioration des messages d'erreur
- [ ] Animations de transition

### Moyen terme
- [ ] Système de difficulté progressive
- [ ] Catégories de questions (théorie, pratique)
- [ ] Statistiques détaillées dans le profil

### Long terme
- [ ] Classement des meilleurs scores
- [ ] Séries de questions (streaks)
- [ ] Questions bonus le weekend
- [ ] Notifications push
- [ ] Mode compétition entre filières

📖 **Roadmap complète**: [RESUME_IMPLEMENTATION.md](RESUME_IMPLEMENTATION.md#-prochaines-améliorations-possibles)

## 📞 Support

### Pour les développeurs
- 📖 [Documentation technique](DAILY_QUESTIONS_SYSTEM.md)
- 🧪 [Scripts de test](test-daily-questions.sql)
- 📝 [Changelog](CHANGELOG_DAILY_QUESTIONS.md)

### Pour les utilisateurs
- 👤 [Guide utilisateur](GUIDE_UTILISATEUR_QUESTIONS.md)
- 📖 [Exemples de questions](EXEMPLES_QUESTIONS_PAR_FILIERE.md)
- ❓ [FAQ](GUIDE_UTILISATEUR_QUESTIONS.md#-questions-fréquentes)

### Pour les administrateurs
- 🚀 [Guide de déploiement](DEPLOIEMENT_RAPIDE.md)
- 🔄 [Guide de migration](apply-daily-questions-migration.md)
- 📋 [Vue d'ensemble](RESUME_IMPLEMENTATION.md)

## 🤝 Contribution

### Comment contribuer

1. **Améliorer les questions**
   - Proposer de nouveaux exemples
   - Améliorer les explications
   - Ajouter des catégories

2. **Améliorer le code**
   - Optimiser les performances
   - Ajouter des fonctionnalités
   - Corriger des bugs

3. **Améliorer la documentation**
   - Clarifier les guides
   - Ajouter des exemples
   - Traduire en d'autres langues

## 📄 Licence

Ce projet fait partie de Campusly, plateforme académique de l'UAC.

## 🎉 Remerciements

- Équipe Campusly
- Étudiants de l'UAC
- Contributeurs

---

**Version**: 2.0  
**Date**: 10 Avril 2026  
**Status**: ✅ Production Ready

📖 **Navigation**: [INDEX_QUESTIONS_QUOTIDIENNES.md](INDEX_QUESTIONS_QUOTIDIENNES.md)
