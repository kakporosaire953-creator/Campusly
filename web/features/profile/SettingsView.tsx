"use client";

import { useState } from "react";
import type { NotificationPreferences } from "@/types";
import { notificationService } from "@/services/notificationService";
import { authService } from "@/services/authService";
import { classroomService } from "@/services/classroomService";
import { examService } from "@/services/examService";
import { quizService } from "@/services/quizService";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingGrid, ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/ToastProvider";

const PREFERENCE_LABELS: Array<{ key: keyof NotificationPreferences; label: string; description: string }> = [
  { key: "email", label: "Notifications par e-mail", description: "Résumés hebdomadaires et alertes de compte." },
  { key: "push", label: "Notifications push", description: "Rappels de composition sur l'appareil." },
  { key: "compositionReminders", label: "Rappels de composition", description: "24 h et 1 h avant l'ouverture." },
  { key: "forumReplies", label: "Réponses au forum", description: "Quand quelqu'un répond à vos sujets." },
  { key: "creditsAlerts", label: "Alertes de crédits", description: "Solde faible et fins d'abonnement." },
];

export function SettingsView() {
  const preferences = useAsync(() => notificationService.preferences(), []);
  const { toast } = useToast();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const toggle = async (key: keyof NotificationPreferences) => {
    if (!preferences.data) return;
    setSavingKey(key);
    try {
      const next = await notificationService.updatePreferences({ [key]: !preferences.data[key] });
      preferences.setData(next);
      toast("Préférence enregistrée localement (démonstration).", "info");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <PageHeader
        title="Paramètres"
        subtitle="Notifications, accessibilité et réinitialisation de l'environnement de démonstration."
        demo
      />

      <Card>
        <CardHeader title="Notifications" subtitle="Préférences locales, aucun envoi réel" icon="fa-regular fa-bell" />
        {preferences.status === "loading" || preferences.status === "idle" ? <LoadingGrid count={1} /> : null}
        {preferences.status === "error" ? (
          <ErrorState message={preferences.error ?? "Préférences indisponibles."} onRetry={preferences.reload} />
        ) : null}
        {preferences.data ? (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {PREFERENCE_LABELS.map((item) => {
              const checked = preferences.data![item.key];
              return (
                <li key={item.key} className="row-between" style={{ gap: 16, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-1)" }}>{item.label}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-2)" }}>{item.description}</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={item.label}
                    disabled={savingKey === item.key}
                    onClick={() => toggle(item.key)}
                    style={{
                      width: 46,
                      height: 26,
                      borderRadius: 999,
                      border: "1px solid var(--border)",
                      background: checked ? "var(--brand-1)" : "var(--surface-2)",
                      position: "relative",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: checked ? 22 : 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        transition: "left 0.15s",
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Accessibilité" subtitle="Préférences appliquées par le navigateur" icon="fa-universal-access fa-solid" />
        <p style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
          Campusly respecte la préférence système <code>prefers-reduced-motion</code> : les animations sont
          neutralisées automatiquement. La navigation clavier est complète (lien d&apos;évitement, focus visible,
          fermeture des dialogues par Échap).
        </p>
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <Badge tone="success" icon="fa-solid fa-keyboard">
            Navigation clavier
          </Badge>
          <Badge tone="success" icon="fa-solid fa-eye">
            Contrastes vérifiés
          </Badge>
          <Badge tone="neutral" icon="fa-solid fa-text-height">
            Tailles de texte adaptatives
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Données de démonstration" subtitle="Stockage local du navigateur (localStorage)" icon="fa-solid fa-database" />
        <p style={{ fontSize: "0.82rem", color: "var(--text-2)", marginBottom: 12 }}>
          Les favoris, quiz, classrooms, compositions et crédits affichés sont conservés uniquement dans ce
          navigateur. Aucune donnée n&apos;est envoyée à un serveur.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Button
            variant="outline"
            size="sm"
            icon="fa-solid fa-rotate-left"
            onClick={() => {
              authService.resetDemo();
              toast("Session de démonstration réinitialisée.", "info");
            }}
          >
            Réinitialiser la session
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="fa-solid fa-star-half-stroke"
            onClick={() => {
              void examService.favorites().then((items) => toast(`${items.length} favoris enregistrés.`, "info"));
            }}
          >
            Vérifier les favoris
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="fa-solid fa-layer-group"
            onClick={() => {
              void quizService.attempts().then((items) => toast(`${items.length} tentative(s) de quiz enregistrée(s).`, "info"));
            }}
          >
            Vérifier les tentatives
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="fa-solid fa-chalkboard"
            onClick={() => {
              toast(`${classroomService.joinedIds().length} classroom(s) rejointe(s).`, "info");
            }}
          >
            Vérifier les classrooms
          </Button>
        </div>
      </Card>
    </div>
  );
}
