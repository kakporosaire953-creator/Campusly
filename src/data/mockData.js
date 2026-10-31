export const FACULTIES = [
  { id: 'all', name: 'Toutes les Facultés', badge: 'UAC' },
  { id: 'FAST', name: 'FAST - Sciences & Techniques', badge: 'FAST' },
  { id: 'FASEG', name: 'FASEG - Sciences Économiques & Gestion', badge: 'FASEG' },
  { id: 'FADESP', name: 'FADESP - Droit & Sciences Politiques', badge: 'FADESP' },
  { id: 'EPAC', name: 'EPAC - Polytechnique Abomey-Calavi', badge: 'EPAC' },
  { id: 'ENEAM', name: 'ENEAM - Économie Appliquée & Management', badge: 'ENEAM' },
  { id: 'FSS', name: 'FSS - Sciences de la Santé', badge: 'FSS' },
  { id: 'FLASH', name: 'FLASH - Lettres, Arts & Sciences Humaines', badge: 'FLASH' },
];

export const MOCK_EPREUVES = [
  {
    id: 'epr-01',
    title: 'Algorithmique & Structures de Données Avancées',
    code: 'INF-201',
    faculty: 'FAST',
    department: 'Informatique',
    year: '2024-2025',
    semester: 'S3',
    session: 'Normale',
    type: 'Examen Final',
    hasCorrection: true,
    downloads: 1420,
    rating: 4.9,
    difficulty: 'Difficile',
    tags: ['Arbres AVL', 'Graphes', 'Complexité', 'Dijkstra'],
    pdfUrl: '#',
    previewText: 'Exercice 1: Analyse asymptotique des algorithmes de parcours en largeur. Exercice 2: Équilibrage dynamique des arbres binaires...'
  },
  {
    id: 'epr-02',
    title: 'Microéconomie II — Équilibre Général & Bien-Être',
    code: 'ECO-102',
    faculty: 'FASEG',
    department: 'Économie',
    year: '2024-2025',
    semester: 'S2',
    session: 'Rattrapage',
    hasCorrection: true,
    downloads: 980,
    rating: 4.7,
    difficulty: 'Moyen',
    tags: ['Équilibre Walrasien', 'Optimum Pareto', 'Monopole'],
    pdfUrl: '#',
    previewText: 'Partie 1: Dans une économie d\'échange pur à deux agents A et B et deux biens X et Y...'
  },
  {
    id: 'epr-03',
    title: 'Droit des Obligations & Responsabilité Civile',
    code: 'DRT-204',
    faculty: 'FADESP',
    department: 'Droit Privé',
    year: '2023-2024',
    semester: 'S4',
    session: 'Normale',
    hasCorrection: true,
    downloads: 2150,
    rating: 4.8,
    difficulty: 'Moyen',
    tags: ['Jurisprudence', 'Contrat', 'Faute délictuelle'],
    pdfUrl: '#',
    previewText: 'Cas pratique: Un étudiant souscrit un contrat de bail commercial avec clause résolutoire expresse...'
  },
  {
    id: 'epr-04',
    title: 'Résistance des Matériaux & Calcul des Structures',
    code: 'GC-301',
    faculty: 'EPAC',
    department: 'Génie Civil',
    year: '2024-2025',
    semester: 'S5',
    session: 'Normale',
    hasCorrection: false,
    downloads: 640,
    rating: 4.6,
    difficulty: 'Difficile',
    tags: ['RDM', 'Poutres', 'Flexion', 'Torseur'],
    pdfUrl: '#',
    previewText: 'Déterminer les moments fléchissants et les contraintes normales le long de la poutre continue...'
  },
  {
    id: 'epr-05',
    title: 'Comptabilité Approfondie & Normes SYSCOHADA Révisé',
    code: 'CPT-202',
    faculty: 'ENEAM',
    department: 'Finance & Audit',
    year: '2024-2025',
    semester: 'S4',
    session: 'Normale',
    hasCorrection: true,
    downloads: 1840,
    rating: 4.9,
    difficulty: 'Difficile',
    tags: ['SYSCOHADA', 'Amortissements', 'Provisions', 'Bilan'],
    pdfUrl: '#',
    previewText: 'Traitement des opérations complexes : contrats de concession de service public et subventions d\'investissement...'
  },
  {
    id: 'epr-06',
    title: 'Biochimie Clinique & Enzymologie Médicale',
    code: 'MED-103',
    faculty: 'FSS',
    department: 'Médecine Générale',
    year: '2023-2024',
    semester: 'S2',
    session: 'Normale',
    hasCorrection: true,
    downloads: 1120,
    rating: 4.8,
    difficulty: 'Expert',
    tags: ['Cinétique Michaelienne', 'Isoenzymes', 'Métabolisme'],
    pdfUrl: '#',
    previewText: 'QCM et questions rédactionnelles sur les marqueurs sériques du syndrome coronarien aigu...'
  }
];

export const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Dans un arbre AVL, quelle est la différence maximale tolérée entre les hauteurs des sous-arbres gauche et droit pour chaque nœud ?",
    options: [
      "0 (hauteurs strictement égales)",
      "1 (facteur d'équilibre -1, 0 ou +1)",
      "2 (avec rééquilibrage différé)",
      "Log2(n)"
    ],
    correctAnswer: 1,
    explanation: "Un arbre AVL est un arbre binaire de recherche auto-équilibrant où la différence de hauteur entre les sous-arbres d'un nœud quelconque ne dépasse jamais 1."
  },
  {
    id: 2,
    question: "En droit civil béninois/OHADA, quels sont les trois critères cumulatifs pour engager la responsabilité civile extracontractuelle ?",
    options: [
      "Une faute, un dommage certain, et un lien de causalité direct",
      "Un contrat écrit, une défaillance de paiement et une mise en demeure",
      "Un préjudice matériel uniquement et l'aveu du défendeur",
      "La preuve d'un dol intentionnel certifié par huissier"
    ],
    correctAnswer: 0,
    explanation: "La responsabilité civile délictuelle exige invariablement la réunion d'une faute (action ou omission), d'un préjudice (direct et certain) et d'un lien causal."
  },
  {
    id: 3,
    question: "Quelle est la complexité temporelle pire cas de l'algorithme de tri Quicksort sans pivot aléatoire ?",
    options: [
      "O(n log n)",
      "O(n)",
      "O(n²)",
      "O(2ⁿ)"
    ],
    correctAnswer: 2,
    explanation: "Si le tableau est déjà trié ou inversement trié et que le pivot est mal choisi (ex: premier ou dernier élément), le partitionnement est asymétrique menant à O(n²)."
  }
];

export const MOCK_USER = {
  name: 'Aurelien KOUASSI',
  matricule: '2023-04921',
  faculty: 'FAST',
  department: 'Informatique',
  level: 'Licence 2',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 3450,
  levelNum: 7,
  streak: 14,
  credits: 42,
  completedQuizzes: 38,
  averageScore: 16.4,
  downloadsCount: 52
};
