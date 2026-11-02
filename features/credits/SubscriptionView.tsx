"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";

/**
 * Mon abonnement.
 * Aucune formule n'est souscrite ni commercialisée dans cette version : la page
 * décrit ce qui arrivera quand le paiement sera branché, sans tarif inventé.
 */
export function SubscriptionView() {
  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Mon abonnement"
        subtitle="L'abonnement Campusly n'est pas encore ouvert. Aucune formule n'est vendue pour l'instant."
      />

      <Card>
        <CardHeader title="Statut actuel" subtitle="Aucun abonnement" icon="fa-solid fa-crown" />
        <div className="availability-note">
          <p>
            Il n&apos;existe aujourd&apos;hui ni formule, ni période d&apos;essai, ni prélèvement. Toutes les
            fonctionnalités accessibles le sont sans abonnement.
          </p>
          <p style={{ marginBottom: 0 }}>
            Quand le service ouvrira, vous retrouverez ici la date de fin de votre accès et l&apos;historique de vos
            paiements.
          </p>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/dashboard/revision" className="btn btn-primary btn-sm">
            Continuer à réviser
          </Link>
          <Link href="/dashboard/credits" className="btn btn-ghost btn-sm">
            Comprendre les crédits
          </Link>
        </div>
      </Card>

      <Card>
        <CardHeader title="Comment fonctionnera l'abonnement" subtitle="Cible technique — non implémentée" icon="fa-solid fa-diagram-project" />
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem", color: "var(--text-2)" }}>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> Le serveur crée une intention FedaPay et
            renvoie l&apos;URL de paiement hébergée.
          </li>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> FedaPay confirme par webhook signé ; le
            serveur vérifie la signature avant d&apos;écrire quoi que ce soit.
          </li>
          <li>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" /> L&apos;abonnement devient une période
            d&apos;accès, contrôlée côté serveur.
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
