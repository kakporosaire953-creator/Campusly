/**
 * paymentService — socle frontend, AUCUN PAIEMENT
 * ---------------------------------------------------------------------------
 * Aucun prestataire n'est contacté et aucune « intention de paiement » locale
 * n'est fabriquée : une opération simulée laisserait croire à un achat réussi.
 * La création d'intention valide les champs puis répond que le service est
 * indisponible.
 *
 * En production, l'intégration sera :
 *   1. POST /api/payments/intents  → le serveur crée la transaction FedaPay
 *      et renvoie `checkoutUrl`.
 *   2. Le navigateur redirige vers la page FedaPay (aucune clé secrète côté client).
 *   3. FedaPay notifie POST /api/webhooks/fedapay (signature vérifiée côté serveur).
 *   4. Le serveur crédite le ledger et met à jour le statut.
 *   5. GET /api/payments/intents/:id permet au frontend de suivre le statut.
 */

import type {
  PaymentIntent,
  PaymentIntentInput,
  PaymentReceipt,
  PaymentServiceContract,
} from "@/types";
import { ApiError } from "./api/client";
import { demoDelay } from "./mocks/store";

const UNAVAILABLE = "Le paiement n'est pas encore ouvert.";

class PaymentService implements PaymentServiceContract {
  async createIntent(input: PaymentIntentInput): Promise<PaymentIntent> {
    await demoDelay(200);

    if (!input.packId && !input.planId) {
      throw ApiError.of("VALIDATION", "Aucune offre n'est disponible à la vente.");
    }
    if (input.amountXof <= 0) {
      throw ApiError.of("VALIDATION", "Montant invalide.");
    }
    if (input.provider !== "card" && !/^\+?229\d{8}$/.test((input.phoneNumber ?? "").replace(/\s/g, ""))) {
      throw ApiError.of("VALIDATION", "Numéro Mobile Money invalide (format Bénin attendu : +229 XX XX XX XX).", {
        phoneNumber: "Numéro invalide",
      });
    }

    throw ApiError.of("BACKEND_UNAVAILABLE", UNAVAILABLE);
  }

  async getStatus(): Promise<PaymentIntent> {
    await demoDelay(60);
    throw ApiError.of("BACKEND_UNAVAILABLE", UNAVAILABLE);
  }

  async cancel(): Promise<void> {
    await demoDelay(60);
    throw ApiError.of("BACKEND_UNAVAILABLE", UNAVAILABLE);
  }

  async receipts(): Promise<{ items: PaymentReceipt[]; total: number }> {
    await demoDelay(60);
    // Aucun encaissement n'a eu lieu : la liste reste vide par construction.
    return { items: [], total: 0 };
  }
}

export const paymentService = new PaymentService();
