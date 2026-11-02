/**
 * Profils des trois espaces de démonstration
 * ---------------------------------------------------------------------------
 * Ces profils servent uniquement à parcourir les trois interfaces (étudiant,
 * enseignant, administration) tant qu'il n'y a pas de backend. Ils ne portent
 * AUCUNE donnée d'activité : ni XP, ni série, ni crédits, ni résultat. Les
 * compteurs sont à zéro et les pages affichent un état vide explicite.
 */

import type { AcademicLevel, FacultyCode, TeacherStatus, UserProfile, UserRole } from "@/types";

export function computeLevel(xp: number): AcademicLevel {
  const levels = [
    { key: "new", name: "Nouveau", minXp: 0, maxXp: 100 },
    { key: "beginner", name: "Débutant", minXp: 100, maxXp: 250 },
    { key: "apprentice", name: "Apprenti", minXp: 250, maxXp: 500 },
    { key: "intermediate", name: "Intermédiaire", minXp: 500, maxXp: 1000 },
    { key: "advanced", name: "Avancé", minXp: 1000, maxXp: 2000 },
    { key: "expert", name: "Expert", minXp: 2000, maxXp: 99999 },
  ] as const;

  let index = 0;
  for (let i = 0; i < levels.length; i += 1) {
    if (xp >= levels[i].minXp) index = i;
  }
  const current = levels[index];
  const next = levels[Math.min(index + 1, levels.length - 1)];
  const range = next.minXp - current.minXp || 100;
  const progress = Math.min(100, Math.round(((xp - current.minXp) / range) * 100));

  return {
    key: current.key,
    name: current.name,
    xp,
    nextLevelName: next.name,
    nextThreshold: next.minXp,
    progressPercent: progress,
  };
}

interface DemoUserSeed {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: UserRole;
  teacherStatus: TeacherStatus;
  matricule?: string;
  faculty: FacultyCode;
  department: string;
  title?: string;
  xp: number;
  streakDays: number;
  credits: number;
  joinedAt: string;
  subjects?: string[];
}

const SEEDS: DemoUserSeed[] = [
  {
    id: "demo-user-learner",
    prenom: "Rosaire",
    nom: "Kakpo",
    email: "rosaire.kakpo@uac.bj",
    role: "learner",
    teacherStatus: "none",
    matricule: "23180001",
    faculty: "FAST",
    department: "Informatique",
    xp: 0,
    streakDays: 0,
    credits: 0,
    joinedAt: "2025-10-14T09:12:00.000Z",
  },
  {
    id: "demo-user-teacher",
    prenom: "Komlan",
    nom: "Agboton",
    email: "komlan.agboton@uac.bj",
    role: "teacher",
    teacherStatus: "verified",
    faculty: "FAST",
    department: "Informatique",
    title: "Enseignant Chercheur",
    xp: 0,
    streakDays: 0,
    credits: 0,
    joinedAt: "2024-09-02T08:00:00.000Z",
    subjects: ["Algorithmique", "Structures de Données"],
  },
  {
    id: "demo-user-admin",
    prenom: "Aline",
    nom: "Sossou",
    email: "admin@campusly.uac.bj",
    role: "admin",
    teacherStatus: "none",
    faculty: "FAST",
    department: "Secrétariat académique",
    title: "Administratrice plateforme",
    xp: 0,
    streakDays: 0,
    credits: 0,
    joinedAt: "2024-08-01T07:30:00.000Z",
  },
];

export const DEMO_USERS: UserProfile[] = SEEDS.map((seed) => ({
  id: seed.id,
  prenom: seed.prenom,
  nom: seed.nom,
  email: seed.email,
  role: seed.role,
  teacherStatus: seed.teacherStatus,
  matricule: seed.matricule,
  faculty: seed.faculty,
  department: seed.department,
  title: seed.title,
  level: computeLevel(seed.xp),
  streakDays: seed.streakDays,
  credits: seed.credits,
  joinedAt: seed.joinedAt,
  subjects: seed.subjects,
  photoUrl: undefined,
}));

export const DEMO_LEARNER = DEMO_USERS[0];
export const DEMO_TEACHER = DEMO_USERS[1];
export const DEMO_ADMIN = DEMO_USERS[2];

export const DEMO_WEAK_TOPICS: Array<{ subject: string; mastery: number; priority: "Haute" | "Moyenne" }> = [];

export const DEMO_STRONG_TOPICS: Array<{ subject: string; mastery: number }> = [];

export const DEMO_WEEKLY_GOAL = { target: 0, current: 0, period: "Aucune révision enregistrée" };
