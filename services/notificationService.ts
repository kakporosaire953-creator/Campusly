/**
 * notificationService — SIMULATION frontend
 * Aucune notification n'est envoyée (ni e-mail, ni push).
 * Endpoints futurs : GET /api/notifications, POST /api/notifications/:id/read,
 * POST /api/notifications/read-all, GET/PATCH /api/notifications/preferences.
 */

import type {
  AppNotification,
  NotificationPreferences,
  NotificationServiceContract,
} from "@/types";
import { DEMO_NOTIFICATIONS, DEMO_NOTIFICATION_PREFERENCES } from "./mocks/fixtures/notifications";
import { demoDelay, demoStore } from "./mocks/store";

const LIST_KEY = "notifications";
const PREFS_KEY = "notification-preferences";

class NotificationService implements NotificationServiceContract {
  private all(): AppNotification[] {
    return demoStore.read<AppNotification[]>(LIST_KEY, DEMO_NOTIFICATIONS);
  }

  async list(query?: { unreadOnly?: boolean; page?: number; pageSize?: number }) {
    await demoDelay(90);
    const all = this.all();
    const filtered = query?.unreadOnly ? all.filter((item) => !item.read) : all;
    return {
      items: filtered,
      total: filtered.length,
      unread: all.filter((item) => !item.read).length,
    };
  }

  async markAsRead(id: string): Promise<void> {
    await demoDelay(60);
    demoStore.write(
      LIST_KEY,
      this.all().map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  async markAllAsRead(): Promise<void> {
    await demoDelay(80);
    demoStore.write(
      LIST_KEY,
      this.all().map((item) => ({ ...item, read: true })),
    );
  }

  async preferences(): Promise<NotificationPreferences> {
    await demoDelay(50);
    return demoStore.read<NotificationPreferences>(PREFS_KEY, DEMO_NOTIFICATION_PREFERENCES);
  }

  async updatePreferences(input: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    await demoDelay(120);
    const next = { ...(await this.preferences()), ...input };
    demoStore.write(PREFS_KEY, next);
    return next;
  }

  /** Lecture synchrone du compteur, pour le badge de l'en-tête. */
  unreadCount(): number {
    return this.all().filter((item) => !item.read).length;
  }
}

export const notificationService = new NotificationService();
