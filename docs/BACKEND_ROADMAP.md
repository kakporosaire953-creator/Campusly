# Feuille de route backend — Campusly

> **Périmètre** : ce document planifie la phase suivante. **Rien n'est implémenté ici** :
> pas de route API, pas de base, pas de Redis, pas de Better Auth, pas de FedaPay,
> pas de fonction IA, pas de déploiement Cloudflare. Le frontend actuel constitue le
> point de départ : ses contrats (`types/`) et ses services (`services/`) sont
> déjà écrits pour être remplacés par des implémentations réseau.

---

## 1. Principe directeur

> Le frontend ne change pas de forme quand le backend arrive :
> on remplace l'**implémentation** des services, pas leurs **signatures**.

Aujourd'hui :

```ts
// services/examService.ts
async requestDownload(examId: string): Promise<ExamDownloadTicket> {
  return { examId, url: `demo://r2/${examId}.pdf`, expiresAt, creditsSpent };
}
```

Demain :

```ts
async requestDownload(examId: string): Promise<ExamDownloadTicket> {
  return apiClient.post<ExamDownloadTicket>(`/api/exams/${examId}/download`);
}
```

Les composants, les états de chargement et les messages d'erreur restent identiques.

---

## 2. Découpage en lots

### Lot 0 — Préparation (1 semaine)

- Créer `migrations/` (Wrangler) à partir de `DATABASE_DESIGN.md`.
- Mettre en place l'adaptateur OpenNext dans la racine du dépôt (`wrangler.toml`, script `deploy`).
- Brancher `ApiClient` réel dans `services/api/client.ts` (fetch + gestion d'erreur).
- Ajouter un mode « API réelle » derrière un drapeau de configuration, sans supprimer
  les mocks (bascule progressive, retour arrière immédiat).
- Mettre en place la CI : typecheck, tests, build, `wrangler deploy --env preview`.

**Critère de sortie** : une route `GET /api/health` répond depuis un Worker de preview,
le frontend continue de fonctionner avec les mocks.

### Lot 1 — Authentification (2 semaines)

- Better Auth : inscription, connexion, déconnexion, session `httpOnly`.
- Table `users` + `user_sessions`, migration des profils existants (si export Supabase).
- Rôles `learner` / `teacher` / `admin`, statut `teacher_status`.
- Endpoints : `/api/auth/*`, `GET /api/auth/session`, `PATCH /api/users/me`.
- Rate limiting login/inscription (Redis).
- Suppression définitive du sélecteur de rôle de démonstration en production
  (conservé en preview).

**Critère de sortie** : session serveur réelle, cookies `Secure` + `SameSite=Lax`,
tests d'autorisation (un `learner` ne peut pas créer de composition).

### Lot 2 — Épreuves, R2 et crédits (3 semaines)

- Bucket R2 privé, URL présignées 5 minutes, en-têtes `attachment`.
- `GET /api/exams` (filtres + pagination + cache Redis), `GET /api/exams/:id`.
- Favoris, historique, contributions (upload direct R2 + finalisation).
- `credit_ledger` append-only + débit atomique via `env.DB.batch()`.
- Endpoints crédits : solde, historique, packs, estimation.

**Critère de sortie** : téléchargement réel d'un PDF, débit de crédits traçable,
impossible de télécharger un premium sans solde ni abonnement.

### Lot 3 — Paiements FedaPay (2 semaines)

- `POST /api/payments/intents` : création de transaction, montant décidé serveur.
- Webhook `POST /api/webhooks/fedapay` : vérification de signature, idempotence,
  écriture du ledger, mise à jour du statut.
- Abonnements : table `subscriptions`, calcul de la période, accès illimité.
- Reçus et historique.
- Tests : signature invalide, rejeu, montant falsifié, annulation.

**Critère de sortie** : parcours Mobile Money complet en mode test FedaPay, webhook
rejoué sans double crédit.

### Lot 4 — IA et quiz (3 semaines)

- Routeur multi-fournisseurs (au moins deux providers, bascule automatique).
- Analyse de document (PDF → texte via service d'extraction côté Worker).
- Génération de quiz avec sortie JSON validée par Zod.
- Correction serveur des tentatives (corrigés jamais exposés avant soumission).
- Quotas par utilisateur (Redis) et débit de crédits.
- File d'attente pour les opérations longues (Durable Object ou Queue).

**Critère de sortie** : génération réelle de quiz, coût IA mesuré, aucune fuite de
corrigé, dégradation propre en cas de panne fournisseur.

### Lot 5 — Classrooms et compositions (3 semaines)

- Classrooms : création, code d'invitation, adhésion, annonces, ressources.
- Compositions : création par un enseignant, fenêtre d'ouverture, sessions de copie,
  remise horodatée, journal d'intégrité, validation des notes.
- Anti-fraude : contrôle de fenêtre, tentative unique, `sessionId` serveur.
- Statistiques de classe (agrégats D1, cache Redis).

**Critère de sortie** : copie remise et corrigée côté serveur, note officielle après
validation, aucun corrigé dans le bundle.

### Lot 6 — Forum, notifications, administration (2 semaines)

- Forum avec modération, signalements, réponse acceptée, limites anti-spam.
- Notifications persistées (D1) + polling/Durable Object.
- Panneau admin : file de modération, demandes d'enseignant, `audit_log`.
- E-mails transactionnels (si validé par le porteur de projet).

**Critère de sortie** : modération traçable, aucune action admin sans entrée d'audit.

### Lot 7 — Durcissement et mise en production (2 semaines)

- CSP et en-têtes de sécurité au niveau Worker.
- Tests de charge (k6) sur les routes chaudes.
- Sauvegardes D1 automatisées vers R2 + test de restauration.
- Observabilité (logs, métriques, alertes).
- **Décision explicite du porteur de projet** avant bascule de domaine ; la version
  Vercel reste la référence tant que la validation n'est pas donnée.

**Critère de sortie** : bascule validée, plan de retour arrière documenté.

---

## 3. Inventaire des endpoints à produire

| Domaine | Endpoints | Détail |
| --- | --- | --- |
| Auth | 6 | `API_CONTRACTS.md` §1 |
| Utilisateurs | 4 | §2 |
| Épreuves | 8 | §3 |
| Quiz / IA | 7 | §4 |
| Classrooms | 7 | §5 |
| Compositions | 6 | §6 |
| Crédits | 6 | §7 |
| Paiements | 4 + webhook | §7 |
| Notifications | 5 | §8 |
| Forum | 6 | §9 |
| Admin | 4 | §10 |

Tous les endpoints sont décrits (entrée, sortie, erreurs, autorisation) dans
`API_CONTRACTS.md` ; aucun n'est implémenté à ce jour.

---

## 4. Travaux de migration Supabase

| Étape | Détail | Statut |
| --- | --- | --- |
| Export | Export SQL/CSV des 10 tables historiques | à faire (manuel, hors dépôt) |
| Mapping | `users→users`, `epreuves→exams`, `groups→classrooms`… | schéma défini |
| Dates | `timestamptz` → ISO-8601 `TEXT` | règle définie |
| Validation | `COUNT(*)` + échantillons comparés | à faire |
| Bascule | double lecture puis D1 seule | à faire |

**Contrainte absolue** : la base Supabase distante ne doit être ni supprimée ni
modifiée par le code de ce dépôt. Les artefacts `supabase/` et `js/` restent en place
comme référence historique.

---

## 5. Ce qui reste à trancher avec le porteur de projet

1. **Tarification** : la landing annonce des formules à 500 / 1 500 / 3 500 FCFA tandis
   que les packs de crédits sont à 500 / 1 000 / 2 500 FCFA. Deux grilles coexistent
   (signalé dans `PROJECT_AUDIT.md` §14). Une seule doit être retenue.
2. **Validation des enseignants** : automatique sur justificatif, ou manuelle par le
   secrétariat académique ?
3. **Compositions** : la surveillance caméra annoncée doit-elle être réellement
   implémentée (RGPD, consentement) ou retirée du discours produit ?
4. **Propriété intellectuelle des épreuves** : politique de retrait sur demande d'un
   enseignant.
5. **E-mails transactionnels** : nécessaires au lancement ou reportés ?
6. **Domaine** : `campusly.uac.bj` ou sous-domaine fourni par l'université.

---

## 6. Risques de la phase backend

| Risque | Mitigation |
| --- | --- |
| Écart entre contrats documentés et implémentation | types partagés, tests contractuels, revue systématique |
| Double dépense de crédits | transaction D1 + idempotence + tests concurrents |
| Webhook falsifié | signature obligatoire, rejeu idempotent, revérification de l'état |
| Coût IA non maîtrisé | quotas Redis, plafonds par utilisateur, alerte budget |
| Perte de données | exports D1 quotidiens vers R2, test de restauration mensuel |
| Confusion démo/production | drapeau d'environnement, suppression des mentions de démo uniquement quand l'API réelle est active |
| Régression visuelle | comparaison avec la version Vercel de référence avant bascule |

---

## 7. Définition de « terminé » pour la phase backend

- Toutes les opérations critiques (auth, crédits, paiement, IA, copies) sont
  autorisées côté serveur et couvertes par des tests.
- Aucun secret dans le bundle frontend.
- Aucune dépendance Supabase à l'exécution.
- Les 11 services du frontend pointent vers l'API réelle, avec les mocks conservés
  derrière un drapeau pour les démonstrations.
- Sauvegardes et restauration testées.
- Bascule de domaine explicitement validée par le porteur de projet.
