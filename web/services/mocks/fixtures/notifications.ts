/**
 * DONNÉES DE DÉMONSTRATION — notifications
 */

import type { AppNotification, NotificationPreferences } from "@/types";

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "composition",
    title: "Composition bientôt disponible",
    message: "« Partiel — Algorithmique (S1) » ouvre aujourd'hui. Code : ALGO1.",
    createdAt: "2026-11-01T05:30:00.000Z",
    read: false,
    href: "/dashboard/compositions",
    actionLabel: "Voir la composition",
  },
  {
    id: "notif-2",
    type: "classroom",
    title: "Nouvelle annonce en Algorithmique",
    message: "Le TD de vendredi est déplacé à l'amphi C.",
    createdAt: "2026-10-29T16:22:00.000Z",
    read: false,
    href: "/dashboard/classrooms",
    actionLabel: "Ouvrir la classroom",
  },
  {
    id: "notif-3",
    type: "credits",
    title: "Crédits utilisés",
    message: "25 crédits consommés par une analyse de document Campusly AI.",
    createdAt: "2026-10-28T09:05:00.000Z",
    read: false,
    href: "/dashboard/credits",
    actionLabel: "Voir l'historique",
  },
  {
    id: "notif-4",
    type: "forum",
    title: "Réponse à votre question",
    message: "Dr. Komlan Agboton a répondu à « Comment retenir les rotations AVL ».",
    createdAt: "2026-10-30T20:06:00.000Z",
    read: true,
    href: "/dashboard/forum",
    actionLabel: "Lire la réponse",
  },
  {
    id: "notif-5",
    type: "ai",
    title: "Quiz prêt",
    message: "Votre quiz « Algorithmique — Structures & complexité » est disponible.",
    createdAt: "2026-10-30T09:00:00.000Z",
    read: true,
    href: "/dashboard/revision",
    actionLabel: "Lancer le quiz",
  },
  {
    id: "notif-6",
    type: "system",
    title: "Environnement de démonstration",
    message:
      "Cette version du frontend utilise des données fictives : aucune action n'est enregistrée sur un serveur.",
    createdAt: "2026-10-20T08:00:00.000Z",
    read: true,
  },
];

export const DEMO_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: false,
  compositionReminders: true,
  forumReplies: true,
  creditsAlerts: true,
};
