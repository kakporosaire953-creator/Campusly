import { LoadingGrid } from "@/components/ui/States";

/** Écran de chargement de l'espace applicatif (squelettes, pas de spinner plein écran). */
export default function AppLoading() {
  return (
    <div style={{ padding: "24px 0" }} aria-busy="true">
      <div className="skeleton skeleton-line" style={{ width: 220, height: 22, marginBottom: 18 }} />
      <LoadingGrid count={3} />
    </div>
  );
}
