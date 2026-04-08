# Implementation Plan: Campusly MVP Réel

## Overview

Migration de Campusly d'un frontend statique (localStorage) vers un MVP de production avec Firebase, Flutterwave et OpenAI. Le code reste en HTML/CSS/JavaScript vanilla avec les SDK Firebase via CDN ESM.

## Tasks

- [x] 1. Configuration Firebase et structure du projet
  - Créer `js/firebase-config.js` avec `initializeApp`, `getAuth`, `getFirestore`, `getFunctions` via CDN ESM
  - Ajouter les placeholders de config (`YOUR_FIREBASE_API_KEY`, etc.) avec commentaires explicatifs
  - Créer `functions/` avec `package.json` et `functions/index.js` (squelette Cloud Functions)
  - Mettre à jour `.gitignore` pour exclure les fichiers de config sensibles
  - _Requirements: 6.1, 6.2_

- [ ] 2. Authentification Firebase réelle
  - [x] 2.1 Réécrire `js/auth.js` avec Firebase Auth
    - Remplacer `handleRegister` : `createUserWithEmailAndPassword()` + `setDoc()` profil Firestore
    - Remplacer `handleLogin` : `signInWithEmailAndPassword()`
    - Ajouter `handleLogout` : `signOut()`
    - Générer l'email fictif `{matricule.toLowerCase()}@campusly.uac.bj`
    - Ajouter garde de route `onAuthStateChanged` sur toutes les pages protégées
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 2.2 Écrire les tests de propriété pour l'authentification
    - **Property 1 : Unicité du matricule à l'inscription**
    - **Property 2 : Round-trip connexion/déconnexion**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 2.3 Écrire les tests unitaires pour la validation du mot de passe
    - Tester les cas valides et invalides (longueur, majuscule, chiffre, symbole)
    - _Requirements: 1.7_

- [ ] 3. Couche Firestore — Profils et épreuves
  - [x] 3.1 Créer `js/firestore.js` avec les fonctions CRUD
    - `getUserProfile(uid)`, `updateUserPremium(uid, expiry)`
    - `getEpreuves(filters)` avec `query()` + `where()` chainés
    - `saveDownload(uid, epreuveId)`, `saveQuizResult(uid, result)`
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2_

  - [x] 3.2 Créer `firestore.rules` avec les règles de sécurité
    - Lecture/écriture `users/{uid}` : uniquement l'utilisateur propriétaire
    - Lecture `epreuves` : tout utilisateur authentifié
    - Écriture `epreuves` : uniquement les admins
    - _Requirements: 2.4, 3.5, 6.2_

  - [x] 3.3 Écrire les tests de propriété pour l'isolation des données
    - **Property 3 : Isolation des données utilisateur**
    - **Property 6 : Accès premium aux épreuves**
    - **Validates: Requirements 2.4, 3.3, 6.2**

- [ ] 4. Checkpoint — Vérifier auth + Firestore
  - S'assurer que l'inscription, la connexion et la lecture de profil fonctionnent de bout en bout. Demander à l'utilisateur si des questions se posent.

- [ ] 5. Intégration Flutterwave
  - [ ] 5.1 Créer `js/payment.js` avec Flutterwave Inline
    - Ajouter le script CDN `https://checkout.flutterwave.com/v3.js` dans `dashboard.html`
    - Implémenter `initFlutterwavePayment(plan, user)` avec `FlutterwaveCheckout()`
    - Configurer `currency: "XOF"`, `payment_options: "mobilemoneyfrancophone,card"`
    - Implémenter `handlePaymentCallback(response, plan)` pour le callback succès
    - _Requirements: 4.1, 4.4_

  - [ ] 5.2 Créer la Cloud Function `flutterwaveWebhook` dans `functions/index.js`
    - Vérifier la signature `verif-hash` du webhook
    - Mettre à jour `premiumExpiry` dans Firestore selon le plan
    - Enregistrer la transaction dans la collection `transactions`
    - _Requirements: 4.2, 4.3, 4.6, 6.4_

  - [ ] 5.3 Écrire les tests de propriété pour le paiement
    - **Property 2 : Cohérence du statut premium après paiement**
    - **Property 7 : Intégrité des transactions enregistrées**
    - **Validates: Requirements 4.2, 4.3, 4.6**

  - [ ] 5.4 Écrire les tests unitaires pour la validation du webhook
    - Tester la vérification de signature valide et invalide
    - Tester le calcul de `premiumExpiry` selon chaque plan
    - _Requirements: 4.2, 6.4_

- [ ] 6. Mise à jour du dashboard pour Firestore + Flutterwave
  - Mettre à jour `js/dashboard.js` : remplacer localStorage par appels Firestore
  - Charger le profil utilisateur depuis `getUserProfile(uid)`
  - Remplacer `activatePremium()` par `initFlutterwavePayment()`
  - Mettre à jour `isPremium()` dans `js/app.js` pour lire `premiumExpiry` depuis Firestore
  - Ajouter la gestion de l'expiration premium à la connexion
  - _Requirements: 2.2, 4.5_

- [ ] 7. Cloud Function `generateQuiz` — Proxy OpenAI
  - [x] 7.1 Implémenter la Cloud Function callable `generateQuiz` dans `functions/index.js`
    - Vérifier `context.auth` (utilisateur authentifié)
    - Vérifier la limite quotidienne (3 quiz/jour pour non-premium) via Firestore
    - Construire le prompt GPT-4o-mini pour générer un quiz JSON structuré
    - Appeler `openai.chat.completions.create()` avec `response_format: { type: "json_object" }`
    - Retourner `{ questions: [...] }` au client
    - _Requirements: 5.1, 5.2, 5.5, 5.6, 5.7, 6.3_

  - [ ] 7.2 Écrire les tests de propriété pour la génération de quiz
    - **Property 4 : Structure valide du quiz généré par l'IA**
    - **Property 5 : Limite quotidienne des quiz gratuits**
    - **Validates: Requirements 5.1, 5.2, 5.6**

  - [ ] 7.3 Écrire les tests unitaires pour la Cloud Function quiz
    - Tester le rejet si non authentifié
    - Tester le rejet si limite quotidienne atteinte
    - Tester le parsing du JSON retourné par OpenAI
    - _Requirements: 5.5, 5.6_

- [x] 8. Mise à jour de `js/revision.js` pour appeler la Cloud Function
  - Remplacer la logique de quiz simulée par `httpsCallable(functions, "generateQuiz")`
  - Afficher un loader pendant la génération
  - Gérer les erreurs (quota atteint, service indisponible)
  - Enregistrer le résultat du quiz via `saveQuizResult(uid, result)`
  - _Requirements: 5.3, 5.4, 5.5, 5.6_

- [ ] 9. Mise à jour de `js/epreuves.js` pour Firestore
  - Remplacer les données statiques par `getEpreuves(filters)` depuis Firestore
  - Implémenter le blocage des épreuves premium pour les non-premium
  - Enregistrer les téléchargements via `saveDownload(uid, epreuveId)`
  - _Requirements: 3.2, 3.3, 3.4_

- [ ] 10. Checkpoint final — Tous les tests passent
  - S'assurer que tous les tests unitaires et de propriété passent. Vérifier les règles Firestore avec l'émulateur. Demander à l'utilisateur si des questions se posent.

## Notes

- Les tâches de test sont toutes obligatoires pour une couverture complète
- Chaque tâche référence les requirements spécifiques pour la traçabilité
- Les Cloud Functions nécessitent Node.js 18+ et le plan Blaze (pay-as-you-go) Firebase
- Les clés API sont toujours des placeholders dans le code — à remplacer par les vraies valeurs
- Les tests de propriété utilisent **fast-check** avec minimum 100 itérations par propriété
