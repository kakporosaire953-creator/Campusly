/**
 * quizService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * Génération de quiz à partir d'une banque de démonstration, correction
 * locale et historique des tentatives. La correction "IA" réelle, la
 * notation officielle et la persistance seront côté serveur.
 *
 * Endpoints futurs : POST /api/quizzes/generate, GET /api/quizzes/:id,
 * POST /api/quizzes/:id/attempts, GET /api/quizzes/:id/attempts.
 */

import type {
  Quiz,
  QuizAnswerInput,
  QuizAttemptInput,
  QuizAttemptResult,
  QuizGenerationInput,
  QuizQuestionResult,
  QuizServiceContract,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_QUIZ_BANK, DEMO_QUIZZES } from "./mocks/fixtures/quizzes";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const GENERATED_KEY = "quizzes";
const ATTEMPTS_KEY = "quiz-attempts";

function findQuestionBank(subject: string) {
  const key = Object.keys(DEMO_QUIZ_BANK).find((candidate) =>
    subject.toLowerCase().includes(candidate.toLowerCase()),
  );
  return DEMO_QUIZ_BANK[key ?? "Algorithmique"] ?? [];
}

class QuizService implements QuizServiceContract {
  private allQuizzes(): Quiz[] {
    const generated = demoStore.read<Quiz[]>(GENERATED_KEY, []);
    return [...generated, ...DEMO_QUIZZES];
  }

  async generate(input: QuizGenerationInput): Promise<Quiz> {
    await demoDelay(600);
    if (!input.subject?.trim()) {
      throw ApiError.of("VALIDATION", "Indiquez une matière pour générer un quiz.", { subject: "Champ obligatoire" });
    }
    if (input.questionCount < 1 || input.questionCount > 20) {
      throw ApiError.of("VALIDATION", "Le nombre de questions doit être compris entre 1 et 20.");
    }

    const bank = findQuestionBank(input.subject);
    const questions = bank.slice(0, Math.min(input.questionCount, bank.length)).map((question) => ({
      ...question,
      id: uid("q"),
    }));

    if (questions.length === 0) {
      throw ApiError.of("AI_UNAVAILABLE", "Aucune question de démonstration n'est disponible pour cette matière.");
    }

    const quiz: Quiz = {
      id: uid("quiz"),
      title: `${input.subject} — ${input.difficulty}`,
      subject: input.subject,
      faculty: input.faculty,
      difficulty: input.difficulty,
      mode: input.mode,
      questions,
      origin: "ai",
      createdAt: nowIso(),
      estimatedMinutes: Math.max(3, questions.length * 2),
    };

    demoStore.write(GENERATED_KEY, [quiz, ...demoStore.read<Quiz[]>(GENERATED_KEY, [])]);
    return quiz;
  }

  async getById(quizId: string): Promise<Quiz> {
    await demoDelay(80);
    const quiz = this.allQuizzes().find((item) => item.id === quizId);
    if (!quiz) throw ApiError.of("NOT_FOUND", "Quiz introuvable.");
    return quiz;
  }

  async submitAttempt(input: QuizAttemptInput): Promise<QuizAttemptResult> {
    await demoDelay(400);
    const quiz = await this.getById(input.quizId);

    const results: QuizQuestionResult[] = quiz.questions.map((question) => {
      const answer = input.answers.find((item) => item.questionId === question.id);
      const earned = this.gradeQuestion(question, answer);
      return {
        questionId: question.id,
        prompt: question.prompt,
        correct: earned === question.points,
        earnedPoints: earned,
        maxPoints: question.points,
        explanation: question.explanation,
      };
    });

    const score = results.reduce((total, item) => total + item.earnedPoints, 0);
    const total = results.reduce((sum, item) => sum + item.maxPoints, 0);
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    const result: QuizAttemptResult = {
      attemptId: uid("attempt"),
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      total,
      percent,
      passed: percent >= 60,
      durationSeconds: input.durationSeconds,
      completedAt: nowIso(),
      questions: results,
      creditsSpent: 0,
    };

    const attempts = demoStore.read<QuizAttemptResult[]>(ATTEMPTS_KEY, []);
    demoStore.write(ATTEMPTS_KEY, [result, ...attempts].slice(0, 30));
    return result;
  }

  async attempts(quizId?: string): Promise<QuizAttemptResult[]> {
    await demoDelay(70);
    const attempts = demoStore.read<QuizAttemptResult[]>(ATTEMPTS_KEY, []);
    return quizId ? attempts.filter((attempt) => attempt.quizId === quizId) : attempts;
  }

  /** Dernière tentative enregistrée (pour le tableau de bord). */
  lastAttempt(): QuizAttemptResult | null {
    const attempts = demoStore.read<QuizAttemptResult[]>(ATTEMPTS_KEY, []);
    return attempts[0] ?? null;
  }

  private gradeQuestion(
    question: Quiz["questions"][number],
    answer: QuizAnswerInput | undefined,
  ): number {
    if (!answer) return 0;
    if (question.type === "qcm") {
      return Number(answer.value) === question.correctOptionIndex ? question.points : 0;
    }
    if (question.type === "true_false") {
      return Boolean(answer.value) === Boolean(question.correctBoolean) ? question.points : 0;
    }
    const text = String(answer.value ?? "").toLowerCase();
    const keywords = question.keywords ?? [];
    if (keywords.length === 0) return 0;
    const matches = keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
    if (matches >= 2) return question.points;
    if (matches === 1) return Math.round(question.points * 0.5);
    return 0;
  }
}

export const quizService = new QuizService();
