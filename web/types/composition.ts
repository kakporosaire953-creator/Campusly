/**
 * Contrats Compositions & Salle d'examen — Campusly
 * ---------------------------------------------------------------------------
 * Une composition est une évaluation surveillée : code d'accès, fenêtre
 * temporelle, minuterie, journal d'intégrité (proctoring) et copie.
 * La correction et la note officielle sont calculées côté serveur.
 */

import type { QuizAnswerInput, QuizQuestionType } from "./quiz";

export type CompositionStatus = "draft" | "scheduled" | "live" | "closed" | "graded";

export interface CompositionQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  correctBoolean?: boolean;
  keywords?: string[];
  points: number;
  explanation?: string;
}

export interface Composition {
  id: string;
  /** Code d'accès communiqué par l'enseignant (6 caractères). */
  code: string;
  title: string;
  subject: string;
  classroomId?: string;
  classroomName: string;
  teacherName: string;
  status: CompositionStatus;
  questions: CompositionQuestion[];
  durationMinutes: number;
  totalPoints: number;
  passMark: number;
  opensAt: string;
  closesAt: string;
  /** Mode de surveillance affiché à l'étudiant. */
  proctoring: "standard" | "strict";
  attemptsAllowed: number;
  participantsCount: number;
}

export type ProctorEventType =
  | "tab_blur"
  | "tab_focus"
  | "fullscreen_exit"
  | "copy_attempt"
  | "network_offline"
  | "resume";

export interface ProctorEvent {
  id: string;
  type: ProctorEventType;
  occurredAt: string;
}

export interface CompositionAttemptInput {
  compositionId: string;
  answers: QuizAnswerInput[];
  proctorEvents: ProctorEvent[];
  durationSeconds: number;
}

export interface CompositionQuestionResult {
  questionId: string;
  prompt: string;
  userAnswer: string | number | boolean | null;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
  explanation: string;
}

export interface CompositionCopy {
  id: string;
  compositionId: string;
  compositionTitle: string;
  studentName: string;
  matricule: string;
  submittedAt: string;
  scoreOn20: number;
  passed: boolean;
  durationSeconds: number;
  proctorEventsCount: number;
  /** Statut de validation par l'enseignant. */
  validation: "auto_graded" | "pending_review" | "validated";
  feedback: string;
  questions: CompositionQuestionResult[];
}

export interface CompositionServiceContract {
  list(): Promise<Composition[]>;
  getById(id: string): Promise<Composition>;
  findByCode(code: string): Promise<Composition>;
  submit(input: CompositionAttemptInput): Promise<CompositionCopy>;
  copies(compositionId?: string): Promise<CompositionCopy[]>;
}
