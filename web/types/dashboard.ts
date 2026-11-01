/**
 * Modèles d'affichage des tableaux de bord (view models).
 * Ces types sont produits par `services/userService.ts` et consommés par les
 * composants ; ils ne correspondent pas à une table de la base.
 */

import type { AcademicLevel, UserProfile } from "./auth";
import type { Classroom } from "./classroom";
import type { Composition } from "./composition";
import type { Exam } from "./exam";
import type { QuizAttemptResult } from "./quiz";

export interface MasteryTopic {
  subject: string;
  mastery: number;
  priority?: "Haute" | "Moyenne" | "Basse";
}

export interface ActivityEntry {
  id: string;
  type: "quiz" | "exam" | "composition" | "classroom" | "ai";
  title: string;
  detail: string;
  occurredAt: string;
  icon: string;
  tone: "success" | "danger" | "brand" | "accent";
}

export interface LearnerDashboard {
  user: UserProfile;
  level: AcademicLevel;
  streakDays: number;
  credits: number;
  weeklyGoal: { target: number; current: number; period: string };
  lastActivity: { title: string; chapter: string; progressPercent: number } | null;
  weakTopics: MasteryTopic[];
  strongTopics: MasteryTopic[];
  recentActivities: ActivityEntry[];
  upcomingCompositions: Composition[];
  classrooms: Classroom[];
  recommendedExams: Exam[];
  lastAttempt: QuizAttemptResult | null;
  /** Toutes les valeurs proviennent de fixtures locales. */
  isDemo: true;
}

export interface TeacherClassSummary {
  classroom: Classroom;
  average: number | null;
  strugglingCount: number;
  pendingSubmissions: number;
}

export interface TeacherDashboard {
  user: UserProfile;
  classes: TeacherClassSummary[];
  totals: {
    students: number;
    activeClassrooms: number;
    compositionsLive: number;
    pendingReviews: number;
  };
  alerts: Array<{ id: string; title: string; message: string; tone: "warning" | "info" | "danger" }>;
  recentCopies: Array<{ id: string; studentName: string; compositionTitle: string; scoreOn20: number; submittedAt: string }>;
  isDemo: true;
}

export interface AdminOverview {
  totals: {
    users: number;
    learners: number;
    teachers: number;
    pendingTeacherRequests: number;
  };
  contributions: {
    pending: number;
    approved: number;
    rejected: number;
  };
  ai: {
    analysesThisMonth: number;
    creditsConsumed: number;
  };
  moderationQueue: Array<{
    id: string;
    title: string;
    faculty: string;
    academicYear: string;
    contributorName: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
  }>;
  isDemo: true;
}
