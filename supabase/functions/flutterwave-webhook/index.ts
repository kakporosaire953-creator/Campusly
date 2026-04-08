// ============================================================
// CAMPUSLY — Edge Function : flutterwave-webhook
// ============================================================
import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const secretHash = Deno.env.get("FLUTTERWAVE_SECRET_HASH");
    const signature  = req.headers.get("verif-hash");

    if (!secretHash || signature !== secretHash) {
      return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 401 });
    }

    const payload = await req.json();
    const txRef   = payload.txRef   || payload.tx_ref  || "";
    const flwRef  = payload.flwRef  || payload.flw_ref || "";
    const amount  = payload.amount  || 0;
    const status  = payload.status === "successful" ? "success" : "failed";
    const userId  = payload.meta?.userId || "";
    const days    = parseInt(payload.meta?.days || "30", 10);
    const plan    = payload.meta?.plan || "";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Enregistrer la transaction
    await supabase.from("transactions").insert({
      user_id:  userId || null,
      tx_ref:   txRef,
      flw_ref:  flwRef,
      amount,
      currency: payload.currency || "XOF",
      status,
      plan,
      days,
    });

    // Activer le premium si paiement réussi
    if (status === "success" && userId) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      await supabase.from("users").update({
        is_premium:     true,
        premium_expiry: expiry.toISOString(),
      }).eq("id", userId);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
});
