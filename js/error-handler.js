// ============================================================
// CAMPUSLY — Error Handler (Gestion centralisée des erreurs)
// ============================================================

import { showToast } from './utils.js';

/**
 * Types d'erreurs
 */
export const ErrorType = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

/**
 * Messages d'erreur par défaut
 */
const defaultMessages = {
  [ErrorType.NETWORK]: 'Erreur de connexion. Vérifiez votre connexion internet.',
  [ErrorType.AUTH]: 'Erreur d\'authentification. Veuillez vous reconnecter.',
  [ErrorType.VALIDATION]: 'Les données fournies sont invalides.',
  [ErrorType.PERMISSION]: 'Vous n\'avez pas la permission d\'effectuer cette action.',
  [ErrorType.NOT_FOUND]: 'La ressource demandée n\'existe pas.',
  [ErrorType.SERVER]: 'Erreur serveur. Veuillez réessayer plus tard.',
  [ErrorType.UNKNOWN]: 'Une erreur inattendue s\'est produite.'
};

/**
 * Classe d'erreur personnalisée
 */
export class AppError extends Error {
  constructor(type, message, originalError = null, recoverable = true) {
    super(message || defaultMessages[type] || defaultMessages[ErrorType.UNKNOWN]);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.recoverable = recoverable;
    this.timestamp = new Date();
  }
}

/**
 * Détecte le type d'erreur à partir d'une erreur Supabase/réseau
 */
function detectErrorType(error) {
  if (!error) return ErrorType.UNKNOWN;
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  // Erreurs réseau
  if (message.includes('fetch') || message.includes('network') || code === 'network_error') {
    return ErrorType.NETWORK;
  }
  
  // Erreurs d'authentification
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || 
      message.includes('invalid login') || message.includes('jwt')) {
    return ErrorType.AUTH;
  }
  
  // Erreurs de permission
  if (code === 'permission_denied' || message.includes('permission') || 
      message.includes('unauthorized') || error.status === 403) {
    return ErrorType.PERMISSION;
  }
  
  // Erreurs 404
  if (error.status === 404 || message.includes('not found')) {
    return ErrorType.NOT_FOUND;
  }
  
  // Erreurs serveur
  if (error.status >= 500 || message.includes('server error')) {
    return ErrorType.SERVER;
  }
  
  // Erreurs de validation
  if (code === 'validation_error' || message.includes('invalid')) {
    return ErrorType.VALIDATION;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Gère une erreur de manière centralisée
 * @param {Error|AppError} error - Erreur à gérer
 * @param {object} options - Options de gestion
 */
export function handleError(error, options = {}) {
  const {
    showToUser = true,
    logToConsole = true,
    customMessage = null,
    onRetry = null
  } = options;
  
  // Convertit en AppError si nécessaire
  let appError;
  if (error instanceof AppError) {
    appError = error;
  } else {
    const type = detectErrorType(error);
    appError = new AppError(type, customMessage, error);
  }
  
  // Log en console (en dev)
  if (logToConsole && process.env.NODE_ENV !== 'production') {
    console.error('[Error Handler]', {
      type: appError.type,
      message: appError.message,
      original: appError.originalError,
      timestamp: appError.timestamp
    });
  }
  
  // Affiche à l'utilisateur
  if (showToUser) {
    const toastType = appError.recoverable ? 'error' : 'warning';
    showToast(appError.message, toastType);
    
    // Bouton retry si disponible
    if (appError.recoverable && onRetry) {
      // TODO: Ajouter un bouton retry dans le toast
    }
  }
  
  // Envoie à un service de monitoring (Sentry, etc.) en production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Intégrer Sentry ou autre
    // Sentry.captureException(appError);
  }
  
  return appError;
}

/**
 * Wrapper pour les fonctions async avec gestion d'erreur
 * @param {Function} fn - Fonction async à wrapper
 * @param {object} errorOptions - Options de gestion d'erreur
 * @returns {Function} Fonction wrappée
 */
export function withErrorHandling(fn, errorOptions = {}) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorOptions);
      throw error; // Re-throw pour que l'appelant puisse aussi gérer
    }
  };
}

/**
 * Gère les erreurs Supabase spécifiquement
 * @param {object} response - Réponse Supabase { data, error }
 * @param {string} customMessage - Message personnalisé
 * @returns {any} data si succès
 * @throws {AppError} si erreur
 */
export function handleSupabaseResponse(response, customMessage = null) {
  if (response.error) {
    const type = detectErrorType(response.error);
    throw new AppError(type, customMessage || response.error.message, response.error);
  }
  
  return response.data;
}

/**
 * Retry une fonction avec backoff exponentiel
 * @param {Function} fn - Fonction à retry
 * @param {number} maxRetries - Nombre max de tentatives
 * @param {number} delay - Délai initial en ms
 * @returns {Promise<any>} Résultat de la fonction
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      const appError = error instanceof AppError ? error : new AppError(detectErrorType(error), null, error);
      
      // Ne retry que les erreurs réseau et serveur
      if (![ErrorType.NETWORK, ErrorType.SERVER].includes(appError.type)) {
        throw appError;
      }
      
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} dans ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

/**
 * Gère les erreurs de validation de formulaire
 * @param {object} errors - Objet d'erreurs { field: message }
 */
export function displayFormErrors(errors) {
  // Efface les erreurs précédentes
  document.querySelectorAll('.form-error').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
  
  // Affiche les nouvelles erreurs
  for (const [field, message] of Object.entries(errors)) {
    const errorEl = document.getElementById(`${field}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
    
    // Ajoute une classe d'erreur au champ
    const inputEl = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
    if (inputEl) {
      inputEl.classList.add('error');
      
      // Retire la classe au focus
      inputEl.addEventListener('focus', () => {
        inputEl.classList.remove('error');
        if (errorEl) errorEl.classList.remove('show');
      }, { once: true });
    }
  }
  
  // Focus sur le premier champ en erreur
  const firstErrorField = Object.keys(errors)[0];
  const firstInput = document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`);
  if (firstInput) {
    firstInput.focus();
  }
}

/**
 * Gestionnaire global d'erreurs non capturées
 */
export function initGlobalErrorHandler() {
  // Erreurs JavaScript non capturées
  window.addEventListener('error', (event) => {
    handleError(new AppError(ErrorType.UNKNOWN, 'Erreur JavaScript', event.error), {
      showToUser: false,
      logToConsole: true
    });
  });
  
  // Promesses rejetées non capturées
  window.addEventListener('unhandledrejection', (event) => {
    handleError(new AppError(ErrorType.UNKNOWN, 'Promesse rejetée', event.reason), {
      showToUser: false,
      logToConsole: true
    });
  });
}
