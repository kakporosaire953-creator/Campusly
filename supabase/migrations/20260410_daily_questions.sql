-- ============================================================
-- CAMPUSLY — Questions quotidiennes par filière
-- ============================================================

-- Table pour stocker les questions quotidiennes générées
create table if not exists public.daily_questions (
  id              uuid primary key default uuid_generate_v4(),
  question_date   date not null,
  faculte         text not null,
  departement     text default '',
  question        text not null,
  options         jsonb not null, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer  int not null,   -- Index de la bonne réponse (0-3)
  explication     text not null,
  matiere         text not null,
  created_at      timestamptz default now(),
  
  -- Une seule question par jour par filière
  unique(question_date, faculte, departement)
);

-- Table pour suivre les réponses des utilisateurs
create table if not exists public.daily_question_answers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.users(id) on delete cascade,
  question_id     uuid references public.daily_questions(id) on delete cascade,
  user_answer     int not null,
  is_correct      boolean not null,
  answered_at     timestamptz default now(),
  
  -- Un utilisateur ne peut répondre qu'une fois par question
  unique(user_id, question_id)
);

-- Index pour améliorer les performances
create index if not exists idx_daily_questions_date_faculte 
  on public.daily_questions(question_date, faculte, departement);
  
create index if not exists idx_daily_question_answers_user 
  on public.daily_question_answers(user_id, answered_at);

-- RLS (Row Level Security)
alter table public.daily_questions enable row level security;
alter table public.daily_question_answers enable row level security;

-- Questions : lecture pour tous les authentifiés
create policy "daily_questions_read" on public.daily_questions
  for select using (auth.role() = 'authenticated');

-- Réponses : propriétaire uniquement
create policy "daily_answers_self" on public.daily_question_answers
  for all using (auth.uid() = user_id);

-- Fonction pour nettoyer les anciennes questions (garder 30 jours)
create or replace function cleanup_old_daily_questions()
returns void as $$
begin
  delete from public.daily_questions
  where question_date < current_date - interval '30 days';
end;
$$ language plpgsql security definer;
