"use client";

import { useRef, useState } from "react";
import type { ExamContributionInput, ExamType, FacultyCode, LicenceLevel, Semester } from "@/types";
import { DEPARTMENTS_BY_FACULTY, FACULTIES } from "@/types";
import { examService } from "@/services/examService";
import { ApiError } from "@/services/api/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const EMPTY: ExamContributionInput = {
  title: "",
  subject: "",
  faculty: "FAST",
  department: "Informatique",
  level: "L2",
  semester: "S1",
  academicYear: "2024",
  type: "Examen",
  fileName: "",
  fileSize: 0,
};

const MAX_SIZE = 10 * 1024 * 1024;

/**
 * Formulaire de contribution d'épreuve.
 * Aucun fichier n'est envoyé : le fichier est seulement nommé et pesé, puis la
 * contribution est enregistrée localement. En production, une URL présignée R2
 * sera demandée au Worker avant l'upload direct.
 */
export function ContributionForm() {
  const [form, setForm] = useState<ExamContributionInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string; title: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ExamContributionInput>(key: K, value: ExamContributionInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const pickFile = (selected: File | null) => {
    if (!selected) return;
    if (selected.size > MAX_SIZE) {
      setErrors((current) => ({ ...current, file: "Fichier trop volumineux (10 Mo maximum)." }));
      return;
    }
    setFile(selected);
    setForm((current) => ({ ...current, fileName: selected.name, fileSize: selected.size }));
    setErrors((current) => ({ ...current, file: "" }));
  };

  const submit = async () => {
    setBusy(true);
    setErrors({});
    try {
      const created = await examService.submitContribution({ ...form, file: file ?? undefined });
      setDone({ id: created.id, title: created.title });
      setForm(EMPTY);
      setFile(null);
    } catch (cause) {
      if (cause instanceof ApiError) setErrors(cause.fields ?? { form: cause.message });
      else setErrors({ form: "Envoi impossible." });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="card" style={{ padding: 28, textAlign: "center" }} role="status">
        <div style={{ fontSize: "2rem", color: "var(--success)", marginBottom: 10 }} aria-hidden="true">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 6 }}>
          Contribution enregistrée (simulation)
        </h2>
        <p style={{ fontSize: "0.86rem", color: "var(--text-2)", marginBottom: 6 }}>
          « {done.title} » a été ajoutée à la file de modération locale. Aucun fichier n&apos;a été transféré :
          la publication réelle nécessitera le stockage R2 et une validation par l&apos;équipe.
        </p>
        <p style={{ fontSize: "0.76rem", color: "var(--text-3)", marginBottom: 16 }}>Référence : {done.id}</p>
        <Button variant="outline" onClick={() => setDone(null)} icon="fa-solid fa-plus">
          Contribuer une autre épreuve
        </Button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 4 }}>
        <i className="fa-solid fa-upload" aria-hidden="true" /> Soumettre une épreuve
      </h2>
      <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginBottom: 16 }}>
        Formats acceptés : PDF, DOC, DOCX, JPG, PNG — 10 Mo maximum. Le fichier n&apos;est pas lu dans cette
        version de démonstration.
      </p>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          pickFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className="drop-zone"
        style={{ padding: 24, textAlign: "center", marginBottom: 16 }}
      >
        <div style={{ fontSize: "1.6rem", marginBottom: 6 }} aria-hidden="true">
          📁
        </div>
        <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
          {file ? file.name : "Glissez votre fichier ici"}
        </p>
        <p style={{ fontSize: "0.76rem", color: "var(--text-2)", marginBottom: 10 }}>
          {file ? `${Math.round(file.size / 1024)} Ko` : "ou sélectionnez un fichier"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
          style={{ display: "none" }}
          id="contribution-file"
        />
        <div className="row" style={{ justifyContent: "center" }}>
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            Choisir un fichier
          </Button>
          {file ? (
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setForm((c) => ({ ...c, fileName: "", fileSize: 0 })); }}>
              Retirer
            </Button>
          ) : null}
        </div>
      </div>
      {errors.file ? <p className="form-error">{errors.file}</p> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="c-title">
            Titre de l&apos;épreuve <span aria-hidden="true">*</span>
          </label>
          <input
            id="c-title"
            className="form-input"
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="Ex : Microéconomie I — Examen final"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? <p className="form-error">{errors.title}</p> : null}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-subject">
            Matière <span aria-hidden="true">*</span>
          </label>
          <input
            id="c-subject"
            className="form-input"
            value={form.subject}
            onChange={(event) => set("subject", event.target.value)}
            placeholder="Ex : Microéconomie"
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject ? <p className="form-error">{errors.subject}</p> : null}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-faculty">
            Faculté
          </label>
          <select
            id="c-faculty"
            className="form-select"
            value={form.faculty}
            onChange={(event) => set("faculty", event.target.value as FacultyCode)}
          >
            {FACULTIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-department">
            Département / filière
          </label>
          <select
            id="c-department"
            className="form-select"
            value={form.department}
            onChange={(event) => set("department", event.target.value)}
          >
            {DEPARTMENTS_BY_FACULTY[form.faculty].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-level">
            Niveau
          </label>
          <select id="c-level" className="form-select" value={form.level} onChange={(event) => set("level", event.target.value as LicenceLevel)}>
            {["L1", "L2", "L3", "M1", "M2"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-semester">
            Semestre
          </label>
          <select id="c-semester" className="form-select" value={form.semester} onChange={(event) => set("semester", event.target.value as Semester)}>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-year">
            Année académique
          </label>
          <select id="c-year" className="form-select" value={form.academicYear} onChange={(event) => set("academicYear", event.target.value)}>
            {["2025", "2024", "2023", "2022", "2021", "2020", "2019"].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="c-type">
            Type
          </label>
          <select id="c-type" className="form-select" value={form.type} onChange={(event) => set("type", event.target.value as ExamType)}>
            <option value="Examen">Examen final</option>
            <option value="Partiel">Partiel</option>
            <option value="Rattrapage">Rattrapage</option>
            <option value="TD">TD / Devoir</option>
          </select>
        </div>
      </div>

      {errors.form ? <p className="form-error">{errors.form}</p> : null}

      <div className="row-between" style={{ marginTop: 8 }}>
        <Badge tone="accent" icon="fa-solid fa-flask">
          Envoi simulé — aucun fichier transmis
        </Badge>
        <Button variant="primary" onClick={submit} disabled={busy} icon="fa-solid fa-paper-plane">
          {busy ? "Envoi…" : "Soumettre l'épreuve"}
        </Button>
      </div>
    </div>
  );
}
