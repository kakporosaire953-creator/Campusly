# Campusly — Motion, Liquid Glass & Internationalisation

**Diagnostic et plan d'intervention — Phase 1 (audit), avant toute modification.**

Document de travail de la branche `arena/92a28e77-campusly`.
Il décrit l'état réel du dépôt au commit `e5ea2f1`, les contraintes mesurées,
les arbitrages retenus et l'ordre d'exécution. Il est mis à jour au fil des
phases.

---

## 0. Décisions cadrées avec le porteur du projet

| Sujet | Décision retenue | Conséquence |
| --- | --- | --- |
| Architecture d'URL pour les 7 langues | **Pas de préfixe.** La langue est une préférence (cookie + `localStorage`), comme le thème. | Aucune URL existante ne change, aucune arborescence `app/` n'est dupliquée. Le `lang`, les titres et descriptions sont rendus dans la langue choisie ; les équivalents sont déclarés en `hreflang` via `alternates.languages` avec un paramètre `?lang=` pour rester indexables. |
| Périmètre | **Tout**, y compris les espaces authentifiés. | Livraison par étapes sur la branche : socle + public d'abord, espace connecté ensuite. Chaque étape est buildée et testée séparément. |
| Mode sombre | **Étendu au gabarit public.** | Le papier ivoire n'est plus une contrainte absolue : `.public-shell` suit désormais `data-theme`, avec une variante Nocturne dédiée. |

Contraintes absolues rappelées : pas de merge, pas de déploiement, aucun
service métier, aucune route, aucun CTA, aucun média métier supprimé.

---

## 1. Architecture réelle du dépôt

### 1.1 Piles et versions

| Élément | Version | Remarque |
| --- | --- | --- |
| Next.js | **15.5.28**, App Router | `next.config.ts` ; images non optimisées (compatibilité Workers), redirections `.html` historiques, `allowedDevOrigins` pour l'aperçu sandbox |
| React | **19.2.0** | `useGSAP` de `@gsap/react@2.1.2` |
| GSAP | **3.15.0** | `ScrollTrigger`, `SplitText`, `ScrollSmoother`, `Observer`, `Flip`, `DrawSVG`, `MorphSVG`… **tous présents dans `node_modules`**. `SplitText` est donc utilisable sans acquisition. |
| TypeScript | 5.9.3 | `npx tsc --noEmit` = 0 erreur au départ |
| Vitest | 5.0.5 | 43 tests dans 5 fichiers |
| Playwright | non déclaré | instal­lé à la demande (`playwright-core`) pour les contrôles visuels |

**Aucune bibliothèque d'internationalisation n'est installée.** Aucun
`middleware.ts`, aucun dossier `messages/`, aucune fonction `t()`.

### 1.2 Routes

24 routes statiques + 3 dynamiques = **26 entrées** au build.

- **Public** (`app/(public)/`) : `/`, `/a-propos`, `/conditions`,
  `/politique-de-confidentialite`, `/contribuer`. Gabarit `.public-shell`
  (header + `MotionScope` + footer).
- **Auth** (`app/(auth)/`) : `/auth`, `/onboarding`. Pas de `MotionScope`.
- **Applicatif** (`app/(app)/`) : `/dashboard` et 11 sous-routes,
  `/enseignant`, `/admin`, `/assistant-ia`. Coquille `AppShell` (sidebar 260 px).
- **Hors gabarit** : `/examen/[code]` (plein écran), `/offline`, `not-found`.

### 1.3 Systèmes de styles (29 feuilles, ~9 800 lignes)

Ordre d'import dans `app/globals.css` : legacy (`modern`, `theme-light`,
`enhancements`, `responsive-scale`, `mobile`, `interactive-buttons`,
`pages/*`) → `campusly-next` → `site-chrome` → `theme-dark` → `theme` →
`editorial` → `public-secondary` → `motion` → `icons` → `reading` →
**`brand.css` en dernier**.

`brand.css` est le socle de marque (jetons, primitives, focus). Les couches
historiques consomment les jetons via des alias (`--brand-1`, `--text-*`,
`--surface*`, `--border*`…), ce qui évite une réécriture de 9 800 lignes.

**Dette identifiée** : `--glass-*` (7 jetons) vivent dans `theme.css`, pas
dans `brand.css` ; `theme-dark.css` et `theme.css` déclarent encore des
sélecteurs `[data-theme="dark"]` de structure (63 + 29 occurrences).

### 1.4 Thème — mécanisme actuel

- `ThemeProvider` (client) : `ThemeMode = "light" | "dark"`, stockage
  `campusly.theme`, synchronisation `data-theme` + classes historiques
  `theme-light` / `theme-dark` sur `<html>`.
- Script inline `themeInitScript` dans `<head>` (`app/layout.tsx`) : applique
  le thème avant le premier rendu → pas de flash. **À conserver tel quel dans
  son principe.**
- `ThemeToggle` : bouton 2 états (`aria-pressed`).
- **Le gabarit public est volontairement figé en papier ivoire**
  (`editorial.css` §0 re-fixe toute la palette claire sous
  `html:has(.public-shell)`) et la bascule y est **masquée** (§18).
  → C'est exactement ce que la nouvelle direction remet en cause.

### 1.5 Médias

Deux photographies seulement, toutes deux **décoratives**, toutes deux
légendées « visuel d'illustration » :

| Fichier | Usage | Poids |
| --- | --- | --- |
| `public/images/hero-students.jpg` | `components/editorial/Hero.tsx` | 118 Ko |
| `public/images/library-study.jpg` | `app/(public)/page.tsx` (figure de la section « Fonctions ») | 106 Ko |

**À conserver** : `public/icons/*` (PWA), `public/og-image.png` (Open Graph,
média fonctionnel de partage), `public/fonts/{brand,fa}`, le logo SVG, les
avatars générés (initiales), toute illustration des espaces pédagogiques.

### 1.6 Mouvement existant

| Couche | Contenu |
| --- | --- |
| `lib/gsap.ts` | enregistrement unique + `prefersReducedMotion()` + `isCompactViewport()`. Bon socle, à étendre. |
| `components/motion/MotionScope.tsx` | orchestrateur par attributs `data-*` : `data-reveal`, `data-pop`, `data-split`, `data-slam`, `data-stamp`, `data-fill`, `data-mask`, `data-lift`, `data-parallax`, `data-float`. Contexte révoqué au démontage, filet de sécurité à 2,6 s. |
| `components/motion/MotionGlobal.tsx` | survol / clic / icônes par délégation sur `document`, GSAP chargé à la demande. |
| CSS | 23 `@keyframes` réparties dans 13 feuilles ; `prefers-reduced-motion` déjà traité dans 13 fichiers. |

**Diagnostic de mouvement** : le vocabulaire existant est **théâtral** —
`back.out(2)` sur des caractères qui tombent de 130 %, cartes qui « popent »
en tournant, étiquettes tamponnées à ×2,6, astérisque en rotation perpétuelle.
C'est précisément ce que la consigne interdit (« pas un template de
démonstration »). Il faut **remplacer le vocabulaire**, pas l'enrichir.

### 1.7 Internationalisation — état des lieux

- **Aucun** mécanisme en place.
- **1 408 chaînes françaises** de plus de 25 caractères dans `app/`,
  `components/`, `features/` (86 fichiers, ~10 000 lignes).
- Textes dans les tableaux de configuration (`config/site.ts` : navigation,
  pied de page, libellés de rôle), dans les métadonnées, dans les attributs
  `aria-label`, dans les messages de validation.
- Contenus **à ne pas traduire** : données de démonstration pédagogiques
  (titres de compositions, matières), noms d'utilisateurs, messages saisis
  par l'utilisateur.

### 1.8 Performances — points de vigilance mesurés

- 36 déclarations `backdrop-filter` dans les feuilles : le verre existe déjà,
  mais de façon dispersée et non systématique.
- `next/image` non optimisé (contrainte Workers) : les deux JPG sont servis
  tels quels.
- Le gabarit public charge GSAP ; `/auth` et l'espace connecté non.
- Polices : `Baloo 2` + `Manrope`, 10 woff2, `unicode-range` **latin
  uniquement** → **le chinois ne peut pas être rendu par ces fontes** ; le
  fon et le yoruba utilisent des diacritiques (`Ɛ ɔ ɖ ŋ`, tons `á à ẹ ọ ṣ`)
  partiellement couverts par `latin-ext` mais **pas garantis** par la plage
  déclarée.

---

## 2. Arbitrages techniques

### 2.1 Internationalisation — système retenu

Pas de `next-intl` : la bibliothèque impose des segments `[locale]` (ou un
middleware de réécriture) que le porteur a écartés. On construit donc un
système **centralisé, typé et extensible**, conforme aux exigences :

```
lib/i18n/
  config.ts        locales, libellés natifs, ordre, BCP-47, formats Intl
  dictionaries.ts  chargement serveur (un seul dictionnaire par requête)
  provider.tsx     I18nProvider client + useI18n() / useT()
  format.ts        dates, nombres, pluriels (Intl), sans conversion de devise
messages/
  fr.json  en.json  es.json  de.json  zh-CN.json  fon.json  yo.json
```

- **Un seul dictionnaire** est chargé par requête (celui de la langue
  active), côté serveur, puis passé au provider : pas de 7 × N Ko dans le
  bundle client.
- La langue est lue **dans le cookie** au rendu serveur → `<html lang>`
  correct, aucun mélange ni flash.
- Conséquence assumée et documentée : le rendu du gabarit devient dynamique
  (une requête = une langue). C'est le prix de l'absence de préfixe d'URL.
- Le dictionnaire est **typé** : `Messages` dérivé de `fr.json`, donc une clé
  manquante casse le typecheck au lieu de produire un écran vide.
- Repli en cascade : langue demandée → `fr`. Jamais de clé brute affichée.

### 2.2 Thème — système retenu

Trois **préférences** (`light`, `dark`, `system`) et un **thème résolu**
(`light` | `dark`) posé sur `<html data-theme>` :

| Attribut | Valeur | Rôle |
| --- | --- | --- |
| `data-theme` | `light` / `dark` | thème **résolu**, seul lu par le CSS |
| `data-theme-pref` | `light` / `dark` / `system` | préférence utilisateur, pour le sélecteur et les tests |

- Le script inline continue d'écrire ces deux attributs **avant le premier
  rendu** (aucun flash), et suit désormais `prefers-color-scheme` quand la
  préférence est `system` (réactif au changement système).
- Les classes historiques `theme-light` / `theme-dark` restent synchronisées :
  9 feuilles legacy s'appuient dessus.
- Source de vérité unique : `components/shared/theme/` (provider, script,
  hook). L'ancien `ThemeToggle` 2 états est **remplacé** par le panneau de
  préférences.

### 2.3 Liquid Glass — architecture des matériaux

Nouvelle feuille `styles/app/glass.css`, importée **après `brand.css`** :

| Matériau | Classe / jeton | Emploi |
| --- | --- | --- |
| Glass Primary | `.glass` / `--glass-material-*` | cartes et panneaux de contenu |
| Glass Elevated | `.glass .glass--elevated` | panneaux importants, en-têtes de section |
| Glass Floating | `.glass--floating` | menus, popovers, sélecteurs |
| Glass Interactive | `.glass--interactive` | éléments survolables |
| Glass Navigation | `.glass-nav` | header, sidebar, barre mobile |

Règles tenues : le verre ne porte **jamais** un contenu dense (tableaux,
formulaires longs → surfaces opaques) ; `backdrop-filter` limité aux zones
qui en tirent un bénéfice ; repli `@supports not (backdrop-filter: blur())`
en surface opaque ; effets réduits sous 768 px et sous
`prefers-reduced-transparency`.

### 2.4 Mouvement — vocabulaire resserré

On conserve l'architecture `data-*` (elle est saine : une portée, nettoyage,
filet de sécurité) mais on **remplace les valeurs** :

| Attribut | Effet retenu | Interdit |
| --- | --- | --- |
| `data-rise` | `y: 18px → 0`, `opacity 0 → 1`, `power2.out` 600 ms | plus de 48 px, plus de rebond |
| `data-fade` | opacité seule, 400 ms | — |
| `data-line` | filet tracé (`scaleX 0 → 1`), 800 ms `power3.inOut` | — |
| `data-words` | révélation par mots, `y: 100%` masqué, 700 ms, décalage 24 ms | plus de rotation, plus de `back.out` |
| `data-stagger` | enfants révélés en cascade de 60 ms | — |
| `data-drift` | parallaxe `±8 px`, desktop uniquement | au-delà de 12 px |

Durées et easings centralisés dans `lib/motion/tokens.ts` ; aucune valeur
d'animation écrite en dur dans un composant.

---

## 3. Plan d'exécution

| Phase | Contenu | Critère de sortie |
| --- | --- | --- |
| 1 | **Audit** (ce document) | validé |
| 2 | **Motion foundation** : jetons, vocabulaire, `MotionScope` resserré | build + `reduced-motion` vérifié |
| 3 | **Image-free** : hero et figure recomposés (typographie, filets, fragments d'interface) | 0 image décorative, 0 régression de contraste |
| 4 | **Liquid Glass** : `glass.css`, Nocturne, mode public thémé | 3 préférences × pages publiques + applicatives |
| 5 | **Header & préférences** : panneau unifié (langue + apparence), menu mobile | clavier + lecteur d'écran |
| 6 | **i18n** : socle, 7 dictionnaires, pages publiques + auth | 0 chaîne française en dur dans le périmètre |
| 7 | **Intégration globale** : sidebar, formulaires, tableaux, modales, notifications | — |
| 8 | **Motion refinement** : transitions de thème, interactions vitrées | — |
| 9 | **QA** : responsive × 5, contrastes, 7 langues, 3 préférences | rapport chiffré |

### État d'exécution (mis à jour)

| Phase | État | Détail |
| --- | --- | --- |
| 1 | ✅ | audit ci-dessus |
| 2 | ✅ | `lib/motion/tokens.ts`, `MotionScope`, `data-rise/fade/words/line/stagger/drift/rail` |
| 3 | ✅ | 2 photos décoratives retirées, hero et figures recomposés (typo, filets, fragments d'interface, index) |
| 4 | 🟡 | verre + Nocturne en place sur public et applicatif ; **reliquat** : quelques surfaces de la salle d'examen et des tableaux denses n'ont pas été recontrôlées en sombre |
| 5 | ✅ | un seul contrôle (globe + code), panneau à deux zones, panneau mobile dans le menu, ancrage mesuré, panneaux porteurs de texte opaques |
| 6 | ✅ | public, auth, 404, hors ligne, coquille applicative, tableau de bord apprenant, navigation, titres de page |
| 7 | 🟡 | traduits : coquille, tableau de bord apprenant, navigation, états, titres. **Restent en français** : bibliothèque d'épreuves, salle d'examen, forum, compositions, classrooms, révision, crédits, profil, paramètres, notifications, espaces enseignant et admin, assistant IA |
| 8 | ✅ | transition de thème 240 ms sans flash (bug d'hydratation corrigé), `prefers-reduced-motion` respecté |
| 9 | 🟡 | responsive × 5 sans débordement, 7 langues vérifiées sur les pages traduites, `prefers-reduced-motion` vérifié ; contrastes non re-mesurés après les dernières modifications |

#### Corrections issues de la QA (détail)

1. **Thème sombre perdu après hydratation.** `ThemeProvider` appliquait
   « suivre le système » dès le premier effet, avec l'état initial (`system`,
   clair), avant d'avoir relu la préférence. Un visiteur revenant en sombre
   voyait la page s'éclaircir. Mesuré : `data-theme` = `dark` au chargement,
   `light` 800 ms plus tard. Corrigé par une garde d'hydratation ; re-mesuré :
   `dark` → `dark`.
2. **Panneau de préférences débordant.** Le panneau dépassait le bas de la
   fenêtre (dernières options coupées). Ancrage et hauteur maximale mesurés sur
   la capsule réelle, défilement interne.
3. **Panneau transparent.** La barre porte un `backdrop-filter`, donc le
   panneau (descendant) ne pouvait pas flouter la page : le texte du sommaire
   se lisait sous les options. Le panneau est porté dans `document.body`, et
   les surfaces porteuses de texte sont opaques.
4. **Toile de fond en tofu.** Aucune fonte CJK sur la machine : les sinogrammes
   sortaient en rectangles. Sous-ensembles auto-hébergés (Noto Sans SC 542
   sinogrammes, Noto Sans latin étendu + vietnamien 514 caractères, 150 Ko),
   avec `unicode-range` et une pile qui laisse Baloo 2 et Manrope devant.
5. **Titre composé avec une espace parasite** en allemand et en chinois
   (« Nutzungs bedingungen. »). Les titres sont désormais une phrase complète
   plus la portion mise en valeur (`SplitAccent`).

### Vérifications prévues à chaque étape

`npx tsc --noEmit` · `npx vitest run` · `npm run build` · captures Playwright
aux 5 viewports (1440×900, 1024×768, 768×1024, 390×844, 360×800) · audit de
contraste (fond effectif calculé, attente ≥ 1 000 ms) · contrôle
`prefers-reduced-motion` · contrôle des débordements (`scrollWidth -
clientWidth`).

### Limite annoncée

Le périmètre « tout, y compris l'espace connecté » représente ~1 400 chaînes
sur 86 fichiers. La livraison est **séquencée** ; le rapport final indiquera
précisément ce qui est traduit, ce qui reste en français, et ce qui n'a pas pu
être validé linguistiquement.
