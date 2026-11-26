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

/**
 * Écart relatif, localisé.
 * La version française était la seule disponible ; les paraphes (`il y a`,
 * `à l'instant`) sont maintenant passés par l'appelant, qui les tient du
 * dictionnaire. Ici, on rend la seule donnée : l'unité et le nombre.
 */
export function relativeAmount(iso: string): { unit: "now" | "minutes" | "hours" | "days"; count: number } {
  const date = new Date(iso).getTime();
  if (Number.isNaN(date)) return { unit: "now", count: 0 };
  const diffMinutes = Math.round((Date.now() - date) / 60_000);
  if (diffMinutes < 1) return { unit: "now", count: 0 };
  if (diffMinutes < 60) return { unit: "minutes", count: diffMinutes };
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return { unit: "hours", count: hours };
  const days = Math.round(hours / 24);
  if (days < 30) return { unit: "days", count: days };
  return { unit: "days", count: days };
}

/** Version française de l'écart relatif, pour les écrans pas encore traduits. */
export function formatRelativeFr(iso: string): string {
  const { unit, count } = relativeAmount(iso);
  if (unit === "now") return "à l'instant";
  if (unit === "minutes") return `il y a ${count} min`;
  if (unit === "hours") return `il y a ${count} h`;
  if (count >= 30) return formatDateFr(iso);
  return `il y a ${count} j`;
}

export function formatXof(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}
