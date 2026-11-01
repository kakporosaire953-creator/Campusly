"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Composition, CompositionStatus } from "@/types";
import { compositionService } from "@/services/compositionService";
import { useAsync } from "@/hooks/useAsync";
import { useSession } from "@/features/auth/SessionProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { TextField } from "@/components/ui/Field";
import { formatDateFr, formatRelativeFr } from "@/services/mocks/store";

const STATUS_LABEL: Record<CompositionStatus, string> = {
  draft: "Brouillon",
  scheduled: "Programmée",
  live: "En cours",
  closed: "Clôturée",
  graded: "Corrigée",
};

const STATUS_TONE: Record<CompositionStatus, "brand" | "accent" | "success" | "neutral" | "danger"> = {
  draft: "neutral",
  scheduled: "brand",
  live: "accent",
  closed: "neutral",
  graded: "success",
};

export function CompositionList() {
  const { role } = useSession();
  const router = useRouter();
  const compositions = useAsync(() => compositionService.list(), []);
  const copies = useAsync(() => compositionService.copies(), []);
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();

  const isTeacher = role === "teacher" || role === "admin";

  const { upcoming, past } = useMemo(() => {
    const list = compositions.data ?? [];
    return {
      upcoming: list.filter((item) => item.status === "live" || item.status === "scheduled"),
      past: list.filter((item) => item.status === "closed" || item.status === "graded"),
    };
  }, [compositions.data]);

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Compositions surveillées"
        subtitle={
          isTeacher
            ? "Pilotez les évaluations de vos classes et suivez les copies rendues."
            : "Accédez à une évaluation avec le code de votre enseignant et suivez vos résultats."
        }
        demo
        actions={
          isTeacher ? (
            <Badge tone="brand" icon="fa-solid fa-user-tie">
              Vue enseignant
            </Badge>
          ) : (
            <Badge tone="accent" icon="fa-solid fa-stopwatch">
              Surveillance simulée
            </Badge>
          )
        }
      />

      {!isTeacher ? (
        <Card>
          <CardHeader title="Rejoindre une composition" subtitle="Code à 6 caractères fourni par l'enseignant" icon="fa-solid fa-key" />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "start" }}>
            <TextField
              label="Code d'accès"
              value={code}
              onChange={(value) => {
                setCode(value.toUpperCase());
                setCodeError(undefined);
              }}
              placeholder="Ex : ALGO1"
              maxLength={6}
              error={codeError}
              hint="Codes de démonstration : ALGO1 (algorithmique), BDDTP2 (bases de données), ANALTD (analyse)"
            />
            <div style={{ paddingTop: 27 }}>
              <Button
                variant="primary"
                icon="fa-solid fa-arrow-right-to-bracket"
                disabled={code.trim().length < 4}
                onClick={async () => {
                  try {
                    const composition = await compositionService.findByCode(code.trim());
                    router.push(`/examen/${composition.code}`);
                  } catch {
                    setCodeError("Code inconnu. Vérifiez auprès de votre enseignant.");
                  }
                }}
              >
                Entrer
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div role="tablist" aria-label="Sections compositions" style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upcoming"}
          className={`learning-mode-tab ${tab === "upcoming" ? "active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          <i className="fa-solid fa-calendar-days" aria-hidden="true" /> À venir & en cours ({upcoming.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "history"}
          className={`learning-mode-tab ${tab === "history" ? "active" : ""}`}
          onClick={() => setTab("history")}
        >
          <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Historique ({past.length})
        </button>
      </div>

      {compositions.status === "loading" || compositions.status === "idle" ? <LoadingGrid count={2} /> : null}
      {compositions.status === "error" ? (
        <ErrorState message={compositions.error ?? "Compositions indisponibles."} onRetry={compositions.reload} />
      ) : null}

      {compositions.status === "success" ? (
        (tab === "upcoming" ? upcoming : past).length === 0 ? (
          <EmptyState
            icon="fa-solid fa-stopwatch"
            title={tab === "upcoming" ? "Aucune évaluation programmée" : "Aucune composition passée"}
            description={
              tab === "upcoming"
                ? "Les compositions créées par vos enseignants apparaîtront ici dès leur programmation."
                : "Vos compositions corrigées et vos notes de démonstration s'afficheront ici."
            }
          />
        ) : (
          <div className="stack" style={{ gap: 12 }}>
            {(tab === "upcoming" ? upcoming : past).map((composition) => (
              <CompositionRow key={composition.id} composition={composition} isTeacher={isTeacher} />
            ))}
          </div>
        )
      ) : null}

      {isTeacher ? (
        <Card>
          <CardHeader
            title="Copies rendues"
            subtitle="Correction automatique simulée, validation enseignant requise en production"
            icon="fa-solid fa-file-signature"
            action={<Badge tone="neutral">{copies.data?.length ?? 0} copies</Badge>}
          />
          {copies.status === "loading" ? <LoadingGrid count={1} /> : null}
          {copies.status === "error" ? (
            <ErrorState message={copies.error ?? "Copies indisponibles."} onRetry={copies.reload} />
          ) : null}
          {copies.status === "success" && (copies.data ?? []).length === 0 ? (
            <EmptyState icon="fa-regular fa-file" title="Aucune copie" description="Les copies apparaîtront après la première composition soumise." />
          ) : null}
          {copies.status === "success" && (copies.data ?? []).length > 0 ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Étudiant</th>
                    <th scope="col">Composition</th>
                    <th scope="col">Note</th>
                    <th scope="col">Durée</th>
                    <th scope="col">Événements</th>
                    <th scope="col">Rendu</th>
                  </tr>
                </thead>
                <tbody>
                  {(copies.data ?? []).map((copy) => (
                    <tr key={copy.id}>
                      <td>
                        {copy.studentName}
                        <div style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>{copy.matricule}</div>
                      </td>
                      <td style={{ whiteSpace: "normal", minWidth: 180 }}>{copy.compositionTitle}</td>
                      <td>
                        <Badge tone={copy.passed ? "success" : "danger"}>{copy.scoreOn20.toFixed(1)}/20</Badge>
                      </td>
                      <td>{Math.round(copy.durationSeconds / 60)} min</td>
                      <td>{copy.proctorEventsCount}</td>
                      <td>{formatDateFr(copy.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Card>
      ) : null}

    </div>
  );
}

function CompositionRow({ composition, isTeacher }: { composition: Composition; isTeacher: boolean }) {
  const live = composition.status === "live";
  return (
    <Card>
      <div className="row-between" style={{ alignItems: "flex-start", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div className="row" style={{ gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <Badge tone={STATUS_TONE[composition.status]}>{STATUS_LABEL[composition.status]}</Badge>
            <Badge tone="neutral">{composition.durationMinutes} min</Badge>
            <Badge tone="neutral">/{composition.totalPoints} points</Badge>
            {composition.proctoring === "strict" ? (
              <Badge tone="danger" icon="fa-solid fa-shield-halved">
                Surveillance stricte
              </Badge>
            ) : null}
          </div>
          <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-1)", margin: 0 }}>{composition.title}</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-2)", margin: "4px 0 0" }}>
            {composition.subject} · {composition.classroomName} · {composition.teacherName}
          </p>
          <p style={{ fontSize: "0.74rem", color: "var(--text-2)", margin: "6px 0 0" }}>
            <i className="fa-regular fa-clock" aria-hidden="true" /> {formatDateFr(composition.opensAt)} →{" "}
            {formatDateFr(composition.closesAt)} · {composition.participantsCount} participants ·{" "}
            {composition.attemptsAllowed} tentative(s)
          </p>
        </div>
        <div className="row" style={{ gap: 8, flexShrink: 0 }}>
          {live && !isTeacher ? (
            <Link href={`/examen/${composition.code}`} className="btn btn-primary btn-sm">
              <i className="fa-solid fa-door-open" aria-hidden="true" /> Rejoindre
            </Link>
          ) : (
            <Button variant="ghost" size="sm" disabled icon="fa-solid fa-lock">
              {composition.status === "scheduled" ? "Pas encore ouverte" : "Fermée"}
            </Button>
          )}
        </div>
      </div>
      {composition.status === "scheduled" ? (
        <p style={{ fontSize: "0.74rem", color: "var(--text-2)", marginTop: 10, marginBottom: 0 }}>
          Ouverture dans {formatRelativeFr(composition.opensAt)} (horloge simulée).
        </p>
      ) : null}
    </Card>
  );
}
