-- ============================================================
-- CAMPUSLY — Migration 001 : Schéma initial
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- ── Profils utilisateurs ──────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  matricule       text unique not null,
  prenom          text not null,
  nom             text not null,
  email           text not null,
  faculte         text not null default '',
  departement     text default '',
  is_premium      boolean default false,
  premium_expiry  timestamptz,
  auth_provider   text default 'email',  -- 'email' | 'google'
  photo_url       text,
  xp              int default 0,
  streak          int default 0,
  last_visit      date,
  quiz_count_today int default 0,
  quiz_reset_date  date default current_date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Épreuves ─────────────────────────────────────────────────
create table if not exists public.epreuves (
  id          uuid primary key default uuid_generate_v4(),
  titre       text not null,
  faculte     text not null,
  departement text default '',
  semestre    text default '',
  annee       text not null,
  type        text default 'Examen',  -- 'Examen' | 'TD' | 'TP' | 'Partiel'
  is_premium  boolean default false,
  file_url    text,
  date_ajout  timestamptz default now()
);

-- ── Historique téléchargements ───────────────────────────────
create table if not exists public.history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade not null,
  epreuve_id  uuid references public.epreuves(id) on delete set null,
  titre       text not null,
  faculte     text default '',
  annee       text default '',
  created_at  timestamptz default now()
);

-- ── Favoris ──────────────────────────────────────────────────
create table if not exists public.favorites (
  user_id     uuid references public.users(id) on delete cascade not null,
  epreuve_id  uuid references public.epreuves(id) on delete cascade not null,
  added_at    timestamptz default now(),
  primary key (user_id, epreuve_id)
);

-- ── Résultats quiz ───────────────────────────────────────────
create table if not exists public.quiz_results (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade not null,
  sujet      text not null,
  score      int default 0,
  total      int default 0,
  faculte    text default '',
  created_at timestamptz default now()
);

-- ── Transactions paiements ───────────────────────────────────
create table if not exists public.transactions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete set null,
  tx_ref     text unique,
  amount     numeric,
  currency   text default 'XOF',
  status     text default 'pending',  -- 'pending' | 'success' | 'failed'
  plan       text,
  days       int default 30,
  provider   text default 'fedapay',  -- 'fedapay' | 'flutterwave'
  created_at timestamptz default now()
);

-- ── Forum — Questions ────────────────────────────────────────
create table if not exists public.forum_questions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade not null,
  titre      text not null,
  contenu    text not null,
  faculte    text default '',
  views      int default 0,
  created_at timestamptz default now()
);

-- ── Forum — Réponses ─────────────────────────────────────────
create table if not exists public.forum_answers (
  id          uuid primary key default uuid_generate_v4(),
  question_id uuid references public.forum_questions(id) on delete cascade not null,
  user_id     uuid references public.users(id) on delete cascade not null,
  contenu     text not null,
  created_at  timestamptz default now()
);

-- ── Groupes d'étude ──────────────────────────────────────────
create table if not exists public.groups (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_by uuid references public.users(id) on delete cascade not null,
  members    int default 1,
  created_at timestamptz default now()
);

-- ── Contributions étudiantes ─────────────────────────────────
create table if not exists public.contributions (
  id             uuid primary key default uuid_generate_v4(),
  contributor_id uuid references public.users(id) on delete cascade not null,
  titre          text not null,
  faculte        text not null,
  annee          text not null,
  file_url       text,
  status         text default 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at     timestamptz default now()
);

-- ============================================================
-- TRIGGER — Création automatique du profil utilisateur
-- ============================================================
-- Exécuté à chaque inscription dans auth.users.
-- Le profil est créé avec les metadata passées lors du signUp.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_matricule text;
  v_prenom    text;
  v_nom       text;
  v_faculte   text;
  v_dept      text;
  v_provider  text;
  v_photo     text;
begin
  -- Lire les metadata passées lors du signUp
  v_prenom    := coalesce(new.raw_user_meta_data->>'prenom',   split_part(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), ' ', 1), 'Étudiant');
  v_nom       := coalesce(new.raw_user_meta_data->>'nom',      '', '');
  v_faculte   := coalesce(new.raw_user_meta_data->>'faculte',  '');
  v_dept      := coalesce(new.raw_user_meta_data->>'departement', '');
  v_provider  := coalesce(new.raw_user_meta_data->>'provider', 'email');
  v_photo     := coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '');
  v_matricule := coalesce(
    new.raw_user_meta_data->>'matricule',
    upper(left(split_part(new.email, '@', 1), 12))
  );

  insert into public.users (
    id, matricule, prenom, nom, email,
    faculte, departement, is_premium,
    auth_provider, photo_url
  ) values (
    new.id, v_matricule, v_prenom, v_nom, new.email,
    v_faculte, v_dept, false,
    v_provider, v_photo
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Rattacher le trigger à auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.users             enable row level security;
alter table public.epreuves          enable row level security;
alter table public.history           enable row level security;
alter table public.favorites         enable row level security;
alter table public.quiz_results      enable row level security;
alter table public.transactions      enable row level security;
alter table public.forum_questions   enable row level security;
alter table public.forum_answers     enable row level security;
alter table public.groups            enable row level security;
alter table public.contributions     enable row level security;

-- ── users : chaque utilisateur gère uniquement son profil ────
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- ── epreuves : lecture pour tous les authentifiés ─────────────
drop policy if exists "epreuves_select_auth" on public.epreuves;
create policy "epreuves_select_auth" on public.epreuves
  for select using (auth.role() = 'authenticated');

-- ── history : propriétaire uniquement ────────────────────────
drop policy if exists "history_all_own" on public.history;
create policy "history_all_own" on public.history
  for all using (auth.uid() = user_id);

-- ── favorites : propriétaire uniquement ──────────────────────
drop policy if exists "favorites_all_own" on public.favorites;
create policy "favorites_all_own" on public.favorites
  for all using (auth.uid() = user_id);

-- ── quiz_results : propriétaire uniquement ───────────────────
drop policy if exists "quiz_all_own" on public.quiz_results;
create policy "quiz_all_own" on public.quiz_results
  for all using (auth.uid() = user_id);

-- ── transactions : lecture seule pour le propriétaire ────────
-- L'écriture est réservée aux Edge Functions (service_role)
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

-- ── forum_questions : lecture/création pour authentifiés ─────
drop policy if exists "forum_q_select" on public.forum_questions;
create policy "forum_q_select" on public.forum_questions
  for select using (auth.role() = 'authenticated');

drop policy if exists "forum_q_insert" on public.forum_questions;
create policy "forum_q_insert" on public.forum_questions
  for insert with check (auth.uid() = user_id);

drop policy if exists "forum_q_delete_own" on public.forum_questions;
create policy "forum_q_delete_own" on public.forum_questions
  for delete using (auth.uid() = user_id);

-- ── forum_answers : lecture/création pour authentifiés ───────
drop policy if exists "forum_a_select" on public.forum_answers;
create policy "forum_a_select" on public.forum_answers
  for select using (auth.role() = 'authenticated');

drop policy if exists "forum_a_insert" on public.forum_answers;
create policy "forum_a_insert" on public.forum_answers
  for insert with check (auth.uid() = user_id);

drop policy if exists "forum_a_delete_own" on public.forum_answers;
create policy "forum_a_delete_own" on public.forum_answers
  for delete using (auth.uid() = user_id);

-- ── groups : lecture/création pour authentifiés ──────────────
drop policy if exists "groups_select" on public.groups;
create policy "groups_select" on public.groups
  for select using (auth.role() = 'authenticated');

drop policy if exists "groups_insert" on public.groups;
create policy "groups_insert" on public.groups
  for insert with check (auth.uid() = created_by);

drop policy if exists "groups_update" on public.groups;
create policy "groups_update" on public.groups
  for update using (auth.role() = 'authenticated');

-- ── contributions : création/lecture pour le contributeur ────
drop policy if exists "contrib_insert" on public.contributions;
create policy "contrib_insert" on public.contributions
  for insert with check (auth.uid() = contributor_id);

drop policy if exists "contrib_select_own" on public.contributions;
create policy "contrib_select_own" on public.contributions
  for select using (auth.uid() = contributor_id);

-- ============================================================
-- INDEX (performances)
-- ============================================================

create index if not exists idx_epreuves_faculte    on public.epreuves (faculte);
create index if not exists idx_epreuves_annee      on public.epreuves (annee);
create index if not exists idx_epreuves_date       on public.epreuves (date_ajout desc);
create index if not exists idx_history_user        on public.history (user_id, created_at desc);
create index if not exists idx_favorites_user      on public.favorites (user_id);
create index if not exists idx_quiz_user           on public.quiz_results (user_id, created_at desc);
create index if not exists idx_forum_q_created     on public.forum_questions (created_at desc);
create index if not exists idx_forum_a_question    on public.forum_answers (question_id);
create index if not exists idx_transactions_user   on public.transactions (user_id);
create index if not exists idx_contributions_user  on public.contributions (contributor_id);
