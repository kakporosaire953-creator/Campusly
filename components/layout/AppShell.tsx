"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { appNav, roleLabelKeys } from "@/config/site";
import { useSession } from "@/features/auth/SessionProvider";
import { Button } from "@/components/ui/Button";
import { CreditsPill } from "@/components/navigation/CreditsPill";
import { NotificationBell } from "@/components/navigation/NotificationBell";
import { RoleSwitcher } from "@/components/navigation/RoleSwitcher";
import { Logo } from "@/components/shared/CampuslyLogo";
import { Avatar } from "@/components/ui/PageHeader";
import { PreferencesPanel } from "@/components/shared/PreferencesPanel";
import { useT } from "@/lib/i18n/provider";

/**
 * Coquille de l'espace applicatif.
 * Reprend exactement la structure de l'ancien `dashboard.html` (sidebar 260 px,
 * carte utilisateur, menu, en-tête avec pastille de crédits) en la rendant
 * accessible : navigation sémantique, drawer mobile, focus visible.
 *
 * Tous les libellés viennent du dictionnaire (`app.*`) : aucun texte français
 * en dur, y compris les noms de rôle et les intitulés d'action du lecteur
 * d'écran. Le contenu personnel (nom de l'utilisateur) n'est jamais traduit.
 */
export function AppShell({ children, breadcrumb }: { children: ReactNode; breadcrumb?: string }) {
  const { user, role, status, logout } = useSession();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "anonymous") {
      // On mémorise la page demandée pour y revenir après connexion.
      const target = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/auth${target}`);
    }
  }, [status, pathname, router]);

  const visibleNav = appNav.filter(
    (item) => item.group !== "account" && (role ? item.roles.includes(role) : false),
  );
  const visibleAccountNav = appNav.filter(
    (item) => item.group === "account" && (role ? item.roles.includes(role) : false),
  );
  const fullName = user ? `${user.prenom} ${user.nom}` : t("app.sessionLocal");

  /**
   * Fil d'Ariane : il reprend le libellé de la page courante dans la
   * navigation. Avant, il affichait « Tableau de bord » sur TOUTES les pages
   * de l'espace — on ne savait pas où l'on se trouvait.
   */
  // On cherche dans TOUTE la navigation, y compris les entrées masquées pour
  // le rôle courant : sans cela, `/enseignant` vu en rôle étudiant retombait
  // sur « Vue d'ensemble », qui est faux.
  const currentNav = appNav
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const pageLabel = currentNav ? t(currentNav.labelKey) : (breadcrumb ?? t("app.navOverview"));

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <div className="app-shell">
      {/*
        Le bandeau doit occuper toute la largeur AU-DESSUS de la barre latérale.
        Placé directement dans `.app-layout` (display:flex, direction row), il
        devenait un troisième élément de la rangée : sur mobile, la barre
        latérale (260 px) et le bandeau se partageaient la largeur et le contenu
        se retrouvait écrasé à zéro — on ne voyait plus que le bandeau.
      */}

      <div className="app-layout">
        {/* ───────────────────── SIDEBAR ───────────────────── */}
      <aside
        className={`app-sidebar ${drawerOpen ? "open show" : ""}`}
        id="appSidebar"
        aria-label={t("app.sidebarLabel")}
      >
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand" aria-label={t("app.homeLabel")}>
            <Logo size={24} className="logo-campusly" />
          </Link>
          <button
            type="button"
            className="icon-btn"
            aria-label={t("app.closeMenu")}
            onClick={() => setDrawerOpen(false)}
            style={{ display: drawerOpen ? "inline-flex" : "none" }}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="user-info-row">
            <Avatar name={fullName} />
            <div className="user-text-info">
              <div className="user-name-label">{fullName}</div>
              <div className={`role-badge ${role ?? "learner"}`}>
                <i
                  className={
                    role === "admin"
                      ? "fa-solid fa-shield-halved"
                      : role === "teacher"
                        ? "fa-solid fa-person-chalkboard"
                        : "fa-solid fa-user-graduate"
                  }
                  aria-hidden="true"
                />
                <span>{role ? t(roleLabelKeys[role]) : t("app.roleGuest")}</span>
              </div>
            </div>
          </div>
          <RoleSwitcher />
        </div>

        <nav aria-label={t("app.mainMenuLabel")}>
          <ul className="sidebar-menu">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`side-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                    <i className={item.icon} aria-hidden="true" style={item.icon.includes("bolt") ? { color: "var(--accent)" } : undefined} />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <span className="sidebar-group-label">{t("app.myAccount")}</span>
          <ul className="sidebar-menu" style={{ flex: "0 0 auto", paddingTop: 0 }}>
            {visibleAccountNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`side-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                    <i className={item.icon} aria-hidden="true" />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="sidebar-menu" style={{ flex: "0 0 auto", paddingTop: 0 }}>
            <li style={{ borderTop: "1px solid var(--border)", paddingTop: 10, listStyle: "none" }}>
              <Link href="/" className="side-link">
                <i className="fa-solid fa-house" aria-hidden="true" />
                <span>{t("app.navHome")}</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button type="button" onClick={handleLogout} className="side-logout-btn" id="sideLogoutBtn">
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            <span>{t("app.logoutShort")}</span>
          </button>
        </div>
      </aside>

      {drawerOpen ? (
        <div className="mobile-overlay show" role="presentation" onClick={() => setDrawerOpen(false)} />
      ) : null}

      {/* ───────────────────── MAIN ───────────────────── */}
      <main className="app-main" id="contenu">
        <header className="app-header">
          <div className="app-header-left">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label={t("app.openNav")}
              aria-expanded={drawerOpen}
              aria-controls="appSidebar"
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>
            <div className="header-breadcrumb">
              <i className="fa-solid fa-house" aria-hidden="true" style={{ fontSize: "0.75rem", color: "var(--text-3)" }} />
              <span style={{ color: "var(--text-3)" }}>/</span>
              <span style={{ color: "var(--text-1)", fontWeight: 700 }}>{pageLabel}</span>
            </div>
          </div>

          <div className="app-header-right">
            <PreferencesPanel />
            <CreditsPill />
            <NotificationBell />
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              label={t("app.logout")}
              onClick={handleLogout}
              icon="fa-solid fa-arrow-right-from-bracket"
            />
          </div>
        </header>

          <div className="app-body">{children}</div>
        </main>
      </div>
    </div>
  );
}
