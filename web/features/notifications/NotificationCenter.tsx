"use client";

import Link from "next/link";
import { useState } from "react";
import { notificationService } from "@/services/notificationService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";
import { formatRelativeFr } from "@/services/mocks/store";
import type { NotificationType } from "@/types";

const TYPE_META: Record<NotificationType, { icon: string; tone: "brand" | "accent" | "success" | "neutral" | "danger"; label: string }> = {
  system: { icon: "fa-solid fa-bullhorn", tone: "neutral", label: "Système" },
  credits: { icon: "fa-solid fa-bolt", tone: "accent", label: "Crédits" },
  classroom: { icon: "fa-solid fa-chalkboard-user", tone: "brand", label: "Classroom" },
  composition: { icon: "fa-solid fa-stopwatch", tone: "danger", label: "Composition" },
  forum: { icon: "fa-solid fa-comments", tone: "neutral", label: "Forum" },
  ai: { icon: "fa-solid fa-brain", tone: "brand", label: "Campusly AI" },
  exam: { icon: "fa-solid fa-file-pdf", tone: "neutral", label: "Épreuve" },
};

export function NotificationCenter() {
  const { data, status, error, reload, setData } = useAsync(() => notificationService.list({ pageSize: 50 }), []);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { toast } = useToast();

  const items = (data?.items ?? []).filter((item) => (filter === "unread" ? !item.read : true));

  const markAll = async () => {
    await notificationService.markAllAsRead();
    if (data) setData({ ...data, items: data.items.map((item) => ({ ...item, read: true })), unread: 0 });
    toast("Toutes les notifications sont marquées comme lues (démo).", "info");
  };

  const markOne = async (id: string) => {
    await notificationService.markAsRead(id);
    if (data) {
      const nextItems = data.items.map((item) => (item.id === id ? { ...item, read: true } : item));
      setData({ ...data, items: nextItems, unread: nextItems.filter((item) => !item.read).length });
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Notifications"
        subtitle="Activité de votre espace : compositions, classrooms, crédits et forum."
        demo
        actions={
          <>
            <Button
              variant={filter === "unread" ? "primary" : "ghost"}
              size="sm"
              aria-pressed={filter === "unread"}
              onClick={() => setFilter((current) => (current === "unread" ? "all" : "unread"))}
            >
              Non lues ({data?.unread ?? 0})
            </Button>
            <Button variant="outline" size="sm" icon="fa-solid fa-check-double" onClick={markAll}>
              Tout marquer lu
            </Button>
          </>
        }
      />

      {status === "loading" || status === "idle" ? <LoadingGrid count={2} /> : null}
      {status === "error" ? <ErrorState message={error ?? "Notifications indisponibles."} onRetry={reload} /> : null}

      {status === "success" && items.length === 0 ? (
        <EmptyState
          icon="fa-regular fa-bell"
          title={filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
          description="Les rappels de composition et les réponses du forum apparaîtront ici."
        />
      ) : null}

      {status === "success" && items.length > 0 ? (
        <div className="stack" style={{ gap: 10 }}>
          {items.map((notification) => {
            const meta = TYPE_META[notification.type];
            return (
              <Card key={notification.id}>
                <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: notification.read ? "var(--surface-2)" : "rgba(21,101,192,0.1)",
                      color: notification.read ? "var(--text-2)" : "var(--brand-1)",
                    }}
                  >
                    <i className={meta.icon} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <strong style={{ fontSize: "0.88rem", color: "var(--text-1)" }}>{notification.title}</strong>
                      {!notification.read ? <Badge tone="brand">Nouveau</Badge> : null}
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: 0, lineHeight: 1.55 }}>{notification.message}</p>
                    <div className="row" style={{ gap: 10, marginTop: 8 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{formatRelativeFr(notification.createdAt)}</span>
                      {notification.href ? (
                        <Link href={notification.href} style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--brand-1)" }}>
                          {notification.actionLabel ?? "Ouvrir"}
                        </Link>
                      ) : null}
                      {!notification.read ? (
                        <button
                          type="button"
                          onClick={() => markOne(notification.id)}
                          style={{ background: "none", border: 0, padding: 0, fontSize: "0.76rem", color: "var(--text-2)", cursor: "pointer", textDecoration: "underline" }}
                        >
                          Marquer comme lue
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="Canaux de diffusion"
          subtitle="Les préférences sont enregistrées localement (démonstration)"
          icon="fa-solid fa-sliders"
          action={<Button href="/dashboard/parametres" variant="ghost" size="sm">Configurer</Button>}
        />
        <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
          En production, les notifications seront persistées en D1 et diffusées par polling court ou Durable
          Object. Aucun e-mail ni push réel n&apos;est envoyé dans cette version.
        </p>
      </Card>
    </div>
  );
}
