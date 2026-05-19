// ============================================================
// CAMPUSLY — PWA Installer & Service Worker Registration
// ============================================================

let deferredPrompt = null;
let swRegistration = null;

// Enregistrer le Service Worker
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker non supporté');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('[PWA] Service Worker enregistré:', registration.scope);
    swRegistration = registration;

    // Vérifier les mises à jour toutes les heures
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Écouter les mises à jour
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Erreur enregistrement Service Worker:', error);
    return null;
  }
}

// Afficher notification de mise à jour
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'pwa-update-notification';
  notification.innerHTML = `
    <div class="pwa-update-content">
      <div class="pwa-update-icon">🎉</div>
      <div class="pwa-update-text">
        <strong>Nouvelle version disponible !</strong>
        <p>Rechargez pour profiter des dernières améliorations.</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="updateApp()">Mettre à jour</button>
      <button class="pwa-update-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => notification.classList.add('show'), 100);
}

// Mettre à jour l'application
window.updateApp = function() {
  if (!swRegistration || !swRegistration.waiting) return;
  
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
};

// Gérer l'installation PWA
function initPWAInstall() {
  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher le bouton d'installation
    showInstallButton();
  });

  // Écouter l'installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application installée');
    deferredPrompt = null;
    hideInstallButton();
    
    // Afficher un message de succès
    showToast('Campusly installé avec succès ! 🎉', 'success');
  });
}

// Afficher le bouton d'installation
function showInstallButton() {
  // Vérifier si le bouton existe déjà
  if (document.getElementById('pwaInstallBtn')) return;
  
  const button = document.createElement('button');
  button.id = 'pwaInstallBtn';
  button.className = 'pwa-install-btn';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    <span>Installer l'app</span>
  `;
  button.onclick = installPWA;
  
  // Ajouter à la navbar
  const navRight = document.querySelector('.nav-right');
  if (navRight) {
    navRight.insertBefore(button, navRight.firstChild);
  }
}

// Masquer le bouton d'installation
function hideInstallButton() {
  const button = document.getElementById('pwaInstallBtn');
  if (button) {
    button.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => button.remove(), 300);
  }
}

// Installer la PWA
async function installPWA() {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] Choix utilisateur:', outcome);
  
  deferredPrompt = null;
  hideInstallButton();
}

// Vérifier si l'app est déjà installée
function isAppInstalled() {
  // Vérifier si lancé en mode standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Vérifier si lancé depuis l'écran d'accueil (iOS)
  if (window.navigator.standalone === true) {
    return true;
  }
  
  return false;
}

// Afficher un badge "Installé" si l'app est installée
function showInstalledBadge() {
  if (!isAppInstalled()) return;
  
  const badge = document.createElement('div');
  badge.className = 'pwa-installed-badge';
  badge.innerHTML = '📱 App installée';
  
  const navRight = document.querySelector('.nav-right');
  if (navRight) {
    navRight.insertBefore(badge, navRight.firstChild);
  }
}

// Gérer le mode hors ligne
function handleOfflineMode() {
  window.addEventListener('online', () => {
    showToast('Connexion rétablie ! 🌐', 'success');
  });
  
  window.addEventListener('offline', () => {
    showToast('Vous êtes hors ligne. Certaines fonctionnalités sont limitées.', 'info');
  });
}

// Fonction toast helper
function showToast(msg, type = 'info') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

// Initialiser la PWA
async function initPWA() {
  console.log('[PWA] Initialisation...');
  
  // Enregistrer le Service Worker
  await registerServiceWorker();
  
  // Initialiser l'installation
  initPWAInstall();
  
  // Afficher le badge si installé
  showInstalledBadge();
  
  // Gérer le mode hors ligne
  handleOfflineMode();
  
  console.log('[PWA] Initialisé avec succès');
}

// Styles CSS pour PWA
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
  .pwa-install-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: var(--r-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  .pwa-install-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
  
  .pwa-install-btn svg {
    flex-shrink: 0;
  }
  
  .pwa-installed-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--r-full);
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 8px;
  }
  
  .pwa-update-notification {
    position: fixed;
    bottom: -200px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    transition: bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 500px;
    width: calc(100% - 32px);
  }
  
  .pwa-update-notification.show {
    bottom: 24px;
  }
  
  .pwa-update-content {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--r-xl);
    padding: 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
  }
  
  [data-theme="dark"] .pwa-update-content {
    background: var(--bg-2);
    border-color: var(--border);
  }
  
  .pwa-update-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .pwa-update-text {
    flex: 1;
  }
  
  .pwa-update-text strong {
    display: block;
    font-size: 0.95rem;
    color: var(--text-1);
    margin-bottom: 4px;
  }
  
  .pwa-update-text p {
    font-size: 0.85rem;
    color: var(--text-3);
    margin: 0;
  }
  
  .pwa-update-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-3);
    font-size: 1.2rem;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--r-sm);
    transition: all 0.2s ease;
  }
  
  .pwa-update-close:hover {
    background: var(--surface);
    color: var(--text-1);
  }
  
  @media (max-width: 768px) {
    .pwa-install-btn span {
      display: none;
    }
    
    .pwa-install-btn {
      padding: 8px 12px;
    }
    
    .pwa-update-content {
      flex-direction: column;
      text-align: center;
    }
  }
  
  @keyframes slideOut {
    to {
      opacity: 0;
      transform: translateX(-100%);
    }
  }
`;
document.head.appendChild(pwaStyles);

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

// Exporter les fonctions
export { registerServiceWorker, installPWA, isAppInstalled, initPWA };
