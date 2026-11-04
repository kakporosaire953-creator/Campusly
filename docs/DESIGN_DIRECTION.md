# Direction artistique — vers une landing qui ne ressemble à aucune autre

Document de travail · KRAFTER · novembre 2026
Objet : sortir la page d'accueil de son « gabarit SaaS », en s'inspirant des
**mécanismes** de `kraken.hustlerlabs.tech` — jamais de son habillage.

---

## 1. Ce que fait vraiment Kraken (déconstruction)

Ce qui donne à cette page son aplomb n'est pas une couleur ni une animation :
c'est un **système éditorial** tenu du premier au dernier pixel.

| Mécanisme | Ce qu'on voit | Pourquoi ça marche |
| --- | --- | --- |
| **Une métaphore unique** | Le billet : « BILLET D'ACCÈS », « N° 100/100 », « Sold out », « Le dernier billet est à vous » | Le produit *est* l'objet affiché. Rien n'est décoratif : chaque bloc raconte la même chose. |
| **Chapitrage numéroté** | `01 · Le défi`, `02 · Règles et barème`, `03 · Calendrier`, `04 · Prix`, `05 · FAQ` | Donne un rythme de dossier imprimé, et une promesse de fin. On sait combien il reste à lire. |
| **Bande défilante** | `Aucune survente ✶ Aucun double débit ✶ Webhooks signés ✶` (×2) | 20 px de haut, une personnalité énorme. Coût nul, mémorisation maximale. |
| **Micro-visualisations au lieu d'icônes** | `1 000 → 1`, `Payé une fois`, `whsec_ vérifié`, `Kill -9 OK` | On montre le **comportement**, pas le concept. Une icône dit « paiement » ; `Payé une fois.` dit tout. |
| **Vocabulaire de métier assumé** | `sk_test_kraken_…`, `2 vCPU / 4 Go`, `/100` | La précision technique fait la crédibilité. Le flou marketing la détruit. |
| **Typographie contrastée** | Display serré et énorme (`V o t r e  b a c k - e n d .`), annotations en mono, corps en sans | Trois voix, trois rôles. Jamais une seule police qui fait tout. |
| **Traits et grille, pas d'ombres** | Filets d'1 px, colonnes alignées, zéro carte flottante | Aspect « planche technique » : plus dur, plus cher, plus adulte. |
| **Photos quasi absentes** | Deux logos SVG, aucun visuel stock | L'objet (billet, compteur, barème) remplace l'illustration. |
| **Tableaux qui assument** | Barème `/100` avec libellés à gauche et points à droite | Une donnée lisible en 2 s vaut dix cartes. |
| **Urgence vérifiable** | Compte à rebours + `[XX]/100` | ... mais ici, c'est une **vraie** échéance. À nous de ne jamais simuler. |

**La leçon transférable** : Kraken n'est pas « beau », il est **cohérent et
précis**. Il traite son visiteur comme un adulte qui sait lire.

---

## 2. Ce qu'on ne peut pas copier (et ne doit pas)

- **Pas de fausse urgence.** Pas de compte à rebours artificiel, pas de
  « plus que 3 places ». Notre règle produit reste : aucune donnée inventée.
- **Pas de noir technique.** Kraken vend un défi de développeurs. Campusly
  s'adresse à des étudiants de L1 et à des enseignants : le ton doit rester
  accueillant, pas intimidant.
- **Pas de métaphore « billet »** : elle appartient à Kraken, et elle évoque
  l'événementiel, pas l'université.
- **Pas de suppression des photos** : nos images sont le seul ancrage réel
  (campus, amphis, bibliothèques). On les traite autrement, on ne les jette pas.

---

## 3. Diagnostic de notre accueil actuelle

Ce qui ne fonctionne pas, précisément :

1. **Tout est centré.** Titre, description, listes, cartes, CTA. Le centrage
   systématique aplatit la page : plus d'axe, plus de tension, aucun œil guidé.
   C'est la première cause du « ça ne me plaît pas encore ».
2. **Aucune métaphore de bout en bout.** On a des sections (piliers, IA,
   progression, profs, compositions) qui se suivent sans appartenir au même
   objet. Un visiteur ne repart pas avec une image mentale.
3. **Des cartes partout.** `card`, `pillar-feature`, `stage-panel`, `study-flow`,
   `credits-band`, `faq-item` : six familles de boîtes aux bords arrondis et au
   verre dépoli. C'est joli, mais ça ne hiérarchise plus rien.
4. **Aucun rythme.** Chaque section occupe la même hauteur, le même blanc, le
   même type de titre. Le lecteur ne sait pas ce qui est important.
5. **Une seule voix typographique.** Plus Jakarta Sans du haut en bas, avec
   Instrument Serif cantonné aux numéros.
6. **Les photos sont posées, pas composées.** Elles remplissent un cadre, sans
   légende, sans numéro, sans lien avec le propos voisin.
7. **Zéro preuve concrète.** On parle d'épreuves classées par maquette, mais on
   ne montre jamais à quoi ressemble une fiche d'épreuve UAC.
8. **Le verre partout** dilue l'effet : ce qui devait être un accent est devenu
   le fond.

---

## 4. Trois directions originales (à trancher)

### A — « Le Registre » *(recommandée)*

Campusly devient **le registre académique de l'UAC** : un dossier relié, avec
ses chapitres, ses planches, ses fiches cartonnées et son tampon.

- Chapitres numérotés `01 — ÉPREUVES` … `06 — S'INSCRIRE`, filet horizontal,
  annotation en mono à droite (`FAST · FASEG · FADESP · …`).
- Le hero devient une **fiche cartonnée « spécimen »** (faculté, département,
  niveau, semestre, année, durée, nombre de pages), bord perforé à gauche,
  étiquette `SPÉCIMEN` — donc aucune donnée inventée présentée comme réelle.
- Les photos deviennent des **planches** : `PLANCHE 02 — Bibliothèque
  universitaire`, cadre à filet, légende en mono, aucun arrondi.
- Un **index tabulaire** remplace les cartes d'épreuves : colonnes
  matière / faculté / niveau / semestre / année, et une ligne fantôme en
  pointillés marquée `spécimen`. L'état vide devient un choix graphique.
- Bande défilante entre les chapitres.
- Verre réservé à 2 endroits (barre de nav, encart final) ; partout ailleurs,
  papier, filets et encre.

**Pourquoi c'est la bonne** : c'est la métaphore la plus juste pour une
plateforme d'archives d'épreuves, elle est intemporelle, elle supporte
l'absence de données (un registre vide reste un registre), et elle donne une
identité qu'aucun concurrent étudiant n'utilise.

### B — « L'Atelier »

On montre le **geste** : la fiche qui se remplit, le quiz qui se corrige, la
copie qui se barre. Interface plus proche du carnet de travail, avec du
manuscrit (annotations à la main en SVG), des post-it, des surlignages orange.

- Très chaleureux, très jeune, très « révision entre amis ».
- Risque : peut faire négligé, et vieillit mal en dark mode.

### C — « La Salle »

On part de la salle d'examen et de l'amphi : plans, numéros de table, grille
horaire, chronomètre. Minimal, presque administratif, très contrasté.

- Le plus proche de Kraken en tension ; le plus intimidant pour un L1.
- Risque : ton froid, et la métaphore « contrôle » est anxiogène.

---

## 5. Spécification de la direction A

### Grille et rythme
- Grille 12 colonnes, gouttière `clamp(16px, 2vw, 28px)`, largeur max 1240 px.
- **Asymétrie assumée** : titre sur 7 colonnes à gauche, annotation mono sur 3
  colonnes à droite, alignées sur la même ligne de base.
- Rythme volontairement irrégulier : chapitre court (hero), chapitre long
  (épreuves), planche pleine largeur (compositions), index (épreuves). Jamais
  deux sections avec la même hauteur.
- Filet d'1 px `--border` en haut de chaque chapitre, plus un filet fort 2 px
  sous le libellé de chapitre.

### Typographie (3 voix)
1. **Display** : Instrument Serif, `clamp(2.4rem, 5.2vw, 4.1rem)`, tracking
   `-0.03em`, pour les titres de chapitre. Déjà chargée.
2. **Annotation** : Space Grotesk en `0.68rem`, `letter-spacing 0.18em`,
   majuscules, pour les libellés, numéros de planche, métadonnées.
3. **Corps** : Plus Jakarta Sans, `clamp(0.95rem, 1.05vw, 1.02rem)`, largeur
   bornée à `62ch`.

### Composants à créer (nouveaux, pas des copies)
| Composant | Rôle | Détail distinctif |
| --- | --- | --- |
| `ChapterHeader` | `01 — ÉPREUVES` + titre + annotation | filet fort + libellé mono numéroté |
| `SpecimenCard` | fiche d'épreuve du hero | bord perforé (radial-gradient), coin corné, étiquette `SPÉCIMEN` |
| `Plate` (planche) | photo + légende | filet 1 px, légende `PLANCHE 0n — …`, tampon en filigrane |
| `Ticker` | bande défilante | séparateur `✶`, pause au survol, désactivé en reduced-motion |
| `IndexTable` | index des épreuves | colonnes réelles, ligne `spécimen` en pointillés |
| `RuleReveal` | animation de filet | les filets se tracent de gauche à droite |

### Animations (toujours GSAP, une seule lib)
- **Chapitre** : filet qui se trace (0.5 s), libellé qui apparaît, puis titre en
  masque ligne par ligne.
- **SpecimenCard** : entrée par légère rotation (−1.2°) + ombre qui se pose ;
  au survol, l'étiquette `SPÉCIMEN` pivote de 2°.
- **Planche** : révélation par volet vertical (clip-path), légende en fondu
  retardé ; parallaxe très faible (±6 px) desktop uniquement.
- **IndexTable** : lignes révélées à la suite ; la ligne spécimen arrive en
  dernier, en pointillés animés.
- **Ticker** : translation continue CSS (pas GSAP, pour ne pas mobiliser le
  moteur principal), `prefers-reduced-motion: reduce` ⇒ statique.
- Toutes les révélations en `once: true`.

### Couleur
- Fond papier `#F7F5F0` (clair) / `#0B0E14` (sombre).
- Encre bleu nuit `#0F172A`, accent **bleu #1565C0** pour les liens et les
  libellés actifs, **orange #F57C00** réservé aux étiquettes (`SPÉCIMEN`,
  `NOUVEAU`) et aux traits de chapitre sur deux sections sur trois.
- Le verre liquide ne survit que sur la barre de navigation et l'encart final.

### Page `/auth`
- Même registre : formulaire présenté comme une **fiche d'inscription**
  (champs numérotés `01 — Identifiant`, filets, aucune boîte flottante).
- Planche photo à gauche avec légende et tampon, formulaire à droite sur papier.
- L'avertissement de simulation reste, mais reformulé en note de bas de fiche
  (`NOTE — …`), plus discret et plus crédible.

---

## 6. Backlog priorisé

**P0 — ce qui change la perception en une passe**
1. Sortir du centrage : en-têtes de chapitre asymétriques (`01 —`, titre à
   gauche, annotation à droite). *C'est le geste le plus rentable.*
2. Hero : remplacer le cadre photo par la `SpecimenCard` + une planche
   secondaire (ou l'inverse selon le test visuel).
3. `Ticker` entre deux chapitres.
4. Typographie : appliquer les 3 voix partout sur la landing.

**P1 — la texture**
5. Planches numérotées pour les 5 photos existantes (légendes, filets, tampon).
6. `IndexTable` à la place des cartes d'épreuves.
7. Filets animés + masques de titres.
8. Réduire le verre à 2 surfaces.

**P2 — le finissage**
9. `/auth` en fiche d'inscription.
10. Colophon en pied de page (version, date, sources) — détail de craft.
11. Mode sombre : papier encre inversé, tampon en orange.
12. Audit contraste AA + reduced-motion + navigation clavier sur les nouveaux
    composants.

---

## 7. Ce qu'on ne fera pas

- Aucun compte à rebours, aucun compteur de places, aucune statistique inventée.
- Aucune icône ajoutée pour « remplir » : on remplace des icônes par des
  micro-visualisations qui décrivent un comportement réel.
- Aucune deuxième librairie d'animation.
- Aucun changement de palette, de logo ni de vocabulaire produit.

---

## 8. Mise en œuvre (mission 3)

Direction retenue : **A — Le Registre**, avec asymétrie éditoriale (fin du
centrage) et artefacts CSS dominants + une seule photographie (le campus).

Livré :

| Fichier | Rôle |
| --- | --- |
| `app/(public)/page.tsx` | couverture, chapitres `01` → `07`, FAQ `08`, colophon |
| `components/landing/ChapterHeader.tsx` | en-tête de chapitre (filet, index, libellé, note, titre) |
| `components/landing/SpecimenCard.tsx` | fiche d'épreuve spécimen du hero |
| `components/landing/Ticker.tsx` | bande défilante CSS pure (deux occurrences, une inversée) |
| `components/shared/FaqSection.tsx` | FAQ remise au gabarit de chapitre, mentions d'état corrigées |
| `components/landing/LandingMotion.tsx` | animations `chapter`, `rule`, `index`, `plate` ajoutées |
| `styles/app/landing.css` | bloc « Le Registre » (papier/encre, grille, planche, bordereau, colophon, mode sombre) |
| `styles/app/auth-registre.css` | `/auth` en fiche d'inscription perforée, sans verre |

Points de vigilance :

- La fiche du hero et le bordereau de composition sont des **formulaires**
  (`SPÉCIMEN`), pas des données. Aucune épreuve, aucun effectif, aucune
  statistique n'est inventé.
- L'index des épreuves affiche une seule ligne de démonstration + un état vide
  explicite : le registre est vide, et le dit.
- Le verre liquide ne subsiste que sur la navigation (et les surfaces de
  l'espace connecté).
- **Rendu visuel non vérifié** : l'environnement de développement n'a pas de
  navigateur. Validation faite par `tsc`, `vitest` (43/43), `npm run build` et
  `curl` (routes en 200). Le rendu final doit être regardé sur la preview.
