"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Composition, CompositionCopy, ProctorEvent, ProctorEventType, QuizAnswerInput } from "@/types";
import { compositionService } from "@/services/compositionService";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LogoCap } from "@/components/layout/SiteHeader";
import { Loader, ErrorState } from "@/components/ui/States";

type Phase = "loading" | "error" | "waiting" | "exam" | "done";

const EVENT_LABEL: Record<ProctorEventType, string> = {
  tab_blur: "Sortie de l'onglet détectée",
  tab_focus: "Retour sur l'onglet",
  fullscreen_exit: "Sortie du plein écran",
  copy_attempt: "Tentative de copie",
  network_offline: "Coupure réseau",
  resume: "Reprise de la composition",
};

const RULES = [
  "Lisez attentivement chaque question avant de répondre.",
  "Une seule tentative est autorisée : toute soumission est définitive.",
  "Aucun document ni appareil externe autorisé.",
  "Le chronomètre est strict : la copie est remise automatiquement à zéro.",
];

/**
 * Salle d'examen (`/examen/[code]`).
 * Chronomètre et validation réels côté navigateur ; la remise de copie est
 * LOCALE. Le journal d'intégrité (proctoring) est une simulation : aucun
 * média n'est capturé et rien ne quitte l'appareil.
 */
export function ExamRoom({ code }: { code: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [composition, setComposition] = useState<Composition | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswerInput["value"]>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [finishOpen, setFinishOpen] = useState(false);
  const [copy, setCopy] = useState<CompositionCopy | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startedAt = useRef<number>(0);
  const submitted = useRef(false);

  const load = useCallback(async () => {
    setPhase("loading");
    setLoadError(null);
    try {
      const found = await compositionService.findByCode(code);
      setComposition(found);
      setRemaining(found.durationMinutes * 60);
      setPhase("waiting");
    } catch (cause) {
      setLoadError(cause instanceof Error ? cause.message : "Composition introuvable.");
      setPhase("error");
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  const logEvent = useCallback((type: ProctorEventType) => {
    setEvents((current) => [
      ...current,
      { id: `${type}-${Date.now()}`, type, occurredAt: new Date().toISOString() },
    ]);
  }, []);

  const submit = useCallback(
    async (auto = false) => {
      if (!composition || submitted.current) return;
      submitted.current = true;
      setSubmitting(true);
      try {
        const payload: QuizAnswerInput[] = composition.questions
          .filter((question) => answers[question.id] !== undefined)
          .map((question) => ({ questionId: question.id, value: answers[question.id] as QuizAnswerInput["value"] }));
        const result = await compositionService.submit({
          compositionId: composition.id,
          answers: payload,
          proctorEvents: events,
          durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        });
        setCopy(result);
        setPhase("done");
        setFinishOpen(false);
        if (auto) logEvent("resume");
      } catch {
        submitted.current = false;
        setLoadError("La remise simulée a échoué. Réessayez.");
      } finally {
        setSubmitting(false);
      }
    },
    [answers, composition, events, logEvent],
  );

  // Chronomètre de composition
  useEffect(() => {
    if (phase !== "exam") return;
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          void submit(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, submit]);

  // Journal d'intégrité (simulation) : détection de sortie d'onglet + copie
  useEffect(() => {
    if (phase !== "exam") return;
    const onVisibility = () => logEvent(document.hidden ? "tab_blur" : "tab_focus");
    const onCopy = () => logEvent("copy_attempt");
    const onOffline = () => logEvent("network_offline");
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("copy", onCopy);
    window.addEventListener("offline", onOffline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("offline", onOffline);
    };
  }, [phase, logEvent]);

  const startExam = () => {
    startedAt.current = Date.now();
    setPhase("exam");
    setStep(4);
  };

  const palette = useMemo(() => (composition ? composition.questions : []), [composition]);
  const question = palette[index];
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const urgent = remaining <= 300;

  if (phase === "loading") {
    return (
      <div className="exam-room-page" id="contenu">
        <Loader label="Ouverture de la salle d'examen…" />
      </div>
    );
  }

  if (phase === "error" || !composition) {
    return (
      <div className="exam-room-page" id="contenu" style={{ padding: 40 }}>
        <ErrorState
          message={loadError ?? "Composition introuvable."}
          onRetry={load}
          action={
            <Link href="/dashboard/compositions" className="btn btn-outline btn-sm">
              Retour aux compositions
            </Link>
          }
        />
      </div>
    );
  }

  if (phase === "waiting") {
    return (
      <div className="exam-room-page" id="contenu">
        <div className="exam-view active">
          <header className="waiting-header">
            <div className="logo-text">
              <LogoCap size={22} />
              <span className="logo-campus">Campus</span>
              <span className="logo-ly">ly</span>
              <span className="exam-tag">EXAMEN</span>
            </div>
            <div className="exam-student-badge">
              <i className="fa-solid fa-user-graduate" aria-hidden="true" /> Session de démonstration
            </div>
          </header>

          <div className="waiting-container">
            <div className="info-panel">
              <div className="info-icon" aria-hidden="true">
                <i className="fa-solid fa-file-signature" />
              </div>
              <h1 className="info-title">{composition.title}</h1>
              <p className="info-subject">{composition.subject}</p>
              <div className="info-meta">
                <InfoRow icon="fa-solid fa-user-tie" label="Professeur" value={composition.teacherName} />
                <InfoRow icon="fa-solid fa-stopwatch" label="Durée stricte" value={`${composition.durationMinutes} min`} />
                <InfoRow icon="fa-solid fa-list-ol" label="Questions" value={`${composition.questions.length} questions`} />
                <InfoRow icon="fa-solid fa-rotate" label="Tentative" value={`${composition.attemptsAllowed} autorisée`} />
              </div>
            </div>

            <div className="onboarding-panel">
              {step === 1 ? (
                <div className="step-card active">
                  <div className="step-header">
                    <h3 className="step-title">1. Bienvenue dans la salle d&apos;attente</h3>
                    <span className="step-badge">1 / 4</span>
                  </div>
                  <p className="step-text">
                    Vous êtes sur le point de commencer une composition. Vérifiez les informations à gauche
                    et assurez-vous d&apos;avoir une connexion stable. Cette session est une{" "}
                    <strong>démonstration</strong> : aucune copie n&apos;est envoyée à un serveur.
                  </p>
                  <Button size="sm" onClick={() => setStep(2)} iconAfter="fa-solid fa-arrow-right">
                    Suivant
                  </Button>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="step-card active">
                  <div className="step-header">
                    <h3 className="step-title">2. Consignes du professeur</h3>
                    <span className="step-badge">2 / 4</span>
                  </div>
                  <div className="rules-box">
                    <ul>
                      {RULES.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" onClick={() => setStep(3)} iconAfter="fa-solid fa-check">
                    J&apos;ai compris
                  </Button>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="step-card active">
                  <div className="step-header">
                    <h3 className="step-title">3. Paramètres de sécurité</h3>
                    <span className="step-badge">3 / 4</span>
                  </div>
                  <div className="sec-list">
                    <div className="sec-item">
                      <i className="fa-solid fa-clock" aria-hidden="true" />
                      <span>Chronomètre strict actif</span>
                    </div>
                    <div className="sec-item">
                      <i className="fa-solid fa-window-restore" aria-hidden="true" />
                      <span>Plein écran recommandé</span>
                    </div>
                    <div className="sec-item simulated">
                      <i className="fa-solid fa-eye" aria-hidden="true" />
                      <span>Détection changement d&apos;onglet</span>
                      <span className="sim-tag">Simulation</span>
                    </div>
                    <div className="sec-item simulated">
                      <i className="fa-solid fa-video" aria-hidden="true" />
                      <span>Surveillance caméra</span>
                      <span className="sim-tag">Non activée</span>
                    </div>
                  </div>
                  <p className="step-note">
                    Les fonctions marquées « Simulation » n&apos;enregistrent aucune donnée biométrique : le
                    journal d&apos;intégrité reste dans votre navigateur.
                  </p>
                  <Button size="sm" onClick={() => setStep(4)} iconAfter="fa-solid fa-shield-halved">
                    Accepter la sécurité
                  </Button>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="step-card active">
                  <div className="step-header">
                    <h3 className="step-title">4. Vérification finale</h3>
                    <span className="step-badge">4 / 4</span>
                  </div>
                  <label className="check-label">
                    <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                    <span className="check-text">J&apos;ai lu et compris les consignes de mon professeur.</span>
                  </label>
                  <div className="row" style={{ marginTop: 20 }}>
                    <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                      Retour
                    </Button>
                    <Button size="sm" onClick={startExam} disabled={!consent} icon="fa-solid fa-play">
                      Commencer la composition
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "exam" && question) {
    const value = answers[question.id];
    return (
      <div className="exam-room-page" id="contenu">
        <div className="exam-view active">
          <header className="exam-header">
            <div className="row" style={{ gap: 10, alignItems: "center", minWidth: 0 }}>
              <span className="logo-text">
                <span className="logo-campus">Campus</span>
                <span className="logo-ly">ly</span>
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {composition.title}
              </span>
            </div>
            <div className="row" style={{ gap: 14 }}>
              <div className={`timer-box ${urgent ? "urgent" : ""}`} role="timer" aria-live={urgent ? "polite" : "off"}>
                <i className="fa-solid fa-clock" aria-hidden="true" />
                <span className="cd-number">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>
              <Button variant="primary" size="sm" onClick={() => setFinishOpen(true)} icon="fa-solid fa-file-export">
                Terminer
              </Button>
            </div>
          </header>

          <div className="exam-body">
            <aside className="exam-sidebar" aria-label="Navigation et intégrité">
              <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    color: "var(--text-2)",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 12,
                  }}
                >
                  Navigation
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="legend-swatch answered" aria-hidden="true" /> Répondu
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="legend-swatch marked" aria-hidden="true" /> Marqué
                  </span>
                </div>
              </div>

              <div className="q-grid">
                {palette.map((entry, entryIndex) => {
                  const answered = answers[entry.id] !== undefined;
                  const isFlagged = flagged.includes(entry.id);
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={`q-btn ${entryIndex === index ? "active" : ""} ${answered ? "answered" : ""} ${isFlagged ? "marked" : ""}`}
                      aria-label={`Question ${entryIndex + 1}${answered ? " (répondue)" : ""}${isFlagged ? " (marquée à revoir)" : ""}`}
                      aria-current={entryIndex === index ? "step" : undefined}
                      onClick={() => setIndex(entryIndex)}
                    >
                      {entryIndex + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: 20, borderTop: "1px solid var(--border)", marginTop: "auto" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-2)", marginBottom: 6 }}>
                  Intégrité <span className="sim-tag">Simulation</span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-2)", margin: "0 0 8px" }}>
                  {events.length === 0 ? "Aucun incident détecté." : `${events.length} événement(s) local(aux).`}
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, maxHeight: 120, overflowY: "auto" }}>
                  {events.slice(-4).map((event) => (
                    <li key={event.id} style={{ fontSize: "0.7rem", color: "var(--text-2)" }}>
                      <i className="fa-solid fa-circle-exclamation" aria-hidden="true" style={{ color: "var(--warning)" }} />{" "}
                      {EVENT_LABEL[event.type]}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: "0.66rem", color: "var(--text-3)", marginTop: 8, marginBottom: 0 }}>
                  Rien n&apos;est transmis : ce journal illustre le futur dispositif.
                </p>
              </div>
            </aside>

            <main className="exam-main">
              <div style={{ position: "absolute", top: 20, right: 20 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  aria-pressed={flagged.includes(question.id)}
                  onClick={() =>
                    setFlagged((current) =>
                      current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id],
                    )
                  }
                >
                  <i className="fa-solid fa-flag" aria-hidden="true" /> Marquer pour revoir
                </button>
              </div>

              <div className="q-content">
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--brand-1)", marginBottom: 12 }}>
                  Question {index + 1} sur {palette.length} · {question.points} point{question.points > 1 ? "s" : ""}
                </div>
                <h3 className="q-title">{question.prompt}</h3>

                {question.type === "qcm" ? (
                  <div role="radiogroup" aria-label="Choix de réponse">
                    {(question.options ?? []).map((option, optionIndex) => {
                      const checked = value === optionIndex;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          className={`option-btn ${checked ? "selected" : ""}`}
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                        >
                          <span className="opt-letter" aria-hidden="true">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {question.type === "true_false" ? (
                  <div role="radiogroup" aria-label="Vrai ou faux">
                    {[true, false].map((option) => (
                      <button
                        key={String(option)}
                        type="button"
                        role="radio"
                        aria-checked={value === option}
                        className={`option-btn ${value === option ? "selected" : ""}`}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                      >
                        <span className="opt-letter" aria-hidden="true">{option ? "V" : "F"}</span>
                        {option ? "Vrai" : "Faux"}
                      </button>
                    ))}
                  </div>
                ) : null}

                {question.type === "open" ? (
                  <div>
                    <label className="form-label" htmlFor="exam-answer">
                      Votre réponse
                    </label>
                    <textarea
                      id="exam-answer"
                      className="form-textarea"
                      rows={7}
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      placeholder="Rédigez votre réponse…"
                    />
                    <p className="form-hint">
                      Correction locale par mots-clés (démonstration) — {question.keywords?.length ?? 0} notions attendues.
                    </p>
                  </div>
                ) : null}

                <div className="row-between" style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={index === 0}
                    onClick={() => setIndex((current) => Math.max(0, current - 1))}
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Précédent
                  </button>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>
                    {answeredCount}/{palette.length} répondues · barème /{composition.totalPoints}
                  </span>
                  {index < palette.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setIndex((current) => Math.min(palette.length - 1, current + 1))}
                    >
                      Suivant <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setFinishOpen(true)}>
                      Vérifier et remettre
                    </button>
                  )}
                </div>
              </div>

              <footer className="exam-footer">
                <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Session de démonstration · remise locale
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                  {composition.code} · {composition.teacherName}
                </span>
              </footer>
            </main>
          </div>

          {finishOpen ? (
            <div className="finish-modal show" role="dialog" aria-modal="true" aria-labelledby="finish-title">
              <div className="modal-content">
                <h3 id="finish-title" style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
                  Remettre la copie ?
                </h3>
                <p style={{ fontSize: "0.86rem", color: "var(--text-2)", marginBottom: 8 }}>
                  {answeredCount}/{palette.length} questions répondues · {flagged.length} marquée(s) à revoir.
                </p>
                <div className="payment-notice" style={{ background: "rgba(245,124,0,0.1)", marginBottom: 16 }}>
                  La remise est <strong>simulée</strong> : aucune copie n&apos;est transmise et la note affichée
                  est calculée dans votre navigateur.
                </div>
                <div className="row" style={{ justifyContent: "flex-end" }}>
                  <Button variant="ghost" size="sm" onClick={() => setFinishOpen(false)}>
                    Continuer
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => submit(false)} disabled={submitting}>
                    {submitting ? "Remise…" : "Remettre la copie"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (phase === "done" && copy) {
    return (
      <div className="exam-room-page" id="contenu">
        <div className="exam-view active" style={{ padding: "32px 5%", overflowY: "auto" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
            <div className="card">
              <div className="row-between" style={{ marginBottom: 10 }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-1)", margin: 0 }}>
                  Copie remise (simulation)
                </h1>
                <Badge tone={copy.passed ? "success" : "danger"}>
                  {copy.scoreOn20.toFixed(1)}/20 · {copy.passed ? "Seuil atteint" : "Sous le seuil"}
                </Badge>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-2)", marginBottom: 16 }}>{copy.feedback}</p>

              <div className="grid-3" style={{ marginBottom: 18 }}>
                <div className="stat-card">
                  <div className="stat-card-icon blue" aria-hidden="true">
                    <i className="fa-solid fa-stopwatch" />
                  </div>
                  <div>
                    <div className="stat-card-value">{Math.round(copy.durationSeconds / 60)} min</div>
                    <div className="stat-card-label">Durée</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon orange" aria-hidden="true">
                    <i className="fa-solid fa-eye" />
                  </div>
                  <div>
                    <div className="stat-card-value">{copy.proctorEventsCount}</div>
                    <div className="stat-card-label">Événements locaux</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon green" aria-hidden="true">
                    <i className="fa-solid fa-hourglass-half" />
                  </div>
                  <div>
                    <div className="stat-card-value">En attente</div>
                    <div className="stat-card-label">Validation enseignant</div>
                  </div>
                </div>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {copy.questions.map((result, resultIndex) => (
                  <li
                    key={result.questionId}
                    style={{
                      padding: 12,
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--border)",
                      background: result.correct ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.05)",
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: 4 }}>
                      <strong style={{ fontSize: "0.84rem", color: "var(--text-1)" }}>
                        {resultIndex + 1}. {result.prompt}
                      </strong>
                      <Badge tone={result.correct ? "success" : "danger"}>
                        {result.earnedPoints}/{result.maxPoints}
                      </Badge>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-2)", margin: 0 }}>{result.explanation}</p>
                  </li>
                ))}
              </ul>

              <div className="row" style={{ marginTop: 20 }}>
                <Link href="/dashboard/compositions" className="btn btn-primary btn-sm">
                  Retour aux compositions
                </Link>
                <Link href="/dashboard" className="btn btn-ghost btn-sm">
                  Tableau de bord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="info-row">
      <i className={icon} aria-hidden="true" />
      <div>
        <div className="info-label">{label}</div>
        <div className="info-value">{value}</div>
      </div>
    </div>
  );
}
