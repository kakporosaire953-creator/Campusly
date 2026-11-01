# Architecture cible — Campusly

> **Statut** : document d'architecture de la phase frontend.
> Aucun backend n'est implémenté à ce stade (voir `BACKEND_ROADMAP.md`). Ce document
> décrit la cible, les contraintes et la façon dont le frontend actuel y prépare le terrain.

---

## 1. Objectif

Campusly est la plateforme académique des étudiants et enseignants de l'Université
d'Abomey-Calavi (UAC) : bibliothèque d'épreuves, révision assistée par IA, classrooms
d'amphi, compositions surveillées, crédits et paiements Mobile Money.

La cible technique est :

| Couche | Technologie retenue | Rôle |
| --- | --- | --- |
| Frontend | **Next.js 15 (App Router) + React 19 + TypeScript** | interfaces étudiant / enseignant / admin |
| Exécution | **Cloudflare Workers** via l'adaptateur OpenNext (`@opennextjs/cloudflare`) | hébergement SSR + routes API |
| Base de données | **Cloudflare D1** (SQLite distribué) | données relationnelles applicatives |
| Fichiers | **Cloudflare R2** | PDF d'épreuves, pièces jointes, avatars |
| Cache / files | **Upstash Redis** (REST) | rate limiting, files d'attente, cache de sessions |
| Authentification | **Better Auth** (cookie de session `httpOnly`) | inscription, connexion, rôles |
| Paiement | **FedaPay** (MTN MoMo, Moov Money, carte) | achats de crédits et abonnements |
| IA | **Multi-fournisseurs** (routeur côté Worker) | analyse de documents, génération de quiz |

---

## 2. Contraintes structurantes

1. **Le navigateur ne détient aucun secret.** Aucune clé d'API IA, aucun token FedaPay,
   aucun mot de passe de base de données ne peut apparaître dans le bundle.
2. **Le rôle affiché n'est pas une autorisation.** Les contrôles d'UI (menu, boutons,
   sélecteur de rôle de démonstration) organisent l'expérience ; toute décision
   d'accès est prise côté Worker.
3. **Aucune dépendance Supabase active.** Les artefacts historiques (`supabase/`,
   anciens scripts) sont conservés pour l'audit et la migration, mais le nouveau
   frontend n'importe ni SDK ni client Supabase. La base distante n'est jamais
   supprimée ni modifiée par ce dépôt.
4. **Compatibilité Workers** : pas de `fs` à l'exécution, pas de `sharp`, pas de
   bibliothèque nécessitant un binaire natif, pas de connexion TCP directe à une base.
5. **Une seule source d'identité visuelle** : le CSS historique (`styles/legacy/`)
   reste la base ; `styles/app/campusly-next.css` ne fait qu'ajouter des compléments
   ciblés (états, focus, bannière de démonstration).

---

## 3. Vue d'ensemble des couches

```
┌──────────────────────────────────────────────────────────────────┐
│  Navigateur (React 19, App Router, composants serveur/client)     │
│                                                                  │
│   app/  ── groupes de routes ──►  features/  ──►  services/       │
│                                     │                │           │
│                              components/ui      types/ (contrats) │
└──────────────────────────────────┬───────────────────────────────┘
                                   │ appels typés (fetch JSON)
┌──────────────────────────────────▼───────────────────────────────┐
│  Cloudflare Worker (OpenNext)                                    │
│   • routes /api/*  (validation Zod, autorisation, quotas)        │
│   • Better Auth (sessions signées, cookies httpOnly)             │
│   • accès D1 (requêtes préparées), R2 (URL présignées)           │
│   • Upstash Redis (rate limit, cache, files)                     │
│   • routeur IA (multi-fournisseurs, quotas de crédits)           │
│   • webhooks FedaPay (vérification de signature)                 │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
        ┌──────────────┬───────────┴──────────┬──────────────┐
        ▼              ▼                      ▼              ▼
      D1 (SQL)       R2 (objets)        Redis          FedaPay / IA
```

### 3.1 Règle de dépendance du frontend

```
app/ ──► features/ ──► services/ ──► types/
 │            │            │
 └────────► components/ui ◄┘
```

- `features/*` **ne contient aucun accès direct aux données** : il appelle un service.
- Les fixtures (`services/mocks/fixtures/*`) ne sont importées **que** par les services.
  Aucun composant n'importe `services/mocks/**` (règle vérifiée par revue de code ;
  `services/index.ts` est le seul point d'entrée public).
- `services/api/client.ts` expose `ApiClient` (contrat) et `UnavailableApiClient`
  (implémentation de démonstration) : le jour où le backend existe, on remplace
  l'implémentation injectée, sans toucher aux composants.

---

## 4. Découpage du dépôt

```
Campusly/
├── app/                          # nouveau frontend (racine du dépôt)
│   ├── (public)/             # accueil, à propos, conditions, confidentialité, contribuer
│   ├── (auth)/               # /auth, /onboarding
│   ├── (app)/                # espace connecté : dashboard/*, enseignant, admin, assistant-ia
│   ├── examen/[code]/        # salle d'examen (plein écran, hors shell)
│   ├── offline/              # page hors ligne
│   ├── layout.tsx            # polices, providers, skip-link
│   ├── error.tsx, loading.tsx, not-found.tsx
│   └── manifest.ts           # manifeste PWA
├── components/               # ui/, layout/, navigation/, shared/
├── features/                 # auth, dashboard, exams, revision, ai, classrooms,
│                             # compositions, forum, credits, notifications, profile
├── services/                 # 11 services + api/ + mocks/
├── types/                    # contrats TypeScript (12 fichiers)
├── hooks/                    # useAsync
├── config/                   # site.ts (navigation, libellés, mentions)
├── styles/                   # legacy/ (historique) + app/ (compléments)
├── public/                   # logo, manifeste, fichiers statiques
├── tests/                    # Vitest (services + composants)
├── docs/                     # documentation (dont ce fichier)
├── legacy/                   # HISTORIQUE — version statique d'origine (référence visuelle)
├── supabase/migrations/      # HISTORIQUE — base du design D1, jamais exécuté par ce dépôt
└── vercel.json               # configuration Vercel du frontend Next.js
```

### 4.1 Rôle des groupes de routes

| Groupe | Routes | Layout appliqué |
| --- | --- | --- |
| `(public)` | `/`, `/a-propos`, `/conditions`, `/politique-de-confidentialite`, `/contribuer` | navbar + footer historiques |
| `(auth)` | `/auth`, `/onboarding` | écran centré avec orbes, sans navbar |
| `(app)` | `/dashboard`, `/dashboard/*`, `/enseignant`, `/admin`, `/assistant-ia` | `AppShell` (sidebar 260 px + header 68 px) |
| hors groupe | `/examen/[code]` | plein écran, sans navigation (comme `exam-room.html`) |
| technique | `/offline`, `not-found` | autonome |

---

## 5. Cycle de vie d'une requête (cible)

Exemple : téléchargement d'une épreuve premium.

1. Le composant appelle `examService.requestDownload(examId)`.
2. Aujourd'hui : le service renvoie un ticket local `demo://r2/<clé>` (aucun fichier).
3. Cible : `POST /api/exams/:id/download` →
   - Better Auth valide la session (cookie `httpOnly`) ;
   - le Worker vérifie l'abonnement ou débite le ledger de crédits (D1, transaction) ;
   - le Worker génère une URL présignée R2 (5 min) ;
   - la réponse contient `{ url, expiresAt, creditsSpent }` — **même forme** que
     `ExamDownloadTicket` déjà typée côté frontend.
4. L'interface reste inchangée : seules les implémentations de service changent.

Ce principe (« contrat d'abord ») s'applique à tous les services : les types
exportés par `types/` sont la référence partagée frontend ↔ backend.

---

## 6. Authentification et rôles (cible)

- **Better Auth** gère inscription, connexion, session (cookie `httpOnly`, `SameSite=Lax`,
  `Secure`), réinitialisation de mot de passe.
- Trois rôles applicatifs : `learner`, `teacher`, `admin`, plus un statut
  d'enseignant (`student`, `pending`, `verified`) stocké en base.
- Les **règles d'accès** sont évaluées par le Worker :
  - un `learner` ne peut pas créer de composition ;
  - un `teacher` `pending` ne peut pas publier de note ;
  - un `admin` peut modérer, jamais modifier une copie soumise.
- Le sélecteur de rôle présent dans l'interface (`RoleSwitcher`) est un **outil de
  démonstration** : il ne fait que changer le profil affiché côté navigateur.

---

## 7. Gestion des états et de la démonstration

Trois catégories de données sont distinguées dans l'interface :

| Catégorie | Origine | Marquage visuel |
| --- | --- | --- |
| Données fictives | `services/mocks/fixtures/*` | `DemoBadge`, `.demo-chip`, bandeau `DemoBanner` |
| Saisies locales | `localStorage` (`campusly.web.demo.v1.*`) | mentions « enregistré localement » |
| Données réelles (phase future) | API Worker | aucune mention de démonstration |

Toute opération qui ne persiste pas côté serveur est décrite comme une **simulation**
(téléchargement, paiement, remise de copie, analyse IA, modération).

---

## 8. Contraintes de compatibilité conservées

1. **URLs historiques** : les anciennes pages `.html` redirigent vers les nouvelles
   routes (`next.config.ts`), y compris `/index.html`, `/auth.html`, `/dashboard.html`,
   `/epreuves.html`, `/exam-room.html`, `/offline.html`.
2. **Ancres de l'ancien dashboard** : `#epreuves`, `#revision`, `#classrooms`… sont
   traduites côté client par `components/shared/LegacyHashRedirect.tsx`.
3. **CSS historique réutilisé** : `modern.css`, `theme-light.css`, `enhancements.css`,
   `responsive-scale.css`, `mobile.css`, `interactive-buttons.css` + CSS de page
   extraits. Aucune refonte visuelle : mêmes couleurs, mêmes composants, mêmes espacements.
4. **Police et icônes** : Plus Jakarta Sans + Inter + JetBrains Mono et Font Awesome 6
   restent chargés via CDN, comme dans la version de référence.

---

## 9. Risques et parades

| Risque | Impact | Parade |
| --- | --- | --- |
| Fuite de secrets dans le bundle | critique | aucune variable d'environnement côté client, revue `next build` + `grep` de secrets en CI |
| Autorisation supposée par l'UI | critique | contrôle systématique côté Worker, tests d'autorisation backend |
| Limites D1 (10 Go, écritures monosite) | moyen | ledger append-only, agrégats Redis, archivage R2 |
| Dérive visuelle avec l'ancienne version | moyen | comparaison écran par écran, CSS historique comme source unique |
| Confusion démo / réel | élevé (confiance) | marquage systématique, aucune donnée inventée présentée comme réelle |
| Panne du fournisseur IA | moyen | routeur multi-fournisseurs, dégradation vers contenu statique |
| Webhook FedaPay falsifié | critique | vérification de signature + idempotence + revérification de l'état |

---

## 10. Ce qui n'est **pas** implémenté (assumé)

- Aucune route API, aucune Server Action métier.
- Aucune connexion D1/R2/Redis.
- Aucune implémentation Better Auth, FedaPay, IA côté serveur.
- Aucun webhook, aucun cron.
- Aucun déploiement Cloudflare.

Ces éléments sont décrits et planifiés dans `DATABASE_DESIGN.md`,
`API_CONTRACTS.md`, `CLOUDFLARE_INFRASTRUCTURE.md` et `BACKEND_ROADMAP.md`.
