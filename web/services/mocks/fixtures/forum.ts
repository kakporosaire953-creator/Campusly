/**
 * DONNÉES DE DÉMONSTRATION — forum d'entraide
 */

import type { ForumThread } from "@/types";

export const DEMO_THREADS: ForumThread[] = [
  {
    id: "thread-1",
    title: "Comment retenir les rotations AVL pour l'examen ?",
    content:
      "Je confonds toujours les rotations doubles gauche-droite. Quelqu'un a une méthode mnémotechnique ou un exercice type ?",
    author: { id: "usr-l-3", name: "Boris Dossou", role: "learner", faculty: "FAST" },
    faculty: "FAST",
    tags: ["algorithmique", "arbres", "révisions"],
    createdAt: "2026-10-30T18:40:00.000Z",
    views: 212,
    likes: 14,
    repliesCount: 2,
    solved: true,
    pinned: true,
    replies: [
      {
        id: "reply-1",
        author: { id: "demo-user-teacher", name: "Dr. Komlan Agboton", role: "teacher", faculty: "FAST", badge: "Enseignant vérifié" },
        content:
          "Retenez que le facteur d'équilibre doit rester dans {-1, 0, 1}. Dessinez toujours l'arbre après insertion, puis identifiez le premier nœud déséquilibré : la rotation se fait autour de lui.",
        createdAt: "2026-10-30T20:05:00.000Z",
        likes: 22,
        accepted: true,
      },
      {
        id: "reply-2",
        author: { id: "usr-l-2", name: "Mireille Hounkpe", role: "learner", faculty: "FAST" },
        content: "Le TD 4 exercice 3 m'a beaucoup aidée, il y a exactement ce cas.",
        createdAt: "2026-10-31T07:12:00.000Z",
        likes: 5,
        accepted: false,
      },
    ],
  },
  {
    id: "thread-2",
    title: "Série de Riemann : où trouver des exercices corrigés ?",
    content:
      "Le cours va vite sur le critère de comparaison. Est-ce que la bibliothèque d'épreuves contient des annales corrigées d'analyse ?",
    author: { id: "demo-user-learner", name: "Rosaire Kakpo", role: "learner", faculty: "FAST" },
    faculty: "FAST",
    tags: ["analyse", "annales"],
    createdAt: "2026-10-29T09:15:00.000Z",
    views: 168,
    likes: 9,
    repliesCount: 1,
    solved: false,
    pinned: false,
    replies: [
      {
        id: "reply-3",
        author: { id: "usr-l-6", name: "Cédric Tossou", role: "learner", faculty: "FAST" },
        content: "Oui : « Analyse réelle — Suites et séries » (2024-2025) puis la correction associée.",
        createdAt: "2026-10-29T10:02:00.000Z",
        likes: 3,
        accepted: false,
      },
    ],
  },
  {
    id: "thread-3",
    title: "Composition surveillée : le mode strict bloque-t-il les changements d'onglet ?",
    content: "Je voudrais être sûr de ne pas être pénalisé si mon navigateur ouvre une notification système.",
    author: { id: "usr-l-4", name: "Fabiola Adjamou", role: "learner", faculty: "FAST" },
    faculty: "FAST",
    tags: ["compositions", "proctoring"],
    createdAt: "2026-10-27T14:00:00.000Z",
    views: 340,
    likes: 21,
    repliesCount: 1,
    solved: true,
    pinned: false,
    replies: [
      {
        id: "reply-4",
        author: { id: "demo-user-teacher", name: "Dr. Komlan Agboton", role: "teacher", faculty: "FAST", badge: "Enseignant vérifié" },
        content:
          "Un changement d'onglet est journalisé, pas automatiquement sanctionné. La copie et le journal sont revus par l'enseignant à la correction.",
        createdAt: "2026-10-27T15:30:00.000Z",
        likes: 18,
        accepted: true,
      },
    ],
  },
  {
    id: "thread-4",
    title: "Groupe de révision FAST — Analyse des données",
    content: "Nous sommes trois à préparer le partiel de données. Cherchons un quatrième pour des séances le samedi.",
    author: { id: "usr-l-5", name: "Ismaël Bio", role: "learner", faculty: "FAST" },
    faculty: "FAST",
    tags: ["groupe", "révisions"],
    createdAt: "2026-10-25T11:45:00.000Z",
    views: 96,
    likes: 6,
    repliesCount: 0,
    solved: false,
    pinned: false,
    replies: [],
  },
  {
    id: "thread-5",
    title: "Procédure de validation d'un compte enseignant",
    content:
      "Nouveau titulaire en droit privé, comment faire vérifier mon statut pour créer mes classrooms ?",
    author: { id: "usr-t-2", name: "Dr. Chantal Zinsou", role: "teacher", faculty: "FADESP" },
    faculty: "FADESP",
    tags: ["enseignant", "compte"],
    createdAt: "2026-10-22T08:20:00.000Z",
    views: 74,
    likes: 4,
    repliesCount: 1,
    solved: false,
    pinned: false,
    replies: [
      {
        id: "reply-5",
        author: { id: "demo-user-admin", name: "Aline Sossou", role: "admin", badge: "Administration" },
        content:
          "La vérification se fait auprès du secrétariat académique : déposez votre attestation de fonction, la validation est ensuite activée sur le compte.",
        createdAt: "2026-10-22T09:40:00.000Z",
        likes: 7,
        accepted: false,
      },
    ],
  },
  {
    id: "thread-6",
    title: "Le téléchargement d'épreuve décompte-t-il des crédits ?",
    content: "J'ai 120 crédits et un abonnement actif : quel est le comportement exact ?",
    author: { id: "usr-l-2", name: "Mireille Hounkpe", role: "learner", faculty: "FAST" },
    faculty: "FAST",
    tags: ["crédits", "abonnement"],
    createdAt: "2026-10-20T17:10:00.000Z",
    views: 152,
    likes: 11,
    repliesCount: 1,
    solved: true,
    pinned: false,
    replies: [
      {
        id: "reply-6",
        author: { id: "demo-user-admin", name: "Aline Sossou", role: "admin", badge: "Administration" },
        content:
          "Avec un abonnement actif, les téléchargements d'épreuves sont inclus. Sans abonnement, chaque téléchargement coûte des crédits.",
        createdAt: "2026-10-20T18:00:00.000Z",
        likes: 9,
        accepted: true,
      },
    ],
  },
];
