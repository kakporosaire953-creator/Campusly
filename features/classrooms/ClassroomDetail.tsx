"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClassroomPost } from "@/types";
import { classroomService } from "@/services/classroomService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar, StatCard } from "@/components/ui/Progress";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { formatDateFr, formatRelativeFr } from "@/services/mocks/store";

type Tab = "flux" | "ressources" | "devoirs" | "membres";

export function ClassroomDetail({ classroomId }: { classroomId: string }) {
  const { data, status, error, reload, setData } = useAsync(
    () => classroomService.getById(classroomId),
    [classroomId],
  );
  const analytics = useAsync(() => classroomService.analytics(classroomId), [classroomId]);
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("flux");
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  if (status === "loading" || status === "idle") {
    return (
      <div>
        <PageHeader title="Classroom" subtitle="Chargement…" />
        <LoadingGrid count={3} />
      </div>
    );
  }

  if (status === "error" || !data) {
    return <ErrorState message={error ?? "Classroom introuvable."} onRetry={reload} />;
  }

  const publish = async () => {
    setPosting(true);
    try {
      const post = await classroomService.addPost(data.id, draft);
      setData({ ...data, posts: [post, ...(data.posts ?? [])] });
      setDraft("");
      toast("Message publié localement (démonstration).", "success");
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Publication impossible.", "danger");
    } finally {
      setPosting(false);
    }
  };

  const TABS: Array<{ id: Tab; label: string; icon: string; count?: number }> = [
    { id: "flux", label: "Fil d'actualité", icon: "fa-solid fa-stream", count: data.posts?.length ?? 0 },
    { id: "ressources", label: "Ressources", icon: "fa-solid fa-folder-open", count: data.resources?.length ?? 0 },
    { id: "devoirs", label: "Devoirs", icon: "fa-solid fa-file-signature", count: data.assignments?.length ?? 0 },
    { id: "membres", label: "Membres", icon: "fa-solid fa-users", count: data.members?.length ?? 0 },
  ];

  return (
    <div className="stack" style={{ gap: 20 }}>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
        <Link href="/dashboard/classrooms" style={{ color: "var(--brand-1)", fontWeight: 700 }}>
          Classrooms
        </Link>{" "}
        / <span>{data.name}</span>
      </nav>

      <PageHeader
        title={data.name}
        subtitle={`${data.subject} · ${data.level} · ${data.faculty} · Enseignant : ${data.teacherName}`}
        demo
        actions={<Badge tone="brand">Code {data.code}</Badge>}
      />

      <div className="stats-grid" style={{ marginBottom: 0 }}>
        <StatCard label="Apprenants inscrits" value={data.studentsCount} icon="fa-solid fa-users" tone="blue" />
        <StatCard
          label="Moyenne de la classe"
          value={analytics.data?.classAverage !== null && analytics.data?.classAverage !== undefined ? `${analytics.data.classAverage.toFixed(1)}/20` : "—"}
          icon="fa-solid fa-chart-simple"
          tone="green"
          hint="Calcul simulé"
        />
        <StatCard
          label="Taux de participation"
          value={analytics.data ? `${analytics.data.participationRate}%` : "—"}
          icon="fa-solid fa-hand-point-up"
          tone="purple"
        />
        <StatCard
          label="Apprenants en difficulté"
          value={analytics.data?.strugglingCount ?? "—"}
          icon="fa-solid fa-triangle-exclamation"
          tone="orange"
          hint="Alerte pédagogique simulée"
        />
      </div>

      <div role="tablist" aria-label="Sections de la classroom" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            className={`learning-mode-tab ${tab === entry.id ? "active" : ""}`}
            onClick={() => setTab(entry.id)}
          >
            <i className={entry.icon} aria-hidden="true" /> {entry.label}
            {typeof entry.count === "number" ? ` (${entry.count})` : ""}
          </button>
        ))}
      </div>

      {tab === "flux" ? (
        <div className="stack" style={{ gap: 16 }}>
          <Card>
            <CardHeader title="Publier une annonce" subtitle="Réservé aux enseignants en production" icon="fa-solid fa-bullhorn" action={<DemoBadge label="Local" />} />
            <label className="form-label" htmlFor="post-content">
              Message
            </label>
            <textarea
              id="post-content"
              className="form-textarea"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ex : Le TD de vendredi est déplacé à l'amphi C."
            />
            <div className="row" style={{ marginTop: 10 }}>
              <Button variant="primary" size="sm" onClick={publish} disabled={posting || draft.trim().length === 0}>
                {posting ? "Publication…" : "Publier (démo)"}
              </Button>
              <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                Le message n&apos;est visible que dans votre navigateur.
              </span>
            </div>
          </Card>

          {(data.posts ?? []).length === 0 ? (
            <EmptyState title="Aucune annonce" description="Les publications de l'enseignant apparaîtront ici." />
          ) : (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {(data.posts ?? []).map((post: ClassroomPost) => (
                <li key={post.id} className="card">
                  <div className="row-between" style={{ marginBottom: 8 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong style={{ fontSize: "0.86rem", color: "var(--text-1)" }}>{post.authorName}</strong>
                      {post.pinned ? <Badge tone="accent">Épinglé</Badge> : null}
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>{formatRelativeFr(post.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{post.content}</p>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-2)", marginTop: 8 }}>
                    <i className="fa-regular fa-comment" aria-hidden="true" /> {post.commentsCount} commentaires
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "ressources" ? (
        (data.resources ?? []).length === 0 ? (
          <EmptyState icon="fa-solid fa-folder-open" title="Aucune ressource" description="Les supports déposés par l'enseignant (PDF, diaporamas, liens) apparaîtront ici." />
        ) : (
          <div className="grid-3">
            {(data.resources ?? []).map((resource) => (
              <Card key={resource.id}>
                <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                  <span className="epreuve-icon" aria-hidden="true">
                    <i className={resource.kind === "link" ? "fa-solid fa-link" : "fa-solid fa-file-pdf"} />
                  </span>
                  <strong style={{ fontSize: "0.86rem", color: "var(--text-1)" }}>{resource.title}</strong>
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                  {resource.kind.toUpperCase()}
                  {resource.sizeLabel ? ` · ${resource.sizeLabel}` : ""} · ajouté le {formatDateFr(resource.addedAt)}
                </div>
                <Button variant="ghost" size="sm" style={{ marginTop: 10 }} disabled icon="fa-solid fa-download">
                  Téléchargement indisponible (démo)
                </Button>
              </Card>
            ))}
          </div>
        )
      ) : null}

      {tab === "devoirs" ? (
        (data.assignments ?? []).length === 0 ? (
          <EmptyState icon="fa-solid fa-file-signature" title="Aucun devoir" description="Les devoirs planifiés apparaîtront ici." />
        ) : (
          <div className="stack" style={{ gap: 12 }}>
            {(data.assignments ?? []).map((assignment) => {
              const ratio = Math.round((assignment.submissionsCount / Math.max(1, assignment.expectedCount)) * 100);
              return (
                <Card key={assignment.id}>
                  <div className="row-between" style={{ marginBottom: 6 }}>
                    <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>{assignment.title}</strong>
                    <Badge tone={ratio >= 80 ? "success" : "accent"}>
                      {assignment.submissionsCount}/{assignment.expectedCount} rendus
                    </Badge>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-2)", marginBottom: 10 }}>{assignment.instructions}</p>
                  <ProgressBar value={ratio} tone={ratio >= 80 ? "success" : "accent"} />
                  <div style={{ fontSize: "0.74rem", color: "var(--text-2)", marginTop: 8 }}>
                    Échéance : {formatDateFr(assignment.dueAt)} · barème {assignment.maxPoints} points
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : null}

      {tab === "membres" ? (
        (data.members ?? []).length === 0 ? (
          <EmptyState icon="fa-solid fa-users" title="Aucun membre listé" description="Seuls quelques membres de démonstration sont exposés." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Matricule</th>
                  <th scope="col">Rôle</th>
                  <th scope="col">Moyenne</th>
                  <th scope="col">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {(data.members ?? []).map((member) => (
                  <tr key={member.userId}>
                    <td>{member.name}</td>
                    <td>{member.matricule ?? "—"}</td>
                    <td>
                      <Badge tone={member.role === "owner" ? "brand" : member.role === "assistant" ? "accent" : "neutral"}>
                        {member.role === "owner" ? "Propriétaire" : member.role === "assistant" ? "Assistant" : "Membre"}
                      </Badge>
                    </td>
                    <td>{member.average !== undefined ? `${member.average.toFixed(1)}/20` : "—"}</td>
                    <td>{formatDateFr(member.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}
