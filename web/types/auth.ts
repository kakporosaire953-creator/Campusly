/**
 * Contrats Utilisateurs & Authentification — Campusly
 * ---------------------------------------------------------------------------
 * Le backend cible s'appuie sur Better Auth (sessions signées, cookies
 * httpOnly) et Cloudflare D1 pour les profils. Le frontend ne fait qu'appeler
 * ces opérations : il ne valide jamais une autorisation par lui-même.
 */

import type { DateRange, PageQuery, TeacherStatus, UserRole } from "./common";

/** Facultés et instituts de l'UAC (référentiel partagé). */
export type FacultyCode =
  | "FAST"
  | "FASEG"
  | "FADESP"
  | "EPAC"
  | "FSS"
  | "FSA"
  | "ENEAM"
  | "FLLAC"
  | "FASHS"
  | "INJEPS";

export const FACULTIES: ReadonlyArray<{ code: FacultyCode; label: string }> = [
  { code: "FAST", label: "FAST — Sciences et Techniques" },
  { code: "FASEG", label: "FASEG — Sciences Éco & Gestion" },
  { code: "FADESP", label: "FADESP — Droit & Sciences Politiques" },
  { code: "EPAC", label: "EPAC — École Polytechnique" },
  { code: "FSS", label: "FSS — Sciences de la Santé" },
  { code: "FSA", label: "FSA — Sciences Agronomiques" },
  { code: "ENEAM", label: "ENEAM — Économie Appliquée" },
  { code: "FLLAC", label: "FLLAC — Lettres & Langues" },
  { code: "FASHS", label: "FASHS — Sciences Humaines" },
  { code: "INJEPS", label: "INJEPS — Sports & Éducation" },
];

/** Départements proposés par faculté (suggestions de saisie). */
export const DEPARTMENTS_BY_FACULTY: Readonly<Record<FacultyCode, readonly string[]>> = {
  FAST: ["Mathématiques", "Physique", "Chimie", "Sciences Naturelles", "Informatique", "Géologie"],
  FASEG: ["Économie", "Gestion", "Comptabilité et Finance", "Marketing", "Économétrie"],
  FADESP: ["Droit Public", "Droit Privé", "Sciences Politiques"],
  EPAC: ["Génie Civil", "Génie Électrique", "Génie Mécanique", "Architecture"],
  FSS: ["Médecine générale", "Pharmacie", "Odontostomatologie", "Kinésithérapie"],
  FSA: ["Production Végétale", "Production Animale et Pêche", "Nutrition"],
  ENEAM: ["Gestion des Entreprises", "Statistiques", "Informatique de Gestion"],
  FLLAC: ["Lettres Modernes", "Sciences du Langage & Communication", "Anglais"],
  FASHS: ["Histoire & Archéologie", "Sociologie & Anthropologie", "Psychologie"],
  INJEPS: ["STAPS", "Sciences de l'Éducation et de la Formation"],
};

/** Niveau académique (gamification), calculé côté serveur en production. */
export interface AcademicLevel {
  key: "new" | "beginner" | "apprentice" | "intermediate" | "advanced" | "expert";
  name: string;
  xp: number;
  nextLevelName: string;
  nextThreshold: number;
  progressPercent: number;
}

/** Profil public d'un utilisateur. */
export interface UserProfile {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  role: UserRole;
  teacherStatus: TeacherStatus;
  matricule?: string;
  faculty: FacultyCode;
  department: string;
  photoUrl?: string;
  title?: string;
  level: AcademicLevel;
  streakDays: number;
  credits: number;
  joinedAt: string;
  /** Matières principales (enseignants). */
  subjects?: string[];
}

/** Session courante renvoyée par `/api/auth/session`. */
export interface AuthSession {
  user: UserProfile;
  /** Date d'expiration de la session (ISO). */
  expiresAt: string;
}

export interface LoginInput {
  /** Matricule UAC (8 chiffres) ou adresse e-mail. */
  identifier: string;
  password: string;
}

export interface RegisterInput {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  role: Extract<UserRole, "learner" | "teacher">;
  matricule?: string;
  faculty: FacultyCode;
  department?: string;
  subjects?: string[];
}

export interface TeacherActivationInput {
  matricule: string;
  faculty: FacultyCode;
  department: string;
  title: string;
  /** Code d'invitation émis par le secrétariat académique. */
  invitationCode?: string;
}

export interface ProfileUpdateInput {
  prenom?: string;
  nom?: string;
  faculty?: FacultyCode;
  department?: string;
  title?: string;
  photoUrl?: string;
}

/** Opérations d'authentification (miroir des futurs endpoints). */
export interface AuthServiceContract {
  getSession(): Promise<AuthSession | null>;
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterInput): Promise<AuthSession>;
  logout(): Promise<void>;
  requestTeacherActivation(input: TeacherActivationInput): Promise<{ teacherStatus: TeacherStatus; message: string }>;
  updateProfile(input: ProfileUpdateInput): Promise<UserProfile>;
}

/** Opérations d'administration des utilisateurs (rôle `admin` requis). */
export interface AdminUserQuery extends PageQuery {
  role?: UserRole;
  teacherStatus?: TeacherStatus;
  faculty?: string;
  search?: string;
  joinedAt?: DateRange;
}
