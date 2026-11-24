# Guide du frontend — Campusly (Next.js)

> Ce guide décrit l'application située dans la racine du dépôt : comment la lancer, comment elle est
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
(racine du dépôt)
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
- Les types de `types/` sont la référence commune avec le futur backend.

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

**Deux palettes cohabitent, sur deux périmètres distincts.**

| Périmètre | Palette | Source |
| --- | --- | --- |
| Accueil public (et pages légales du gabarit public) | `--paper #F4F1E9`, `--ink #122D45`, `--signal #326DE6`, `--ember #E77D43` | `styles/app/editorial.css` |
| Application (`/dashboard`, `/auth`, `/examen`…) | `--brand-1 #1565C0`, `--brand-2 #42A5F5`, `--accent #F57C00`, `--accent-2 #FF9800` | `styles/legacy/modern.css` |

Le bleu et l'orange historiques **restent** ceux de l'application : la refonte ne
touche pas aux écrans de travail, seulement à la vitrine. Le logo (chapeau SVG
bleu) est conservé tel quel.

Typographie : **Fraunces** (serif éditoriale, titres de l'accueil) +
**Manrope** (texte et interface, §5 bis) + JetBrains Mono (numéros, données
techniques). Icônes : Font Awesome 6 (CDN).

### 3.1 Ce qui peut être corrigé

- ergonomie (cibles tactiles ≥ 44 px, ordre de tabulation, libellés explicites) ;
- cohérence (mêmes boutons, mêmes espacements, mêmes libellés entre rôles) ;
- accessibilité (contraste, `aria-*`, focus visible, fermeture par Échap) ;
- responsive (tables défilantes, drawer mobile, grilles fluides) ;
- états manquants (chargement, vide, erreur, succès).

### 3.2 Ce qui ne doit pas changer

Logo au chapeau, nom des fonctions, ton des textes, conventions de navigation,
palette de l'application (`#1565C0` / `#F57C00`). La mise en page de l'accueil
est, elle, pilotée par les couches `editorial-*.css` (§5 quinquies) ; `/auth` et
l'espace connecté gardent leur mise en page et leurs tokens.

### 3.3 Couches de composition (ajoutées par-dessus le legacy)

| Fichier | Portée | Rôle |
| --- | --- | --- |
| `styles/app/site-chrome.css` | toutes les pages publiques | masthead `.site-nav` (voile de papier sur le hero, resserrée au défilement) et colophon `.site-footer` |
| `styles/app/editorial.css` | accueil public | **fondations** : jetons papier/encre/signal, typographie éditoriale, boutons, micro-détails, chapitres |
| `styles/app/editorial-home.css` | accueil public | **composition** des neuf séquences (ouverture, manifeste, dossiers, frise, colophon) |
| `styles/app/editorial-modules.css` | accueil public | **modules simulés** : fragments d'interface, séquence Campusly AI, FAQ animée |
| `styles/app/auth.css` | `/auth` + `/onboarding` | fiche d'authentification minimaliste |

Depuis la refonte éditoriale (KRAFTER-11), `styles/app/landing.css` est
**retirée** : remplacée par `editorial-*.css`.

`styles/app/theme.css` (verre, fond liquide) et `styles/legacy/theme-dark.css`
restent importés : **l'espace applicatif et `/auth` n'ont pas changé d'aspect**.
Sous le gabarit public, la couche éditoriale les neutralise — papier ivoire,
`.liquid-bg` masqué, colophon en encre pleine (voir `editorial.css` §0).

Les composants du registre précédent (`SectionHead`, `HeroComposition`,
`AiSequence`, `AppFragments`, `Doodles`, `LiquidBackground`) sont supprimés ; les
remplaçants vivent dans `components/editorial/`.

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

| Parcours de connexion | Valeurs |
| --- | --- |
| Étudiant | Rosaire Kakpo · matricule `23180001` · FAST · compteurs à zéro |
| Enseignant | Komlan Agboton · profil local |
| Admin | Aline Sossou |
| Codes de composition | aucun : les compositions ne sont pas encore ouvertes |
| Codes classroom | aucun : les classes sont celles que vous créez |

Aucune donnée d'activité n'est pré-remplie. Une page sans contenu réel affiche un état
vide qui explique ce qui la remplira — jamais un chiffre décoratif.

---

## 5 bis. Thème, verre et photographies

- `components/shared/ThemeProvider.tsx` : préférence `campusly.theme`, attribut
  `data-theme` sur `<html>`, classe historique `theme-light` maintenue. Un script
  inline dans `app/layout.tsx` applique le thème avant le premier rendu (pas de flash).
- **Le verre et le fond liquide sont neutralisés sur le gabarit public**
  (`.liquid-bg { display: none }`, colophon en encre pleine, surfaces planes :
  un filet d'1 px, pas de flou ni d'ombre portée). Ils **restent actifs dans
  l'application** : `theme.css` est toujours importé et `LiquidBackground` est
  toujours monté à la racine.
- Images : `public/images/*.jpg`, affichées via `next/image`. Ce sont des
  **visuels d'illustration** (et non des photographies documentaires du campus) :
  les légendes de l'accueil le disent explicitement.
  `images.unoptimized` reste activé (contrainte Cloudflare Workers).
- **Deux familles, deux rôles** (Google Fonts, `app/layout.tsx`) :
  - **Fraunces** (`opsz 9..144`, `wght 300..700`, italique compris) : titres de
    l'accueil, citations, noms de dossiers. C'est la voix éditoriale, nouvelle ;
  - **Manrope** (`400..800`) : texte courant, interface, étiquettes. C'est la
    police du site Kraken de Hustler Labs, conservée pour la lisibilité et pour
    l'identité déjà installée. Les trois rôles historiques pointent toujours
    dessus (`--font-editorial`, `--font-label`, `--font-sans`) : les pages qui ne
    sont pas l'accueil ne changent pas d'un pixel.
- Fraunces est une police variable à axe optique : `font-optical-sizing: auto`
  et `font-variation-settings: "SOFT" 0, "WONK" 1` donnent le rendu « presse »
  sans emballer de fichier local (OFL, servie par Google Fonts).
- Les capitales espacées (`.ed-eyebrow`, `.ed-label`) remplacent les anciennes
  étiquettes en pastille : ce sont elles qui portent la numérotation éditoriale.
- Chiffres, index et folios portent `font-variant-numeric: tabular-nums` et
  JetBrains Mono respectivement, pour que les colonnes s'alignent au pixel.
- `/auth` n'utilise ni verre ni Fraunces : `app/(auth)/layout.tsx` reste sur la
  pile historique.

## 5 ter. Accueil éditorial et `/auth` minimaliste

**Accueil** (`app/(public)/page.tsx`) — neuf séquences, une par chapitre.

| # | Séquence | Composition | Ce qu'elle doit produire |
| --- | --- | --- | --- |
| 01 | Ouverture | titre monumental (2 lignes découpées + 1 ligne écrasée), photo en découpe inclinée, fragment d'interface en débord, folio `01 / 09`, repère Bénin et coordonnées | première impression ; l'asymétrie remplace la colonne texte/image |
| — | Sommaire + état | liste des séquences avec leur état réel (disponible / en préparation / fermé) | le lecteur sait où il met les pieds |
| 02 | Manifeste | citation en serif, puis quatre piliers à **quatre échelles différentes**, décalés verticalement | la hiérarchie par la taille, jamais quatre cartes égales |
| 03 | L'expérience | deux dossiers inversés : fragment + photo + colonne de texte | deux usages, deux rythmes, un seul système |
| 04 | Campusly AI | **rupture en encre pleine** (`#122D45`), trame de points, démonstrateur à quatre onglets | signature visuelle ; la seule zone bleu profond de la page avec le colophon |
| 05 | Espaces pédagogiques | dyptique dissymétrique 1,35 / 0,65, filet vertical | étudiant et enseignant ne pèsent pas pareil |
| 06 | Épreuves et compositions | bande photographique pleine largeur + cartouche, quatre faits numérotés `a–d`, fragment de chronomètre | section la plus « document » |
| 07 | Progression | frise horizontale (filet + trois stations), textes sous les stations | lire un parcours en une ligne |
| 08 | Établissements | index des dix facultés en colonnes, photo large, bloc d'appel qui chevauche l'image | sérieux institutionnel, sans logo partenaire |
| 09 | Questions fréquentes | liste compacte, filtres en capitales, `<details>` natifs | densité, pas de cartes |
| — | Colophon d'appel | bande d'encre, deux CTA, mention crédits/paiement | clore sans crier |

**Ce qui a été retiré de l'accueil :** bandeau défilant permanent, doodles
« dessinés à la main », verre dépoli, ombres portées, pastilles arrondies,
cartes répétées à icône + titre + paragraphe. Les destinations, elles, sont
toutes conservées (voir §5 quinquies.4).

**/auth** (`features/auth/AuthForms.tsx`)

- Colonne unique centrée, carte unique, aucun panneau photo ni liste de fonctions.
- Inscription en deux étapes (Identité → Parcours) ; même état, mêmes
  validations, même appel à `register()` ; retour automatique à l'étape 1 si une
  erreur porte sur un champ d'identité.
- Le profil étudiant/enseignant est un vrai groupe de radios (clavier + lecteur
  d'écran) présenté comme deux options distinctes.
- Pas de « mot de passe oublié » : la fonction n'existe pas encore.
- La mention de démonstration reste visible sous la carte (authentification
  simulée, jetons d'essai).

## 5 quinquies. Direction éditoriale de l'accueil

### 5 quinquies.1 Le système, en une page

- **Registre** : magazine imprimé + interface produit. Pas de « landing SaaS ».
- **Couleurs** : papier `#F4F1E9`, encre `#122D45`, signal `#326DE6`, braise
  `#E77D43`. Le bleu est un **signal** (liens, index, filets, focus), jamais un
  décor : deux bandes d'encre seulement (Campusly AI, colophon).
- **Typographie** : Fraunces pour la voix éditoriale, Manrope pour le texte,
  capitales espacées pour les annotations, JetBrains Mono pour les numéros.
- **Formes** : rayons 0 à 2 px, bordures d'1 px, aucune ombre, aucun flou.
- **Grille** : un seul rail de 1240 px (`--chrome-max`), gouttière
  `clamp(18px, 4.4vw, 46px)`. Les compositions sont asymétriques **à
  l'intérieur** de ce rail : c'est la grille qui est stable, pas les blocs.
- **Rythme** : chaque chapitre ouvre sur un filet, un numéro, un libellé et un
  repère en capitales. Les respirations changent d'un chapitre à l'autre.

### 5 quinquies.2 Les jetons (à réutiliser, pas à redéfinir)

`styles/app/editorial.css` expose `--paper`, `--paper-2`, `--ink`, `--ink-deep`,
`--signal`, `--ember`, `--rule`, `--rule-strong`, `--muted`, `--on-ink*`,
`--serif`, `--sans`, `--mono`. Toute nouvelle section de l'accueil doit consommer
ces jetons : aucune couleur en dur, aucune nouvelle famille.

### 5 quinquies.3 Composants du kit

| Composant | Fichier | Rôle |
| --- | --- | --- |
| `Chapter` / `Marker` | `components/editorial/Chapter.tsx` | en-tête de chapitre (index, libellé, filet, note) et intertitre de colonne |
| `Asterisk`, `Ruler`, `Cross`, `LongArrow` | `components/editorial/Marks.tsx` | quatre marques géométriques ; remplacent les doodles |
| `FragLibrary`, `FragClassroom`, `FragQuiz`, `FragProgress`, `FragComposition`, `FragTeacher`, `AiTrail` | `components/editorial/PaperFragments.tsx` | aperçus d'interface et démonstrateur AI |
| `HeroEditorial` | `components/editorial/Hero.tsx` | séquence 01 |

**Règle des fragments** : un fragment reproduit la *structure* d'un écran réel
(recherche, filtres, ligne de document, question, chronomètre) et laisse les
valeurs en pointillés (`.ed-ph`). Il ne porte jamais un faux chiffre, un faux
titre d'épreuve, un faux nom d'étudiant ou une fausse note. Sa barre de titre dit
« Aperçu d'interface ».

### 5 quinquies.4 Destinations conservées

Toutes les ancres et routes de l'ancienne page existent encore :
`#hero`, `#manifeste` (nouveau), `#experience`, `#campusly-ai`, `#espaces`,
`#epreuves`, `#progression`, `#etablissements`, `#faq`, `#rejoindre`,
`#credits` ; routes `/auth`, `/auth?tab=register`, `/dashboard`,
`/dashboard/epreuves`, `/dashboard/classrooms`, `/dashboard/revision`,
`/dashboard/compositions`, `/enseignant`, `/a-propos#contact`,
`/conditions`, `/politique-de-confidentialite`, `/offline`.

`publicNav` et `footerNav` (`config/site.ts`) ont été réorganisés en trois
familles — « Campusly », « Plateforme », « Ressources et informations » — sans
perdre une seule destination. L'ancienne ancre `#fonctionnalites` est remplacée
par `#experience` : le contenu est le même, le nom colle au sommaire.

### 5 quinquies.5 Vérité éditoriale (à ne pas casser)

Les neuf séquences affichent l'état réel des fonctions. Une seule source de
vérité, répétée volontairement :

- **Disponible** : bibliothèque, espaces de cours, entraînements, compositions,
  suivi ;
- **En préparation** : analyse de document par Campusly AI (mention dans la
  séquence 04 et dans la FAQ) ;
- **Fermé** : crédits et paiements — aucun tarif, aucun pack ;
- **Toujours** : projet indépendant, jamais présenté comme adopté par l'UAC ;
  aucune statistique, aucune moyenne, aucun témoignage inventé.

## 5 quater. Mouvement — le vocabulaire du site Kraken

Le système d'animation reprend **exactement** celui du site Kraken de Hustler
Labs ([HermannRichy/kraken](https://github.com/HermannRichy/kraken),
`src/components/motion/*`), appliqué aux classes de Campusly. Aucune dépendance
ajoutée : `gsap`, `@gsap/react` et `ScrollTrigger` étaient déjà là, et
`SplitText` est livré avec GSAP depuis la 3.13.

### 5 quater.1 Les effets, et où ils servent

| Effet Kraken | Attribut | Où |
| --- | --- | --- |
| Révélation en lot, rejouée en remontant | `data-reveal` | sur-titres, titres de chapitre, piliers, dossiers, frise, colophon |
| Carte qui « pop » | `data-pop` | aperçus d'interface, panneau de suivi, fragments des séquences 03/05/06/07 |
| Titre découpé en caractères qui tombent | `data-split` | deux premières lignes du titre d'ouverture (SplitText) |
| Bloc mis en avant qui s'écrase | `data-slam` (+ `data-slam-scale`, `data-slam-rotation`) | ligne accentuée du titre d'ouverture |
| Étiquette tamponnée | `data-stamp` | stations de la frise de progression |
| Barre qui se remplit | `data-fill` | filet de la frise de progression |
| Dessin en boucle | `data-float` (`star`) | astérisque de renvoi (`components/editorial/Marks.tsx`) |
| Carte soulevée au centre de l'écran | `data-lift` | parcours Campusly AI, visuel « établissements » |
| Bandeau défilant infini | `<Marquee />` | conservé dans le kit, **retiré de l'accueil** (le rythme vient des filets) |
| Barre escamotée au défilement descendant | classe `.is-hidden` | navigation publique |
| Panneau mobile en rebond + cascade | Web Animations API | menu mobile |
| Soulèvement au survol / écrasement au clic | `[data-hover-lift]`, `[data-press]` | cartes et fragments explicitement marqués |
| Icône animée au survol du parent | `data-icon` + `<Icon />` | liens de renvoi, FAQ, « revenir en haut » |
| Bouton « revenir en haut » | `<BackToTop />` | pages publiques (carré, filet, encre) |
| Accordéon à hauteur animée + ouverture au centre de l'écran | `<details>` + GSAP | FAQ (`.faq-ed__*`) |
| Chiffre qui bascule | `<FlipNumber />` (Web Animations API) | minuteur de la salle d'examen |

Deux effets Campusly restent dans le kit : la parallaxe légère
(`data-parallax`, desktop uniquement) et le repère actif d'une séquence
(`data-rail`). L'accueil éditorial n'utilise ni l'un ni l'autre : il préfère le
masque d'image (§5 quater.4) et les filets.

### 5 quater.2 Règles tenues

- **Aucun masquage sans JavaScript** : les états d'attente sont scopés
  `.js .motion […]` ; la classe `js` est posée dans `<head>`. Sans script, la
  page reste entièrement lisible. Un filet de sécurité (2,6 s) rend visibles les
  éléments déjà à l'écran si un déclencheur n'a pas pu se créer.
- **`prefers-reduced-motion`** : `gsap.matchMedia` ne crée aucune animation,
  tout est rendu visible, la frise et les bandeaux restent statiques. Les gestes
  de survol et le minuteur sont coupés aussi.
- **Nettoyage** : un seul `useGSAP` par zone (`components/motion/MotionScope.tsx`) ;
  `mm.revert()` révoque animations et ScrollTriggers, les instances `SplitText`
  sont rendues à leur texte d'origine.
- **Recalculs** : `ScrollTrigger.refresh()` après chargement des polices, après
  `load`, et 400 ms après le montage.
- **Budget JS** : GSAP n'est chargé que par les pages publiques. `/auth` et
  l'espace connecté n'embarquent aucune bibliothèque d'animation (119 kB de
  premier chargement, inchangé) ; la barre de navigation et le minuteur d'examen
  utilisent la Web Animations API. La refonte éditoriale a fait **baisser** le
  premier chargement de l'accueil de 163 kB à **116 kB** : les composants
  supprimés (`AppFragments`, `Doodles`, `HeroComposition`, `AiSequence`,
  `SectionHead`) étaient plus lourds que leurs remplaçants.

### 5 quater.3 Accessibilité

Les animations ne portent jamais d'information : les traits décoratifs sont
`aria-hidden`, le bandeau défilant duplique sa rangée avec `aria-hidden`, les
questions de la FAQ restent des `<details>` natifs (clavier et lecteurs
d'écran) et le focus clavier déclenche les mêmes gestes que le survol.

### 5 quater.4 Ajouts de la refonte éditoriale

Le vocabulaire reste celui du site Kraken ; trois choses s'y ajoutent :

- `data-mask` : la photo se découvre par un masque qui s'ouvre
  (`clipPath: inset(0 0 100% 0)` → `inset(0 0 0 0)`, `power3.inOut` 1 s) et
  l'image revient de 1,18 à 1 (`power3.out` 1,25 s). Aucun déplacement de mise en
  page : le cadre garde sa hauteur.
- masques et révélations sont créés dans le contexte GSAP unique de
  `MotionScope` et révoqués au démontage (`kill()` + `clearProps`).
- le CTA éditorial (`.ed-btn`) change de couleur, jamais de position : la levée
  au survol n'est conservée que sur les `[data-hover-lift]` explicites.

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
| Absence de Supabase | `grep -ri supabase app components features services types` | aucune référence dans le code du frontend |
| Absence de secret | inspection de la racine du dépôt | aucune clé, aucun `.env` |

Les tests ne couvrent pas le rendu visuel pixel à pixel : aucune capture automatisée
n'est réalisée dans cet environnement.

---

## 9. Ajouter une page

1. Créer la route dans le bon groupe (`(public)`, `(auth)`, `(app)`).
2. Ajouter l'entrée de navigation dans `config/site.ts` (`publicNav` / `appNav`) avec
   ses rôles autorisés (présentation uniquement).
3. Si la page a besoin de données : ajouter la méthode au service concerné, le type
   dans `types/`, les fixtures dans `services/mocks/fixtures/`.
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

---

## 11. Déploiement Vercel

Le frontend Next.js occupe la **racine** du dépôt ; l'ancienne version statique est
archivée dans `legacy/` et n'est pas déployée.

### 11.1 Configuration

| Élément | Valeur | Rôle |
| --- | --- | --- |
| `vercel.json` (racine) | `framework: "nextjs"`, `buildCommand: "npm run build"`, `installCommand: "npm ci"`, `outputDirectory: ".next"` | neutralise les réglages pouvant rester dans le tableau de bord d'un projet créé à l'époque du site statique |
| `package.json` → `engines.node` | `"22.x"` | **prend le pas sur le réglage « Node.js Version » du projet** |
| `.nvmrc` | `22` | cohérence pour les environnements locaux |

`vercel.json` a priorité sur les réglages du tableau de bord pour `buildCommand`,
`installCommand`, `outputDirectory` et `framework`.

### 11.2 Piège rencontré (à ne pas réintroduire)

Les projets Vercel existants (`campusly`, `campusly-enpr`, `campusly-official`)
épinglaient une version de Node obsolète. Résultat : build qui échoue en quelques
secondes avec `Found invalid or discontinued Node.js Version`, sans rapport avec le
code. La parade est `engines.node` dans `package.json`, qui est prioritaire sur ce
réglage :

```json
"engines": { "node": "22.x", "npm": ">=10" }
```

Ne pas retirer cette clé : sans elle, les déploiements retombent sur le réglage du
tableau de bord.

### 11.3 Vérifier un déploiement de production

1. `npm ci && npm run build` puis `npm run start` en local ;
2. `curl -s http://127.0.0.1:3000/ | grep -o '/_next/static/css/[a-z0-9]*\.css'`
   puis `curl -o /dev/null -w '%{http_code}' <url du css>` → doit renvoyer `200`
   (une page « en texte brut » vient presque toujours d'une feuille de style en 404) ;
3. sur Vercel, l'onglet *Deployments* doit afficher un build complet
   (`Compiled successfully`, 26 routes) et non un « success » de quelques secondes.

---

## 12. Dépannage — « je n'accède pas aux autres pages »

Trois causes distinctes ont été identifiées et corrigées. Elles produisaient toutes
le même symptôme : on reste sur la page de connexion (ou sur la page courante) quand
on demande une autre page.

### 12.1 Déconnexion explicite verrouillante

`authService.logout()` posait un indicateur `logged-out` dans `localStorage`. Tant
qu'il était présent, `getSession()` renvoyait `null` : **toutes** les pages de
l'espace connecté redirigeaient vers `/auth`. Or le bouton « Explorer sans compte »
pointait lui-même vers `/dashboard`, donc rebondissait immédiatement vers `/auth`.
Un visiteur qui avait cliqué une fois sur « Déconnexion » ne pouvait plus jamais
revoir les pages internes, même après un rechargement.

Correctifs (`services/authService.ts`, `features/auth/SessionProvider.tsx`,
`features/auth/AuthForms.tsx`) :

- nouvelle fonction `startDemoSession(role)` et méthode `enterDemo()` du provider :
  elles rouvrent explicitement une session de démonstration ;
- « Explorer sans compte » appelle `enterDemo()` puis navigue (ce n'est plus un lien
  vers une page protégée) ;
- la page demandée est conservée dans l'URL : `/dashboard/epreuves` redirige vers
  `/auth?next=%2Fdashboard%2Fepreuves`, et la connexion (ou « Explorer ») ramène
  ensuite sur cette page ;
- `?next` n'accepte qu'un chemin interne (rejet de `//` et des URL absolues) : pas
  de redirection ouverte ;
- un bandeau « Connexion requise » explique la situation, et les trois identifiants
  de démonstration sont rappelés sous le formulaire.

### 12.2 Menu inutilisable sur tablette et mobile

La feuille historique `styles/legacy/pages/dashboard.css` ne révèle la barre
latérale (≤ 960 px) qu'avec la classe `.show`, alors que le composant React la
pilotait avec `.open` : le bouton hamburger n'ouvrait rien. De plus l'overlay
historique est en `z-index: 1000` et la barre latérale en `100` : même ouverte, elle
serait restée recouverte, donc incliquable.

Correctifs : `AppShell` applique `open show`, et `styles/app/campusly-next.css`
ajoute, sous `@media (max-width: 960px)`, `.app-sidebar.open { transform: translateX(0) }`
ainsi que `.app-sidebar { z-index: 1100 }`.

### 12.3 Ancien service worker PWA

L'ancienne version statique enregistrait `/sw.js` (cache `campusly-v3.1.0`). Le
nouveau frontend n'embarque aucun service worker : l'ancien ne se met donc plus à
jour et peut servir du HTML ou des charges RSC périmés, voire renvoyer vers
`/offline.html` (fichier qui n'existe plus). Le composant
`components/shared/LegacyServiceWorkerCleanup.tsx`, monté dans `app/layout.tsx`,
désinscrit ces service workers et supprime les caches `campusly-*` à chaque visite,
sans toucher aux données applicatives.

En cas de doute côté navigateur : `Ctrl+Shift+R` (rechargement forcé), ou
Application → Service Workers → *Unregister* dans les outils de développement.

### 12.4 Ce qui reste volontaire : le rôle

Chaque page de l'espace est filtrée par rôle : `/admin` n'apparaît dans le menu
qu'après bascule en rôle administration, `/enseignant` en rôle enseignant. Ces
contrôles sont **de présentation**, jamais une autorisation. La bascule de rôle se
fait depuis la carte utilisateur de la barre latérale.

### 12.5 Pas de bandeau permanent, et jamais dans `.app-layout`

`.app-layout` (feuille historique `styles/legacy/pages/dashboard.css`) est un
**flex row**. Tout enfant placé dedans est solidaire de la rangée : barre latérale
(260 px, `flex-shrink: 0`), contenu (`.app-main`, `min-width: 0`)… et, si on l'y
met, le bandeau de démonstration.

Le bandeau « Mode démonstration » a été **retiré** : l'application ne prétend plus
afficher des données réelles, elle n'affiche simplement rien qui n'existe pas. Le
seul avertissement conservé est celui de `/auth`.

L'invariant reste la structure de `components/layout/AppShell.tsx` :

```tsx
<div className="app-shell">
  <div className="app-layout">   {/* flex row historique : sidebar + main */}
    <aside className="app-sidebar">…</aside>
    <main className="app-main">…</main>
  </div>
</div>
```

Le test `tests/auth-flow.test.tsx` verrouille cet invariant : `.app-layout` doit
contenir exactement deux enfants (sidebar + contenu) et plus aucun bandeau.
