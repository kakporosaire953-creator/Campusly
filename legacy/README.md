# Archive — version statique historique

Ce dossier contient la version **d'origine** de Campusly : pages HTML, CSS, JavaScript
et migrations Supabase. Elle est conservée telle quelle pour trois raisons :

1. **référence visuelle** — c'est l'identité graphique à ne pas altérer ;
2. **base de migration** — `supabase/migrations/001_initial_schema.sql` documente les
   10 tables d'origine (cf. `docs/DATABASE_DESIGN.md`) ;
3. **audit** — `docs/PROJECT_AUDIT.md` s'appuie sur ces fichiers.

Aucun de ces fichiers n'est chargé par l'application Next.js située à la racine du
dépôt. Ils ne sont **pas** déployés.

## Contenu

| Chemin | Contenu |
| --- | --- |
| `*.html` | 17 pages statiques (accueil, dashboard, exam-room, auth, offline, 404…) |
| `css/` | 11 feuilles historiques (dont plusieurs inutilisées — voir audit §4) |
| `js/` | modules d'origine (auth Supabase, IA, modes d'apprentissage, PWA…) |
| `image/`, `manifest.json` | logo et manifeste PWA d'origine |
| `server.js`, `build-config.js`, `package.json` | serveur Express et build d'origine |
| `.env.example` | variables d'environnement historiques (aucune valeur réelle) |

## Ce qui a été repris dans le nouveau frontend

- les feuilles **actives** ont été copiées dans `styles/legacy/` (identité conservée) ;
- les styles `<style>` de chaque page ont été extraits dans `styles/legacy/pages/` ;
- les `body { visibility: hidden }` de `chatbot.html` et `contribuer.html` ainsi que la
  coquille de `mobile.css` ont été corrigés lors du portage.

Les anciennes URLs (`/index.html`, `/dashboard.html`, …) redirigent vers les nouvelles
routes : voir `next.config.ts` et le tableau du README principal.
