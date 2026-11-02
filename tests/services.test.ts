import { describe, expect, it, beforeEach } from "vitest";
import { createExamService, examService } from "@/services/examService";
import { DEMO_EXAMS } from "@/services/mocks/fixtures/exams";
import { quizService } from "@/services/quizService";
import { creditService } from "@/services/creditService";
import { paymentService } from "@/services/paymentService";
import { compositionService } from "@/services/compositionService";
import { demoStore } from "@/services/mocks/store";
import { ApiError } from "@/services/api/client";

/**
 * Tests de la couche services (contrats frontend).
 * Ces tests vérifient que les simulations respectent les règles annoncées :
 * filtrage cohérent, correction locale, débit de crédits, paiement JAMAIS réel.
 */
beforeEach(() => {
  demoStore.resetAll();
});

describe("examService (catalogue de l'application)", () => {
  it("ne sert aucune épreuve fictive", async () => {
    const all = await examService.list({ pageSize: 50 });
    expect(all.total).toBe(0);
    expect(all.items).toHaveLength(0);
    expect(await examService.history()).toEqual([]);
    expect(await examService.contributions()).toEqual([]);
  });

  it("refuse une épreuve inexistante avec une erreur NOT_FOUND", async () => {
    await expect(examService.getById("inconnue")).rejects.toBeInstanceOf(ApiError);
  });

  it("n'invente ni URL de téléchargement ni contribution enregistrée", async () => {
    await expect(examService.requestDownload("epr-001")).rejects.toBeInstanceOf(ApiError);
    await expect(
      examService.submitContribution({
        title: "Sujet",
        subject: "Algorithmique",
        faculty: "FAST",
        department: "Informatique",
        level: "L2",
        semester: "S1",
        academicYear: "2024-2025",
        type: "Examen",
        fileName: "sujet.pdf",
        fileSize: 1024,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("expose des facettes issues de la nomenclature UAC quand le catalogue est vide", async () => {
    const facets = await examService.facets();
    expect(facets.faculties).toContain("FAST");
    expect(facets.levels).toContain("L2");
    expect(facets.types).toContain("Examen");
    expect(facets.academicYears.length).toBeGreaterThan(0);
  });
});

/**
 * Le moteur de recherche et de filtrage reste testé avec des documents
 * injectés : il sera branché tel quel sur le backend, sans réécriture de
 * l'interface.
 */
describe("examService (moteur de recherche)", () => {
  const service = createExamService(DEMO_EXAMS);

  it("filtre par faculté, recherche et type", async () => {
    const all = await service.list({ pageSize: 50 });
    expect(all.total).toBeGreaterThan(0);

    const fast = await service.list({ faculty: "FAST", pageSize: 50 });
    expect(fast.items.every((exam) => exam.faculty === "FAST")).toBe(true);

    const search = await service.list({ search: "algorithm", pageSize: 50 });
    expect(search.items.length).toBeGreaterThan(0);
    expect(
      search.items.every((exam) =>
        `${exam.title} ${exam.subject} ${exam.tags.join(" ")}`.toLowerCase().includes("algorithm"),
      ),
    ).toBe(true);

    const corrections = await service.list({ type: "Correction", pageSize: 50 });
    expect(corrections.items.every((exam) => exam.type === "Correction")).toBe(true);
  });

  it("trie par titre et pagine sans doublon", async () => {
    const sorted = await service.list({ sortBy: "title", pageSize: 50 });
    const titles = sorted.items.map((exam) => exam.title);
    expect([...titles].sort((a, b) => a.localeCompare(b, "fr"))).toEqual(titles);

    const first = await service.list({ pageSize: 3, page: 1 });
    const second = await service.list({ pageSize: 3, page: 2 });
    const ids = new Set([...first.items, ...second.items].map((exam) => exam.id));
    expect(ids.size).toBe(first.items.length + second.items.length);
  });

  it("bascule un favori de façon idempotente", async () => {
    const initial = await service.favorites();
    expect(initial).toHaveLength(0);
    const [exam] = (await service.list({ pageSize: 1 })).items;
    expect(exam).toBeDefined();

    expect((await service.toggleFavorite(exam!.id)).favorited).toBe(true);
    expect(service.isFavorite(exam!.id)).toBe(true);
    expect(await service.favorites()).toHaveLength(1);

    expect((await service.toggleFavorite(exam!.id)).favorited).toBe(false);
    expect(await service.favorites()).toHaveLength(0);
  });
});

describe("quizService", () => {
  it("génère un quiz conforme à la demande", async () => {
    const quiz = await quizService.generate({
      source: "topic",
      topic: "Algorithmique",
      subject: "Algorithmique",
      faculty: "FAST",
      difficulty: "Intermédiaire",
      questionCount: 3,
      mode: "qcm",
    });
    expect(quiz.questions.length).toBeGreaterThan(0);
    expect(quiz.questions.length).toBeLessThanOrEqual(3);
    expect(quiz.mode).toBe("qcm");
  });

  it("corrige une copie localement et renvoie un score borné", async () => {
    const quiz = await quizService.generate({
      source: "topic",
      topic: "Algorithmique",
      subject: "Algorithmique",
      faculty: "FAST",
      difficulty: "Débutant",
      questionCount: 4,
      mode: "qcm",
    });

    const answers = quiz.questions.map((question) => ({
      questionId: question.id,
      value: question.type === "qcm" ? (question.correctOptionIndex ?? 0) : question.type === "true_false" ? true : "réponse",
    }));

    const result = await quizService.submitAttempt({ quizId: quiz.id, answers, durationSeconds: 90 });
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(result.total);
    expect(result.percent).toBeGreaterThanOrEqual(0);
    expect(result.percent).toBeLessThanOrEqual(100);
    expect(result.quizId).toBe(quiz.id);
  });
});

describe("creditService", () => {
  it("débite un solde fictif et l'inscrit dans l'historique", async () => {
    const before = await creditService.getBalance();
    const ok = creditService.spend("quiz_generation", "Quiz de test");
    expect(ok).toBe(true);
    const after = await creditService.getBalance();
    expect(after.balance).toBe(before.balance - 10);

    const history = await creditService.history();
    expect(history.items[0].label).toBe("Quiz de test");
    expect(history.items[0].amount).toBe(-10);
  });

  it("refuse un débit supérieur au solde disponible", async () => {
    const balance = await creditService.getBalance();
    // On vide volontairement le solde de démonstration.
    for (let i = 0; i < Math.ceil(balance.balance / 10); i += 1) {
      creditService.spend("quiz_generation", "Vidage");
    }
    expect(creditService.spend("ai_analysis", "Analyse impossible")).toBe(false);
  });

  it("expose les formules d'abonnement annoncées par la landing", async () => {
    const plans = await creditService.plans();
    expect(plans.map((plan) => plan.priceXof)).toEqual([500, 1500, 3500]);
  });
});

describe("paymentService", () => {
  it("crée une intention marquée simulation, sans URL de paiement", async () => {
    const packs = await creditService.packs();
    const intent = await paymentService.createIntent({
      packId: packs[0].id,
      provider: "mtn_momo",
      phoneNumber: "+22997000000",
      amountXof: packs[0].priceXof,
    });

    expect(intent.status).toBe("pending");
    expect(intent.checkoutUrl).toBeUndefined();
    expect(JSON.stringify(intent)).not.toMatch(/https?:\/\//);
  });

  it("rejette un numéro Mobile Money invalide", async () => {
    const packs = await creditService.packs();
    await expect(
      paymentService.createIntent({ packId: packs[0].id, provider: "mtn_momo", phoneNumber: "12", amountXof: 500 }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("compositionService", () => {
  it("trouve une composition par son code (insensible à la casse)", async () => {
    const composition = await compositionService.findByCode(" algo1 ");
    expect(composition.code).toBe("ALGO1");
  });

  it("refuse un code inconnu", async () => {
    await expect(compositionService.findByCode("XXXXXX")).rejects.toBeInstanceOf(ApiError);
  });

  it("remet une copie locale non validée officiellement", async () => {
    const composition = await compositionService.findByCode("ALGO1");
    const copy = await compositionService.submit({
      compositionId: composition.id,
      answers: [],
      proctorEvents: [],
      durationSeconds: 120,
    });
    expect(copy.validation).toBe("pending_review");
    expect(copy.scoreOn20).toBeGreaterThanOrEqual(0);
    expect(copy.scoreOn20).toBeLessThanOrEqual(20);
  });
});
