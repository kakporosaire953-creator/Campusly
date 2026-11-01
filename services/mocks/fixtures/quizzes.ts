/**
 * DONNÉES DE DÉMONSTRATION — banque de questions & quiz
 * ---------------------------------------------------------------------------
 * Les questions ci-dessous remplacent l'ancienne génération « IA » 100 %
 * déterministe : elles servent de contenu de démonstration pour les cinq modes
 * d'apprentissage, en attendant le vrai service IA côté backend.
 */

import type { DocumentAnalysis, Quiz, QuizQuestion } from "@/types";

const ALGO_QUESTIONS: QuizQuestion[] = [
  {
    id: "aq1",
    type: "qcm",
    prompt: "Quelle structure garantit une recherche en O(log n) dans un arbre équilibré ?",
    options: [
      { id: "a", label: "Un tas binaire" },
      { id: "b", label: "Un arbre AVL" },
      { id: "c", label: "Une liste chaînée" },
      { id: "d", label: "Une table de hachage" },
    ],
    correctOptionIndex: 1,
    points: 4,
    explanation: "L'AVL maintient un facteur d'équilibre borné, donc une hauteur logarithmique.",
    concept: "Arbres équilibrés",
  },
  {
    id: "aq2",
    type: "true_false",
    prompt: "Le tri par insertion est plus rapide que le tri fusion sur un tableau déjà presque trié.",
    correctBoolean: true,
    points: 4,
    explanation: "Sur une entrée presque triée, l'insertion est en O(n), alors que le tri fusion reste en O(n log n).",
    concept: "Algorithmes de tri",
  },
  {
    id: "aq3",
    type: "qcm",
    prompt: "Quelle affirmation sur la complexité spatiale d'un parcours en largeur est exacte ?",
    options: [
      { id: "a", label: "Elle est toujours O(1)" },
      { id: "b", label: "Elle est proportionnelle à la largeur du graphe" },
      { id: "c", label: "Elle est proportionnelle à la profondeur" },
      { id: "d", label: "Elle est exponentielle" },
    ],
    correctOptionIndex: 1,
    points: 4,
    explanation: "La file du BFS contient au plus l'ensemble des sommets d'un niveau.",
    concept: "Parcours de graphes",
  },
  {
    id: "aq4",
    type: "open",
    prompt: "Expliquez le principe de la mémoïsation et donnez un exemple d'usage.",
    keywords: ["cache", "sous-problème", "répétition", "fibonacci", "tableau"],
    points: 4,
    explanation:
      "La mémoïsation stocke le résultat des sous-problèmes déjà résolus. Exemple classique : Fibonacci en O(n).",
    concept: "Programmation dynamique",
  },
  {
    id: "aq5",
    type: "qcm",
    prompt: "Le pire cas du tri rapide est atteint lorsque :",
    options: [
      { id: "a", label: "Le pivot est toujours médian" },
      { id: "b", label: "Le pivot est toujours le plus petit ou le plus grand" },
      { id: "c", label: "Le tableau contient des doublons" },
      { id: "d", label: "Le tableau est de taille paire" },
    ],
    correctOptionIndex: 1,
    points: 4,
    explanation: "Un pivot extrême produit une partition 0 / n-1, d'où O(n²).",
    concept: "Algorithmes de tri",
  },
];

const ANALYSE_QUESTIONS: QuizQuestion[] = [
  {
    id: "an1",
    type: "true_false",
    prompt: "Toute suite convergente est bornée.",
    correctBoolean: true,
    points: 4,
    explanation: "La convergence implique la bornitude (réciproque fausse).",
    concept: "Suites",
  },
  {
    id: "an2",
    type: "qcm",
    prompt: "La série de terme général 1/n diverge car :",
    options: [
      { id: "a", label: "Elle est géométrique de raison 1" },
      { id: "b", label: "C'est une série de Riemann d'exposant 1" },
      { id: "c", label: "Son terme général tend vers 1" },
      { id: "d", label: "Elle est alternée" },
    ],
    correctOptionIndex: 1,
    points: 4,
    explanation: "Riemann diverge pour α ≤ 1.",
    concept: "Séries",
  },
  {
    id: "an3",
    type: "open",
    prompt: "Énoncez le théorème des accroissements finis.",
    keywords: ["continue", "dérivable", "intervalle", "pente", "moyenne"],
    points: 4,
    explanation:
      "Si f est continue sur [a,b] et dérivable sur ]a,b[, il existe c tel que f'(c) = (f(b)-f(a))/(b-a).",
    concept: "Dérivation",
  },
];

export const DEMO_QUIZ_BANK: Record<string, QuizQuestion[]> = {
  Algorithmique: ALGO_QUESTIONS,
  Analyse: ANALYSE_QUESTIONS,
  "Bases de données": [
    {
      id: "bd1",
      type: "qcm",
      prompt: "Quelle forme normale élimine les dépendances transitives ?",
      options: [
        { id: "a", label: "1FN" },
        { id: "b", label: "2FN" },
        { id: "c", label: "3FN" },
        { id: "d", label: "BCNF" },
      ],
      correctOptionIndex: 2,
      points: 4,
      explanation: "La 3FN exige l'absence de dépendance transitive d'un attribut non-clé.",
      concept: "Normalisation",
    },
    {
      id: "bd2",
      type: "true_false",
      prompt: "Une clé primaire peut contenir plusieurs colonnes.",
      correctBoolean: true,
      points: 4,
      explanation: "C'est une clé composée.",
      concept: "Modélisation",
    },
  ],
};

export const DEMO_QUIZZES: Quiz[] = [
  {
    id: "quiz-demo-algo",
    title: "Algorithmique — Structures & complexité",
    subject: "Algorithmique",
    faculty: "FAST",
    difficulty: "Intermédiaire",
    mode: "qcm",
    questions: ALGO_QUESTIONS,
    origin: "ai",
    createdAt: "2026-10-30T09:00:00.000Z",
    estimatedMinutes: 12,
  },
  {
    id: "quiz-demo-analyse",
    title: "Analyse réelle — Suites et séries",
    subject: "Analyse",
    faculty: "FAST",
    difficulty: "Avancé",
    mode: "qcm",
    questions: ANALYSE_QUESTIONS,
    origin: "ai",
    createdAt: "2026-10-28T09:00:00.000Z",
    estimatedMinutes: 10,
  },
];

export const DEMO_DOCUMENT_ANALYSIS: DocumentAnalysis = {
  id: "doc-demo-1",
  fileName: "cours-algorithmique-ch3.pdf",
  detectedFaculty: "FAST",
  detectedSubject: "Algorithmique",
  title: "Chapitre 3 — Notations asymptotiques",
  summary:
    "Le document couvre les notations O, Ω et Θ, les règles de simplification et les pièges classiques d'examen (confusion pire cas / cas moyen).",
  estimatedLevel: "Intermédiaire (Licence UAC)",
  pageCount: 24,
  chapters: [
    "Chapitre 1 — Définitions et notations",
    "Chapitre 2 — Règles de simplification",
    "Chapitre 3 — Complexité des algorithmes classiques",
    "Chapitre 4 — Exercices d'application",
  ],
  keyConcepts: [
    { id: "c1", concept: "Notation O (majorant)", definition: "Borne supérieure asymptotique du temps d'exécution.", importance: "Fondamentale" },
    { id: "c2", concept: "Notation Θ (équivalent)", definition: "Encadrement asymptotique : le comportement exact.", importance: "Majeure" },
    { id: "c3", concept: "Rotation AVL", definition: "Rééquilibrage local d'un arbre binaire de recherche.", importance: "Majeure" },
    { id: "c4", concept: "Analyse amortie", definition: "Coût moyen d'une séquence d'opérations.", importance: "Secondaire" },
  ],
  difficultyAreas: [
    "Distinguer O(n²) du pire cas et O(n log n) du cas moyen",
    "Complexité spatiale induite par la récursivité",
    "Justifier rigoureusement une borne inférieure (Ω)",
  ],
  creditsCost: 25,
};

export const DEMO_SUMMARY = {
  title: "Synthèse pédagogique — Algorithmique",
  sections: [
    {
      heading: "1. Complexité asymptotique",
      body: "O donne un majorant, Ω un minorant, Θ un encadrement. En examen, précisez toujours le modèle de coût (comparaisons, affectations) et le cas étudié.",
    },
    {
      heading: "2. Structures de données",
      body: "Table de hachage : O(1) amorti. Arbre équilibré : O(log n). Tas binaire : O(log n) pour l'insertion et l'extraction du maximum.",
    },
    {
      heading: "3. Pièges fréquents",
      body: "Confondre O et Θ, oublier le coût de la pile de récursion, ou négliger la différence entre cas moyen et pire cas.",
    },
  ],
};
