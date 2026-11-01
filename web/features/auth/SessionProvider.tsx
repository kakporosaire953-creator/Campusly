"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, LoginInput, RegisterInput, UserProfile, UserRole } from "@/types";
import { authService } from "@/services/authService";

export type SessionStatus = "loading" | "authenticated" | "anonymous";

interface SessionContextValue {
  session: AuthSession | null;
  user: UserProfile | null;
  role: UserRole | null;
  status: SessionStatus;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => Promise<void>;
  /** Bascule de rôle : outil de démonstration, jamais une autorisation. */
  switchRole: (role: UserRole) => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: UserProfile) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Fournisseur de session de DÉMONSTRATION.
 *
 * ⚠️ Le rôle stocké ici ne protège aucun accès : il sert uniquement à
 * explorer les trois espaces de l'interface. En production, la session sera
 * un cookie httpOnly émis par Better Auth et chaque requête sera autorisée
 * côté Cloudflare Worker.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const refresh = useCallback(async () => {
    const next = await authService.getSession();
    setSession(next);
    setStatus(next ? "authenticated" : "anonymous");
  }, []);

  useEffect(() => {
    let cancelled = false;
    authService
      .getSession()
      .then((next) => {
        if (cancelled) return;
        setSession(next);
        setStatus(next ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (cancelled) return;
        setSession(null);
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const next = await authService.login(input);
    setSession(next);
    setStatus("authenticated");
    return next;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const next = await authService.register(input);
    setSession(next);
    setStatus("authenticated");
    return next;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
    setStatus("anonymous");
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    const next = await authService.switchDemoRole(role);
    setSession(next);
    setStatus("authenticated");
  }, []);

  const setUser = useCallback((user: UserProfile) => {
    setSession((current) => (current ? { ...current, user } : current));
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.user.role ?? null,
      status,
      login,
      register,
      logout,
      switchRole,
      refresh,
      setUser,
    }),
    [session, status, login, register, logout, switchRole, refresh, setUser],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession doit être utilisé dans un <SessionProvider>.");
  return context;
}
