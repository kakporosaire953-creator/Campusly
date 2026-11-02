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
import { roleLabels } from "@/config/site";

/**
 * Tableau de bord apprenant.
 * Aucune statistique n'est inventée : tant que l'étudiant n'a rien révisé, les
 * cartes de progression affichent un état vide qui explique ce qui les
 * remplira.
 */
export function LearnerOverview() {
  const { data, status, error, reload } = useAsync(() => userService.getLearnerDashboard(), []);

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <PageHeader title="Vue d'ensemble" subtitle="Chargement de votre espace…" />
        <LoadingGrid count={4} />
      </div>
    );
  }

  if (status === "error" || !data) {
    return <ErrorState message={error ?? "Tableau de bord indisponible."} onRetry={reload} />;
  }

  const hasActivity =
    data.level.xp > 0 || data.streakDays > 0 || data.credits > 0 || data.recentActivities.length > 0;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title={`Bonjour ${data.user.prenom}`}
        subtitle="Vos révisions, vos classes et vos échéances, au même endroit."
        actions={
          <>
            <Badge tone="brand" icon="fa-solid fa-user-graduate">
              {roleLabels[data.user.role]}
            </Badge>
            <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-brain" aria-hidden="true" /> Réviser
            </Link>
          </>
        }
      />

      {hasActivity ? (
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <StatCard
            label="Niveau académique"
            value={data.level.name}
            icon="fa-solid fa-graduation-cap"
            tone="blue"
            hint={`${data.level.xp} XP · prochain palier ${data.level.nextThreshold}`}
          />
          <StatCard label="Série d'étude" value={`${data.streakDays} j`} icon="fa-solid fa-fire" tone="orange" hint="Jours consécutifs" />
          <StatCard label="Crédits" value={data.credits} icon="fa-solid fa-bolt" tone="green" hint="Solde disponible" />
          <StatCard
            label="Objectif hebdomadaire"
            value={`${data.weeklyGoal.current}/${data.weeklyGoal.target}`}
            icon="fa-solid fa-bullseye"
            tone="purple"
            hint={data.weeklyGoal.period}
          />
        </div>
      ) : (
        <Card>
          <CardHeader
            title="Votre espace se remplit en révisant"
            subtitle="Aucune activité n'est encore enregistrée sur ce compte."
            icon="fa-solid fa-seedling"
          />
          <ul className="dashboard-onboarding">
            <li>
              <span aria-hidden="true">01</span> Importez un cours ou une fiche dans Campusly AI.
            </li>
            <li>
              <span aria-hidden="true">02</span> Lancez un premier entraînement pour situer vos acquis.
            </li>
            <li>
              <span aria-hidden="true">03</span> Rejoignez un amphi avec le code de votre enseignant.
            </li>
          </ul>
          <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
              Commencer une révision
            </Link>
            <Link href="/dashboard/classrooms" className="btn btn-ghost btn-sm">
              Rejoindre un amphi
            </Link>
          </div>
        </Card>
      )}

      <div className="grid-2">
        <div className="stack" style={{ gap: 20 }}>
          {data.lastActivity ? (
            <Card>
              <CardHeader title="Reprendre la révision" subtitle={data.lastActivity.chapter} icon="fa-solid fa-book-open" />
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 10 }}>
                {data.lastActivity.title}
              </div>
              <ProgressBar value={data.lastActivity.progressPercent} label="Progression du chapitre" />
              <div style={{ marginTop: 16 }}>
                <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
                  Continuer
                </Link>
              </div>
            </Card>
          ) : null}

          <Card>
            <CardHeader
              title="Diagnostic par matière"
              subtitle="Points faibles et points forts identifiés"
              icon="fa-solid fa-chart-line"
             
            />
            {data.weakTopics.length === 0 && data.strongTopics.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-chart-simple"
                title="Pas encore de diagnostic"
                description="Les notions à travailler apparaîtront après votre premier entraînement."
                action={
                  <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
                    Lancer un entraînement
                  </Link>
                }
              />
            ) : null}
            <div className="stack" style={{ gap: 14 }}>
              {data.weakTopics.map((topic) => (
                <div key={topic.subject}>
                  <div className="row-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-1)" }}>{topic.subject}</span>
                    <Badge tone={topic.priority === "Haute" ? "danger" : "accent"}>{topic.priority ?? "Moyenne"}</Badge>
                  </div>
                  <ProgressBar value={topic.mastery} tone={topic.mastery < 50 ? "danger" : "accent"} />
                </div>
              ))}
              {data.strongTopics.map((topic) => (
                <div key={topic.subject}>
                  <div className="row-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-1)" }}>{topic.subject}</span>
                    <Badge tone="success">Maîtrisé</Badge>
                  </div>
                  <ProgressBar value={topic.mastery} tone="success" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Compositions à venir"
              icon="fa-solid fa-stopwatch"
              action={
                <Link href="/dashboard/compositions" className="link-primary" style={{ fontSize: "0.8rem" }}>
                  Tout voir
                </Link>
              }
            />
            {data.upcomingCompositions.length === 0 ? (
              <EmptyState
                icon="fa-regular fa-calendar"
                title="Aucune composition programmée"
                description="Les évaluations de vos classrooms apparaîtront ici."
              />
            ) : (
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
                          {composition.classroomName} · {composition.durationMinutes} min · code {composition.code}
                        </div>
                      </div>
                      <Badge tone={composition.status === "live" ? "success" : "brand"}>
                        {composition.status === "live" ? "Ouverte" : "Programmée"}
                      </Badge>
                    </div>
                    <Link
                      href={`/examen/${composition.code}`}
                      className={`btn btn-sm ${composition.status === "live" ? "btn-primary" : "btn-outline"}`}
                      style={{ marginTop: 10 }}
                    >
                      {composition.status === "live" ? "Entrer en salle" : "Voir la salle d'attente"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="stack" style={{ gap: 20 }}>
          <Card>
            <CardHeader title="Activité récente" icon="fa-solid fa-clock-rotate-left" />
            {data.recentActivities.length === 0 ? (
              <EmptyState
                icon="fa-regular fa-clock"
                title="Aucune activité"
                description="Vos quiz, téléchargements et remises de copies s'afficheront ici."
              />
            ) : null}
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

          <Card>
            <CardHeader title="Mes classrooms" icon="fa-solid fa-chalkboard-user" action={<Link href="/dashboard/classrooms" className="link-primary" style={{ fontSize: "0.8rem" }}>Tout voir</Link>} />
            {data.classrooms.length === 0 ? (
              <EmptyState icon="fa-solid fa-chalkboard" title="Aucune classroom" description="Rejoignez un amphi avec le code fourni par votre enseignant." action={<Link href="/dashboard/classrooms" className="btn btn-primary btn-sm">Rejoindre un amphi</Link>} />
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {data.classrooms.slice(0, 3).map((classroom) => (
                  <li key={classroom.id}>
                    <Link
                      href={`/dashboard/classrooms/${classroom.id}`}
                      style={{
                        display: "block",
                        padding: 12,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        background: "var(--surface)",
                        textDecoration: "none",
                      }}
                    >
                      <div className="row-between">
                        <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-1)" }}>{classroom.name}</span>
                        <Badge tone="neutral">{classroom.studentsCount} inscrits</Badge>
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

          <Card>
            <CardHeader title="Épreuves recommandées" icon="fa-solid fa-file-lines" action={<Link href="/dashboard/epreuves" className="link-primary" style={{ fontSize: "0.8rem" }}>Bibliothèque</Link>} />
            {data.recommendedExams.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-folder-open"
                title="Bibliothèque en préparation"
                description="Les épreuves de votre faculté apparaîtront ici dès leur publication."
                action={
                  <Link href="/dashboard/epreuves" className="btn btn-ghost btn-sm">
                    Ouvrir la bibliothèque
                  </Link>
                }
              />
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
                    Ouvrir
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
