/**
 * examService — accès à la bibliothèque d'épreuves
 * ---------------------------------------------------------------------------
 * Le service conserve toute l'architecture d'interrogation (recherche, filtres,
 * tri, pagination, facettes, favoris locaux) afin d'être branché sur le
 * backend sans changer l'interface. Il ne sert en revanche AUCUN contenu
 * fictif : le catalogue de l'application est vide tant qu'aucun document réel
 * n'est publié, et l'interface affiche alors un état vide explicite.
 *
 * Endpoints futurs : GET /api/exams, GET /api/exams/:id, GET /api/exams/facets,
 * GET /api/exams/:id/download-url, GET/POST /api/favorites,
 * POST /api/exams/contributions.
 */

import type {
  Contribution,
  Exam,
  ExamContributionInput,
  ExamDownloadTicket,
  ExamFacets,
  ExamFilters,
  ExamHistoryEntry,
  ExamServiceContract,
  FacultyCode,
  LicenceLevel,
  Semester,
} from "@/types";
import { DEPARTMENTS_BY_FACULTY, FACULTIES } from "@/types";
import { ApiError } from "./api/client";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const FAVORITES_KEY = "exam-favorites";

const LEVELS: LicenceLevel[] = ["L1", "L2", "L3", "M1", "M2"];
const SEMESTERS: Semester[] = ["S1", "S2"];
const TYPES: ExamFacets["types"] = ["Examen", "Partiel", "TD", "TP", "Correction"];

/** Année universitaire en cours (bascule en septembre). Déterministe côté client. */
function currentAcademicYear(now = new Date()): string {
  const year = now.getFullYear();
  const start = now.getMonth() >= 8 ? year : year - 1;
  return `${start}-${start + 1}`;
}

function matchesSearch(exam: Exam, search: string): boolean {
  const haystack = [exam.title, exam.subject, exam.department, exam.academicYear, ...exam.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

/**
 * Fabrique un service adossé à un catalogue donné.
 * L'application utilise un catalogue vide ; les tests peuvent injecter des
 * documents pour vérifier le moteur de recherche et de filtrage.
 */
export function createExamService(catalog: readonly Exam[] = []): ExamServiceContract {
  const all = (): readonly Exam[] => catalog;

  const favoritesIds = (): string[] => demoStore.read<string[]>(FAVORITES_KEY, []);

  return {
    async list(filters: ExamFilters = {}) {
      await demoDelay();
      const favorites = favoritesIds();
      let items = all().filter((exam) => {
        if (filters.search && !matchesSearch(exam, filters.search)) return false;
        if (filters.faculty && exam.faculty !== filters.faculty) return false;
        if (filters.department && exam.department !== filters.department) return false;
        if (filters.level && exam.level !== filters.level) return false;
        if (filters.semester && exam.semester !== filters.semester) return false;
        if (filters.academicYear && exam.academicYear !== filters.academicYear) return false;
        if (filters.type && exam.type !== filters.type) return false;
        if (filters.premiumOnly && !exam.isPremium) return false;
        if (filters.favoritesOnly && !favorites.includes(exam.id)) return false;
        return true;
      });

      const sortBy = filters.sortBy ?? "recent";
      items = [...items].sort((a, b) => {
        if (sortBy === "downloads") return b.downloads - a.downloads;
        if (sortBy === "title") return a.title.localeCompare(b.title, "fr");
        return b.publishedAt.localeCompare(a.publishedAt);
      });

      const total = items.length;
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 9;
      const start = (page - 1) * pageSize;
      return { items: items.slice(start, start + pageSize), total };
    },

    async getById(id: string): Promise<Exam> {
      await demoDelay(60);
      const exam = all().find((item) => item.id === id);
      if (!exam) throw ApiError.of("NOT_FOUND", "Ce document n'est pas disponible dans la bibliothèque.");
      return exam;
    },

    async facets(): Promise<ExamFacets> {
      await demoDelay(60);
      const fromCatalog = all();
      return {
        // Les facettes retombent sur la nomenclature de l'UAC quand le
        // catalogue est vide : les filtres restent utilisables et cohérents.
        faculties: (fromCatalog.length
          ? unique(fromCatalog.map((exam) => exam.faculty))
          : FACULTIES.map((faculty) => faculty.code)) as FacultyCode[],
        departments: fromCatalog.length
          ? unique(fromCatalog.map((exam) => exam.department)).sort((a, b) => a.localeCompare(b, "fr"))
          : unique(Object.values(DEPARTMENTS_BY_FACULTY).flat()).sort((a, b) => a.localeCompare(b, "fr")),
        academicYears: fromCatalog.length
          ? unique(fromCatalog.map((exam) => exam.academicYear)).sort().reverse()
          : [currentAcademicYear()],
        levels: fromCatalog.length ? unique(fromCatalog.map((exam) => exam.level)) : LEVELS,
        types: fromCatalog.length ? unique(fromCatalog.map((exam) => exam.type)) : TYPES,
      };
    },

    async favorites(): Promise<Exam[]> {
      await demoDelay(50);
      const favorites = favoritesIds();
      return all().filter((exam) => favorites.includes(exam.id));
    },

    async toggleFavorite(examId: string) {
      await demoDelay(50);
      const favorites = favoritesIds();
      const isFavorite = favorites.includes(examId);
      const next = isFavorite ? favorites.filter((id) => id !== examId) : [...favorites, examId];
      demoStore.write(FAVORITES_KEY, next);
      return { favorited: !isFavorite };
    },

    isFavorite(examId: string): boolean {
      return favoritesIds().includes(examId);
    },

    async requestDownload(): Promise<ExamDownloadTicket> {
      // Aucun document n'est stocké : on ne fabrique ni URL symbolique ni
      // téléchargement simulé. Le jour où R2 sera branché, cet appel renverra
      // une URL signée à durée de vie courte.
      throw ApiError.of(
        "BACKEND_UNAVAILABLE",
        "Le téléchargement des documents n'est pas encore ouvert.",
      );
    },

    async history(): Promise<ExamHistoryEntry[]> {
      await demoDelay(40);
      return [];
    },

    async submitContribution(input: ExamContributionInput): Promise<Contribution> {
      await demoDelay(120);
      const fields: Record<string, string> = {};
      if (!input.title?.trim()) fields.title = "Titre obligatoire";
      if (!input.subject?.trim()) fields.subject = "Matière obligatoire";
      if (!input.academicYear?.trim()) fields.academicYear = "Année universitaire obligatoire";
      if (!input.fileName) fields.file = "Sélectionnez un fichier";
      if (Object.keys(fields).length > 0) {
        throw ApiError.of("VALIDATION", "La contribution est incomplète.", fields);
      }

      // Le dépôt n'est pas encore ouvert : on ne prétend pas avoir enregistré
      // une contribution qui n'existe nulle part.
      throw ApiError.of(
        "BACKEND_UNAVAILABLE",
        "Le dépôt de contributions n'est pas encore ouvert. Aucun fichier n'a été transmis.",
      );
    },

    async contributions(): Promise<Contribution[]> {
      return [];
    },
  };
}

/** Aucun document réel n'est publié pour l'instant : catalogue vide. */
export const examService = createExamService([]);

export { currentAcademicYear, SEMESTERS };
