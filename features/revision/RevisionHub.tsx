"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Difficulty, FacultyCode, LearningMode, Quiz } from "@/types";
import { FACULTIES } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { ProgressBar } from "@/components/ui/Progress";
import { useToast } from "@/components/ui/ToastProvider";
import { aiService } from "@/services/aiService";
import { quizService } from "@/services/quizService";
import { creditService } from "@/services/creditService";
import { DEMO_DOCUMENT_ANALYSIS, DEMO_SUMMARY } from "@/services/mocks/fixtures/quizzes";
import type { DocumentAnalysis } from "@/types";
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
 * Hub de révision : assistant Campusly AI (parcours guidé) + 5 modes
 * d'entraînement. Tout est simulé : analyse de document, génération de quiz et
 * correction sont locales.
 */
export function RevisionHub() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [view, setView] = useState<"wizard" | "practice">("wizard");

  // ── Assistant IA ────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("cours-algorithmique-ch3.pdf");
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
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

  const analysisCost = DEMO_DOCUMENT_ANALYSIS.creditsCost;

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await aiService.analyzeDocument({ fileName, faculty, subject });
      setAnalysis(result);
      creditService.spend("ai_analysis", `Analyse de document — ${fileName}`);
      setStep(3);
      toast("Analyse simulée terminée (25 crédits de démonstration débités).", "success");
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Analyse impossible.", "danger");
    } finally {
      setAnalyzing(false);
    }
  };

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
      setStep(5);
      toast("Quiz de démonstration généré.", "success");
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
        toast("Marathon adaptatif : 5 questions ciblées sur vos points faibles (démo).", "info");
      }
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Impossible de préparer l'entraînement.", "danger");
    } finally {
      setPracticeLoading(false);
    }
  };

  const wizardSteps = useMemo(
    () => ["Importer", "Analyse", "Configurer", "Générer", "Relire", "S'entraîner", "Exporter"],
    [],
  );

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title="Campusly AI & révision adaptative"
        subtitle="Importez un cours, générez des entraînements et suivez votre maîtrise — simulations locales."
        demo
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
            <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> 1. Assistant Campusly AI
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
              title="Parcours guidé"
              subtitle="7 étapes : import → analyse → configuration → génération → relecture → entraînement → export"
              icon="fa-solid fa-wand-magic-sparkles"
            />
            <ol style={{ display: "flex", gap: 6, listStyle: "none", flexWrap: "wrap", marginBottom: 18 }} aria-label="Étapes du parcours">
              {wizardSteps.map((label, index) => {
                const number = index + 1;
                const state = step > number ? "done" : step === number ? "current" : "todo";
                return (
                  <li
                    key={label}
                    aria-current={state === "current" ? "step" : undefined}
                    style={{
                      flex: "1 1 110px",
                      padding: "8px 10px",
                      borderRadius: "var(--r-md)",
                      border: `1px solid ${state === "current" ? "var(--brand-1)" : "var(--border)"}`,
                      background: state === "current" ? "rgba(21,101,192,0.08)" : "var(--surface)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: state === "todo" ? "var(--text-3)" : "var(--text-1)",
                    }}
                  >
                    {state === "done" ? <i className="fa-solid fa-check" aria-hidden="true" /> : `${number}.`} {label}
                  </li>
                );
              })}
            </ol>

            {step === 1 ? (
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  Étape 1 — Importer un support
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: 16 }}>
                  Sélectionnez un PDF (le fichier n&apos;est pas lu ni envoyé dans cette version de démonstration).
                </p>
                <label
                  htmlFor="ai-file"
                  style={{
                    display: "block",
                    border: "2px dashed var(--border-2)",
                    borderRadius: "var(--r-lg)",
                    padding: 28,
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--surface)",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: "1.8rem", color: "var(--brand-1)" }} aria-hidden="true">
                    <i className="fa-solid fa-file-arrow-up" />
                  </span>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-1)", marginTop: 8 }}>
                    {fileName || "Choisir un PDF"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>PDF uniquement · 20 Mo max (simulation)</div>
                </label>
                <input
                  id="ai-file"
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setFileName(file.name);
                  }}
                />

                <div className="row">
                  <Button variant="ghost" onClick={() => setFileName("cours-algorithmique-ch3.pdf")}>
                    Utiliser le document d&apos;exemple
                  </Button>
                  <Button variant="primary" onClick={() => setStep(2)} iconAfter="fa-solid fa-arrow-right">
                    Continuer
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  Étape 2 — Analyser le document
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: 16 }}>
                  Coût annoncé : <strong>{analysisCost} crédits de démonstration</strong>. Aucune IA n&apos;est
                  réellement sollicitée.
                </p>
                <div className="row">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button variant="primary" onClick={runAnalysis} disabled={analyzing}>
                    {analyzing ? "Analyse en cours…" : "Lancer l'analyse simulée"}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 3 && analysis ? (
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  Étape 3 — Résultat de l&apos;analyse
                </h3>
                <div className="grid-2" style={{ marginBottom: 16 }}>
                  <div className="card" style={{ padding: 16 }}>
                    <div style={{ fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>{analysis.title}</div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.55 }}>{analysis.summary}</p>
                    <div className="row" style={{ gap: 6 }}>
                      <Badge tone="brand">{analysis.detectedFaculty}</Badge>
                      <Badge tone="neutral">{analysis.pageCount} pages</Badge>
                      <Badge tone="accent">{analysis.estimatedLevel}</Badge>
                    </div>
                  </div>
                  <div className="card" style={{ padding: 16 }}>
                    <div style={{ fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>Concepts clés</div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {analysis.keyConcepts.map((concept) => (
                        <li key={concept.id} style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
                          <strong style={{ color: "var(--text-1)" }}>{concept.concept}</strong> — {concept.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h4 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 10 }}>
                  Configurer l&apos;entraînement
                </h4>
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
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    Retour
                  </Button>
                  <Button variant="primary" onClick={() => setStep(4)} iconAfter="fa-solid fa-arrow-right">
                    Continuer
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  Étape 4 — Générer les questions
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: 16 }}>
                  Les questions proviennent d&apos;une banque de démonstration (aucune génération IA réelle).
                </p>
                <div className="row">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    Retour
                  </Button>
                  <Button variant="primary" onClick={generate} disabled={generating}>
                    {generating ? "Génération…" : `Générer ${questionCount} questions`}
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 5 && generatedQuiz ? (
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
                  Étape 5 — Relire et personnaliser
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: 12 }}>
                  Vérifiez les énoncés avant de vous entraîner ({generatedQuiz.questions.length} questions).
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
                  <Button variant="ghost" onClick={() => setStep(4)}>
                    Régénérer
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPracticeQuiz(generatedQuiz);
                      setMode("qcm");
                      setView("practice");
                      setStep(6);
                    }}
                    iconAfter="fa-solid fa-arrow-right"
                  >
                    S&apos;entraîner
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>

          <p style={{ fontSize: "0.74rem", color: "var(--text-2)", textAlign: "center" }}>
            <i className="fa-solid fa-flask" aria-hidden="true" /> Parcours de démonstration — en production, chaque
            étape appellera le Worker IA et consommera de vrais crédits.
          </p>
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
              action={<DemoBadge label="Banque de démonstration" />}
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
                Préparation de la session de démonstration…
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
              description="Choisissez un mode, ajustez la matière puis lancez une session d'entraînement de démonstration."
              action={<Button variant="primary" onClick={() => startPractice(mode)}>Démarrer maintenant</Button>}
            />
          ) : null}

          {mode === "marathon" ? (
            <Card>
              <CardHeader title="Progression du marathon" subtitle="Palier de maîtrise simulé" icon="fa-solid fa-bolt" />
              <ProgressBar value={practiceQuiz ? 40 : 0} tone="accent" label="Maîtrise estimée sur les notions ciblées" />
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
