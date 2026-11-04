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
- Thème clair / sombre (bascule dans la navbar et l'espace, préférence conservée) avec
  surfaces « liquid glass » et fond animé bleu/orange dans les deux modes.
- Crédits et abonnement : pages d'attente expliquant l'ouverture prochaine (aucun tarif, aucun paiement).
- Notifications, profil, paramètres, bascule de rôle, déconnexion.

## Ce qui n'est pas encore ouvert (et qui est dit tel quel)

Aucune donnée n'est inventée pour remplir un écran : les services absents sont
annoncés comme indisponibles et les pages affichent un état vide explicite.

| Opération | Comportement réel | Ce que voit l'utilisateur |
| --- | --- | --- |
| Téléchargement d'épreuve | aucun fichier hébergé | bouton désactivé + statut du document |
| Bibliothèque d'épreuves | catalogue vide | état vide « La bibliothèque ouvre bientôt » |
| Paiement Mobile Money / carte | refus `BACKEND_UNAVAILABLE` | encart « paiement pas encore ouvert » |
| Analyse de document IA | refus `BACKEND_UNAVAILABLE` | carte « disponible prochainement » |
| Assistant IA | refus `BACKEND_UNAVAILABLE` | page d'indisponibilité, aucune réponse pré-écrite |
| Crédits / abonnement | solde 0, aucun pack ni formule | pages d'attente sans tarif |
| Compositions | aucune composition ouverte | codes refusés proprement |
| Modération admin | file vide | état vide |

Seul avertissement conservé : sur `/auth`, qui explique que la connexion,
l'inscription et le tableau de bord restent locaux tant que le backend n'existe
pas.

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
3. Aucune donnée inventée : un service absent s'annonce indisponible (état vide, message clair).
4. Aucun secret, aucune dépendance Supabase.

---

## Déploiement

Vercel déploie la **racine** du dépôt (`vercel.json` : framework Next.js). Le champ
`engines.node` de `package.json` force Node 22 et prend le pas sur le réglage
« Node.js Version » du projet Vercel — sans lui, le build échoue immédiatement.
Voir `docs/FRONTEND_GUIDE.md` § 11.

## Convention de branches

Les branches de travail sont nommées **`KRAFTER`** (préfixe `KRAFTER/` pour un
lot de travail, ex. `KRAFTER/landing-images`, `KRAFTER/theme-glass`). Ce préfixe
remplace définitivement `arena/` dans les prochaines branches du projet.

La branche de session courante, elle, est imposée par l'environnement
d'exécution et ne peut pas être renommée ; ses PR portent néanmoins la mention
KRAFTER dans le titre et la description.

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
