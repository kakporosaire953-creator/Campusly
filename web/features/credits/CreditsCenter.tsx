"use client";

import { useState } from "react";
import type { CreditPack, PaymentIntent, PaymentProvider, SubscriptionPlan } from "@/types";
import { creditService, DEMO_CREDIT_COSTS } from "@/services/creditService";
import { paymentService } from "@/services/paymentService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, DemoBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/Field";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { formatDateFr } from "@/services/mocks/store";

const PROVIDERS: Array<{ id: PaymentProvider; label: string; icon: string; hint: string }> = [
  { id: "mtn_momo", label: "MTN MoMo", icon: "fa-solid fa-mobile-screen", hint: "+229 9x xx xx xx" },
  { id: "moov_money", label: "Moov Money", icon: "fa-solid fa-mobile-screen-button", hint: "+229 6x xx xx xx" },
  { id: "card", label: "Carte bancaire", icon: "fa-regular fa-credit-card", hint: "Visa / Mastercard via FedaPay" },
];

export function CreditsCenter() {
  const balance = useAsync(() => creditService.getBalance(), []);
  const history = useAsync(() => creditService.history(), []);
  const packs = useAsync(() => creditService.packs(), []);
  const plans = useAsync(() => creditService.plans(), []);
  const receipts = useAsync(() => paymentService.receipts(), []);
  const { toast } = useToast();

  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>("mtn_momo");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [busy, setBusy] = useState(false);

  const openCheckout = (pack?: CreditPack, plan?: SubscriptionPlan) => {
    setSelectedPack(pack ?? null);
    setSelectedPlan(plan ?? null);
    setIntent(null);
    setPhone("");
    setPhoneError(undefined);
  };

  const closeCheckout = () => {
    setSelectedPack(null);
    setSelectedPlan(null);
    setIntent(null);
  };

  const startPayment = async () => {
    if (provider !== "card" && phone.trim().replace(/\D/g, "").length < 8) {
      setPhoneError("Saisissez un numéro Mobile Money valide (8 chiffres minimum).");
      return;
    }
    setBusy(true);
    setPhoneError(undefined);
    try {
      const created = await paymentService.createIntent({
        packId: selectedPack?.id,
        planId: selectedPlan?.id,
        provider,
        phoneNumber: provider === "card" ? undefined : phone,
        amountXof: selectedPack?.priceXof ?? selectedPlan?.priceXof ?? 0,
      });
      setIntent(created);
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : "Paiement indisponible.", "danger");
    } finally {
      setBusy(false);
    }
  };

  const simulateSuccess = async () => {
    if (!intent) return;
    setBusy(true);
    try {
      const outcome = await paymentService.markDemoIntentAsSimulated(intent.id);
      toast(`${outcome.label} — simulation : aucun débit réel.`, "info");
      closeCheckout();
      balance.reload();
      history.reload();
      receipts.reload();
    } finally {
      setBusy(false);
    }
  };

  const amount = selectedPack?.priceXof ?? selectedPlan?.priceXof ?? 0;

  return (
    <div className="stack" style={{ gap: 22 }}>
      <PageHeader
        title="Campusly Credits"
        subtitle="Solde, historique et rechargement — le solde affiché est une donnée de démonstration."
        demo
        actions={<DemoBadge label="Aucun débit réel" />}
      />

      <div className="grid-2" style={{ alignItems: "stretch" }}>
        <Card>
          <CardHeader title="Solde" subtitle="Valeur fictive stockée dans votre navigateur" icon="fa-solid fa-wallet" />
          {balance.status === "loading" || balance.status === "idle" ? <LoadingGrid count={1} /> : null}
          {balance.status === "error" ? <ErrorState message={balance.error ?? "Solde indisponible."} onRetry={balance.reload} /> : null}
          {balance.status === "success" && balance.data ? (
            <>
              <div className="credit-balance-big">
                {balance.data.unlimited ? "Illimité" : balance.data.balance.toLocaleString("fr-FR")}
                <span>{balance.data.unlimited ? "" : "crédits"}</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginTop: 8 }}>
                {balance.data.spentThisMonth.toLocaleString("fr-FR")} crédits consommés ce mois-ci.
                {balance.data.renewsAt ? ` Renouvellement le ${formatDateFr(balance.data.renewsAt)}.` : ""}
              </p>
              <div className="demo-notice" style={{ marginTop: 12 }}>
                <i className="fa-solid fa-flask" aria-hidden="true" /> Ce solde n&apos;est pas un solde réel : il
                n&apos;existe aucun compte de paiement derrière cette valeur.
              </div>
            </>
          ) : null}
        </Card>

        <Card>
          <CardHeader title="Coût des actions" subtitle="Tarification de démonstration" icon="fa-solid fa-receipt" />
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Analyse d'un document", DEMO_CREDIT_COSTS.ai_analysis],
              ["Génération d'un quiz", DEMO_CREDIT_COSTS.quiz_generation],
              ["Téléchargement d'épreuve premium", DEMO_CREDIT_COSTS.exam_download],
            ].map(([label, cost]) => (
              <li key={String(label)} className="row-between" style={{ fontSize: "0.84rem", color: "var(--text-2)" }}>
                <span>{label}</span>
                <Badge tone="neutral">{cost} crédits</Badge>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="sm"
            icon="fa-solid fa-rotate-left"
            style={{ marginTop: 14 }}
            onClick={() => {
              creditService.reset();
              balance.reload();
              history.reload();
              toast("Crédits de démonstration réinitialisés.", "info");
            }}
          >
            Réinitialiser la démo
          </Button>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recharger mes crédits" subtitle="Packs de démonstration — paiement simulé" icon="fa-solid fa-bolt" />
        {packs.status === "loading" ? <LoadingGrid count={3} /> : null}
        {packs.status === "error" ? <ErrorState message={packs.error ?? "Packs indisponibles."} onRetry={packs.reload} /> : null}
        {packs.data ? (
          <div className="grid-3">
            {packs.data.map((pack) => (
              <div key={pack.id} className="card" style={{ borderColor: pack.popular ? "var(--accent)" : undefined }}>
                <div className="row-between" style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>{pack.label}</strong>
                  {pack.popular ? <Badge tone="accent">Populaire</Badge> : null}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--brand-1)" }}>
                  {pack.credits.toLocaleString("fr-FR")}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 600 }}> crédits</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-2)", marginBottom: 12 }}>
                  {pack.priceXof.toLocaleString("fr-FR")} FCFA
                </div>
                <Button variant="primary" size="sm" block onClick={() => openCheckout(pack, undefined)}>
                  Choisir ce pack
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Abonnements" subtitle="Formules mensuelles (simulation)" icon="fa-solid fa-crown" />
        {plans.status === "loading" ? <LoadingGrid count={3} /> : null}
        {plans.status === "error" ? <ErrorState message={plans.error ?? "Formules indisponibles."} onRetry={plans.reload} /> : null}
        {plans.data ? (
          <div className="grid-3">
            {plans.data.map((plan) => (
              <div key={plan.id} className="card" style={{ borderColor: plan.popular ? "var(--brand-1)" : undefined }}>
                <div className="row-between" style={{ marginBottom: 6 }}>
                  <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>{plan.label}</strong>
                  {plan.popular ? <Badge tone="brand">Recommandé</Badge> : null}
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-1)" }}>
                  {plan.priceXof.toLocaleString("fr-FR")} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)" }}>FCFA / mois</span>
                </div>
                <ul style={{ listStyle: "none", margin: "10px 0 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ fontSize: "0.78rem", color: "var(--text-2)" }}>
                      <i className="fa-solid fa-check" aria-hidden="true" style={{ color: "var(--success)" }} /> {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" block onClick={() => openCheckout(undefined, plan)}>
                  Souscrire (simulation)
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card>
          <CardHeader title="Historique des crédits" subtitle="Mouvements de démonstration" icon="fa-solid fa-clock-rotate-left" />
          {history.status === "loading" ? <LoadingGrid count={1} /> : null}
          {history.status === "error" ? <ErrorState message={history.error ?? "Historique indisponible."} onRetry={history.reload} /> : null}
          {history.status === "success" && (history.data?.items ?? []).length === 0 ? (
            <EmptyState icon="fa-regular fa-folder-open" title="Aucun mouvement" description="Vos analyses et téléchargements apparaîtront ici." />
          ) : null}
          {history.status === "success" && (history.data?.items ?? []).length > 0 ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                    <th scope="col">Montant</th>
                    <th scope="col">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {(history.data?.items ?? []).map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDateFr(entry.occurredAt)}</td>
                      <td style={{ whiteSpace: "normal" }}>{entry.label}</td>
                      <td style={{ color: entry.amount > 0 ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                        {entry.amount > 0 ? "+" : ""}
                        {entry.amount}
                      </td>
                      <td>{entry.balanceAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Card>

        <Card>
          <CardHeader title="Reçus" subtitle="Aucun paiement réel n'est enregistré" icon="fa-solid fa-file-invoice" />
          {receipts.status === "success" && (receipts.data?.items ?? []).length === 0 ? (
            <EmptyState icon="fa-regular fa-receipt" title="Aucun reçu" description="Les reçus apparaîtront après un paiement réel (non disponible ici)." />
          ) : null}
          {(receipts.data?.items ?? []).length > 0 ? (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {(receipts.data?.items ?? []).map((receipt) => (
                <li key={receipt.id} className="row-between" style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
                  <span>
                    {receipt.reference} · {receipt.amountXof.toLocaleString("fr-FR")} FCFA
                  </span>
                  <Badge tone={receipt.status === "succeeded" ? "success" : "neutral"}>{receipt.status}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>

      <Modal
        open={Boolean(selectedPack || selectedPlan)}
        onClose={closeCheckout}
        title={intent ? "Simulation de paiement" : "Finaliser votre commande"}
        description={selectedPack ? selectedPack.label : selectedPlan?.label}
        maxWidth={520}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={closeCheckout}>
              Annuler
            </Button>
            {intent ? (
              <Button variant="primary" onClick={simulateSuccess} disabled={busy}>
                Simuler la confirmation
              </Button>
            ) : (
              <Button variant="primary" onClick={startPayment} disabled={busy}>
                {busy ? "Création…" : "Continuer"}
              </Button>
            )}
          </div>
        }
      >
        <div className="payment-notice" style={{ background: "rgba(245,124,0,0.1)", marginBottom: 14 }}>
          <strong>Paiement simulé.</strong> Aucune transaction FedaPay n&apos;est initiée, aucun numéro n&apos;est
          transmis et aucun crédit réel n&apos;est acheté. Le backend générera l&apos;URL de paiement hébergée.
        </div>

        <div className="row-between" style={{ marginBottom: 14 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>Montant</span>
          <strong style={{ fontSize: "1rem", color: "var(--text-1)" }}>{amount.toLocaleString("fr-FR")} FCFA</strong>
        </div>

        <fieldset style={{ border: 0, padding: 0, margin: "0 0 14px" }}>
          <legend className="form-label">Moyen de paiement</legend>
          <div style={{ display: "grid", gap: 8 }}>
            {PROVIDERS.map((item) => (
              <label
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  border: `1.5px solid ${provider === item.id ? "var(--brand-1)" : "var(--border)"}`,
                  borderRadius: "var(--r-md)",
                  background: provider === item.id ? "rgba(21,101,192,0.06)" : "var(--surface)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  color: "var(--text-1)",
                }}
              >
                <input
                  type="radio"
                  name="provider"
                  value={item.id}
                  checked={provider === item.id}
                  onChange={() => setProvider(item.id)}
                />
                <i className={item.icon} aria-hidden="true" style={{ color: "var(--brand-1)" }} />
                <span style={{ fontWeight: 700 }}>{item.label}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-2)" }}>{item.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {provider !== "card" ? (
          <TextField
            label="Numéro Mobile Money"
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setPhoneError(undefined);
            }}
            placeholder="+229 97 00 00 00"
            inputMode="tel"
            error={phoneError}
            hint="Ce numéro n'est ni enregistré ni transmis (simulation)."
          />
        ) : null}

        {intent ? (
          <div style={{ fontSize: "0.8rem", color: "var(--text-2)", marginTop: 6 }}>
            <p>
              Intention créée localement : <code>{intent.reference}</code>
            </p>
            <p>Aucune page de paiement n&apos;est ouverte, car aucun service FedaPay n&apos;est connecté.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
