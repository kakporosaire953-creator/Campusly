# Design de la base de données — Cloudflare D1

> **Statut** : conception conceptuelle. **Aucune migration n'est créée ni exécutée**
> dans cette phase. Le fichier historique `supabase/migrations/001_initial_schema.sql`
> (PostgreSQL + RLS) sert de base de travail et **n'est pas supprimé** : il documente
> les 10 tables d'origine et reste la référence de migration.
>
> La base Supabase distante n'est ni modifiée ni supprimée par ce dépôt.

---

## 1. Principes

1. **SQLite (D1)** : pas de types UUID natifs → identifiants `TEXT` (ULID/UUID v7 générés
   côté application), pas de `timestamptz` → `TEXT` ISO-8601 UTC (`2026-11-01T09:30:00Z`),
   pas de `boolean` natif → `INTEGER` 0/1 avec contrainte `CHECK`.
2. **Pas de RLS** : D1 ne dispose pas de Row Level Security. L'autorisation est
   appliquée **dans le Worker** avant chaque requête, avec des requêtes préparées
   systématiquement filtrées par `user_id` / `classroom_id`.
3. **Ledger append-only** pour les crédits : aucune mise à jour de solde en place,
   le solde est la somme des mouvements (avec une colonne `balance_after` pour l'audit).
4. **Idempotence** : toute opération financière porte une clé d'idempotence
   (`payment_intent_id`, `attempt_id`) unique.
5. **Suppression logique** : `deleted_at` sur les contenus modérés plutôt que `DELETE`,
   pour conserver la traçabilité.

---

## 2. Correspondance avec le schéma historique (PostgreSQL → D1)

| Table historique | Table cible | Évolution |
| --- | --- | --- |
| `users` | `users` | rôles explicites, statut enseignant, profil académique |
| `epreuves` | `exams` | + `storage_key` (R2), `pages`, `subject`, `downloads`, `contributor_id` |
| `history` | `exam_history` | + `action` (`view`/`download`) |
| `favorites` | `favorites` | conservée, clé composite |
| `quiz_results` | `quiz_attempts` | + `quiz_payload` JSON, correction détaillée |
| `transactions` | `credit_ledger` | append-only, `reason`, `balance_after`, idempotence |
| `forum_questions` | `forum_threads` | + tags, résolu, épinglé |
| `forum_answers` | `forum_replies` | + réponse acceptée |
| `groups` | `classrooms` + `classroom_members` | séparation classe / appartenance |
| `contributions` | `contributions` | + `review_note`, `reviewer_id`, `storage_key` |

Nouvelles tables nécessaires au périmètre actuel : `subscriptions`, `payment_intents`,
`payment_receipts`, `notifications`, `compositions`, `composition_questions`,
`composition_copies`, `proctor_events`, `audit_log`.

---

## 3. Schéma cible (extrait significatif)

Les types SQLite sont volontairement simples : `TEXT`, `INTEGER`, `REAL`.
`id` est un `TEXT` (ULID) généré par le Worker.

```sql
-- ───────────────────────── Utilisateurs & rôles ─────────────────────────
CREATE TABLE users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  matricule      TEXT UNIQUE,                       -- 8 chiffres UAC
  prenom         TEXT NOT NULL,
  nom            TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'learner'
                 CHECK (role IN ('learner','teacher','admin')),
  teacher_status TEXT NOT NULL DEFAULT 'student'
                 CHECK (teacher_status IN ('student','pending','verified')),
  faculty        TEXT NOT NULL,                     -- code UAC (FAST, FASEG…)
  department     TEXT DEFAULT '',
  title          TEXT,                              -- « Maître-assistant »
  photo_key      TEXT,                              -- clé R2, jamais une URL publique
  xp             INTEGER NOT NULL DEFAULT 0,
  streak_days    INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  deleted_at     TEXT
);

CREATE TABLE user_sessions (                        -- Better Auth (adaptateur)
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_hash    TEXT,
  user_agent TEXT
);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- ───────────────────────────── Épreuves ─────────────────────────────────
CREATE TABLE exams (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  subject        TEXT NOT NULL,
  faculty        TEXT NOT NULL,
  department     TEXT DEFAULT '',
  level          TEXT NOT NULL,                     -- L1…M2
  semester       TEXT NOT NULL CHECK (semester IN ('S1','S2')),
  academic_year  TEXT NOT NULL,                     -- « 2024-2025 »
  type           TEXT NOT NULL CHECK (type IN ('Examen','Partiel','Rattrapage','TD')),
  is_premium     INTEGER NOT NULL DEFAULT 0 CHECK (is_premium IN (0,1)),
  storage_key    TEXT,                              -- objets R2 : exams/<id>.pdf
  pages          INTEGER DEFAULT 0,
  downloads      INTEGER NOT NULL DEFAULT 0,
  contributor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  published_at   TEXT NOT NULL,
  deleted_at     TEXT
);
CREATE INDEX idx_exams_search ON exams(faculty, level, academic_year, type);
CREATE INDEX idx_exams_subject ON exams(subject);

CREATE TABLE favorites (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id    TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, exam_id)
);

CREATE TABLE exam_history (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id    TEXT REFERENCES exams(id) ON DELETE SET NULL,
  action     TEXT NOT NULL CHECK (action IN ('view','download')),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_history_user ON exam_history(user_id, created_at DESC);

-- ──────────────────────────── Classrooms ────────────────────────────────
CREATE TABLE classrooms (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  faculty     TEXT NOT NULL,
  level       TEXT NOT NULL,
  description TEXT DEFAULT '',
  join_code   TEXT NOT NULL UNIQUE,                 -- 6 caractères, rotatif
  owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  archived_at TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE classroom_members (
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member'
               CHECK (role IN ('owner','assistant','member')),
  joined_at    TEXT NOT NULL,
  PRIMARY KEY (classroom_id, user_id)
);

CREATE TABLE classroom_posts (
  id           TEXT PRIMARY KEY,
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  author_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  pinned       INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0,1)),
  created_at   TEXT NOT NULL
);

-- ──────────────────────────── Compositions ──────────────────────────────
CREATE TABLE compositions (
  id               TEXT PRIMARY KEY,
  classroom_id     TEXT REFERENCES classrooms(id) ON DELETE SET NULL,
  owner_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  subject          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','scheduled','live','closed','graded')),
  duration_minutes INTEGER NOT NULL,
  total_points     REAL NOT NULL,
  pass_mark        REAL NOT NULL DEFAULT 10,
  proctoring       TEXT NOT NULL DEFAULT 'standard'
                   CHECK (proctoring IN ('standard','strict')),
  attempts_allowed INTEGER NOT NULL DEFAULT 1,
  opens_at         TEXT NOT NULL,
  closes_at        TEXT NOT NULL,
  created_at       TEXT NOT NULL
);

CREATE TABLE composition_questions (
  id                   TEXT PRIMARY KEY,
  composition_id       TEXT NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  position             INTEGER NOT NULL,
  type                 TEXT NOT NULL CHECK (type IN ('qcm','true_false','open')),
  prompt               TEXT NOT NULL,
  options_json         TEXT,                        -- JSON : string[]
  correct_option_index INTEGER,
  correct_boolean      INTEGER,
  keywords_json        TEXT,
  points               REAL NOT NULL,
  explanation          TEXT
);
CREATE INDEX idx_questions_composition ON composition_questions(composition_id, position);

CREATE TABLE composition_copies (
  id               TEXT PRIMARY KEY,
  composition_id   TEXT NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at     TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  answers_json     TEXT NOT NULL,                   -- QuizAnswerInput[]
  score_on_20      REAL,                            -- NULL tant que non corrigé
  validation       TEXT NOT NULL DEFAULT 'pending_review'
                   CHECK (validation IN ('auto_graded','pending_review','validated')),
  validated_by     TEXT REFERENCES users(id) ON DELETE SET NULL,
  validated_at     TEXT,
  feedback         TEXT,
  UNIQUE (composition_id, user_id, submitted_at)
);

CREATE TABLE proctor_events (                       -- journal d'intégrité
  id              TEXT PRIMARY KEY,
  copy_id         TEXT NOT NULL REFERENCES composition_copies(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  occurred_at     TEXT NOT NULL
);

-- ───────────────────────── Crédits & paiements ──────────────────────────
CREATE TABLE credit_ledger (                        -- append-only
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL,                   -- négatif = consommation
  reason        TEXT NOT NULL
                CHECK (reason IN ('signup_bonus','ai_analysis','quiz_generation',
                                  'exam_download','topup','refund','admin_adjustment')),
  label         TEXT NOT NULL,
  balance_after INTEGER NOT NULL,
  idempotency_key TEXT UNIQUE,                      -- anti double-débit
  created_at    TEXT NOT NULL
);
CREATE INDEX idx_ledger_user ON credit_ledger(user_id, created_at DESC);

CREATE TABLE subscriptions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id    TEXT NOT NULL,                         -- plan-week / plan-month / plan-quarter
  starts_at  TEXT NOT NULL,
  ends_at    TEXT NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('active','expired','cancelled')),
  created_at TEXT NOT NULL
);

CREATE TABLE payment_intents (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider       TEXT NOT NULL CHECK (provider IN ('mtn_momo','moov_money','card')),
  amount_xof     INTEGER NOT NULL,
  pack_id        TEXT,
  plan_id        TEXT,
  status         TEXT NOT NULL
                 CHECK (status IN ('pending','processing','succeeded','failed','cancelled')),
  fedapay_ref    TEXT UNIQUE,
  idempotency_key TEXT UNIQUE,
  created_at     TEXT NOT NULL,
  expires_at     TEXT NOT NULL
);

CREATE TABLE payment_receipts (
  id          TEXT PRIMARY KEY,
  intent_id   TEXT NOT NULL REFERENCES payment_intents(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reference   TEXT NOT NULL UNIQUE,
  amount_xof  INTEGER NOT NULL,
  credits_granted INTEGER,
  paid_at     TEXT NOT NULL
);

-- ──────────────────── Notifications, forum, audit ───────────────────────
CREATE TABLE notifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  href       TEXT,
  read_at    TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

CREATE TABLE forum_threads (
  id         TEXT PRIMARY KEY,
  author_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  faculty    TEXT,
  tags_json  TEXT,
  views      INTEGER NOT NULL DEFAULT 0,
  solved_at  TEXT,
  pinned     INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0,1)),
  status     TEXT NOT NULL DEFAULT 'published'
             CHECK (status IN ('published','pending','hidden')),
  created_at TEXT NOT NULL
);

CREATE TABLE forum_replies (
  id         TEXT PRIMARY KEY,
  thread_id  TEXT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  accepted   INTEGER NOT NULL DEFAULT 0 CHECK (accepted IN (0,1)),
  created_at TEXT NOT NULL
);

CREATE TABLE contributions (
  id             TEXT PRIMARY KEY,
  contributor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  faculty        TEXT NOT NULL,
  academic_year  TEXT NOT NULL,
  storage_key    TEXT,
  file_name      TEXT,
  file_size      INTEGER,
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','approved','rejected')),
  reviewer_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  review_note    TEXT,
  reviewed_at    TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE audit_log (                            -- actions sensibles
  id         TEXT PRIMARY KEY,
  actor_id   TEXT,
  action     TEXT NOT NULL,                         -- 'payment.succeeded', 'copy.validated'…
  target     TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
```

---

## 4. Contraintes de cohérence

| Règle | Moyen |
| --- | --- |
| Un abonné ne paie pas de crédits | vérification Worker : `subscriptions` active → `creditsSpent = 0` |
| Double clic sur « payer » | `payment_intents.idempotency_key` unique |
| Double débit IA | `credit_ledger.idempotency_key` unique (`ai:<attemptId>`) |
| Une seule copie par tentative | contrainte `UNIQUE` sur `composition_copies` |
| Note officielle uniquement après validation | `score_on_20` exposé seulement si `validation = 'validated'` |
| Code de classroom unique et court | `classrooms.join_code` unique, rotation sur demande |
| Modération traçable | `contributions.reviewer_id` + `audit_log` |

---

## 5. Volumétrie et stratégie D1

- Ordre de grandeur cible : ~50 000 utilisateurs, ~20 000 épreuves, ~500 000 lignes
  d'historique → largement dans les limites D1 (10 Go par base).
- **Ne jamais stocker de fichier en D1** : les PDF vivent dans R2, la base conserve la
  clé (`storage_key`).
- Compteurs très sollicités (`exams.downloads`, `forum_threads.views`) : écriture
  différée par lot via Upstash (une écriture par minute et par objet) plutôt qu'un
  `UPDATE` par requête.
- Lecture des épreuves : index composite `(faculty, level, academic_year, type)` +
  cache Redis 60 s sur les listes publiques.
- Archives : les copies de plus de 3 ans peuvent migrer vers un export R2 (JSONL),
  D1 ne conservant que les métadonnées.

---

## 6. Migration depuis Supabase (plan, non exécuté)

1. Export SQL/CSV des 10 tables historiques depuis Supabase (opération manuelle,
   hors de ce dépôt — **la base distante n'est pas touchée par le code**).
2. Transformation des identifiants (`uuid` conservés tels quels) et des dates
   (`timestamptz` → ISO-8601 `TEXT`).
3. Mapping des colonnes françaises vers les noms cibles (§2) via un script de migration
   idempotent (à écrire dans une phase backend).
4. Vérification : `COUNT(*)` par table, échantillon de 100 lignes comparées,
   contrôle des doublons d'e-mail et de matricule.
5. Bascule en deux temps : double lecture (Supabase en lecture seule) puis D1 seule.

Aucune de ces étapes n'est réalisée dans la phase actuelle : ce document sert de
référence pour la phase backend.
