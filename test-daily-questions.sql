-- ============================================================
-- Script de test pour le système de questions quotidiennes
-- ============================================================

-- 1. Vérifier que les tables existent
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('daily_questions', 'daily_question_answers')
ORDER BY table_name;

-- 2. Vérifier les colonnes de daily_questions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'daily_questions'
ORDER BY ordinal_position;

-- 3. Vérifier les colonnes de daily_question_answers
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'daily_question_answers'
ORDER BY ordinal_position;

-- 4. Vérifier les contraintes uniques
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_name IN ('daily_questions', 'daily_question_answers')
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Vérifier les index
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('daily_questions', 'daily_question_answers')
ORDER BY tablename, indexname;

-- 6. Vérifier les politiques RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('daily_questions', 'daily_question_answers')
ORDER BY tablename, policyname;

-- 7. Vérifier que RLS est activé
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('daily_questions', 'daily_question_answers');

-- 8. Insérer une question de test (à exécuter en tant qu'utilisateur authentifié)
-- Remplacez 'FASEG' et 'Economie' par votre faculté/département
/*
INSERT INTO public.daily_questions (
  question_date,
  faculte,
  departement,
  question,
  options,
  correct_answer,
  explication,
  matiere
) VALUES (
  CURRENT_DATE,
  'FASEG',
  'Economie',
  'Qu''est-ce que le PIB ?',
  '["Produit Intérieur Brut", "Produit International Brut", "Prix Intérieur Brut", "Production Industrielle Brute"]'::jsonb,
  0,
  'Le PIB (Produit Intérieur Brut) mesure la valeur totale de tous les biens et services produits dans un pays pendant une période donnée.',
  'Macroéconomie'
)
ON CONFLICT (question_date, faculte, departement) DO NOTHING
RETURNING *;
*/

-- 9. Vérifier les questions existantes
SELECT
  question_date,
  faculte,
  departement,
  matiere,
  LEFT(question, 50) as question_preview,
  correct_answer,
  created_at
FROM public.daily_questions
ORDER BY question_date DESC, faculte, departement
LIMIT 10;

-- 10. Vérifier les réponses des utilisateurs
SELECT
  dqa.answered_at,
  dqa.user_answer,
  dqa.is_correct,
  dq.question_date,
  dq.faculte,
  dq.departement,
  LEFT(dq.question, 50) as question_preview
FROM public.daily_question_answers dqa
JOIN public.daily_questions dq ON dqa.question_id = dq.id
ORDER BY dqa.answered_at DESC
LIMIT 10;

-- 11. Statistiques par faculté
SELECT
  faculte,
  departement,
  COUNT(*) as total_questions,
  MIN(question_date) as premiere_question,
  MAX(question_date) as derniere_question
FROM public.daily_questions
GROUP BY faculte, departement
ORDER BY faculte, departement;

-- 12. Taux de bonnes réponses par faculté
SELECT
  dq.faculte,
  dq.departement,
  COUNT(*) as total_reponses,
  SUM(CASE WHEN dqa.is_correct THEN 1 ELSE 0 END) as bonnes_reponses,
  ROUND(
    100.0 * SUM(CASE WHEN dqa.is_correct THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) as taux_reussite
FROM public.daily_question_answers dqa
JOIN public.daily_questions dq ON dqa.question_id = dq.id
GROUP BY dq.faculte, dq.departement
ORDER BY taux_reussite DESC;

-- 13. Utilisateurs les plus actifs
SELECT
  u.prenom,
  u.nom,
  u.faculte,
  COUNT(*) as questions_repondues,
  SUM(CASE WHEN dqa.is_correct THEN 1 ELSE 0 END) as bonnes_reponses,
  ROUND(
    100.0 * SUM(CASE WHEN dqa.is_correct THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) as taux_reussite
FROM public.daily_question_answers dqa
JOIN public.users u ON dqa.user_id = u.id
GROUP BY u.id, u.prenom, u.nom, u.faculte
ORDER BY questions_repondues DESC
LIMIT 10;

-- 14. Tester la fonction de nettoyage (ne supprime rien si < 30 jours)
SELECT cleanup_old_daily_questions();

-- 15. Vérifier qu'aucune question récente n'a été supprimée
SELECT COUNT(*) as questions_recentes
FROM public.daily_questions
WHERE question_date >= CURRENT_DATE - INTERVAL '30 days';

-- ============================================================
-- Tests de sécurité RLS
-- ============================================================

-- 16. Tester que les questions sont lisibles (doit retourner des résultats)
-- À exécuter en tant qu'utilisateur authentifié
/*
SELECT COUNT(*) as questions_visibles
FROM public.daily_questions;
*/

-- 17. Tester que les réponses des autres ne sont pas visibles
-- À exécuter en tant qu'utilisateur authentifié
-- Doit retourner uniquement VOS réponses
/*
SELECT COUNT(*) as mes_reponses
FROM public.daily_question_answers;
*/

-- ============================================================
-- Nettoyage (si nécessaire)
-- ============================================================

-- Supprimer toutes les questions de test (ATTENTION: supprime TOUTES les questions)
-- DÉCOMMENTER UNIQUEMENT SI VOUS VOULEZ TOUT SUPPRIMER
/*
DELETE FROM public.daily_question_answers;
DELETE FROM public.daily_questions;
*/

-- Supprimer uniquement les questions d'aujourd'hui pour une faculté spécifique
/*
DELETE FROM public.daily_questions
WHERE question_date = CURRENT_DATE
AND faculte = 'FASEG'
AND departement = 'Economie';
*/
