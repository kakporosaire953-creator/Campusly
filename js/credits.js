// ============================================================
// CAMPUSLY — js/credits.js
// Système de gestion des Campusly Credits & Paiement FedaPay
// ============================================================

const API_BASE = '/api';

export class CreditManager {
  constructor() {
    this.userId = this.getUserId();
    this.balance = 120;
    this.listeners = [];
  }

  getUserId() {
    let uid = localStorage.getItem('campusly_user_id');
    if (!uid) {
      uid = 'usr_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('campusly_user_id', uid);
    }
    return uid;
  }

  async fetchBalance() {
    try {
      const res = await fetch(`${API_BASE}/credits/${this.userId}`);
      if (res.ok) {
        const data = await res.json();
        this.balance = data.credits;
        this.notify(data);
        return data;
      }
    } catch (e) {
      console.warn('Fallback offline credits balance', e);
    }
    return { credits: this.balance };
  }

  async consume(amount, reason = 'Action Campusly AI') {
    try {
      const res = await fetch(`${API_BASE}/credits/consume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.userId, amount, reason })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          this.showCreditModal(amount);
        }
        throw new Error(data.error || 'Crédits insuffisants');
      }
      this.balance = data.remainingCredits;
      this.notify({ credits: this.balance });
      return data;
    } catch (err) {
      throw err;
    }
  }

  async topUp(packId, method = 'fedapay_momo', phoneNumber = '') {
    const res = await fetch(`${API_BASE}/credits/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, packId, method, phoneNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du rechargement');
    this.balance = data.newBalance;
    this.notify({ credits: this.balance });
    return data;
  }

  onChange(callback) {
    this.listeners.push(callback);
    callback({ credits: this.balance });
  }

  notify(data) {
    this.listeners.forEach(fn => fn(data));
    this.updatePillUI();
  }

  updatePillUI() {
    const pills = document.querySelectorAll('.campusly-credits-pill');
    pills.forEach(el => {
      el.innerHTML = `
        <span class="credits-icon" style="color:var(--accent);">⚡</span>
        <span class="credits-label" style="font-weight:700;">${this.balance}</span>
        <span style="font-size:0.75rem;color:var(--text-3);margin-left:2px;">crédits</span>
      `;
    });
  }

  showCreditModal(requiredAmount = null) {
    let modal = document.getElementById('creditModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'creditModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-card" style="max-width:540px;background:var(--bg-2);border:1px solid var(--border-2);border-radius:var(--r-xl);padding:28px;box-shadow:var(--shadow-xl);position:relative;z-index:9999;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div>
              <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,124,0,0.12);border:1px solid rgba(245,124,0,0.3);color:var(--accent);font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:var(--r-full);text-transform:uppercase;margin-bottom:8px;">
                Campusly Credits
              </div>
              <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-1);">Recharger mon solde</h3>
              <p style="font-size:0.85rem;color:var(--text-2);margin-top:4px;">
                Solde actuel : <strong style="color:var(--accent);font-size:1rem;">${this.balance} crédits</strong>
                ${requiredAmount ? `<span style="display:block;color:var(--danger);font-size:0.8rem;margin-top:4px;">Cette opération requiert ${requiredAmount} crédits.</span>` : ''}
              </p>
            </div>
            <button class="modal-close-btn" onclick="document.getElementById('creditModal').classList.remove('show')" style="background:none;border:none;color:var(--text-3);font-size:1.2rem;cursor:pointer;padding:4px;">✕</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
            <div class="credit-pack-item" data-pack="pack_50" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;transition:all 0.2s ease;">
              <div>
                <div style="font-weight:700;color:var(--text-1);font-size:0.95rem;">Pack Découverte</div>
                <div style="font-size:0.78rem;color:var(--text-3);">50 Campusly Credits (Idéal pour 5 analyses complètes)</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;color:var(--brand-2);font-size:1.05rem;">1 000 FCFA</div>
                <button class="btn btn-accent btn-sm" style="margin-top:4px;" onclick="window.campuslyCredits.buyPack('pack_50')">Acheter</button>
              </div>
            </div>

            <div class="credit-pack-item active" data-pack="pack_250" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(21,101,192,0.08);border:2px solid var(--brand-1);border-radius:var(--r-md);cursor:pointer;position:relative;">
              <span style="position:absolute;top:-9px;right:16px;background:var(--accent);color:#fff;font-size:0.68rem;font-weight:800;padding:2px 8px;border-radius:var(--r-full);">RECOMMANDÉ</span>
              <div>
                <div style="font-weight:700;color:var(--text-1);font-size:0.95rem;">Pack Réussite</div>
                <div style="font-size:0.78rem;color:var(--text-3);">250 Campusly Credits + 25 Bonus révision</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;color:var(--brand-2);font-size:1.05rem;">3 500 FCFA</div>
                <button class="btn btn-primary btn-sm" style="margin-top:4px;" onclick="window.campuslyCredits.buyPack('pack_250')">Acheter</button>
              </div>
            </div>

            <div class="credit-pack-item" data-pack="pack_1000" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;">
              <div>
                <div style="font-weight:700;color:var(--text-1);font-size:0.95rem;">Pack Master Semestre</div>
                <div style="font-size:0.78rem;color:var(--text-3);">1 000 Campusly Credits illimités</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;color:var(--brand-2);font-size:1.05rem;">10 000 FCFA</div>
                <button class="btn btn-accent btn-sm" style="margin-top:4px;" onclick="window.campuslyCredits.buyPack('pack_1000')">Acheter</button>
              </div>
            </div>
          </div>

          <div style="background:var(--surface-2);border-radius:var(--r-md);padding:14px;display:flex;align-items:center;gap:12px;font-size:0.78rem;color:var(--text-2);">
            <div style="font-size:1.4rem;"><i class="fas fa-shield-alt" style="color:var(--success);"></i></div>
            <div>
              <strong>Paiement sécurisé via FedaPay</strong><br/>
              Compatible MTN Mobile Money, Moov Money, Orange, Wave et Carte Bancaire.
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.classList.add('show');
  }

  async buyPack(packId) {
    const phoneNumber = prompt('Entrez votre numéro Mobile Money (MTN / Moov / Orange / Wave) :') || '97000000';
    try {
      const modal = document.getElementById('creditModal');
      if (modal) modal.classList.remove('show');
      
      const result = await this.topUp(packId, 'fedapay_momo', phoneNumber);
      if (window.showToast) {
        window.showToast(`✅ ${result.message}`, 'success');
      } else {
        alert(result.message);
      }
    } catch (e) {
      if (window.showToast) window.showToast(`Erreur: ${e.message}`, 'error');
    }
  }
}

export const campuslyCredits = new CreditManager();
window.campuslyCredits = campuslyCredits;
