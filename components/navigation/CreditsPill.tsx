"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { creditService } from "@/services/creditService";

/**
 * Pastille de crédits de l'en-tête.
 * Le solde n'est pas encore servi par un backend : la pastille rappelle que les
 * crédits ne sont pas ouverts plutôt que d'afficher un nombre inventé.
 */
export function CreditsPill() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    creditService
      .getBalance()
      .then((value) => {
        if (!cancelled) setBalance(value.balance);
      })
      .catch(() => {
        if (!cancelled) setBalance(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/dashboard/credits"
      className="campusly-credits-pill"
      title="Crédits Campusly — service pas encore ouvert"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-full)",
        fontSize: "0.82rem",
        gap: 6,
        textDecoration: "none",
      }}
    >
      <i className="fa-solid fa-bolt" style={{ color: "var(--accent)" }} aria-hidden="true" />
      <strong style={{ fontWeight: 800, color: "var(--text-1)" }}>{balance === null ? "—" : balance}</strong>
      <span style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>crédits</span>
    </Link>
  );
}
