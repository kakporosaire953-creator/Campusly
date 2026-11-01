/**
 * Services frontend Campusly — point d'entrée unique.
 *
 * ⚠️ Tous les services exportés ici sont des SIMULATIONS locales :
 *  - aucune requête réseau,
 *  - aucune base de données,
 *  - aucun paiement,
 *  - aucun appel IA.
 *
 * Le remplacement par le backend consistera à fournir une implémentation des
 * mêmes contrats (voir `types/`) qui utilise `services/api/client.ts`.
 */

export { authService } from "./authService";
export { userService } from "./userService";
export { examService } from "./examService";
export { quizService } from "./quizService";
export { classroomService } from "./classroomService";
export { compositionService } from "./compositionService";
export { creditService, DEMO_CREDIT_COSTS } from "./creditService";
export { paymentService } from "./paymentService";
export { notificationService } from "./notificationService";
export { forumService } from "./forumService";
export { aiService } from "./aiService";
export { ApiError, apiClient, UnavailableApiClient } from "./api/client";
export { demoStore, formatDateFr, formatRelativeFr, formatXof, demoDelay } from "./mocks/store";
