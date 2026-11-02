/**
 * Crédits — listes vides par construction
 * ---------------------------------------------------------------------------
 * Le paiement n'est pas ouvert : aucun pack n'est vendu, aucune formule n'est
 * souscrite et aucun mouvement de crédit n'existe. Les tarifs seront arbitrés
 * avec le porteur de projet avant toute mise en vente, pas avant.
 */

import type { CreditPack, CreditTransaction } from "@/types";

export const DEMO_CREDIT_PACKS: CreditPack[] = [];

export const DEMO_SUBSCRIPTION_PLANS: Array<{
  id: string;
  label: string;
  priceXof: number;
  days: number;
  features: string[];
  popular?: boolean;
}> = [];

export const DEMO_CREDIT_TRANSACTIONS: CreditTransaction[] = [];
