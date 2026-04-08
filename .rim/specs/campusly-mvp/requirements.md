# Requirements Document

## Introduction

Campusly est une plateforme académique destinée aux étudiants de l'Université d'Abomey-Calavi (UAC) au Bénin. L'objectif de ce MVP réel est de remplacer le système actuel basé sur localStorage par une infrastructure de production : authentification Firebase, base de données Firestore, paiement réel via Flutterwave, et révision/quiz assistés par l'API OpenAI (GPT).

## Glossaire

- **System** : L'application web Campusly
- **Auth_Service** : Le module d'authentification Firebase
- **Firestore** : La base de données cloud Firebase Firestore
- **Payment_Service** : Le module de paiement Flutterwave
- **AI_Service** : Le module de révision et quiz basé sur l'API OpenAI GPT
- **User** : Un étudiant inscrit sur la plateforme
- **Epreuve** : Un document d'examen (PDF ou métadonnées) stocké dans Firestore
- **Premium** : Statut d'abonnement payant d'un utilisateur
- **Matricule** : Identifiant unique d'un étudiant à l'UAC
- **Quiz** : Série de questions générées par l'IA à partir d'un sujet ou d'une épreuve

---

## Requirements

### Requirement 1 : Authentification réelle via Firebase

**User Story :** En tant qu'étudiant, je veux m'inscrire et me connecter avec mon matricule UAC et un mot de passe, afin d'accéder à mon espace personnel sécurisé.

#### Acceptance Criteria

1. WHEN un utilisateur soumet le formulaire d'inscription avec un matricule, un email, un mot de passe valide et une faculté, THE Auth_Service SHALL créer un compte Firebase Authentication et enregistrer le profil dans Firestore.
2. WHEN un utilisateur tente de s'inscrire avec un matricule déjà existant dans Firestore, THE Auth_Service SHALL rejeter l'inscription et afficher un message d'erreur explicite.
3. WHEN un utilisateur soumet le formulaire de connexion avec des identifiants valides, THE Auth_Service SHALL authentifier l'utilisateur via Firebase et démarrer une session persistante.
4. IF un utilisateur soumet des identifiants incorrects, THEN THE Auth_Service SHALL afficher un message d'erreur sans révéler si c'est le matricule ou le mot de passe qui est incorrect.
5. WHEN un utilisateur se déconnecte, THE Auth_Service SHALL terminer la session Firebase et rediriger vers la page d'accueil.
6. WHILE un utilisateur n'est pas authentifié, THE System SHALL rediriger toute tentative d'accès aux pages protégées (dashboard, révision) vers la page de connexion.
7. THE Auth_Service SHALL valider que le mot de passe contient au minimum 8 caractères, une majuscule, un chiffre et un caractère spécial avant soumission.

---

### Requirement 2 : Profils utilisateurs dans Firestore

**User Story :** En tant qu'étudiant, je veux que mon profil (nom, faculté, département, statut premium) soit stocké dans le cloud, afin de retrouver mes informations sur n'importe quel appareil.

#### Acceptance Criteria

1. WHEN un compte est créé, THE Firestore SHALL stocker un document utilisateur contenant : uid Firebase, matricule, prénom, nom, faculté, département, statut premium (booléen), date d'expiration premium, et date de création.
2. WHEN un utilisateur se connecte, THE System SHALL charger son profil depuis Firestore et l'afficher dans le dashboard.
3. WHEN le statut premium d'un utilisateur est mis à jour, THE Firestore SHALL mettre à jour le document utilisateur en temps réel.
4. THE Firestore SHALL appliquer des règles de sécurité permettant à un utilisateur de lire et modifier uniquement son propre document.

---

### Requirement 3 : Bibliothèque d'épreuves dans Firestore

**User Story :** En tant qu'étudiant, je veux accéder à une bibliothèque d'épreuves stockées dans le cloud, afin de trouver et télécharger les documents dont j'ai besoin.

#### Acceptance Criteria

1. THE Firestore SHALL stocker chaque épreuve avec les champs : id, titre, faculte, departement, semestre, annee, type (examen/partiel), isPremium (booléen), fileUrl (lien de téléchargement), et dateAjout.
2. WHEN un utilisateur recherche des épreuves, THE System SHALL interroger Firestore avec les filtres sélectionnés (faculté, département, semestre, année) et retourner les résultats correspondants.
3. WHEN un utilisateur non-premium tente d'accéder à une épreuve marquée isPremium, THE System SHALL afficher un message d'invitation à souscrire un abonnement.
4. WHEN un utilisateur premium accède à une épreuve, THE System SHALL enregistrer le téléchargement dans l'historique Firestore de l'utilisateur.
5. THE Firestore SHALL appliquer des règles de sécurité permettant la lecture des épreuves à tout utilisateur authentifié, et l'écriture uniquement aux administrateurs.

---

### Requirement 4 : Paiement réel via Flutterwave

**User Story :** En tant qu'étudiant, je veux payer mon abonnement Premium via Mobile Money ou carte bancaire, afin de débloquer l'accès complet à la plateforme.

#### Acceptance Criteria

1. WHEN un utilisateur sélectionne un plan d'abonnement, THE Payment_Service SHALL initialiser une transaction Flutterwave avec le montant, la devise (XOF), et les informations de l'utilisateur.
2. WHEN le paiement est confirmé par Flutterwave (webhook ou callback), THE Payment_Service SHALL mettre à jour le statut premium de l'utilisateur dans Firestore avec la date d'expiration correspondante.
3. IF le paiement échoue ou est annulé, THEN THE Payment_Service SHALL notifier l'utilisateur avec un message d'erreur et ne pas modifier son statut premium.
4. THE Payment_Service SHALL supporter les méthodes de paiement Mobile Money (MTN, Moov) et carte bancaire via l'interface Flutterwave.
5. WHEN un abonnement expire, THE System SHALL mettre à jour le statut premium de l'utilisateur à inactif lors de sa prochaine connexion.
6. THE Payment_Service SHALL enregistrer chaque transaction dans Firestore avec : userId, montant, plan, statut (succès/échec), txRef Flutterwave, et date.

---

### Requirement 5 : Révision et quiz assistés par IA (OpenAI GPT)

**User Story :** En tant qu'étudiant, je veux générer des quiz et obtenir des explications sur mes cours via l'IA, afin de réviser efficacement avant mes examens.

#### Acceptance Criteria

1. WHEN un utilisateur soumet un sujet de révision ou le contenu d'une épreuve, THE AI_Service SHALL envoyer une requête à l'API OpenAI GPT et retourner un quiz de 5 à 10 questions à choix multiples.
2. WHEN l'IA génère un quiz, THE AI_Service SHALL structurer la réponse en JSON avec les champs : question, options (tableau de 4 choix), reponseCorrecte (index), et explication.
3. WHEN un utilisateur répond à une question, THE System SHALL afficher immédiatement si la réponse est correcte ou non, avec l'explication fournie par l'IA.
4. WHEN un utilisateur complète un quiz, THE System SHALL calculer le score, l'afficher, et enregistrer le résultat dans Firestore (userId, sujet, score, date).
5. IF l'API OpenAI est indisponible, THEN THE AI_Service SHALL afficher un message d'erreur et proposer de réessayer.
6. WHILE un utilisateur non-premium utilise la révision IA, THE System SHALL limiter à 3 quiz gratuits par jour et inviter à souscrire pour un accès illimité.
7. THE AI_Service SHALL utiliser le modèle gpt-4o-mini pour optimiser les coûts tout en maintenant la qualité des réponses.

---

### Requirement 6 : Sécurité et configuration

**User Story :** En tant qu'administrateur, je veux que les clés API et la configuration soient sécurisées, afin de protéger les ressources de la plateforme.

#### Acceptance Criteria

1. THE System SHALL stocker les clés API (Firebase, Flutterwave, OpenAI) dans des variables d'environnement et non dans le code source.
2. THE Firestore SHALL appliquer des règles de sécurité empêchant tout accès non authentifié aux données utilisateurs et aux épreuves premium.
3. THE AI_Service SHALL appeler l'API OpenAI via un proxy backend (Firebase Cloud Functions) pour ne pas exposer la clé API côté client.
4. THE Payment_Service SHALL valider les webhooks Flutterwave via la signature secrète avant de mettre à jour les données utilisateur.
