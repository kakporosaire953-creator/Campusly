/**
 * Client API — contrat d'accès au futur backend Campusly
 * ---------------------------------------------------------------------------
 * ⚠️ PHASE FRONTEND : aucune route API n'existe et aucun appel réseau n'est
 * effectué. Ce module ne définit que :
 *  - la forme d'un client HTTP (pour la phase backend),
 *  - une erreur normalisée partagée par tous les services,
 *  - un client `unavailable` qui échoue explicitement si on l'utilise.
 *
 * Voir `docs/API_CONTRACTS.md` pour la liste des endpoints.
 */

import type { ApiErrorBody, ApiErrorCode } from "@/types";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly fields?: Record<string, string>;
  readonly status?: number;

  constructor(body: ApiErrorBody, status?: number) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.fields = body.fields;
    this.status = status;
  }

  static of(code: ApiErrorCode, message: string, fields?: Record<string, string>): ApiError {
    return new ApiError({ code, message, fields });
  }
}

export interface RequestOptions {
  /** Jeton CSRF ou en-tête de corrélation, géré par le backend. */
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Interface du client HTTP utilisé par les services frontend.
 * En production, l'implémentation utilisera `fetch` avec `credentials: "include"`
 * (cookies de session Better Auth, httpOnly) et la base URL du Worker.
 */
export interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

/**
 * Client de repli : toute tentative d'appel réel échoue proprement avec le
 * code `BACKEND_UNAVAILABLE`. Les composants n'appellent jamais ce client :
 * ils passent par les services simulés de `services/`.
 */
export class UnavailableApiClient implements ApiClient {
  private fail(): never {
    throw ApiError.of(
      "BACKEND_UNAVAILABLE",
      "Le backend Campusly n'est pas encore déployé. Cette interface fonctionne en mode démonstration.",
    );
  }

  async get<T>(_path: string, _options?: RequestOptions): Promise<T> {
    return this.fail();
  }

  async post<T>(_path: string, _body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.fail();
  }

  async patch<T>(_path: string, _body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.fail();
  }

  async delete<T>(_path: string, _options?: RequestOptions): Promise<T> {
    return this.fail();
  }
}

export const apiClient: ApiClient = new UnavailableApiClient();
