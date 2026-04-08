// ============================================================
// CAMPUSLY — Script de seed (données de démonstration)
// Usage : node functions/seed.js
// Prérequis : firebase-admin configuré, GOOGLE_APPLICATION_CREDENTIALS défini
// OU : firebase emulators:start puis node functions/seed.js
// ============================================================
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

// Initialiser avec les credentials par défaut (firebase login déjà fait)
initializeApp({ projectId: "my-campusly-project-id" });
const db = getFirestore();

// ── Épreuves de démonstration ──────────────────────────────
const EPREUVES = [
  { titre:"Microéconomie I — Examen final", faculte:"FASEG", departement:"Économie", semestre:"S1", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Macroéconomie II — Partiel", faculte:"FASEG", departement:"Économie", semestre:"S2", annee:"2023", type:"Partiel", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Comptabilité Générale — Examen", faculte:"FASEG", departement:"Comptabilité et Finance", semestre:"S1", annee:"2022", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Finance Quantitative — Examen final", faculte:"FASEG", departement:"Finance", semestre:"S3", annee:"2023", type:"Examen", isPremium:true, fileUrl:"" },
  { titre:"Droit Constitutionnel — Examen", faculte:"FADESP", departement:"Droit Public", semestre:"S1", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Droit Civil des Obligations", faculte:"FADESP", departement:"Droit Privé", semestre:"S2", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Droit Administratif — Partiel", faculte:"FADESP", departement:"Droit Public", semestre:"S3", annee:"2022", type:"Partiel", isPremium:true, fileUrl:"" },
  { titre:"Analyse Mathématique I", faculte:"FAST", departement:"Mathématiques", semestre:"S1", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Algèbre Linéaire — Examen final", faculte:"FAST", departement:"Mathématiques", semestre:"S2", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Physique Générale — Mécanique", faculte:"FAST", departement:"Physique", semestre:"S1", annee:"2022", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Chimie Organique — Examen", faculte:"FAST", departement:"Chimie", semestre:"S2", annee:"2023", type:"Examen", isPremium:true, fileUrl:"" },
  { titre:"Anatomie Générale — Examen final", faculte:"FSS", departement:"Médecine générale", semestre:"S1", annee:"2023", type:"Examen", isPremium:true, fileUrl:"" },
  { titre:"Biochimie Médicale", faculte:"FSS", departement:"Médecine générale", semestre:"S2", annee:"2023", type:"Examen", isPremium:true, fileUrl:"" },
  { titre:"Nutrition et Diététique", faculte:"FSS", departement:"Nutrition", semestre:"S3", annee:"2023", type:"Partiel", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Agronomie Générale", faculte:"FSA", departement:"Production Végétale", semestre:"S1", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Résistance des Matériaux", faculte:"EPAC", departement:"Génie Civil", semestre:"S3", annee:"2023", type:"Examen", isPremium:true, fileUrl:"" },
  { titre:"Électronique Analogique", faculte:"EPAC", departement:"Génie Électrique", semestre:"S2", annee:"2022", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
  { titre:"Linguistique Générale", faculte:"FLLAC", departement:"Sciences du Langage", semestre:"S1", annee:"2023", type:"Examen", isPremium:false, fileUrl:"https://www.africau.edu/images/default/sample.pdf" },
];

// ── Questions forum de démonstration ──────────────────────
const FORUM_QUESTIONS = [
  {
    title: "Comment résoudre les équations différentielles du 2ème ordre ?",
    body: "Je bloque sur les équations différentielles linéaires du 2ème ordre à coefficients constants. Quelqu'un peut m'expliquer la méthode ?",
    faculte: "FAST", matiere: "Mathématiques",
    authorName: "Kofi Mensah", resolved: true, answersCount: 2, votes: 5, views: 34,
    answers: [
      { text: "Pour les équations du type ay'' + by' + cy = 0, on commence par l'équation caractéristique ar² + br + c = 0. Selon le discriminant, on a 3 cas : deux racines réelles distinctes, une racine double, ou deux racines complexes conjuguées. Je te conseille de revoir le cours de M. Adjovi sur ce point.", authorName: "Aïcha Diallo", votes: 8, isBest: true },
      { text: "Regarde aussi les exercices de l'examen 2022 de FAST, il y a exactement ce type d'exercice avec la correction.", authorName: "Rodrigue Hounsa", votes: 3, isBest: false },
    ]
  },
  {
    title: "Quelle est la différence entre droit public et droit privé ?",
    body: "Je suis en L1 FADESP et je confonds encore les deux branches. Quelqu'un peut m'aider ?",
    faculte: "FADESP", matiere: "Droit",
    authorName: "Fatou Bamba", resolved: true, answersCount: 1, votes: 12, views: 67,
    answers: [
      { text: "Le droit public régit les relations entre l'État et les particuliers (droit constitutionnel, administratif, fiscal). Le droit privé régit les relations entre particuliers (droit civil, commercial, du travail). En résumé : droit public = État impliqué, droit privé = entre personnes privées.", authorName: "Séraphin Agbo", votes: 15, isBest: true },
    ]
  },
  {
    title: "Comment préparer l'examen de Microéconomie en 2 semaines ?",
    body: "J'ai raté les cours du premier semestre et l'examen est dans 2 semaines. Par où commencer ?",
    faculte: "FASEG", matiere: "Microéconomie",
    authorName: "Brice Tokoudagba", resolved: false, answersCount: 0, votes: 7, views: 45,
    answers: []
  },
];

async function seed() {
  console.log("🌱 Début du seed...\n");

  // Épreuves
  console.log("📚 Insertion des épreuves...");
  const batch1 = db.batch();
  for (const ep of EPREUVES) {
    const ref = db.collection("epreuves").doc();
    batch1.set(ref, { ...ep, dateAjout: Timestamp.now() });
  }
  await batch1.commit();
  console.log(`   ✓ ${EPREUVES.length} épreuves insérées`);

  // Forum
  console.log("💬 Insertion des questions forum...");
  for (const q of FORUM_QUESTIONS) {
    const { answers, ...qData } = q;
    const qRef = await db.collection("forum").add({ ...qData, createdAt: Timestamp.now() });
    for (const a of answers) {
      await db.collection("forum").doc(qRef.id).collection("answers").add({ ...a, createdAt: Timestamp.now() });
    }
  }
  console.log(`   ✓ ${FORUM_QUESTIONS.length} questions insérées`);

  console.log("\n✅ Seed terminé ! Vos données de démo sont prêtes.");
  console.log("   → Connectez-vous sur le site pour voir les épreuves et le forum.");
}

seed().catch(console.error);
