"use client";

import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/userService";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/States";
import { formatRelativeFr } from "@/services/mocks/store";

/** Centre de pilotage enseignant — données de démonstration. */
export function TeacherOverview() {
  const { data, status, error, reload } = useAsync(() => userService.getTeacherDashboard(), []);

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <PageHeader title="Espace enseignant" subtitle="Chargement du centre de pilotage…" />
        <LoadingGrid count={4} />
      </div>
    );
  }

  if (status === "error" || !data) {
    return <ErrorState message={error ?? "Espace enseignant indisponible."} onRetry={reload} />;
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title={`Bonjour ${data.user.prenom}`}
        subtitle="Centre de pilotage pédagogique UAC — valeurs de démonstration."
        demo
        actions={
          <>
            <Badge tone="accent" icon="fa-solid fa-person-chalkboard">
              Enseignant
            </Badge>
            <Link href="/dashboard/classrooms" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus" aria-hidden="true" /> Créer un amphi
            </Link>
          </>
        }
      />

      <div className="stats-grid" style={{ marginBottom: 0 }}>
        <StatCard label="Apprenants suivis" value={data.totals.students} icon="fa-solid fa-users" tone="blue" />
        <StatCard label="Classrooms actives" value={data.totals.activeClassrooms} icon="fa-solid fa-chalkboard-user" tone="green" />
        <StatCard label="Compositions ouvertes" value={data.totals.compositionsLive} icon="fa-solid fa-stopwatch" tone="orange" />
        <StatCard label="Copies à valider" value={data.totals.pendingReviews} icon="fa-solid fa-file-circle-check" tone="purple" />
      </div>

      <div className="grid-2">
        <div className="stack" style={{ gap: 20 }}>
          <Card>
            <CardHeader title="Alertes pédagogiques" subtitle="Suivi automatique simulé" icon="fa-solid fa-triangle-exclamation" />
            {data.alerts.length === 0 ? (
              <EmptyState title="Aucune alerte" description="Vos classes ne présentent pas de signalement." />
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {data.alerts.map((alert) => (
                  <li
                    key={alert.id}
                    style={{
                      padding: 12,
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--border)",
                      background:
                        alert.tone === "warning"
                          ? "rgba(245,124,0,0.08)"
                          : alert.tone === "danger"
                            ? "rgba(239,68,68,0.08)"
                            : "var(--surface)",
                    }}
                  >
                    <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-1)" }}>{alert.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-2)", marginTop: 2 }}>{alert.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Mes classes" icon="fa-solid fa-chalkboard" action={<Link href="/dashboard/classrooms" className="link-primary" style={{ fontSize: "0.8rem" }}>Gérer</Link>} />
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only" style={{ position: "absolute", left: -9999 }}>
                  Classes, effectifs, moyennes et rendus en attente
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Classe</th>
                    <th scope="col">Effectif</th>
                    <th scope="col">Moyenne</th>
                    <th scope="col">Rendus en attente</th>
                  </tr>
                </thead>
                <tbody>
                  {data.classes.map((entry) => (
                    <tr key={entry.classroom.id}>
                      <td>
                        <Link href={`/dashboard/classrooms/${entry.classroom.id}`} style={{ color: "var(--brand-1)", fontWeight: 700 }}>
                          {entry.classroom.name}
                        </Link>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>Code {entry.classroom.code}</div>
                      </td>
                      <td>{entry.classroom.studentsCount}</td>
                      <td>{entry.average === null ? "—" : `${entry.average.toFixed(1)}/20`}</td>
                      <td>{entry.pendingSubmissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="stack" style={{ gap: 20 }}>
          <Card>
            <CardHeader title="Dernières copies" icon="fa-solid fa-file-invoice" />
            {data.recentCopies.length === 0 ? (
              <EmptyState title="Aucune copie" description="Les copies soumises apparaîtront ici." />
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {data.recentCopies.map((copy) => (
                  <li key={copy.id} className="history-row">
                    <div style={{ flex: 1 }}>
                      <div className="history-row-title">{copy.studentName}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>{copy.compositionTitle}</div>
                    </div>
                    <Badge tone={copy.scoreOn20 >= 10 ? "success" : "danger"}>{copy.scoreOn20}/20</Badge>
                    <span className="history-row-date">{formatRelativeFr(copy.submittedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Actions rapides" icon="fa-solid fa-bolt" />
            <div className="stack" style={{ gap: 10 }}>
              <Link href="/dashboard/compositions" className="btn btn-outline" style={{ justifyContent: "flex-start" }}>
                <i className="fa-solid fa-file-signature" aria-hidden="true" /> Préparer une composition
              </Link>
              <Link href="/dashboard/revision" className="btn btn-outline" style={{ justifyContent: "flex-start" }}>
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> Générer un quiz
              </Link>
              <Link href="/dashboard/forum" className="btn btn-outline" style={{ justifyContent: "flex-start" }}>
                <i className="fa-solid fa-comments" aria-hidden="true" /> Répondre au forum
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
