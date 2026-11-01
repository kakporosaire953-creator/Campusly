"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ForumThread } from "@/types";
import { FACULTIES } from "@/types";
import { forumService } from "@/services/forumService";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError } from "@/services/api/client";
import { formatRelativeFr } from "@/services/mocks/store";

/**
 * Forum d'entraide. Les sujets, réponses et « j'aime » sont stockés dans le
 * navigateur : chaque création le rappelle explicitement. La modération réelle
 * et la persistance nécessiteront l'API backend.
 */
export function ForumBoard() {
  const { toast } = useToast();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "unanswered">("recent");
  const [solvedOnly, setSolvedOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<ForumThread | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await forumService.list({
        search: search || undefined,
        faculty: (faculty || undefined) as ForumThread["faculty"],
        sortBy,
        solved: solvedOnly ? true : undefined,
      });
      setThreads(result.items);
    } catch {
      setError("Le forum de démonstration est temporairement indisponible.");
    } finally {
      setLoading(false);
    }
  }, [search, faculty, sortBy, solvedOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const createThread = async () => {
    setBusy(true);
    setFormErrors({});
    try {
      const created = await forumService.createThread({
        title: form.title,
        content: form.content,
        faculty: faculty ? (faculty as ForumThread["faculty"]) : undefined,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setCreateOpen(false);
      setForm({ title: "", content: "", tags: "" });
      setThreads((current) => [created, ...current]);
      toast("Sujet publié localement (démonstration).", "success");
    } catch (cause) {
      if (cause instanceof ApiError) setFormErrors(cause.fields ?? { form: cause.message });
      else setFormErrors({ form: "Publication impossible." });
    } finally {
      setBusy(false);
    }
  };

  const openThread = async (thread: ForumThread) => {
    setSelected(thread);
    setReply("");
    try {
      const full = await forumService.getById(thread.id);
      setSelected(full);
    } catch {
      /* le sujet reste affiché tel quel */
    }
  };

  const sendReply = async () => {
    if (!selected || reply.trim().length === 0) return;
    setBusy(true);
    try {
      const created = await forumService.reply(selected.id, reply);
      setSelected((current) =>
        current ? { ...current, replies: [...(current.replies ?? []), created], repliesCount: current.repliesCount + 1 } : current,
      );
      setReply("");
      toast("Réponse publiée localement (démonstration).", "success");
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Réponse impossible.", "danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Forum & entraide"
        subtitle="Posez vos questions, partagez vos fiches et aidez les autres étudiants de l'UAC."
        demo
        actions={
          <Button size="sm" icon="fa-solid fa-plus" onClick={() => setCreateOpen(true)}>
            Nouveau sujet
          </Button>
        }
      />

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, alignItems: "end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="forum-search">
              Rechercher
            </label>
            <input
              id="forum-search"
              type="search"
              className="form-input"
              placeholder="Sujet, notion, tag…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="forum-faculty">
              Faculté
            </label>
            <select id="forum-faculty" className="form-select" value={faculty} onChange={(event) => setFaculty(event.target.value)}>
              <option value="">Toutes</option>
              {FACULTIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="forum-sort">
              Trier par
            </label>
            <select
              id="forum-sort"
              className="form-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
              <option value="unanswered">Sans réponse</option>
            </select>
          </div>
          <Button
            variant={solvedOnly ? "primary" : "outline"}
            size="sm"
            icon="fa-solid fa-circle-check"
            aria-pressed={solvedOnly}
            onClick={() => setSolvedOnly((current) => !current)}
          >
            Résolus
          </Button>
        </div>
      </Card>

      {loading ? <LoadingGrid count={3} /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error && threads.length === 0 ? (
        <EmptyState
          icon="fa-regular fa-comments"
          title="Aucun sujet trouvé"
          description="Ajustez votre recherche ou lancez la discussion en créant le premier sujet."
          action={<Button onClick={() => setCreateOpen(true)}>Créer un sujet</Button>}
        />
      ) : null}

      {!loading && !error && threads.length > 0 ? (
        <div className="stack" style={{ gap: 12 }}>
          {threads.map((thread) => (
            <article key={thread.id} className="card">
              <div className="row-between" style={{ alignItems: "flex-start", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    {thread.pinned ? <Badge tone="accent">Épinglé</Badge> : null}
                    {thread.solved ? <Badge tone="success">Résolu</Badge> : null}
                    {thread.author.badge ? <Badge tone="brand">{thread.author.badge}</Badge> : null}
                    {thread.faculty ? <Badge tone="neutral">{thread.faculty}</Badge> : null}
                  </div>
                  <h2 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-1)", margin: 0, lineHeight: 1.35 }}>
                    <button
                      type="button"
                      onClick={() => openThread(thread)}
                      style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", textAlign: "left", cursor: "pointer" }}
                    >
                      {thread.title}
                    </button>
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: "6px 0 0", lineHeight: 1.55 }}>
                    {thread.content.slice(0, 160)}
                    {thread.content.length > 160 ? "…" : ""}
                  </p>
                  <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {thread.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: "0.7rem", color: "var(--text-2)", background: "var(--surface-2)", padding: "2px 8px", borderRadius: "var(--r-full)" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, fontSize: "0.74rem", color: "var(--text-2)" }}>
                  <div>
                    <i className="fa-regular fa-message" aria-hidden="true" /> {thread.repliesCount}
                  </div>
                  <div>
                    <i className="fa-regular fa-eye" aria-hidden="true" /> {thread.views}
                  </div>
                  <div>{formatRelativeFr(thread.createdAt)}</div>
                </div>
              </div>
              <div className="row-between" style={{ marginTop: 10 }}>
                <span style={{ fontSize: "0.74rem", color: "var(--text-2)" }}>
                  par {thread.author.name}
                  {thread.author.role === "teacher" ? " · enseignant" : ""}
                </span>
                <div className="row" style={{ gap: 6 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="fa-regular fa-thumbs-up"
                    onClick={async () => {
                      const result = await forumService.toggleLike(thread.id);
                      setThreads((current) =>
                        current.map((item) => (item.id === thread.id ? { ...item, likes: result.likes } : item)),
                      );
                    }}
                  >
                    {thread.likes}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openThread(thread)}>
                    Lire
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader title="Règles de la communauté" subtitle="Modération à venir côté serveur" icon="fa-solid fa-scale-balanced" />
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem", color: "var(--text-2)" }}>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> Pas de contenu illicite, haineux ou diffamatoire.
          </li>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> Aucune épreuve sous droits d&apos;auteur sans autorisation.
          </li>
          <li>
            <i className="fa-solid fa-check" aria-hidden="true" /> Signalez les réponses erronées : la réputation est visible.
          </li>
        </ul>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nouveau sujet"
        description="Publication locale de démonstration"
        maxWidth={560}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={createThread} disabled={busy}>
              {busy ? "Publication…" : "Publier (démo)"}
            </Button>
          </div>
        }
      >
        <TextField
          label="Titre"
          value={form.title}
          onChange={(value) => setForm((current) => ({ ...current, title: value }))}
          placeholder="Ex : Différence entre pile et file ?"
          error={formErrors.title}
          required
        />
        <TextAreaField
          label="Votre question"
          value={form.content}
          onChange={(value) => setForm((current) => ({ ...current, content: value }))}
          placeholder="Décrivez votre problème, joignez le contexte (matière, chapitre)…"
          error={formErrors.content}
          required
        />
        <TextField
          label="Tags"
          value={form.tags}
          onChange={(value) => setForm((current) => ({ ...current, tags: value }))}
          placeholder="algorithmique, structures, L2"
          hint="Séparez les tags par des virgules."
        />
        <p style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
          Le sujet reste dans votre navigateur. En production, il sera modéré puis publié dans la faculté choisie.
        </p>
        {formErrors.form ? <p className="form-error">{formErrors.form}</p> : null}
      </Modal>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        description={selected ? `${selected.author.name} · ${formatRelativeFr(selected.createdAt)}` : undefined}
        maxWidth={680}
        footer={
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TextAreaField
              label="Votre réponse"
              value={reply}
              onChange={setReply}
              placeholder="Apportez une réponse argumentée et sourcée…"
              rows={3}
            />
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                Fermer
              </Button>
              <Button variant="primary" size="sm" onClick={sendReply} disabled={busy || reply.trim().length === 0}>
                Répondre (démo)
              </Button>
            </div>
          </div>
        }
      >
        <p style={{ fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.6 }}>{selected?.content}</p>
        <div className="row" style={{ gap: 6, margin: "12px 0" }}>
          {(selected?.tags ?? []).map((tag) => (
            <Badge key={tag} tone="neutral">
              #{tag}
            </Badge>
          ))}
        </div>
        <h4 style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>
          {(selected?.replies ?? []).length} réponse(s)
        </h4>
        {(selected?.replies ?? []).length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>Soyez le premier à répondre.</p>
        ) : (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {(selected?.replies ?? []).map((item) => (
              <li key={item.id} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: "var(--r-md)", background: "var(--surface)" }}>
                <div className="row-between" style={{ marginBottom: 4 }}>
                  <strong style={{ fontSize: "0.8rem", color: "var(--text-1)" }}>{item.author.name}</strong>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-2)" }}>{formatRelativeFr(item.createdAt)}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: 0, lineHeight: 1.55 }}>{item.content}</p>
                {item.accepted ? <Badge tone="success">Réponse acceptée</Badge> : null}
              </li>
            ))}
          </ul>
        )}
        <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 12 }}>
          <Link href="/dashboard/parametres" style={{ color: "var(--brand-1)" }}>
            Gérer mes notifications de forum
          </Link>
        </p>
      </Modal>
    </div>
  );
}
