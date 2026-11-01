// ============================================================
// CAMPUSLY 2.0 — aiService.js
// Moteur intelligent Campusly AI & Génération de Quiz/Résumés
// ============================================================

import { creditService } from './creditService.js';

export class AIService {
  constructor() {
    this.privacyGuarantee = "Vos documents restent strictement privés, chiffrés et ne sont jamais partagés sans votre autorisation expresse.";
  }

  analyzeDocument(param) {
    let text = '';
    let filename = 'document.pdf';
    let faculty = 'FAST';
    let subject = 'Algorithmique';

    if (typeof param === 'string') {
      text = param;
    } else if (typeof param === 'object' && param !== null) {
      text = param.text || param.sourceText || '';
      filename = param.filename || filename;
      faculty = param.faculty || faculty;
      subject = param.subject || subject;
    }

    const detectedTitle = text.length > 20 
      ? text.substring(0, 50).split('\n')[0].replace(/^[#\s\-*]+/, '') 
      : 'Support Pédagogique UAC';

    return {
      filename,
      detectedFaculty: faculty,
      detectedSubject: subject,
      title: detectedTitle.length > 5 ? detectedTitle : 'Support de Révision Universitaire (UAC)',
      summary: 'Analyse synthétique des notions fondamentales du cours. Les principes théoriques, démonstrations et pièges classiques d\'examen ont été extraits et calibrés.',
      estimatedLevel: 'Intermédiaire (Licence UAC)',
      pageCount: Math.max(2, Math.round((text.length || 1500) / 1200)),
      chapters: [
        'Chapitre 1 : Fondements & Définitions Clés',
        'Chapitre 2 : Démonstrations Mathématiques & Algorithmiques',
        'Chapitre 3 : Applications Pratiques & Études de Cas',
        'Chapitre 4 : Problèmes de Synthèse & Annales'
      ],
      keyConcepts: [
        {
          id: "c1",
          concept: "Complexité Asymptotique (O, Ω, Θ)",
          title: "Complexité Asymptotique (O, Ω, Θ)",
          definition: "Classification du temps d'exécution pire/moyen cas des algorithmes.",
          importance: "Fondamentale (Examen)"
        },
        {
          id: "c2",
          concept: "Arbres Binaires de Recherche & AVL",
          title: "Arbres Binaires de Recherche & AVL",
          definition: "Structures hiérarchiques avec garantie de recherche logarithmique par rotations.",
          importance: "Majeure"
        },
        {
          id: "c3",
          concept: "Parcours de Graphes (BFS & DFS)",
          title: "Parcours de Graphes (BFS & DFS)",
          definition: "Exploration systématique par niveaux (file) ou profondeur (pile/récursion).",
          importance: "Majeure"
        },
        {
          id: "c4",
          concept: "Programmation Dynamique & Mémoïsation",
          title: "Programmation Dynamique & Mémoïsation",
          definition: "Optimisation de sous-problèmes chevauchants pour éviter les calculs redondants.",
          importance: "Stratégique"
        }
      ],
      difficultyAreas: [
        'Distinction stricte entre pire cas O(n²) et cas moyen O(n log n)',
        'Gestion des facteurs d\'équilibre {-1, 0, +1} dans les rotations doubles AVL',
        'Complexité spatiale induite par la pile d\'appels récursifs'
      ]
    };
  }

  generateQuiz(config = {}) {
    const count = Number(config.questionCount || 5);
    const difficulty = config.difficulty || 'Intermédiaire';
    const type = config.questionType || 'all';
    const chapter = config.chapter || 'Généralités & Notions Fondamentales';

    const pool = [
      {
        id: `gq_${Date.now()}_1`,
        type: 'qcm',
        chapter: 'Complexité & Algorithmes de Tri',
        difficulty,
        prompt: "Quelle est la complexité dans le pire des cas du tri rapide (Quicksort) lorsque le tableau est déjà trié et le pivot mal choisi ?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
        correctIndex: 1,
        explanation: "Dans le pire cas, le Quicksort réalise n partitions successives de taille n-1, produisant une complexité quadratique O(n²)."
      },
      {
        id: `gq_${Date.now()}_2`,
        type: 'true_false',
        chapter: 'Structures de Données Arborescentes',
        difficulty,
        prompt: "Dans un arbre binaire de recherche parfait de n nœuds, la recherche d'une clé s'effectue en temps O(log n).",
        options: ["VRAI", "FAUX"],
        correctAnswer: true,
        correctIndex: 0,
        explanation: "Vrai : la hauteur d'un arbre parfaitement équilibré est log2(n), limitant le nombre maximal de comparaisons à la hauteur h."
      },
      {
        id: `gq_${Date.now()}_3`,
        type: 'qcm',
        chapter: 'Théorie des Graphes',
        difficulty,
        prompt: "Quelle structure de données est indispensable pour implémenter un parcours en largeur (BFS) dans un graphe ?",
        options: ["Une Pile (LIFO)", "Une File (FIFO)", "Un Tas Min", "Une Table de Hachage"],
        correctAnswer: 1,
        correctIndex: 1,
        explanation: "Le parcours en largeur traite les sommets par niveaux concentriques croissants, ce qui requiert une file FIFO."
      },
      {
        id: `gq_${Date.now()}_4`,
        type: 'open',
        chapter: 'Paradigmes Algorithmiques',
        difficulty,
        prompt: "Expliquez brièvement le principe de la mémoïsation en programmation dynamique.",
        options: [],
        correctAnswer: "Stockage en cache mémoire des résultats intermédiaires de sous-problèmes déjà résolus.",
        explanation: "La mémoïsation évite de recalculer de manière répétée les solutions des sous-problèmes chevauchants en les stockant dans un tableau ou une table de hachage."
      },
      {
        id: `gq_${Date.now()}_5`,
        type: 'true_false',
        chapter: 'Algorithmes de Plus Court Chemin',
        difficulty,
        prompt: "L'algorithme de Dijkstra fonctionne de manière optimale même en présence d'arcs à poids négatifs sans cycle absorbant.",
        options: ["VRAI", "FAUX"],
        correctAnswer: false,
        correctIndex: 1,
        explanation: "Faux : Dijkstra suppose que le coût des chemins ne diminue jamais lors de la relaxation. Pour les poids négatifs, on utilise Bellman-Ford."
      },
      {
        id: `gq_${Date.now()}_6`,
        type: 'qcm',
        chapter: 'Arbres Couvrants Minimaux',
        difficulty,
        prompt: "L'algorithme de Kruskal pour la recherche de l'arbre couvrant minimal applique quel paradigme de conception ?",
        options: ["Algorithme Glouton (Greedy)", "Diviser pour Régner", "Programmation Dynamique", "Force Brute"],
        correctAnswer: 0,
        correctIndex: 0,
        explanation: "Kruskal trie les arêtes par coût croissant et choisit localement à chaque étape la meilleure arête sans créer de cycle."
      },
      {
        id: `gq_${Date.now()}_7`,
        type: 'true_false',
        chapter: 'Structures Linéaires',
        difficulty,
        prompt: "Le tri par fusion (Merge Sort) est un algorithme de tri stable.",
        options: ["VRAI", "FAUX"],
        correctAnswer: true,
        correctIndex: 0,
        explanation: "Vrai : En cas d'égalité de valeurs, l'élément issu du sous-tableau gauche est sélectionné en priorité, conservant l'ordre original."
      }
    ];

    let filtered = pool;
    if (type === 'qcm') {
      filtered = pool.filter(q => q.type === 'qcm');
    } else if (type === 'true_false') {
      filtered = pool.filter(q => q.type === 'true_false');
    } else if (type === 'open') {
      filtered = pool.filter(q => q.type === 'open');
    }

    if (filtered.length === 0) filtered = pool;

    const questions = [];
    for (let i = 0; i < count; i++) {
      const base = filtered[i % filtered.length];
      questions.push({
        ...base,
        id: `q_${Date.now()}_${i + 1}`,
        chapter: chapter || base.chapter,
        difficulty
      });
    }

    return {
      questions,
      totalCount: questions.length,
      difficulty,
      chapter
    };
  }

  regenerateSingleQuestion(conceptTitle = "Complexité") {
    return {
      id: `gq_${Date.now()}`,
      type: "qcm",
      chapter: conceptTitle,
      difficulty: "Intermédiaire",
      prompt: `Dans l'analyse asymptotique, que signifie formellement la notation f(n) = Ω(g(n)) ?`,
      options: [
        "g(n) est une borne inférieure asymptotique pour f(n)",
        "g(n) est une borne supérieure asymptotique pour f(n)",
        "f(n) et g(n) sont strictement du même ordre",
        "f(n) est négligeable devant g(n)"
      ],
      correctAnswer: 0,
      correctIndex: 0,
      explanation: "La notation Grand Omega (Ω) certifie qu'au-delà d'un rang n0, f(n) >= c * g(n) pour une constante c > 0."
    };
  }
}

export const aiService = new AIService();
window.aiService = aiService;
