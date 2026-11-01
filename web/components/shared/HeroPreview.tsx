"use client";

import { useState } from "react";

/**
 * Aperçu interactif du hero (Mode Étudiant / Mode Professeur).
 * Reprise du composant historique `switchHeroTab`, avec des boutons réels
 * (accessibles au clavier) au lieu de `<button onclick>` inline.
 */
export function HeroPreview() {
  const [tab, setTab] = useState<"learner" | "teacher">("learner");

  return (
    <div className="hero-card" style={{ padding: 22, border: "1px solid var(--border-2)", background: "var(--bg-2)", borderRadius: "var(--r-2xl)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 12,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8 }} role="tablist" aria-label="Aperçu de Campusly">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "learner"}
            className={`tab-toggle-btn ${tab === "learner" ? "active" : ""}`}
            onClick={() => setTab("learner")}
          >
            <i className="fa-solid fa-user-graduate" aria-hidden="true" /> Mode Étudiant
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "teacher"}
            className={`tab-toggle-btn ${tab === "teacher" ? "active" : ""}`}
            onClick={() => setTab("teacher")}
          >
            <i className="fa-solid fa-chalkboard-user" aria-hidden="true" /> Mode Professeur
          </button>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--accent)",
            background: "rgba(245,124,0,0.1)",
            padding: "3px 8px",
            borderRadius: "var(--r-full)",
          }}
        >
          Aperçu
        </span>
      </div>

      {tab === "learner" ? <LearnerView /> : <TeacherView />}
    </div>
  );
}

function LearnerView() {
  return (
    <div role="tabpanel" aria-label="Vue étudiant">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(21,101,192,0.15)",
            color: "var(--brand-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-brain" />
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-1)" }}>
            Parcours Apprentissage IA
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
            Algorithmique &amp; Structures de données (FAST)
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          marginBottom: 16,
          background: "var(--surface)",
          padding: 10,
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--border)",
        }}
      >
        <WorkflowNode icon="fa-solid fa-file-pdf" label="Cours" tone="neutral" />
        <span className="hero-workflow-arrow" aria-hidden="true">→</span>
        <WorkflowNode icon="fa-solid fa-bolt" label="Campusly AI" tone="brand" />
        <span className="hero-workflow-arrow" aria-hidden="true">→</span>
        <WorkflowNode icon="fa-solid fa-bullseye" label="Quiz QCM" tone="accent" />
        <span className="hero-workflow-arrow" aria-hidden="true">→</span>
        <WorkflowNode icon="fa-solid fa-chart-line" label="Score 18/20" tone="success" />
      </div>

      <div
        style={{
          background: "var(--surface-2)",
          borderRadius: "var(--r-md)",
          padding: 12,
          marginBottom: 14,
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--text-2)",
            marginBottom: 8,
          }}
        >
          <span>Diagnostic adaptatif</span>
          <span style={{ color: "var(--brand-1)" }}>Niveau Apprenti</span>
        </div>
        <MasteryRow label="Algorithmes de tri (Quicksort / AVL)" value={50} tone="danger" caption="À renforcer" />
        <MasteryRow label="Bases de données SQL" value={93} tone="success" caption="Maîtrisé" />
        <MasteryRow label="Complexité asymptotique" value={72} tone="brand" caption="En progression" />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> Correction justifiée
        </span>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> 5 modes d&apos;entraînement
        </span>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> Progression suivie
        </span>
      </div>
    </div>
  );
}

function TeacherView() {
  return (
    <div role="tabpanel" aria-label="Vue professeur">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(245,124,0,0.15)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-chalkboard-user" />
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-1)" }}>
            Centre de pilotage pédagogique
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>L2 Informatique — Algorithmique</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <MiniStat label="Apprenants" value="68" icon="fa-solid fa-users" />
        <MiniStat label="Moyenne amphi" value="14,2/20" icon="fa-solid fa-chart-simple" />
        <MiniStat label="Rendus devoir #2" value="41 / 68" icon="fa-solid fa-file-signature" />
        <MiniStat label="À surveiller" value="6" icon="fa-solid fa-triangle-exclamation" />
      </div>

      <div
        style={{
          background: "rgba(245,124,0,0.08)",
          border: "1px solid rgba(245,124,0,0.25)",
          borderRadius: "var(--r-md)",
          padding: 12,
          fontSize: "0.8rem",
          color: "var(--text-2)",
          marginBottom: 14,
        }}
      >
        <strong style={{ color: "var(--text-1)" }}>Alerte pédagogique :</strong> 27 apprenants n&apos;ont pas
        encore soumis le devoir #2.
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> Code d&apos;amphi unique
        </span>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> Devoirs &amp; compositions
        </span>
        <span className="workflow-step-pill">
          <i className="fa-solid fa-check" aria-hidden="true" /> Analyse de classe
        </span>
      </div>
    </div>
  );
}

function WorkflowNode({
  icon,
  label,
  tone,
}: {
  icon: string;
  label: string;
  tone: "neutral" | "brand" | "accent" | "success";
}) {
  const color =
    tone === "brand"
      ? "var(--brand-1)"
      : tone === "accent"
        ? "var(--accent)"
        : tone === "success"
          ? "var(--success)"
          : "var(--text-1)";
  return (
    <div style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-2)" }}>
      <div style={{ fontSize: "1.1rem", marginBottom: 2, color }} aria-hidden="true">
        <i className={icon} />
      </div>
      {label}
    </div>
  );
}

function MasteryRow({
  label,
  value,
  tone,
  caption,
}: {
  label: string;
  value: number;
  tone: "brand" | "success" | "danger";
  caption: string;
}) {
  const color = tone === "danger" ? "var(--danger)" : tone === "success" ? "var(--success)" : "var(--brand-1)";
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3, gap: 8 }}>
        <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{caption}</span>
      </div>
      <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 10 }}>
      <div style={{ fontSize: "0.7rem", color: "var(--text-2)", fontWeight: 700, display: "flex", gap: 6, alignItems: "center" }}>
        <i className={icon} aria-hidden="true" /> {label}
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 900, color: "var(--text-1)", marginTop: 2 }}>{value}</div>
    </div>
  );
}
