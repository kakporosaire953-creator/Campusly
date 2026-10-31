"use client";

import React, { useState, useEffect } from "react";

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquer le scroll du document principal lorsque le menu est ouvert
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
      title: "Campusly AI 2.0",
      desc: "Générateur de quiz sur vos supports",
      href: "#campusly-ai",
      icon: "fa-solid fa-bolt",
      badge: "Nouveau",
      badgeColor: "#F57C00",
      color: "#F57C00",
      category: "ai",
    },
    {
      title: "Apprentissage Adaptatif",
      desc: "Marathons ciblés & diagnostic",
      href: "#adaptatif",
      icon: "fa-solid fa-chart-line",
      color: "#10B981",
      category: "academic",
    },
    {
      title: "Classrooms Amphi",
      desc: "Espace étudiants & devoirs",
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
      badgeColor: "#059669",
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
    activeCategory === "all"
      ? navItems
      : navItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* ── BARRE DE NAVIGATION PRINCIPALE ── */}
      <header
        id="campuslyMainHeader"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "68px",
          zIndex: 9998,
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "#FFFFFF",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(21, 101, 192, 0.12)",
          boxShadow: scrolled
            ? "0 4px 20px rgba(15, 23, 42, 0.08)"
            : "0 1px 3px rgba(0, 0, 0, 0.03)",
          display: "flex",
          alignItems: "center",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO OFFICIEL UAC */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                <span style={{ color: "#1565C0" }}>Campus</span>
                <span style={{ color: "#F57C00" }}>ly</span>
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
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
          </a>

          {/* LIENS SUR DESKTOP (Masqués sur smartphone/tablette) */}
          <nav className="campusly-desktop-nav">
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
                <a href="#pillars" className="nav-desk-item">
                  Piliers
                </a>
              </li>
              <li>
                <a
                  href="#campusly-ai"
                  className="nav-desk-item"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                >
                  Campusly AI
                  <span
                    style={{
                      fontSize: "0.6rem",
                      background: "#F57C00",
                      color: "#ffffff",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      fontWeight: 800,
                    }}
                  >
                    2.0
                  </span>
                </a>
              </li>
              <li>
                <a href="#professeurs" className="nav-desk-item">
                  Classrooms
                </a>
              </li>
              <li>
                <a href="#compositions" className="nav-desk-item">
                  Compositions
                </a>
              </li>
              <li>
                <a href="#pricing" className="nav-desk-item">
                  Crédits & Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="nav-desk-item">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* ACTIONS DROITE & BOUTON HAMBURGER */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="campusly-desktop-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a
                href="#pillars"
                style={{
                  fontSize: "0.84rem",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  color: "#334155",
                  border: "1px solid rgba(21, 101, 192, 0.15)",
                  background: "#F8FAFC",
                }}
              >
                Connexion
              </a>
              <a
                href="#pillars"
                style={{
                  fontSize: "0.84rem",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 700,
                  background: "#1565C0",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(21, 101, 192, 0.25)",
                }}
              >
                S&apos;inscrire
              </a>
            </div>

            {/* BOUTON HAMBURGER TACTILE RETRAVAILLÉ */}
            <button
              id="hamburgerToggleBtn"
              type="button"
              className="campusly-hamburger-btn"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              style={{
                alignItems: "center",
                gap: "8px",
                height: "42px",
                padding: "0 14px 0 10px",
                borderRadius: "999px",
                border: isOpen ? "1.5px solid #1565C0" : "1.5px solid rgba(21, 101, 192, 0.25)",
                background: isOpen ? "rgba(21, 101, 192, 0.12)" : "#FFFFFF",
                color: isOpen ? "#1565C0" : "#0F172A",
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "2.2px",
                    borderRadius: "99px",
                    background: isOpen ? "#1565C0" : "#0F172A",
                    transition: "all 0.25s ease",
                    transformOrigin: "center",
                    transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "70%",
                    height: "2.2px",
                    borderRadius: "99px",
                    background: isOpen ? "#1565C0" : "#0F172A",
                    transition: "all 0.2s ease",
                    opacity: isOpen ? 0 : 1,
                    transform: isOpen ? "scale(0)" : "scale(1)",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "100%",
                    height: "2.2px",
                    borderRadius: "99px",
                    background: isOpen ? "#1565C0" : "#0F172A",
                    transition: "all 0.25s ease",
                    transformOrigin: "center",
                    transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  letterSpacing: "0.2px",
                  color: isOpen ? "#1565C0" : "#0F172A",
                }}
              >
                {isOpen ? "Fermer" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── OVERLAY SOMBRE FLOU AVEC CLICK POUR FERMER ── */}
      {isOpen && (
        <div
          id="customBackdrop"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 99998,
            animation: "navFadeIn 0.25s ease forwards",
          }}
        />
      )}

      {/* ── TIROIR MOBILE COMPLET (DRAWER) ── */}
      <aside
        id="campuslyDrawerPanel"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(390px, 92vw)",
          height: "100vh",
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          borderLeft: "1px solid rgba(21, 101, 192, 0.18)",
          boxShadow: "-16px 0 40px rgba(0, 0, 0, 0.25)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {/* EN-TÊTE DU DRAWER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(21, 101, 192, 0.12)",
            backgroundColor: "#F8FAFC",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                fontSize: "1rem",
              }}
            >
              <i className="fa-solid fa-graduation-cap" />
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, lineHeight: 1.1 }}>
                <span style={{ color: "#1565C0" }}>Campus</span>
                <span style={{ color: "#F57C00" }}>ly</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 600 }}>
                Université d&apos;Abomey-Calavi
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid rgba(21, 101, 192, 0.15)",
              backgroundColor: "#FFFFFF",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* ONGLETS DE FILTRAGE RAPIDE */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            padding: "12px 18px 8px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(21, 101, 192, 0.08)",
            flexShrink: 0,
            scrollbarWidth: "none",
          }}
        >
          {[
            { id: "all", label: "Tout explorer" },
            { id: "ai", label: "✨ Campusly AI" },
            { id: "classrooms", label: "Amphis & Examens" },
            { id: "pricing", label: "Tarifs & FAQ" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                whiteSpace: "nowrap",
                padding: "6px 13px",
                borderRadius: "99px",
                fontSize: "0.72rem",
                fontWeight: 700,
                border:
                  activeCategory === cat.id
                    ? "1px solid #1565C0"
                    : "1px solid rgba(21, 101, 192, 0.15)",
                backgroundColor: activeCategory === cat.id ? "#1565C0" : "#F8FAFC",
                color: activeCategory === cat.id ? "#FFFFFF" : "#334155",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CORPS DÉFILABLE AVEC LES CARTES DU MENU */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Liste des cartes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid rgba(21, 101, 192, 0.12)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  <i className={item.icon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 800,
                        color: "#0F172A",
                      }}
                    >
                      {item.title}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: "99px",
                          backgroundColor: item.badgeColor || "#10B981",
                          color: "#FFFFFF",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#64748B",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
                <i
                  className="fa-solid fa-arrow-right"
                  style={{ color: "#94A3B8", fontSize: "0.75rem" }}
                />
              </a>
            ))}
          </div>

          {/* BANNIÈRE IA ACCÈS RAPIDE */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(245, 124, 0, 0.08) 0%, rgba(21, 101, 192, 0.06) 100%)",
              border: "1px solid rgba(245, 124, 0, 0.28)",
              borderRadius: "16px",
              padding: "16px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  color: "#F57C00",
                  letterSpacing: "0.5px",
                }}
              >
                <i className="fa-solid fa-sparkles" /> NOUVEAUTÉ 2026
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  padding: "2px 7px",
                  borderRadius: "99px",
                }}
              >
                Prêt
              </span>
            </div>
            <div
              style={{
                fontSize: "0.92rem",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "4px",
              }}
            >
              Générez un Quiz en 30 secondes
            </div>
            <div
              style={{
                fontSize: "0.74rem",
                color: "#334155",
                lineHeight: 1.45,
                marginBottom: "12px",
              }}
            >
              Importez un PDF de cours ou une photo d&apos;épreuve et révisez sans connexion lourde.
            </div>
            <a
              href="#campusly-ai"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#F57C00",
                color: "#FFFFFF",
                fontSize: "0.78rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(245, 124, 0, 0.25)",
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles" /> Tester l&apos;IA gratuitement
            </a>
          </div>
        </div>

        {/* PIED FIXE DU DRAWER (CONNEXION & WHATSAPP) */}
        <div
          style={{
            padding: "16px 18px",
            borderTop: "1px solid rgba(21, 101, 192, 0.12)",
            backgroundColor: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
                border: "1px solid rgba(21, 101, 192, 0.18)",
                backgroundColor: "#FFFFFF",
                color: "#0F172A",
              }}
            >
              Se connecter
            </a>
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
                backgroundColor: "#1565C0",
                color: "#FFFFFF",
              }}
            >
              Créer un compte
            </a>
          </div>

          <a
            href="https://wa.me/2290158519556"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              textDecoration: "none",
            }}
          >
            <i
              className="fa-brands fa-whatsapp"
              style={{ fontSize: "1.5rem", color: "#10B981" }}
            />
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0F172A" }}>
                Besoin d&apos;aide à l&apos;UAC ?
              </div>
              <div style={{ fontSize: "0.68rem", color: "#10B981", fontWeight: 600 }}>
                Assistance WhatsApp (+229 01 58 51 95 56)
              </div>
            </div>
          </a>
        </div>
      </aside>

      {/* RÈGLES DE VISIBILITÉ RESPONSIVE COMPATIBLES AVEC TOUS LES SMARTPHONES */}
      <style jsx global>{`
        @keyframes navFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .nav-desk-item {
          text-decoration: none;
          color: #334155;
          font-size: 0.88rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .nav-desk-item:hover {
          color: #1565C0;
        }

        /* Sur écrans larges */
        @media (min-width: 961px) {
          .campusly-hamburger-btn {
            display: none !important;
          }
          #campuslyDrawerPanel {
            display: none !important;
          }
          #customBackdrop {
            display: none !important;
          }
        }

        /* Sur tablettes et smartphones */
        @media (max-width: 960px) {
          .campusly-desktop-nav,
          .campusly-desktop-actions {
            display: none !important;
          }
          .campusly-hamburger-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
