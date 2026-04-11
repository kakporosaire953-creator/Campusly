# Système de Questions Quotidiennes - Campusly

## Vue d'ensemble

Le système de questions quotidiennes permet aux étudiants de recevoir chaque jour une question personnalisée en fonction de leur filière (faculté et département). Les questions sont générées par IA et stockées dans la base de données pour garantir que tous les étudiants d'une même filière reçoivent la même question chaque jour.

## Fonctionnalités

### 1. Questions personnalisées par filière
- Chaque faculté/département reçoit une question différente
- Les questions sont adaptées au domaine d'études de l'étudiant
- Une nouvelle question est générée automatiquement chaque jour

### 2. Unicité des questions
- Une seule question par jour par filière
- Les étudiants d'une même filière voient la même question
- Les questions sont stockées pendant 30 jours avant d'être supprimées

### 3. Suivi des réponses
- Chaque utilisateur ne peut répondre qu'une fois par jour
- Les réponses sont sauvegardées dans la base de données
- L'historique des réponses est conservé pour les statistiques

### 4. Système de récompenses
- +10 XP pour chaque bonne réponse
- Feedback immédiat avec explication détaillée
- Encouragement à revenir chaque jour

## Architecture technique

### Tables de base de données

#### `daily_questions`
Stocke les questions générées pour chaque jour et filière.

```sql
- id: UUID (clé primaire)
- question_date: DATE (date de la question)
- faculte: TEXT (faculté concernée)
- departement: TEXT (département/filière)
- question: TEXT (texte de la question)
- options: JSONB (tableau des 4 options)
- correct_answer: INT (index de la bonne réponse 0-3)
- explication: TEXT (explication de la réponse)
- matiere: TEXT (nom de la matière)
- created_at: TIMESTAMPTZ
```

Contrainte unique: `(question_date, faculte, departement)`

#### `daily_question_answers`
Enregistre les réponses des utilisateurs.

```sql
- id: UUID (clé primaire)
- user_id: UUID (référence vers users)
- question_id: UUID (référence vers daily_questions)
- user_answer: INT (réponse choisie 0-3)
- is_correct: BOOLEAN (réponse correcte ou non)
- answered_at: TIMESTAMPTZ
```

Contrainte unique: `(user_id, question_id)`

### Flux de fonctionnement

1. **Chargement de la question** (`loadDailyQuestion`)
   - Récupère la date du jour et la filière de l'utilisateur
   - Vérifie si une question existe déjà pour cette date/filière
   - Si non, génère une nouvelle question via l'IA
   - Vérifie si l'utilisateur a déjà répondu
   - Affiche la question avec l'état approprié

2. **Génération de question** (`generateDailyQuestion`)
   - Construit un prompt personnalisé selon la filière
   - Appelle l'API chat-ai pour générer la question
   - Parse la réponse JSON
   - Sauvegarde la question dans la base de données
   - Retourne la question générée

3. **Réponse à la question** (`answerDailyQuestion`)
   - Enregistre la réponse dans la base de données
   - Met à jour l'interface pour montrer la bonne/mauvaise réponse
   - Affiche l'explication
   - Ajoute des XP si la réponse est correcte
   - Empêche de répondre à nouveau

### Sécurité (RLS)

- Les questions sont lisibles par tous les utilisateurs authentifiés
- Les réponses ne sont accessibles qu'à leur propriétaire
- Les politiques RLS empêchent la modification non autorisée

## Maintenance

### Nettoyage automatique
Une fonction `cleanup_old_daily_questions()` est disponible pour supprimer les questions de plus de 30 jours. Cette fonction peut être appelée via un cron job Supabase.

### Configuration du cron job (optionnel)
```sql
-- Exécuter tous les jours à 2h du matin
select cron.schedule(
  'cleanup-old-questions',
  '0 2 * * *',
  'select cleanup_old_daily_questions()'
);
```

## Migration

Pour appliquer le nouveau système:

1. Exécuter la migration SQL:
```bash
supabase db push
```

2. Le dashboard est déjà mis à jour avec le nouveau code

3. Les anciennes questions stockées en localStorage seront ignorées

## Améliorations futures possibles

- Difficulté progressive (facile → difficile)
- Catégories de questions (théorie, pratique, culture)
- Classement des meilleurs scores
- Séries de questions (streaks)
- Questions bonus le weekend
- Export des statistiques personnelles
