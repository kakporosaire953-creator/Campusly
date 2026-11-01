# Guide du frontend — Campusly (Next.js)

> Ce guide décrit l'application située dans `web/` : comment la lancer, comment elle est
> organisée, quelles sont les règles à respecter pour la maintenir, et ce qui est
> volontairement simulé.

---

## 1. Démarrage

```bash
cd web
npm install
npm run dev        # http://localhost:3000 (écoute aussi sur 0.0.0.0)
npm run typecheck  # tsc --noEmit
npm run test       # Vitest (services + composants)
npm run build      # build de production
npm run start      # serveur de production
```

Pré-requis : Node 20+. Aucune variable d'environnement n'est nécessaire : l'application
fonctionne **sans backend**, entièrement à partir de données de démonstration locales.

---

## 2. Organisation

```
web/
├── app/                    # routes (App Router)
├── components/
│   ├── ui/                 # Button, Card, Badge, Progress, States, Modal, Field, PageHeader, Toast
│   ├── layout/             # SiteHeader, SiteFooter, AppShell
│   ├── navigation/         # RoleSwitcher, CreditsPill, NotificationBell
│   └── shared/             # AppProviders, HeroPreview, FaqSection, LegacyHashRedirect
├── features/               # logique d'interface par domaine
├── services/               # accès aux données (seul point d'entrée : services/index.ts)
├── types/                  # contrats TypeScript (source de vérité)
├── hooks/                  # useAsync
├── config/                 # site.ts (navigation, libellés, mentions légales)
├── styles/                 # legacy/ (historique) + app/ (compléments)
└── tests/                  # Vitest
```

### 2.1 Cartographie des routes

| Route | Fichier | Type |
| --- | --- | --- |
| `/` | `app/(public)/page.tsx` | statique |
| `/a-propos` | `app/(public)/a-propos/page.tsx` | statique |
| `/conditions` | `app/(public)/conditions/page.tsx` | statique |
| `/politique-de-confidentialite` | `app/(public)/politique-de-confidentialite/page.tsx` | statique |
| `/contribuer` | `app/(public)/contribuer/page.tsx` | statique |
| `/auth` (onglets via `?tab=register`) | `app/(auth)/auth/page.tsx` | statique + client |
| `/onboarding` | `app/(auth)/onboarding/page.tsx` | statique + client |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | statique + client (dispatch par rôle) |
| `/dashboard/revision` | …/revision | client (Suspense) |
| `/dashboard/epreuves` | …/epreuves | dynamique (`?faculte=`) |
| `/dashboard/epreuves/[id]` | …/epreuves/[id] | dynamique |
| `/dashboard/classrooms`, `/dashboard/classrooms/[id]` | … | statique / dynamique |
| `/dashboard/compositions` | … | statique + client |
| `/dashboard/forum` | … | statique + client |
| `/dashboard/credits` | … | statique + client |
| `/dashboard/abonnement` | … | statique + client |
| `/dashboard/notifications` | … | statique + client |
| `/dashboard/profil`, `/dashboard/parametres` | … | statique + client |
| `/enseignant` | `app/(app)/enseignant/page.tsx` | statique + client |
| `/admin` | `app/(app)/admin/page.tsx` | statique + client |
| `/assistant-ia` | `app/(app)/assistant-ia/page.tsx` | statique + client |
| `/examen/[code]` | `app/examen/[code]/page.tsx` | dynamique, plein écran |
| `/offline` | `app/offline/page.tsx` | statique |
| 404 | `app/not-found.tsx` | — |

### 2.2 Règle de dépendance

```
app → features → services → types
        ↓
   components/ui
```

- Un composant **ne doit jamais** importer `services/mocks/**` : seuls les services y
  accèdent. La donnée fictive reste ainsi remplaçable en un seul point.
- Un composant ne fait pas de `fetch` : il appelle un service typé.
- Les types de `web/types/` sont la référence commune avec le futur backend.

---

## 3. Identité visuelle (règle absolue)

**Ne pas redessiner Campusly.** Le CSS historique est la source unique :

| Fichier | Statut | Contenu |
| --- | --- | --- |
| `styles/legacy/modern.css` | importé | design system réel (couleurs, boutons, cartes, navbar, footer) |
| `styles/legacy/theme-light.css` | importé | thème clair (tokens) |
| `styles/legacy/enhancements.css` | importé | effets et micro-animations |
| `styles/legacy/responsive-scale.css` | importé | échelles typographiques et conteneurs |
| `styles/legacy/mobile.css` | importé | navigation mobile (drawer) |
| `styles/legacy/interactive-buttons.css` | importé | états des boutons |
| `styles/legacy/pages/*.css` | importés par route | styles extraits des `<style>` inline historiques |
| `styles/app/campusly-next.css` | importé | **compléments uniquement** (focus, états, bannière démo, utilitaires) |
| `styles/app/exam-room.css` | importé par la route d'examen | traduction des styles inline de `exam-room.html` |
| `design-system.css`, `style.css`, `components.css`, `sections-premium.css`, `hero-futuriste.css`, `skeleton-loaders.css`, `revision.css`, `theme-dark.css` | **non importés** | code mort / contradictions (cf. `PROJECT_AUDIT.md` §4) |

Palette (inchangée) : `--brand-1 #1565C0`, `--brand-2 #42A5F5`, `--accent #F57C00`,
`--accent-2 #FF9800`. Typographie : Plus Jakarta Sans (titres) + Inter (texte) +
JetBrains Mono (données techniques). Icônes : Font Awesome 6 (CDN).

### 3.1 Ce qui peut être corrigé

- ergonomie (cibles tactiles ≥ 44 px, ordre de tabulation, libellés explicites) ;
- cohérence (mêmes boutons, mêmes espacements, mêmes libellés entre rôles) ;
- accessibilité (contraste, `aria-*`, focus visible, fermeture par Échap) ;
- responsive (tables défilantes, drawer mobile, grilles fluides) ;
- états manquants (chargement, vide, erreur, succès).

### 3.2 Ce qui ne doit pas changer

Proportions des sections, structure des cartes, animations existantes, palette,
logo, hiérarchie typographique, ton des textes.

---

## 4. Composants

| Composant | Usage |
| --- | --- |
| `Button` | `variant` (`primary`/`accent`/`outline`/`ghost`), `size`, `icon`, `href` (rend un lien) |
| `Card`, `CardHeader` | conteneurs `.card` historiques |
| `Badge`, `DemoBadge`, `RoleBadge` | étiquettes ; `DemoBadge` marque toute donnée fictive |
| `ProgressBar`, `StatCard` | progression et indicateurs `.stat-card` |
| `States` | `EmptyState`, `ErrorState`, `LoadingGrid`, `SkeletonCard`, `Loader` |
| `Modal` | dialogue accessible (`aria-modal`, focus trap, Échap, retour du focus) |
| `Field` | `TextField`, `SelectField`, `TextAreaField` avec label, aide et erreur `aria-describedby` |
| `PageHeader` + `Avatar` | en-tête de page de l'espace connecté |
| `ToastProvider` | notifications non bloquantes (`useToast`) |
| `AppShell` | sidebar 260 px + header 68 px, drawer mobile, fil d'Ariane |
| `RoleSwitcher` | bascule étudiant / enseignant / admin (démonstration uniquement) |

### 4.1 Accessibilité

- lien d'évitement « Aller au contenu » présent dans le layout racine ;
- `main#contenu` sur chaque gabarit ;
- focus visible (`campusly-next.css`), anneaux de focus conservant la palette ;
- `prefers-reduced-motion` respecté ;
- contrastes : texte secondaire `--text-2` sur fond clair ≥ 4,5:1 ;
- formulaires : label associé, `aria-invalid`, message d'erreur annoncé (`role="alert"`).

---

## 5. Données de démonstration

- Stockage : `localStorage`, préfixe `campusly.web.demo.v1.` (jamais de donnée sensible).
- Latence simulée (`demoDelay`) pour rendre visibles les états de chargement.
- Opérations simulées : téléchargement d'épreuve, paiement, remise de copie, analyse IA,
  modération admin, envoi de contribution.
- Réinitialisation : `/dashboard/parametres` → « Réinitialiser la session », ou
  `localStorage.clear()`.

| Identité de démonstration | Valeurs |
| --- | --- |
| Étudiant | Rosaire Kakpo · matricule `23180001` · FAST · 120 crédits fictifs |
| Enseignant | Dr. Komlan Agboton · vérifié · 500 crédits fictifs |
| Admin | Aline Sossou |
| Code composition | `ALGO1`, `BDDTP2`, `ANALTD` |
| Codes classroom | `ALGO24`, `ANAL24`, `BDD24X`, `DRPT30` |

Toute donnée affichée doit rester identifiable comme fictive (badge, bandeau ou mention
en pied de carte).

---

## 6. Tests

```bash
npm run test
```

- `tests/services.test.ts` : filtres d'épreuves, favoris, correction de quiz, débit de
  crédits, paiement (jamais d'URL réelle), compositions (correction locale).
- `tests/components.test.tsx` : `Button` (bouton/lien/externe), `Badge`, états,
  `ProgressBar` (bornage + `aria-valuenow`), `Modal` (Échap, absence de rendu fermé).
- `tests/features.test.tsx` : parcours réels de la bibliothèque d'épreuves (recherche,
  état vide, réinitialisation, favoris, modale de téléchargement simulé) et du moteur
  de quiz (réponses, résultat local, reprise).

33 tests au total. Ce qui n'est **pas** couvert par des tests automatisés est vérifié
manuellement et listé dans la section 8.

---

## 7. PWA et mode hors ligne

- `app/manifest.ts` génère `/manifest.webmanifest` (nom, couleurs, icônes) ;
- icônes générées à partir du logo officiel : `public/icons/icon-192.png`,
  `icon-512.png`, `maskable-512.png`, `apple-touch-icon.png`, `favicon.ico` ;
- la page `/offline` existe et est prête à être mise en cache ;
- **le service worker historique n'est pas enregistré** dans cette phase : un cache
  agressif masquerait les mises à jour et fausserait la validation. La réactivation est
  prévue avec la version backend (voir `BACKEND_ROADMAP.md`).

---

## 8. Vérifications réalisées

| Vérification | Méthode | Résultat |
| --- | --- | --- |
| Démarrage | `npm run dev` / `npm run start` | OK |
| Build de production | `npm run build` | 26 routes générées |
| Types | `npx tsc --noEmit` | 0 erreur |
| Tests | `npm run test` | 33/33 |
| Accessibilité des routes | `curl` sur les 23 routes principales | 200, 404 sur route inconnue |
| Redirections historiques | `curl /index.html`, `/dashboard.html`, `/epreuves.html`, `/exam-room.html`, `/offline.html` | 308 vers les nouvelles routes |
| Absence de Supabase | `grep -ri supabase web/` | aucune référence dans le code du frontend |
| Absence de secret | inspection de `web/` | aucune clé, aucun `.env` |

Les tests ne couvrent pas le rendu visuel pixel à pixel : aucune capture automatisée
n'est réalisée dans cet environnement.

---

## 9. Ajouter une page

1. Créer la route dans le bon groupe (`(public)`, `(auth)`, `(app)`).
2. Ajouter l'entrée de navigation dans `config/site.ts` (`publicNav` / `appNav`) avec
   ses rôles autorisés (présentation uniquement).
3. Si la page a besoin de données : ajouter la méthode au service concerné, le type
   dans `web/types/`, les fixtures dans `services/mocks/fixtures/`.
4. Utiliser `PageHeader`, `Card`, `States` pour rester cohérent.
5. Marquer toute donnée fictive (`DemoBadge`, mentions).
6. Ajouter ou adapter un test si la logique est non triviale.

---

## 10. Limites connues

- Les contrôles de rôle sont **de présentation** : ils ne protègent rien sans backend.
- Les données ne sont pas partagées entre appareils (stockage local).
- Le téléchargement de PDF, le paiement, l'IA et la modération sont simulés.
- Le rendu a été vérifié par build, routes HTTP et revue de code ; aucun test visuel
  automatisé (capture d'écran) n'a été exécuté.
