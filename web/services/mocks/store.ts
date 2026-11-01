/**
 * Stockage local des données de démonstration
 * ---------------------------------------------------------------------------
 * ⚠️ Ce stockage n'est PAS une base de données. Il permet uniquement au
 * frontend d'être navigable et testable sans backend. Toutes les données
 * écrites ici restent dans le navigateur de l'utilisateur et sont
 * explicitement présentées comme fictives dans l'interface.
 */

const NAMESPACE = "campusly.web.demo.v1";

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

function fullKey(key: string): string {
  return `${NAMESPACE}.${key}`;
}

export const demoStore = {
  read<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(fullKey(key));
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  write<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(fullKey(key), JSON.stringify(value));
    } catch {
      /* quota dépassé ou stockage indisponible : la démo reste fonctionnelle en mémoire */
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(fullKey(key));
  },

  /** Réinitialise toutes les données de démonstration de l'application. */
  resetAll(): void {
    if (!isBrowser()) return;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const storageKey = window.localStorage.key(i);
      if (storageKey?.startsWith(NAMESPACE)) keys.push(storageKey);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  },
};

/** Latence simulée pour rendre les états de chargement visibles et réalistes. */
export function demoDelay(ms = 140): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Formatage français des dates, partagé par les vues de démonstration. */
export function formatDateFr(iso: string, withTime = false): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatRelativeFr(iso: string): string {
  const date = new Date(iso).getTime();
  if (Number.isNaN(date)) return iso;
  const diffMinutes = Math.round((Date.now() - date) / 60_000);
  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return formatDateFr(iso);
}

export function formatXof(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}
