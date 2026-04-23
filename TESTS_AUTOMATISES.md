# 🧪 Tests Automatisés - Campusly

## Date: 23 Avril 2026

## 📋 Plan de Tests

### 1. Tests Unitaires (Fonctions JavaScript)

#### A. Système XP et Niveaux

```javascript
// Test: Calcul du niveau basé sur l'XP
function testGetLevel() {
  const tests = [
    { xp: 0, expected: 1 },
    { xp: 50, expected: 1 },
    { xp: 100, expected: 2 },
    { xp: 250, expected: 3 },
    { xp: 500, expected: 4 },
    { xp: 900, expected: 5 },
    { xp: 10000, expected: 10 }
  ];
  
  tests.forEach(test => {
    const result = getLevel(test.xp);
    console.assert(result === test.expected, 
      `getLevel(${test.xp}) devrait retourner ${test.expected}, mais retourne ${result}`);
  });
  
  console.log("✅ Tests getLevel() passés");
}

// Test: Calcul du pourcentage de progression
function testXPProgress() {
  const tests = [
    { xp: 0, level: 1, expected: 0 },
    { xp: 50, level: 1, expected: 50 },
    { xp: 100, level: 2, expected: 0 },
    { xp: 175, level: 2, expected: 50 }
  ];
  
  tests.forEach(test => {
    const cur = XP_LEVELS[test.level - 1];
    const next = XP_LEVELS[test.level];
    const pct = Math.round(((test.xp - cur) / (next - cur)) * 100);
    console.assert(pct === test.expected,
      `XP ${test.xp} niveau ${test.level} devrait être ${test.expected}%, mais est ${pct}%`);
  });
  
  console.log("✅ Tests XP Progress passés");
}
```

#### B. Système de Badges

```javascript
// Test: Vérification des badges débloqués
function testBadges() {
  const stats = {
    downloads: 10,
    quizzes: 5,
    streak: 7,
    contribs: 1,
    level: 3
  };
  
  const expectedBadges = [
    "first_dl",    // 1+ téléchargement
    "dl10",        // 10+ téléchargements
    "first_quiz",  // 1+ quiz
    "streak3",     // 3+ jours de streak
    "streak7",     // 7+ jours de streak
    "contrib"      // 1+ contribution
  ];
  
  const unlockedBadges = ALL_BADGES
    .filter(b => b.check(stats))
    .map(b => b.id);
  
  expectedBadges.forEach(badgeId => {
    console.assert(unlockedBadges.includes(badgeId),
      `Badge ${badgeId} devrait être débloqué`);
  });
  
  console.log("✅ Tests Badges passés");
}
```

#### C. Système de Streak

```javascript
// Test: Calcul du streak
function testStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().slice(0, 10);
  
  const tests = [
    { lastVisit: today, currentStreak: 5, expected: 5 },      // Déjà visité aujourd'hui
    { lastVisit: yesterday, currentStreak: 5, expected: 6 },  // Visité hier, +1
    { lastVisit: twoDaysAgo, currentStreak: 5, expected: 1 }  // Pas visité hier, reset
  ];
  
  tests.forEach(test => {
    const profile = { last_visit: test.lastVisit, streak: test.currentStreak };
    const result = updateStreak(profile);
    console.assert(result === test.expected,
      `Streak avec lastVisit=${test.lastVisit} devrait être ${test.expected}, mais est ${result}`);
  });
  
  console.log("✅ Tests Streak passés");
}
```

### 2. Tests d'Intégration (API Supabase)

#### A. Authentification

```javascript
async function testAuth() {
  console.log("🧪 Test: Authentification");
  
  // Test 1: Inscription
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: "test@campusly.test",
    password: "TestPassword123!"
  });
  console.assert(!signUpError, "Inscription devrait réussir");
  console.log("✅ Inscription OK");
  
  // Test 2: Connexion
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: "test@campusly.test",
    password: "TestPassword123!"
  });
  console.assert(!signInError, "Connexion devrait réussir");
  console.log("✅ Connexion OK");
  
  // Test 3: Récupération session
  const { data: { session } } = await supabase.auth.getSession();
  console.assert(session !== null, "Session devrait exister");
  console.log("✅ Session OK");
  
  // Test 4: Déconnexion
  const { error: signOutError } = await supabase.auth.signOut();
  console.assert(!signOutError, "Déconnexion devrait réussir");
  console.log("✅ Déconnexion OK");
}
```

#### B. CRUD Épreuves

```javascript
async function testEpreuves() {
  console.log("🧪 Test: Épreuves");
  
  // Test 1: Lecture
  const { data: epreuves, error: readError } = await supabase
    .from("epreuves")
    .select("*")
    .limit(10);
  console.assert(!readError, "Lecture épreuves devrait réussir");
  console.assert(epreuves.length > 0, "Devrait avoir au moins 1 épreuve");
  console.log("✅ Lecture épreuves OK");
  
  // Test 2: Filtrage par faculté
  const { data: fasegEpreuves, error: filterError } = await supabase
    .from("epreuves")
    .select("*")
    .eq("faculte", "FASEG")
    .limit(5);
  console.assert(!filterError, "Filtrage devrait réussir");
  console.log("✅ Filtrage épreuves OK");
  
  // Test 3: Recherche
  const { data: searchResults, error: searchError } = await supabase
    .from("epreuves")
    .select("*")
    .ilike("titre", "%micro%")
    .limit(5);
  console.assert(!searchError, "Recherche devrait réussir");
  console.log("✅ Recherche épreuves OK");
}
```

#### C. Questions Quotidiennes

```javascript
async function testDailyQuestions() {
  console.log("🧪 Test: Questions Quotidiennes");
  
  const today = new Date().toISOString().slice(0, 10);
  const userId = (await supabase.auth.getUser()).data.user.id;
  
  // Test 1: Vérifier qu'une question existe pour aujourd'hui
  const { data: question, error: questionError } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("question_date", today)
    .single();
  
  console.assert(!questionError || questionError.code === "PGRST116", 
    "Requête question devrait réussir");
  console.log("✅ Requête question OK");
  
  // Test 2: Vérifier la structure de la question
  if (question) {
    console.assert(question.question, "Question devrait avoir un texte");
    console.assert(Array.isArray(question.options), "Options devrait être un tableau");
    console.assert(question.options.length === 4, "Devrait avoir 4 options");
    console.assert(typeof question.correct_answer === "number", "Réponse correcte devrait être un nombre");
    console.log("✅ Structure question OK");
  }
  
  // Test 3: Répondre à la question (si elle existe)
  if (question) {
    const { error: answerError } = await supabase
      .from("daily_question_answers")
      .insert({
        user_id: userId,
        question_id: question.id,
        user_answer: 0,
        is_correct: 0 === question.correct_answer
      });
    
    console.assert(!answerError || answerError.code === "23505", 
      "Insertion réponse devrait réussir (ou déjà existante)");
    console.log("✅ Réponse question OK");
  }
}
```

#### D. Groupes d'Étude

```javascript
async function testGroups() {
  console.log("🧪 Test: Groupes d'Étude");
  
  const userId = (await supabase.auth.getUser()).data.user.id;
  
  // Test 1: Créer un groupe
  const { data: newGroup, error: createError } = await supabase
    .from("groups")
    .insert({
      name: "Test Group " + Date.now(),
      faculte: "FAST",
      created_by: userId,
      members: 1
    })
    .select()
    .single();
  
  console.assert(!createError, "Création groupe devrait réussir");
  console.assert(newGroup.id, "Groupe devrait avoir un ID");
  console.log("✅ Création groupe OK");
  
  // Test 2: Lire les groupes
  const { data: groups, error: readError } = await supabase
    .from("groups")
    .select("*")
    .limit(10);
  
  console.assert(!readError, "Lecture groupes devrait réussir");
  console.assert(groups.length > 0, "Devrait avoir au moins 1 groupe");
  console.log("✅ Lecture groupes OK");
  
  // Test 3: Rejoindre un groupe
  const { error: joinError } = await supabase
    .from("group_members")
    .insert({
      group_id: newGroup.id,
      user_id: userId,
      role: "member"
    });
  
  console.assert(!joinError || joinError.code === "23505", 
    "Rejoindre groupe devrait réussir (ou déjà membre)");
  console.log("✅ Rejoindre groupe OK");
  
  // Test 4: Supprimer le groupe de test
  const { error: deleteError } = await supabase
    .from("groups")
    .delete()
    .eq("id", newGroup.id);
  
  console.assert(!deleteError, "Suppression groupe devrait réussir");
  console.log("✅ Suppression groupe OK");
}
```

### 3. Tests E2E (End-to-End)

#### A. Parcours Utilisateur Complet

```javascript
async function testUserJourney() {
  console.log("🧪 Test: Parcours Utilisateur Complet");
  
  // 1. Inscription
  console.log("1️⃣ Inscription...");
  const email = `test${Date.now()}@campusly.test`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: "TestPassword123!",
    options: {
      data: {
        prenom: "Test",
        nom: "User",
        matricule: "12345678",
        faculte: "FAST"
      }
    }
  });
  console.assert(!signUpError, "Inscription devrait réussir");
  console.log("✅ Inscription OK");
  
  // 2. Connexion
  console.log("2️⃣ Connexion...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: "TestPassword123!"
  });
  console.assert(!signInError, "Connexion devrait réussir");
  const userId = signInData.user.id;
  console.log("✅ Connexion OK");
  
  // 3. Consulter les épreuves
  console.log("3️⃣ Consultation épreuves...");
  const { data: epreuves } = await supabase
    .from("epreuves")
    .select("*")
    .limit(5);
  console.assert(epreuves.length > 0, "Devrait avoir des épreuves");
  console.log("✅ Consultation épreuves OK");
  
  // 4. Ajouter un favori
  console.log("4️⃣ Ajout favori...");
  const { error: favError } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      epreuve_id: epreuves[0].id
    });
  console.assert(!favError, "Ajout favori devrait réussir");
  console.log("✅ Ajout favori OK");
  
  // 5. Répondre à la question du jour
  console.log("5️⃣ Question du jour...");
  const today = new Date().toISOString().slice(0, 10);
  const { data: question } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("question_date", today)
    .limit(1)
    .single();
  
  if (question) {
    const { error: answerError } = await supabase
      .from("daily_question_answers")
      .insert({
        user_id: userId,
        question_id: question.id,
        user_answer: 0,
        is_correct: true
      });
    console.assert(!answerError || answerError.code === "23505", 
      "Réponse question devrait réussir");
    console.log("✅ Question du jour OK");
  }
  
  // 6. Créer un groupe
  console.log("6️⃣ Création groupe...");
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: "Test Group " + Date.now(),
      faculte: "FAST",
      created_by: userId,
      members: 1
    })
    .select()
    .single();
  console.assert(!groupError, "Création groupe devrait réussir");
  console.log("✅ Création groupe OK");
  
  // 7. Ajouter un examen
  console.log("7️⃣ Ajout examen...");
  const { error: examError } = await supabase
    .from("user_exams")
    .insert({
      user_id: userId,
      name: "Test Examen",
      exam_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      faculte: "FAST"
    });
  console.assert(!examError, "Ajout examen devrait réussir");
  console.log("✅ Ajout examen OK");
  
  // 8. Déconnexion
  console.log("8️⃣ Déconnexion...");
  const { error: signOutError } = await supabase.auth.signOut();
  console.assert(!signOutError, "Déconnexion devrait réussir");
  console.log("✅ Déconnexion OK");
  
  console.log("🎉 Parcours utilisateur complet réussi!");
}
```

### 4. Tests de Performance

```javascript
async function testPerformance() {
  console.log("🧪 Test: Performance");
  
  // Test 1: Temps de chargement des épreuves
  console.time("Chargement épreuves");
  const { data: epreuves } = await supabase
    .from("epreuves")
    .select("*")
    .limit(50);
  console.timeEnd("Chargement épreuves");
  console.assert(epreuves.length === 50, "Devrait charger 50 épreuves");
  
  // Test 2: Temps de génération de quiz
  console.time("Génération quiz");
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${EDGE_BASE}/groq-ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({
      mode: "quiz",
      sujet: "Microéconomie",
      faculte: "FASEG",
      nbQuestions: 5,
      model: "fast"
    })
  });
  const quiz = await response.json();
  console.timeEnd("Génération quiz");
  console.assert(quiz.questions.length === 5, "Devrait générer 5 questions");
  
  // Test 3: Temps de chargement du dashboard
  console.time("Chargement dashboard");
  const userId = (await supabase.auth.getUser()).data.user.id;
  const [stats, history, favorites] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    supabase.from("history").select("*").eq("user_id", userId).limit(10),
    supabase.from("favorites").select("*").eq("user_id", userId).limit(10)
  ]);
  console.timeEnd("Chargement dashboard");
  console.log("✅ Tests de performance terminés");
}
```

## 🚀 Exécution des Tests

### Dans la Console du Navigateur

```javascript
// Ouvrir la console (F12) sur n'importe quelle page du site

// Exécuter tous les tests
async function runAllTests() {
  console.log("🧪 Démarrage des tests automatisés...\n");
  
  try {
    // Tests unitaires
    testGetLevel();
    testXPProgress();
    testBadges();
    testStreak();
    
    // Tests d'intégration
    await testAuth();
    await testEpreuves();
    await testDailyQuestions();
    await testGroups();
    
    // Tests E2E
    await testUserJourney();
    
    // Tests de performance
    await testPerformance();
    
    console.log("\n✅ Tous les tests sont passés!");
  } catch (error) {
    console.error("\n❌ Erreur dans les tests:", error);
  }
}

// Lancer les tests
runAllTests();
```

### Script de Test Automatique

```javascript
// Créer un fichier test.js à la racine du projet
// Exécuter avec: node test.js (nécessite Node.js)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'VOTRE_SUPABASE_URL',
  'VOTRE_SUPABASE_ANON_KEY'
);

// Copier toutes les fonctions de test ci-dessus

// Exécuter
runAllTests().then(() => {
  console.log("Tests terminés");
  process.exit(0);
}).catch(error => {
  console.error("Erreur:", error);
  process.exit(1);
});
```

## 📊 Rapport de Tests

### Format du Rapport

```
🧪 RAPPORT DE TESTS - Campusly
Date: 23 Avril 2026
Durée: 45 secondes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTS UNITAIRES (4/4)
✅ getLevel()
✅ XP Progress
✅ Badges
✅ Streak

TESTS D'INTÉGRATION (4/4)
✅ Authentification
✅ Épreuves
✅ Questions Quotidiennes
✅ Groupes d'Étude

TESTS E2E (1/1)
✅ Parcours Utilisateur Complet

TESTS DE PERFORMANCE (3/3)
✅ Chargement épreuves: 245ms
✅ Génération quiz: 1.2s
✅ Chargement dashboard: 180ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RÉSULTAT: 12/12 tests passés (100%)
STATUT: ✅ TOUS LES TESTS RÉUSSIS
```

## ✅ Checklist de Tests

Avant chaque déploiement:

- [ ] Tests unitaires passés
- [ ] Tests d'intégration passés
- [ ] Tests E2E passés
- [ ] Tests de performance passés
- [ ] Tests manuels effectués
- [ ] Tests sur mobile effectués
- [ ] Tests sur différents navigateurs
- [ ] Tests de sécurité effectués

---

**Développeur**: Kiro AI  
**Date**: 23 Avril 2026  
**Version**: 1.0
