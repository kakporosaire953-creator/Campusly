// ============================================================
// CAMPUSLY 2.0 — creditService.js
// Gestion des Campusly Credits (120 crédits, historique, recharges)
// ============================================================

import { authService } from './authService.js';

export class CreditService {
  constructor() {
    this.listeners = [];
  }

  getBalance() {
    const user = authService.getUser();
    return user?.credits ?? 120;
  }

  getHistory() {
    const user = authService.getUser();
    return user?.creditHistory || [
      { id: "tx_1", date: "Aujourd'hui", desc: "Bonus Série Quotidienne (7 jours)", amount: +10, type: "credit" },
      { id: "tx_2", date: "Hier", desc: "Campusly AI — Analyse Polycopié Algorithmique", amount: -15, type: "debit" },
      { id: "tx_3", date: "28 Août 2026", desc: "Session Marathon Adaptatif", amount: -10, type: "debit" },
      { id: "tx_4", date: "20 Août 2026", desc: "Recharge Pack Découverte (MTN MoMo)", amount: +100, type: "credit" }
    ];
  }

  async consume(amount = 15, reason = "Analyse Campusly AI") {
    const user = authService.getUser();
    const current = user?.credits ?? 120;

    if (current < amount) {
      this.showCreditModal(amount);
      throw new Error(`Crédits insuffisants. Vous avez ${current} crédits, mais ${amount} sont requis.`);
    }

    const newBalance = current - amount;
    const history = [
      {
        id: "tx_" + Date.now(),
        date: "À l'instant",
        desc: reason,
        amount: -amount,
        type: "debit"
      },
      ...(user.creditHistory || [])
    ];

    authService.updateProfile({ credits: newBalance, creditHistory: history });
    this.notify();
    return { success: true, balance: newBalance };
  }

  async topUp(creditsAmount, priceFcfa, provider = "MTN MoMo", phone = "") {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulation réseau

    const user = authService.getUser();
    const current = user?.credits ?? 120;
    const newBalance = current + creditsAmount;

    const history = [
      {
        id: "tx_" + Date.now(),
        date: "À l'instant",
        desc: `Recharge Pack (${creditsAmount} crédits via ${provider})`,
        amount: +creditsAmount,
        type: "credit"
      },
      ...(user.creditHistory || [])
    ];

    authService.updateProfile({ credits: newBalance, creditHistory: history });
    this.notify();
    return { success: true, newBalance, message: `${creditsAmount} Campusly Credits ajoutés à votre compte.` };
  }

  onChange(cb) {
    this.listeners.push(cb);
    cb(this.getBalance());
  }

  notify() {
    const balance = this.getBalance();
    this.listeners.forEach(fn => fn(balance));
    this.updatePillUI();
  }

  updatePillUI() {
    const balance = this.getBalance();
    document.querySelectorAll('.campusly-credits-pill').forEach(el => {
      el.innerHTML = `
        <i class="fa-solid fa-bolt" style="color:var(--accent);"></i>
        <strong style="font-size:0.95rem;margin-left:4px;">${balance}</strong>
        <span style="font-size:0.75rem;color:var(--text-3);margin-left:2px;">crédits</span>
      `;
    });
  }

  showCreditModal(requiredCredits = null) {
    let modal = document.getElementById('creditModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'creditModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const current = this.getBalance();
    const warningMsg = requiredCredits && requiredCredits > current
      ? `<div style="background:rgba(211,47,47,0.1);border:1px solid rgba(211,47,47,0.3);color:var(--danger);padding:10px 14px;border-radius:var(--r-md);font-size:0.85rem;margin-bottom:16px;">
          <i class="fa-solid fa-triangle-exclamation"></i> Vous avez besoin de <strong>${requiredCredits} crédits</strong> pour cette action (Solde actuel : ${current} crédits).
        </div>`
      : '';

    modal.innerHTML = `
      <div class="modal-box" style="max-width:540px;background:var(--bg-2);border:1px solid var(--border-2);border-radius:var(--r-xl);padding:28px;box-shadow:var(--shadow-xl);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(245,124,0,0.15);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div>
              <h3 style="font-size:1.25rem;font-weight:800;color:var(--text-1);margin:0;">Campusly Credits</h3>
              <div style="font-size:0.8rem;color:var(--text-3);">Solde actuel : <strong style="color:var(--accent);">${current} crédits</strong></div>
            </div>
          </div>
          <button onclick="document.getElementById('creditModal').classList.remove('show')" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--text-3);"><i class="fa-solid fa-xmark"></i></button>
        </div>

        ${warningMsg}

        <p style="font-size:0.875rem;color:var(--text-2);line-height:1.5;margin-bottom:20px;">
          Les crédits Campusly alimentent le moteur <strong>Campusly AI</strong> (analyse de documents, fiches synthétiques et génération de quiz adaptatifs).
        </p>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
          <!-- Pack 1 -->
          <div class="card credit-pack-card" style="border:1.5px solid var(--border);border-radius:var(--r-lg);padding:14px 10px;text-align:center;cursor:pointer;background:var(--surface);transition:all 0.2s;" onclick="selectCreditPack(100, 500, this)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;">Découverte</div>
            <div style="font-size:1.3rem;font-weight:900;color:var(--accent);margin:4px 0;">100 <i class="fa-solid fa-bolt" style="font-size:0.9rem;"></i></div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text-1);">500 FCFA</div>
          </div>

          <!-- Pack 2 (Recommandé) -->
          <div class="card credit-pack-card active" style="border:2px solid var(--brand-1);border-radius:var(--r-lg);padding:14px 10px;text-align:center;cursor:pointer;background:rgba(21,101,192,0.06);position:relative;transition:all 0.2s;" onclick="selectCreditPack(250, 1000, this)">
            <span style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--grad-brand);color:#fff;font-size:0.62rem;font-weight:800;padding:2px 8px;border-radius:var(--r-full);text-transform:uppercase;">Populaire</span>
            <div style="font-size:0.75rem;font-weight:700;color:var(--brand-2);text-transform:uppercase;">Révision</div>
            <div style="font-size:1.3rem;font-weight:900;color:var(--brand-1);margin:4px 0;">250 <i class="fa-solid fa-bolt" style="font-size:0.9rem;"></i></div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text-1);">1 000 FCFA</div>
          </div>

          <!-- Pack 3 -->
          <div class="card credit-pack-card" style="border:1.5px solid var(--border);border-radius:var(--r-lg);padding:14px 10px;text-align:center;cursor:pointer;background:var(--surface);transition:all 0.2s;" onclick="selectCreditPack(700, 2500, this)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;">Semestre</div>
            <div style="font-size:1.3rem;font-weight:900;color:var(--success);margin:4px 0;">700 <i class="fa-solid fa-bolt" style="font-size:0.9rem;"></i></div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text-1);">2 500 FCFA</div>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:0.78rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Moyen de paiement sécurisé (Simulation)</label>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            <button type="button" class="btn btn-outline btn-sm payment-btn active" onclick="setPaymentMethod('MTN MoMo', this)">
              <i class="fa-solid fa-mobile-screen" style="color:#eab308;margin-right:4px;"></i> MTN MoMo
            </button>
            <button type="button" class="btn btn-outline btn-sm payment-btn" onclick="setPaymentMethod('Moov Money', this)">
              <i class="fa-solid fa-mobile-screen-button" style="color:#3b82f6;margin-right:4px;"></i> Moov
            </button>
            <button type="button" class="btn btn-outline btn-sm payment-btn" onclick="setPaymentMethod('Carte Bancaire', this)">
              <i class="fa-solid fa-credit-card" style="margin-right:4px;"></i> CB / Visa
            </button>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:0.78rem;font-weight:700;color:var(--text-2);margin-bottom:6px;">Numéro Mobile Money (Bénin +229)</label>
          <input type="tel" id="creditPhoneInput" placeholder="Ex: 97 00 11 22" value="97 12 34 56" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:var(--r-md);background:var(--surface);color:var(--text-1);font-family:var(--font-mono);" />
        </div>

        <button id="creditConfirmBtn" class="btn btn-accent" style="width:100%;padding:12px;font-weight:800;" onclick="confirmCreditTopup()">
          Recharger 250 Crédits · 1 000 FCFA
        </button>
      </div>
    `;

    modal.classList.add('show');
  }
}

export const creditService = new CreditService();
window.creditService = creditService;

// Helpers globaux pour la modal
let _selectedPack = { credits: 250, price: 1000 };
let _selectedProvider = 'MTN MoMo';

window.selectCreditPack = (credits, price, el) => {
  _selectedPack = { credits, price };
  document.querySelectorAll('.credit-pack-card').forEach(c => {
    c.style.borderColor = 'var(--border)';
    c.style.background = 'var(--surface)';
  });
  if (el) {
    el.style.borderColor = 'var(--brand-1)';
    el.style.background = 'rgba(21,101,192,0.08)';
  }
  const btn = document.getElementById('creditConfirmBtn');
  if (btn) btn.textContent = `Recharger ${credits} Crédits · ${price.toLocaleString()} FCFA`;
};

window.setPaymentMethod = (provider, el) => {
  _selectedProvider = provider;
  document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
};

window.confirmCreditTopup = async () => {
  const btn = document.getElementById('creditConfirmBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="summary-spinner" style="width:16px;height:16px;margin-right:6px;"></span> Traitement sécurisé...`;
  }
  try {
    const res = await creditService.topUp(_selectedPack.credits, _selectedPack.price, _selectedProvider);
    document.getElementById('creditModal').classList.remove('show');
    if (window.showToast) window.showToast(res.message, 'success');
  } catch (e) {
    if (window.showToast) window.showToast('Erreur lors du rechargement', 'danger');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = `Recharger ${_selectedPack.credits} Crédits · ${_selectedPack.price.toLocaleString()} FCFA`;
    }
  }
};
