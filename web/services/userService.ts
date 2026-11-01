/**
 * userService — SIMULATION frontend
 * Assemble les view models des tableaux de bord à partir des fixtures et du
 * profil de démonstration. En production, ces agrégats seront calculés par
 * le Worker (requêtes D1) pour éviter d'exposer des données inutiles.
 *
 * Endpoints futurs : GET /api/me/dashboard, GET /api/teacher/dashboard,
 * GET /api/admin/overview.
 */

import type {
  ActivityEntry,
  AdminOverview,
  LearnerDashboard,
  MasteryTopic,
  TeacherDashboard,
  TeacherClassSummary,
} from "@/types";
import { authService } from "./authService";
import { classroomService } from "./classroomService";
import { compositionService } from "./compositionService";
import { examService } from "./examService";
import { quizService } from "./quizService";
import { demoDelay } from "./mocks/store";
import {
  DEMO_STRONG_TOPICS,
  DEMO_WEAK_TOPICS,
  DEMO_WEEKLY_GOAL,
  computeLevel,
} from "./mocks/fixtures/users";
import { ApiError } from "./api/client";

const DEMO_ACTIVITIES: ActivityEntry[] = [
  {
    id: "act-1",
    type: "quiz",
    title: "Quiz — Algorithmique",
    detail: "Score 13/20 · Structures de données",
    occurredAt: "2026-10-30T21:15:00.000Z",
    icon: "fa-solid fa-brain",
    tone: "brand",
  },
  {
    id: "act-2",
    type: "exam",
    title: "Téléchargement — Algorithmique 2024-2025",
    detail: "Bibliothèque d'épreuves · FAST",
    occurredAt: "2026-10-27T18:22:00.000Z",
    icon: "fa-solid fa-file-lines",
    tone: "accent",
  },
  {
    id: "act-3",
    type: "composition",
    title: "Contrôle continu — Séries numériques",
    detail: "Note 15/20 · validée par l'enseignant",
    occurredAt: "2026-10-20T09:12:00.000Z",
    icon: "fa-solid fa-stopwatch",
    tone: "success",
  },
  {
    id: "act-4",
    type: "classroom",
    title: "Nouvelle annonce — L2 Informatique",
    detail: "TD déplacé à l'amphi C",
    occurredAt: "2026-10-29T16:20:00.000Z",
    icon: "fa-solid fa-chalkboard-user",
    tone: "brand",
  },
];

class UserService {
  async getLearnerDashboard(): Promise<LearnerDashboard> {
    await demoDelay(160);
    const session = await authService.getSession();
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session de démonstration active.");

    const [exams, classrooms, compositions, attempts] = await Promise.all([
      examService.list({ faculty: session.user.faculty, pageSize: 3 }),
      classroomService.list(),
      compositionService.list(),
      quizService.attempts(),
    ]);

    const lastAttempt = attempts[0] ?? quizService.lastAttempt();

    return {
      user: { ...session.user, level: computeLevel(session.user.level.xp) },
      level: computeLevel(session.user.level.xp),
      streakDays: session.user.streakDays,
      credits: session.user.credits,
      weeklyGoal: DEMO_WEEKLY_GOAL,
      lastActivity: {
        title: "Algorithmique — Complexité",
        chapter: "Chapitre 3 : Notations asymptotiques",
        progressPercent: 68,
      },
      weakTopics: DEMO_WEAK_TOPICS as MasteryTopic[],
      strongTopics: DEMO_STRONG_TOPICS as MasteryTopic[],
      recentActivities: lastAttempt
        ? [
            {
              id: lastAttempt.attemptId,
              type: "quiz",
              title: `Quiz — ${lastAttempt.quizTitle}`,
              detail: `Score ${lastAttempt.score}/${lastAttempt.total}`,
              occurredAt: lastAttempt.completedAt,
              icon: lastAttempt.passed ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark",
              tone: lastAttempt.passed ? "success" : "danger",
            },
            ...DEMO_ACTIVITIES,
          ]
        : DEMO_ACTIVITIES,
      upcomingCompositions: compositions.filter((item) => item.status !== "closed"),
      classrooms,
      recommendedExams: exams.items,
      lastAttempt: lastAttempt ?? null,
      isDemo: true,
    };
  }

  async getTeacherDashboard(): Promise<TeacherDashboard> {
    await demoDelay(180);
    const session = await authService.getSession();
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session de démonstration active.");

    const [classrooms, compositions, copies] = await Promise.all([
      classroomService.list(),
      compositionService.list(),
      compositionService.copies(),
    ]);

    const classes: TeacherClassSummary[] = classrooms.map((classroom) => ({
      classroom,
      average: classroom.average,
      strugglingCount: Math.max(1, Math.round(classroom.studentsCount * 0.09)),
      pendingSubmissions: classroom.assignments?.reduce(
        (sum, assignment) => sum + Math.max(0, assignment.expectedCount - assignment.submissionsCount),
        0,
      ) ?? 0,
    }));

    return {
      user: session.user,
      classes,
      totals: {
        students: classrooms.reduce((sum, classroom) => sum + classroom.studentsCount, 0),
        activeClassrooms: classrooms.length,
        compositionsLive: compositions.filter((item) => item.status === "live").length,
        pendingReviews: copies.filter((copy) => copy.validation === "pending_review").length,
      },
      alerts: [
        {
          id: "alert-1",
          title: "Devoir #2 — Algorithmes gloutons",
          message: "41 rendus sur 68 attendus, échéance le 8 novembre.",
          tone: "warning",
        },
        {
          id: "alert-2",
          title: "Copies à valider",
          message: "Des copies corrigées automatiquement attendent votre validation.",
          tone: "info",
        },
      ],
      recentCopies: copies.slice(0, 4).map((copy) => ({
        id: copy.id,
        studentName: copy.studentName,
        compositionTitle: copy.compositionTitle,
        scoreOn20: copy.scoreOn20,
        submittedAt: copy.submittedAt,
      })),
      isDemo: true,
    };
  }

  async getAdminOverview(): Promise<AdminOverview> {
    await demoDelay(200);
    const session = await authService.getSession();
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session de démonstration active.");

    return {
      totals: {
        users: 1284,
        learners: 1211,
        teachers: 73,
        pendingTeacherRequests: 4,
      },
      contributions: { pending: 3, approved: 148, rejected: 11 },
      ai: { analysesThisMonth: 412, creditsConsumed: 10_300 },
      moderationQueue: [
        {
          id: "contrib-1",
          title: "Analyse réelle — Suites et séries (2025-2026)",
          faculty: "FAST",
          academicYear: "2025-2026",
          contributorName: "Mireille Hounkpe",
          submittedAt: "2026-10-30T08:12:00.000Z",
          status: "pending",
        },
        {
          id: "contrib-2",
          title: "Droit civil — Obligations (2025-2026)",
          faculty: "FADESP",
          academicYear: "2025-2026",
          contributorName: "Ismaël Bio",
          submittedAt: "2026-10-29T17:40:00.000Z",
          status: "pending",
        },
        {
          id: "contrib-3",
          title: "Comptabilité générale — Écritures (2025-2026)",
          faculty: "FASEG",
          academicYear: "2025-2026",
          contributorName: "Fabiola Adjamou",
          submittedAt: "2026-10-28T11:05:00.000Z",
          status: "pending",
        },
      ],
      isDemo: true,
    };
  }
}

export const userService = new UserService();
