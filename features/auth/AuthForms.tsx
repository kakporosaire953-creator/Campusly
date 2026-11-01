"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEPARTMENTS_BY_FACULTY, FACULTIES, type FacultyCode } from "@/types";
import { useSession } from "@/features/auth/SessionProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError } from "@/services/api/client";
import { Button } from "@/components/ui/Button";
import { LogoCap } from "@/components/layout/SiteHeader";
import { roleLabels } from "@/config/site";

type Tab = "login" | "register";
type RoleChoice = "learner" | "teacher";

/**
 * Connexion / inscription.
 * Le parcours est fonctionnel côté interface (validation, messages d'erreur,
 * états de chargement) mais l'authentification est SIMULÉE : voir la mention
 * affichée sous le formulaire.
 */
export function AuthForms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status, login, register } = useSession();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "register" ? "register" : "login");
  const [role, setRole] = useState<RoleChoice>("learner");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    matricule: "",
    faculty: "FAST" as FacultyCode,
    department: "",
    teacherDepartment: "",
    subjects: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (tab === "register") router.replace("/auth?tab=register");
  }, [tab, router]);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login({ identifier: loginIdentifier, password: loginPassword });
      toast("Connexion simulée réussie — bienvenue !", "success");
      router.push("/dashboard");
    } catch (cause) {
      if (cause instanceof ApiError) {
        setErrors(cause.fields ?? { form: cause.message });
      } else {
        setErrors({ form: "Connexion impossible. Réessayez." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    if (form.password !== form.confirm) {
      setErrors({ confirm: "Les mots de passe ne correspondent pas." });
      return;
    }
    setSubmitting(true);
    try {
      await register({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        password: form.password,
        role,
        matricule: form.matricule,
        faculty: form.faculty,
        department: role === "teacher" ? form.teacherDepartment : form.department || undefined,
        subjects: role === "teacher" ? form.subjects.split(",").map((item) => item.trim()).filter(Boolean) : undefined,
      });
      toast("Compte de démonstration créé.", "success");
      router.push("/onboarding");
    } catch (cause) {
      if (cause instanceof ApiError) {
        setErrors(cause.fields ?? { form: cause.message });
      } else {
        setErrors({ form: "Inscription impossible. Réessayez." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="logo-text" style={{ fontSize: "1.6rem" }}>
              <span className="logo-cap" aria-hidden="true">
                <LogoCap size={28} />
              </span>
              <span className="logo-campus">Campus</span>
              <span className="logo-ly">ly</span>
            </span>
          </Link>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-1)", margin: "32px 0 12px", letterSpacing: "-0.02em" }}>
            La réussite académique intelligente
          </h2>
          <p style={{ color: "var(--text-2)", lineHeight: 1.7, marginBottom: 32 }}>
            Accédez aux épreuves UAC, révisez avec Campusly AI, intégrez vos Classrooms d&apos;amphi et
            préparez vos compositions.
          </p>
          <div className="auth-features">
            {[
              { icon: "fa-solid fa-file-lines", text: "Bibliothèque d'épreuves et annales officielles" },
              { icon: "fa-solid fa-brain", text: "Campusly AI & 5 modes d'apprentissage" },
              { icon: "fa-solid fa-chalkboard-user", text: "Espaces Classrooms pour professeurs & étudiants" },
              { icon: "fa-solid fa-bolt", text: "Campusly Credits pour vos analyses IA" },
            ].map((item) => (
              <div className="auth-feature-item" key={item.text}>
                <div className="auth-feature-icon" aria-hidden="true">
                  <i className={item.icon} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 id="authTitle">{tab === "login" ? "Bienvenue sur Campusly" : "Créer votre compte"}</h1>
            <p id="authSubtitle">
              {tab === "login"
                ? "Connectez-vous à votre espace académique"
                : "Rejoignez la communauté universitaire de l'UAC"}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Connexion ou inscription">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "login"}
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "register"}
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Inscription
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="loginIdentifier">
                  Email ou Matricule UAC
                </label>
                <input
                  id="loginIdentifier"
                  className="form-input"
                  value={loginIdentifier}
                  onChange={(event) => setLoginIdentifier(event.target.value)}
                  placeholder="Ex : 23180001 ou votre.email@uac.bj"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.identifier)}
                />
                {errors.identifier ? <p className="form-error">{errors.identifier}</p> : null}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">
                  Mot de passe
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="loginPassword"
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-2)",
                    }}
                  >
                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} aria-hidden="true" />
                  </button>
                </div>
                {errors.password ? <p className="form-error">{errors.password}</p> : null}
              </div>

              {errors.form ? (
                <p className="form-error" role="alert" style={{ marginBottom: 12 }}>
                  {errors.form}
                </p>
              ) : null}

              <button type="submit" className="form-btn" disabled={submitting}>
                {submitting ? "Connexion en cours…" : "Se connecter"}
              </button>

              <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.87rem", color: "var(--text-2)" }}>
                Pas encore de compte ?{" "}
                <button type="button" className="form-link" onClick={() => setTab("register")} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "var(--brand-1)", fontWeight: 700 }}>
                  S&apos;inscrire gratuitement
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <label className="form-label" style={{ marginBottom: 6 }}>
                Vous êtes :
              </label>
              <div className="role-selector" role="radiogroup" aria-label="Type de compte">
                {(["learner", "teacher"] as RoleChoice[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={role === item}
                    className={`role-option ${role === item ? "active" : ""}`}
                    onClick={() => setRole(item)}
                  >
                    <div style={{ fontSize: "1.3rem", color: item === "learner" ? "var(--brand-1)" : "var(--accent)", marginBottom: 4 }} aria-hidden="true">
                      <i className={item === "learner" ? "fa-solid fa-user-graduate" : "fa-solid fa-chalkboard-user"} />
                    </div>
                    <div className="role-option-title">{roleLabels[item]}</div>
                    <div className="role-option-sub">{item === "learner" ? "Révisions, quiz & compos" : "Classrooms & devoirs"}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="regPrenom">
                    Prénom
                  </label>
                  <input id="regPrenom" className="form-input" value={form.prenom} onChange={(event) => set("prenom", event.target.value)} placeholder="Rosaire" />
                  {errors.prenom ? <p className="form-error">{errors.prenom}</p> : null}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="regNom">
                    Nom
                  </label>
                  <input id="regNom" className="form-input" value={form.nom} onChange={(event) => set("nom", event.target.value)} placeholder="Kakpo" />
                  {errors.nom ? <p className="form-error">{errors.nom}</p> : null}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regEmail">
                  Adresse email
                </label>
                <input id="regEmail" className="form-input" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder="votre.email@uac.bj" />
                {errors.email ? <p className="form-error">{errors.email}</p> : null}
              </div>

              {role === "learner" ? (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="regMatricule">
                      Matricule UAC (8 chiffres)
                    </label>
                    <input
                      id="regMatricule"
                      className="form-input"
                      inputMode="numeric"
                      maxLength={8}
                      value={form.matricule}
                      onChange={(event) => set("matricule", event.target.value.replace(/\D/g, ""))}
                      placeholder="Ex : 23180001"
                    />
                    {errors.matricule ? <p className="form-error">{errors.matricule}</p> : null}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="regFaculte">
                      Faculté / Institut UAC
                    </label>
                    <select id="regFaculte" className="form-select" value={form.faculty} onChange={(event) => set("faculty", event.target.value as FacultyCode)}>
                      {FACULTIES.map((faculty) => (
                        <option key={faculty.code} value={faculty.code}>
                          {faculty.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="regDepartement">
                      Département / filière
                    </label>
                    <input
                      id="regDepartement"
                      className="form-input"
                      list="departments"
                      value={form.department}
                      onChange={(event) => set("department", event.target.value)}
                      placeholder="Ex : Informatique"
                    />
                    <datalist id="departments">
                      {(DEPARTMENTS_BY_FACULTY[form.faculty] ?? []).map((department) => (
                        <option key={department} value={department} />
                      ))}
                    </datalist>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="teacherDept">
                      Faculté / département d&apos;enseignement
                    </label>
                    <input id="teacherDept" className="form-input" value={form.teacherDepartment} onChange={(event) => set("teacherDepartment", event.target.value)} placeholder="Ex : FAST — Département Mathématiques & Info" />
                    {errors.department ? <p className="form-error">{errors.department}</p> : null}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="teacherSubjects">
                      Matières principales enseignées
                    </label>
                    <input id="teacherSubjects" className="form-input" value={form.subjects} onChange={(event) => set("subjects", event.target.value)} placeholder="Ex : Algorithmique, Structures de données" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="teacherFaculty">
                      Faculté de rattachement
                    </label>
                    <select id="teacherFaculty" className="form-select" value={form.faculty} onChange={(event) => set("faculty", event.target.value as FacultyCode)}>
                      {FACULTIES.map((faculty) => (
                        <option key={faculty.code} value={faculty.code}>
                          {faculty.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="regPassword">
                  Mot de passe
                </label>
                <input
                  id="regPassword"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => set("password", event.target.value)}
                  placeholder="Minimum 8 caractères"
                  autoComplete="new-password"
                />
                {errors.password ? <p className="form-error">{errors.password}</p> : null}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regConfirm">
                  Confirmer le mot de passe
                </label>
                <input
                  id="regConfirm"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={form.confirm}
                  onChange={(event) => set("confirm", event.target.value)}
                  autoComplete="new-password"
                />
                {errors.confirm ? <p className="form-error">{errors.confirm}</p> : null}
              </div>

              {errors.form ? (
                <p className="form-error" role="alert" style={{ marginBottom: 12 }}>
                  {errors.form}
                </p>
              ) : null}

              <button type="submit" className="form-btn" disabled={submitting}>
                {submitting ? "Création du compte…" : "Créer mon compte"}
              </button>

              <p style={{ textAlign: "center", marginTop: 18, fontSize: "0.87rem", color: "var(--text-2)" }}>
                Déjà un compte ?{" "}
                <button type="button" className="form-link" onClick={() => setTab("login")} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "var(--brand-1)", fontWeight: 700 }}>
                  Se connecter
                </button>
              </p>
            </form>
          )}

          <div
            role="note"
            style={{
              marginTop: 22,
              padding: "10px 14px",
              borderRadius: "var(--r-md)",
              border: "1px solid rgba(245,124,0,0.3)",
              background: "rgba(245,124,0,0.08)",
              fontSize: "0.76rem",
              color: "var(--text-2)",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: "var(--text-1)" }}>Démonstration :</strong> aucun mot de passe n&apos;est
            vérifié et aucun compte réel n&apos;est créé. En production, l&apos;authentification sera assurée
            par Better Auth côté serveur.
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Button href="/dashboard" variant="ghost" size="sm" icon="fa-solid fa-compass">
              Explorer sans compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
