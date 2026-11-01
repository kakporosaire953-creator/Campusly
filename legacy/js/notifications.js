// ============================================================
// CAMPUSLY — js/notifications.js
// Centre de notifications In-App & synchronisation
// ============================================================

export class NotificationCenter {
  constructor() {
    this.userId = localStorage.getItem('campusly_user_id') || 'usr_demo';
    this.notifications = [];
  }

  async fetchNotifications() {
    try {
      const res = await fetch(`/api/notifications/${this.userId}`);
      const data = await res.json();
      this.notifications = data.notifications || [];
      this.renderBellBadge();
      return this.notifications;
    } catch (e) {
      console.warn('Error fetching notifications', e);
      return [];
    }
  }

  renderBellBadge() {
    const unreadCount = this.notifications.filter(n => n.unread).length;
    const badges = document.querySelectorAll('.notif-badge-count');
    badges.forEach(b => {
      b.textContent = unreadCount;
      b.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
  }

  toggleDropdown() {
    let dropdown = document.getElementById('notifDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'notifDropdown';
      dropdown.className = 'notif-dropdown-card';
      dropdown.style.cssText = `
        position:absolute;top:56px;right:20px;width:340px;background:var(--bg-2);border:1px solid var(--border-2);
        border-radius:var(--r-lg);box-shadow:var(--shadow-xl);padding:16px;z-index:1000;display:none;
      `;
      document.body.appendChild(dropdown);
    }

    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid var(--border);padding-bottom:8px;">
        <span style="font-weight:800;color:var(--text-1);font-size:0.95rem;">Notifications</span>
        <button onclick="window.notificationCenter.markAllRead()" style="background:none;border:none;color:var(--brand-2);font-size:0.75rem;cursor:pointer;font-weight:700;">Tout marquer comme lu</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;">
        ${this.notifications.map(n => `
          <div onclick="window.location.href='${n.link}'" style="padding:10px;background:${n.unread ? 'rgba(21,101,192,0.06)' : 'var(--surface)'};border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;">
            <div style="font-weight:700;font-size:0.85rem;color:var(--text-1);margin-bottom:2px;">${n.title}</div>
            <div style="font-size:0.78rem;color:var(--text-2);line-height:1.4;margin-bottom:4px;">${n.message}</div>
            <div style="font-size:0.7rem;color:var(--text-3);">${n.date}</div>
          </div>
        `).join('')}
      </div>
    `;
    dropdown.style.display = 'block';
  }

  markAllRead() {
    this.notifications.forEach(n => n.unread = false);
    this.renderBellBadge();
    const dropdown = document.getElementById('notifDropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
}

export const notificationCenter = new NotificationCenter();
window.notificationCenter = notificationCenter;
