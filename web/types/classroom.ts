/**
 * Contrats Classrooms (amphis virtuels) — Campusly
 * ---------------------------------------------------------------------------
 * Une classroom appartient à un enseignant (propriétaire) et regroupe des
 * membres (étudiants), des ressources (fichiers R2), des devoirs et des
 * compositions. Les règles d'accès (membre, propriétaire, admin) sont
 * appliquées côté serveur.
 */

import type { FacultyCode } from "./auth";
import type { LicenceLevel } from "./exam";

export type ClassroomRole = "owner" | "assistant" | "member";

export interface ClassroomMember {
  userId: string;
  name: string;
  matricule?: string;
  role: ClassroomRole;
  joinedAt: string;
  /** Moyenne sur 20 (facultative, calculée côté serveur). */
  average?: number;
}

export interface ClassroomResource {
  id: string;
  title: string;
  kind: "pdf" | "slides" | "link" | "video";
  url: string;
  addedAt: string;
  sizeLabel?: string;
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  instructions: string;
  maxPoints: number;
  dueAt: string;
  submissionsCount: number;
  /** Nombre de membres attendus, pour le taux de rendu. */
  expectedCount: number;
}

export interface ClassroomPost {
  id: string;
  authorName: string;
  authorRole: ClassroomRole;
  content: string;
  createdAt: string;
  pinned: boolean;
  commentsCount: number;
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  subject: string;
  faculty: FacultyCode;
  level: LicenceLevel;
  teacherName: string;
  description: string;
  studentsCount: number;
  average: number | null;
  color: string;
  createdAt: string;
  members?: ClassroomMember[];
  resources?: ClassroomResource[];
  assignments?: ClassroomAssignment[];
  posts?: ClassroomPost[];
}

export interface ClassroomAnalytics {
  totalStudents: number;
  classAverage: number | null;
  participationRate: number;
  strugglingCount: number;
  /** Répartition des moyennes par tranche. */
  distribution: Array<{ bucket: string; count: number }>;
}

export interface CreateClassroomInput {
  name: string;
  subject: string;
  faculty: FacultyCode;
  level: LicenceLevel;
  description?: string;
}

export interface JoinClassroomInput {
  /** Code d'invitation à 6 caractères, généré par le backend. */
  code: string;
}

export interface ClassroomServiceContract {
  list(): Promise<Classroom[]>;
  getById(id: string): Promise<Classroom>;
  analytics(id: string): Promise<ClassroomAnalytics>;
  create(input: CreateClassroomInput): Promise<Classroom>;
  join(input: JoinClassroomInput): Promise<Classroom>;
  leave(id: string): Promise<void>;
  addPost(classroomId: string, content: string): Promise<ClassroomPost>;
}
