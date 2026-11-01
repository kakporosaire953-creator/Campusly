# Campusly — Plateforme académique UAC

Campusly — plateforme académique de l'UAC (Bénin). Ce dépôt contient désormais
l'application **Next.js 15 + React 19 + TypeScript** à sa racine, migrée depuis la
version statique historique archivée dans `legacy/`.

> **Phase actuelle : frontend uniquement, sans backend.**
> Toutes les données sont fictives et stockées dans le navigateur. Aucune route API,
> aucune base de données, aucun paiement réel, aucune IA réelle.

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

Aucune variable d'environnement n'est requise.

```bash
npm run typecheck  # TypeScript
npm run test       # Vitest (33 tests)
npm run build      # build de production
npm run start      # serveur de production
```

---

## Ce qui fonctionne réellement

- Navigation complète entre toutes les pages publiques, d'authentification et de l'espace
  étudiant / enseignant / admin.
- Recherche et filtres de la bibliothèque d'épreuves (faculté, niveau, semestre, année,
  type, favoris), pagination.
- Parcours de révision : assistant IA (4 étapes), 5 modes d'entraînement, quiz corrigé
  localement avec résultat détaillé.
- Classrooms : rejoindre par code, fil d'annonces (publication locale), ressources,
  devoirs, membres.
- Compositions : accès par code, salle d'examen (consignes, chronomètre, palette de
  questions, journal d'intégrité), remise et correction locales.
- Forum : filtres, création de sujet, réponses, mentions « j'aime » (stockage local).
- Crédits : solde fictif, historique, packs, abonnement, tunnel de paiement **simulé**.
- Notifications, profil, paramètres, bascule de rôle, déconnexion.

## Ce qui est simulé (et signalé comme tel)

| Opération | Comportement réel | Marquage dans l'interface |
| --- | --- | --- |
| Téléchargement d'épreuve | ticket `demo://`, aucun fichier | modale « Téléchargement simulé » |
| Paiement Mobile Money / carte | intention locale, aucun appel FedaPay | encart « Paiement simulé » |
| Analyse de document IA | réponse de démonstration | badge « Aucune IA réelle » |
| Remise de composition | correction locale | bandeau « remise locale » |
| Modération admin | décision locale | bandeau « accès de démonstration » |
| Crédits | solde `localStorage` | mention « valeur fictive » |

---

## Structure

```
app/          routes (groupes public / auth / app + salle d'examen)
components/   ui, layout, navigation, shared
features/     logique d'interface par domaine
services/     accès aux données — seul point d'entrée : services/index.ts
types/        contrats TypeScript
styles/       legacy/ (CSS historique réutilisé) + app/ (compléments)
tests/        Vitest
```

Règles importantes :

1. **Ne pas redessiner** : le CSS de `styles/legacy/` est la référence visuelle.
2. Un composant n'importe **jamais** `services/mocks/**` : uniquement un service.
3. Toute donnée fictive doit rester identifiable (`DemoBadge`, bandeau, mention).
4. Aucun secret, aucune dépendance Supabase.

---

## Version historique

La version statique d'origine (`*.html`, `css/`, `js/`, `supabase/`) est archivée dans
[`legacy/`](legacy/README.md) : elle reste la **référence visuelle** et la base de
migration. Aucun fichier n'a été supprimé.

## Documentation

- `docs/PROJECT_AUDIT.md` — audit du dépôt historique
- `docs/ARCHITECTURE.md` — architecture cible
- `docs/DATABASE_DESIGN.md` — conception D1
- `docs/API_CONTRACTS.md` — contrats d'API
- `docs/CLOUDFLARE_INFRASTRUCTURE.md` — infrastructure Cloudflare
- `docs/FRONTEND_GUIDE.md` — guide du frontend (routes, composants, a11y)
- `docs/BACKEND_ROADMAP.md` — feuille de route backend

---

## Anciennes URLs

Les pages `.html` historiques redirigent automatiquement (308) :

| Ancienne URL | Nouvelle route |
| --- | --- |
| `/index.html` | `/` |
| `/auth.html` | `/auth` |
| `/onboarding.html` | `/onboarding` |
| `/dashboard.html` | `/dashboard` |
| `/epreuves.html` | `/dashboard/epreuves` |
| `/forum.html` | `/dashboard/forum` |
| `/classrooms.html` | `/dashboard/classrooms` |
| `/composition.html` | `/dashboard/compositions` |
| `/revision.html` | `/dashboard/revision` |
| `/chatbot.html` | `/assistant-ia` |
| `/exam-room.html` | `/examen/ALGO1` |
| `/contribuer.html` | `/contribuer` |
| `/admin.html` | `/admin` |
| `/apropos.html` | `/a-propos` |
| `/conditions.html` | `/conditions` |
| `/politique.html` | `/politique-de-confidentialite` |
| `/offline.html` | `/offline` |

Les ancres de l'ancien dashboard (`#epreuves`, `#revision`, `#classrooms`…) sont
traduites côté client.
