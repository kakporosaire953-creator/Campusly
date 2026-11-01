"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Exam, ExamFacets, ExamFilters, ExamType, LicenceLevel, Semester } from "@/types";
import { examService } from "@/services/examService";
import { useToast } from "@/components/ui/ToastProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { formatDateFr } from "@/services/mocks/store";

const PAGE_SIZE = 9;

/**
 * Bibliothèque d'épreuves : recherche, filtres, favoris et téléchargement
 * simulé. Les documents ne sont pas réellement disponibles (R2 non déployé) :
 * le tunnel l'indique explicitement.
 */
export function ExamLibrary({ initialFaculty }: { initialFaculty?: string }) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ExamFilters>({
    search: "",
    faculty: (initialFaculty as ExamFilters["faculty"]) ?? undefined,
    level: undefined,
    semester: undefined,
    academicYear: undefined,
    type: undefined,
    favoritesOnly: false,
    sortBy: "recent",
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [facets, setFacets] = useState<ExamFacets | null>(null);
  const [items, setItems] = useState<Exam[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloadTarget, setDownloadTarget] = useState<Exam | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await examService.list(filters);
      setItems(result.items);
      setTotal(result.total);
    } catch (cause) {
      setError("Impossible de charger la bibliothèque de démonstration.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    examService.facets().then(setFacets).catch(() => setFacets(null));
    examService.favorites().then((list) => setFavorites(list.map((exam) => exam.id)));
  }, []);

  const update = <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));

  const toggleFavorite = async (examId: string) => {
    const result = await examService.toggleFavorite(examId);
    setFavorites((current) =>
      result.favorited ? [...current, examId] : current.filter((id) => id !== examId),
    );
    toast(result.favorited ? "Ajouté aux favoris (démo)." : "Retiré des favoris (démo).", "info");
    if (filters.favoritesOnly) load();
  };

  const confirmDownload = async () => {
    if (!downloadTarget) return;
    await examService.requestDownload(downloadTarget.id);
    setDownloadTarget(null);
    toast("Téléchargement simulé : aucun fichier n'est stocké dans cette version.", "info");
  };

  const activeFilterCount = useMemo(
    () =>
      ["faculty", "level", "semester", "academicYear", "type"].filter(
        (key) => Boolean(filters[key as keyof ExamFilters]),
      ).length + (filters.favoritesOnly ? 1 : 0),
    [filters],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Bibliothèque d'épreuves"
        subtitle="Annales de l'Université, TD et corrections — contenus de démonstration."
        demo
        actions={
          <>
            <Link href="/contribuer" className="btn btn-outline btn-sm">
              <i className="fa-solid fa-upload" aria-hidden="true" /> Contribuer
            </Link>
            <Button
              size="sm"
              variant={filters.favoritesOnly ? "primary" : "ghost"}
              icon="fa-solid fa-star"
              aria-pressed={filters.favoritesOnly}
              onClick={() => update("favoritesOnly", !filters.favoritesOnly)}
            >
              Favoris ({favorites.length})
            </Button>
          </>
        }
      />

      <div
        className="card"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, alignItems: "end" }}
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examSearch">
            Rechercher
          </label>
          <input
            id="examSearch"
            className="form-input"
            type="search"
            placeholder="Matière, titre, tag…"
            value={filters.search ?? ""}
            onChange={(event) => update("search", event.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examFaculty">
            Faculté
          </label>
          <select
            id="examFaculty"
            className="form-select"
            value={filters.faculty ?? ""}
            onChange={(event) => update("faculty", (event.target.value || undefined) as ExamFilters["faculty"])}
          >
            <option value="">Toutes</option>
            {(facets?.faculties ?? []).map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examLevel">
            Niveau
          </label>
          <select
            id="examLevel"
            className="form-select"
            value={filters.level ?? ""}
            onChange={(event) => update("level", (event.target.value || undefined) as LicenceLevel | undefined)}
          >
            <option value="">Tous</option>
            {(facets?.levels ?? []).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examSemester">
            Semestre
          </label>
          <select
            id="examSemester"
            className="form-select"
            value={filters.semester ?? ""}
            onChange={(event) => update("semester", (event.target.value || undefined) as Semester | undefined)}
          >
            <option value="">Tous</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examYear">
            Année
          </label>
          <select
            id="examYear"
            className="form-select"
            value={filters.academicYear ?? ""}
            onChange={(event) => update("academicYear", event.target.value || undefined)}
          >
            <option value="">Toutes</option>
            {(facets?.academicYears ?? []).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="examType">
            Type
          </label>
          <select
            id="examType"
            className="form-select"
            value={filters.type ?? ""}
            onChange={(event) => update("type", (event.target.value || undefined) as ExamType | undefined)}
          >
            <option value="">Tous</option>
            {(facets?.types ?? []).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row-between">
        <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: 0 }} role="status">
          {loading ? "Chargement…" : `${total} épreuve${total > 1 ? "s" : ""} trouvée${total > 1 ? "s" : ""}`}
          {activeFilterCount > 0 ? ` · ${activeFilterCount} filtre(s) actif(s)` : ""}
        </p>
        <div className="row" style={{ gap: 8 }}>
          <label className="form-label" htmlFor="examSort" style={{ margin: 0, fontSize: "0.78rem" }}>
            Trier
          </label>
          <select
            id="examSort"
            className="form-select"
            style={{ padding: "6px 10px", fontSize: "0.8rem" }}
            value={filters.sortBy}
            onChange={(event) => update("sortBy", event.target.value as ExamFilters["sortBy"])}
          >
            <option value="recent">Plus récentes</option>
            <option value="downloads">Plus téléchargées</option>
            <option value="title">Titre (A-Z)</option>
          </select>
          {activeFilterCount > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              icon="fa-solid fa-eraser"
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  faculty: undefined,
                  level: undefined,
                  semester: undefined,
                  academicYear: undefined,
                  type: undefined,
                  favoritesOnly: false,
                  page: 1,
                }))
              }
            >
              Réinitialiser
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {!error && loading ? <LoadingGrid count={6} /> : null}

      {!error && !loading && items.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-folder-open"
          title="Aucune épreuve ne correspond"
          description="Modifiez vos filtres ou réinitialisez la recherche pour explorer toute la bibliothèque de démonstration."
          action={<Button variant="outline" onClick={() => setFilters({ page: 1, pageSize: PAGE_SIZE, sortBy: "recent", search: "" })}>Réinitialiser les filtres</Button>}
        />
      ) : null}

      {!error && !loading && items.length > 0 ? (
        <div className="grid-3">
          {items.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              favorite={favorites.includes(exam.id)}
              onToggleFavorite={() => toggleFavorite(exam.id)}
              onDownload={() => setDownloadTarget(exam)}
            />
          ))}
        </div>
      ) : null}

      {totalPages > 1 && !loading ? (
        <nav className="row" style={{ justifyContent: "center" }} aria-label="Pagination des épreuves">
          <Button
            variant="ghost"
            size="sm"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) - 1 }))}
          >
            Précédent
          </Button>
          <span style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
            Page {filters.page ?? 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={(filters.page ?? 1) >= totalPages}
            onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
          >
            Suivant
          </Button>
        </nav>
      ) : null}

      <Modal
        open={Boolean(downloadTarget)}
        onClose={() => setDownloadTarget(null)}
        title="Téléchargement simulé"
        description={downloadTarget?.title}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setDownloadTarget(null)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={confirmDownload} icon="fa-solid fa-download">
              Simuler le téléchargement
            </Button>
          </div>
        }
      >
        <div className="payment-notice" style={{ background: "rgba(245,124,0,0.1)" }}>
          <strong>Aucun fichier n&apos;est servi.</strong> Dans la version de production, le backend générera une
          URL signée R2 à durée de vie courte et débitera les crédits nécessaires.
        </div>
        <ul style={{ listStyle: "none", fontSize: "0.82rem", color: "var(--text-2)", display: "flex", flexDirection: "column", gap: 6 }}>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> Faculté : {downloadTarget?.faculty}
          </li>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> Année : {downloadTarget?.academicYear}
          </li>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> {downloadTarget?.pages} pages ·{" "}
            {downloadTarget?.isPremium ? "épreuve premium (5 crédits)" : "accès libre"}
          </li>
        </ul>
      </Modal>
    </div>
  );
}

function ExamCard({
  exam,
  favorite,
  onToggleFavorite,
  onDownload,
}: {
  exam: Exam;
  favorite: boolean;
  onToggleFavorite: () => void;
  onDownload: () => void;
}) {
  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="row-between" style={{ alignItems: "flex-start" }}>
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <span
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(21,101,192,0.1)",
              color: "var(--brand-1)",
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-file-pdf" />
          </span>
          <Badge tone={exam.isPremium ? "accent" : "neutral"}>{exam.isPremium ? "Premium" : "Libre"}</Badge>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={favorite}
          onClick={onToggleFavorite}
          style={{ width: 32, height: 32, color: favorite ? "var(--accent)" : "var(--text-2)" }}
        >
          <i className={favorite ? "fa-solid fa-star" : "fa-regular fa-star"} aria-hidden="true" />
        </button>
      </div>

      <div>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 4, lineHeight: 1.35 }}>
          <Link href={`/dashboard/epreuves/${exam.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            {exam.title}
          </Link>
        </h3>
        <p style={{ fontSize: "0.76rem", color: "var(--text-2)", margin: 0 }}>
          {exam.department} · {exam.level} · {exam.semester} · {exam.academicYear}
        </p>
      </div>

      <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
        <Badge tone="brand">{exam.type}</Badge>
        {exam.tags.slice(0, 2).map((tag) => (
          <span key={tag} style={{ fontSize: "0.7rem", color: "var(--text-2)", background: "var(--surface-2)", padding: "2px 8px", borderRadius: "var(--r-full)" }}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="row-between" style={{ marginTop: "auto", paddingTop: 6 }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>
          {exam.pages} p. · {exam.downloads} vues
        </span>
        <div className="row" style={{ gap: 6 }}>
          <Link href={`/dashboard/epreuves/${exam.id}`} className="btn btn-ghost btn-sm">
            Détails
          </Link>
          <Button size="sm" variant="primary" icon="fa-solid fa-download" onClick={onDownload} aria-label={`Télécharger ${exam.title}`} />
        </div>
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--text-3)" }}>Publié le {formatDateFr(exam.publishedAt)}</div>
    </article>
  );
}
