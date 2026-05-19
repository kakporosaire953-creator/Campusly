# Campusly - Plateforme Academique UAC

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/kakporosaire953-creator/Campusly)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-success.svg)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-AI-orange.svg)](https://groq.com)

La plateforme academique des etudiants de l'Universite d'Abomey-Calavi (UAC)

## Table des Matieres

- A Propos
- Fonctionnalites
- Technologies
- Installation
- Configuration
- Deploiement
- Tests
- Documentation
- Contribution
- License

## A Propos

Campusly est une plateforme web moderne concue pour les etudiants de l'UAC. Elle offre:

- Acces a des centaines d'anciennes epreuves
- Revision assistee par IA (Groq)
- Assistant IA conversationnel
- Forum d'entraide etudiant
- Systeme de gamification (XP, badges, streak)
- Groupes d'etude
- Plans de revision personnalises
- Abonnement Premium (FedaPay)

## Fonctionnalites

### Authentification
- Inscription/Connexion par email
- Connexion Google OAuth
- Validation matricule UAC (8 chiffres)
- Auto-deconnexion apres 1 minute d'inactivite

### Bibliotheque d'Epreuves
- 500+ epreuves classees par faculte
- Filtres avances (faculte, departement, semestre, annee)
- Recherche en temps reel
- Systeme de favoris
- Historique de telechargements

### IA Groq
- 3 modeles disponibles:
  - Fast: llama-3.1-8b-instant (ultra rapide)
  - Balanced: llama-3.3-70b-versatile (recommande)
  - Smart: mixtral-8x7b-32768 (tres intelligent)
- Quiz personnalises (7 questions)
- Chatbot conversationnel
- Questions quotidiennes par filiere
- Explications detaillees

### Gamification
- Systeme XP (10 niveaux)
- 8 badges a debloquer
- Streak de revision (compteur de jours consecutifs)
- Leaderboard (XP, Quiz, Streak)
- Confetti pour les achievements de niveau

### Social
- Forum type feed social
- Groupes d'etude par faculte
- Likes et commentaires sur le forum
- Partage de resultats (WhatsApp, Twitter)

### Outils de Revision
- Plans de revision generes par IA
- Compte a rebours avant les examens
- Suivi de progression
- Notifications de rappel

### Premium
- Abonnement via FedaPay
- 3 plans: 1 Semaine (500 FCFA), 1 Mois (1500 FCFA), 3 Mois (3500 FCFA)
- Paiement Mobile Money (MTN, Moov) et Carte bancaire
- Acces illimite aux epreuves Premium
- Quiz IA la demande illimites

### Design et Accessibilite
- Mode sombre et mode clair
- PWA installable sur smartphone
- Responsive mobile
- Animations fluides
- Accessibilite WCAG AAA
- Skeleton loaders pour le chargement
- Lazy loading des images

## Technologies

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Chart.js (graphiques de progression)
- Service Worker (support PWA)
- Intersection Observer (chargement differe des images)

### Backend
- Supabase (BaaS)
  - PostgreSQL (base de donnees)
  - Auth (authentification)
  - Storage (fichiers des epreuves)
  - Edge Functions (fonctions serverless)
  - Row Level Security (RLS pour la securite)

### IA
- Groq API (LLM)
  - llama-3.1-8b-instant
  - llama-3.3-70b-versatile
  - mixtral-8x7b-32768

### Paiement
- FedaPay
  - Mobile Money (MTN, Moov)
  - Carte bancaire
  - Webhooks de notification

### Deploiement
- Vercel (hebergement frontend)
- GitHub (gestion de version)
- Supabase (hebergement backend)

## Installation

### Prerequis

- Node.js 18+
- Git
- Compte Supabase
- Compte Groq
- Compte FedaPay

### Etapes

1. Cloner le repository
```bash
git clone https://github.com/kakporosaire953-creator/Campusly.git
cd Campusly
```

2. Installer Supabase CLI
```bash
npm install -g supabase
```

3. Lier le projet Supabase
```bash
supabase login
supabase link --project-ref VOTRE_PROJECT_REF
```

4. Appliquer les migrations
```bash
supabase db push
```

5. Configurer les secrets
Dans Supabase Dashboard -> Settings -> Secrets:
```
GROQ_API_KEY=gsk_VOTRE_CLE_GROQ_ICI
FEDAPAY_SECRET_KEY=sk_sandbox_votre_cle_fedapay
```

6. Deployer les Edge Functions
```bash
supabase functions deploy groq-ai
supabase functions deploy fedapay-webhook
```

7. Configurer FedaPay
Dans dashboard.html:
```javascript
const FEDAPAY_PUBLIC_KEY = "pk_sandbox_votre-cle-publique";
```

8. Lancer en local
```bash
npx serve .
```

## Configuration

### Variables d'Environnement

#### Supabase
```javascript
// js/supabase-config.js
const SUPABASE_URL = "https://votre-project.supabase.co";
const SUPABASE_ANON_KEY = "votre-anon-key";
```

#### Groq (Edge Function)
```typescript
// supabase/functions/groq-ai/index.ts
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
```

#### FedaPay
```javascript
// dashboard.html
const FEDAPAY_PUBLIC_KEY = "pk_sandbox_votre-cle";
```

```typescript
// supabase/functions/fedapay-webhook/index.ts
const FEDAPAY_SECRET_KEY = Deno.env.get("FEDAPAY_SECRET_KEY");
```

### Base de Donnees
Les migrations SQL sont dans supabase/migrations/
- 20260410_daily_questions.sql - Questions quotidiennes
- 20260423_missing_tables.sql - Tables manquantes (groups, revision_plans, etc.)

### Webhook FedaPay
URL: https://VOTRE_PROJECT_REF.supabase.co/functions/v1/fedapay-webhook
A configurer dans FedaPay Dashboard -> Parametres -> Webhooks

## Deploiement

### Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Configuration Vercel
Le fichier vercel.json est deja configure avec les redirections et les headers de securite.

### Domaine Personnalise
```bash
vercel domains add campusly.uac.bj
```

## Tests

### Tests Automatises
Dans la console du navigateur (F12), chargez et executez le script de test pour verifier le fonctionnement global.

### Tests de Performance
```bash
npm install -g lighthouse
lighthouse https://campusly.uac.bj --view
```

## Documentation

- Guide de Securite (SECURITE.md)

## Contribution

Les contributions sont les bienvenues.
1. Fork le projet
2. Creer une branche (git checkout -b feature/AmazingFeature)
3. Commit les changements (git commit -m 'Add AmazingFeature')
4. Push vers la branche (git push origin feature/AmazingFeature)
5. Ouvrir une Pull Request

## Statistiques

- Lignes de code: ~15,000
- Fichiers: 30+
- Score Lighthouse: 90+
- Temps de chargement: < 3s

## Credits

### Developpement
- Kiro AI

### Technologies
- Supabase
- Groq
- FedaPay
- Chart.js
- Vercel

### Inspiration
- Universite d'Abomey-Calavi (UAC)
- Etudiants beninois

## Support

- Email: support@campusly.uac.bj
- WhatsApp: +229 97 00 00 00
- GitHub Issues

## License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de details.
