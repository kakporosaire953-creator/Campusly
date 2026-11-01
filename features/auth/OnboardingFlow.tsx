"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DEPARTMENTS_BY_FACULTY, FACULTIES, type FacultyCode } from "@/types";
import { useSession } from "@/features/auth/SessionProvider";
import { useToast } from "@/components/ui/ToastProvider";

const SUBJECTS = [
  { id: "algorithmique", label: "Algorithmique", icon: "fa-solid fa-code" },
  { id: "bdd", label: "Bases de données", icon: "fa-solid fa-database" },
  { id: "reseaux", label: "Réseaux", icon: "fa-solid fa-network-wired" },
  { id: "se", label: "Systèmes d'exploitation", icon: "fa-solid fa-microchip" },
  { id: "analyse", label: "Analyse", icon: "fa-solid fa-square-root-variable" },
  { id: "proba", label: "Probabilités", icon: "fa-solid fa-chart-simple" },
];

const GOALS = [
  { id: "composition", label: "Préparer une composition", icon: "fa-solid fa-graduation-cap" },
  { id: "revision", label: "Réviser mes cours", icon: "fa-solid fa-book-reader" },
  { id: "results", label: "Améliorer mes résultats", icon: "fa-solid fa-chart-line" },
];

/**
 * Onboarding post-inscription.
 * Les réponses restent locales : elles ne configurent aucun compte réel.
 * En production, elles seront envoyées à `PATCH /api/me/profile`.
 */
export function OnboardingFlow() {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const isTeacher = user?.role === "teacher";
  const totalSteps = isTeacher ? 3 : 4;
  const [step, setStep] = useState(1);
  const [faculty, setFaculty] = useState<FacultyCode>(user?.faculty ?? "FAST");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [level, setLevel] = useState("L2");
  const [subjects, setSubjects] = useState<string[]>(["algorithmique"]);
  const [goal, setGoal] = useState("revision");

  const progress = useMemo(() => Math.round((step / totalSteps) * 100), [step, totalSteps]);

  const toggleSubject = (id: string) =>
    setSubjects((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const next = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    toast("Préférences enregistrées localement (démonstration).", "success");
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 620, width: "100%", margin: "60px auto", padding: "0 20px" }}>
      <div
        style={{
          background: "var(--grad-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-md)",
          padding: 36,
        }}
      >
        <div className="progress-bar" style={{ display: "flex", gap: 8, marginBottom: 24 }} aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: index < step ? "var(--brand-1)" : "var(--border)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>
          Étape {step} sur {totalSteps} — {progress}%
        </p>

        {step === 1 ? (
          <div>
            <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 12 }}>
              Bienvenue {user?.prenom ?? ""} sur Campusly
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 24 }}>
              Votre espace pour apprendre, réviser et suivre votre progression. Configurons ensemble votre
              environnement — ces réglages restent locaux dans cette version de démonstration.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
              {isTeacher ? "Votre rattachement" : "Choisissez votre parcours"}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-2)", marginBottom: 20 }}>
              Ces informations pré-remplissent vos filtres d&apos;épreuves et de classrooms.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="onbFaculty">
                Faculté / institut
              </label>
              <select
                id="onbFaculty"
                className="form-select"
                value={faculty}
                onChange={(event) => {
                  setFaculty(event.target.value as FacultyCode);
                  setDepartment("");
                }}
              >
                {FACULTIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="onbDepartment">
                {isTeacher ? "Département d'enseignement" : "Filière / département"}
              </label>
              <input
                id="onbDepartment"
                className="form-input"
                list="onbDepartments"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                placeholder="Ex : Informatique"
              />
              <datalist id="onbDepartments">
                {(DEPARTMENTS_BY_FACULTY[faculty] ?? []).map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>

            {!isTeacher ? (
              <div className="form-group">
                <label className="form-label" htmlFor="onbLevel">
                  Niveau
                </label>
                <select id="onbLevel" className="form-select" value={level} onChange={(event) => setLevel(event.target.value)}>
                  {["L1", "L2", "L3", "M1", "M2"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
              {isTeacher ? "Vos matières" : "Vos matières"}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-2)", marginBottom: 20 }}>
              Sélectionnez les matières sur lesquelles vous souhaitez vous concentrer.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
              {SUBJECTS.map((subject) => {
                const selected = subjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSubject(subject.id)}
                    style={{
                      padding: 16,
                      border: `2px solid ${selected ? "var(--brand-1)" : "var(--border)"}`,
                      background: selected ? "rgba(21,101,192,0.06)" : "transparent",
                      borderRadius: "var(--r-lg)",
                      cursor: "pointer",
                      textAlign: "center",
                      color: selected ? "var(--brand-1)" : "var(--text-1)",
                      fontWeight: selected ? 800 : 600,
                    }}
                  >
                    <div style={{ fontSize: "1.3rem", marginBottom: 6 }} aria-hidden="true">
                      <i className={subject.icon} />
                    </div>
                    {subject.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === totalSteps ? (
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8 }}>
              Votre objectif
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-2)", marginBottom: 20 }}>
              Que souhaitez-vous accomplir principalement sur Campusly ?
            </p>
            <div role="radiogroup" aria-label="Objectif principal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {GOALS.map((item) => {
                const selected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setGoal(item.id)}
                    style={{
                      padding: 16,
                      border: `2px solid ${selected ? "var(--brand-1)" : "var(--border)"}`,
                      background: selected ? "rgba(21,101,192,0.06)" : "transparent",
                      borderRadius: "var(--r-lg)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      textAlign: "left",
                      color: "var(--text-1)",
                      fontWeight: 600,
                    }}
                  >
                    <i className={item.icon} style={{ color: "var(--brand-1)", fontSize: "1.3rem" }} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="row-between" style={{ marginTop: 28 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (step === 1 ? router.push("/dashboard") : setStep(step - 1))}
          >
            {step === 1 ? "Passer" : "Retour"}
          </button>
          <button type="button" className="btn btn-primary" onClick={next}>
            {step === totalSteps ? "Terminer" : "Continuer"} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.76rem", color: "var(--text-2)" }}>
        Données de démonstration — aucune préférence n&apos;est envoyée à un serveur.
      </p>
    </div>
  );
}
