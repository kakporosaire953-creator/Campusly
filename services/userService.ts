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

const DEMO_ACTIVITIES: ActivityEntry[] = [];

class UserService {
  async getLearnerDashboard(): Promise<LearnerDashboard> {
    await demoDelay(160);
    const session = await authService.getSession();
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session active.");

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
      // Aucun chapitre « en cours » n'est inventé : la carte n'apparaît que
      // lorsqu'une tentative réelle existe.
      lastActivity: lastAttempt
        ? {
            title: lastAttempt.quizTitle,
            chapter: "Dernière tentative enregistrée",
            progressPercent: Math.round((lastAttempt.score / Math.max(1, lastAttempt.total)) * 100),
          }
        : null,
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
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session active.");

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
    if (!session) throw ApiError.of("UNAUTHENTICATED", "Aucune session active.");

    // La plateforme n'a encore ni utilisateurs réels ni contributions : tous les
    // compteurs partent de zéro plutôt que d'un ordre de grandeur inventé.
    const exams = await examService.list({ pageSize: 1 });

    return {
      totals: {
        users: 0,
        learners: 0,
        teachers: 0,
        pendingTeacherRequests: 0,
      },
      contributions: { pending: 0, approved: 0, rejected: exams.total },
      ai: { analysesThisMonth: 0, creditsConsumed: 0 },
      moderationQueue: [],
      isDemo: true,
    };
  }
}

export const userService = new UserService();
