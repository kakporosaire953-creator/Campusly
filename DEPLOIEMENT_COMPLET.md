# 🚀 Guide de Déploiement Complet - Campusly

## Date: 23 Avril 2026

## 📋 Checklist Pré-Déploiement

### 1. Base de Données Supabase

- [ ] Migration SQL appliquée (`20260423_missing_tables.sql`)
- [ ] Tables vérifiées:
  - [ ] groups
  - [ ] group_members
  - [ ] revision_plans
  - [ ] revision_plan_progress
  - [ ] user_exams
  - [ ] payments
  - [ ] notifications
  - [ ] daily_questions
  - [ ] daily_question_answers
- [ ] RLS (Row Level Security) activé sur toutes les tables
- [ ] Policies créées et testées

### 2. Edge Functions Supabase

- [ ] `groq-ai` déployée
- [ ] `fedapay-webhook` déployée
- [ ] Secrets configurés:
  - [ ] `GROQ_API_KEY`
  - [ ] `FEDAPAY_SECRET_KEY`

### 3. Configuration FedaPay

- [ ] Compte créé et vérifié
- [ ] KYC complété
- [ ] Clés API obtenues (Test et Live)
- [ ] Clé publique ajoutée dans `dashboard.html`
- [ ] Webhook URL configurée dans FedaPay Dashboard
- [ ] Paiement test réussi

### 4. Tests Fonctionnels

- [ ] Authentification (email + Google)
- [ ] Téléchargement d'épreuves
- [ ] Quiz IA (3 modèles Groq)
- [ ] Chatbot IA
- [ ] Forum (posts, likes, commentaires)
- [ ] Questions quotidiennes
- [ ] Badges et XP
- [ ] Streak de révision
- [ ] Groupes d'étude
- [ ] Plans de révision IA
- [ ] Examens (countdown)
- [ ] Paiement Premium
- [ ] Mode sombre
- [ ] PWA (installation)
- [ ] Auto-déconnexion

### 5. Tests de Performance

- [ ] Lighthouse Score > 90
- [ ] Temps de chargement < 3s
- [ ] Images optimisées (lazy loading)
- [ ] Service Worker fonctionnel
- [ ] Cache configuré

### 6. Tests de Sécurité

- [ ] Clés API sécurisées
- [ ] RLS activé
- [ ] CORS configuré
- [ ] Validation des inputs
- [ ] Protection CSRF

## 🔧 Étapes de Déploiement

### Étape 1: Préparer l'Environnement

```bash
# 1. Vérifier que tous les fichiers sont à jour
git status

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Vérifier la configuration Supabase
supabase status
```

### Étape 2: Appliquer la Migration SQL

```bash
# Option A: Via Supabase Dashboard
# 1. Ouvrir https://supabase.com/dashboard
# 2. SQL Editor → New Query
# 3. Copier le contenu de supabase/migrations/20260423_missing_tables.sql
# 4. Exécuter (Run)

# Option B: Via CLI
supabase db push
```

### Étape 3: Déployer les Edge Functions

```bash
# 1. Déployer groq-ai (déjà fait normalement)
supabase functions deploy groq-ai

# 2. Déployer fedapay-webhook
supabase functions deploy fedapay-webhook

# 3. Vérifier les déploiements
supabase functions list
```

### Étape 4: Configurer les Secrets

```bash
# Via Supabase Dashboard → Settings → Secrets

# 1. GROQ_API_KEY
# Valeur: gsk_VOTRE_CLE_GROQ_ICI

# 2. FEDAPAY_SECRET_KEY
# Valeur: sk_sandbox_votre-cle-secrete (Test)
# Valeur: sk_live_votre-cle-secrete (Production)
```

### Étape 5: Configurer FedaPay

```javascript
// Dans dashboard.html, ligne ~1650
async function launchFedaPay(amount, days, label) {
  // MODE TEST
  const FEDAPAY_PUBLIC_KEY = "pk_sandbox_votre-cle-publique-test";
  
  // MODE PRODUCTION (décommenter après tests)
  // const FEDAPAY_PUBLIC_KEY = "pk_live_votre-cle-publique-live";
  
  FedaPay.init({
    public_key: FEDAPAY_PUBLIC_KEY,
    // ... reste du code
  });
}
```

### Étape 6: Configurer le Webhook FedaPay

```bash
# 1. Obtenir l'URL du webhook
# Format: https://VOTRE_PROJECT_REF.supabase.co/functions/v1/fedapay-webhook

# 2. Aller dans FedaPay Dashboard → Paramètres → Webhooks
# 3. Ajouter l'URL
# 4. Sélectionner les événements: transaction.approved, transaction.declined
# 5. Sauvegarder
```

### Étape 7: Tester en Mode Test

```bash
# 1. Ouvrir le site en local ou sur le domaine de test
# 2. Se connecter avec un compte test
# 3. Tester chaque fonctionnalité:

# Authentification
- Inscription email
- Connexion email
- Connexion Google
- Déconnexion

# Épreuves
- Recherche
- Filtres
- Téléchargement
- Favoris

# IA
- Quiz (3 modèles)
- Chatbot
- Question du jour

# Social
- Forum (posts, likes)
- Groupes d'étude

# Premium
- Paiement test (carte: 5531886652142950)
- Vérification activation
- Vérification expiration

# Dashboard
- Stats
- Badges
- Streak
- Plan de révision
- Examens
```

### Étape 8: Vérifier les Logs

```bash
# Supabase Dashboard → Logs
# Vérifier:
- Pas d'erreurs critiques
- Webhooks reçus
- Paiements enregistrés
- Notifications créées
```

### Étape 9: Optimiser les Performances

```bash
# 1. Vérifier Lighthouse
# Chrome DevTools → Lighthouse → Generate Report

# 2. Optimiser si nécessaire:
- Compresser les images
- Minifier CSS/JS
- Activer le cache
- Optimiser les requêtes

# 3. Tester sur mobile
# Chrome DevTools → Device Toolbar
```

### Étape 10: Passer en Production

```bash
# 1. Mettre à jour les clés FedaPay (Live)
# 2. Tester un paiement réel de faible montant
# 3. Vérifier que tout fonctionne
# 4. Activer le monitoring
# 5. Communiquer le lancement
```

## 🌐 Déploiement sur Vercel (Recommandé)

### Configuration Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Service-Worker-Allowed": "/"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Déploiement

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod

# 4. Configurer le domaine personnalisé (optionnel)
vercel domains add campusly.uac.bj
```

## 🔍 Monitoring et Maintenance

### 1. Monitoring Supabase

```bash
# Dashboard → Logs
# Surveiller:
- Erreurs API
- Temps de réponse
- Utilisation des ressources
- Webhooks échoués
```

### 2. Monitoring FedaPay

```bash
# Dashboard → Transactions
# Surveiller:
- Paiements réussis/échoués
- Montants
- Webhooks
```

### 3. Monitoring Vercel

```bash
# Dashboard → Analytics
# Surveiller:
- Trafic
- Temps de chargement
- Erreurs
- Géolocalisation
```

### 4. Sauvegardes

```bash
# Sauvegarder la base de données régulièrement
# Supabase Dashboard → Database → Backups

# Fréquence recommandée:
- Quotidienne (automatique)
- Hebdomadaire (manuelle)
- Avant chaque mise à jour majeure
```

## 📊 Métriques de Succès

### Objectifs de Performance

- Lighthouse Score: > 90
- Temps de chargement: < 3s
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### Objectifs d'Utilisation

- Taux de conversion Premium: > 5%
- Taux de rétention (7 jours): > 40%
- Taux de rétention (30 jours): > 20%
- Nombre de quiz/utilisateur/jour: > 2
- Nombre de téléchargements/utilisateur/semaine: > 5

## 🐛 Résolution des Problèmes Courants

### Problème: Webhook FedaPay ne fonctionne pas

**Solutions**:
1. Vérifier que l'URL est correcte
2. Vérifier que la clé secrète est configurée
3. Vérifier les logs Supabase
4. Tester avec Postman

### Problème: Questions quotidiennes ne se génèrent pas

**Solutions**:
1. Vérifier que la clé Groq est configurée
2. Vérifier les logs de l'Edge Function
3. Vérifier que la table daily_questions existe
4. Tester manuellement l'API

### Problème: PWA ne s'installe pas

**Solutions**:
1. Vérifier que manifest.json est accessible
2. Vérifier que sw.js est enregistré
3. Vérifier HTTPS (requis pour PWA)
4. Vérifier les icônes

### Problème: Mode sombre ne fonctionne pas

**Solutions**:
1. Vérifier que theme-dark.css est chargé
2. Vérifier que theme-switcher.js est exécuté
3. Vérifier localStorage
4. Vider le cache

## 📞 Support

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [FedaPay Docs](https://docs.fedapay.com)
- [Groq Docs](https://console.groq.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Contact

- Email: support@campusly.uac.bj
- WhatsApp: +229 XX XX XX XX
- GitHub: https://github.com/kakporosaire953-creator/Campusly

## ✅ Checklist Post-Déploiement

- [ ] Site accessible sur le domaine
- [ ] HTTPS activé
- [ ] Toutes les pages fonctionnent
- [ ] Authentification fonctionne
- [ ] Paiements fonctionnent
- [ ] Webhooks fonctionnent
- [ ] PWA installable
- [ ] Mode sombre fonctionne
- [ ] Mobile responsive
- [ ] Lighthouse Score > 90
- [ ] Monitoring activé
- [ ] Sauvegardes configurées
- [ ] Documentation à jour
- [ ] Équipe formée
- [ ] Communication lancée

---

**Développeur**: Kiro AI  
**Date**: 23 Avril 2026  
**Version**: 1.0  
**Statut**: Prêt pour le déploiement
