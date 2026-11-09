"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { publicNav } from "@/config/site";
import { useSession } from "@/features/auth/SessionProvider";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useScrollDirection } from "@/lib/useScrollDirection";

/**
 * Barre de navigation publique.
 * ---------------------------------------------------------------------------
 * Trois états, une seule barre :
 *  - `is-over` : sur l'accueil, avant défilement → effacement complet (le hero
 *    passe dessous), texte en encre foncée ;
 *  - `is-scrolled` : au défilement → fond translucide, filet, hauteur réduite
 *    (76 px → 60 px) ;
 *  - pages intérieures : fond plein dès l'arrivée.
 *
 * Le menu mobile est un panneau plein écran sous la barre : une seule colonne,
 * cibles de 48 px, fermeture par Échap, par clic sur le fond ou après
 * navigation. Aucun `onclick` inline, `aria-expanded` / `aria-controls` réels.
 *
 * Deux gestes viennent du site Kraken :
 *  - la barre s'effface quand on descend (au-delà de 160 px) et revient dès
 *    qu'on remonte — jamais pendant que le menu est ouvert, ni quand le focus
 *    clavier est à l'intérieur (sinon on perdrait l'utilisateur) ;
 *  - le panneau mobile entre avec un léger rebond et ses liens en cascade.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { status, user } = useSession();
  const pathname = usePathname();
  const firstRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const { direction, y } = useScrollDirection();

  const isHome = pathname === "/";
  const overlay = isHome && !scrolled && !open;
  const hidden = direction === "down" && y > 160 && !open && !focusWithin;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    // Le défilement de la page est figé tant que le panneau est ouvert.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Entrée du panneau mobile : rebond puis cascade des liens.
  // Web Animations API plutôt que GSAP : la barre est présente sur toutes les
  // pages publiques, et cette animation de 450 ms ne justifie pas d'y charger
  // une bibliothèque. La courbe reproduit `back.out(2)`.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || !open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = el.animate(
      [
        { opacity: 0, transform: "translateY(-20px) scale(0.95) rotate(-2deg)" },
        { opacity: 1, transform: "translateY(0) scale(1) rotate(0deg)" },
      ],
      { duration: 450, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "both" },
    );

    const links = Array.from(el.querySelectorAll("a")).map((link, index) =>
      link.animate(
        [
          { opacity: 0, transform: "translateX(-20px)" },
          { opacity: 1, transform: "translateX(0)" },
        ],
        { duration: 350, delay: 100 + index * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
      ),
    );

    return () => {
      panel.cancel();
      links.forEach((animation) => animation.cancel());
    };
  }, [open]);

  const navClass = [
    "site-nav",
    overlay ? "is-over" : "",
    scrolled ? "is-scrolled" : "",
    open ? "is-open" : "",
    hidden ? "is-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={navClass}
      data-nav
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__logo" aria-label="Campusly — accueil">
          <span className="logo-text">
            <span className="logo-cap" aria-hidden="true">
              <LogoCap />
            </span>
            <span className="logo-campus">Campus</span>
            <span className="logo-ly">ly</span>
          </span>
        </Link>

        <nav className="site-nav__links" aria-label="Sections de l'accueil">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__actions">
          <ThemeToggle compact />
          {status === "authenticated" && user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm site-nav__cta">
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/auth" className="site-nav__signin">
                Connexion
              </Link>
              <Link href="/auth?tab=register" className="btn btn-primary btn-sm site-nav__cta">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="site-nav__burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="site-nav__scrim"
            aria-label="Fermer le menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="site-nav__panel"
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <nav className="site-nav__panel-links" aria-label="Sections de l'accueil">
              {publicNav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={index === 0 ? firstRef : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="site-nav__panel-actions">
              {status === "authenticated" && user ? (
                <Link href="/dashboard" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}>
                  Ouvrir mon espace
                </Link>
              ) : (
                <>
                  <Link href="/auth?tab=register" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}>
                    Créer un compte
                  </Link>
                  <Link href="/auth" className="btn btn-outline btn-lg" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                </>
              )}
            </div>

            <div className="site-nav__panel-foot">
              <ThemeToggle />
              <Link href="/a-propos" onClick={() => setOpen(false)}>
                À propos
              </Link>
              <Link href="/a-propos#contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
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
