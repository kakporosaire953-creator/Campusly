/**
 * examService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * Recherche, filtrage, favoris et tickets de téléchargement simulés.
 * Aucun fichier n'est réellement servi : `requestDownload` renvoie une URL
 * symbolique et rappelle explicitement que le document n'existe pas.
 *
 * Endpoints futurs : GET /api/exams, GET /api/exams/:id, GET /api/exams/facets,
 * GET /api/exams/:id/download-url, GET/POST /api/favorites.
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
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_EXAM_HISTORY, DEMO_EXAMS } from "./mocks/fixtures/exams";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const FAVORITES_KEY = "exam-favorites";
const CONTRIBUTIONS_KEY = "contributions";

function matchesSearch(exam: Exam, search: string): boolean {
  const haystack = [exam.title, exam.subject, exam.department, exam.academicYear, ...exam.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.toLowerCase());
}

class ExamService implements ExamServiceContract {
  private all(): Exam[] {
    return DEMO_EXAMS;
  }

  private favoritesIds(): string[] {
    return demoStore.read<string[]>(FAVORITES_KEY, ["epr-001", "epr-015"]);
  }

  async list(filters: ExamFilters = {}): Promise<{ items: Exam[]; total: number }> {
    await demoDelay();
    const favorites = this.favoritesIds();
    let items = this.all().filter((exam) => {
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
  }

  async getById(id: string): Promise<Exam> {
    await demoDelay(90);
    const exam = this.all().find((item) => item.id === id);
    if (!exam) throw ApiError.of("NOT_FOUND", "Cette épreuve n'existe pas dans la bibliothèque de démonstration.");
    return exam;
  }

  async facets(): Promise<ExamFacets> {
    await demoDelay(60);
    const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));
    return {
      faculties: unique(this.all().map((exam) => exam.faculty)) as FacultyCode[],
      departments: unique(this.all().map((exam) => exam.department)).sort((a, b) => a.localeCompare(b, "fr")),
      academicYears: unique(this.all().map((exam) => exam.academicYear)).sort().reverse(),
      levels: unique(this.all().map((exam) => exam.level)),
      types: unique(this.all().map((exam) => exam.type)),
    };
  }

  async favorites(): Promise<Exam[]> {
    await demoDelay(80);
    const favorites = this.favoritesIds();
    return this.all().filter((exam) => favorites.includes(exam.id));
  }

  async toggleFavorite(examId: string): Promise<{ favorited: boolean }> {
    await demoDelay(80);
    const favorites = this.favoritesIds();
    const isFavorite = favorites.includes(examId);
    const next = isFavorite ? favorites.filter((id) => id !== examId) : [...favorites, examId];
    demoStore.write(FAVORITES_KEY, next);
    return { favorited: !isFavorite };
  }

  isFavorite(examId: string): boolean {
    return this.favoritesIds().includes(examId);
  }

  async requestDownload(examId: string): Promise<ExamDownloadTicket> {
    await demoDelay(220);
    const exam = await this.getById(examId);
    return {
      examId: exam.id,
      // URL symbolique : aucun fichier n'est stocké (R2 non déployé).
      url: `demo://r2/${exam.storageKey ?? `${exam.id}.pdf`}`,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      creditsSpent: exam.isPremium ? 5 : 0,
    };
  }

  async history(): Promise<ExamHistoryEntry[]> {
    await demoDelay(70);
    return DEMO_EXAM_HISTORY;
  }

  async submitContribution(input: ExamContributionInput): Promise<Contribution> {
    await demoDelay(320);
    const fields: Record<string, string> = {};
    if (!input.title?.trim()) fields.title = "Titre obligatoire";
    if (!input.subject?.trim()) fields.subject = "Matière obligatoire";
    if (!input.academicYear?.trim()) fields.academicYear = "Année universitaire obligatoire";
    if (!input.fileName) fields.file = "Sélectionnez un fichier PDF";
    if (Object.keys(fields).length > 0) {
      throw ApiError.of("VALIDATION", "La contribution est incomplète.", fields);
    }

    const contribution: Contribution = {
      id: uid("contrib"),
      title: input.title,
      faculty: input.faculty,
      academicYear: input.academicYear,
      status: "pending",
      submittedAt: nowIso(),
      contributorName: "Rosaire Kakpo (démo)",
    };

    const existing = demoStore.read<Contribution[]>(CONTRIBUTIONS_KEY, []);
    demoStore.write(CONTRIBUTIONS_KEY, [contribution, ...existing]);
    return contribution;
  }

  async contributions(): Promise<Contribution[]> {
    await demoDelay(70);
    return demoStore.read<Contribution[]>(CONTRIBUTIONS_KEY, []);
  }
}

export const examService = new ExamService();
