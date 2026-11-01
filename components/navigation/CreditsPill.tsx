"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { creditService } from "@/services/creditService";

/**
 * Pastille de crédits de l'en-tête.
 * Affiche un SOLDE DE DÉMONSTRATION : la valeur est locale et précédée de la
 * mention « démo » pour ne jamais laisser croire à un vrai solde.
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
      title="Solde de démonstration — voir le détail des crédits"
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
      <strong style={{ fontWeight: 800, color: "var(--text-1)" }}>
        {balance === null ? "—" : balance}
      </strong>
      <span style={{ fontSize: "0.72rem", color: "var(--text-2)" }}>crédits (démo)</span>
    </Link>
  );
}
