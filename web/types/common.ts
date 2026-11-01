/**
 * Contrats communs — Campusly
 * ---------------------------------------------------------------------------
 * Ces types décrivent les échanges attendus entre le frontend et le futur
 * backend (Cloudflare Workers + D1 + R2 + Redis). Ils sont utilisés dès
 * maintenant par les services frontend simulés (`services/`) afin que le
 * remplacement des mocks par de vrais appels HTTP ne modifie pas les
 * composants.
 *
 * ⚠️ Aucun de ces types ne contient de secret ni de logique serveur.
 */

/** Rôles applicatifs. Les permissions réelles sont vérifiées côté serveur. */
export type UserRole = "learner" | "teacher" | "admin";

/** Statut de vérification d'un compte enseignant. */
export type TeacherStatus = "none" | "pending" | "verified";

/** Enveloppe de succès standard d'une réponse API. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  /** Métadonnées optionnelles (pagination, version de schéma, etc.). */
  meta?: Record<string, unknown>;
}

/** Enveloppe d'erreur standard d'une réponse API. */
export interface ApiFailure {
  ok: false;
  error: ApiErrorBody;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Code d'erreur normalisé, partagé par tous les modules. */
export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INSUFFICIENT_CREDITS"
  | "PAYMENT_FAILED"
  | "AI_UNAVAILABLE"
  | "BACKEND_UNAVAILABLE"
  | "INTERNAL";

/** Corps d'erreur renvoyé par le backend (et reproduit par les mocks). */
export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  /** Erreurs de validation par champ, pour l'affichage des formulaires. */
  fields?: Record<string, string>;
  /** Identifiant de corrélation pour le support. */
  requestId?: string;
}

/** Pagination standard. */
export interface PageQuery {
  page?: number;
  pageSize?: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Tri standard. */
export interface SortQuery {
  sortBy?: string;
  direction?: "asc" | "desc";
}

/** Intervalle de dates ISO-8601. */
export interface DateRange {
  from?: string;
  to?: string;
}

/**
 * Provenance d'une donnée affichée.
 * `demo` : fixture locale, aucune persistance serveur.
 * `api`  : donnée issue du backend (mode production, non disponible ici).
 */
export type DataSource = "demo" | "api";

/** Métadonnées de démonstration attachées aux réponses des mocks. */
export interface DemoMeta {
  source: DataSource;
  /** Message affichable à l'utilisateur pour lever toute ambiguïté. */
  notice?: string;
}
