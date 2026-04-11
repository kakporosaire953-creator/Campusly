-- Script de vérification rapide de la migration

-- 1. Vérifier que les tables existent
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as nb_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('daily_questions', 'daily_question_answers')
ORDER BY table_name;

-- 2. Vérifier les politiques RLS
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('daily_questions', 'daily_question_answers')
ORDER BY tablename;

-- 3. Vérifier que RLS est activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('daily_questions', 'daily_question_answers');

-- Si tout est OK, vous devriez voir:
-- - 2 tables (daily_questions avec 10 colonnes, daily_question_answers avec 6 colonnes)
-- - 2 politiques RLS (daily_questions_read, daily_answers_self)
-- - RLS activé (rowsecurity = true) pour les 2 tables
