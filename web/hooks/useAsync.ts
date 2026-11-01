"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/services/api/client";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  /** Relance la requête (bouton « réessayer »). */
  reload: () => void;
  setData: (value: T) => void;
}

/**
 * Hook de chargement générique pour les services frontend.
 * Il gère les trois états attendus par l'interface : chargement, erreur,
 * succès (et `idle` avant le premier appel).
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    loader()
      .then((result) => {
        if (cancelled || !mounted.current) return;
        setData(result);
        setStatus("success");
      })
      .catch((cause: unknown) => {
        if (cancelled || !mounted.current) return;
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Une erreur inattendue est survenue. Réessayez dans un instant.",
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);
  const update = useCallback((value: T) => setData(value), []);

  return { data, status, error, reload, setData: update };
}
