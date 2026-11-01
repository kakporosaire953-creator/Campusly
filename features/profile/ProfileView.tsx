"use client";

import { useEffect, useState } from "react";
import type { FacultyCode, TeacherActivationInput } from "@/types";
import { DEPARTMENTS_BY_FACULTY, FACULTIES } from "@/types";
import { authService } from "@/services/authService";
import { useSession } from "@/features/auth/SessionProvider";
import { ApiError } from "@/services/api/client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, RoleBadge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { ProgressBar } from "@/components/ui/Progress";
import { LoadingGrid, ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { formatDateFr } from "@/services/mocks/store";

export function ProfileView() {
  const { user, status, setUser } = useSession();
  const { toast } = useToast();
  const [form, setForm] = useState({ prenom: "", nom: "", faculty: "FAST" as FacultyCode, department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const [activation, setActivation] = useState<TeacherActivationInput>({
    matricule: "",
    faculty: "FAST",
    department: "",
    title: "Assistant",
  });
  const [activationError, setActivationError] = useState<string | undefined>();

  useEffect(() => {
    if (!user) return;
    setForm({ prenom: user.prenom, nom: user.nom, faculty: user.faculty, department: user.department });
    setActivation((current) => ({ ...current, matricule: user.matricule ?? "", faculty: user.faculty, department: user.department }));
  }, [user]);

  if (status === "loading") return <LoadingGrid count={2} />;
  if (!user) return <ErrorState message="Aucune session de démonstration active." />;

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      const updated = await authService.updateProfile({
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        faculty: form.faculty,
        department: form.department,
      });
      setUser(updated);
      toast("Profil mis à jour localement (démonstration).", "success");
    } catch (cause) {
      if (cause instanceof ApiError) setErrors(cause.fields ?? { form: cause.message });
      else setErrors({ form: "Enregistrement impossible." });
    } finally {
      setSaving(false);
    }
  };

  const requestActivation = async () => {
    setActivationError(undefined);
    try {
      await authService.requestTeacherActivation(activation);
      setActivationOpen(false);
      toast("Demande d'activation enseignante enregistrée (démonstration).", "success");
    } catch (cause) {
      setActivationError(cause instanceof ApiError ? cause.message : "Demande impossible.");
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Mon profil"
        subtitle="Informations académiques et préférences de compte."
        demo
        actions={<RoleBadge role={user.role} />}
      />

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card>
          <div className="row" style={{ gap: 16, marginBottom: 18 }}>
            <Avatar name={`${user.prenom} ${user.nom}`} size={64} />
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-1)", margin: 0 }}>
                {user.prenom} {user.nom}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: "2px 0 6px" }}>{user.email}</p>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                <Badge tone="neutral">{user.faculty}</Badge>
                <Badge tone="neutral">{user.department}</Badge>
                {user.matricule ? <Badge tone="neutral">#{user.matricule}</Badge> : null}
                {user.teacherStatus === "verified" ? (
                  <Badge tone="success" icon="fa-solid fa-circle-check">
                    Enseignant vérifié
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 10 }}>
            Modifier mes informations
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextField label="Prénom" value={form.prenom} onChange={(value) => setForm((c) => ({ ...c, prenom: value }))} error={errors.prenom} required />
            <TextField label="Nom" value={form.nom} onChange={(value) => setForm((c) => ({ ...c, nom: value }))} error={errors.nom} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-faculty">
                Faculté
              </label>
              <select
                id="profile-faculty"
                className="form-select"
                value={form.faculty}
                onChange={(event) => setForm((c) => ({ ...c, faculty: event.target.value as FacultyCode, department: "" }))}
              >
                {FACULTIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-department">
                Département
              </label>
              <select
                id="profile-department"
                className="form-select"
                value={form.department}
                onChange={(event) => setForm((c) => ({ ...c, department: event.target.value }))}
              >
                <option value="">—</option>
                {DEPARTMENTS_BY_FACULTY[form.faculty].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="form-hint" style={{ marginBottom: 12 }}>
            Le matricule et l&apos;adresse e-mail sont gérés par l&apos;administration académique.
          </p>
          {errors.form ? <p className="form-error">{errors.form}</p> : null}
          <Button variant="primary" onClick={save} disabled={saving} icon="fa-solid fa-floppy-disk">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </Card>

        <div className="stack" style={{ gap: 16 }}>
          <Card>
            <CardHeader title="Progression" subtitle="Niveau académique simulé" icon="fa-solid fa-chart-line" action={<DemoBadge />} />
            <div className="row-between" style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>{user.level.name}</strong>
              <span style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>{user.level.xp} XP</span>
            </div>
            <ProgressBar value={user.level.progressPercent} label={`Prochain niveau : ${user.level.nextLevelName}`} />
            <div className="row-between" style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text-2)" }}>
              <span>
                <i className="fa-solid fa-fire" aria-hidden="true" style={{ color: "var(--accent)" }} /> Série : {user.streakDays} jours
              </span>
              <span>Inscrit le {formatDateFr(user.joinedAt)}</span>
            </div>
          </Card>

          <Card>
            <CardHeader title="Statut du compte" icon="fa-solid fa-id-badge" />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem", color: "var(--text-2)" }}>
              <li className="row-between">
                <span>Rôle affiché</span>
                <Badge tone="brand">{user.role}</Badge>
              </li>
              <li className="row-between">
                <span>Statut enseignant</span>
                <Badge tone={user.teacherStatus === "verified" ? "success" : user.teacherStatus === "pending" ? "accent" : "neutral"}>
                  {user.teacherStatus === "verified" ? "Vérifié" : user.teacherStatus === "pending" ? "En attente" : "Étudiant"}
                </Badge>
              </li>
              <li className="row-between">
                <span>Crédits (démo)</span>
                <Badge tone="neutral">{user.credits}</Badge>
              </li>
            </ul>
            {user.role !== "teacher" ? (
              <Button variant="outline" size="sm" style={{ marginTop: 12 }} icon="fa-solid fa-user-tie" onClick={() => setActivationOpen((c) => !c)}>
                Demander le statut enseignant
              </Button>
            ) : null}

            {activationOpen ? (
              <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-2)", marginBottom: 10 }}>
                  Simulation : la demande n&apos;est pas transmise. En production, un justificatif et une validation
                  par le secrétariat académique seront exigés.
                </p>
                <TextField label="Matricule" value={activation.matricule} onChange={(value) => setActivation((c) => ({ ...c, matricule: value }))} required />
                <TextField label="Titre" value={activation.title} onChange={(value) => setActivation((c) => ({ ...c, title: value }))} placeholder="Assistant, Maître-assistant…" />
                {activationError ? <p className="form-error">{activationError}</p> : null}
                <Button variant="primary" size="sm" onClick={requestActivation}>
                  Envoyer la demande (démo)
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
