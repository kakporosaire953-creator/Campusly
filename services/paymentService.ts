/**
 * paymentService — SIMULATION frontend, AUCUN PAIEMENT RÉEL
 * ---------------------------------------------------------------------------
 * Ce service ne contacte jamais FedaPay et ne crée aucun webhook.
 * Il fabrique une « intention de paiement » locale, immédiatement marquée
 * comme simulation, afin de valider le parcours utilisateur.
 *
 * En production, l'intégration sera :
 *   1. POST /api/payments/intents  → le Worker crée la transaction FedaPay
 *      et renvoie `checkoutUrl`.
 *   2. Le navigateur redirige vers la page FedaPay (aucune clé secrète côté client).
 *   3. FedaPay notifie POST /api/webhooks/fedapay (signature vérifiée côté Worker).
 *   4. Le Worker crédite le ledger et met à jour le statut.
 *   5. GET /api/payments/intents/:id permet au frontend de suivre le statut.
 */

import type {
  PaymentIntent,
  PaymentIntentInput,
  PaymentReceipt,
  PaymentServiceContract,
  PaymentStatus,
} from "@/types";
import { ApiError } from "./api/client";
import { DEMO_CREDIT_PACKS } from "./mocks/fixtures/credits";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const INTENTS_KEY = "payment-intents";

interface DemoIntent extends PaymentIntent {
  /** Toujours vrai : aucune intention n'est transmise à un prestataire. */
  simulation: true;
  packId?: string;
  planId?: string;
}

class PaymentService implements PaymentServiceContract {
  async createIntent(input: PaymentIntentInput): Promise<PaymentIntent> {
    await demoDelay(420);

    if (!input.packId && !input.planId) {
      throw ApiError.of("VALIDATION", "Sélectionnez une offre.");
    }
    if (input.amountXof <= 0) {
      throw ApiError.of("VALIDATION", "Montant invalide.");
    }
    if (input.provider !== "card" && !/^\+?229\d{8}$/.test((input.phoneNumber ?? "").replace(/\s/g, ""))) {
      throw ApiError.of("VALIDATION", "Numéro Mobile Money invalide (format Bénin attendu : +229 XX XX XX XX).", {
        phoneNumber: "Numéro invalide",
      });
    }

    const intent: DemoIntent = {
      id: uid("pay"),
      reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      amountXof: input.amountXof,
      provider: input.provider,
      status: "pending",
      // Aucune URL de paiement réelle n'est générée.
      checkoutUrl: undefined,
      createdAt: nowIso(),
      expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
      simulation: true,
      packId: input.packId,
      planId: input.planId,
    };

    const intents = demoStore.read<DemoIntent[]>(INTENTS_KEY, []);
    demoStore.write(INTENTS_KEY, [intent, ...intents].slice(0, 20));
    return intent;
  }

  async getStatus(intentId: string): Promise<PaymentIntent> {
    await demoDelay(60);
    const intent = demoStore.read<DemoIntent[]>(INTENTS_KEY, []).find((item) => item.id === intentId);
    if (!intent) throw ApiError.of("NOT_FOUND", "Intention de paiement introuvable.");
    return intent;
  }

  async cancel(intentId: string): Promise<void> {
    await demoDelay(80);
    const intents = demoStore.read<DemoIntent[]>(INTENTS_KEY, []);
    demoStore.write(
      INTENTS_KEY,
      intents.map((intent) => (intent.id === intentId ? { ...intent, status: "cancelled" as PaymentStatus } : intent)),
    );
  }

  async receipts(): Promise<{ items: PaymentReceipt[]; total: number }> {
    await demoDelay(60);
    return { items: [], total: 0 };
  }

  /**
   * Action de démonstration — clôture locale d'une intention.
   * Le nom de la méthode et la mention affichée dans l'interface indiquent
   * explicitement qu'il ne s'agit PAS d'un paiement.
   */
  async markDemoIntentAsSimulated(intentId: string): Promise<{ creditsGranted: number; label: string }> {
    await demoDelay(300);
    const intents = demoStore.read<DemoIntent[]>(INTENTS_KEY, []);
    const intent = intents.find((item) => item.id === intentId);
    if (!intent) throw ApiError.of("NOT_FOUND", "Intention de paiement introuvable.");

    const pack = DEMO_CREDIT_PACKS.find((item) => item.id === intent.packId);
    const creditsGranted = pack?.credits ?? 0;
    const label = pack
      ? `${pack.credits} crédits de démonstration (offre « ${pack.label} »)`
      : "Abonnement de démonstration (non activé)";

    demoStore.write(
      INTENTS_KEY,
      intents.map((item) =>
        item.id === intentId ? { ...item, status: "succeeded" as PaymentStatus } : item,
      ),
    );

    return { creditsGranted, label };
  }

  listDemoIntents(): DemoIntent[] {
    return demoStore.read<DemoIntent[]>(INTENTS_KEY, []);
  }
}

export const paymentService = new PaymentService();
