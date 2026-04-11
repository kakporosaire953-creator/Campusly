# 🧪 Guide de Test - Nouvelles Fonctionnalités Campusly

## 📋 Checklist de Test

### ✅ Système de Déconnexion Automatique

#### Test 1 : Déconnexion après 1 minute
1. Se connecter sur Campusly
2. Accéder au Dashboard
3. Ne toucher ni souris ni clavier pendant 1 minute
4. **Résultat attendu** :
   - ⚠️ Avertissement après 30 secondes
   - 🚪 Déconnexion automatique après 60 secondes
   - Redirection vers `auth.html?reason=inactivity`

#### Test 2 : Réinitialisation du timer par activité
1. Se connecter sur Campusly
2. Attendre 25 secondes
3. Bouger la souris
4. Attendre encore 25 secondes
5. **Résultat attendu** :
   - ✅ Pas de déconnexion
   - Timer réinitialisé à chaque mouvement

#### Test 3 : Avertissement dismissible
1. Se connecter sur Campusly
2. Attendre 30 secondes pour voir l'avertissement
3. Cliquer sur le bouton ✕ de l'avertissement
4. **Résultat attendu** :
   - ✅ Avertissement disparaît
   - ✅ Timer réinitialisé
   - ✅ Pas de déconnexion

#### Test 4 : Changement d'onglet
1. Se connecter sur Campusly
2. Changer d'onglet pendant 40 secondes
3. Revenir sur l'onglet Campusly
4. **Résultat attendu** :
   - ✅ Timer réinitialisé au retour
   - ✅ Pas de déconnexion immédiate

#### Test 5 : Multi-pages
Tester sur chaque page :
- [ ] Dashboard
- [ ] Révision IA
- [ ] Assistant IA
- [ ] Épreuves
- [ ] Forum
- [ ] Contribuer

**Résultat attendu** : Déconnexion automatique fonctionne sur toutes les pages

---

### ✅ Boutons Interactifs

#### Test 6 : Effet Ripple
1. Cliquer sur n'importe quel bouton `.btn`
2. **Résultat attendu** :
   - ✅ Onde circulaire blanche apparaît au point de clic
   - ✅ Animation fluide de 0.6s

#### Test 7 : Hover
1. Survoler un bouton avec la souris
2. **Résultat attendu** :
   - ✅ Bouton se soulève de 2px
   - ✅ Ombre portée apparaît
   - ✅ Transition fluide

#### Test 8 : Bouton Primary avec Gradient
1. Trouver un bouton `.btn-primary`
2. Observer l'animation
3. **Résultat attendu** :
   - ✅ Gradient bleu animé en boucle
   - ✅ Ombre bleue au survol

#### Test 9 : Bouton Accent avec Glow
1. Trouver un bouton `.btn-accent`
2. Survoler avec la souris
3. **Résultat attendu** :
   - ✅ Effet de lueur orange apparaît
   - ✅ Ombre colorée intense

#### Test 10 : État Loading
1. Déclencher une action avec loading (ex: génération quiz)
2. **Résultat attendu** :
   - ✅ Spinner animé apparaît
   - ✅ Texte du bouton masqué
   - ✅ Bouton désactivé

#### Test 11 : Bouton avec Icône
1. Trouver un bouton avec icône (ex: "Télécharger")
2. Survoler avec la souris
3. **Résultat attendu** :
   - ✅ Icône se déplace de 4px vers la droite
   - ✅ Transition fluide

#### Test 12 : Effet Pulse
1. Trouver un bouton avec `.btn-pulse`
2. Observer l'animation
3. **Résultat attendu** :
   - ✅ Pulsation continue (scale 1 → 1.05 → 1)
   - ✅ Ombre animée

#### Test 13 : Bouton Success/Danger
1. Trouver des boutons `.btn-success` et `.btn-danger`
2. Survoler avec la souris
3. **Résultat attendu** :
   - ✅ Couleurs vertes/rouges
   - ✅ Ombres colorées au survol

#### Test 14 : Groupe de Boutons
1. Trouver un `.btn-group`
2. Observer la disposition
3. **Résultat attendu** :
   - ✅ Boutons collés sans espacement
   - ✅ Bordures arrondies aux extrémités uniquement

#### Test 15 : Effet Shimmer
1. Trouver un bouton avec `.btn-shimmer`
2. Observer l'animation
3. **Résultat attendu** :
   - ✅ Brillance horizontale animée
   - ✅ Effet premium

#### Test 16 : Bouton avec Badge
1. Trouver un bouton avec `data-badge`
2. Observer le badge
3. **Résultat attendu** :
   - ✅ Badge rouge en haut à droite
   - ✅ Nombre affiché correctement

#### Test 17 : Effet 3D
1. Trouver un bouton avec `.btn-3d`
2. Cliquer dessus
3. **Résultat attendu** :
   - ✅ Effet d'enfoncement au clic
   - ✅ Ombre en couches

---

### ✅ Responsive & Mobile

#### Test 18 : Mobile (< 768px)
1. Ouvrir le site sur mobile ou réduire la fenêtre
2. Tester les boutons
3. **Résultat attendu** :
   - ✅ Boutons adaptés à la taille d'écran
   - ✅ Touch-friendly (zones de clic suffisantes)
   - ✅ Animations fluides

#### Test 19 : Tablette (768px - 1024px)
1. Ouvrir le site sur tablette
2. Tester les boutons
3. **Résultat attendu** :
   - ✅ Mise en page adaptée
   - ✅ Toutes les fonctionnalités accessibles

---

### ✅ Accessibilité

#### Test 20 : Navigation au Clavier
1. Utiliser Tab pour naviguer entre les boutons
2. Appuyer sur Entrée pour activer
3. **Résultat attendu** :
   - ✅ Focus visible avec outline coloré
   - ✅ Activation au clavier fonctionne

#### Test 21 : Lecteur d'Écran
1. Activer un lecteur d'écran (NVDA, JAWS, VoiceOver)
2. Naviguer sur les boutons
3. **Résultat attendu** :
   - ✅ Textes des boutons lus correctement
   - ✅ États (désactivé, loading) annoncés

#### Test 22 : Contraste
1. Vérifier le contraste des boutons
2. Utiliser un outil de vérification (ex: WAVE)
3. **Résultat attendu** :
   - ✅ Ratio de contraste ≥ 4.5:1 (WCAG AA)

---

### ✅ Performance

#### Test 23 : Temps de Chargement
1. Ouvrir DevTools → Network
2. Recharger la page
3. **Résultat attendu** :
   - ✅ `interactive-buttons.css` < 10 KB
   - ✅ `auto-logout.js` < 5 KB
   - ✅ Pas d'impact sur le temps de chargement

#### Test 24 : Animations Fluides
1. Ouvrir DevTools → Performance
2. Enregistrer pendant l'interaction avec les boutons
3. **Résultat attendu** :
   - ✅ 60 FPS maintenu
   - ✅ Pas de reflow/repaint excessif

---

### ✅ Compatibilité Navigateurs

#### Test 25 : Chrome/Edge
- [ ] Déconnexion automatique fonctionne
- [ ] Tous les effets de boutons fonctionnent
- [ ] Pas d'erreurs console

#### Test 26 : Firefox
- [ ] Déconnexion automatique fonctionne
- [ ] Tous les effets de boutons fonctionnent
- [ ] Pas d'erreurs console

#### Test 27 : Safari
- [ ] Déconnexion automatique fonctionne
- [ ] Tous les effets de boutons fonctionnent
- [ ] Pas d'erreurs console

#### Test 28 : Mobile Safari (iOS)
- [ ] Déconnexion automatique fonctionne
- [ ] Touch events détectés
- [ ] Animations fluides

#### Test 29 : Chrome Mobile (Android)
- [ ] Déconnexion automatique fonctionne
- [ ] Touch events détectés
- [ ] Animations fluides

---

## 🐛 Bugs Connus & Solutions

### Bug 1 : Timer ne se réinitialise pas
**Symptôme** : Déconnexion même avec activité  
**Solution** : Vérifier que `initAutoLogout()` est appelé après `requireAuth()`

### Bug 2 : Animations saccadées
**Symptôme** : Animations pas fluides  
**Solution** : Vérifier que `will-change` ou `transform` est utilisé

### Bug 3 : Boutons ne répondent pas au clic
**Symptôme** : Clic ne fonctionne pas  
**Solution** : Vérifier z-index et pointer-events

---

## 📊 Rapport de Test

### Template de Rapport

```markdown
## Test du [DATE]

### Environnement
- Navigateur : [Chrome/Firefox/Safari]
- Version : [XX.X]
- OS : [Windows/Mac/Linux/iOS/Android]
- Résolution : [1920x1080 / Mobile]

### Tests Réussis ✅
- [ ] Test 1 : Déconnexion après 1 minute
- [ ] Test 2 : Réinitialisation du timer
- [ ] Test 3 : Avertissement dismissible
- [ ] ...

### Tests Échoués ❌
- [ ] Test X : [Description du problème]

### Bugs Trouvés 🐛
1. [Description du bug]
   - Étapes de reproduction
   - Résultat attendu
   - Résultat obtenu

### Recommandations 💡
- [Suggestion d'amélioration]
```

---

## 🎯 Critères de Validation

### Déconnexion Automatique
- ✅ Fonctionne sur toutes les pages protégées
- ✅ Timer se réinitialise correctement
- ✅ Avertissement visible et dismissible
- ✅ Message de déconnexion clair
- ✅ Redirection fonctionne

### Boutons Interactifs
- ✅ Tous les effets fonctionnent
- ✅ Animations fluides (60 FPS)
- ✅ Responsive sur tous les écrans
- ✅ Accessible au clavier
- ✅ Compatible tous navigateurs

### Performance
- ✅ Pas d'impact sur le temps de chargement
- ✅ Pas de lag ou freeze
- ✅ Mémoire stable

---

## 📝 Notes de Test

### Conseils
1. Tester sur plusieurs navigateurs
2. Tester sur mobile ET desktop
3. Tester avec connexion lente
4. Tester avec lecteur d'écran
5. Vérifier la console pour erreurs

### Outils Recommandés
- Chrome DevTools
- Firefox Developer Tools
- Lighthouse (Performance)
- WAVE (Accessibilité)
- BrowserStack (Multi-navigateurs)

---

**Date de Création** : 11 Avril 2026  
**Version** : 1.0  
**Auteur** : Équipe QA Campusly
