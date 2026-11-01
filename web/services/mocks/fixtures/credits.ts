/**
 * DONNÉES DE DÉMONSTRATION — crédits, packs et paiements
 * ---------------------------------------------------------------------------
 * Les tarifs reprennent ceux du design actuel (500 / 1 000 / 2 500 FCFA pour
 * les packs de crédits) et les plans historiques de la landing (500 / 1 500 /
 * 3 500 FCFA). À arbitrer avec le porteur de projet (voir PROJECT_AUDIT §14).
 */

import type { CreditPack, CreditTransaction } from "@/types";

export const DEMO_CREDIT_PACKS: CreditPack[] = [
  { id: "pack-discovery", label: "Découverte", credits: 100, priceXof: 500 },
  { id: "pack-revision", label: "Révision", credits: 250, priceXof: 1000, popular: true },
  { id: "pack-semester", label: "Semestre", credits: 700, priceXof: 2500 },
];

export const DEMO_SUBSCRIPTION_PLANS = [
  {
    id: "plan-week",
    label: "1 Semaine",
    priceXof: 500,
    days: 7,
    features: ["Épreuves premium incluses", "Quiz IA illimités", "Support prioritaire"],
  },
  {
    id: "plan-month",
    label: "1 Mois",
    priceXof: 1500,
    days: 30,
    popular: true,
    features: ["Épreuves premium incluses", "Quiz IA illimités", "Classrooms illimitées", "Support prioritaire"],
  },
  {
    id: "plan-quarter",
    label: "3 Mois",
    priceXof: 3500,
    days: 90,
    features: ["Tout le plan 1 Mois", "Deux semaines offertes", "Accès anticipé aux nouveautés"],
  },
] as const;

export const DEMO_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  { id: "trx-1", amount: -25, reason: "ai_analysis", label: "Analyse de document — cours-algorithmique-ch3.pdf", occurredAt: "2026-10-28T09:05:00.000Z", balanceAfter: 120 },
  { id: "trx-2", amount: -10, reason: "quiz_generation", label: "Génération de quiz — Algorithmique", occurredAt: "2026-10-30T09:00:00.000Z", balanceAfter: 110 },
  { id: "trx-3", amount: 250, reason: "topup", label: "Recharge pack Révision (1 000 FCFA)", occurredAt: "2026-10-26T18:40:00.000Z", balanceAfter: 145 },
  { id: "trx-4", amount: -5, reason: "exam_download", label: "Téléchargement — Algorithmique 2024-2025", occurredAt: "2026-10-27T18:22:00.000Z", balanceAfter: 140 },
  { id: "trx-5", amount: 50, reason: "signup_bonus", label: "Crédits de bienvenue", occurredAt: "2025-10-14T09:12:00.000Z", balanceAfter: 50 },
];
