// ============================================================
// CAMPUSLY — Webhook FedaPay
// Gère les notifications de paiement de FedaPay
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FEDAPAY_SECRET_KEY = Deno.env.get("FEDAPAY_SECRET_KEY");

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-fedapay-signature",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🔔 Webhook FedaPay reçu");

    // Vérifier la clé secrète
    if (!FEDAPAY_SECRET_KEY) {
      console.error("❌ FEDAPAY_SECRET_KEY non configurée");
      throw new Error("Configuration manquante");
    }

    // Parser le payload
    const payload = await req.json();
    console.log("📦 Payload reçu:", JSON.stringify(payload, null, 2));

    // Vérifier la signature FedaPay (optionnel mais recommandé)
    const signature = req.headers.get("x-fedapay-signature");
    console.log("🔐 Signature reçue:", signature ? "Oui" : "Non");

    // FedaPay envoie les événements avec une structure spécifique
    const { entity, event } = payload;

    // Vérifier que c'est un événement de transaction
    if (entity !== "transaction" || event !== "transaction.approved") {
      console.log("⚠️ Événement non géré:", entity, event);
      return new Response(
        JSON.stringify({ message: "Event not handled" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extraire les données de la transaction
    const transaction = payload.transaction || {};
    const {
      id: transactionId,
      reference,
      amount,
      currency,
      status,
      customer,
      custom_metadata,
    } = transaction;

    console.log("💰 Transaction ID:", transactionId);
    console.log("💰 Montant:", amount, currency);
    console.log("📋 Statut:", status);

    // Vérifier que le paiement est approuvé
    if (status !== "approved") {
      console.log("⚠️ Paiement non approuvé:", status);
      return new Response(
        JSON.stringify({ message: "Payment not approved" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extraire les métadonnées personnalisées
    const userId = custom_metadata?.userId || custom_metadata?.user_id;
    const days = parseInt(custom_metadata?.days || "30");
    const planName = custom_metadata?.plan || custom_metadata?.planName || "1 Mois";

    console.log("👤 User ID:", userId);
    console.log("📅 Durée:", days, "jours");
    console.log("📋 Plan:", planName);

    if (!userId) {
      console.error("❌ User ID manquant dans custom_metadata");
      throw new Error("User ID manquant");
    }

    // Créer le client Supabase avec la clé service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Vérifier que l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, prenom, nom, email")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("❌ Utilisateur non trouvé:", userId);
      throw new Error("Utilisateur non trouvé");
    }

    console.log("✅ Utilisateur trouvé:", user.prenom, user.nom);

    // Enregistrer le paiement dans la base de données
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        amount: amount,
        currency: currency || "XOF",
        duration_days: days,
        plan_name: planName,
        status: "successful",
        payment_method: "fedapay",
        transaction_id: transactionId.toString(),
        fedapay_reference: reference,
        metadata: payload,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("❌ Erreur enregistrement paiement:", paymentError);
      throw paymentError;
    }

    console.log("✅ Paiement enregistré:", payment.id);

    // Calculer la date d'expiration
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    console.log("📅 Date d'expiration:", expiryDate.toISOString());

    // Activer le Premium pour l'utilisateur
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_premium: true,
        premium_expiry: expiryDate.toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Erreur activation Premium:", updateError);
      throw updateError;
    }

    console.log("✅ Premium activé pour l'utilisateur");

    // Créer une notification pour l'utilisateur
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: "system",
        title: "🎉 Premium activé !",
        message: `Votre abonnement ${planName} est maintenant actif jusqu'au ${expiryDate.toLocaleDateString("fr-FR")}. Profitez de toutes les fonctionnalités !`,
        link: "/dashboard.html#abonnement",
      });

    if (notifError) {
      console.warn("⚠️ Erreur création notification:", notifError);
      // Ne pas bloquer si la notification échoue
    } else {
      console.log("✅ Notification créée");
    }

    console.log("🎉 Webhook traité avec succès");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook traité avec succès",
        payment_id: payment.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Erreur serveur",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
