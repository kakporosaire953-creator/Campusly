/**
 * Contrats Épreuves & Annales — Campusly
 * ---------------------------------------------------------------------------
 * Les fichiers (PDF) vivront dans Cloudflare R2. D1 ne stocke que les
 * métadonnées et la clé d'objet R2. Le frontend ne reçoit jamais d'URL
 * permanente : il demande une URL signée à courte durée de vie.
 */

import type { DateRange, PageQuery, SortQuery } from "./common";
import type { FacultyCode } from "./auth";

export type ExamType = "Examen" | "Partiel" | "TD" | "TP" | "Correction";
export type Semester = "S1" | "S2";
export type LicenceLevel = "L1" | "L2" | "L3" | "M1" | "M2";

/** Métadonnées d'une épreuve. */
export interface Exam {
  id: string;
  title: string;
  subject: string;
  faculty: FacultyCode;
  department: string;
  level: LicenceLevel;
  semester: Semester;
  academicYear: string;
  type: ExamType;
  /** Accès réservé aux comptes disposant de crédits / abonnement actif. */
  isPremium: boolean;
  pages: number;
  /** Taille du fichier en octets (facultatif). */
  fileSize?: number;
  downloads: number;
  /** Clé d'objet R2 — jamais exposée telle quelle à l'interface. */
  storageKey?: string;
  contributorName?: string;
  publishedAt: string;
  tags: string[];
}

/** Filtres de la bibliothèque. */
export interface ExamFilters extends PageQuery, SortQuery {
  search?: string;
  faculty?: FacultyCode;
  department?: string;
  level?: LicenceLevel;
  semester?: Semester;
  academicYear?: string;
  type?: ExamType;
  premiumOnly?: boolean;
  favoritesOnly?: boolean;
  publishedAt?: DateRange;
}

/** URL de téléchargement signée, à durée de vie courte. */
export interface ExamDownloadTicket {
  examId: string;
  url: string;
  expiresAt: string;
  /** Crédits débités par ce téléchargement (0 si abonnement actif). */
  creditsSpent: number;
}

/** Historique de consultation / téléchargement. */
export interface ExamHistoryEntry {
  id: string;
  examId: string;
  examTitle: string;
  faculty: FacultyCode;
  action: "view" | "download";
  occurredAt: string;
}

/** Facettes disponibles pour construire les filtres. */
export interface ExamFacets {
  faculties: FacultyCode[];
  departments: string[];
  academicYears: string[];
  levels: LicenceLevel[];
  types: ExamType[];
}

export interface ExamServiceContract {
  list(filters?: ExamFilters): Promise<{ items: Exam[]; total: number }>;
  getById(id: string): Promise<Exam>;
  facets(): Promise<ExamFacets>;
  favorites(): Promise<Exam[]>;
  toggleFavorite(examId: string): Promise<{ favorited: boolean }>;
  requestDownload(examId: string): Promise<ExamDownloadTicket>;
  history(): Promise<ExamHistoryEntry[]>;
  submitContribution(input: ExamContributionInput): Promise<Contribution>;
}

/** Contribution d'une épreuve par un étudiant ou un enseignant. */
export interface ExamContributionInput {
  title: string;
  subject: string;
  faculty: FacultyCode;
  department: string;
  level: LicenceLevel;
  semester: Semester;
  academicYear: string;
  type: ExamType;
  fileName: string;
  fileSize: number;
  /** Contenu binaire envoyé via un upload direct R2 (URL présignée). */
  file?: File;
}

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface Contribution {
  id: string;
  title: string;
  faculty: FacultyCode;
  academicYear: string;
  status: ContributionStatus;
  submittedAt: string;
  contributorName: string;
  /** Motif de rejet, renseigné par la modération. */
  reviewNote?: string;
}
