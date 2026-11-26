"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEPARTMENTS_BY_FACULTY, FACULTIES, type FacultyCode } from "@/types";
import { useSession } from "@/features/auth/SessionProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError } from "@/services/api/client";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/shared/CampuslyLogo";
import { roleLabelKeys } from "@/config/site";
import { PreferencesPanel } from "@/components/shared/PreferencesPanel";
import { useT } from "@/lib/i18n/provider";

type Tab = "login" | "register";
type RoleChoice = "learner" | "teacher";

/**
 * Connexion / inscription.
 * ---------------------------------------------------------------------------
 * Direction minimaliste : le formulaire est le point focal. Colonne unique,
 * largeur maîtrisée, aucun panneau photographique, aucune liste de fonctions.
 *
 * L'inscription est découpée en deux étapes pour ne pas aligner dix champs :
 *   1. Identité  — prénom, nom, e-mail, mot de passe, confirmation ;
 *   2. Parcours  — profil étudiant ou enseignant, puis informations
 *                  académiques correspondantes.
 * Les données, les validations et l'appel à `register()` sont inchangés : les
 * deux étapes remplissent le même état et le même formulaire. Un retour
 * d'erreur portant sur un champ de l'étape 1 ramène automatiquement à celle-ci.
 *
 * ⚠️ L'authentification reste SIMULÉE (voir la mention sous la carte) : aucun
 * mot de passe n'est vérifié et aucun compte réel n'est créé.
 */
export function AuthForms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status, login, register, enterDemo } = useSession();
  const { toast } = useToast();
  const t = useT();

  /**
   * Page demandée avant la redirection vers /auth (`?next=/dashboard/epreuves`).
   * Seuls les chemins internes sont acceptés : pas de redirection ouverte.
   */
  const rawNext = searchParams.get("next") ?? "";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "register" ? "register" : "login");
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<RoleChoice>("learner");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exploring, setExploring] = useState(false);
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

  const stepTwoHeading = useRef<HTMLParagraphElement>(null);
  const stepOneHeading = useRef<HTMLParagraphElement>(null);

  // L'onglet courant est reflété dans l'URL sans perdre la page demandée (`?next`).
  useEffect(() => {
    if (tab !== "register") return;
    const params = new URLSearchParams({ tab: "register" });
    if (rawNext) params.set("next", rawNext);
    router.replace(`/auth?${params.toString()}`);
  }, [tab, rawNext, router]);

  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, next, router]);

  // Le changement d'étape déplace le focus sur le titre de l'étape.
  useEffect(() => {
    if (step === 2) stepTwoHeading.current?.focus({ preventScroll: true });
    else stepOneHeading.current?.focus({ preventScroll: true });
  }, [step]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await login({ identifier: loginIdentifier, password: loginPassword });
      toast(t("auth.toastLogin"), "success");
      router.push(next);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setErrors(cause.fields ?? { form: cause.message });
      } else {
        setErrors({ form: t("auth.errLogin") });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /** Contrôles de l'étape 1 : mêmes règles que `authService.register`. */
  const validateIdentity = () => {
    const fields: Record<string, string> = {};
    if (!form.prenom.trim()) fields.prenom = t("auth.errFirstName");
    if (!form.nom.trim()) fields.nom = t("auth.errLastName");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email ?? "")) fields.email = t("auth.errEmail");
    if (!form.password || form.password.length < 8) fields.password = t("auth.errPasswordLen");
    if (form.password !== form.confirm) fields.confirm = t("auth.errConfirm");
    return fields;
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    // Étape 1 : on valide l'identité avant d'afficher le parcours.
    if (step === 1) {
      const fields = validateIdentity();
      setErrors(fields);
      if (Object.keys(fields).length === 0) setStep(2);
      return;
    }

    setErrors({});
    if (form.password !== form.confirm) {
      setErrors({ confirm: t("auth.errConfirm") });
      setStep(1);
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
        subjects:
          role === "teacher"
            ? form.subjects.split(",").map((item) => item.trim()).filter(Boolean)
            : undefined,
      });
      toast(t("auth.toastRegister"), "success");
      router.push("/onboarding");
    } catch (cause) {
      if (cause instanceof ApiError) {
        const fields = cause.fields ?? { form: cause.message };
        setErrors(fields);
        // Une erreur d'identité renvoie à l'étape concernée, sans perdre la saisie.
        if (["prenom", "nom", "email", "password", "confirm"].some((key) => key in fields)) {
          setStep(1);
        }
      } else {
        setErrors({ form: t("auth.errRegister") });
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Explorer sans compte : rouvre la session de démonstration (apprenant) puis
   * renvoie vers la page demandée. Sans cela, un visiteur déconnecté qui clique
   * ici repartait vers /dashboard… qui le renvoyait aussitôt vers /auth.
   */
  const handleExplore = async () => {
    setExploring(true);
    try {
      await enterDemo("learner");
      router.push(next);
    } finally {
      setExploring(false);
    }
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const selectTab = (value: Tab) => {
    setTab(value);
    setErrors({});
    if (value === "register") setStep(1);
  };

  return (
    <div className="auth">
      <header className="auth__bar">
        <Link href="/" className="auth__brand" aria-label={t("auth.brandAria")}>
          <Logo size={28} className="logo-campusly" />
        </Link>
        <div className="auth__bar-actions">
          <PreferencesPanel />
          <Link href="/" className="auth__back">
            {t("auth.backToSite")}
          </Link>
        </div>
      </header>

      <main className="auth__main">
        <div className="auth__card">
          <div className="auth__intro">
            <p className="auth__eyebrow">
              {tab === "login"
                ? t("auth.eyebrowLogin")
                : step === 1
                  ? t("auth.eyebrowRegister1")
                  : t("auth.eyebrowRegister2")}
            </p>
            <h1 className="auth__title">
              {tab === "login"
                ? t("auth.titleLogin")
                : step === 1
                  ? t("auth.titleIdentity")
                  : t("auth.titleProgram")}
            </h1>
            <p className="auth__subtitle">
              {tab === "login"
                ? t("auth.subLogin")
                : step === 1
                  ? t("auth.subIdentity")
                  : t("auth.subProgram")}
            </p>
          </div>

          <div className="auth__tabs" role="tablist" aria-label={t("auth.tablistLabel")}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "login"}
              className={`auth__tab ${tab === "login" ? "is-active" : ""}`}
              onClick={() => selectTab("login")}
            >
              {t("auth.tabLogin")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "register"}
              className={`auth__tab ${tab === "register" ? "is-active" : ""}`}
              onClick={() => selectTab("register")}
            >
              {t("auth.tabRegister")}
            </button>
          </div>

          {rawNext ? (
            <p className="auth__notice" role="status">
              <strong>{t("auth.noticeStrong")}</strong> {t("auth.noticeText")}
            </p>
          ) : null}

          {tab === "login" ? (
            <form className="auth__form" onSubmit={handleLogin} noValidate>
              <div className="auth__field">
                <label className="auth__label" htmlFor="loginIdentifier">
                  {t("auth.labelIdentifier")}
                </label>
                <input
                  id="loginIdentifier"
                  className="auth__input"
                  value={loginIdentifier}
                  onChange={(event) => setLoginIdentifier(event.target.value)}
                  placeholder={t("auth.placeholderIdentifier")}
                  autoComplete="username"
                  aria-invalid={Boolean(errors.identifier)}
                  aria-describedby={errors.identifier ? "loginIdentifier-error" : undefined}
                />
                {errors.identifier ? (
                  <p className="auth__error" id="loginIdentifier-error" role="alert">
                    {errors.identifier}
                  </p>
                ) : null}
              </div>

              <div className="auth__field">
                <label className="auth__label" htmlFor="loginPassword">
                  {t("auth.labelPassword")}
                </label>
                <div className="auth__input-wrap">
                  <input
                    id="loginPassword"
                    className="auth__input"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder={t("auth.placeholderPassword")}
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "loginPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    className="auth__reveal"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    aria-pressed={showPassword}
                  >
                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} aria-hidden="true" />
                  </button>
                </div>
                {errors.password ? (
                  <p className="auth__error" id="loginPassword-error" role="alert">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              {errors.form ? (
                <p className="auth__error auth__error--form" role="alert">
                  {errors.form}
                </p>
              ) : null}

              <button type="submit" className="auth__submit" disabled={submitting}>
                {submitting ? t("auth.submittingLogin") : t("auth.submitLogin")}
              </button>

              <p className="auth__switch">
                {t("auth.noAccount")}{" "}
                <button type="button" className="auth__switch-link" onClick={() => selectTab("register")}>
                  {t("auth.createAccount")}
                </button>
              </p>
            </form>
          ) : (
            <form className="auth__form" onSubmit={handleRegister} noValidate>
              <ol className="auth__steps" aria-label={t("auth.stepsLabel")}>
                <li className={step === 1 ? "is-current" : "is-done"}>
                  <span aria-hidden="true">01</span> {t("auth.stepIdentity")}
                </li>
                <li className={step === 2 ? "is-current" : ""}>
                  <span aria-hidden="true">02</span> {t("auth.stepProgram")}
                </li>
              </ol>

              <p className="auth__sr" role="status">
                {step === 1 ? t("auth.stage1") : t("auth.stage2")}
              </p>

              {step === 1 ? (
                <div className="auth__step" key="identity">
                  <p className="auth__step-title" ref={stepOneHeading} tabIndex={-1}>
                    {t("auth.stepIdentity")}
                  </p>

                  <div className="auth__row">
                    <div className="auth__field">
                      <label className="auth__label" htmlFor="regPrenom">
                        {t("auth.labelFirstName")}
                      </label>
                      <input
                        id="regPrenom"
                        className="auth__input"
                        value={form.prenom}
                        onChange={(event) => set("prenom", event.target.value)}
                        autoComplete="given-name"
                        aria-invalid={Boolean(errors.prenom)}
                      />
                      {errors.prenom ? (
                        <p className="auth__error" role="alert">
                          {errors.prenom}
                        </p>
                      ) : null}
                    </div>

                    <div className="auth__field">
                      <label className="auth__label" htmlFor="regNom">
                        {t("auth.labelLastName")}
                      </label>
                      <input
                        id="regNom"
                        className="auth__input"
                        value={form.nom}
                        onChange={(event) => set("nom", event.target.value)}
                        autoComplete="family-name"
                        aria-invalid={Boolean(errors.nom)}
                      />
                      {errors.nom ? (
                        <p className="auth__error" role="alert">
                          {errors.nom}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="auth__field">
                    <label className="auth__label" htmlFor="regEmail">
                      {t("auth.labelEmail")}
                    </label>
                    <input
                      id="regEmail"
                      className="auth__input"
                      type="email"
                      value={form.email}
                      onChange={(event) => set("email", event.target.value)}
                      placeholder="prenom.nom@uac.bj"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email ? (
                      <p className="auth__error" role="alert">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="auth__field">
                    <label className="auth__label" htmlFor="regPassword">
                      Mot de passe
                    </label>
                    <div className="auth__input-wrap">
                      <input
                        id="regPassword"
                        className="auth__input"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) => set("password", event.target.value)}
                        placeholder={t("auth.placeholderNewPassword")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                      />
                      <button
                        type="button"
                        className="auth__reveal"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                        aria-pressed={showPassword}
                      >
                        <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} aria-hidden="true" />
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="auth__error" role="alert">
                        {errors.password}
                      </p>
                    ) : null}
                  </div>

                  <div className="auth__field">
                    <label className="auth__label" htmlFor="regConfirm">
                      {t("auth.labelConfirm")}
                    </label>
                    <input
                      id="regConfirm"
                      className="auth__input"
                      type={showPassword ? "text" : "password"}
                      value={form.confirm}
                      onChange={(event) => set("confirm", event.target.value)}
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirm)}
                    />
                    {errors.confirm ? (
                      <p className="auth__error" role="alert">
                        {errors.confirm}
                      </p>
                    ) : null}
                  </div>

                  <button type="submit" className="auth__submit">
                    {t("auth.submitContinue")}
                  </button>
                </div>
              ) : (
                <div className="auth__step" key="parcours">
                  <p className="auth__step-title" ref={stepTwoHeading} tabIndex={-1}>
                    {t("auth.stepProgram")}
                  </p>

                  <fieldset className="auth__roles">
                    <legend className="auth__label">{t("auth.rolesLegend")}</legend>
                    {(["learner", "teacher"] as RoleChoice[]).map((item) => (
                      <label
                        key={item}
                        className={`auth__role ${role === item ? "is-active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={item}
                          checked={role === item}
                          onChange={() => setRole(item)}
                        />
                        <span className="auth__role-icon" aria-hidden="true">
                          <i className={item === "learner" ? "fa-solid fa-user-graduate" : "fa-solid fa-chalkboard-user"} />
                        </span>
                        <span className="auth__role-text">
                          <strong>{t(roleLabelKeys[item])}</strong>
                          <span>{item === "learner" ? t("auth.roleLearnerHint") : t("auth.roleTeacherHint")}</span>
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  {role === "learner" ? (
                    <>
                      <div className="auth__row">
                        <div className="auth__field">
                          <label className="auth__label" htmlFor="regMatricule">
                            {t("auth.labelMatricule")}
                          </label>
                          <input
                            id="regMatricule"
                            className="auth__input"
                            inputMode="numeric"
                            maxLength={8}
                            value={form.matricule}
                            onChange={(event) => set("matricule", event.target.value.replace(/\D/g, ""))}
                            placeholder="23180001"
                            aria-invalid={Boolean(errors.matricule)}
                          />
                          {errors.matricule ? (
                            <p className="auth__error" role="alert">
                              {errors.matricule}
                            </p>
                          ) : null}
                        </div>

                        <div className="auth__field">
                          <label className="auth__label" htmlFor="regFaculte">
                            {t("auth.labelFaculty")}
                          </label>
                          <select
                            id="regFaculte"
                            className="auth__input auth__select"
                            value={form.faculty}
                            onChange={(event) => set("faculty", event.target.value as FacultyCode)}
                          >
                            {FACULTIES.map((faculty) => (
                              <option key={faculty.code} value={faculty.code}>
                                {faculty.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="auth__field">
                        <label className="auth__label" htmlFor="regDepartement">
                          {t("auth.labelDepartment")}
                        </label>
                        <input
                          id="regDepartement"
                          className="auth__input"
                          list="departments"
                          value={form.department}
                          onChange={(event) => set("department", event.target.value)}
                          placeholder={t("auth.placeholderDepartment")}
                          aria-describedby="regDepartement-hint"
                        />
                        <p className="auth__hint" id="regDepartement-hint">
                          {t("auth.hintDepartment")}
                        </p>
                        <datalist id="departments">
                          {(DEPARTMENTS_BY_FACULTY[form.faculty] ?? []).map((department) => (
                            <option key={department} value={department} />
                          ))}
                        </datalist>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="auth__field">
                        <label className="auth__label" htmlFor="teacherDept">
                          {t("auth.labelTeacherDept")}
                        </label>
                        <input
                          id="teacherDept"
                          className="auth__input"
                          value={form.teacherDepartment}
                          onChange={(event) => set("teacherDepartment", event.target.value)}
                          placeholder={t("auth.placeholderTeacherDept")}
                          aria-invalid={Boolean(errors.department)}
                        />
                        {errors.department ? (
                          <p className="auth__error" role="alert">
                            {errors.department}
                          </p>
                        ) : null}
                      </div>

                      <div className="auth__field">
                        <label className="auth__label" htmlFor="teacherSubjects">
                          {t("auth.labelSubjects")}
                        </label>
                        <input
                          id="teacherSubjects"
                          className="auth__input"
                          value={form.subjects}
                          onChange={(event) => set("subjects", event.target.value)}
                          placeholder={t("auth.placeholderSubjects")}
                          aria-describedby="teacherSubjects-hint"
                        />
                        <p className="auth__hint" id="teacherSubjects-hint">
                          {t("auth.hintSubjects")}
                        </p>
                      </div>

                      <div className="auth__field">
                        <label className="auth__label" htmlFor="teacherFaculty">
                          {t("auth.labelTeacherFaculty")}
                        </label>
                        <select
                          id="teacherFaculty"
                          className="auth__input auth__select"
                          value={form.faculty}
                          onChange={(event) => set("faculty", event.target.value as FacultyCode)}
                        >
                          {FACULTIES.map((faculty) => (
                            <option key={faculty.code} value={faculty.code}>
                              {faculty.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {errors.form ? (
                    <p className="auth__error auth__error--form" role="alert">
                      {errors.form}
                    </p>
                  ) : null}

                  <div className="auth__step-actions">
                    <button type="button" className="auth__back-step" onClick={() => setStep(1)}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> {t("auth.back")}
                    </button>
                    <button type="submit" className="auth__submit" disabled={submitting}>
                      {submitting ? t("auth.submittingRegister") : t("auth.submitRegister")}
                    </button>
                  </div>
                </div>
              )}

              {step === 1 ? (
                <p className="auth__switch">
                  {t("auth.haveAccount")}{" "}
                  <button type="button" className="auth__switch-link" onClick={() => selectTab("login")}>
                    {t("auth.submitLogin")}
                  </button>
                </p>
              ) : null}
            </form>
          )}

          <div className="auth__explore">
            <Button
              variant="ghost"
              size="sm"
              icon="fa-solid fa-compass"
              onClick={handleExplore}
              disabled={exploring}
            >
              {exploring ? t("auth.exploring") : t("auth.explore")}
            </Button>
          </div>
        </div>

        <div className="auth__note" role="note">
          <p>
            <strong>{t("auth.demoStrong")}</strong> {t("auth.demoText")}
          </p>
          <p>
            {t("auth.demoAccounts")}
          </p>
        </div>
      </main>

      <footer className="auth__foot">
        <p>{t("auth.footNote")}</p>
        <nav aria-label={t("auth.footNavLabel")}>
          <Link href="/a-propos">{t("auth.footAbout")}</Link>
          <Link href="/politique-de-confidentialite">{t("auth.footPrivacy")}</Link>
          <Link href="/conditions">{t("auth.footTerms")}</Link>
        </nav>
      </footer>
    </div>
  );
}
