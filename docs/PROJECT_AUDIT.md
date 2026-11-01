# AUDIT PROJET — CAMPUSLY (état initial avant migration)

**Date de l'audit** : 1er novembre 2026
**Commit audité** : `7e17f187` (branche `main`)
**Application de production de référence** : https://campusly-one.vercel.app/
**Périmètre** : audit complet du dépôt `kakporosaire953-creator/Campusly` avant toute modification.

> Ce document décrit **l'existant**. Il ne propose pas encore d'architecture cible (voir `ARCHITECTURE.md`).
> Aucun fichier historique n'a été supprimé pendant cette phase : les pages HTML, CSS et JS d'origine restent à la racine du dépôt et servent de référence visuelle et de possibilité de retour arrière.

---

## 1. Résumé exécutif

Campusly est aujourd'hui un **site statique multi-pages** (HTML + CSS + JavaScript modules ES natifs), sans framework, déployé sur Vercel avec `outputDirectory: "."`.

| Indicateur | Valeur mesurée |
| --- | --- |
| Fichiers suivis par Git | 73 |
| Pages HTML | 18 (dont 4 simples redirections de 9 lignes) |
| Feuilles de style | 14 |
| Scripts JS | 27 (dont 7 « services ») |
| Volume total (HTML + CSS + JS + SQL) | ≈ 16 900 lignes |
| Dépendances runtime déclarées | 5 (`@google/genai`, `cors`, `express`, `multer`, `pdf-parse`) |
| Framework frontend | aucun (vanilla JS) |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) — **partiellement câblé** |
| Build | `node build-config.js` (injection de variables d'environnement) |
| Serveur local | `node server.js` (Express, 1 000+ lignes) |

**Constat central** : il existe **deux applications dans une seule**.

1. Une application « **historique Supabase** » (`auth.html`, `admin.html`, `js/auth.js`, `js/supabase.js`, `supabase/functions/*`, `supabase/migrations/*`) — c'est elle qui correspond au README et à la production Vercel.
2. Une application « **maquette locale Campusly 2.0** » (`dashboard.html`, `revision.html`, `chatbot.html`, `exam-room.html`, `js/services/*.js`, `js/campusly-ai.js`, `js/learning-modes.js`) — elle ne parle à aucun serveur : tout est simulé dans `localStorage`.

Les deux applications se contredisent (deux systèmes d'authentification, deux jeux de variables CSS, deux jeux de services, deux façons de naviguer). C'est le principal problème de maintenabilité, et c'est ce que la migration Next.js doit résoudre sans toucher à l'identité visuelle.

---

## 2. Structure du dépôt (état initial)

```
Campusly/
├── *.html                      # 18 pages à plat (pas de routing)
├── css/                        # 14 feuilles de style, cascade implicite
├── js/
│   ├── services/               # 7 « services » frontend simulés (localStorage)
│   ├── *.js                    # 13 modules (thème, IA, modes d'apprentissage, PWA…)
│   └── supabase.js             # client Supabase (identifiants placeholder)
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── functions/{chat-ai,generate-quiz,fedapay-webhook}/index.ts
├── image/logo.png
├── docs/UI_AUDIT.md            # audit UI/UX antérieur
├── server.js                   # serveur Express local (hors production)
├── build-config.js             # génération de la config au build
├── sw.js, manifest.json        # PWA
├── vercel.json, package.json, bun.lock
└── README.md                   # décrit Supabase + Groq (en partie obsolète)
```

Points notables :

- **Pas de dossier `src/`**, pas de bundler, pas de TypeScript, pas de tests.
- **Pages à plat** : toute la navigation est une navigation de fichiers (`href="dashboard.html"`), donc les liens profonds dépendent du nom de fichier.
- **`bun.lock` et `package.json`** cohabitent alors que le déploiement réel ne lance aucun build Node (site statique).
- **Doublon de documentation** : `docs/UI_AUDIT.md` (audit UI) et `README.md` (architecture) ne décrivent pas le même produit.

---

## 3. Inventaire des pages

| Page | Rôle | État réel | Dépendances |
| --- | --- | --- | --- |
| `index.html` (997 l.) | Landing marketing : hero, 6 piliers, AI, adaptatif, professeurs, compositions, progression, établissements, FAQ, pricing | **Implémentée**, très riche ; contenu statique + 1 style inline massif | `modern.css`, `theme-light.css`, `enhancements.css`, `responsive-scale.css`, `mobile.css`, `js/theme.js` |
| `auth.html` (344 l.) | Connexion + inscription, choix de rôle (étudiant/enseignant), affichage mot de passe | **Implémentée côté UI**, connectée à `authService` simulé (localStorage) — **aucun appel réseau** | styles inline + `js/services/authService.js` |
| `dashboard.html` (1 219 l.) | Shell applicatif : sidebar, header, 6 vues (`overview`, `revision`, `classrooms`, `composition`, `epreuves`, `forum`) | **Coquille fonctionnelle** : navigation par vues OK, mais **toutes les vues affichent des états vides** (pas de données) | `style.css`, `modern.css`, `responsive-scale.css`, `mobile.css`, styles inline, `authService`, `userService`, `creditService` |
| `revision.html` (239 l.) | Campusly AI (assistant 7 étapes) + 5 modes d'apprentissage | **Simulation avancée** : le wizard et les modes sont rendus par JS, génération de questions **fictive** | `design-system.css`, `modern.css`, `campusly-ai.js`, `learning-modes.js`, `adaptive-engine.js`, `credits.js` |
| `chatbot.html` (467 l.) | Assistant IA conversationnel plein écran | **Simulation** : réponses génériques hardcodées, pas d'appel IA | styles inline, `js/campusly-ai.js` |
| `exam-room.html` (901 l.) | Salle de composition surveillée (timer, anti-triche, copie) | **Simulation complète côté client** : correction locale, « proctoring » local | `style.css`, styles inline, `examService` (non importé : logique dupliquée dans la page) |
| `contribuer.html` (400 l.) | Dépôt d'épreuves (upload) | **UI seule** ; l'envoi réel Supabase n'est pas branché sur le nouveau flux | styles inline |
| `onboarding.html` (212 l.) | Onboarding post-inscription par rôle | **Implémentée** (étapes injectées en JS) | **`css/theme.css` — fichier inexistant (404 CSS)** |
| `admin.html` (142 l.) | Validation des contributions | **Câblée Supabase** ; UID admin en dur ; **affiche « Supabase » alors que les autres pages sont en mock** | `js/supabase.js` (identifiants placeholder) |
| `apropos.html` (69 l.) | À propos | Statique, contenu réel | `modern.css` + 3 |
| `conditions.html` (63 l.) | CGU | Statique | idem |
| `politique.html` (70 l.) | Politique de confidentialité | Statique | `modern.css`, `theme-light.css` |
| `404.html` (49 l.) | Page introuvable | Statique | styles inline |
| `offline.html` (154 l.) | Fallback PWA hors-ligne | Statique | **styles inline sans variables → rendu incohérent (fond clair prévu, texte `#F8FAFC`)** |
| `epreuves.html`, `forum.html`, `classrooms.html`, `composition.html` (9 l. chacune) | « Redirections » vers `dashboard.html#vue` | **Faux routage** : redirection JS + fragment ; si JS désactivé → page blanche | — |

### Navigation réelle

```
index.html ─┬─ auth.html ──► dashboard.html ──► onboarding.html
            ├─ revision.html (Campusly AI)
            ├─ chatbot.html (assistant)
            ├─ exam-room.html (salle d'examen)
            ├─ contribuer.html
            ├─ admin.html (Supabase direct)
            └─ apropos / conditions / politique / 404 / offline
epreuves|forum|classrooms|composition.html ──► dashboard.html#<vue> (redirection JS)
```

**Liens sans action / incohérents** relevés :

- `index.html` : les liens `epreuves.html`, `classrooms.html`, `composition.html` existent dans la navbar et les 6 cartes « piliers » → ils passent tous par un stub de redirection.
- `dashboard.html` : les vues `revision`, `classrooms`, `composition`, `epreuves`, `forum` contiennent des boutons (`Rejoindre un Amphi`, `Créer une composition`, `Nouvelle discussion`…) qui **n'ont aucun gestionnaire** ou ouvrent un état vide.
- `js/services/classroomService.js` et `examService.js` sont écrits mais **ne sont importés par aucune page** (code mort).
- `admin.html` appelle Supabase avec des identifiants placeholder → échec silencieux.
- `theme.js` injecte des liens `auth.html` / `dashboard.html` en dur dans le menu mobile : **toute la navigation dépend du nom de fichier**.

---

## 4. Inventaire des feuilles de style

| Fichier | Lignes | Rôle | Problème |
| --- | --- | --- | --- |
| `modern.css` | 401 | **Design system réellement utilisé** : tokens (bleu `#1565C0`, orange `#F57C00`, `Plus Jakarta Sans`), navbar, hero, boutons, cartes, dashboard, modal, toast, responsive | Référence de l'identité. **À conserver** |
| `theme-light.css` | 45 | Surcharges du thème clair (`html.theme-light`) | Charge après `modern.css` |
| `theme-dark.css` | 333 | Thème sombre `[data-theme="dark"]` | **Jamais chargé par aucune page** (code mort) |
| `enhancements.css` | 292 | Glassmorphism navbar, hero, micro-détails — avec `!important` | Force un fond sombre par défaut, écrasé par `theme-light` |
| `responsive-scale.css` | 607 | Réglages responsive, styles du shell dashboard | Contient des styles de `dashboard.html` |
| `mobile.css` | 435 | Correctifs mobiles | Charge en dernier (cascade fragile) |
| `style.css` | 780 | Ancien design system (bleu `#1E88E5`, `Inter`, `.btn` en 12 px) | **Conflit de tokens avec `modern.css`** ; chargé uniquement par `dashboard.html` et `exam-room.html` |
| `design-system.css` | 381 | « Design system futuriste 2026 » : fond `#060816`, glassmorphism, `Clash Display`, gradients | **Contredit l'identité claire** ; chargé uniquement par `revision.html` |
| `components.css` | 879 | Anciens composants (`.auth-page` sombre, `--white`) | **Jamais chargé** (code mort) ; variables `--white` inexistantes ailleurs |
| `interactive-buttons.css` | 302 | Micro-interactions boutons | Chargé sur 3 pages |
| `sections-premium.css` | 563 | Sections premium | **Jamais chargé** |
| `hero-futuriste.css` | 543 | Hero « futuriste » | **Jamais chargé** |
| `skeleton-loaders.css` | 410 | Squelettes de chargement | **Jamais chargé** |
| `revision.css` | 492 | Styles de la page révision | **Jamais chargé** (les styles utiles sont en inline dans `revision.html`) |

**Conclusion CSS** : 6 des 14 feuilles (~3 200 lignes) sont du code mort ou des doublons contradictoires. L'identité visuelle réelle est portée par `modern.css` + `theme-light.css` + `enhancements.css` + `responsive-scale.css` + `mobile.css`, complétées par de **très nombreux styles inline** dans chaque page (jusqu'à 400 lignes `<style>` par page).

Volume de styles inline par page : `dashboard.html` ≈ 400 l., `index.html` ≈ 100 l., `exam-room.html` ≈ 250 l., `chatbot.html` ≈ 200 l., `contribuer.html` ≈ 180 l., `auth.html` ≈ 40 l.

---

## 5. Inventaire JavaScript

| Module | Rôle | État |
| --- | --- | --- |
| `js/theme.js` | Thème clair forcé, menu hamburger + overlay, injection des liens auth mobiles, **injection du logo SVG** | Actif partout. **Contient du hardcode de navigation** et manipule le DOM global |
| `js/services/authService.js` | Auth simulée : connexion/inscription/Google/rôle, `localStorage` (`campusly_auth_user`) | **Actif** (auth.html, dashboard, onboarding) |
| `js/services/userService.js` | Progression, niveaux, XP, points faibles/forts | Actif (dashboard) |
| `js/services/creditService.js` | Crédits + modal de rechargement FedaPay **simulée** | Actif (dashboard) |
| `js/services/notificationService.js` | Centre de notifications + dropdown DOM | Partiellement utilisé |
| `js/services/examService.js` | Compositions, correction locale, copies | **Code mort** (aucune page ne l'importe) |
| `js/services/classroomService.js` | Classrooms, membres, devoirs | **Code mort** (données `MOCK_CLASSROOMS = []`) |
| `js/services/aiService.js` | Analyse de document / génération de quiz **fictive** | Utilisé indirectement par le wizard |
| `js/campusly-ai.js` | Wizard 7 étapes (import → analyse → config → génération → éditeur → validation → export) | Actif sur `revision.html` |
| `js/learning-modes.js` | 5 modes d'apprentissage | Actif sur `revision.html` |
| `js/adaptive-engine.js` | Niveau adaptatif + streak (localStorage) | Actif |
| `js/credits.js` | Ancien service de crédits (`campuslyCredits`) | **Doublon** de `creditService.js` |
| `js/notifications.js` | Ancien centre de notifications (`notificationCenter`) | **Doublon** de `notificationService.js` |
| `js/auth.js` | Authentification **Supabase réelle** | **Cassé** : importe `./utils.js` et `./error-handler.js` **qui n'existent pas** |
| `js/supabase.js` | Client Supabase | URL + anon key **placeholder** (`votre-project.supabase.co`) |
| `js/validators.js` | Validation matricule / mot de passe / nom / faculté | Réutilisable (logique pure) |
| `js/accessibility.js` | Aides a11y génériques | Actif |
| `js/pwa-installer.js` | Invite d'installation PWA | Actif |
| `js/nav-themes.js` | Thème de navbar | Actif |
| `js/logo.js` | Injection du logo par `export` | **Doublon** de l'injection de `theme.js` |

**Services en double** : `credits.js` ↔ `creditService.js`, `notifications.js` ↔ `notificationService.js`, `logo.js` ↔ (partie de) `theme.js`, et **trois** implémentations d'authentification (`js/auth.js` Supabase, `js/services/authService.js` mock, logique inline dans `auth.html`).

---

## 6. Données : ce qui est réel, simulé ou absent

### 6.1 Réel (câblé, mais inactif en production)

- Schéma SQL Supabase : `users`, `epreuves`, `history`, `favorites`, `quiz_results`, `transactions`, `forum_questions`, `forum_answers`, `groups`, `contributions` + trigger `handle_new_user` + RLS + index (`supabase/migrations/001_initial_schema.sql`, 299 l.).
- Edge Functions : `chat-ai`, `generate-quiz`, `fedapay-webhook` (TypeScript Deno) — présentes, **non déployables en l'état** (secrets absents, modèle IA `/models` à vérifier).
- `admin.html` interroge `contributions` / `users` (mais avec un UID admin en dur et des identifiants placeholder).

### 6.2 Simulé (données fictives assumées)

- **Toute l'authentification utilisée** : `authService` crée un utilisateur par défaut (`Rosaire Kakpo`, FAST, 120 crédits) ou un profil enseignant (`Dr. Komlan Agboton`) selon que l'identifiant contient `prof`/`mensah`/`enseignant`. Aucun mot de passe n'est vérifié.
- **Crédits** : solde stocké dans `localStorage`, « rechargement » FedaPay purement fictif (modal + timeout).
- **IA** : `aiService.analyzeDocument()` renvoie toujours le même contenu (complexité asymptotique, AVL, BFS/DFS, programmation dynamique) ; quiz générés à partir de gabarits.
- **Notations** : `examService.submitComposition()` corrige localement (QCM, vrai/faux, mots-clés) et écrit la copie dans `localStorage`.
- **Proctoring** : compteurs et alertes locaux, aucun contrôle réel.
- **Progression** : XP, niveaux, streak, points faibles → `localStorage`.
- **Paiement** : aucune intégration FedaPay côté client au-delà d'un bouton simulé.

### 6.3 Absent / vide

- `MOCK_CLASSROOMS = []`, `MOCK_COMPOSITIONS = []`, `MOCK_NOTIFICATIONS = []` → les vues Classrooms, Compositions et Notifications n'affichent **que des états vides**.
- Aucune épreuve réelle : la bibliothèque (`epreuves`) existe en base mais **aucune page ne la lit** ; `dashboard.html#epreuves` est un état vide statique.
- Forum : aucune page connectée (la vue forum du dashboard est statique).
- Aucune donnée de démonstration partagée : chaque page invente ses propres libellés.

---

## 7. Sécurité (constats côté frontend)

| # | Constat | Gravité | Détail |
| --- | --- | --- | --- |
| S1 | **UID administrateur en dur** dans `admin.html` (`ADMIN_UIDS = ["cc61bf72-…"]`) | Élevée | Contrôle d'accès côté client uniquement — contournable |
| S2 | **Autorisation par `localStorage`** : `campusly_auth_user`, `campusly_user_logged_out` pilotent l'accès aux pages | Élevée | N'importe qui peut écrire `{role:'verified_teacher'}` ou `{credits: 99999}` |
| S3 | `authService.switchRole('teacher')` accessible depuis la console | Moyenne | Le rôle « enseignant vérifié » est auto-attribué si le code d'invitation contient `UAC` |
| S4 | Clés placeholder dans `js/supabase.js` **et** dans le README (invite à coller une clé publique côté client) | Moyenne | À terme : ne jamais exposer de secret serveur au client |
| S5 | Politique CSP dans `vercel.json` autorisant `connect-src` Supabase + `unsafe-eval` | Moyenne | `unsafe-eval` neutre pour du statique, à resserrer |
| S6 | Aucune validation serveur : les crédits, notes, rôles et copies peuvent être forgés côté client | Élevée | À traiter par le futur backend |
| S7 | `confirm()` / `alert()` et messages d'erreur bruts affichés | Faible | UX |
| S8 | `metadata.json` déclare `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` sans usage associé côté client | Faible | Déclaration orpheline |
| S9 | `supabase/functions/fedapay-webhook` : vérification de signature à confirmer | À valider | Non auditable sans secrets |

**Aucun secret réel n'est présent dans le dépôt** (clés en `.env`, `.env.example` vide). Le seul « secret » manipulé est un UID admin public.

---

## 8. PWA, performances et accessibilité

**PWA**
- `manifest.json` : `theme_color #1565C0`, `lang fr-BJ`, 4 raccourcis — mais les icônes pointent vers `/assets/logo.png` **qui n'existe pas** (le logo réel est `image/logo.png`).
- `sw.js` : cache-first sur une liste de fichiers incluant `css/theme.css` (inexistant) → installation du service worker en échec partiel.
- `share_target` pointe vers `contribuer.html` (POST) — non géré par une page statique.
- `offline.html` : styles inline incompatibles avec son propre fond (texte clair sur fond clair en thème light).
- Aucune page n'enregistre `sw.js` de manière visible/robuste.

**Performance**
- 2 à 5 feuilles CSS + 1 à 3 CDN (Font Awesome, Google Fonts, jsDelivr/Supabase) par page, sans bundling ni minification.
- CSS et JS dupliqués (voir §4/§5) ; styles inline non cachables.
- Aucun `loading="lazy"` généralisé côté Next (images rares), mais aucun contrôle de police → FOUT.

**Accessibilité (constats)**
- Boutons `<a onclick>` et `div` cliquables sans rôle ni `tabindex` (ex. `.role-option`, `.epreuve-item`, cartes de crédit).
- `<i class="fas">` décoratifs sans `aria-hidden`.
- Modales sans gestion du focus ni `aria-modal` (`#creditModal`, `#createCompModal`, `#notifDropdown`).
- Contrastes : `--text-4: #94A3B8` sur fond `#FAFAFC` ≈ 2,6:1 (**insuffisant** pour du texte).
- Liens de navigation mobile injectés sans ordre de tabulation logique.
- `docs/UI_AUDIT.md` affirme un respect « WCAG AAA » : **non vérifié et non conforme** en l'état.

---

## 9. Serveur local `server.js` et `build-config.js`

- `server.js` (39 Ko) : serveur Express avec routes IA (`@google/genai`), upload `multer`, parsing PDF (`pdf-parse`) — **hors périmètre de la production Vercel** (site statique) et jamais déployé.
- Il contient une logique métier backend (Gemini) qui **contredira l'architecture cible** (Cloudflare Workers + fournisseurs IA multiples).
- `build-config.js` injecte des variables d'environnement dans un fichier de config au build.
- `package.json` déclare ces dépendances alors que le frontend n'en utilise aucune → **dépendances inutiles au frontend**.

**Décision** : ne rien supprimer pendant la migration ; documenter que `server.js` est un prototype local obsolète qui devra être retiré lors de la phase backend (voir `BACKEND_ROADMAP.md`).

---

## 10. Doublons, dépendances inutiles, contradictions

### Doublons
1. **Trois systèmes d'authentification** (Supabase `js/auth.js`, mock `js/services/authService.js`, logique inline dans `auth.html`).
2. **Deux services de crédits** (`js/credits.js`, `js/services/creditService.js`).
3. **Deux centres de notifications** (`js/notifications.js`, `js/services/notificationService.js`).
4. **Deux injections de logo** (`js/logo.js`, `js/theme.js`).
5. **Deux files de services** pour les classrooms/compositions (écrits, jamais branchés).
6. **Trois design systems CSS** (`modern.css`, `style.css`, `design-system.css`).

### Dépendances inutiles côté frontend
- `express`, `cors`, `multer`, `pdf-parse`, `@google/genai` → utilisées uniquement par `server.js` (prototype).
- `@supabase/supabase-js` chargé via CDN jsDelivr dans `js/supabase.js` (non déclaré dans `package.json`).
- Font Awesome complet via CDN (~100 Ko) pour une trentaine d'icônes.
- `bun.lock` sans usage de Bun ailleurs.

### Contradictions produit
- README : « Supabase + Groq + Firebase » ; code réel : Supabase + mock + `@google/genai` dans `server.js`.
- README : « 500+ épreuves » ; aucune épreuve n'est accessible dans l'interface.
- README : « 3 plans FedaPay 500/1500/3500 FCFA » ; l'interface propose des **packs de crédits** 500/1 000/2 500 FCFA.
- `index.html` : nav « Crédits & Tarifs » en ancre `#pricing` alors que la page vend des abonnements, pas des crédits.
- `docs/UI_AUDIT.md` déclare des tests responsive « conceptuels » et un statut final conforme → **non adossé à des tests réels**.

---

## 11. Éléments à conserver impérativement (identité Campusly)

1. **Palette** : bleu `#1565C0` (primaire), `#42A5F5` (secondaire), orange `#F57C00` / `#FF9800` (accent), états `#10B981` / `#EF4444`, fonds clairs `#FAFAFC` / `#F1F5F9`, texte `#0F172A` / `#334155` / `#64748B`.
2. **Typographie** : `Plus Jakarta Sans` (titres et UI), `Inter` (secours), `JetBrains Mono` pour les codes/matricules.
3. **Logo** : mot-symbole « Campus » (bleu) + « ly » (orange) précédé du **chapeau de diplôme SVG** (polygone bleu + cordon orange).
4. **Composants signature** : navbar fixe 68 px avec glassmorphism léger, cartes `--r-xl` (24 px) à bordure `--border`, boutons pill/`--r-md` avec ombre colorée, badges de rôle, `stat-card`, `.ep-card`, `hero-card` flottante (`heroFloat`), orbes d'arrière-plan (`orbFloat`), animations `fade-up`, toasts bas-centre.
5. **Structure des sections de la landing** (ordre et proportions) : hero 2 colonnes → 6 piliers → Campusly AI → adaptatif → professeurs → compositions → progression → établissements → FAQ → pricing → CTA → footer.
6. **Shell applicatif** : sidebar 260 px (fond `--bg-2`, carte utilisateur, bascule de rôle, menu à 6 entrées) + header 68 px avec pill de crédits.
7. **Ton éditorial** : français, UAC, ton académique bienveillant, vocabulaire « amphi / épreuves / annales / compositions / crédits ».
8. **Responsive existant** : bascule nav → hamburger à 768 px, hero en une colonne à 1024 px, sidebar en drawer à 768 px.

---

## 12. Problèmes à corriger pendant la migration (sans changer le design)

| Axe | Correction attendue |
| --- | --- |
| Routage | URLs réelles (`/dashboard/epreuves`, …) + redirections depuis les anciens `.html` |
| Données | Couche de services + mocks explicites, états loading / vide / erreur sur **chaque** vue |
| Sécurité | Aucun secret côté client, aucun contrôle d'accès « simulé » présenté comme réel, bannière de démonstration permanente |
| Doublons | Un seul service par domaine, une seule source de tokens CSS |
| CSS | Une cascade unique et documentée ; exclusion des feuilles mortes ; styles inline déplacés en CSS |
| Accessibilité | `button`/`a` réels, focus visible, `aria-*` sur menus/modales, contrastes `--text-3`/`--text-4` remontés, `prefers-reduced-motion` |
| Qualité | TypeScript, tests sur les composants critiques, `typecheck` + `build` verts |
| Documentation | Les 7 documents demandés, cohérents avec le code livré |

---

## 13. Décisions d'audit prises pour la suite

1. **Fidélité visuelle prioritaire** : `modern.css` (et sa cascade `theme-light` → `enhancements` → `responsive-scale` → `mobile`) est **réutilisée telle quelle** dans le nouveau frontend ; les styles inline des pages sont extraits en fichiers CSS dédiés, sans réécriture des valeurs.
2. **Les pages historiques restent en place** à la racine (référence + rollback). Le nouveau frontend vit dans `web/` et **aucune bascule de production** n'est effectuée.
3. **Les deux piles sont dédoublonnées dans le nouveau code** : un seul `authService` (mock explicite), un seul `creditService`, un seul `notificationService`, un seul système de crédits.
4. **Supabase devient une dépendance historique non active** du nouveau frontend : aucun import, aucune clé, aucun appel. Le schéma SQL est conservé comme **source d'inspiration** pour le modèle D1 (voir `DATABASE_DESIGN.md`).
5. **Toute donnée affichée dans le nouveau frontend est étiquetée « démonstration »**, et les actions (paiement, envoi, notation) sont présentées comme des simulations.
6. **Le backend n'est pas implémenté** : seuls les contrats (`types/`), les services simulés et la documentation sont produits.

---

## 14. Points à valider par le porteur du projet

1. Les **plans commerciaux** : abonnement (500 / 1 500 / 3 500 FCFA) ou packs de crédits (500 / 1 000 / 2 500 FCFA) ? Les deux coexistent aujourd'hui.
2. Le rôle **enseignant** : validation manuelle par le secrétariat ou code d'invitation ? Le code actuel valide tout code contenant `UAC`.
3. Le **stockage des épreuves** : R2 public signé (URLs temporaires) ou privé avec proxy Workers ?
4. La **modération du forum** : qui modère, et selon quelles règles (contenus, signalements) ?
5. La **politique IA** : conservation des documents importés, fournisseurs autorisés, mentions légales UAC.
6. Le **devenir de `server.js`** (prototype Gemini) : suppression à la phase backend ?
7. La **cible de déploiement** définitive (Cloudflare Workers) et le sort de l'hébergement Vercel actuel.
