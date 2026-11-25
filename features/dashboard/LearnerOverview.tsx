"use client";

import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/userService";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar, StatCard } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/States";
import { formatRelativeFr } from "@/services/mocks/store";
import { roleLabelKeys } from "@/config/site";
import { useT } from "@/lib/i18n/provider";

/**
 * Tableau de bord apprenant.
 * Aucune statistique n'est inventée : tant que l'étudiant n'a rien révisé, les
 * cartes de progression affichent un état vide qui explique ce qui les
 * remplira.
 */
export function LearnerOverview() {
  const { data, status, error, reload } = useAsync(() => userService.getLearnerDashboard(), []);
  const t = useT();

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <PageHeader title={t("app.navOverview")} subtitle={t("dashboard.learner.loading")} />
        <LoadingGrid count={4} />
      </div>
    );
  }

  if (status === "error" || !data) {
    return <ErrorState message={error ?? t("dashboard.learner.unavailable")} onRetry={reload} />;
  }

  const hasActivity =
    data.level.xp > 0 || data.streakDays > 0 || data.credits > 0 || data.recentActivities.length > 0;

  /* Contenu réellement présent de chaque côté : sert à ne pas ouvrir une
     colonne vide. */
  const hasLeftContent =
    Boolean(data.lastActivity) ||
    data.weakTopics.length > 0 ||
    data.strongTopics.length > 0 ||
    data.upcomingCompositions.length > 0;
  const hasSideContent = data.recentActivities.length > 0 || data.recommendedExams.length > 0;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title={t("dashboard.learner.greeting", { name: data.user.prenom })}
        subtitle={t("dashboard.learner.subtitle")}
        actions={
          <>
            <Badge tone="brand" icon="fa-solid fa-user-graduate">
              {t(roleLabelKeys[data.user.role])}
            </Badge>
            <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-brain" aria-hidden="true" /> {t("dashboard.learner.revise")}
            </Link>
          </>
        }
      />

      {hasActivity ? (
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <StatCard
            label={t("dashboard.learner.level")}
            value={data.level.name}
            icon="fa-solid fa-graduation-cap"
            tone="blue"
            hint={t("dashboard.learner.levelHint", { xp: data.level.xp, next: data.level.nextThreshold })}
          />
          <StatCard
            label={t("dashboard.learner.streak")}
            value={t("dashboard.learner.streakValue", { days: data.streakDays })}
            icon="fa-solid fa-fire"
            tone="orange"
            hint={t("dashboard.learner.streakHint")}
          />
          <StatCard
            label={t("dashboard.learner.credits")}
            value={data.credits}
            icon="fa-solid fa-bolt"
            tone="green"
            hint={t("dashboard.learner.creditsHint")}
          />
          <StatCard
            label={t("dashboard.learner.weeklyGoal")}
            value={`${data.weeklyGoal.current}/${data.weeklyGoal.target}`}
            icon="fa-solid fa-bullseye"
            tone="purple"
            hint={data.weeklyGoal.period}
          />
        </div>
      ) : (
        <Card>
          <CardHeader
            title={t("dashboard.learner.emptyTitle")}
            subtitle={t("dashboard.learner.emptySubtitle")}
            icon="fa-solid fa-seedling"
          />
          <ul className="dashboard-onboarding">
            <li>
              <span aria-hidden="true">01</span> {t("dashboard.learner.emptyStep1")}
            </li>
            <li>
              <span aria-hidden="true">02</span> {t("dashboard.learner.emptyStep2")}
            </li>
            <li>
              <span aria-hidden="true">03</span> {t("dashboard.learner.emptyStep3")}
            </li>
          </ul>
          <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
              {t("dashboard.learner.startRevision")}
            </Link>
            <Link href="/dashboard/classrooms" className="btn btn-ghost btn-sm">
              {t("dashboard.learner.joinClassroom")}
            </Link>
          </div>
        </Card>
      )}

      {/* Les classes : une seule carte pleine largeur, une fois. Elle était
          dupliquée à droite et répétait l'invitation déjà présente dans le
          bandeau du haut. */}
      <Card>
        <CardHeader
          title={t("dashboard.learner.classrooms")}
          icon="fa-solid fa-chalkboard-user"
          action={
            <Link href="/dashboard/classrooms" className="link-primary" style={{ fontSize: "0.8rem" }}>
              {t("dashboard.learner.seeAll")}
            </Link>
          }
        />
        {data.classrooms.length === 0 ? (
          <p style={{ fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.6, maxWidth: "62ch" }}>
            {t("dashboard.learner.noClassroom")}
          </p>
        ) : (
          <ul className="grid-3" style={{ listStyle: "none", gap: 12 }}>
            {data.classrooms.slice(0, 3).map((classroom) => (
              <li key={classroom.id}>
                <Link
                  href={`/dashboard/classrooms/${classroom.id}`}
                  style={{
                    display: "block",
                    padding: 14,
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    background: "var(--surface)",
                    textDecoration: "none",
                  }}
                >
                  <div className="row-between">
                    <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-1)" }}>{classroom.name}</span>
                    <Badge tone="neutral">{t("dashboard.learner.enrolled", { count: classroom.studentsCount })}</Badge>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-2)", marginTop: 2 }}>
                    {classroom.subject} · {classroom.teacherName}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Deux colonnes seulement quand les deux ont du contenu. Un compte neuf
          n'en a qu'une : la grille repasse alors en pleine largeur. */}
      <div className={hasSideContent ? "grid-2" : undefined}>
        {hasSideContent || hasLeftContent ? (
        <div className="stack" style={{ gap: 20 }}>
          {data.lastActivity ? (
            <Card>
              <CardHeader
                title={t("dashboard.learner.resume")}
                subtitle={data.lastActivity.chapter}
                icon="fa-solid fa-book-open"
              />
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 10 }}>
                {data.lastActivity.title}
              </div>
              <ProgressBar
                value={data.lastActivity.progressPercent}
                label={t("dashboard.learner.chapterProgress")}
              />
              <div style={{ marginTop: 16 }}>
                <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
                  {t("dashboard.learner.continue")}
                </Link>
              </div>
            </Card>
          ) : null}

          {/* Pas de diagnostic tant qu'aucun entraînement n'a eu lieu : une
              carte vide de plus n'apprenait rien. Elle apparaît avec les
              premières notions travaillées. */}
          {data.weakTopics.length > 0 || data.strongTopics.length > 0 ? (
            <Card>
            <CardHeader
              title={t("dashboard.learner.diagnosis")}
              subtitle={t("dashboard.learner.diagnosisSubtitle")}
              icon="fa-solid fa-chart-line"
            />
            <div className="stack" style={{ gap: 14 }}>
              {data.weakTopics.map((topic) => (
                <div key={topic.subject}>
                  <div className="row-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-1)" }}>{topic.subject}</span>
                    <Badge tone={topic.priority === "Haute" ? "danger" : "accent"}>
                      {topic.priority ?? t("dashboard.learner.average")}
                    </Badge>
                  </div>
                  <ProgressBar value={topic.mastery} tone={topic.mastery < 50 ? "danger" : "accent"} />
                </div>
              ))}
              {data.strongTopics.map((topic) => (
                <div key={topic.subject}>
                  <div className="row-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-1)" }}>{topic.subject}</span>
                    <Badge tone="success">{t("dashboard.learner.mastered")}</Badge>
                  </div>
                  <ProgressBar value={topic.mastery} tone="success" />
                </div>
              ))}
            </div>
          </Card>
          ) : null}

          {/* Une carte ne s'affiche que si elle a quelque chose à montrer :
              trois encadrés vides empilés donnaient l'impression d'un produit
              en panne alors que le compte est simplement neuf. */}
          {data.upcomingCompositions.length > 0 ? (
            <Card>
            <CardHeader
              title={t("dashboard.learner.upcoming")}
              icon="fa-solid fa-stopwatch"
              action={
                <Link href="/dashboard/compositions" className="link-primary" style={{ fontSize: "0.8rem" }}>
                  {t("dashboard.learner.seeAll")}
                </Link>
              }
            />
              <ul className="stack" style={{ gap: 12, listStyle: "none" }}>
                {data.upcomingCompositions.map((composition) => (
                  <li
                    key={composition.id}
                    style={{
                      padding: 14,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-lg)",
                      background: "var(--surface)",
                    }}
                  >
                    <div className="row-between">
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-1)" }}>{composition.title}</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>
                          {composition.classroomName} ·{" "}
                          {t("dashboard.learner.minutes", { count: composition.durationMinutes })} · {composition.code}
                        </div>
                      </div>
                      <Badge tone={composition.status === "live" ? "success" : "brand"}>
                        {composition.status === "live"
                          ? t("dashboard.learner.open")
                          : t("dashboard.learner.scheduled")}
                      </Badge>
                    </div>
                    <Link
                      href={`/examen/${composition.code}`}
                      className={`btn btn-sm ${composition.status === "live" ? "btn-primary" : "btn-outline"}`}
                      style={{ marginTop: 10 }}
                    >
                      {composition.status === "live"
                        ? t("dashboard.learner.enterRoom")
                        : t("dashboard.learner.waitingRoom")}
                    </Link>
                  </li>
                ))}
              </ul>
          </Card>
          ) : null}
        </div>
        ) : null}

        {hasSideContent ? (
        <div className="stack" style={{ gap: 20 }}>
          {/* L'historique n'apparaît qu'une fois qu'il y a un historique. */}
          {data.recentActivities.length > 0 ? (
            <Card>
            <CardHeader title={t("dashboard.learner.recentActivity")} icon="fa-solid fa-clock-rotate-left" />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recentActivities.map((activity) => (
                <li key={activity.id} className="history-row">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface-2)",
                      color:
                        activity.tone === "success"
                          ? "var(--success)"
                          : activity.tone === "danger"
                            ? "var(--danger)"
                            : activity.tone === "accent"
                              ? "var(--accent)"
                              : "var(--brand-1)",
                      flexShrink: 0,
                    }}
                  >
                    <i className={activity.icon} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="history-row-title">{activity.title}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>{activity.detail}</div>
                  </div>
                  <span className="history-row-date">{formatRelativeFr(activity.occurredAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
          ) : null}

          <Card>
            <CardHeader
              title={t("dashboard.learner.recommended")}
              icon="fa-solid fa-file-lines"
              action={
                <Link href="/dashboard/epreuves" className="link-primary" style={{ fontSize: "0.8rem" }}>
                  {t("dashboard.learner.library")}
                </Link>
              }
            />
            {data.recommendedExams.length === 0 ? (
              <p style={{ fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                {t("dashboard.learner.noRecommended")}
              </p>
            ) : null}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {data.recommendedExams.map((exam) => (
                <li key={exam.id} className="epreuve-item" style={{ marginBottom: 0 }}>
                  <span className="epreuve-icon" aria-hidden="true">
                    <i className="fa-solid fa-file-pdf" />
                  </span>
                  <div className="epreuve-info">
                    <div className="epreuve-name">{exam.title}</div>
                    <div className="epreuve-meta">
                      {exam.faculty} · {exam.level} · {exam.academicYear}
                    </div>
                  </div>
                  <Link href={`/dashboard/epreuves/${exam.id}`} className="epreuve-dl" style={{ textDecoration: "none" }}>
                    {t("dashboard.learner.open")}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        ) : null}
      </div>
    </div>
  );
}
