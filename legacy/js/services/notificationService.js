// ============================================================
// CAMPUSLY 2.0 — notificationService.js
// Centre de notifications In-App & badge de navbar
// ============================================================

const MOCK_NOTIFICATIONS = [];

const STORAGE_KEY = 'campusly_notifications';

export class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
  }

  loadNotifications() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading notifications', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
    return [...MOCK_NOTIFICATIONS];
  }

  saveNotifications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    this.updateBadges();
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => n.unread).length;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.unread = false);
    this.saveNotifications();
    const dropdown = document.getElementById('notifDropdown');
    if (dropdown) dropdown.style.display = 'none';
  }

  addNotification(notif) {
    const newNotif = {
      id: "notif_" + Date.now(),
      date: "À l'instant",
      unread: true,
      ...notif
    };
    this.notifications.unshift(newNotif);
    this.saveNotifications();
    if (window.showToast) {
      window.showToast(newNotif.title, 'info');
    }
    return newNotif;
  }

  updateBadges() {
    const count = this.getUnreadCount();
    document.querySelectorAll('.notif-badge-count').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  toggleDropdown() {
    let dropdown = document.getElementById('notifDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'notifDropdown';
      dropdown.className = 'notif-dropdown-card';
      dropdown.style.cssText = `
        position:fixed;top:64px;right:24px;width:360px;max-width:calc(100vw - 32px);background:var(--bg-2);
        border:1px solid var(--border-2);border-radius:var(--r-xl);box-shadow:var(--shadow-xl);padding:18px;
        z-index:9999;display:none;
      `;
      document.body.appendChild(dropdown);
    }

    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:10px;">
        <div style="font-weight:800;color:var(--text-1);font-size:1rem;">
          <i class="fas fa-bell" style="color:var(--brand-2);margin-right:6px;"></i> Notifications
        </div>
        <button onclick="window.notificationService.markAllAsRead()" style="background:none;border:none;color:var(--brand-2);font-size:0.75rem;cursor:pointer;font-weight:700;">
          Tout marquer comme lu
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto;padding-right:4px;">
        ${this.notifications.map(n => `
          <div onclick="window.location.href='${n.link || 'dashboard.html'}'" style="padding:12px;background:${n.unread ? 'rgba(21,101,192,0.08)' : 'var(--surface)'};border:1px solid ${n.unread ? 'rgba(21,101,192,0.25)' : 'var(--border)'};border-radius:var(--r-lg);cursor:pointer;transition:all 0.15s ease;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
              <strong style="font-size:0.85rem;color:var(--text-1);">${n.title}</strong>
              ${n.unread ? '<span style="width:8px;height:8px;background:var(--brand-2);border-radius:50%;"></span>' : ''}
            </div>
            <p style="font-size:0.78rem;color:var(--text-2);line-height:1.4;margin:0 0 6px;">${n.message}</p>
            <div style="font-size:0.68rem;color:var(--text-3);font-family:var(--font-mono);">${n.date}</div>
          </div>
        `).join('')}
      </div>
    `;
    dropdown.style.display = 'block';
  }
}

export const notificationService = new NotificationService();
window.notificationService = notificationService;
