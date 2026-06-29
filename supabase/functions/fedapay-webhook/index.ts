// ============================================================
// CAMPUSLY — Edge Function: fedapay-webhook
// Reçoit les notifications de paiement FedaPay
// et met à jour le statut premium de l'utilisateur.
// ============================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Fedapay-Signature",
};

/**
 * Calcule le nombre de jours ajoutés selon le plan tarifaire.
 */
function getPlanDays(amount: number): number {
  if (amount >= 5000) return 365; // Annuel
  if (amount >= 2000) return 90;  // Trimestriel
  if (amount >= 1000) return 30;  // Mensuel
  return 7;                       // Hebdomadaire
}

/**
 * Vérifie la signature HMAC-SHA256 de FedaPay.
 * Docs : https://docs.fedapay.com/webhooks
 */
function verifySignature(body: string, signature: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    return expected === signature;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Lire le corps brut (nécessaire pour la vérification HMAC) ──
  const bodyText = await req.text();
  const signature = req.headers.get("X-Fedapay-Signature") || "";
  const secret    = Deno.env.get("FEDAPAY_SECRET_KEY") || "";

  // ── Vérifier la signature ────────────────────────────────────
  if (secret && !verifySignature(bodyText, signature, secret)) {
    console.warn("[fedapay-webhook] Signature invalide");
    return new Response(JSON.stringify({ error: "Signature invalide" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(bodyText);
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalide" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Client Supabase avec service_role (écriture sans RLS)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const eventName = (event.name as string) || "";

    // On traite uniquement les paiements approuvés
    if (eventName === "transaction.approved" || eventName === "transaction.succeeded") {
      const tx      = event.data as Record<string, unknown> & { object?: Record<string, unknown> };
      const txData  = (tx?.object || tx) as Record<string, unknown>;

      const txRef   = String(txData.reference     || txData.id || "");
      const amount  = Number(txData.amount        || 0);
      const userId  = String(txData.customer?.id  || txData.metadata?.user_id || "");
      const plan    = String(txData.metadata?.plan || "");
      const days    = getPlanDays(amount);

      if (!userId || !txRef) {
        console.warn("[fedapay-webhook] Données manquantes:", { userId, txRef });
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ── Upsert la transaction ─────────────────────────────
      await supabase.from("transactions").upsert({
        tx_ref:   txRef,
        user_id:  userId,
        amount,
        currency: "XOF",
        status:   "success",
        plan,
        days,
        provider: "fedapay",
      }, { onConflict: "tx_ref" });

      // ── Mettre à jour le statut premium ──────────────────
      // Calcul de la nouvelle date d'expiration
      const { data: currentUser } = await supabase
        .from("users")
        .select("premium_expiry")
        .eq("id", userId)
        .single();

      const now       = new Date();
      const baseDate  = currentUser?.premium_expiry && new Date(currentUser.premium_expiry) > now
        ? new Date(currentUser.premium_expiry) // Prolonger un abonnement en cours
        : now;

      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + days);

      await supabase.from("users").update({
        is_premium:     true,
        premium_expiry: newExpiry.toISOString(),
      }).eq("id", userId);

      console.log(`[fedapay-webhook] Premium activé pour ${userId} jusqu'au ${newExpiry.toISOString()}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[fedapay-webhook] Erreur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
