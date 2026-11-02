"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Difficulty, FacultyCode, LearningMode, Quiz } from "@/types";
import { FACULTIES } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { quizService } from "@/services/quizService";
import { DEMO_SUMMARY } from "@/services/mocks/fixtures/quizzes";
import { QuizRunner } from "./QuizRunner";

const MODES: Array<{ id: LearningMode; label: string; icon: string; description: string }> = [
  { id: "qcm", label: "Mode 1 · QCM", icon: "fa-solid fa-list-check", description: "Questions à choix multiples avec correction immédiate." },
  { id: "open", label: "Mode 2 · Q / R", icon: "fa-solid fa-pen", description: "Questions ouvertes corrigées par mots-clés." },
  { id: "true_false", label: "Mode 3 · Vrai / Faux", icon: "fa-solid fa-square-check", description: "Affirmations à trancher rapidement." },
  { id: "summary", label: "Mode 4 · Résumé", icon: "fa-solid fa-file-lines", description: "Synthèse pédagogique structurée du chapitre." },
  { id: "marathon", label: "Mode 5 · Marathon adaptatif", icon: "fa-solid fa-bolt", description: "Enchaînement progressif jusqu'au palier de maîtrise." },
];

const SUBJECTS = ["Algorithmique", "Analyse", "Bases de données"] as const;

/**
 * Hub de révision.
 * Les entraînements sont réellement jouables : les énoncés proviennent d'une
 * banque d'exercices écrite pour l'application, la correction est locale et
 * assumée comme non officielle. Aucun document n'est analysé, aucune IA n'est
 * interrogée et aucun crédit n'est débité — l'analyse de cours est annoncée
 * comme indisponible plutôt que simulée.
 */
export function RevisionHub() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [view, setView] = useState<"wizard" | "practice">("wizard");

  // ── Parcours guidé ──────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState<string>(searchParams.get("subject") ?? "Algorithmique");
  const [faculty, setFaculty] = useState<FacultyCode>("FAST");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermédiaire");
  const [questionCount, setQuestionCount] = useState(4);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [generating, setGenerating] = useState(false);

  // ── Entraînement ────────────────────────────────────────────
  const [mode, setMode] = useState<LearningMode>("qcm");
  const [practiceQuiz, setPracticeQuiz] = useState<Quiz | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const quiz = await quizService.generate({
        source: "topic",
        topic: subject,
        faculty,
        subject,
        difficulty,
        questionCount,
        mode: "qcm",
      });
      setGeneratedQuiz(quiz);
      setStep(3);
      toast(`${quiz.questions.length} questions prêtes à être relues.`, "success");
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Génération impossible.", "danger");
    } finally {
      setGenerating(false);
    }
  };

  const startPractice = async (selectedMode: LearningMode) => {
    setMode(selectedMode);
    if (selectedMode === "summary") return;
    setPracticeLoading(true);
    setPracticeQuiz(null);
    try {
      const quiz = await quizService.generate({
        source: "topic",
        topic: subject,
        faculty,
        subject,
        difficulty,
        questionCount: selectedMode === "marathon" ? 5 : questionCount,
        mode: selectedMode,
      });
      setPracticeQuiz(quiz);
      if (selectedMode === "marathon") {
        toast("Marathon adaptatif : 5 questions enchaînées sans pause.", "info");
      }
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Impossible de préparer l'entraînement.", "danger");
    } finally {
      setPracticeLoading(false);
    }
  };

  const wizardSteps = ["Choisir", "Préparer", "Relire"] as const;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title="Campusly AI & révision adaptative"
        subtitle="Entraînez-vous sur une banque d'exercices UAC, avec correction immédiate et suivi de vos tentatives."
        actions={<Badge tone="brand" icon="fa-solid fa-brain">Moteur pédagogique</Badge>}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 16,
        }}
      >
        <div role="tablist" aria-label="Sections de révision" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            role="tab"
            aria-selected={view === "wizard"}
            className={`learning-mode-tab ${view === "wizard" ? "active" : ""}`}
            onClick={() => setView("wizard")}
          >
            <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> 1. Parcours guidé
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "practice"}
            className={`learning-mode-tab ${view === "practice" ? "active" : ""}`}
            onClick={() => setView("practice")}
          >
            <i className="fa-solid fa-layer-group" aria-hidden="true" /> 2. Les 5 modes d&apos;entraînement
          </button>
        </div>
        <Button variant="accent" size="sm" icon="fa-solid fa-bolt" onClick={() => { setView("practice"); startPractice("marathon"); }}>
          Lancer le Marathon adaptatif
        </Button>
      </div>

      {view === "wizard" ? (
        <div className="stack" style={{ gap: 20 }}>
          <Card>
            <CardHeader
              title="Préparer un entraînement"
              subtitle="Trois étapes : choisir, préparer la série, relire avant de commencer."
              icon="fa-solid fa-wand-magic-sparkles"
            />
            <ol className="learning-steps" aria-label="Étapes du parcours">
              {wizardSteps.map((label, index) => {
                const number = index + 1;
                const state = step > number ? "done" : step === number ? "current" : "todo";
                return (
                  <li key={label} aria-current={state === "current" ? "step" : undefined} className={`learning-step ${state}`}>
                    {state === "done" ? <i className="fa-solid fa-check" aria-hidden="true" /> : `${number}.`} {label}
                  </li>
                );
              })}
            </ol>

            {step === 1 ? (
              <div>
                <h3 className="revision-step-title">Étape 1 — Choisir la matière</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="ai-subject">
                      Matière
                    </label>
                    <input id="ai-subject" className="form-input" value={subject} onChange={(event) => setSubject(event.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="ai-faculty">
                      Faculté
                    </label>
                    <select id="ai-faculty" className="form-select" value={faculty} onChange={(event) => setFaculty(event.target.value as FacultyCode)}>
                      {FACULTIES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="ai-difficulty">
                      Difficulté
                    </label>
                    <select id="ai-difficulty" className="form-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}>
                      {["Débutant", "Intermédiaire", "Avancé"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="ai-count">
                      Nombre de questions
                    </label>
                    <input
                      id="ai-count"
                      className="form-input"
                      type="number"
                      min={1}
                      max={10}
                      value={questionCount}
                      onChange={(event) => setQuestionCount(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
                    />
                  </div>
                </div>

                <div className="row" style={{ marginTop: 16 }}>
                  <Button variant="primary" onClick={() => setStep(2)} iconAfter="fa-solid fa-arrow-right">
                    Continuer
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h3 className="revision-step-title">Étape 2 — Préparer la série</h3>
                <p className="revision-step-text">
                  Les questions sont tirées d&apos;une banque d&apos;exercices écrite pour Campusly sur la matière
                  choisie. Aucun document n&apos;est lu et aucun modèle d&apos;IA n&apos;est appelé.
                </p>
                <div className="row">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button variant="primary" onClick={generate} disabled={generating}>
                    {generating ? "Préparation…" : `Préparer ${questionCount} questions`}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 3 && generatedQuiz ? (
              <div>
                <h3 className="revision-step-title">Étape 3 — Relire la série</h3>
                <p className="revision-step-text">
                  {generatedQuiz.questions.length} questions · {subject} · {difficulty}
                </p>
                <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {generatedQuiz.questions.map((question, index) => (
                    <li key={question.id} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: "var(--r-md)", background: "var(--surface)" }}>
                      <div className="row-between">
                        <strong style={{ fontSize: "0.84rem", color: "var(--text-1)" }}>
                          {index + 1}. {question.prompt}
                        </strong>
                        <Badge tone="neutral">{question.type === "qcm" ? "QCM" : question.type === "true_false" ? "Vrai/Faux" : "Ouverte"}</Badge>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="row">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    Refaire la série
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPracticeQuiz(generatedQuiz);
                      setMode("qcm");
                      setStep(3);
                      setView("practice");
                    }}
                    iconAfter="fa-solid fa-arrow-right"
                  >
                    S&apos;entraîner
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="Analyse automatique de vos cours"
              subtitle="Disponible prochainement — service IA non connecté"
              icon="fa-solid fa-file-circle-question"
            />
            <p className="revision-step-text" style={{ marginBottom: 0 }}>
              L&apos;analyse d&apos;un PDF importé demande le service IA, qui n&apos;est pas encore ouvert. Aucun
              document n&apos;est lu et aucun crédit n&apos;est débité. En attendant, entraînez-vous sur la banque
              d&apos;exercices : la correction restera locale et signalée comme non officielle.
            </p>
          </Card>
        </div>
      ) : null}

      {view === "practice" ? (
        <div className="stack" style={{ gap: 20 }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }} role="tablist" aria-label="Modes d'apprentissage">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                className={`learning-mode-tab ${mode === item.id ? "active" : ""}`}
                onClick={() => startPractice(item.id)}
                style={{ whiteSpace: "nowrap" }}
              >
                <i className={item.icon} aria-hidden="true" /> {item.label}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader
              title="Configurer l'entraînement"
              subtitle="Sujet et difficulté utilisés pour construire la session"
              icon="fa-solid fa-sliders"
             
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="practice-subject">
                  Matière
                </label>
                <select id="practice-subject" className="form-select" value={subject} onChange={(event) => setSubject(event.target.value)}>
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="practice-difficulty">
                  Difficulté
                </label>
                <select id="practice-difficulty" className="form-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}>
                  {["Débutant", "Intermédiaire", "Avancé"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="practice-count">
                  Questions
                </label>
                <input
                  id="practice-count"
                  className="form-input"
                  type="number"
                  min={1}
                  max={10}
                  value={questionCount}
                  onChange={(event) => setQuestionCount(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
                />
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => startPractice(mode)}>
              <i className="fa-solid fa-play" aria-hidden="true" /> Démarrer la session
            </Button>
          </Card>

          {practiceLoading ? (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-2)", fontSize: "0.9rem" }}>
                <span className="loader-spinner" style={{ width: 22, height: 22 }} aria-hidden="true" />
                Préparation de la session…
              </div>
            </Card>
          ) : null}

          {mode === "summary" ? (
            <Card>
              <CardHeader title={DEMO_SUMMARY.title} subtitle="Mode 4 — Résumé pédagogique" icon="fa-solid fa-file-lines" />
              <div className="stack" style={{ gap: 14 }}>
                {DEMO_SUMMARY.sections.map((section) => (
                  <div key={section.heading}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 4 }}>{section.heading}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{section.body}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {mode !== "summary" && !practiceLoading && practiceQuiz ? (
            <QuizRunner key={practiceQuiz.id} quiz={practiceQuiz} onExit={() => setPracticeQuiz(null)} />
          ) : null}

          {mode !== "summary" && !practiceLoading && !practiceQuiz ? (
            <EmptyState
              icon="fa-solid fa-layer-group"
              title="Aucune session en cours"
              description="Choisissez un mode, ajustez la matière puis lancez une série d'exercices."
              action={<Button variant="primary" onClick={() => startPractice(mode)}>Démarrer maintenant</Button>}
            />
          ) : null}

          {mode === "marathon" ? (
            <Card>
              <CardHeader title="Marathon adaptatif" subtitle="Cinq questions enchaînées" icon="fa-solid fa-bolt" />
              <p className="revision-step-text" style={{ marginBottom: 0 }}>
                La maîtrise par notion sera calculée à partir de vos tentatives réelles, une fois le suivi de
                progression branché. D&apos;ici là, aucun palier n&apos;est estimé.
              </p>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
