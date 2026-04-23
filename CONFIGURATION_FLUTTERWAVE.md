# 💳 Configuration Flutterwave - Campusly

## Date: 23 Avril 2026

## 🎯 Objectif

Configurer le système de paiement Flutterwave pour permettre aux étudiants de souscrire à l'abonnement Premium.

## 📋 Prérequis

1. Compte Flutterwave créé sur [https://flutterwave.com](https://flutterwave.com)
2. Compte vérifié (KYC complété)
3. Clés API obtenues (Test et Production)

## 🔑 Étape 1: Obtenir les Clés API

### 1.1 Créer un Compte Flutterwave

1. Aller sur [https://flutterwave.com/signup](https://flutterwave.com/signup)
2. Remplir le formulaire d'inscription
3. Vérifier votre email
4. Compléter le KYC (Know Your Customer)

### 1.2 Obtenir les Clés

1. Se connecter au Dashboard Flutterwave
2. Aller dans **Settings** → **API Keys**
3. Noter les clés suivantes:
   - **Public Key (Test)**: `FLWPUBK_TEST-xxxxx`
   - **Secret Key (Test)**: `FLWSECK_TEST-xxxxx`
   - **Public Key (Live)**: `FLWPUBK-xxxxx` (après vérification)
   - **Secret Key (Live)**: `FLWSECK-xxxxx` (après vérification)

## 🔧 Étape 2: Configuration dans le Code

### 2.1 Mettre à Jour dashboard.html

Ouvrir `dashboard.html` et chercher la fonction `launchFlutterwave`:

```javascript
function launchFlutterwave(amount, days, label) {
  FlutterwaveCheckout({
    public_key: "REMPLACE_PAR_TA_CLE_PUBLIQUE_FLUTTERWAVE", // ← À REMPLACER
    // ... reste du code
  });
}
```

Remplacer par:

```javascript
function launchFlutterwave(amount, days, label) {
  // Utiliser la clé TEST pour le développement
  const FLW_PUBLIC_KEY = "FLWPUBK_TEST-votre-cle-publique-test";
  
  // En production, utiliser la clé LIVE
  // const FLW_PUBLIC_KEY = "FLWPUBK-votre-cle-publique-live";
  
  FlutterwaveCheckout({
    public_key: FLW_PUBLIC_KEY,
    // ... reste du code
  });
}
```

### 2.2 Configurer les Secrets Supabase

Pour la clé secrète (utilisée dans le webhook):

1. Aller dans Supabase Dashboard → Settings → Secrets
2. Ajouter un nouveau secret:
   - **Name**: `FLUTTERWAVE_SECRET_KEY`
   - **Value**: `FLWSECK_TEST-votre-cle-secrete-test`

## 🔔 Étape 3: Créer le Webhook

### 3.1 Créer l'Edge Function

Créer le fichier `supabase/functions/flutterwave-webhook/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const FLW_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY");

serve(async (req) => {
  try {
    // Vérifier la signature Flutterwave
    const signature = req.headers.get("verif-hash");
    if (!signature || signature !== FLW_SECRET_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    
    // Vérifier que le paiement est réussi
    if (payload.status !== "successful") {
      return new Response("Payment not successful", { status: 200 });
    }

    // Extraire les données
    const { tx_ref, amount, customer, meta } = payload;
    const userId = meta?.userId;
    const days = meta?.days || 30;
    const planName = meta?.plan || "1 Mois";

    if (!userId) {
      throw new Error("User ID manquant");
    }

    // Créer le client Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Enregistrer le paiement
    await supabase.from("payments").insert({
      user_id: userId,
      amount: amount,
      currency: "XOF",
      duration_days: days,
      plan_name: planName,
      status: "successful",
      payment_method: payload.payment_type,
      transaction_id: payload.transaction_id,
      flutterwave_tx_ref: tx_ref,
      metadata: payload,
    });

    // Activer le Premium
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    await supabase
      .from("users")
      .update({
        is_premium: true,
        premium_expiry: expiryDate.toISOString(),
      })
      .eq("id", userId);

    // Créer une notification
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "system",
      title: "Premium activé !",
      message: `Votre abonnement ${planName} est maintenant actif. Profitez de toutes les fonctionnalités !`,
      link: "/dashboard.html",
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return new Response("Error", { status: 500 });
  }
});
```

### 3.2 Déployer le Webhook

```bash
# Déployer la fonction
supabase functions deploy flutterwave-webhook

# Obtenir l'URL du webhook
# Format: https://VOTRE_PROJECT_REF.supabase.co/functions/v1/flutterwave-webhook
```

### 3.3 Configurer le Webhook dans Flutterwave

1. Aller dans Flutterwave Dashboard → Settings → Webhooks
2. Ajouter une nouvelle URL de webhook:
   ```
   https://VOTRE_PROJECT_REF.supabase.co/functions/v1/flutterwave-webhook
   ```
3. Sélectionner les événements:
   - ✅ `charge.completed`
   - ✅ `transfer.completed`
4. Sauvegarder

## 🧪 Étape 4: Tester le Paiement

### 4.1 Mode Test

Flutterwave fournit des cartes de test:

**Carte de test réussie:**
- Numéro: `5531886652142950`
- CVV: `564`
- Expiry: `09/32`
- PIN: `3310`
- OTP: `12345`

**Mobile Money Test:**
- Numéro: `054XXXXXXX` (Bénin)
- Montant: N'importe quel montant

### 4.2 Procédure de Test

1. Aller sur `dashboard.html`
2. Cliquer sur "Abonnement" dans la sidebar
3. Choisir un plan (ex: 1 Semaine - 500 FCFA)
4. Cliquer sur "Choisir"
5. Remplir avec les données de test
6. Valider le paiement
7. Vérifier que:
   - ✅ Le statut Premium est activé
   - ✅ La date d'expiration est correcte
   - ✅ Le paiement est enregistré dans la table `payments`
   - ✅ Une notification est créée

## 📊 Étape 5: Vérification

### 5.1 Vérifier dans Supabase

```sql
-- Vérifier les paiements
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Vérifier les utilisateurs Premium
SELECT id, prenom, nom, is_premium, premium_expiry 
FROM users 
WHERE is_premium = true;

-- Vérifier les notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
```

### 5.2 Vérifier dans Flutterwave

1. Aller dans Dashboard → Transactions
2. Vérifier que les transactions de test apparaissent
3. Vérifier le statut: "Successful"

## 🚀 Étape 6: Passer en Production

### 6.1 Obtenir les Clés Live

1. Compléter le KYC dans Flutterwave
2. Attendre la validation (1-3 jours)
3. Obtenir les clés Live

### 6.2 Mettre à Jour le Code

```javascript
// Dans dashboard.html
function launchFlutterwave(amount, days, label) {
  // PRODUCTION: Utiliser la clé LIVE
  const FLW_PUBLIC_KEY = "FLWPUBK-votre-cle-publique-live";
  
  FlutterwaveCheckout({
    public_key: FLW_PUBLIC_KEY,
    // ... reste du code
  });
}
```

### 6.3 Mettre à Jour les Secrets Supabase

1. Aller dans Supabase Dashboard → Settings → Secrets
2. Modifier le secret `FLUTTERWAVE_SECRET_KEY`:
   - **Value**: `FLWSECK-votre-cle-secrete-live`

### 6.4 Tester en Production

1. Faire un paiement réel de faible montant (500 FCFA)
2. Vérifier que tout fonctionne
3. Vérifier que l'argent arrive sur votre compte Flutterwave

## 💰 Tarifs Flutterwave

### Frais de Transaction

- **Mobile Money (MTN, Moov)**: 1.4% + 100 FCFA
- **Carte bancaire**: 3.8%
- **Minimum**: 100 FCFA par transaction

### Exemple de Calcul

Pour un abonnement de 1 500 FCFA:
- Frais Flutterwave: (1 500 × 1.4%) + 100 = 121 FCFA
- Vous recevez: 1 500 - 121 = 1 379 FCFA

## 🔒 Sécurité

### Bonnes Pratiques

1. ✅ Ne jamais exposer la clé secrète dans le code client
2. ✅ Toujours vérifier la signature du webhook
3. ✅ Valider les montants côté serveur
4. ✅ Logger tous les paiements
5. ✅ Implémenter un système de retry pour les webhooks échoués

### Vérification de Signature

Le webhook vérifie automatiquement la signature:

```typescript
const signature = req.headers.get("verif-hash");
if (signature !== FLW_SECRET_KEY) {
  return new Response("Unauthorized", { status: 401 });
}
```

## 📞 Support

### Documentation Flutterwave

- [Documentation officielle](https://developer.flutterwave.com/docs)
- [Guide d'intégration](https://developer.flutterwave.com/docs/integration-guides)
- [Webhooks](https://developer.flutterwave.com/docs/webhooks)

### Support Flutterwave

- Email: support@flutterwave.com
- WhatsApp: +234 XXX XXX XXXX
- Dashboard: Bouton "Support" en bas à droite

## ✅ Checklist Finale

Avant de passer en production:

- [ ] Compte Flutterwave créé et vérifié
- [ ] KYC complété
- [ ] Clés API obtenues (Test et Live)
- [ ] Clé publique ajoutée dans dashboard.html
- [ ] Clé secrète ajoutée dans Supabase Secrets
- [ ] Webhook créé et déployé
- [ ] URL webhook configurée dans Flutterwave
- [ ] Tests effectués en mode Test
- [ ] Paiement test réussi
- [ ] Vérification dans Supabase OK
- [ ] Vérification dans Flutterwave OK
- [ ] Clés Live obtenues
- [ ] Code mis à jour avec clés Live
- [ ] Test en production effectué
- [ ] Monitoring activé

---

**Développeur**: Kiro AI  
**Date**: 23 Avril 2026  
**Version**: 1.0
