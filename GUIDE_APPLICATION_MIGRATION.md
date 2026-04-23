# 📋 Guide d'Application de la Migration

## Date: 23 Avril 2026

## 🎯 Objectif

Créer les tables manquantes dans Supabase pour activer toutes les fonctionnalités avancées de Campusly.

## 📦 Tables à Créer

1. **groups** - Groupes d'étude
2. **group_members** - Membres des groupes
3. **revision_plans** - Plans de révision IA
4. **revision_plan_progress** - Progression des plans
5. **user_exams** - Examens des utilisateurs
6. **payments** - Historique des paiements
7. **notifications** - Notifications utilisateur

## 🚀 Méthode 1: Via Supabase Dashboard (Recommandé)

### Étape 1: Accéder au SQL Editor

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet Campusly
3. Cliquer sur "SQL Editor" dans le menu de gauche
4. Cliquer sur "+ New query"

### Étape 2: Copier le SQL

1. Ouvrir le fichier `supabase/migrations/20260423_missing_tables.sql`
2. Copier tout le contenu (Ctrl+A puis Ctrl+C)
3. Coller dans l'éditeur SQL de Supabase

### Étape 3: Exécuter la Migration

1. Cliquer sur le bouton "Run" (ou Ctrl+Enter)
2. Attendre la fin de l'exécution (environ 5-10 secondes)
3. Vérifier qu'il n'y a pas d'erreurs

### Étape 4: Vérifier les Tables

1. Aller dans "Table Editor" dans le menu de gauche
2. Vérifier que les nouvelles tables apparaissent:
   - ✅ groups
   - ✅ group_members
   - ✅ revision_plans
   - ✅ revision_plan_progress
   - ✅ user_exams
   - ✅ payments
   - ✅ notifications

## 🖥️ Méthode 2: Via Supabase CLI (Avancé)

### Prérequis

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter à Supabase
supabase login
```

### Étape 1: Lier le Projet

```bash
# Dans le dossier du projet
supabase link --project-ref VOTRE_PROJECT_REF
```

### Étape 2: Appliquer la Migration

```bash
# Appliquer toutes les migrations en attente
supabase db push

# OU appliquer une migration spécifique
supabase db execute --file supabase/migrations/20260423_missing_tables.sql
```

### Étape 3: Vérifier

```bash
# Lister les tables
supabase db list

# Vérifier le statut des migrations
supabase migration list
```

## ✅ Vérification Post-Migration

### 1. Vérifier les Tables

Dans Supabase Dashboard → Table Editor, vérifier que toutes les tables sont créées avec les bonnes colonnes.

### 2. Vérifier les Policies RLS

Dans Supabase Dashboard → Authentication → Policies, vérifier que les policies sont créées pour chaque table.

### 3. Tester les Fonctionnalités

#### A. Groupes d'Étude

```javascript
// Dans la console du navigateur sur dashboard.html
await supabase.from('groups').select('*')
// Devrait retourner un tableau vide (pas d'erreur)
```

#### B. Plans de Révision

```javascript
// Tester l'insertion
await supabase.from('revision_plans').insert({
  user_id: 'VOTRE_USER_ID',
  title: 'Test',
  matieres: [],
  plan: [],
  start_date: '2026-04-23',
  hours_per_day: 2
})
```

#### C. Examens

```javascript
// Tester l'insertion
await supabase.from('user_exams').insert({
  user_id: 'VOTRE_USER_ID',
  name: 'Test Examen',
  exam_date: '2026-05-01'
})
```

## 🐛 Résolution des Problèmes

### Erreur: "relation already exists"

**Cause**: Les tables existent déjà

**Solution**: 
- Vérifier dans Table Editor si les tables existent
- Si oui, la migration a déjà été appliquée
- Si non, supprimer les tables partielles et réexécuter

### Erreur: "permission denied"

**Cause**: Pas les droits d'administration

**Solution**:
- Vérifier que vous êtes connecté avec le bon compte
- Vérifier que vous avez les droits admin sur le projet

### Erreur: "syntax error"

**Cause**: Erreur de copier-coller

**Solution**:
- Copier à nouveau le fichier SQL complet
- Vérifier qu'il n'y a pas de caractères bizarres

## 📊 Résultat Attendu

Après la migration, vous devriez voir:

```
✅ 7 nouvelles tables créées
✅ 15+ index créés pour les performances
✅ 20+ policies RLS créées pour la sécurité
✅ 4 triggers créés pour les mises à jour automatiques
✅ 2 fonctions utilitaires créées
```

## 🎉 Prochaines Étapes

Une fois la migration appliquée:

1. ✅ Tester les groupes d'étude dans le dashboard
2. ✅ Tester la création de plans de révision
3. ✅ Tester l'ajout d'examens
4. ✅ Configurer Flutterwave pour les paiements
5. ✅ Déployer en production

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifier les logs dans Supabase Dashboard → Logs
2. Vérifier la console du navigateur (F12)
3. Consulter la documentation Supabase
4. Contacter le support Supabase si nécessaire

---

**Développeur**: Kiro AI  
**Date**: 23 Avril 2026  
**Version**: 1.0
