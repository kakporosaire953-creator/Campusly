-- ============================================================
-- CAMPUSLY — Schéma PostgreSQL Supabase
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ── Profils utilisateurs ─────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  matricule       text unique not null,
  prenom          text not null,
  nom             text not null,
  email           text not null,
  faculte         text not null,
  departement     text default '',
  is_premium      boolean default false,
  premium_expiry  timestamptz,
  quiz_count_today int default 0,
  quiz_reset_date  date default current_date,
  auth_provider   text default 'email',
  xp              int default 0,
  streak          int default 0,
  last_visit      date,
  photo_url       text,
  created_at      timestamptz default now()
);

-- ── Épreuves ─────────────────────────────────────────────────
create table if not exists public.epreuves (
  id          uuid primary key default uuid_generate_v4(),
  titre       text not null,
  faculte     text not null,
  departement text default '',
  semestre    text default '',
  annee       text not null,
  type        text default 'Examen',
  is_premium  boolean default false,
  file_url    text,
  date_ajout  timestamptz default now()
);

-- ── Historique téléchargements ───────────────────────────────
create table if not exists public.history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  epreuve_id  uuid references public.epreuves(id) on delete set null,
  titre       text not null,
  faculte     text default '',
  annee       text default '',
  created_at  timestamptz default now()
);

-- ── Favoris ──────────────────────────────────────────────────
create table if not exists public.favorites (
  user_id     uuid references public.users(id) on delete cascade,
  epreuve_id  uuid references public.epreuves(id) on delete cascade,
  added_at    timestamptz default now(),
  primary key (user_id, epreuve_id)
);

-- ── Résultats quiz ───────────────────────────────────────────
create table if not exists public.quiz_results (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid references public.users(id) on delete cascade,
  sujet     text not null,
  score     int default 0,
  total     int default 0,
  faculte   text default '',
  created_at timestamptz default now()
);

-- ── Transactions paiements ───────────────────────────────────
create table if not exists public.transactions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete set null,
  tx_ref     text,
  flw_ref    text,
  amount     numeric,
  currency   text default 'XOF',
  status     text default 'pending',
  plan       text,
  days       int default 30,
  created_at timestamptz default now()
);

-- ── Forum ────────────────────────────────────────────────────
create table if not exists public.forum_questions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade,
  titre      text not null,
  contenu    text not null,
  faculte    text default '',
  created_at timestamptz default now()
);

create table if not exists public.forum_answers (
  id          uuid primary key default uuid_generate_v4(),
  question_id uuid references public.forum_questions(id) on delete cascade,
  user_id     uuid references public.users(id) on delete cascade,
  contenu     text not null,
  created_at  timestamptz default now()
);

-- ── Groupes d'étude ─────────────────────────────────────────
create table if not exists public.groups (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_by uuid references public.users(id) on delete cascade,
  members    int default 1,
  created_at timestamptz default now()
);

alter table public.groups enable row level security;
create policy "groups_read"   on public.groups for select using (auth.role() = 'authenticated');
create policy "groups_create" on public.groups for insert with check (auth.uid() = created_by);
create policy "groups_update" on public.groups for update using (auth.role() = 'authenticated');

-- ── Contributions ────────────────────────────────────────────
create table if not exists public.contributions (
  id             uuid primary key default uuid_generate_v4(),
  contributor_id uuid references public.users(id) on delete cascade,
  titre          text not null,
  faculte        text not null,
  annee          text not null,
  file_url       text,
  status         text default 'pending',
  created_at     timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.users          enable row level security;
alter table public.epreuves       enable row level security;
alter table public.history        enable row level security;
alter table public.favorites      enable row level security;
alter table public.quiz_results   enable row level security;
alter table public.transactions   enable row level security;
alter table public.forum_questions enable row level security;
alter table public.forum_answers  enable row level security;
alter table public.contributions  enable row level security;

-- Users : lecture/écriture de son propre profil
create policy "users_self" on public.users
  for all using (auth.uid() = id);

-- Épreuves : lecture pour tous les authentifiés
create policy "epreuves_read" on public.epreuves
  for select using (auth.role() = 'authenticated');

-- History : propriétaire uniquement
create policy "history_self" on public.history
  for all using (auth.uid() = user_id);

-- Favorites : propriétaire uniquement
create policy "favorites_self" on public.favorites
  for all using (auth.uid() = user_id);

-- Quiz results : propriétaire uniquement
create policy "quiz_self" on public.quiz_results
  for all using (auth.uid() = user_id);

-- Transactions : lecture propriétaire, écriture interdite côté client
create policy "transactions_read" on public.transactions
  for select using (auth.uid() = user_id);

-- Forum : lecture/création pour tous les authentifiés
create policy "forum_q_read"   on public.forum_questions for select using (auth.role() = 'authenticated');
create policy "forum_q_create" on public.forum_questions for insert with check (auth.uid() = user_id);
create policy "forum_a_read"   on public.forum_answers   for select using (auth.role() = 'authenticated');
create policy "forum_a_create" on public.forum_answers   for insert with check (auth.uid() = user_id);

-- Contributions : création pour tous les authentifiés
create policy "contrib_create" on public.contributions for insert with check (auth.uid() = contributor_id);
create policy "contrib_read"   on public.contributions for select using (auth.uid() = contributor_id);
