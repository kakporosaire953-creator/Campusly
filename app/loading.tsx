export default function GlobalLoading() {
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }} role="status" aria-live="polite">
      <div style={{ textAlign: "center", color: "var(--text-2)", fontSize: "0.9rem" }}>
        <span className="loader-spinner" style={{ display: "inline-block", marginBottom: 12 }} aria-hidden="true" />
        <div>Chargement de Campusly…</div>
      </div>
    </div>
  );
}
