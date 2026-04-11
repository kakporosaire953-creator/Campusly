# Changelog - Système de Questions Quotidiennes

## Version 2.0 - 10 Avril 2026

### 🎯 Nouvelles fonctionnalités

#### Questions personnalisées par filière
- Chaque faculté et département reçoit maintenant des questions adaptées à leur domaine d'études
- Les étudiants de FASEG reçoivent des questions d'économie, gestion, etc.
- Les étudiants de FAST reçoivent des questions de sciences et technologies
- Et ainsi de suite pour toutes les filières

#### Questions uniques et cohérentes
- Tous les étudiants d'une même filière voient la même question chaque jour
- Les questions sont générées une seule fois par jour et par filière
- Plus de questions aléatoires différentes pour chaque utilisateur

#### Stockage en base de données
- Les questions sont maintenant stockées dans Supabase
- Historique des réponses conservé pour chaque utilisateur
- Possibilité d'analyser les statistiques de réponses

#### Système anti-triche amélioré
- Un utilisateur ne peut répondre qu'une fois par jour
- Les réponses sont enregistrées côté serveur (pas seulement localStorage)
- Impossible de répondre plusieurs fois à la même question

### 🔧 Améliorations techniques

#### Architecture
- Nouvelle table `daily_questions` pour stocker les questions
- Nouvelle table `daily_question_answers` pour les réponses
- Index optimisés pour des performances rapides
- Politiques RLS pour la sécurité

#### Interface utilisateur
- Meilleur feedback visuel (vert pour correct, rouge pour incorrect)
- Message clair indiquant qu'on a déjà répondu
- Affichage de la matière et de la date
- Explication détaillée après chaque réponse

#### Récompenses
- +10 XP pour chaque bonne réponse
- XP ajouté automatiquement au profil
- Mise à jour en temps réel de la barre de progression

### 📋 Migration nécessaire

Pour utiliser le nouveau système, vous devez:

1. Appliquer la migration SQL (voir `apply-daily-questions-migration.md`)
2. Le code du dashboard est déjà mis à jour
3. Les anciennes réponses en localStorage seront ignorées

### 🐛 Corrections de bugs

- **Problème**: Les questions changeaient à chaque rechargement de page
  - **Solution**: Questions stockées en base de données avec date unique

- **Problème**: Pas de différenciation par filière
  - **Solution**: Questions générées spécifiquement pour chaque faculté/département

- **Problème**: Possibilité de répondre plusieurs fois
  - **Solution**: Contrainte unique en base de données

### 🔄 Changements de comportement

#### Avant
```javascript
// Question générée à chaque chargement
// Stockée uniquement en localStorage
// Même question pour tous les utilisateurs
```

#### Après
```javascript
// Question générée une fois par jour par filière
// Stockée en base de données Supabase
// Questions différentes selon la faculté/département
// Réponses enregistrées côté serveur
```

### 📊 Nouvelles données disponibles

Vous pouvez maintenant analyser:
- Taux de bonnes réponses par filière
- Questions les plus difficiles
- Engagement quotidien des utilisateurs
- Progression individuelle

### 🚀 Prochaines étapes possibles

- [ ] Système de difficulté progressive
- [ ] Classement des meilleurs scores
- [ ] Séries de questions (streaks)
- [ ] Questions bonus le weekend
- [ ] Notifications push pour rappeler la question du jour
- [ ] Export des statistiques personnelles

### 📝 Notes pour les développeurs

#### Nouvelles fonctions
- `loadDailyQuestion()`: Charge ou génère la question du jour
- `generateDailyQuestion()`: Génère une nouvelle question via IA
- `renderDailyQuestion()`: Affiche la question avec l'état approprié
- `answerDailyQuestion()`: Enregistre la réponse et met à jour l'interface

#### Dépendances
- Supabase client (déjà présent)
- Edge Function `chat-ai` (déjà présente)
- Tables `users` avec champs `faculte` et `departement`

#### Configuration requise
- Les utilisateurs doivent avoir renseigné leur faculté dans leur profil
- L'Edge Function `chat-ai` doit être fonctionnelle
- Les politiques RLS doivent être correctement configurées

### 🔒 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Les utilisateurs ne peuvent voir que leurs propres réponses
- Les questions sont lisibles par tous les utilisateurs authentifiés
- Validation côté serveur des réponses

### 📖 Documentation

- `DAILY_QUESTIONS_SYSTEM.md`: Documentation complète du système
- `apply-daily-questions-migration.md`: Guide de migration
- `supabase/migrations/20260410_daily_questions.sql`: Script de migration

### 🎨 Design

Le design suit le modèle fourni avec:
- Card avec gradient bleu/violet
- Badge "Quotidien" en haut à droite
- Options avec lettres A, B, C, D
- Feedback coloré (vert/rouge)
- Explication détaillée après réponse

### ✅ Tests recommandés

1. Tester avec différentes filières
2. Vérifier qu'on ne peut répondre qu'une fois
3. Vérifier que la question change le lendemain
4. Tester l'ajout de XP
5. Vérifier les permissions RLS
