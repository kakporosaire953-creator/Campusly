/**
 * compositionService — SIMULATION frontend
 * ---------------------------------------------------------------------------
 * La correction est effectuée localement à partir des corrigés de
 * démonstration. En production, la soumission d'une copie est un acte serveur
 * horodaté, la note est calculée côté Worker et la validation relève de
 * l'enseignant.
 *
 * Endpoints futurs : GET /api/compositions, GET /api/compositions/:code,
 * POST /api/compositions/:id/attempts, GET /api/compositions/:id/copies.
 */

import type {
  Composition,
  CompositionAttemptInput,
  CompositionCopy,
  CompositionQuestionResult,
  CompositionServiceContract,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_COMPOSITIONS, DEMO_COPIES } from "./mocks/fixtures/compositions";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const COPIES_KEY = "composition-copies";

class CompositionService implements CompositionServiceContract {
  async list(): Promise<Composition[]> {
    await demoDelay();
    return DEMO_COMPOSITIONS;
  }

  async getById(id: string): Promise<Composition> {
    await demoDelay(90);
    const composition = DEMO_COMPOSITIONS.find((item) => item.id === id);
    if (!composition) throw ApiError.of("NOT_FOUND", "Composition introuvable.");
    return composition;
  }

  async findByCode(code: string): Promise<Composition> {
    await demoDelay(240);
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      throw ApiError.of("VALIDATION", "Saisissez le code fourni par votre enseignant.", { code: "Champ obligatoire" });
    }
    const composition = DEMO_COMPOSITIONS.find((item) => item.code.toUpperCase() === normalized);
    if (!composition) {
      throw ApiError.of("NOT_FOUND", "Code introuvable. Vérifiez le code fourni par votre professeur.");
    }
    return composition;
  }

  async submit(input: CompositionAttemptInput): Promise<CompositionCopy> {
    await demoDelay(650);
    const composition = await this.getById(input.compositionId);

    const perQuestion = Math.round((composition.totalPoints / Math.max(1, composition.questions.length)) * 10) / 10;

    const questions: CompositionQuestionResult[] = composition.questions.map((question) => {
      const answer = input.answers.find((item) => item.questionId === question.id);
      let correct = false;
      let earned = 0;

      if (question.type === "qcm") {
        correct = Number(answer?.value) === question.correctOptionIndex;
        earned = correct ? perQuestion : 0;
      } else if (question.type === "true_false") {
        correct = Boolean(answer?.value) === Boolean(question.correctBoolean);
        earned = correct ? perQuestion : 0;
      } else {
        const text = String(answer?.value ?? "").toLowerCase();
        const keywords = question.keywords ?? [];
        const matches = keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
        correct = matches >= 2;
        earned = correct ? perQuestion : matches > 0 ? Math.round(perQuestion * 0.5 * 10) / 10 : 0;
      }

      return {
        questionId: question.id,
        prompt: question.prompt,
        userAnswer: (answer?.value ?? null) as string | number | boolean | null,
        correct,
        earnedPoints: Math.round(earned * 10) / 10,
        maxPoints: perQuestion,
        explanation: question.explanation ?? "Consultez le cours pour la démonstration complète.",
      };
    });

    const scoreOn20 = Math.min(20, Math.round(questions.reduce((sum, item) => sum + item.earnedPoints, 0) * 10) / 10);

    const copy: CompositionCopy = {
      id: uid("copy"),
      compositionId: composition.id,
      compositionTitle: composition.title,
      studentName: "Rosaire Kakpo",
      matricule: "23180001",
      submittedAt: nowIso(),
      scoreOn20,
      passed: scoreOn20 >= composition.passMark,
      durationSeconds: input.durationSeconds,
      proctorEventsCount: input.proctorEvents.length,
      // La correction automatique n'est jamais une validation officielle.
      validation: "pending_review",
      feedback:
        scoreOn20 >= composition.passMark
          ? "Copie transmise. La note affichée est une estimation locale de démonstration, en attente de validation par l'enseignant."
          : "Copie transmise. Des révisions ciblées sont recommandées ; la note sera confirmée par l'enseignant.",
      questions,
    };

    const copies = demoStore.read<CompositionCopy[]>(COPIES_KEY, []);
    demoStore.write(COPIES_KEY, [copy, ...copies].slice(0, 20));
    return copy;
  }

  async copies(compositionId?: string): Promise<CompositionCopy[]> {
    await demoDelay(90);
    const copies = [...demoStore.read<CompositionCopy[]>(COPIES_KEY, []), ...DEMO_COPIES];
    return compositionId ? copies.filter((copy) => copy.compositionId === compositionId) : copies;
  }
}

export const compositionService = new CompositionService();
