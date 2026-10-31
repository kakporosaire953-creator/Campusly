"use client";

import React, { useState, useEffect } from "react";

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  const navItems = [
    {
      title: "Piliers d'excellence",
      desc: "Annales, IA & Compositions UAC",
      href: "#pillars",
      icon: "fa-solid fa-graduation-cap",
      color: "#1565C0",
      category: "academic",
    },
    {
      title: "Campusly AI",
      desc: "Générateur de quiz sur vos cours",
      href: "#campusly-ai",
      icon: "fa-solid fa-bolt",
      badge: "2.0 IA",
      color: "#F57C00",
      category: "ai",
    },
    {
      title: "Apprentissage Adaptatif",
      desc: "Marathons ciblés & révisions",
      href: "#adaptatif",
      icon: "fa-solid fa-chart-line",
      color: "#10B981",
      category: "academic",
    },
    {
      title: "Classrooms Amphi",
      desc: "Espace étudiants & professeurs",
      href: "#professeurs",
      icon: "fa-solid fa-chalkboard-user",
      color: "#6366F1",
      category: "classrooms",
    },
    {
      title: "Compositions en Ligne",
      desc: "Examens surveillés avec chrono",
      href: "#compositions",
      icon: "fa-solid fa-stopwatch",
      color: "#EC4899",
      category: "classrooms",
    },
    {
      title: "Crédits & Tarifs",
      desc: "Packs FCFA adaptés au semestre",
      href: "#pricing",
      icon: "fa-solid fa-wallet",
      badge: "Dès 500F",
      color: "#059669",
      category: "pricing",
    },
    {
      title: "Foire Aux Questions",
      desc: "Aide, support et démarches",
      href: "#faq",
      icon: "fa-solid fa-circle-question",
      color: "#64748B",
      category: "pricing",
    },
  ];

  const filteredItems =
    activeTab === "all"
      ? navItems
      : navItems.filter((item) => item.category === activeTab);

  return (
    <>
      {/* BARRE DE NAVIGATION FLOTTANTE */}
      <header
        className={`campusly-navbar ${scrolled ? "scrolled" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(255, 255, 255, 0.96)" : "var(--bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: scrolled ? "0 4px 24px rgba(15, 23, 42, 0.08)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 20px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO OFFICIEL */}
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(21, 101, 192, 0.28)",
              }}
            >
              <i className="fa-solid fa-graduation-cap" style={{ fontSize: "1rem" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                  <span style={{ color: "#1565C0" }}>Campus</span>
                  <span style={{ color: "#F57C00" }}>ly</span>
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "rgba(21, 101, 192, 0.1)",
                    color: "#1565C0",
                  }}
                >
                  UAC
                </span>
              </div>
            </div>
          </a>

          {/* LIENS DESKTOP (Masqués sur tablettes et mobiles) */}
          <nav className="desktop-nav-cluster">
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                gap: "24px",
                margin: 0,
                padding: 0,
                alignItems: "center",
              }}
            >
              <li>
                <a href="#pillars" className="nav-desktop-link">
                  Piliers
                </a>
              </li>
              <li>
                <a
                  href="#campusly-ai"
                  className="nav-desktop-link"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  Campusly AI
                  <span
                    style={{
                      fontSize: "0.62rem",
                      background: "#F57C00",
                      color: "#fff",
                      padding: "1px 6px",
                      borderRadius: "6px",
                      fontWeight: 800,
                    }}
                  >
                    2.0
                  </span>
                </a>
              </li>
              <li>
                <a href="#professeurs" className="nav-desktop-link">
                  Classrooms
                </a>
              </li>
              <li>
                <a href="#compositions" className="nav-desktop-link">
                  Compositions
                </a>
              </li>
              <li>
                <a href="#pricing" className="nav-desktop-link">
                  Crédits & Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="nav-desktop-link">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* ACTIONS DROITE & BOUTON HAMBURGER */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="desktop-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a
                href="#pillars"
                style={{
                  fontSize: "0.84rem",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  color: "#334155",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  transition: "all 0.2s ease",
                }}
              >
                Connexion
              </a>
              <a
                href="#pillars"
                style={{
                  fontSize: "0.84rem",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  background: "#1565C0",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(21, 101, 192, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                S&apos;inscrire
              </a>
            </div>

            {/* NOUVEAU BOUTON HAMBURGER INTERACTIF */}
            <button
              id="newCustomHamburger"
              className="custom-hamburger-btn"
              aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={`hamburger-pill-box ${isOpen ? "open" : ""}`}>
                <span className="pill-line top" />
                <span className="pill-line middle" />
                <span className="pill-line bottom" />
              </div>
              <span className="hamburger-label">{isOpen ? "Fermer" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY SOMBRE FLOU */}
      <div
        className={`custom-nav-backdrop ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* NOUVEAU MENU DRAWER MOBILE & TABLETTE */}
      <aside
        id="customDrawerSheet"
        className={`custom-drawer-sheet ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        {/* EN-TÊTE DU MENU DRAWER */}
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "0.95rem",
              }}
            >
              <i className="fa-solid fa-graduation-cap" />
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, lineHeight: 1.1 }}>
                <span style={{ color: "#1565C0" }}>Campus</span>
                <span style={{ color: "#F57C00" }}>ly</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-3)", fontWeight: 600 }}>
                Université d&apos;Abomey-Calavi
              </div>
            </div>
          </div>

          <button
            className="drawer-close-circle"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ONGLETS RAPIDES DE CATÉGORIES */}
        <div className="drawer-category-tabs">
          <button
            className={`tab-chip ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tout explorer
          </button>
          <button
            className={`tab-chip ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            ✨ Campusly AI
          </button>
          <button
            className={`tab-chip ${activeTab === "classrooms" ? "active" : ""}`}
            onClick={() => setActiveTab("classrooms")}
          >
            Amphis & Examens
          </button>
          <button
            className={`tab-chip ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            Tarifs & FAQ
          </button>
        </div>

        {/* LISTE DES CARTES DU MENU */}
        <div className="drawer-body">
          <div className="drawer-cards-container">
            {filteredItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="drawer-card-item"
              >
                <div
                  className="card-icon-box"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  <i className={item.icon} />
                </div>
                <div className="card-text-box">
                  <div className="card-title-row">
                    <span className="card-title">{item.title}</span>
                    {item.badge && (
                      <span
                        className="card-badge"
                        style={{
                          backgroundColor:
                            item.badge.includes("IA") ? "#F57C00" : "#10B981",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="card-desc">{item.desc}</div>
                </div>
                <div className="card-chevron">
                  <i className="fa-solid fa-arrow-right" />
                </div>
              </a>
            ))}
          </div>

          {/* BANNIÈRE IA ACCÈS RAPIDE */}
          <div className="drawer-ai-spotlight">
            <div className="ai-spotlight-top">
              <span className="ai-tag">
                <i className="fa-solid fa-sparkles" /> NOUVEAUTÉ 2026
              </span>
              <span className="ai-status">Prêt</span>
            </div>
            <div className="ai-title">Générez un Quiz en 30 secondes</div>
            <div className="ai-text">
              Chargez un PDF de cours ou une photo d&apos;épreuve et entraînez-vous sans connexion complexe.
            </div>
            <a
              href="#campusly-ai"
              onClick={() => setIsOpen(false)}
              className="ai-action-btn"
            >
              <i className="fa-solid fa-wand-magic-sparkles" /> Tester l&apos;IA gratuitement
            </a>
          </div>
        </div>

        {/* PIED DU MENU AVEC AUTH & WHATSAPP */}
        <div className="drawer-footer">
          <div className="footer-auth-grid">
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              className="drawer-auth-btn login"
            >
              Se connecter
            </a>
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              className="drawer-auth-btn register"
            >
              Créer un compte
            </a>
          </div>

          <a
            href="https://wa.me/2290158519556"
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-whatsapp-btn"
          >
            <i className="fa-brands fa-whatsapp whatsapp-icon" />
            <div>
              <div className="wa-title">Besoin d&apos;aide à l&apos;UAC ?</div>
              <div className="wa-sub">Contact WhatsApp Direct (+229)</div>
            </div>
          </a>
        </div>
      </aside>

      {/* STYLES CSS DÉDIÉS AU NOUVEAU MENU */}
      <style jsx global>{`
        /* Liens desktop */
        .nav-desktop-link {
          text-decoration: none;
          color: var(--text-2);
          font-size: 0.88rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .nav-desktop-link:hover {
          color: #1565C0;
        }

        /* Bouton Hamburger Personnalisé */
        .custom-hamburger-btn {
          display: none;
          align-items: center;
          gap: 9px;
          height: 42px;
          padding: 0 14px 0 10px;
          border-radius: 999px;
          border: 1px solid var(--border-2);
          background: var(--surface);
          color: var(--text-1);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .custom-hamburger-btn:hover {
          border-color: #1565C0;
          background: rgba(21, 101, 192, 0.06);
        }

        .hamburger-pill-box {
          width: 18px;
          height: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .pill-line {
          display: block;
          width: 100%;
          height: 2.2px;
          border-radius: 99px;
          background: var(--text-1);
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .pill-line.middle {
          width: 70%;
        }
        .hamburger-pill-box.open .pill-line.top {
          transform: translateY(6px) rotate(45deg);
          background: #1565C0;
        }
        .hamburger-pill-box.open .pill-line.middle {
          opacity: 0;
          transform: scale(0);
        }
        .hamburger-pill-box.open .pill-line.bottom {
          transform: translateY(-6px) rotate(-45deg);
          background: #1565C0;
        }
        .hamburger-label {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        /* Backdrop flouté */
        .custom-nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1050;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-nav-backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* Drawer Sheet */
        .custom-drawer-sheet {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(390px, 90vw);
          background: var(--bg);
          border-left: 1px solid var(--border-2);
          box-shadow: -12px 0 36px rgba(0, 0, 0, 0.18);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-drawer-sheet.open {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .drawer-close-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text-2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .drawer-close-circle:hover {
          background: #ef444415;
          color: #ef4444;
          border-color: #ef444440;
        }

        .drawer-category-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 12px 18px 8px;
          scrollbar-width: none;
        }
        .drawer-category-tabs::-webkit-scrollbar {
          display: none;
        }
        .tab-chip {
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 700;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-chip.active {
          background: #1565C0;
          color: #ffffff;
          border-color: #1565C0;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .drawer-cards-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-card-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-card-item:hover {
          background: var(--surface-2);
          border-color: #1565C050;
          transform: translateX(3px);
        }
        .card-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .card-text-box {
          flex: 1;
          min-width: 0;
        }
        .card-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }
        .card-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-1);
        }
        .card-badge {
          font-size: 0.6rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 99px;
          color: #ffffff;
        }
        .card-desc {
          font-size: 0.72rem;
          color: var(--text-3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-chevron {
          color: var(--text-3);
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        .drawer-card-item:hover .card-chevron {
          transform: translateX(2px);
          color: #1565C0;
        }

        .drawer-ai-spotlight {
          background: linear-gradient(135deg, rgba(245, 124, 0, 0.08) 0%, rgba(21, 101, 192, 0.06) 100%);
          border: 1px solid rgba(245, 124, 0, 0.25);
          border-radius: 16px;
          padding: 16px;
        }
        .ai-spotlight-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .ai-tag {
          font-size: 0.64rem;
          font-weight: 900;
          color: #F57C00;
          letter-spacing: 0.5px;
        }
        .ai-status {
          font-size: 0.62rem;
          font-weight: 800;
          background: #10B98120;
          color: #10B981;
          padding: 2px 7px;
          border-radius: 99px;
        }
        .ai-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-1);
          margin-bottom: 4px;
        }
        .ai-text {
          font-size: 0.74rem;
          color: var(--text-2);
          line-height: 1.45;
          margin-bottom: 12px;
        }
        .ai-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: #F57C00;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(245, 124, 0, 0.25);
          transition: all 0.2s ease;
        }
        .ai-action-btn:hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }

        .drawer-footer {
          padding: 16px 18px;
          border-top: 1px solid var(--border);
          background: var(--surface-2);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-auth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .drawer-auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }
        .drawer-auth-btn.login {
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text-1);
        }
        .drawer-auth-btn.register {
          background: #1565C0;
          color: #ffffff;
        }

        .drawer-whatsapp-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: #10B98112;
          border: 1px solid #10B98135;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .drawer-whatsapp-btn:hover {
          background: #10B98120;
        }
        .whatsapp-icon {
          font-size: 1.5rem;
          color: #10B981;
        }
        .wa-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-1);
        }
        .wa-sub {
          font-size: 0.68rem;
          color: #10B981;
          font-weight: 600;
        }

        /* Responsive Breakpoint */
        @media (max-width: 960px) {
          .desktop-nav-cluster,
          .desktop-actions {
            display: none !important;
          }
          .custom-hamburger-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 961px) {
          .custom-hamburger-btn,
          .custom-drawer-sheet,
          .custom-nav-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
