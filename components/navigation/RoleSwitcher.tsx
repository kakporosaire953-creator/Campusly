"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/SessionProvider";
import { useToast } from "@/components/ui/ToastProvider";
import type { UserRole } from "@/types";
import { roleLabels } from "@/config/site";

const ROLES: UserRole[] = ["learner", "teacher", "admin"];

/**
 * Sélecteur de rôle de DÉMONSTRATION.
 * Il permet de visualiser les trois espaces sans backend. Il ne constitue en
 * aucun cas un contrôle d'accès : en production, le rôle est porté par la
 * session serveur (Better Auth) et vérifié à chaque requête.
 */
export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, switchRole } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleChange = async (next: UserRole) => {
    if (next === role || pending) return;
    setPending(true);
    try {
      await switchRole(next);
      toast(`Vue « ${roleLabels[next]} » activée (démonstration).`, "info");
      router.push(next === "teacher" ? "/enseignant" : next === "admin" ? "/admin" : "/dashboard");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      {!compact ? (
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-3)",
            marginBottom: 6,
          }}
        >
          Vue de démonstration
        </div>
      ) : null}
      <div
        role="group"
        aria-label="Changer de rôle (démonstration)"
        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
      >
        {ROLES.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            aria-pressed={role === item}
            disabled={pending}
            onClick={() => handleChange(item)}
            style={{ fontSize: "0.72rem", padding: "5px 10px" }}
          >
            {roleLabels[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
