// ============================================================
// CAMPUSLY — Déconnexion automatique après inactivité
// ============================================================

import { supabase } from "./supabase-config.js";

const INACTIVITY_TIMEOUT = 60000; // 1 minute en millisecondes
let inactivityTimer = null;
let warningTimer = null;
let warningShown = false;

// Événements qui réinitialisent le timer
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

// Fonction de déconnexion
async function autoLogout() {
  try {
    await supabase.auth.signOut();
    
    // Afficher un message
    showLogoutMessage();
    
    // Rediriger après 2 secondes
    setTimeout(() => {
      window.location.href = 'auth.html?reason=inactivity';
    }, 2000);
  } catch (error) {
    console.error('Erreur déconnexion auto:', error);
  }
}

// Afficher un message de déconnexion
function showLogoutMessage() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  overlay.innerHTML = `
    <div style="
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--r-xl);
      padding: 32px;
      text-align: center;
      max-width: 400px;
      animation: slideUp 0.3s ease;
    ">
      <div style="font-size: 3rem; margin-bottom: 16px;">⏱️</div>
      <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-1); margin-bottom: 8px;">
        Session expirée
      </h3>
      <p style="color: var(--text-2); font-size: 0.9rem; margin-bottom: 20px;">
        Vous avez été déconnecté pour inactivité.
      </p>
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid var(--surface-2);
        border-top-color: var(--brand-1);
        border-radius: 50%;
        margin: 0 auto;
        animation: spin 0.8s linear infinite;
      "></div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

// Afficher un avertissement avant déconnexion
function showWarning() {
  if (warningShown) return;
  warningShown = true;
  
  const warning = document.createElement('div');
  warning.id = 'inactivity-warning';
  warning.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, rgba(245, 124, 0, 0.95), rgba(251, 146, 60, 0.95));
    color: white;
    padding: 16px 20px;
    border-radius: var(--r-xl);
    box-shadow: 0 8px 32px rgba(245, 124, 0, 0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInRight 0.3s ease;
    max-width: 320px;
  `;
  
  warning.innerHTML = `
    <div style="font-size: 1.5rem;">⚠️</div>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">
        Inactivité détectée
      </div>
      <div style="font-size: 0.78rem; opacity: 0.9;">
        Vous serez déconnecté dans 30 secondes
      </div>
    </div>
    <button onclick="dismissWarning()" style="
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    ">✕</button>
  `;
  
  document.body.appendChild(warning);
  
  // Retirer l'avertissement après 5 secondes
  setTimeout(() => {
    warning.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => warning.remove(), 300);
  }, 5000);
}

// Fonction pour fermer l'avertissement
window.dismissWarning = function() {
  const warning = document.getElementById('inactivity-warning');
  if (warning) {
    warning.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => warning.remove(), 300);
  }
  resetInactivityTimer();
};

// Réinitialiser le timer d'inactivité
function resetInactivityTimer() {
  warningShown = false;
  
  // Effacer les timers existants
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (warningTimer) clearTimeout(warningTimer);
  
  // Avertissement après 30 secondes
  warningTimer = setTimeout(() => {
    showWarning();
  }, 30000);
  
  // Déconnexion après 1 minute
  inactivityTimer = setTimeout(() => {
    autoLogout();
  }, INACTIVITY_TIMEOUT);
}

// Initialiser le système
export function initAutoLogout() {
  // Vérifier si l'utilisateur est connecté
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return;
    
    // Démarrer le timer
    resetInactivityTimer();
    
    // Écouter les événements d'activité
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Écouter les changements de visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        resetInactivityTimer();
      }
    });
  });
}

// Nettoyer les timers lors de la déconnexion manuelle
export function cleanupAutoLogout() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (warningTimer) clearTimeout(warningTimer);
  
  ACTIVITY_EVENTS.forEach(event => {
    document.removeEventListener(event, resetInactivityTimer);
  });
}

// Animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
