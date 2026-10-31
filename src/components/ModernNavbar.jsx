"use client";

import React, { useState, useEffect } from "react";

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Empêcher le scroll du body quand le drawer mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Piliers", href: "#pillars", icon: "fa-solid fa-layer-group" },
    { label: "Campusly AI", href: "#campusly-ai", icon: "fa-solid fa-wand-magic-sparkles", badge: "2.0" },
    { label: "Épreuves & Annales", href: "#pillars", icon: "fa-solid fa-book-bookmark" },
    { label: "Classrooms", href: "#professeurs", icon: "fa-solid fa-chalkboard-user" },
    { label: "Compositions", href: "#compositions", icon: "fa-solid fa-stopwatch" },
    { label: "Crédits & Tarifs", href: "#pricing", icon: "fa-solid fa-tags" },
    { label: "FAQ", href: "#faq", icon: "fa-solid fa-circle-question" },
  ];

  return (
    <>
      <nav
        id="navbar"
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          height: "68px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          background: scrolled ? "rgba(255, 255, 255, 0.94)" : "var(--bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          transition: "all 0.25s ease",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* LOGO */}
        <a
          href="/"
          className="nav-logo"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
        >
          <span className="logo-text" style={{ fontSize: "1.45rem", fontWeight: 900 }}>
            <span className="logo-campus" style={{ color: "var(--brand-1)" }}>Campus</span>
            <span className="logo-ly" style={{ color: "var(--accent)" }}>ly</span>
          </span>
          <span
            style={{
              marginLeft: "8px",
              fontSize: "0.62rem",
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: "999px",
              background: "rgba(21,101,192,0.1)",
              color: "var(--brand-1)",
              letterSpacing: "0.5px",
            }}
          >
            UAC
          </span>
        </a>

        {/* DESKTOP LINKS */}
        <ul
          className="nav-links-desktop"
          style={{
            display: "flex",
            listStyle: "none",
            gap: "22px",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          {navLinks.map((item, idx) => (
            <li key={idx}>
              <a
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "var(--text-2)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "color 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-1)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
              >
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      background: "var(--accent)",
                      color: "#fff",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* ACTIONS & NOUVEAU BOUTON HAMBURGER */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Boutons Desktop */}
          <div className="nav-actions-desktop" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href="#pillars"
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: "0.8rem",
                padding: "8px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Connexion
            </a>
            <a
              href="#pillars"
              className="btn btn-primary btn-sm"
              style={{
                fontSize: "0.8rem",
                padding: "8px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                background: "var(--brand-1)",
                color: "#fff",
              }}
            >
              S&apos;inscrire
            </a>
          </div>

          {/* NOUVEAU BOUTON HAMBURGER MODERNE (Touch-friendly & Stylisé) */}
          <button
            id="modernHamburgerBtn"
            className="mobile-hamburger-trigger"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: "none", // Débloqué par CSS sur mobile
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: "1px solid var(--border-2)",
              background: isOpen ? "rgba(21,101,192,0.12)" : "var(--surface)",
              color: isOpen ? "var(--brand-1)" : "var(--text-1)",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              outline: "none",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "14px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "100%",
                  height: "2.2px",
                  background: isOpen ? "var(--brand-1)" : "var(--text-1)",
                  borderRadius: "2px",
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
                  background: isOpen ? "var(--brand-1)" : "var(--text-1)",
                  borderRadius: "2px",
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
                  background: isOpen ? "var(--brand-1)" : "var(--text-1)",
                  borderRadius: "2px",
                  transition: "all 0.25s ease",
                  transformOrigin: "center",
                  transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* OVERLAY SOMBRE FLOU POUR LE DRAWER MOBILE */}
      <div
        className={`mobile-menu-backdrop ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 1150,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* NOUVEAU MENU DRAWER MOBILE LATÉRAL MODERNE */}
      <aside
        id="modernMobileDrawer"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(340px, 86vw)",
          background: "var(--bg)",
          borderLeft: "1px solid var(--border-2)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
        }}
      >
        {/* Entête du drawer mobile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 900 }}>
              <span style={{ color: "var(--brand-1)" }}>Campus</span>
              <span style={{ color: "var(--accent)" }}>ly</span>
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                padding: "2px 7px",
                borderRadius: "999px",
                background: "rgba(21,101,192,0.1)",
                color: "var(--brand-1)",
              }}
            >
              Menu
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Liste des Liens de Navigation */}
        <div style={{ padding: "16px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--text-3)",
              padding: "4px 10px 8px",
            }}
          >
            Navigation Principale
          </div>

          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "12px",
                textDecoration: "none",
                color: "var(--text-1)",
                fontSize: "0.88rem",
                fontWeight: 700,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: "rgba(21,101,192,0.1)",
                    color: "var(--brand-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <i className={item.icon} />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: "999px",
                    background: "var(--accent)",
                    color: "#fff",
                  }}
                >
                  {item.badge}
                </span>
              ) : (
                <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.7rem", color: "var(--text-3)" }} />
              )}
            </a>
          ))}

          {/* Raccourci d'action immédiate */}
          <div style={{ marginTop: "14px", padding: "14px", borderRadius: "14px", background: "rgba(245,124,0,0.06)", border: "1px solid rgba(245,124,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontWeight: 800, fontSize: "0.78rem", marginBottom: "4px" }}>
              <i className="fa-solid fa-bolt" /> Campusly AI 2.0
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.4, marginBottom: "10px" }}>
              Générez instantanément des QCM à partir de vos polycopiés et fiches de cours.
            </div>
            <a
              href="#campusly-ai"
              onClick={() => setIsOpen(false)}
              className="btn btn-accent btn-sm"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "0.76rem",
                padding: "8px",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
              }}
            >
              Tester l&apos;IA maintenant
            </a>
          </div>
        </div>

        {/* Pied du Drawer : Boutons d'Authentification & Support WhatsApp */}
        <div
          style={{
            padding: "16px 18px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface-2)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              className="btn btn-outline btn-sm"
              style={{
                justifyContent: "center",
                fontSize: "0.8rem",
                padding: "9px 12px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Connexion
            </a>
            <a
              href="#pillars"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary btn-sm"
              style={{
                justifyContent: "center",
                fontSize: "0.8rem",
                padding: "9px 12px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                textAlign: "center",
                background: "var(--brand-1)",
                color: "#fff",
              }}
            >
              S&apos;inscrire
            </a>
          </div>

          <a
            href="https://wa.me/2290158519556"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#10b981",
              textDecoration: "none",
            }}
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: "0.95rem" }} />
            Assistance WhatsApp UAC Bénin
          </a>
        </div>
      </aside>

      {/* Règles CSS responsives dédiées au nouveau menu hamburger */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-actions-desktop {
            display: none !important;
          }
          .mobile-hamburger-trigger {
            display: inline-flex !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-hamburger-trigger {
            display: none !important;
          }
          #modernMobileDrawer {
            display: none !important;
          }
          .mobile-menu-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
