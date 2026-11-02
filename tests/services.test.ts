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
  it("démarre sans solde et sans mouvement", async () => {
    const balance = await creditService.getBalance();
    expect(balance.balance).toBe(0);
    expect(balance.unlimited).toBe(false);

    const history = await creditService.history();
    expect(history.items).toEqual([]);
  });

  it("ne propose ni pack ni formule tant que le paiement est fermé", async () => {
    expect(await creditService.packs()).toEqual([]);
    expect(await creditService.plans()).toEqual([]);
  });
});

describe("paymentService", () => {
  it("refuse de créer une intention : le paiement n'est pas ouvert", async () => {
    const refusal = paymentService.createIntent({
      packId: "pack-revision",
      provider: "mtn_momo",
      phoneNumber: "+22997000000",
      amountXof: 1000,
    });

    await expect(refusal).rejects.toBeInstanceOf(ApiError);
    await expect(refusal).rejects.toMatchObject({ code: "BACKEND_UNAVAILABLE" });
  });

  it("rejette un numéro Mobile Money invalide avant tout traitement", async () => {
    await expect(
      paymentService.createIntent({ packId: "pack-revision", provider: "mtn_momo", phoneNumber: "12", amountXof: 500 }),
    ).rejects.toMatchObject({ code: "VALIDATION" });
  });

  it("ne retourne aucun reçu", async () => {
    const receipts = await paymentService.receipts();
    expect(receipts.items).toEqual([]);
    expect(receipts.total).toBe(0);
  });
});

describe("compositionService", () => {
  it("n'ouvre aucune composition : la saisie du code est refusée", async () => {
    await expect(compositionService.findByCode("ALGO1")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("refuse un code inconnu", async () => {
    await expect(compositionService.findByCode("XXXXXX")).rejects.toBeInstanceOf(ApiError);
  });

  it("ne renvoie aucune copie", async () => {
    expect(await compositionService.copies()).toEqual([]);
  });
});
