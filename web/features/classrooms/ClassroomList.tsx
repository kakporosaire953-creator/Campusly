"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateClassroomInput, FacultyCode, LicenceLevel } from "@/types";
import { FACULTIES } from "@/types";
import { classroomService } from "@/services/classroomService";
import { useAsync } from "@/hooks/useAsync";
import { ApiError } from "@/services/api/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { useSession } from "@/features/auth/SessionProvider";

export function ClassroomList() {
  const { data, status, error, reload } = useAsync(() => classroomService.list(), []);
  const { role } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateClassroomInput>({
    name: "",
    subject: "",
    faculty: "FAST",
    level: "L2",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const handleJoin = async () => {
    setBusy(true);
    setJoinError(undefined);
    try {
      const classroom = await classroomService.join({ code: joinCode });
      setJoinOpen(false);
      setJoinCode("");
      toast(`Classroom « ${classroom.name} » rejointe (simulation).`, "success");
      router.push(`/dashboard/classrooms/${classroom.id}`);
    } catch (cause) {
      setJoinError(cause instanceof ApiError ? cause.message : "Impossible de rejoindre cette classroom.");
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async () => {
    setBusy(true);
    setFormErrors({});
    try {
      const classroom = await classroomService.create(form);
      setCreateOpen(false);
      toast("Classroom créée localement (démonstration).", "success");
      router.push(`/dashboard/classrooms/${classroom.id}`);
    } catch (cause) {
      if (cause instanceof ApiError) setFormErrors(cause.fields ?? { form: cause.message });
      else setFormErrors({ form: "Création impossible." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Classrooms Amphi"
        subtitle="Rejoignez un amphi avec le code de votre enseignant ou créez votre propre classe."
        demo
        actions={
          <>
            <Button variant="outline" size="sm" icon="fa-solid fa-right-to-bracket" onClick={() => setJoinOpen(true)}>
              Rejoindre
            </Button>
            {role === "teacher" || role === "admin" ? (
              <Button variant="primary" size="sm" icon="fa-solid fa-plus" onClick={() => setCreateOpen(true)}>
                Créer un amphi
              </Button>
            ) : null}
          </>
        }
      />

      {status === "loading" || status === "idle" ? <LoadingGrid count={3} /> : null}
      {status === "error" ? <ErrorState message={error ?? "Classrooms indisponibles."} onRetry={reload} /> : null}

      {status === "success" && data ? (
        data.length === 0 ? (
          <EmptyState
            icon="fa-solid fa-chalkboard"
            title="Aucune classroom disponible"
            description="Les classes de démonstration apparaîtront ici, ou rejoignez-en une avec un code."
            action={<Button onClick={() => setJoinOpen(true)}>Rejoindre un amphi</Button>}
          />
        ) : (
          <div className="grid-3">
            {data.map((classroom) => (
              <article className="card" key={classroom.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="row-between">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${classroom.color}1A`,
                      color: classroom.color,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="fa-solid fa-chalkboard-user" />
                  </span>
                  <Badge tone="neutral">Code {classroom.code}</Badge>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", margin: 0, lineHeight: 1.35 }}>
                  <Link href={`/dashboard/classrooms/${classroom.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {classroom.name}
                  </Link>
                </h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-2)", margin: 0 }}>
                  {classroom.subject} · {classroom.level} · {classroom.faculty}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>{classroom.description}</p>
                <div className="row-between" style={{ marginTop: "auto", paddingTop: 8 }}>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                    <i className="fa-solid fa-users" aria-hidden="true" /> {classroom.studentsCount}
                    {classroom.average !== null ? ` · ${classroom.average.toFixed(1)}/20` : ""}
                  </span>
                  <Link href={`/dashboard/classrooms/${classroom.id}`} className="btn btn-ghost btn-sm">
                    Ouvrir
                  </Link>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>Enseignant : {classroom.teacherName}</div>
              </article>
            ))}
          </div>
        )
      ) : null}

      <Card>
        <div className="row-between">
          <div>
            <strong style={{ fontSize: "0.88rem", color: "var(--text-1)" }}>Comment ça marche ?</strong>
            <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: "4px 0 0", maxWidth: 620 }}>
              En production, l&apos;enseignant crée l&apos;amphi et reçoit un code d&apos;invitation unique. Les
              étudiants rejoignent la classe avec ce code, puis retrouvent les ressources, devoirs et compositions.
            </p>
          </div>
          <Badge tone="brand" icon="fa-solid fa-circle-info">
            Codes de démo : ALGO24, ANAL24, BDD24X, DRPT30
          </Badge>
        </div>
      </Card>

      <Modal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        title="Rejoindre une classroom"
        description="Saisissez le code d'invitation fourni par votre enseignant."
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setJoinOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleJoin} disabled={busy || joinCode.trim().length < 4}>
              {busy ? "Vérification…" : "Rejoindre"}
            </Button>
          </div>
        }
      >
        <TextField label="Code d'invitation" value={joinCode} onChange={setJoinCode} placeholder="Ex : ALGO24" error={joinError} required />
        <p style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
          Simulation : la classe n&apos;est pas réellement rejointe et aucun enseignant n&apos;est notifié.
        </p>
      </Modal>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Créer un amphi"
        description="Cette création reste locale (démonstration)."
        maxWidth={520}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={busy}>
              {busy ? "Création…" : "Créer la classroom"}
            </Button>
          </div>
        }
      >
        <TextField
          label="Nom de la classroom"
          value={form.name}
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          placeholder="Ex : L3 Informatique — Réseaux"
          error={formErrors.name}
          required
        />
        <TextField
          label="Matière"
          value={form.subject}
          onChange={(value) => setForm((current) => ({ ...current, subject: value }))}
          placeholder="Ex : Réseaux"
          error={formErrors.subject}
          required
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="cls-faculty">
              Faculté
            </label>
            <select
              id="cls-faculty"
              className="form-select"
              value={form.faculty}
              onChange={(event) => setForm((current) => ({ ...current, faculty: event.target.value as FacultyCode }))}
            >
              {FACULTIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cls-level">
              Niveau
            </label>
            <select
              id="cls-level"
              className="form-select"
              value={form.level}
              onChange={(event) => setForm((current) => ({ ...current, level: event.target.value as LicenceLevel }))}
            >
              {["L1", "L2", "L3", "M1", "M2"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <TextAreaField
          label="Description"
          value={form.description ?? ""}
          onChange={(value) => setForm((current) => ({ ...current, description: value }))}
          placeholder="Objectifs du cours, rythme, modalités…"
        />
        {formErrors.form ? <p className="form-error">{formErrors.form}</p> : null}
      </Modal>
    </div>
  );
}
