/**
 * Contrats Crédits & Paiements — Campusly
 * ---------------------------------------------------------------------------
 * Le solde de crédits est une donnée serveur stricte (table `credit_ledger`
 * en append-only). Le frontend ne calcule jamais un solde : il affiche ce que
 * renvoie l'API et déclenche des intentions de paiement.
 */

import type { PageQuery } from "./common";

export type CreditReason =
  | "signup_bonus"
  | "ai_analysis"
  | "quiz_generation"
  | "exam_download"
  | "topup"
  | "refund"
  | "admin_adjustment";

export interface CreditBalance {
  /** Solde disponible. */
  balance: number;
  /** Total consommé sur la période courante. */
  spentThisMonth: number;
  /** Prochaine réinitialisation éventuelle (formules incluses). */
  renewsAt?: string;
  /** Vrai si le compte dispose d'un accès illimité (abonnement). */
  unlimited: boolean;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  reason: CreditReason;
  label: string;
  occurredAt: string;
  /** Solde après opération, fourni par le serveur. */
  balanceAfter: number;
}

export interface CreditPack {
  id: string;
  label: string;
  credits: number;
  priceXof: number;
  popular?: boolean;
}

/** Formule d'abonnement (accès illimité pendant une durée donnée). */
export interface SubscriptionPlan {
  id: string;
  label: string;
  priceXof: number;
  /** Durée de la formule en jours. */
  days: number;
  features: string[];
  popular?: boolean;
}

export interface CreditServiceContract {
  getBalance(): Promise<CreditBalance>;
  history(query?: PageQuery): Promise<{ items: CreditTransaction[]; total: number }>;
  packs(): Promise<CreditPack[]>;
  /** Formules d'abonnement proposées (tarifs de la landing historique). */
  plans(): Promise<SubscriptionPlan[]>;
  /** Estimation du coût d'une action IA avant exécution. */
  estimate(action: Extract<CreditReason, "ai_analysis" | "quiz_generation" | "exam_download">, quantity?: number): Promise<{ cost: number }>;
}

/* ───────────────────────── Paiement (FedaPay) ───────────────────────── */

export type PaymentProvider = "mtn_momo" | "moov_money" | "card";
export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "cancelled";

export interface PaymentIntentInput {
  packId?: string;
  planId?: string;
  provider: PaymentProvider;
  /** Numéro Mobile Money au format international (Bénin : +229). */
  phoneNumber?: string;
  amountXof: number;
}

export interface PaymentIntent {
  id: string;
  reference: string;
  amountXof: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  /** URL de la page de paiement hébergée FedaPay (fournie par le backend). */
  checkoutUrl?: string;
  createdAt: string;
  expiresAt: string;
}

export interface PaymentReceipt {
  id: string;
  reference: string;
  amountXof: number;
  status: PaymentStatus;
  paidAt?: string;
  creditsGranted?: number;
  planLabel?: string;
}

export interface PaymentServiceContract {
  createIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  getStatus(intentId: string): Promise<PaymentIntent>;
  cancel(intentId: string): Promise<void>;
  receipts(query?: PageQuery): Promise<{ items: PaymentReceipt[]; total: number }>;
}
