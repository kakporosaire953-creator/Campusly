/**
 * Contrats Quiz, Révision & IA — Campusly
 * ---------------------------------------------------------------------------
 * La génération de contenu relève du backend (Workers + fournisseurs IA
 * multiples). Le frontend ne fait que :
 *  - envoyer un document ou un sujet,
 *  - afficher le résultat,
 *  - enregistrer un résultat de quiz (score, réponses, durée).
 */

import type { FacultyCode } from "./auth";

export type QuizQuestionType = "qcm" | "true_false" | "open";
export type LearningMode = "qcm" | "open" | "true_false" | "summary" | "marathon" | "flash";
export type Difficulty = "Débutant" | "Intermédiaire" | "Avancé";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: QuizOption[];
  /** Index de la bonne réponse pour `qcm`. */
  correctOptionIndex?: number;
  /** Réponse attendue pour `true_false`. */
  correctBoolean?: boolean;
  /** Éléments de corrigé, révélés après réponse. */
  explanation?: string;
  keywords?: string[];
  points: number;
  concept?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  faculty: FacultyCode;
  difficulty: Difficulty;
  mode: LearningMode;
  questions: QuizQuestion[];
  /** Origine du quiz : généré par IA ou fourni par un enseignant. */
  origin: "ai" | "teacher";
  createdAt: string;
  estimatedMinutes: number;
}

export interface QuizGenerationInput {
  source: "document" | "topic" | "exam";
  /** Texte extrait du document (le fichier binaire part vers R2). */
  sourceText?: string;
  topic?: string;
  examId?: string;
  faculty: FacultyCode;
  subject: string;
  difficulty: Difficulty;
  questionCount: number;
  mode: LearningMode;
}

export interface QuizAnswerInput {
  questionId: string;
  /** Index pour `qcm`, booléen pour `true_false`, texte pour `open`. */
  value: number | boolean | string;
}

export interface QuizAttemptInput {
  quizId: string;
  answers: QuizAnswerInput[];
  durationSeconds: number;
}

export interface QuizQuestionResult {
  questionId: string;
  prompt: string;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
  explanation?: string;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  durationSeconds: number;
  completedAt: string;
  questions: QuizQuestionResult[];
  /** Crédits consommés par la génération / correction IA. */
  creditsSpent: number;
}

/** Document analysé par Campusly AI (étape 1 → 3 du parcours). */
export interface DocumentAnalysis {
  id: string;
  fileName: string;
  detectedFaculty: FacultyCode;
  detectedSubject: string;
  title: string;
  summary: string;
  estimatedLevel: string;
  pageCount: number;
  chapters: string[];
  keyConcepts: Array<{
    id: string;
    concept: string;
    definition: string;
    importance: string;
  }>;
  difficultyAreas: string[];
  /** Coût en crédits de l'analyse. */
  creditsCost: number;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  /** Mentions affichées sous la réponse (sources, avertissements). */
  footnotes?: string[];
}

export interface AiChatInput {
  conversationId?: string;
  message: string;
  /** Contexte optionnel transmis au modèle. */
  context?: { examId?: string; classroomId?: string };
}

export interface AiChatReply {
  conversationId: string;
  message: AiChatMessage;
  creditsSpent: number;
}

export interface AiProviderStatus {
  /** Fournisseurs déclarés côté backend (multi-fournisseurs). */
  providers: Array<{ id: string; label: string; available: boolean }>;
  /** Mode courant du routeur IA. */
  routing: "auto" | "fast" | "quality";
}

export interface QuizServiceContract {
  generate(input: QuizGenerationInput): Promise<Quiz>;
  getById(quizId: string): Promise<Quiz>;
  submitAttempt(input: QuizAttemptInput): Promise<QuizAttemptResult>;
  attempts(quizId?: string): Promise<QuizAttemptResult[]>;
}

export interface AiServiceContract {
  analyzeDocument(input: { fileName: string; text?: string; faculty: FacultyCode; subject: string }): Promise<DocumentAnalysis>;
  chat(input: AiChatInput): Promise<AiChatReply>;
  status(): Promise<AiProviderStatus>;
}
