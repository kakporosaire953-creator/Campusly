"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AppNotification } from "@/types";
import { notificationService } from "@/services/notificationService";
import { formatRelativeFr } from "@/services/mocks/store";

/**
 * Cloche de notifications.
 * Remplace l'ancien `toggleDropdown()` qui construisait du HTML à la volée
 * dans le DOM global. Le panneau est ici un vrai composant, fermable au
 * clavier, et les notifications sont fictives.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = () => {
    notificationService
      .list()
      .then((result) => {
        setItems(result.items.slice(0, 5));
        setUnread(result.unread);
      })
      .catch(() => {
        setItems([]);
        setUnread(0);
      });
  };

  useEffect(load, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markAll = async () => {
    await notificationService.markAllAsRead();
    load();
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Notifications${unread > 0 ? ` (${unread} non lues)` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((value) => !value);
          load();
        }}
      >
        <i className="fa-solid fa-bell" aria-hidden="true" />
        {unread > 0 ? (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--danger)",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 800,
              borderRadius: "50%",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Centre de notifications"
          style={{
            position: "absolute",
            top: 46,
            right: 0,
            width: 340,
            maxWidth: "calc(100vw - 32px)",
            background: "var(--bg-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            padding: 16,
            zIndex: 1200,
          }}
        >
          <div className="row-between" style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
            <strong style={{ fontSize: "0.9rem", color: "var(--text-1)" }}>Notifications</strong>
            <button
              type="button"
              onClick={markAll}
              style={{ background: "none", border: "none", color: "var(--brand-1)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
            >
              Tout marquer comme lu
            </button>
          </div>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
            {items.length === 0 ? (
              <li style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>Aucune notification.</li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href ?? "/dashboard/notifications"}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      padding: 10,
                      borderRadius: "var(--r-lg)",
                      border: `1px solid ${item.read ? "var(--border)" : "rgba(21,101,192,0.25)"}`,
                      background: item.read ? "var(--surface)" : "rgba(21,101,192,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontSize: "0.82rem", color: "var(--text-1)" }}>{item.title}</strong>
                      {!item.read ? <span className="status-dot live" aria-label="Non lue" /> : null}
                    </div>
                    <p style={{ fontSize: "0.76rem", color: "var(--text-2)", margin: "4px 0", lineHeight: 1.4 }}>
                      {item.message}
                    </p>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-3)" }}>{formatRelativeFr(item.createdAt)}</div>
                  </Link>
                </li>
              ))
            )}
          </ul>

          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            style={{ display: "block", marginTop: 12, textAlign: "center", fontSize: "0.78rem", fontWeight: 700, color: "var(--brand-1)" }}
          >
            Voir toutes les notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
}
