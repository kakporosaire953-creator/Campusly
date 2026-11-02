/**
 * creditService — socle frontend
 * ---------------------------------------------------------------------------
 * Le solde local démarre à zéro : aucun crédit n'est offert ni acheté tant que
 * le paiement n'est pas ouvert. Aucun pack ni abonnement n'est proposé à la
 * vente. En production :
 *   - le solde provient de la table `credit_ledger` (D1, append-only),
 *   - toute écriture est déclenchée par un Worker après vérification,
 *   - aucun crédit ne peut être ajouté depuis le client.
 *
 * Endpoints futurs : GET /api/credits/balance, GET /api/credits/history,
 * GET /api/credits/packs, POST /api/credits/estimate.
 */

import type {
  CreditBalance,
  CreditPack,
  CreditReason,
  CreditServiceContract,
  CreditTransaction,
  SubscriptionPlan,
} from "@/types";
import { DEMO_CREDIT_PACKS, DEMO_CREDIT_TRANSACTIONS, DEMO_SUBSCRIPTION_PLANS } from "./mocks/fixtures/credits";
import { demoDelay, demoStore, nowIso, uid } from "./mocks/store";

const BALANCE_KEY = "credits-balance";
const LEDGER_KEY = "credits-ledger";

/** Coût de démonstration par action IA. */
export const DEMO_CREDIT_COSTS: Record<string, number> = {
  ai_analysis: 25,
  quiz_generation: 10,
  exam_download: 5,
};

class CreditService implements CreditServiceContract {
  async getBalance(): Promise<CreditBalance> {
    await demoDelay(80);
    const balance = demoStore.read<number | null>(BALANCE_KEY, null);
    const ledger = this.ledger();
    const spentThisMonth = ledger
      .filter((entry) => entry.amount < 0 && entry.occurredAt.startsWith(new Date().toISOString().slice(0, 7)))
      .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);

    return {
      balance: balance ?? 0,
      spentThisMonth,
      unlimited: false,
      renewsAt: undefined,
    };
  }

  async history(): Promise<{ items: CreditTransaction[]; total: number }> {
    await demoDelay(90);
    const items = this.ledger();
    return { items, total: items.length };
  }

  async packs(): Promise<CreditPack[]> {
    await demoDelay(50);
    // Aucun pack n'est commercialisé : le paiement n'est pas ouvert.
    return DEMO_CREDIT_PACKS;
  }

  async plans(): Promise<SubscriptionPlan[]> {
    await demoDelay(50);
    // Aucune formule n'est souscrite pour l'instant ; la vente arrive avec le backend.
    return DEMO_SUBSCRIPTION_PLANS.map((plan) => ({
      id: plan.id,
      label: plan.label,
      priceXof: plan.priceXof,
      days: plan.days,
      features: [...plan.features],
      popular: "popular" in plan ? plan.popular : undefined,
    }));
  }

  async estimate(action: keyof typeof DEMO_CREDIT_COSTS, quantity = 1): Promise<{ cost: number }> {
    await demoDelay(30);
    const unit = DEMO_CREDIT_COSTS[action] ?? 0;
    return { cost: unit * quantity };
  }

  private ledger(): CreditTransaction[] {
    // Aucun crédit n'étant vendu ni débité, le grand livre reste vide tant que
    // le backend ne l'alimente pas.
    return demoStore.read<CreditTransaction[]>(LEDGER_KEY, DEMO_CREDIT_TRANSACTIONS);
  }

  private pushLedger(entry: CreditTransaction): void {
    demoStore.write(LEDGER_KEY, [entry, ...this.ledger()].slice(0, 40));
  }
}

export const creditService = new CreditService();
