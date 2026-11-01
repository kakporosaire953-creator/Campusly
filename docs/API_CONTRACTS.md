# Contrats d'API — Campusly

> **Statut** : spécification cible. **Aucune route API, aucun webhook, aucune Server
> Action métier n'est implémenté dans cette phase.** Les fonctions listées ici sont les
> cibles des services de `services/` ; les types cités existent déjà dans
> `types/` et constituent la référence partagée.

---

## 0. Conventions générales

| Aspect | Règle |
| --- | --- |
| Base | `https://<worker>/api` (même origine que le frontend) |
| Format | JSON `application/json; charset=utf-8` |
| Auth | cookie de session `httpOnly` (Better Auth) ; jamais de token en `localStorage` |
| Dates | chaînes ISO-8601 UTC (`2026-11-01T09:30:00Z`) |
| Identifiants | ULID/UUID en `string` |
| Pagination | `?page=1&pageSize=20` → `{ items, total }` (`PageQuery`) |
| Tri | `?sortBy=recent\|popular\|unanswered` (`SortQuery`) |
| Idempotence | en-tête `Idempotency-Key` obligatoire pour paiements et débits de crédits |
| Validation | Zod côté Worker ; en cas d'erreur, `fields` contient les messages par champ |

### Format d'erreur (uniforme)

```ts
import type { ApiErrorCode } from "@/types";

interface ApiErrorBody {
  error: {
    code: ApiErrorCode;          // "VALIDATION" | "UNAUTHENTICATED" | "FORBIDDEN"
                                 // | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED"
                                 // | "INSUFFICIENT_CREDITS" | "PROVIDER_ERROR" | "INTERNAL"
    message: string;             // message affichable à l'utilisateur (français)
    fields?: Record<string, string>; // erreurs de formulaire
    requestId: string;           // pour le support
  };
}
```

`services/api/client.ts` traduit ce corps en `ApiError` (`code`, `message`, `fields`),
ce qui permet aux formulaires d'afficher `cause.fields` sans logique supplémentaire.

---

## 1. Authentification (`authService`)

| Méthode | Route | Entrée | Sortie | Notes |
| --- | --- | --- | --- | --- |
| `getSession` | `GET /api/auth/session` | — | `AuthSession \| null` | 200 + `null` si non connecté |
| `login` | `POST /api/auth/login` | `LoginInput` | `AuthSession` | rate limit 5/min/IP ; cookie posé ici |
| `register` | `POST /api/auth/register` | `RegisterInput` | `AuthSession` | matricule 8 chiffres pour `learner` |
| `logout` | `POST /api/auth/logout` | — | `204` | invalide la session serveur |
| `updateProfile` | `PATCH /api/users/me` | `ProfileUpdateInput` | `UserProfile` | `email`/`matricule` non modifiables |
| `requestTeacherActivation` | `POST /api/teachers/requests` | `TeacherActivationInput` | `{ status: "pending" }` | crée une demande à valider par un admin |

Erreurs typiques : `VALIDATION` (400), `CONFLICT` (409, e-mail déjà utilisé),
`RATE_LIMITED` (429), `UNAUTHENTICATED` (401).

> Le frontend actuel simule ces appels : `authService.login` déduit un rôle de
> démonstration à partir de l'identifiant saisi et stocke la session dans `localStorage`.
> Aucune vérification de mot de passe n'a lieu — c'est explicitement indiqué dans l'UI.

---

## 2. Utilisateurs, profils et tableaux de bord (`userService`)

| Méthode | Route | Sortie |
| --- | --- | --- |
| `getLearnerDashboard` | `GET /api/me/dashboard` | `LearnerDashboard` |
| `getTeacherDashboard` | `GET /api/me/teaching` | `TeacherDashboard` |
| `getAdminOverview` | `GET /api/admin/overview` | `AdminOverview` |

Contenu des agrégats (déjà typés dans `types/dashboard.ts`) :

- `LearnerDashboard` : statistiques, reprise de révision (`resume`), maîtrise par
  matière (`mastery`), compositions à venir, activité récente, classrooms, épreuves
  recommandées.
- `TeacherDashboard` : totaux (classes, apprenants, copies), alertes pédagogiques,
  tableau des classes, copies à corriger, actions rapides.
- `AdminOverview` : totaux utilisateurs (apprenants/enseignants/demandes en attente),
  file de modération, consommation IA du mois.

**Autorisation** : `getAdminOverview` exige `role = "admin"` (403 sinon) ; les deux
autres exigent une session valide et renvoient uniquement les données de l'appelant.

---

## 3. Épreuves, favoris et historique (`examService`)

| Méthode | Route | Entrée | Sortie |
| --- | --- | --- | --- |
| `list` | `GET /api/exams` | `ExamFilters` (query) | `{ items: Exam[]; total: number }` |
| `getById` | `GET /api/exams/:id` | — | `Exam` |
| `facets` | `GET /api/exams/facets` | — | `ExamFacets` |
| `favorites` | `GET /api/me/favorites` | — | `Exam[]` |
| `toggleFavorite` | `POST /api/me/favorites` | `{ examId }` | `{ favorited: boolean }` |
| `requestDownload` | `POST /api/exams/:id/download` | — | `ExamDownloadTicket` |
| `history` | `GET /api/me/history` | `PageQuery` | `ExamHistoryEntry[]` |
| `submitContribution` | `POST /api/contributions` | `ExamContributionInput` | `Contribution` |

`ExamFilters` : `search`, `faculty`, `department`, `level`, `semester`,
`academicYear`, `type`, `favoritesOnly`, `sortBy`, `page`, `pageSize`.

**Téléchargement — règles serveur** :

1. session valide requise ;
2. si abonnement actif → `creditsSpent = 0` ;
3. sinon si `exam.is_premium` → débit de 5 crédits **atomique** (ledger + idempotence) ;
4. génération d'une URL présignée R2 valable 5 minutes ;
5. écriture dans `exam_history` (`action = 'download'`).

**Contribution** : le fichier ne transite pas dans le même appel. Séquence cible :

```
POST /api/contributions           → { id, uploadUrl, expiresAt }   (URL présignée R2)
PUT  <uploadUrl>                  → binaire (direct vers R2)
POST /api/contributions/:id/finalize → { status: "pending" }
```

La contribution apparaît ensuite dans la file de modération admin.

---

## 4. Quiz et IA (`quizService`, `aiService`)

| Méthode | Route | Entrée | Sortie | Coût |
| --- | --- | --- | --- | --- |
| `generate` | `POST /api/quizzes` | `QuizGenerationInput` | `Quiz` | 10 crédits |
| `getById` | `GET /api/quizzes/:id` | — | `Quiz` |
| `submitAttempt` | `POST /api/quizzes/:id/attempts` | `QuizAttemptInput` | `QuizAttemptResult` |
| `attempts` | `GET /api/me/quiz-attempts` | `PageQuery` | `QuizAttemptResult[]` |
| `analyzeDocument` | `POST /api/ai/document-analysis` | `{ fileKey, fileName, faculty, subject }` | `DocumentAnalysis` | 25 crédits |
| `chat` | `POST /api/ai/chat` | `AiChatInput` | `AiChatReply` | selon quotas |
| `status` | `GET /api/ai/status` | — | `AiProviderStatus` |

**Génération** : le Worker appelle le routeur IA (multi-fournisseurs) avec un prompt
contraint (JSON strict), valide la réponse avec Zod, refuse les contenus hors
périmètre académique, puis déduit les crédits. En cas d'échec fournisseur :
`PROVIDER_ERROR` (502) **sans débit**.

**Correction** : `submitAttempt` corrige côté serveur (les corrigés ne sont jamais
envoyés au navigateur avant soumission) et renvoie `questions[]` avec
`earnedPoints`/`maxPoints`/`explanation`. Le frontend actuel corrige localement à
partir des corrigés de démonstration — d'où la mention « correction locale ».

**Chat** : `AiChatReply` contient `message` (`AiChatMessage`) et éventuellement
`footnotes: string[]`. Le Worker filtre les données personnelles et journalise
l'usage ; aucune conversation n'est conservée sans consentement.

---

## 5. Classrooms (`classroomService`)

| Méthode | Route | Entrée | Sortie | Rôle |
| --- | --- | --- | --- | --- |
| `list` | `GET /api/classrooms` | — | `Classroom[]` | membre |
| `getById` | `GET /api/classrooms/:id` | — | `ClassroomDetail` | membre |
| `analytics` | `GET /api/classrooms/:id/analytics` | — | `ClassroomAnalytics` | owner/assistant |
| `create` | `POST /api/classrooms` | `CreateClassroomInput` | `Classroom` | teacher/admin |
| `join` | `POST /api/classrooms/join` | `{ code }` | `Classroom` | learner |
| `leave` | `DELETE /api/classrooms/:id/members/me` | — | `204` | membre |
| `addPost` | `POST /api/classrooms/:id/posts` | `{ content }` | `ClassroomPost` | teacher/owner |

Règles : code d'invitation à 6 caractères, insensible à la casse, à usage unique
contrôlé par classe ; un `learner` ne peut pas publier d'annonce (403) ; les
statistiques d'analytics sont agrégées côté serveur (`classAverage`,
`participationRate`, `strugglingCount`).

---

## 6. Compositions (`compositionService`)

| Méthode | Route | Entrée | Sortie | Rôle |
| --- | --- | --- | --- | --- |
| `list` | `GET /api/compositions` | — | `Composition[]` | selon rôle |
| `getById` | `GET /api/compositions/:id` | — | `Composition` | inscrit |
| `findByCode` | `GET /api/compositions/by-code/:code` | — | `Composition` | inscrit |
| `submit` | `POST /api/compositions/:id/attempts` | `CompositionAttemptInput` | `CompositionCopy` | inscrit |
| `copies` | `GET /api/compositions/:id/copies` | — | `CompositionCopy[]` | teacher/owner |

### 6.1 Séquence de remise (acte serveur critique)

```
POST /api/compositions/:id/sessions   → { sessionId, serverTime, closesAt }
                                       (le serveur fige l'heure d'ouverture)
… réponses conservées côté client …
POST /api/compositions/:id/attempts   → CompositionCopy
   body: { answers, proctorEvents, durationSeconds, sessionId }
```

Contrôles serveur :

1. fenêtre ouverte (`opens_at <= now <= closes_at`) ;
2. tentative restante (`attempts_allowed`) — `CONFLICT` sinon ;
3. `sessionId` valide et non expiré ;
4. correction effectuée côté Worker (corrigés jamais exposés avant) ;
5. `validation = 'pending_review'` : la note n'est **pas** officielle avant validation
   par l'enseignant (`PATCH /api/compositions/copies/:copyId/validate`).

`proctor_events` sont stockés mais **ne déclenchent aucune sanction automatique** :
ils alimentent la revue humaine (et, dans la version actuelle, un simple journal local).

---

## 7. Crédits et paiements (`creditService`, `paymentService`)

| Méthode | Route | Entrée | Sortie |
| --- | --- | --- | --- |
| `getBalance` | `GET /api/credits/balance` | — | `CreditBalance` |
| `history` | `GET /api/credits/history` | `PageQuery` | `{ items: CreditTransaction[]; total }` |
| `packs` | `GET /api/credits/packs` | — | `CreditPack[]` |
| `plans` | `GET /api/credits/plans` | — | `SubscriptionPlan[]` |
| `estimate` | `GET /api/credits/estimate?action=…&quantity=…` | — | `{ cost: number }` |
| `createIntent` | `POST /api/payments/intents` | `PaymentIntentInput` | `PaymentIntent` |
| `getStatus` | `GET /api/payments/intents/:id` | — | `PaymentIntent` |
| `cancel` | `POST /api/payments/intents/:id/cancel` | — | `PaymentIntent` |
| `receipts` | `GET /api/me/receipts` | `PageQuery` | `{ items: PaymentReceipt[]; total }` |

### 7.1 Parcours de paiement (cible)

```
Frontend                         Worker                         FedaPay
   │  POST /api/payments/intents    │                              │
   ├───────────────────────────────►│  crée la transaction ───────►│
   │                                │◄──── checkoutUrl ────────────┤
   │◄── { id, checkoutUrl, … } ─────┤                              │
   │  redirection vers FedaPay ────────────────────────────────────►
   │                                │◄──── webhook signé ──────────┤
   │                                │ vérifie la signature          │
   │                                │ écrit credit_ledger (idempotent)
   │                                │ met à jour payment_intents    │
   │  GET .../intents/:id (polling) │                              │
   │◄── { status: "succeeded" } ────┤                              │
```

Règles :

- **Aucune clé secrète côté navigateur** ; `checkoutUrl` est fournie par le backend.
- Le montant est décidé **serveur** (pack/plan) — le client ne peut pas forger un prix.
- Webhook : signature vérifiée, idempotence par `fedapay_ref`, rejeu sans effet.
- Crédits accordés uniquement sur `succeeded`, jamais sur `pending`.

Dans la version actuelle, `paymentService.createIntent` renvoie une intention locale
`simulation: true`, **sans `checkoutUrl`**, et `markDemoIntentAsSimulated` crédite un
solde fictif explicitement affiché comme tel.

---

## 8. Notifications (`notificationService`)

| Méthode | Route | Sortie |
| --- | --- | --- |
| `list` | `GET /api/notifications?unreadOnly=&page=` | `{ items: AppNotification[]; total; unread }` |
| `markAsRead` | `PATCH /api/notifications/:id` | `204` |
| `markAllAsRead` | `POST /api/notifications/read-all` | `{ updated: number }` |
| `preferences` | `GET /api/notifications/preferences` | `NotificationPreferences` |
| `updatePreferences` | `PATCH /api/notifications/preferences` | `NotificationPreferences` |

Diffusion cible : polling court (30 s) ou Durable Object par utilisateur. Aucun e-mail
transactionnel dans cette phase ; les préférences sont stockées localement.

---

## 9. Forum (`forumService`)

| Méthode | Route | Entrée | Sortie |
| --- | --- | --- | --- |
| `list` | `GET /api/forum/threads` | `ForumQuery` | `{ items: ForumThread[]; total }` |
| `getById` | `GET /api/forum/threads/:id` | — | `ForumThread` (avec `replies`) |
| `createThread` | `POST /api/forum/threads` | `CreateThreadInput` | `ForumThread` |
| `reply` | `POST /api/forum/threads/:id/replies` | `{ content }` | `ForumReply` |
| `toggleLike` | `POST /api/forum/threads/:id/like` | — | `{ liked, likes }` |
| `acceptReply` | `POST /api/forum/threads/:id/accept/:replyId` | — | `ForumReply` |

Modération : tout nouveau sujet passe en `status = 'pending'` si l'auteur est nouveau
ou si un filtre anti-spam se déclenche ; `acceptReply` réservé à l'auteur du sujet ou
à un enseignant ; limite de publication (5 sujets/heure/utilisateur, Redis).

---

## 10. Administration

| Méthode | Route | Entrée | Sortie |
| --- | --- | --- | --- |
| `overview` | `GET /api/admin/overview` | — | `AdminOverview` |
| `moderateContribution` | `POST /api/admin/contributions/:id/review` | `{ decision: "approved"\|"rejected"; note?: string }` | `Contribution` |
| `teacherRequests` | `GET /api/admin/teacher-requests` | — | `TeacherActivationInput[]` |
| `decideTeacherRequest` | `POST /api/admin/teacher-requests/:id` | `{ decision }` | `{ status }` |

Toute action admin écrit dans `audit_log` (`actor_id`, `action`, `target`, `metadata`).
Le panneau admin du frontend actuel **ne modifie rien** : les décisions sont locales et
précisées comme simulations.

---

## 11. Codes d'erreur et messages

| Code HTTP | `code` | Cas d'usage | Message type |
| --- | --- | --- | --- |
| 400 | `VALIDATION` | formulaire incomplet / format invalide | « Le formulaire contient des erreurs. » |
| 401 | `UNAUTHENTICATED` | session absente ou expirée | « Reconnectez-vous pour continuer. » |
| 403 | `FORBIDDEN` | rôle insuffisant | « Cette action est réservée aux enseignants. » |
| 404 | `NOT_FOUND` | ressource inexistante | « Code introuvable. » |
| 409 | `CONFLICT` | doublon, tentative déjà consommée | « Une copie a déjà été remise. » |
| 402 | `INSUFFICIENT_CREDITS` | solde insuffisant | « Crédits insuffisants : rechargez votre solde. » |
| 429 | `RATE_LIMITED` | trop de requêtes | « Trop de tentatives, réessayez dans une minute. » |
| 502 | `PROVIDER_ERROR` | IA ou FedaPay indisponible | « Service momentanément indisponible. » |
| 500 | `INTERNAL` | bug serveur | « Une erreur interne est survenue. » |

---

## 12. Différences assumées entre contrat et simulation actuelle

| Contrat | Simulation frontend | Conséquence |
| --- | --- | --- |
| Correction serveur des quiz | correction locale (corrigés embarqués) | mention « correction locale de démonstration » |
| Remise de copie horodatée serveur | stockage `localStorage` | mention « copie simulée » |
| URL R2 présignée | ticket `demo://r2/…` | bouton « téléchargement simulé » |
| Paiement FedaPay | intention locale `simulation: true` | aucun débit, aucune redirection |
| IA multi-fournisseurs | banque de questions statique | pied de page « aucune IA réelle » |
| Modération admin | décision locale | avertissement dans le panneau admin |

Ces écarts sont **volontaires** et visibles dans l'interface : aucun écran ne prétend
qu'une opération serveur a eu lieu.
