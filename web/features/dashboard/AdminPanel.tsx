"use client";

import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/userService";
import { useToast } from "@/components/ui/ToastProvider";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDateFr } from "@/services/mocks/store";

type Decision = "approved" | "rejected" | null;

/**
 * Panel administrateur.
 * ⚠️ Les boutons de validation NE modifient aucune base : ils simulent la
 * décision localement et le rappellent explicitement à l'utilisateur.
 * En production, cette action sera protégée par un contrôle de rôle serveur
 * (`admin`) et journalisée.
 */
export function AdminPanel() {
  const { data, status, error, reload } = useAsync(() => userService.getAdminOverview(), []);
  const { toast } = useToast();
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [pendingAction, setPendingAction] = useState<{ id: string; title: string; decision: Exclude<Decision, null> } | null>(null);

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <PageHeader title="Panel admin" subtitle="Chargement…" />
        <LoadingGrid count={4} />
      </div>
    );
  }

  if (status === "error" || !data) {
    return <ErrorState message={error ?? "Panel admin indisponible."} onRetry={reload} />;
  }

  const queue = data.moderationQueue.map((item) => ({ ...item, status: decisions[item.id] ?? item.status }));

  const confirmDecision = () => {
    if (!pendingAction) return;
    setDecisions((current) => ({ ...current, [pendingAction.id]: pendingAction.decision }));
    toast(
      pendingAction.decision === "approved"
        ? "Approbation simulée : aucune publication réelle n'a été effectuée."
        : "Rejet simulé : aucune suppression réelle n'a été effectuée.",
      "info",
    );
    setPendingAction(null);
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader
        title="Panel administrateur"
        subtitle="Validation des contributions et supervision de la plateforme."
        demo
        actions={<Badge tone="danger" icon="fa-solid fa-shield-halved">Accès de démonstration</Badge>}
      />

      <div
        role="note"
        style={{
          padding: "12px 16px",
          borderRadius: "var(--r-lg)",
          border: "1px solid rgba(239,68,68,0.25)",
          background: "rgba(239,68,68,0.06)",
          fontSize: "0.82rem",
          color: "var(--text-2)",
        }}
      >
        <strong style={{ color: "var(--text-1)" }}>Rappel de sécurité :</strong> dans cette version, le statut
        administrateur est un simple sélecteur de démonstration. En production, l&apos;accès sera contrôlé par
        le serveur (rôle `admin` + journal d&apos;audit) — un contrôle côté navigateur ne protège rien.
      </div>

      <div className="stats-grid" style={{ marginBottom: 0 }}>
        <StatCard label="Utilisateurs" value={data.totals.users} icon="fa-solid fa-users" tone="blue" hint={`${data.totals.learners} étudiants · ${data.totals.teachers} enseignants`} />
        <StatCard label="Contributions en attente" value={data.contributions.pending} icon="fa-solid fa-inbox" tone="orange" />
        <StatCard label="Contributions publiées" value={data.contributions.approved} icon="fa-solid fa-circle-check" tone="green" />
        <StatCard label="Demandes enseignant" value={data.totals.pendingTeacherRequests} icon="fa-solid fa-user-clock" tone="purple" />
      </div>

      <Card>
        <CardHeader
          title="File de modération"
          subtitle="Contributions d'épreuves à vérifier"
          icon="fa-solid fa-list-check"
        />
        {queue.length === 0 ? (
          <EmptyState icon="fa-regular fa-circle-check" title="File vide" description="Aucune contribution en attente de validation." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Titre</th>
                  <th scope="col">Faculté</th>
                  <th scope="col">Année</th>
                  <th scope="col">Contributeur</th>
                  <th scope="col">Déposé le</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td style={{ whiteSpace: "normal", minWidth: 220 }}>{item.title}</td>
                    <td>{item.faculty}</td>
                    <td>{item.academicYear}</td>
                    <td>{item.contributorName}</td>
                    <td>{formatDateFr(item.submittedAt)}</td>
                    <td>
                      <Badge tone={item.status === "pending" ? "accent" : item.status === "approved" ? "success" : "danger"}>
                        {item.status === "pending" ? "En attente" : item.status === "approved" ? "Approuvée" : "Rejetée"}
                      </Badge>
                    </td>
                    <td>
                      {item.status === "pending" ? (
                        <div className="row" style={{ gap: 6 }}>
                          <Button
                            size="sm"
                            variant="primary"
                            icon="fa-solid fa-check"
                            onClick={() => setPendingAction({ id: item.id, title: item.title, decision: "approved" })}
                          >
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon="fa-solid fa-xmark"
                            onClick={() => setPendingAction({ id: item.id, title: item.title, decision: "rejected" })}
                          >
                            Rejeter
                          </Button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>Traitée (simulation)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Usage IA du mois" subtitle="Indicateurs de démonstration" icon="fa-solid fa-brain" />
        <div className="grid-2">
          <StatCard label="Analyses de documents" value={data.ai.analysesThisMonth} icon="fa-solid fa-file-pdf" tone="blue" />
          <StatCard label="Crédits consommés" value={data.ai.creditsConsumed.toLocaleString("fr-FR")} icon="fa-solid fa-bolt" tone="orange" />
        </div>
      </Card>

      <Modal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title={pendingAction?.decision === "approved" ? "Approuver cette contribution ?" : "Rejeter cette contribution ?"}
        description={`« ${pendingAction?.title ?? ""} »`}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setPendingAction(null)}>
              Annuler
            </Button>
            <Button variant={pendingAction?.decision === "approved" ? "primary" : "outline"} onClick={confirmDecision}>
              Confirmer la simulation
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
          Cette décision n&apos;est pas envoyée à un serveur : elle modifie uniquement l&apos;affichage local.
          La publication réelle dans la bibliothèque nécessitera l&apos;API backend.
        </p>
      </Modal>
    </div>
  );
}
