"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Quiz, QuizAnswerInput, QuizAttemptResult } from "@/types";
import { quizService } from "@/services/quizService";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/ToastProvider";

type AnswerValue = number | boolean | string;

/**
 * Moteur de quiz des 5 modes d'apprentissage.
 * Correction locale de démonstration ; l'énoncé indique clairement que la note
 * n'est pas officielle.
 */
export function QuizRunner({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const { toast } = useToast();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const question = quiz.questions[index];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  const answerPayload = useMemo<QuizAnswerInput[]>(
    () =>
      Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
    [answers],
  );

  const submit = async () => {
    setSubmitting(true);
    try {
      const outcome = await quizService.submitAttempt({
        quizId: quiz.id,
        answers: answerPayload,
        durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      setResult(outcome);
      toast(`Quiz terminé : ${outcome.score}/${outcome.total}`, outcome.passed ? "success" : "info");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return <QuizResult result={result} onExit={onExit} onRetry={() => {
      setResult(null);
      setAnswers({});
      setIndex(0);
      startedAt.current = Date.now();
    }} />;
  }

  if (!question) {
    return (
      <Card>
        <p style={{ color: "var(--text-2)" }}>Ce quiz ne contient aucune question.</p>
        <Button variant="ghost" onClick={onExit}>
          Retour
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-1)", margin: 0 }}>{quiz.title}</h2>
          <p style={{ fontSize: "0.76rem", color: "var(--text-2)", margin: 0 }}>
            {quiz.subject} · {quiz.difficulty} · {quiz.questions.length} questions
          </p>
        </div>
        <Badge tone="neutral" icon="fa-regular fa-clock">
          {quiz.estimatedMinutes} min estimées
        </Badge>
      </div>

      <ProgressBar value={((index + 1) / quiz.questions.length) * 100} label={`Question ${index + 1} sur ${quiz.questions.length}`} />

      <div style={{ marginTop: 18, marginBottom: 16 }}>
        <p
          ref={headingRef}
          tabIndex={-1}
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.5, marginBottom: 14 }}
        >
          {question.prompt}
        </p>

        {question.type === "qcm" && question.options ? (
          <div role="radiogroup" aria-label="Choix de réponse" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: "var(--r-md)",
                    border: `1.5px solid ${selected ? "var(--brand-1)" : "var(--border)"}`,
                    background: selected ? "rgba(21,101,192,0.08)" : "var(--surface)",
                    color: "var(--text-1)",
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: `2px solid ${selected ? "var(--brand-1)" : "var(--border-2)"}`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: selected ? "var(--brand-1)" : "var(--text-2)",
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {question.type === "true_false" ? (
          <div role="radiogroup" aria-label="Vrai ou faux" style={{ display: "flex", gap: 12 }}>
            {[true, false].map((value) => {
              const selected = answers[question.id] === value;
              return (
                <button
                  key={String(value)}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: "var(--r-md)",
                    border: `1.5px solid ${selected ? "var(--brand-1)" : "var(--border)"}`,
                    background: selected ? "rgba(21,101,192,0.08)" : "var(--surface)",
                    color: "var(--text-1)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <i className={value ? "fa-solid fa-check" : "fa-solid fa-xmark"} aria-hidden="true" />{" "}
                  {value ? "Vrai" : "Faux"}
                </button>
              );
            })}
          </div>
        ) : null}

        {question.type === "open" ? (
          <div>
            <label className="form-label" htmlFor={`answer-${question.id}`}>
              Votre réponse
            </label>
            <textarea
              id={`answer-${question.id}`}
              className="form-textarea"
              value={typeof answers[question.id] === "string" ? (answers[question.id] as string) : ""}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
              placeholder="Rédigez votre réponse en quelques lignes…"
            />
            <p className="form-hint">
              Correction par mots-clés en mode démonstration ({question.keywords?.length ?? 0} attendus).
            </p>
          </div>
        ) : null}
      </div>

      <div className="row-between">
        <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>
          Précédent
        </Button>
        <span style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>
          {answeredCount}/{quiz.questions.length} réponses
        </span>
        {index < quiz.questions.length - 1 ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIndex((value) => Math.min(quiz.questions.length - 1, value + 1))}
            iconAfter="fa-solid fa-arrow-right"
          >
            Suivant
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={submit} disabled={submitting || answeredCount === 0}>
            {submitting ? "Correction…" : "Terminer"}
          </Button>
        )}
      </div>
    </Card>
  );
}

function QuizResult({
  result,
  onExit,
  onRetry,
}: {
  result: QuizAttemptResult;
  onExit: () => void;
  onRetry: () => void;
}) {
  return (
    <Card>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-1)", margin: 0 }}>Résultat du quiz</h2>
        <Badge tone={result.passed ? "success" : "danger"}>{result.passed ? "Objectif atteint" : "À consolider"}</Badge>
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--text-2)", marginBottom: 16 }}>
        {result.quizTitle} · correction locale de démonstration (non officielle)
      </p>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-icon blue" aria-hidden="true">
            <i className="fa-solid fa-percent" />
          </div>
          <div>
            <div className="stat-card-value">{result.percent}%</div>
            <div className="stat-card-label">Score global</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green" aria-hidden="true">
            <i className="fa-solid fa-star" />
          </div>
          <div>
            <div className="stat-card-value">
              {result.score}/{result.total}
            </div>
            <div className="stat-card-label">Points obtenus</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon orange" aria-hidden="true">
            <i className="fa-regular fa-clock" />
          </div>
          <div>
            <div className="stat-card-value">{Math.round(result.durationSeconds / 60)} min</div>
            <div className="stat-card-label">Temps passé</div>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {result.questions.map((question, index) => (
          <li
            key={question.questionId}
            style={{
              padding: 12,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              background: question.correct ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.05)",
            }}
          >
            <div className="row-between" style={{ marginBottom: 4 }}>
              <strong style={{ fontSize: "0.84rem", color: "var(--text-1)" }}>
                {index + 1}. {question.prompt}
              </strong>
              <Badge tone={question.correct ? "success" : "danger"}>
                {question.earnedPoints}/{question.maxPoints}
              </Badge>
            </div>
            {question.explanation ? (
              <p style={{ fontSize: "0.78rem", color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>
                {question.explanation}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="row" style={{ marginTop: 18 }}>
        <Button variant="primary" onClick={onRetry} icon="fa-solid fa-rotate-right">
          Refaire le quiz
        </Button>
        <Button variant="ghost" onClick={onExit}>
          Retour aux modes
        </Button>
      </div>
    </Card>
  );
}
