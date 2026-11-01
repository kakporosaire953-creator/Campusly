/**
 * DONNÉES DE DÉMONSTRATION — classrooms (amphis virtuels)
 */

import type { Classroom } from "@/types";

export const DEMO_CLASSROOMS: Classroom[] = [
  {
    id: "cls-algo-l2",
    code: "ALGO24",
    name: "L2 Informatique — Algorithmique",
    subject: "Algorithmique",
    faculty: "FAST",
    level: "L2",
    teacherName: "Dr. Komlan Agboton",
    description:
      "Cours magistral de structures de données : arbres, files, tas et complexité algorithmique.",
    studentsCount: 68,
    average: 14.2,
    color: "#1565C0",
    createdAt: "2026-09-08T08:00:00.000Z",
    members: [
      { userId: "demo-user-learner", name: "Rosaire Kakpo", matricule: "23180001", role: "owner", joinedAt: "2026-09-09T10:00:00.000Z", average: 15.5 },
      { userId: "usr-l-2", name: "Mireille Hounkpe", matricule: "23180112", role: "assistant", joinedAt: "2026-09-09T10:05:00.000Z", average: 16.1 },
      { userId: "usr-l-3", name: "Boris Dossou", matricule: "23180124", role: "member", joinedAt: "2026-09-10T09:20:00.000Z", average: 12.4 },
      { userId: "usr-l-4", name: "Fabiola Adjamou", matricule: "23180130", role: "member", joinedAt: "2026-09-11T14:12:00.000Z", average: 13.8 },
      { userId: "usr-l-5", name: "Ismaël Bio", matricule: "23180141", role: "member", joinedAt: "2026-09-12T07:45:00.000Z", average: 9.6 },
    ],
    resources: [
      { id: "res-1", title: "Chapitre 1 — Complexité asymptotique (PDF)", kind: "pdf", url: "#", addedAt: "2026-09-12T08:00:00.000Z", sizeLabel: "1,2 Mo" },
      { id: "res-2", title: "Diaporama — Arbres AVL", kind: "slides", url: "#", addedAt: "2026-09-26T08:00:00.000Z", sizeLabel: "3,4 Mo" },
      { id: "res-3", title: "Lien — Visualisation d'algorithmes de tri", kind: "link", url: "#", addedAt: "2026-10-02T08:00:00.000Z" },
    ],
    assignments: [
      { id: "asg-1", title: "Devoir #1 — Complexité et tri rapide", instructions: "Démontrer la complexité moyenne du tri rapide.", maxPoints: 20, dueAt: "2026-10-10T23:59:00.000Z", submissionsCount: 65, expectedCount: 68 },
      { id: "asg-2", title: "Devoir #2 — Algorithmes gloutons", instructions: "Résoudre le problème du sac à dos par stratégie gloutonne.", maxPoints: 20, dueAt: "2026-11-08T23:59:00.000Z", submissionsCount: 41, expectedCount: 68 },
    ],
    posts: [
      { id: "post-1", authorName: "Dr. Komlan Agboton", authorRole: "owner", content: "Le TD de vendredi est déplacé à l'amphi C. Pensez à imprimer la fiche 4.", createdAt: "2026-10-29T16:20:00.000Z", pinned: true, commentsCount: 6 },
      { id: "post-2", authorName: "Mireille Hounkpe", authorRole: "assistant", content: "J'ai partagé un résumé des rotations AVL dans les ressources, dites-moi si c'est clair.", createdAt: "2026-10-27T19:02:00.000Z", pinned: false, commentsCount: 3 },
    ],
  },
  {
    id: "cls-math-l2",
    code: "ANAL24",
    name: "L2 Maths — Analyse réelle",
    subject: "Analyse",
    faculty: "FAST",
    level: "L2",
    teacherName: "Pr. Nadia Ahouansou",
    description: "Suites, séries et intégration au programme de licence 2.",
    studentsCount: 112,
    average: 11.8,
    color: "#F57C00",
    createdAt: "2026-09-08T08:00:00.000Z",
    members: [
      { userId: "demo-user-learner", name: "Rosaire Kakpo", matricule: "23180001", role: "member", joinedAt: "2026-09-15T10:00:00.000Z", average: 11.2 },
      { userId: "usr-l-6", name: "Cédric Tossou", matricule: "23180076", role: "owner", joinedAt: "2026-09-09T10:05:00.000Z", average: 13.4 },
    ],
    resources: [
      { id: "res-4", title: "Fiche de synthèse — Séries de Fourier", kind: "pdf", url: "#", addedAt: "2026-10-05T08:00:00.000Z", sizeLabel: "820 Ko" },
    ],
    assignments: [
      { id: "asg-3", title: "Série TD 4", instructions: "Exercices 1 à 12.", maxPoints: 20, dueAt: "2026-11-05T23:59:00.000Z", submissionsCount: 58, expectedCount: 112 },
    ],
    posts: [
      { id: "post-3", authorName: "Pr. Nadia Ahouansou", authorRole: "owner", content: "Séance de rattrapage samedi 8h, salle 12.", createdAt: "2026-10-30T11:00:00.000Z", pinned: true, commentsCount: 2 },
    ],
  },
  {
    id: "cls-bdd-l2",
    code: "BDD24X",
    name: "L2 Informatique — Bases de données",
    subject: "Bases de données",
    faculty: "FAST",
    level: "L2",
    teacherName: "Dr. Séraphin Kpadonou",
    description: "Modélisation relationnelle, SQL et normalisation.",
    studentsCount: 54,
    average: 13.6,
    color: "#10B981",
    createdAt: "2026-09-20T08:00:00.000Z",
    members: [
      { userId: "demo-user-learner", name: "Rosaire Kakpo", matricule: "23180001", role: "member", joinedAt: "2026-09-21T10:00:00.000Z", average: 16.4 },
    ],
    resources: [],
    assignments: [],
    posts: [],
  },
  {
    id: "cls-droit-l3",
    code: "DRPT30",
    name: "L3 Droit — Droit privé approfondi",
    subject: "Droit privé",
    faculty: "FADESP",
    level: "L3",
    teacherName: "Dr. Chantal Zinsou",
    description: "Responsabilité civile et contrats spéciaux.",
    studentsCount: 87,
    average: null,
    color: "#1565C0",
    createdAt: "2026-10-01T08:00:00.000Z",
    members: [],
    resources: [],
    assignments: [],
    posts: [],
  },
];
