import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { examService } from "@/services/examService";
import { ApiError } from "@/services/api/client";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ExamDetailActions } from "@/features/exams/ExamDetailActions";
import { formatDateFr } from "@/services/mocks/store";

export const metadata: Metadata = { title: "Fiche épreuve" };

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let exam;
  try {
    exam = await examService.getById(id);
  } catch (cause) {
    if (cause instanceof ApiError && cause.code === "NOT_FOUND") notFound();
    throw cause;
  }

  const related = (await examService.list({ faculty: exam.faculty, pageSize: 4 })).items.filter(
    (item) => item.id !== exam.id,
  );

  return (
    <div className="stack" style={{ gap: 20 }}>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
        <Link href="/dashboard/epreuves" style={{ color: "var(--brand-1)", fontWeight: 700 }}>
          Bibliothèque
        </Link>{" "}
        / <span>{exam.title}</span>
      </nav>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card>
          <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            <Badge tone="brand">{exam.type}</Badge>
            <Badge tone={exam.isPremium ? "accent" : "neutral"}>{exam.isPremium ? "Premium" : "Accès libre"}</Badge>
            <DemoBadge label="Épreuve fictive" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-1)", marginBottom: 8, lineHeight: 1.25 }}>
            {exam.title}
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginBottom: 18 }}>
            {exam.subject} · {exam.department} · {exam.faculty}
          </p>

          <dl className="profile-fields" style={{ marginBottom: 20 }}>
            {[
              ["Niveau", exam.level],
              ["Semestre", exam.semester],
              ["Année universitaire", exam.academicYear],
              ["Pages", String(exam.pages)],
              ["Consultations", String(exam.downloads)],
              ["Contributeur", exam.contributorName ?? "—"],
              ["Publié le", formatDateFr(exam.publishedAt)],
            ].map(([label, value]) => (
              <div className="profile-field" key={label}>
                <dt className="profile-field-label">{label}</dt>
                <dd className="profile-field-value">{value}</dd>
              </div>
            ))}
          </dl>

          <ExamDetailActions exam={exam} />
        </Card>

        <div className="stack" style={{ gap: 20 }}>
          <Card>
            <CardHeader title="Épreuves liées" icon="fa-solid fa-layer-group" />
            {related.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                Aucune autre épreuve de démonstration pour cette faculté.
              </p>
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/dashboard/epreuves/${item.id}`}
                      style={{
                        display: "block",
                        padding: 10,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        background: "var(--surface)",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-1)" }}>{item.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>
                        {item.level} · {item.academicYear} · {item.type}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Besoin de réviser ce sujet ?" icon="fa-solid fa-brain" />
            <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: 14 }}>
              Générez un quiz d&apos;entraînement sur cette matière avec Campusly AI (démonstration).
            </p>
            <Link href={`/dashboard/revision?subject=${encodeURIComponent(exam.subject)}`} className="btn btn-primary btn-sm">
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> Générer un quiz
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
