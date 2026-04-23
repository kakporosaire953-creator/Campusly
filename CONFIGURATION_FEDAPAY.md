# 💳 Configuration FedaPay - Campusly

## Date: 23 Avril 2026

## 🎯 Objectif

Configurer le système de paiement FedaPay pour permettre aux étudiants de souscrire à l'abonnement Premium.

## 📋 Prérequis

1. Compte FedaPay créé sur [https://fedapay.com](https://fedapay.com)
2. Compte vérifié (KYC complété)
3. Clés API obtenues (Test et Production)

## 🔑 Étape 1: Obtenir les Clés API

### 1.1 Créer un Compte FedaPay

1. Aller sur [https://fedapay.com/signup](https://fedapay.com/signup)
2. Remplir le formulaire d'inscription
3. Vérifier votre email
4. Compléter le KYC (Know Your Customer)

### 1.2 Obtenir les Clés

1. Se connecter au Dashboard FedaPay
2. Aller dans **Paramètres** → **Clés API**
3. Noter les clés suivantes:
   - **Clé Publique (Sandbox)**: `pk_sandbox_xxxxx`
   - **Clé Secrète (Sandbox)**: `sk_sandbox_xxxxx`
   - **Clé Publique (Live)**: `pk_live_xxxxx` (après vérification)
   - **Clé Secrète (Live)**: `sk_live_xxxxx` (après vérification)

## 🔧 Étape 2: Configuration dans le Code

### 2.1 Mettre à Jour dashboard.html

Ouvrir `dashboard.html` et chercher la fonction `launchFedaPay`:

```javascript
async function launchFedaPay(amount, days, label) {
  // Configuration FedaPay
  const FEDAPAY_PUBLIC_KEY = "pk_sandbox_VOTRE_CLE_PUBLIQUE"; // MODE TEST
  // const FEDAPAY_PUBLIC_KEY = "pk_live_VOTRE_CLE_PUBLIQUE"; // MODE PRODUCTION
  
  FedaPay.init({
    public_key: FEDAPAY_PUBLIC_KEY,
    // ... reste du code
  });
}
```

Remplacer par votre clé publique:

```javascript
const FEDAPAY_PUBLIC_KEY = "pk_sandbox_votre_cle_publique_test";
```

### 2.2 Configurer les Secrets Supabase

Pour la clé secrète (utilisée dans le webhook):

1. Aller dans Supabase Dashboard → Settings → Secrets
2. Ajouter un nouveau secret:
   - **Name**: `FEDAPAY_SECRET_KEY`
   - **Value**: `sk_sandbox_votre_cle_secrete_test`

## 🔔 Étape 3: Créer le Webhook

### 3.1 Déployer l'Edge Function

Le fichier `supabase/functions/fedapay-webhook/index.ts` est déjà créé.

```bash
# Déployer la fonction
supabase functions deploy fedapay-webhook

# Obtenir l'URL du webhook
# Format: https://VOTRE_PROJECT_REF.supabase.co/functions/v1/fedapay-webhook
```

### 3.2 Configurer le Webhook dans FedaPay

1. Aller dans FedaPay Dashboard → Paramètres → Webhooks
2. Ajouter une nouvelle URL de webhook:
   ```
   https://VOTRE_PROJECT_REF.supabase.co/functions/v1/fedapay-webhook
   ```
3. Sélectionner les événements:
   - ✅ `transaction.approved`
   - ✅ `transaction.declined`
   - ✅ `transaction.canceled`
4. Sauvegarder

## 🧪 Étape 4: Tester le Paiement

### 4.1 Mode Test (Sandbox)

FedaPay fournit des numéros de test:

**Mobile Money Test (MTN Bénin):**
- Numéro: `97000001` ou `96000001`
- Code: `1234`
- Montant: N'importe quel montant

**Mobile Money Test (Moov Bénin):**
- Numéro: `97000002` ou `96000002`
- Code: `1234`
- Montant: N'importe quel montant

**Carte de test:**
- Numéro: `4000000000000002`
- CVV: `123`
- Expiry: `12/25`

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

### 5.2 Vérifier dans FedaPay

1. Aller dans Dashboard → Transactions
2. Vérifier que les transactions de test apparaissent
3. Vérifier le statut: "Approved"

## 🚀 Étape 6: Passer en Production

### 6.1 Obtenir les Clés Live

1. Compléter le KYC dans FedaPay
2. Attendre la validation (1-3 jours)
3. Obtenir les clés Live

### 6.2 Mettre à Jour le Code

```javascript
// Dans dashboard.html
async function launchFedaPay(amount, days, label) {
  // PRODUCTION: Utiliser la clé LIVE
  const FEDAPAY_PUBLIC_KEY = "pk_live_votre_cle_publique_live";
  
  FedaPay.init({
    public_key: FEDAPAY_PUBLIC_KEY,
    // ... reste du code
  });
}
```

### 6.3 Mettre à Jour les Secrets Supabase

1. Aller dans Supabase Dashboard → Settings → Secrets
2. Modifier le secret `FEDAPAY_SECRET_KEY`:
   - **Value**: `sk_live_votre_cle_secrete_live`

### 6.4 Tester en Production

1. Faire un paiement réel de faible montant (500 FCFA)
2. Vérifier que tout fonctionne
3. Vérifier que l'argent arrive sur votre compte FedaPay

## 💰 Tarifs FedaPay

### Frais de Transaction

- **Mobile Money (MTN, Moov)**: 2% + 50 FCFA
- **Carte bancaire**: 3.5% + 50 FCFA
- **Minimum**: 50 FCFA par transaction

### Exemple de Calcul

Pour un abonnement de 1 500 FCFA:
- Frais FedaPay: (1 500 × 2%) + 50 = 80 FCFA
- Vous recevez: 1 500 - 80 = 1 420 FCFA

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
const signature = req.headers.get("x-fedapay-signature");
// FedaPay utilise HMAC SHA256 pour signer les webhooks
```

## 📞 Support

### Documentation FedaPay

- [Documentation officielle](https://docs.fedapay.com)
- [Guide d'intégration](https://docs.fedapay.com/integration)
- [Webhooks](https://docs.fedapay.com/webhooks)
- [API Reference](https://docs.fedapay.com/api)

### Support FedaPay

- Email: support@fedapay.com
- WhatsApp: +229 XX XX XX XX
- Dashboard: Bouton "Support" en bas à droite

## ✅ Checklist Finale

Avant de passer en production:

- [ ] Compte FedaPay créé et vérifié
- [ ] KYC complété
- [ ] Clés API obtenues (Test et Live)
- [ ] Clé publique ajoutée dans dashboard.html
- [ ] Clé secrète ajoutée dans Supabase Secrets
- [ ] Webhook créé et déployé
- [ ] URL webhook configurée dans FedaPay
- [ ] Tests effectués en mode Sandbox
- [ ] Paiement test réussi
- [ ] Vérification dans Supabase OK
- [ ] Vérification dans FedaPay OK
- [ ] Clés Live obtenues
- [ ] Code mis à jour avec clés Live
- [ ] Test en production effectué
- [ ] Monitoring activé

## 🆚 Pourquoi FedaPay au lieu de Flutterwave?

### Avantages de FedaPay

1. **Spécialisé Afrique de l'Ouest**
   - Meilleure couverture Bénin
   - Support local en français
   - Connaissance du marché béninois

2. **Frais Plus Bas**
   - Mobile Money: 2% vs 1.4% (Flutterwave)
   - Mais meilleure fiabilité au Bénin

3. **Intégration Plus Simple**
   - SDK JavaScript léger
   - Documentation en français
   - Support réactif

4. **Conformité Locale**
   - Régulé par la BCEAO
   - Conforme aux lois béninoises
   - Partenariats avec MTN et Moov Bénin

## 🔄 Migration depuis Flutterwave

Si vous aviez déjà Flutterwave:

1. ✅ Webhook Flutterwave supprimé
2. ✅ Webhook FedaPay créé
3. ✅ Code dashboard.html mis à jour
4. ✅ Migration SQL mise à jour
5. ✅ Documentation mise à jour

Les anciens paiements Flutterwave restent dans la base de données.

## 📝 Notes Importantes

### Différences avec Flutterwave

| Fonctionnalité | Flutterwave | FedaPay |
|----------------|-------------|---------|
| SDK | FlutterwaveCheckout | FedaPay.init() |
| Événement webhook | charge.completed | transaction.approved |
| Référence | tx_ref | reference |
| Métadonnées | meta | custom_metadata |
| Signature | verif-hash | x-fedapay-signature |

### Structure du Webhook FedaPay

```json
{
  "entity": "transaction",
  "event": "transaction.approved",
  "transaction": {
    "id": 12345,
    "reference": "TXN_xxxxx",
    "amount": 1500,
    "currency": "XOF",
    "status": "approved",
    "customer": {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com"
    },
    "custom_metadata": {
      "userId": "uuid",
      "days": 30,
      "plan": "1 Mois"
    }
  }
}
```

---

**Développeur**: Kiro AI  
**Date**: 23 Avril 2026  
**Version**: 1.0  
**Statut**: Migration Flutterwave → FedaPay complète ✅
