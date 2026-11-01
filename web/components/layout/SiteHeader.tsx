"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { publicNav } from "@/config/site";
import { useSession } from "@/features/auth/SessionProvider";
import { Button } from "@/components/ui/Button";

/**
 * Barre de navigation publique.
 * Reprend le markup et les classes de l'ancienne navbar (logo « Campusly »
 * avec chapeau, liens, boutons Connexion / S'inscrire) en corrigeant
 * l'accessibilité : `<button>` réel pour le menu, `aria-expanded`,
 * fermeture au clavier, overlay cliquable.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { status, user } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Navigation principale">
        <Link href="/" className="nav-logo" aria-label="Campusly — accueil">
          <span className="logo-text">
            <span className="logo-cap" aria-hidden="true">
              <LogoCap />
            </span>
            <span className="logo-campus">Campus</span>
            <span className="logo-ly">ly</span>
          </span>
        </Link>

        <ul className="nav-links" id="nav-links">
          {publicNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/dashboard">Mon espace</Link>
          </li>
        </ul>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nav-actions" id="navActions">
            {status === "authenticated" && user ? (
              <>
                <Link href="/dashboard" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-user-graduate" aria-hidden="true" /> {user.prenom}
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth" className="btn btn-ghost btn-sm">
                  Connexion
                </Link>
                <Link href="/auth?tab=register" className="btn btn-primary btn-sm">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className={`hamburger ${open ? "open" : ""}`}
            id="hamburger"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {open ? (
        <div
          className="mobile-overlay show"
          role="presentation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <MobileMenu open={open} onNavigate={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { status } = useSession();
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 68,
        left: 0,
        right: 0,
        zIndex: 1001,
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "var(--space-6) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxHeight: "calc(100vh - 68px)",
        overflowY: "auto",
      }}
      id="mobile-menu"
    >
      {publicNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          style={{
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-1)",
            fontWeight: 700,
          }}
        >
          {item.label}
        </Link>
      ))}
      {status === "authenticated" ? (
        <Link href="/dashboard" className="btn btn-primary" onClick={onNavigate} style={{ width: "100%" }}>
          Mon espace
        </Link>
      ) : (
        <>
          <Link href="/auth" className="btn btn-ghost" onClick={onNavigate} style={{ width: "100%" }}>
            Connexion
          </Link>
          <Link
            href="/auth?tab=register"
            className="btn btn-primary"
            onClick={onNavigate}
            style={{ width: "100%" }}
          >
            S&apos;inscrire
          </Link>
        </>
      )}
    </div>
  );
}

/** Chapeau de diplôme du logo — SVG identique à celui injecté par l'ancien theme.js. */
export function LogoCap({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points="16,4 30,11 16,18 2,11" fill="#1565C0" />
      <path d="M16 18 L28 12.5 L28 21 Q28 25 16 28 Q4 25 4 21 L4 12.5 Z" fill="#1E88E5" opacity="0.9" />
      <rect x="13" y="3" width="6" height="2" rx="1" fill="#0D47A1" />
      <line x1="28" y1="11" x2="28" y2="22" stroke="#F57C00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="23" r="2.5" fill="#F57C00" />
      <polygon points="16,4 30,11 22,14.5 8,7.5" fill="white" opacity="0.12" />
    </svg>
  );
}

/** Bandeau de démonstration affiché au-dessus de l'espace applicatif. */
export function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <i className="fa-solid fa-flask" aria-hidden="true" />
      <span>
        <strong>Mode démonstration</strong> — données fictives, aucune action enregistrée sur un serveur.
      </span>
      <Link href="/a-propos#demonstration">En savoir plus</Link>
    </div>
  );
}
