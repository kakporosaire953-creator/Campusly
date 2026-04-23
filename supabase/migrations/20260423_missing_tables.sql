-- ============================================================
-- CAMPUSLY — Migration Tables Manquantes
-- Date: 23 Avril 2026
-- Description: Création des tables manquantes pour les fonctionnalités avancées
-- ============================================================

-- 1. Table des groupes d'étude
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  faculte TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  members INTEGER DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_groups_faculte ON groups(faculte);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at DESC);

-- 2. Table des membres des groupes
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);

-- 3. Table des plans de révision
CREATE TABLE IF NOT EXISTS revision_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Mon plan de révision',
  matieres JSONB NOT NULL,
  plan JSONB NOT NULL,
  start_date DATE NOT NULL,
  hours_per_day INTEGER DEFAULT 2,
  progress INTEGER DEFAULT 0, -- Pourcentage de complétion
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes utilisateur
CREATE INDEX IF NOT EXISTS idx_revision_plans_user ON revision_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_revision_plans_active ON revision_plans(user_id, is_active);

-- 4. Table des jours de révision complétés
CREATE TABLE IF NOT EXISTS revision_plan_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES revision_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(plan_id, date)
);

-- Index pour les requêtes de progression
CREATE INDEX IF NOT EXISTS idx_revision_progress_plan ON revision_plan_progress(plan_id);
CREATE INDEX IF NOT EXISTS idx_revision_progress_date ON revision_plan_progress(date);

-- 5. Table des examens utilisateur
CREATE TABLE IF NOT EXISTS user_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  matiere TEXT,
  exam_date DATE NOT NULL,
  faculte TEXT,
  departement TEXT,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes utilisateur et dates
CREATE INDEX IF NOT EXISTS idx_user_exams_user ON user_exams(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exams_date ON user_exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_user_exams_user_date ON user_exams(user_id, exam_date);

-- 6. Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XOF',
  duration_days INTEGER NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'successful', 'failed', 'cancelled'
  payment_method TEXT, -- 'mobilemoney', 'card'
  transaction_id TEXT UNIQUE,
  flutterwave_tx_ref TEXT UNIQUE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes de paiement
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_tx_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 7. Table des notifications (pour futures fonctionnalités)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'exam_reminder', 'revision_reminder', 'achievement', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les notifications non lues
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ============================================================

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables concernées
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_revision_plans_updated_at ON revision_plans;
CREATE TRIGGER update_revision_plans_updated_at BEFORE UPDATE ON revision_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_exams_updated_at ON user_exams;
CREATE TRIGGER update_user_exams_updated_at BEFORE UPDATE ON user_exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies pour groups (lecture publique, écriture authentifiée)
CREATE POLICY "Tout le monde peut voir les groupes" ON groups
    FOR SELECT USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent créer des groupes" ON groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Créateurs peuvent modifier leurs groupes" ON groups
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Créateurs peuvent supprimer leurs groupes" ON groups
    FOR DELETE USING (auth.uid() = created_by);

-- Policies pour group_members
CREATE POLICY "Membres peuvent voir leurs groupes" ON group_members
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent rejoindre des groupes" ON group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent quitter leurs groupes" ON group_members
    FOR DELETE USING (auth.uid() = user_id);

-- Policies pour revision_plans
CREATE POLICY "Utilisateurs voient leurs plans" ON revision_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs plans" ON revision_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs plans" ON revision_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs plans" ON revision_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Policies pour revision_plan_progress
CREATE POLICY "Utilisateurs voient leur progression" ON revision_plan_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leur progression" ON revision_plan_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leur progression" ON revision_plan_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies pour user_exams
CREATE POLICY "Utilisateurs voient leurs examens" ON user_exams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs créent leurs examens" ON user_exams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs examens" ON user_exams
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs examens" ON user_exams
    FOR DELETE USING (auth.uid() = user_id);

-- Policies pour payments (lecture seule pour l'utilisateur)
CREATE POLICY "Utilisateurs voient leurs paiements" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Policies pour notifications
CREATE POLICY "Utilisateurs voient leurs notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs modifient leurs notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateurs suppriment leurs notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FONCTIONS UTILITAIRES
-- ============================================================

-- Fonction pour calculer la progression d'un plan de révision
CREATE OR REPLACE FUNCTION calculate_plan_progress(plan_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    total_days INTEGER;
    completed_days INTEGER;
    progress_pct INTEGER;
BEGIN
    -- Compter le nombre total de jours dans le plan
    SELECT COUNT(*) INTO total_days
    FROM revision_plan_progress
    WHERE plan_id = plan_id_param;
    
    -- Compter le nombre de jours complétés
    SELECT COUNT(*) INTO completed_days
    FROM revision_plan_progress
    WHERE plan_id = plan_id_param AND completed = true;
    
    -- Calculer le pourcentage
    IF total_days > 0 THEN
        progress_pct := ROUND((completed_days::DECIMAL / total_days::DECIMAL) * 100);
    ELSE
        progress_pct := 0;
    END IF;
    
    -- Mettre à jour la table revision_plans
    UPDATE revision_plans
    SET progress = progress_pct, updated_at = NOW()
    WHERE id = plan_id_param;
    
    RETURN progress_pct;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION create_notification(
    user_id_param UUID,
    type_param TEXT,
    title_param TEXT,
    message_param TEXT,
    link_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (user_id_param, type_param, title_param, message_param, link_param)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- DONNÉES DE TEST (optionnel, à commenter en production)
-- ============================================================

-- Insérer quelques groupes de test
-- INSERT INTO groups (name, faculte, description) VALUES
-- ('Groupe FASEG S3', 'FASEG', 'Groupe d''entraide pour les étudiants de FASEG Semestre 3'),
-- ('FAST Informatique', 'FAST', 'Groupe des étudiants en informatique'),
-- ('FSS Médecine', 'FSS', 'Groupe des étudiants en médecine');

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE 'Migration 20260423_missing_tables.sql exécutée avec succès!';
    RAISE NOTICE 'Tables créées: groups, group_members, revision_plans, revision_plan_progress, user_exams, payments, notifications';
    RAISE NOTICE 'RLS activé sur toutes les tables';
    RAISE NOTICE 'Triggers et fonctions utilitaires créés';
END $$;
