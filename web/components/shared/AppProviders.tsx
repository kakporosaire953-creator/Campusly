"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { SessionProvider } from "@/features/auth/SessionProvider";

/** Providers globaux du frontend Campusly (session simulée + toasts). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
