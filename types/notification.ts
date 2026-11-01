/**
 * Contrats Notifications — Campusly
 * ---------------------------------------------------------------------------
 * En production : notifications persistées en D1 + diffusion temps réel
 * (WebSocket Durable Object ou polling court). En démonstration : fixtures
 * locales, aucune diffusion.
 */

import type { PageQuery } from "./common";

export type NotificationType =
  | "system"
  | "credits"
  | "classroom"
  | "composition"
  | "forum"
  | "ai"
  | "exam";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  /** Route interne à ouvrir au clic. */
  href?: string;
  /** Libellé d'action affiché sur la notification. */
  actionLabel?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  compositionReminders: boolean;
  forumReplies: boolean;
  creditsAlerts: boolean;
}

export interface NotificationServiceContract {
  list(query?: PageQuery & { unreadOnly?: boolean }): Promise<{ items: AppNotification[]; total: number; unread: number }>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  preferences(): Promise<NotificationPreferences>;
  updatePreferences(input: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
}
