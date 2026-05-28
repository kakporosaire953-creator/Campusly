// ============================================================
// CAMPUSLY — Utilitaires partagés
// ============================================================

/**
 * Affiche un toast de notification
 * @param {string} message - Message à afficher
 * @param {string} type - Type : 'info', 'success', 'error', 'warning'
 * @param {number} duration - Durée en ms (défaut: 3500)
 */
export function showToast(message, type = "info", duration = 3500) {
  let toast = document.getElementById("toast");
  
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/**
 * Affiche un loader
 * @param {string} message - Message optionnel
 * @returns {HTMLElement} Élément du loader
 */
export function showLoader(message = "Chargement...") {
  let loader = document.getElementById("global-loader");
  
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.className = "loader-overlay";
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p class="loader-message">${message}</p>
      </div>
    `;
    document.body.appendChild(loader);
  } else {
    const msg = loader.querySelector(".loader-message");
    if (msg) msg.textContent = message;
  }
  
  loader.style.display = "flex";
  return loader;
}

/**
 * Cache le loader
 */
export function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "none";
}

/**
 * Affiche une erreur dans un élément
 * @param {string} elementId - ID de l'élément
 * @param {string} message - Message d'erreur
 */
export function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.classList.add("show");
  }
}

/**
 * Efface toutes les erreurs de formulaire
 */
export function clearErrors() {
  document.querySelectorAll(".form-error").forEach(el => {
    el.classList.remove("show");
    el.textContent = "";
  });
}

/**
 * Debounce une fonction
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle une fonction
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Limite en ms
 * @returns {Function} Fonction throttlée
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Formate une date en français
 * @param {Date|string} date - Date à formater
 * @param {boolean} includeTime - Inclure l'heure
 * @returns {string} Date formatée
 */
export function formatDate(date, includeTime = false) {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return 'Date invalide';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString('fr-FR', options);
}

/**
 * Formate une date relative (il y a X minutes)
 * @param {Date|string} date - Date à formater
 * @returns {string} Date relative
 */
export function formatRelativeDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now - d;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return formatDate(d);
}

/**
 * Copie du texte dans le presse-papier
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} true si succès
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copié dans le presse-papier', 'success');
    return true;
  } catch (err) {
    console.error('Erreur de copie:', err);
    showToast('Erreur lors de la copie', 'error');
    return false;
  }
}

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Vérifie si l'utilisateur est sur mobile
 * @returns {boolean} true si mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Scroll smooth vers un élément
 * @param {string|HTMLElement} target - Sélecteur ou élément
 * @param {number} offset - Offset en pixels
 */
export function scrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) return;
  
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

/**
 * Attend un certain temps
 * @param {number} ms - Millisecondes
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry une fonction async avec backoff exponentiel
 * @param {Function} fn - Fonction async à retry
 * @param {number} maxRetries - Nombre max de tentatives
 * @param {number} delay - Délai initial en ms
 * @returns {Promise<any>} Résultat de la fonction
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i)); // Backoff exponentiel
      }
    }
  }
  
  throw lastError;
}

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Tronque un texte
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur max
 * @returns {string} Texte tronqué
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Rend showToast disponible globalement pour la compatibilité
if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
