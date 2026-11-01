"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { appNav, roleLabels } from "@/config/site";
import { useSession } from "@/features/auth/SessionProvider";
import { Button } from "@/components/ui/Button";
import { CreditsPill } from "@/components/navigation/CreditsPill";
import { NotificationBell } from "@/components/navigation/NotificationBell";
import { RoleSwitcher } from "@/components/navigation/RoleSwitcher";
import { LogoCap } from "@/components/layout/SiteHeader";
import { DemoBanner } from "@/components/layout/SiteHeader";
import { Avatar } from "@/components/ui/PageHeader";

/**
 * Coquille de l'espace applicatif.
 * Reprend exactement la structure de l'ancien `dashboard.html` (sidebar 260 px,
 * carte utilisateur, menu, en-tête avec pastille de crédits) en la rendant
 * accessible : navigation sémantique, drawer mobile, focus visible.
 */
export function AppShell({ children, breadcrumb }: { children: ReactNode; breadcrumb?: string }) {
  const { user, role, status, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "anonymous") router.replace("/auth");
  }, [status, router]);

  const visibleNav = appNav.filter(
    (item) => item.group !== "account" && (role ? item.roles.includes(role) : false),
  );
  const visibleAccountNav = appNav.filter(
    (item) => item.group === "account" && (role ? item.roles.includes(role) : false),
  );
  const fullName = user ? `${user.prenom} ${user.nom}` : "Session de démonstration";

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <div className="app-layout">
      <DemoBanner />

      {/* ───────────────────── SIDEBAR ───────────────────── */}
      <aside className={`app-sidebar ${drawerOpen ? "open" : ""}`} id="appSidebar" aria-label="Navigation de l'espace">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand" aria-label="Campusly — accueil">
            <LogoCap size={24} />
            <span>
              <span className="logo-campus">Campus</span>
              <span className="logo-ly">ly</span>
            </span>
          </Link>
          <button
            type="button"
            className="icon-btn"
            aria-label="Fermer le menu"
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
                <span>{role ? roleLabels[role] : "Invité"}</span>
              </div>
            </div>
          </div>
          <RoleSwitcher />
        </div>

        <nav aria-label="Menu principal">
          <ul className="sidebar-menu">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`side-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                    <i className={item.icon} aria-hidden="true" style={item.icon.includes("bolt") ? { color: "var(--accent)" } : undefined} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <span className="sidebar-group-label">Mon compte</span>
            </li>
            {visibleAccountNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`side-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                    <i className={item.icon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <Link href="/" className="side-link">
                <i className="fa-solid fa-house" aria-hidden="true" />
                <span>Accueil public</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button type="button" onClick={handleLogout} className="side-logout-btn" id="sideLogoutBtn">
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            <span>Déconnexion</span>
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
              aria-label="Ouvrir la navigation"
              aria-expanded={drawerOpen}
              aria-controls="appSidebar"
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>
            <div className="header-breadcrumb">
              <i className="fa-solid fa-house" aria-hidden="true" style={{ fontSize: "0.75rem", color: "var(--text-3)" }} />
              <span style={{ color: "var(--text-3)" }}>/</span>
              <span style={{ color: "var(--text-1)", fontWeight: 800 }}>{breadcrumb ?? "Tableau de bord"}</span>
            </div>
          </div>

          <div className="app-header-right">
            <CreditsPill />
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Déconnexion" icon="fa-solid fa-arrow-right-from-bracket" />
          </div>
        </header>

        <div className="app-body">{children}</div>
      </main>
    </div>
  );
}
