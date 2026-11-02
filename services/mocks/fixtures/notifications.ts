/**
 * DONNÉES DE DÉMONSTRATION — notifications
 */

import type { AppNotification, NotificationPreferences } from "@/types";

export const DEMO_NOTIFICATIONS: AppNotification[] = [];

export const DEMO_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: false,
  compositionReminders: true,
  forumReplies: true,
  creditsAlerts: true,
};
