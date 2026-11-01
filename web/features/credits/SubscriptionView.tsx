"use client";

import Link from "next/link";
import { creditService } from "@/services/creditService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";

export function SubscriptionView() {
  const balance = useAsync(() => creditService.getBalance(), []);
  const plans = useAsync(() => creditService.plans(), []);

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Mon abonnement"
        subtitle="Formules d'accès illimité — souscription simulée."
        demo
        actions={<DemoBadge label="Aucun prélèvement" />}
      />

      <Card>
        <CardHeader title="Statut actuel" subtitle="Donnée de démonstration" icon="fa-solid fa-crown" />
        {balance.status === "loading" || balance.status === "idle" ? <LoadingGrid count={1} /> : null}
        {balance.status === "error" ? <ErrorState message={balance.error ?? "Statut indisponible."} onRetry={balance.reload} /> : null}
        {balance.status === "success" && balance.data ? (
          balance.data.unlimited ? (
            <div>
              <Badge tone="success" icon="fa-solid fa-circle-check">
                Abonnement actif
              </Badge>
              <p style={{ fontSize: "0.84rem", color: "var(--text-2)", marginTop: 10 }}>
                Accès illimité jusqu&apos;au {balance.data.renewsAt ?? "—"}. Aucune facturation réelle n&apos;est
                effectuée dans cette version.
              </p>
            </div>
          ) : (
            <div>
              <Badge tone="neutral">Aucun abonnement actif</Badge>
              <p style={{ fontSize: "0.84rem", color: "var(--text-2)", marginTop: 10 }}>
                Vous utilisez actuellement des crédits à l&apos;unité (solde fictif :{" "}
                <strong>{balance.data.balance}</strong>). Choisissez une formule ci-dessous pour explorer le
                parcours de souscription — sans paiement réel.
              </p>
            </div>
          )
        ) : null}
      </Card>

      <div className="stack" style={{ gap: 14 }}>
        {plans.status === "loading" ? <LoadingGrid count={3} /> : null}
        {plans.status === "error" ? <ErrorState message={plans.error ?? "Formules indisponibles."} onRetry={plans.reload} /> : null}
        {plans.status === "success" && (plans.data ?? []).length === 0 ? (
          <EmptyState icon="fa-solid fa-crown" title="Aucune formule" description="Les formules d'abonnement seront publiées prochainement." />
        ) : null}
        {(plans.data ?? []).map((plan) => (
          <Card key={plan.id}>
            <div className="row-between" style={{ alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: "1rem", color: "var(--text-1)" }}>{plan.label}</strong>
                  {plan.popular ? <Badge tone="brand">Recommandé</Badge> : null}
                </div>
                <div style={{ fontSize: "0.84rem", color: "var(--text-2)", marginBottom: 8 }}>
                  {plan.days} jours d&apos;accès · épreuves premium incluses
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ fontSize: "0.78rem", color: "var(--text-2)" }}>
                      <i className="fa-solid fa-check" aria-hidden="true" style={{ color: "var(--success)" }} /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--brand-1)" }}>
                  {plan.priceXof.toLocaleString("fr-FR")}
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-2)" }}> FCFA</span>
                </div>
                <Link href="/dashboard/credits" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                  Souscrire (simulation)
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Comment sera géré l'abonnement ?" subtitle="Cible technique — non implémentée" icon="fa-solid fa-diagram-project" />
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem", color: "var(--text-2)" }}>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> Le Worker crée une intention FedaPay et
            renvoie l&apos;URL de paiement hébergée.
          </li>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> FedaPay confirme par webhook signé ; le
            Worker vérifie la signature puis écrit dans D1.
          </li>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> L&apos;abonnement est matérialisé par une
            période d&apos;accès (`subscriptions`) et un crédit illimité contrôlé côté serveur.
          </li>
        </ul>
        <p style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 10 }}>
          Aucun webhook, aucune clé et aucun appel FedaPay n&apos;existent dans ce frontend (voir
          <code> docs/API_CONTRACTS.md</code>).
        </p>
      </Card>
    </div>
  );
}
