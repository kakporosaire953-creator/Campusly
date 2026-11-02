"use client";

import Link from "next/link";
import { creditService } from "@/services/creditService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { formatDateFr } from "@/services/mocks/store";

/**
 * Campusly Credits.
 * Le paiement et le grand livre des crédits reposent sur un backend absent :
 * la page explique ce qui n'est pas disponible et n'affiche ni solde inventé,
 * ni pack à vendre, ni transaction fictive.
 */
export function CreditsCenter() {
  const history = useAsync(() => creditService.history(), []);

  return (
    <div className="stack" style={{ gap: 22 }}>
      <PageHeader
        title="Campusly Credits"
        subtitle="Les crédits financeront les analyses de cours et les téléchargements d'épreuves. Le service n'est pas encore ouvert."
      />

      <Card>
        <CardHeader
          title="Crédits et paiement : pas encore disponibles"
          subtitle="Le solde et les achats nécessitent le backend de paiement (FedaPay), non déployé."
          icon="fa-solid fa-wallet"
        />
        <div className="availability-note">
          <p>
            Aucun crédit n&apos;est vendu, offert ni débité dans cette version. Rien n&apos;est prélevé et aucun
            numéro Mobile Money n&apos;est demandé.
          </p>
          <p style={{ marginBottom: 0 }}>
            Ce que les crédits couvriront une fois le service ouvert :
          </p>
          <ul>
            <li>analyser un cours importé et en extraire les notions clés ;</li>
            <li>préparer une série d&apos;entraînement ciblée sur une notion ;</li>
            <li>ouvrir les épreuves archivées de votre faculté.</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            En attendant, les exercices d&apos;entraînement et la bibliothèque d&apos;épreuves restent accessibles
            sans crédit.
          </p>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
            Aller aux entraînements
          </Link>
          <Link href="/dashboard/epreuves" className="btn btn-ghost btn-sm">
            Parcourir les épreuves
          </Link>
        </div>
      </Card>

      <Card>
        <CardHeader title="Historique des crédits" subtitle="Aucun mouvement tant que le service est fermé" icon="fa-solid fa-clock-rotate-left" />
        {history.status === "loading" || history.status === "idle" ? <LoadingGrid count={1} /> : null}
        {history.status === "error" ? <ErrorState message={history.error ?? "Historique indisponible."} onRetry={history.reload} /> : null}
        {history.status === "success" && (history.data?.items ?? []).length === 0 ? (
          <EmptyState
            icon="fa-regular fa-folder-open"
            title="Aucun mouvement"
            description="Chaque analyse, entraînement ou téléchargement apparaîtra ici avec son coût réel."
          />
        ) : null}
        {history.status === "success" && (history.data?.items ?? []).length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                  <th scope="col">Montant</th>
                </tr>
              </thead>
              <tbody>
                {(history.data?.items ?? []).map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDateFr(entry.occurredAt)}</td>
                    <td style={{ whiteSpace: "normal" }}>{entry.label}</td>
                    <td>{entry.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
