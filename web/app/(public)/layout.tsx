import "@/styles/legacy/pages/index.css";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** Gabarit des pages publiques (accueil, pages légales, à propos, contribuer). */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenu">{children}</main>
      <SiteFooter />
    </>
  );
}
