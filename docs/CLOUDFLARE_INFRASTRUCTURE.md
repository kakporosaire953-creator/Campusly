# Infrastructure Cloudflare — Campusly

> **Statut** : conception. Rien n'est déployé, aucun `wrangler.toml`, aucune ressource
> D1/R2/KV/Redis n'est créée dans cette phase. Ce document décrit la cible et les
> contraintes à respecter par le code frontend déjà écrit.

---

## 1. Vue d'ensemble

```
                       ┌──────────────────────────────┐
   campusly.uac.bj ────►│  DNS Cloudflare (proxy)      │
                       └──────────────┬───────────────┘
                                      ▼
                     ┌──────────────────────────────────┐
                     │ Worker « campusly-web »          │
                     │  OpenNext (@opennextjs/cloudflare)│
                     │  ├── rendu Next.js (SSR/ISR)     │
                     │  ├── /api/* (routes applicatives)│
                     │  └── Better Auth                 │
                     └───┬───────────┬──────────┬───────┘
                         ▼           ▼          ▼
                    ┌────────┐  ┌────────┐  ┌──────────────┐
                    │   D1   │  │   R2   │  │ Upstash Redis│
                    │ campus │  │ campus │  │ (REST)       │
                    │  _db   │  │ _files │  │ rate/cache   │
                    └────────┘  └────────┘  └──────────────┘
                         │
                  ┌──────▼───────────────┐
                  │ Services externes    │
                  │ FedaPay · IA · e-mail│
                  └──────────────────────┘
```

Un seul Worker au départ (rendu + API). Le découpage en Workers séparés
(`api`, `jobs`, `webhooks`) est une évolution possible, pas une nécessité initiale.

---

## 2. Compatibilité du frontend avec Workers

Le code de `web/` a été écrit pour cette cible :

| Contrainte Workers | Décision dans le code |
| --- | --- |
| Pas de binaire natif (`sharp`) | `images.unoptimized = true` dans `next.config.ts` ; images servies telles quelles ou via Cloudflare Images |
| Pas de `fs` à l'exécution | aucun accès fichier ; les CSS sont importés au build |
| Pas de `Buffer` lourd | aucune manipulation binaire côté serveur |
| Pas de connexion TCP | D1 est accédé par binding ; Redis via API REST (Upstash) |
| Server Actions interdites pour l'instant | `serverActions.allowedOrigins: []` — aucune Server Action métier |
| Routes dynamiques | `/dashboard/epreuves`, `/dashboard/epreuves/[id]`, `/dashboard/classrooms/[id]`, `/examen/[code]` sont rendues à la demande ; le reste est statique |
| Aucun secret dans le bundle | variables uniquement lues côté Worker (`env.*`), jamais `NEXT_PUBLIC_*` sensible |

---

## 3. Ressources

### 3.1 D1 — base `campusly`

- Schéma cible : `DATABASE_DESIGN.md`.
- Migrations gérées par Wrangler (`wrangler d1 migrations apply campusly --remote`),
  fichiers versionnés dans `migrations/` (à créer en phase backend).
- Mode lecture : requêtes préparées (`env.DB.prepare(...).bind(...)`) — **jamais** de
  concaténation SQL.
- Sauvegardes : `wrangler d1 export` planifié + export mensuel vers R2
  (`backups/d1/YYYY-MM.sql`), conservation 12 mois.
- Limites à surveiller : 10 Go/base, ~100 000 lignes lues/jour (offre gratuite),
  écritures monosite (pas de transactions multi-instances).

### 3.2 R2 — bucket `campusly-files`

Arborescence :

```
exams/<examId>.pdf                 # épreuves validées
contributions/<contribId>/<file>   # dépôts en attente de modération
covers/<examId>.webp               # vignettes générées à la modération
avatars/<userId>.webp
backups/d1/<YYYY-MM>.sql
```

Règles :

- bucket **privé** ; aucun accès public direct ;
- lecture via URL présignée (`env.R2.get(key)` puis réponse en flux, ou présignature
  côté Worker) — durée de vie 5 minutes pour un PDF, 1 heure pour un avatar ;
- en-têtes `Content-Disposition: attachment` sur les PDF pour éviter l'affichage inline ;
- `Cache-Control: private, max-age=0` sur les documents soumis à crédits ;
- cycle de vie : purge des contributions rejetées après 30 jours.

### 3.3 Upstash Redis (REST)

| Usage | Clé | TTL |
| --- | --- | --- |
| Rate limiting | `rl:<scope>:<id>` | 60 s |
| Cache liste d'épreuves | `cache:exams:<hash(filtres)>` | 60 s |
| Compteurs de vues | `views:exam:<id>` | 1 h (flush par cron) |
| Quota IA par utilisateur | `quota:ai:<userId>` | 24 h |
| File d'ingestion IA | `queue:ai` (liste) | — |
| Verrou de webhook | `lock:fedapay:<ref>` | 10 min |

Aucun accès Redis depuis le navigateur : le Worker seul détient le token REST.

### 3.4 KV (optionnel)

`CAMPUSLY_CONFIG` : tarifs, drapeaux de fonctionnalités, messages de maintenance.
Permet de modifier un prix sans redéploiement — toujours recoupé côté serveur.

---

## 4. Sécurité

### 4.1 En-têtes (à appliquer par le Worker, équivalent de l'ancien `vercel.json`)

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline';            # Next.js inline runtime
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' data: blob: https://*.r2.cloudflarestorage.com;
  connect-src 'self';
  frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```

> `'unsafe-inline'` sur `style-src` est requis par les styles inline issus de
> l'identité visuelle historique ; une migration vers des classes est possible mais
> changerait le rendu, ce que la mission interdit.

### 4.2 Anti-abus

- Rate limiting Redis par route : login 5/min/IP, inscription 3/h/IP,
  génération IA 10/h/utilisateur, forum 5 sujets/h, téléchargement 30/h.
- Vérification de l'origine (`Origin`/`Referer`) sur toutes les mutations.
- Webhooks : signature FedaPay vérifiée **avant** toute écriture ; rejeu idempotent.
- Téléversements : type MIME + taille (10 Mo) + analyse antivirus asynchrone (option
  Workers AI / service externe) avant publication.
- Journaux : `audit_log` en D1 pour les actions sensibles, sans données personnelles
  en clair (IP hachée).

### 4.3 Secrets (Worker secrets uniquement)

```
BETTER_AUTH_SECRET
FEDAPAY_SECRET_KEY
FEDAPAY_WEBHOOK_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
AI_PROVIDER_*_KEY
SMTP_URL (si e-mails transactionnels)
```

Aucune de ces valeurs ne doit apparaître dans `web/` (le build échouerait à la revue).

---

## 5. Performance

| Levier | Mise en œuvre |
| --- | --- |
| Rendu statique | landing et pages légales prérendues (26 routes, 103 kB de JS partagé) |
| Cache CDN | `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` sur les listes publiques |
| Fonts | préconnexion `fonts.googleapis.com` / `fonts.gstatic.com` (déjà en place) |
| CSS historique | 1 feuille globale + CSS de page importée par route, pas de CSS-in-JS |
| Images | logo unique, `unoptimized` assumé (compatibilité Workers) |
| Compression | Brotli automatique Cloudflare |

Objectif : LCP < 2,5 s sur 3G rapide (Cotonou), First Load JS < 150 kB par route.

---

## 6. Environnements

| Env | Worker | D1 | R2 | Notes |
| --- | --- | --- | --- | --- |
| `dev` | `wrangler dev` (Miniflare) | base locale `.wrangler/state` | bucket local | aucune donnée réelle |
| `preview` | `campusly-web-preview` | `campusly-preview` | `campusly-files-preview` | FedaPay en mode test, IA en mode bouchon |
| `production` | `campusly-web` | `campusly` | `campusly-files` | secrets production, webhooks actifs |

**Aucun basculement de domaine ni de production n'est effectué dans cette phase.**
La version Vercel (`https://campusly-one.vercel.app/`) reste la référence visuelle.

---

## 7. Observabilité

- **Logs Workers** (`wrangler tail`) + `requestId` propagé dans chaque réponse d'erreur.
- **Analytics Engine** : événements `page_view`, `exam_download`, `quiz_generated`,
  `payment_succeeded`, `ai_error` (aucune donnée personnelle).
- **Alertes** : taux d'erreur 5xx > 2 %, latence p95 > 800 ms, échecs de webhook,
  quota IA dépassé.
- **Tableau de bord** : `audit_log` + agrégats D1 (coûts IA, conversions de packs).

---

## 8. CI/CD (cible)

```
PR → npm ci → npm run typecheck → npm test → npm run build
   → (option) wrangler deploy --env preview
main → mêmes vérifications → wrangler d1 migrations apply --remote
    → wrangler deploy --env production
```

Aucune clé de production dans le dépôt : les secrets sont des « Worker secrets »
injectés par l'environnement CI.

---

## 9. Coûts indicatifs (ordres de grandeur)

| Poste | Volume initial | Offre | Commentaire |
| --- | --- | --- | --- |
| Workers | ~200 k requêtes/mois | Free (100 k/jour) | suffisant au lancement |
| D1 | < 100 Mo | Free (5 Go) | croît avec l'historique |
| R2 | ~5 Go | payant à l'usage (stockage + opérations) | pas d'egress |
| Redis | < 10 k commandes/jour | Free (Upstash 10 k/jour) | basculer en payant si besoin |
| IA | selon usage | variable | à plafonner par quotas |

---

## 10. Points de vigilance

1. **D1 est monosite pour les écritures** : ne pas y placer de compteur temps réel ;
   utiliser Redis.
2. **Limites de temps CPU** d'un Worker (30 s) : les opérations IA longues doivent
   passer par une file (Durable Object / Queue) plutôt qu'une requête synchrone.
3. **Cohérence des crédits** : débit et écriture d'historique dans la même transaction
   D1 (`batch`), sinon risque de double dépense.
4. **CSP et Font Awesome CDN** : conserver `cdnjs.cloudflare.com` en liste blanche,
   sinon les icônes disparaissent (régression visuelle immédiate).
5. **Cache CDN et données personnalisées** : toute route dépendant de la session doit
   renvoyer `Cache-Control: private`.
