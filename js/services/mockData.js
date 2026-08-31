// ============================================================
// CAMPUSLY 2.0 — Services & Mock Data Layer
// Référentiel complet & réaliste pour l'Université d'Abomey-Calavi (UAC)
// ============================================================

export const MOCK_FACULTIES = [
  { id: "FAST", name: "FAST — Faculté des Sciences et Techniques", icon: "flask" },
  { id: "FASEG", name: "FASEG — Faculté des Sciences Économiques et de Gestion", icon: "chart-line" },
  { id: "FADESP", name: "FADESP — Faculté de Droit et de Science Politique", icon: "scale-balanced" },
  { id: "EPAC", name: "EPAC — École Polytechnique d'Abomey-Calavi", icon: "microchip" },
  { id: "FSS", name: "FSS — Faculté des Sciences de la Santé", icon: "heart-pulse" },
  { id: "FSA", name: "FSA — Faculté des Sciences Agronomiques", icon: "seedling" },
  { id: "ENEAM", name: "ENEAM — École Nationale d'Économie Appliquée et de Management", icon: "calculator" },
  { id: "FLASH", name: "FLASH / FASHS — Sciences Humaines et Sociales", icon: "book-open" },
  { id: "FLLAC", name: "FLLAC — Faculté des Lettres, Langues, Arts et Communication", icon: "pen-nib" },
  { id: "INJEPS", name: "INJEPS — Institut National de la Jeunesse et des Sports", icon: "person-running" }
];

export const MOCK_SUBJECTS = [
  "Algorithmique & Complexité",
  "Programmation Web & Bases de Données",
  "Analyse Mathématique & Calcul Intégral",
  "Probabilités & Statistiques Appliquées",
  "Microéconomie & Théorie des Jeux",
  "Macroéconomie Internationale",
  "Droit Civil des Obligations",
  "Droit Constitutionnel & Institutions",
  "Comptabilité Générale & Analytique",
  "Génie Logiciel & Architecture Système"
];

export const INITIAL_USER = {
  id: "usr_rosaire_953",
  prenom: "Rosaire",
  nom: "Kakpo",
  email: "kakporosaire953@gmail.com",
  matricule: "23180953",
  role: "learner", // 'learner' | 'pending_teacher' | 'verified_teacher'
  teacherStatus: "none", // 'none' | 'pending' | 'verified'
  faculte: "FAST",
  departement: "Mathématiques et Informatique",
  formation: "Licence 2 Informatique & Systèmes",
  academicLevel: {
    key: "apprentice",
    name: "Apprenti",
    icon: "🎓",
    xp: 350,
    nextThreshold: 500,
    progressPercent: 70
  },
  credits: 120,
  streak: 7,
  lastStreakDate: new Date().toISOString().split('T')[0],
  weeklyGoal: {
    target: 4,
    current: 3,
    period: "Semaine en cours"
  },
  lastCourse: {
    title: "Algorithmique — Complexité Temporelle & Spatiale",
    chapter: "Chapitre 3 : Notations Asymptotiques (Grand O, Omega, Theta)",
    progressPercent: 68,
    lastViewed: "Aujourd'hui à 14:20"
  },
  weakTopics: [
    { subject: "Algorithmes de Tri", mastery: 38, priority: "Haute", questionsToReview: 6 },
    { subject: "Probabilités Conditionnelles", mastery: 43, priority: "Haute", questionsToReview: 5 },
    { subject: "Analyse — Suites & Séries", mastery: 52, priority: "Moyenne", questionsToReview: 4 },
    { subject: "Complexité Temporelle", mastery: 61, priority: "Moyenne", questionsToReview: 3 }
  ],
  strongTopics: [
    { subject: "Bases de Données SQL & Modélisation", mastery: 93, status: "Maîtrisé" },
    { subject: "Algèbre Linéaire & Matrices", mastery: 88, status: "Maîtrisé" },
    { subject: "Programmation Modulaire C++", mastery: 85, status: "Maîtrisé" }
  ],
  recentActivities: [
    { id: "act_1", type: "quiz", title: "Quiz Révision : Structures de Données", score: "18/20", time: "Il y a 2 heures", icon: "circle-check", color: "var(--success)" },
    { id: "act_2", type: "ai", title: "Campusly AI : Analyse Polycopié Complexité", detail: "+4 notions clés extraites", time: "Il y a 5 heures", icon: "brain", color: "var(--brand-1)" },
    { id: "act_3", type: "composition", title: "Épreuve Blanche : Analyse II (FAST 2025)", score: "15.5/20", time: "Hier", icon: "award", color: "var(--accent)" },
    { id: "act_4", type: "classroom", title: "Classroom L2 Info : Devoir Algorithmes Gloutons rendu", time: "Il y a 2 jours", icon: "file-signature", color: "var(--brand-2)" }
  ],
  creditHistory: [
    { id: "tx_1", date: "30 Août 2026", desc: "Analyse Campusly AI — Polycopié Algorithmique", amount: -15, type: "debit" },
    { id: "tx_2", date: "29 Août 2026", desc: "Session Marathon Adaptatif personnalisée", amount: -10, type: "debit" },
    { id: "tx_3", date: "28 Août 2026", desc: "Bonus Série Quotidienne (7 jours)", amount: +10, type: "credit" },
    { id: "tx_4", date: "25 Août 2026", desc: "Recharge Pack Étudiant via MTN MoMo", amount: +100, type: "credit" }
  ]
};

export const MOCK_TEACHER_PROFILE = {
  id: "usr_prof_mensah",
  prenom: "Dr. Kokou",
  nom: "Mensah",
  email: "k.mensah@uac.bj",
  role: "verified_teacher",
  teacherStatus: "verified",
  titre: "Maître de Conférences — CAMES",
  faculte: "FAST",
  departement: "Département de Mathématiques et Informatique",
  credits: 500,
  stats: {
    classesCount: 4,
    totalStudents: 184,
    averageGrade: 13.6,
    activeExams: 2,
    completionRate: 89
  },
  alerts: [
    { id: "al_1", type: "danger", title: "Devoir #2 non rendu", desc: "8 apprenants de L2 Info n'ont pas encore soumis leur copie (Date limite ce soir).", icon: "triangle-exclamation" },
    { id: "al_2", type: "warning", title: "Baisse de moyenne observée", desc: "La moyenne sur le module 'Complexité Spatiale' a baissé de 7% sur le dernier test.", icon: "arrow-trend-down" },
    { id: "al_3", type: "info", title: "Point d'attention pédagogique", desc: "5 apprenants rencontrent des difficultés récurrentes sur la récursivité croisée.", icon: "circle-exclamation" }
  ]
};

export const MOCK_CLASSROOMS = [
  {
    id: "cls-algo-l2",
    code: "UAC-ALGO-2026",
    name: "Licence 2 Informatique — Algorithmique Avancée",
    subject: "Algorithmique & Structures de Données",
    faculte: "FAST",
    teacherName: "Dr. Kokou Mensah",
    teacherAvatar: "KM",
    studentsCount: 68,
    average: "14.2 / 20",
    color: "#1565C0",
    description: "Espace officiel d'étude, devoirs programmés et sessions d'évaluation pour la promotion L2 Info 2025-2026.",
    nextAssignment: "Devoir Maison : Graphes & Arbres Bivalents",
    deadline: "Dimanche à 23h59",
    posts: [
      { id: "p1", author: "Dr. Kokou Mensah", date: "Hier à 10:30", content: "Bonjour à tous. Le corrigé détaillé de l'interrogation N°1 sur les files de priorité est disponible dans l'onglet Ressources.", pinned: true },
      { id: "p2", author: "Dr. Kokou Mensah", date: "28 Août 2026", content: "Rappel : La composition surveillée de mi-semestre aura lieu vendredi prochain via la plateforme Campusly." }
    ],
    resources: [
      { id: "r1", title: "Polycopié de Cours — Algorithmique & Graphes 2026.pdf", size: "3.4 Mo", downloads: 64, date: "15 Août 2026" },
      { id: "r2", title: "TD3 — Arbres AVL et Équilibrage.pdf", size: "1.1 Mo", downloads: 58, date: "22 Août 2026" },
      { id: "r3", title: "Corrigé Synthétique Interrogation 1.pdf", size: "850 Ko", downloads: 67, date: "Hier" }
    ],
    exercises: [
      { id: "ex1", title: "Devoir #1 : Complexité et Tri Quicksort", questionsCount: 10, status: "Terminé", grade: "17/20", avg: "13.8/20" },
      { id: "ex2", title: "Devoir #2 : Algorithmes Gloutons & Sac à Dos", questionsCount: 8, status: "En cours", deadline: "Dans 2 jours" }
    ],
    compositions: [
      { id: "comp-algo-01", title: "Épreuve Surveillée de Mi-Semestre — Algorithmique", date: "4 Septembre 2026", duration: "90 min", status: "Planifiée" },
      { id: "comp-algo-02", title: "Test Blanc : Notations Asymptotiques", date: "Disponible", duration: "45 min", status: "Disponible" }
    ]
  },
  {
    id: "cls-math-l2",
    code: "UAC-MATH-2026",
    name: "Licence 2 — Analyse Mathématique & Calcul Différentiel",
    subject: "Analyse Mathématique",
    faculte: "FAST",
    teacherName: "Prof. S. Hounkponou",
    teacherAvatar: "SH",
    studentsCount: 112,
    average: "11.8 / 20",
    color: "#F57C00",
    description: "Amphi d'analyse approfondie : intégrales multiples, séries de Fourier et équations différentielles.",
    nextAssignment: "Série d'exercices 4 : Équations de Bernoulli",
    deadline: "Vendredi à 18h00",
    resources: [
      { id: "mr1", title: "Fascicule Calcul Différentiel 2026.pdf", size: "5.2 Mo", downloads: 98, date: "10 Août 2026" }
    ],
    exercises: [
      { id: "mex1", title: "Auto-évaluation : Intégrales Généralisées", questionsCount: 12, status: "Disponible" }
    ],
    compositions: []
  },
  {
    id: "cls-eco-s4",
    code: "UAC-ECO-2026",
    name: "FASEG S4 — Macroéconomie Ouverte & Politiques Monétaires",
    subject: "Macroéconomie",
    faculte: "FASEG",
    teacherName: "Dr. A. Agbodjogbe",
    teacherAvatar: "AA",
    studentsCount: 140,
    average: "12.9 / 20",
    color: "#2E7D32",
    description: "Cours magistral et applications empiriques pour la zone UEMOA / CEDEAO.",
    nextAssignment: "Étude de Cas : Modèle IS-LM-BP",
    deadline: "10 Septembre 2026",
    resources: [
      { id: "er1", title: "Rapport Politique Monétaire BCEAO 2025.pdf", size: "2.8 Mo", downloads: 110, date: "18 Août 2026" }
    ],
    exercises: [],
    compositions: []
  }
];

export const MOCK_COMPOSITIONS = [
  {
    id: "comp-algo-01",
    title: "Composition Surveillée — Algorithmes & Structures de Données",
    classroom: "Licence 2 Informatique (FAST)",
    professor: "Dr. Kokou Mensah",
    durationMinutes: 45,
    totalPoints: 20,
    passMark: 10,
    questionsCount: 8,
    proctored: true,
    securityRules: [
      "Mode plein écran obligatoire",
      "Détection et enregistrement des changements d'onglets",
      "Chronomètre avec soumission automatique à l'échéance",
      "Correction instantanée et génération de copie commentée"
    ],
    questions: [
      {
        id: "cq1",
        type: "qcm",
        title: "Complexité temporelle pire cas",
        text: "Quelle est la complexité dans le pire des cas de l'algorithme de tri rapide (Quicksort) lorsque le pivot choisi est systématiquement le plus petit élément ?",
        options: [
          "O(n log n)",
          "O(n²)",
          "O(n)",
          "O(log n)"
        ],
        correctIndex: 1,
        explanation: "Dans le pire des cas (tableau déjà trié et pivot à l'extrémité), le Quicksort effectue n partitions de taille n-1, soit n*(n-1)/2 opérations, ce qui donne une complexité quadratique O(n²)."
      },
      {
        id: "cq2",
        type: "true_false",
        title: "Arbres binaires de recherche (ABR)",
        text: "Dans un Arbre Binaire de Recherche parfait de hauteur h, la recherche d'une clé s'effectue en temps logarithmique O(h) = O(log n).",
        correctBoolean: true,
        explanation: "Vrai : la structure équilibrée divise l'espace de recherche par deux à chaque nœud visité, garantissant un parcours en O(log n)."
      },
      {
        id: "cq3",
        type: "qcm",
        title: "Structures de Données Linéaires",
        text: "Quelle structure de données est naturellement employée pour implémenter un parcours en largeur (BFS) dans un graphe connexe ?",
        options: [
          "Une Pile (LIFO - Stack)",
          "Une File (FIFO - Queue)",
          "Un Tas Binaire (Heap)",
          "Une Table de Hachage"
        ],
        correctIndex: 1,
        explanation: "Le parcours en largeur (BFS) explore les sommets niveau par niveau, ce qui requiert une file FIFO (First In, First Out) pour traiter les voisins dans leur ordre de découverte."
      },
      {
        id: "cq4",
        type: "open",
        title: "Principe de la Programmation Dynamique",
        text: "Expliquez brièvement la différence fondamentale entre l'approche 'Diviser pour Régner' et la 'Programmation Dynamique'.",
        sampleAnswer: "La Programmation Dynamique stocke les solutions des sous-problèmes chevauchants (mémoïsation / tableau) pour éviter de recalculer plusieurs fois les mêmes états, tandis que Diviser pour Régner traite des sous-problèmes totalement indépendants.",
        keywords: ["sous-problèmes chevauchants", "mémoïsation", "indépendants", "recalcul"]
      },
      {
        id: "cq5",
        type: "true_false",
        title: "Graphes orientés pondérés",
        text: "L'algorithme de Dijkstra fonctionne correctement même en présence d'arcs à poids strictement négatifs sans cycles.",
        correctBoolean: false,
        explanation: "Faux : Dijkstra suppose que le coût d'un chemin ne diminue jamais lors de l'exploration. Pour les poids négatifs sans cycle absorbant, on doit employer l'algorithme de Bellman-Ford."
      },
      {
        id: "cq6",
        type: "qcm",
        title: "Théorème Maître (Master Theorem)",
        text: "Pour la relation de récurrence T(n) = 4T(n/2) + O(n), que vaut T(n) d'après le théorème maître ?",
        options: [
          "O(n log n)",
          "O(n²)",
          "O(n³)",
          "O(2^n)"
        ],
        correctIndex: 1,
        explanation: "a=4, b=2 => log_b(a) = log_2(4) = 2. Comme f(n)=O(n) est strictement dominé par n^(log_b(a))=n², nous sommes dans le cas 1 du Théorème Maître : T(n) = O(n²)."
      },
      {
        id: "cq7",
        type: "true_false",
        title: "Tables de Hachage & Collision",
        text: "L'adressage ouvert avec sondage linéaire permet de garantir un temps d'accès O(1) dans le pire des cas, indépendamment du facteur de charge.",
        correctBoolean: false,
        explanation: "Faux : En cas de collisions multiples ou de facteur de charge élevé, des grappes d'éléments se forment (primary clustering), dégradant l'accès à O(n) dans le pire cas."
      },
      {
        id: "cq8",
        type: "open",
        title: "Stabilité des Algorithmes de Tri",
        text: "Définissez ce qu'est un algorithme de tri 'stable' en informatique.",
        sampleAnswer: "Un tri est dit stable s'il préserve l'ordre relatif initial des éléments ayant des clés de tri identiques.",
        keywords: ["ordre relatif", "clés identiques", "préserve"]
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    title: "Nouveau Devoir en L2 Informatique",
    message: "Dr. Kokou Mensah a publié le 'Devoir #2 : Algorithmes Gloutons'. Date limite : Dimanche 23h59.",
    date: "Il y a 30 minutes",
    unread: true,
    type: "classroom",
    link: "classrooms.html"
  },
  {
    id: "notif_2",
    title: "🔥 Félicitations pour votre Série !",
    message: "Vous avez atteint 7 jours consécutifs de révision sur Campusly. Vous gagnez +10 crédits bonus !",
    date: "Aujourd'hui à 08:00",
    unread: true,
    type: "streak",
    link: "dashboard.html"
  },
  {
    id: "notif_3",
    title: "Résultat disponible : Test Blanc Complexité",
    message: "Votre copie a été corrigée : Note obtenue 18/20. Consultez votre corrigé interactif.",
    date: "Hier à 16:45",
    unread: false,
    type: "exam",
    link: "composition.html?id=comp-algo-01&view=copy"
  },
  {
    id: "notif_4",
    title: "Campusly AI : Analyse terminée",
    message: "Le polycopié 'Calcul Intégral & Séries' a été analysé avec succès. 15 questions d'entraînement sont prêtes.",
    date: "28 Août 2026",
    unread: false,
    type: "ai",
    link: "revision.html"
  }
];
