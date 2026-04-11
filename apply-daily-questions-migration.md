# Guide d'application de la migration - Questions Quotidiennes

## Étapes pour appliquer la migration

### Option 1: Via Supabase CLI (Recommandé)

1. Assurez-vous que Supabase CLI est installé et configuré:
```bash
supabase status
```

2. Appliquez la migration:
```bash
supabase db push
```

### Option 2: Via le Dashboard Supabase

1. Connectez-vous à votre projet Supabase: https://app.supabase.com

2. Allez dans **SQL Editor**

3. Copiez le contenu du fichier `supabase/migrations/20260410_daily_questions.sql`

4. Collez-le dans l'éditeur SQL

5. Cliquez sur **Run** pour exécuter la migration

### Option 3: Exécution manuelle

Si vous préférez exécuter les commandes une par une:

```sql
-- 1. Créer la table des questions
create table if not exists public.daily_questions (
  id              uuid primary key default uuid_generate_v4(),
  question_date   date not null,
  faculte         text not null,
  departement     text default '',
  question        text not null,
  options         jsonb not null,
  correct_answer  int not null,
  explication     text not null,
  matiere         text not null,
  created_at      timestamptz default now(),
  unique(question_date, faculte, departement)
);

-- 2. Créer la table des réponses
create table if not exists public.daily_question_answers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  question_id     uuid references public.daily_questions(id) on delete cascade,
  user_answer     int not null,
  is_correct      boolean not null,
  answered_at     timestamptz default now(),
  unique(user_id, question_id)
);

-- 3. Créer les index
create index if not exists idx_daily_questions_date_faculte 
  on public.daily_questions(question_date, faculte, departement);
  
create index if not exists idx_daily_question_answers_user 
  on public.daily_question_answers(user_id, answered_at);

-- 4. Activer RLS
alter table public.daily_questions enable row level security;
alter table public.daily_question_answers enable row level security;

-- 5. Créer les politiques RLS
create policy "daily_questions_read" on public.daily_questions
  for select using (auth.role() = 'authenticated');

create policy "daily_answers_self" on public.daily_question_answers
  for all using (auth.uid() = user_id);

-- 6. Créer la fonction de nettoyage
create or replace function cleanup_old_daily_questions()
returns void as $$
begin
  delete from public.daily_questions
  where question_date < current_date - interval '30 days';
end;
$$ language plpgsql security definer;
```

## Vérification

Après avoir appliqué la migration, vérifiez que tout fonctionne:

```sql
-- Vérifier que les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('daily_questions', 'daily_question_answers');

-- Vérifier les politiques RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('daily_questions', 'daily_question_answers');
```

## Test du système

1. Connectez-vous au dashboard
2. La section "Question du jour" devrait afficher une question
3. Répondez à la question
4. Vérifiez que vous ne pouvez pas répondre à nouveau
5. Revenez demain pour voir une nouvelle question

## Dépannage

### Erreur: "relation already exists"
Les tables existent déjà. Vous pouvez ignorer cette erreur ou supprimer les tables existantes:
```sql
DROP TABLE IF EXISTS public.daily_question_answers CASCADE;
DROP TABLE IF EXISTS public.daily_questions CASCADE;
```
Puis réexécutez la migration.

### Erreur: "permission denied"
Assurez-vous d'être connecté avec un compte ayant les droits d'administration sur la base de données.

### Les questions ne s'affichent pas
1. Vérifiez que l'utilisateur a renseigné sa faculté dans son profil
2. Vérifiez les logs de la console du navigateur (F12)
3. Vérifiez que l'Edge Function `chat-ai` fonctionne correctement

## Configuration du nettoyage automatique (Optionnel)

Pour nettoyer automatiquement les anciennes questions tous les jours:

```sql
-- Nécessite l'extension pg_cron (disponible sur Supabase Pro)
select cron.schedule(
  'cleanup-old-daily-questions',
  '0 2 * * *',  -- Tous les jours à 2h du matin
  'select cleanup_old_daily_questions()'
);
```

Ou exécutez manuellement quand nécessaire:
```sql
select cleanup_old_daily_questions();
```
