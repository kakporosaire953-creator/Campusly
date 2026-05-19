// ============================================================
// CAMPUSLY — Accessibility Enhancements (ARIA, A11y)
// ============================================================

// Configuration
const A11Y_CONFIG = {
  skipLinkText: 'Aller au contenu principal',
  announceDelay: 100,
  focusOutlineColor: '#3b82f6'
};

// Initialiser les améliorations d'accessibilité
function initAccessibility() {
  console.log('[A11y] Initialisation...');
  
  // Ajouter un lien "Skip to content"
  addSkipLink();
  
  // Améliorer les attributs ARIA
  enhanceARIA();
  
  // Gérer le focus clavier
  manageFocusIndicators();
  
  // Ajouter les annonces pour lecteurs d'écran
  setupLiveRegions();
  
  // Améliorer la navigation au clavier
  enhanceKeyboardNavigation();
  
  // Gérer les modals
  enhanceModals();
  
  console.log('[A11y] Initialisé');
}

// Ajouter un lien "Skip to content"
function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = A11Y_CONFIG.skipLinkText;
  skipLink.setAttribute('aria-label', 'Aller directement au contenu principal');
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ajouter l'ID au contenu principal
  const main = document.querySelector('main') || document.querySelector('.dashboard-main') || document.querySelector('.epreuves-main');
  if (main && !main.id) {
    main.id = 'main-content';
    main.setAttribute('tabindex', '-1');
  }
}

// Améliorer les attributs ARIA
function enhanceARIA() {
  // Navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.setAttribute('role', 'navigation');
    navbar.setAttribute('aria-label', 'Navigation principale');
  }
  
  // Sidebar
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.setAttribute('role', 'navigation');
    sidebar.setAttribute('aria-label', 'Navigation secondaire');
  }
  
  // Boutons sans texte
  document.querySelectorAll('button:not([aria-label])').forEach(btn => {
    const icon = btn.querySelector('svg');
    if (icon && !btn.textContent.trim()) {
      const title = btn.getAttribute('title') || 'Bouton';
      btn.setAttribute('aria-label', title);
    }
  });
  
  // Liens sans texte
  document.querySelectorAll('a:not([aria-label])').forEach(link => {
    const icon = link.querySelector('svg');
    if (icon && !link.textContent.trim()) {
      const title = link.getAttribute('title') || 'Lien';
      link.setAttribute('aria-label', title);
    }
  });
  
  // Images sans alt
  document.querySelectorAll('img:not([alt])').forEach(img => {
    img.setAttribute('alt', '');
    img.setAttribute('role', 'presentation');
  });
  
  // Formulaires
  document.querySelectorAll('input, select, textarea').forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder) {
        input.setAttribute('aria-label', placeholder);
      }
    }
    
    // Ajouter aria-required pour les champs requis
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  // Cards
  document.querySelectorAll('.card, .ep-card, .q-card').forEach(card => {
    if (!card.getAttribute('role')) {
      card.setAttribute('role', 'article');
    }
  });
  
  // Modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    const title = modal.querySelector('.modal-title');
    if (title && !title.id) {
      title.id = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
      modal.setAttribute('aria-labelledby', title.id);
    }
  });
  
  // Toasts
  document.querySelectorAll('.toast').forEach(toast => {
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
  });
}

// Gérer les indicateurs de focus
function manageFocusIndicators() {
  let isUsingMouse = false;
  
  // Détecter l'utilisation de la souris
  document.addEventListener('mousedown', () => {
    isUsingMouse = true;
    document.body.classList.add('using-mouse');
    document.body.classList.remove('using-keyboard');
  });
  
  // Détecter l'utilisation du clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingMouse = false;
      document.body.classList.add('using-keyboard');
      document.body.classList.remove('using-mouse');
    }
  });
  
  // Améliorer le focus visible
  document.addEventListener('focusin', (e) => {
    if (!isUsingMouse) {
      e.target.classList.add('keyboard-focus');
    }
  });
  
  document.addEventListener('focusout', (e) => {
    e.target.classList.remove('keyboard-focus');
  });
}

// Configurer les régions live pour les annonces
function setupLiveRegions() {
  // Créer une région live pour les annonces
  const liveRegion = document.createElement('div');
  liveRegion.id = 'a11y-announcer';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  
  document.body.appendChild(liveRegion);
}

// Annoncer un message aux lecteurs d'écran
function announce(message, priority = 'polite') {
  const announcer = document.getElementById('a11y-announcer');
  if (!announcer) return;
  
  announcer.setAttribute('aria-live', priority);
  
  setTimeout(() => {
    announcer.textContent = message;
    
    // Effacer après 5 secondes
    setTimeout(() => {
      announcer.textContent = '';
    }, 5000);
  }, A11Y_CONFIG.announceDelay);
}

// Améliorer la navigation au clavier
function enhanceKeyboardNavigation() {
  // Escape pour fermer les modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Fermer les modals ouvertes
      const openModals = document.querySelectorAll('.modal-overlay.show');
      openModals.forEach(modal => {
        modal.classList.remove('show');
        announce('Modal fermée');
      });
      
      // Fermer les menus ouverts
      const openMenus = document.querySelectorAll('.nav-links.open');
      openMenus.forEach(menu => {
        menu.classList.remove('open');
        announce('Menu fermé');
      });
    }
  });
  
  // Navigation dans les listes avec flèches
  document.querySelectorAll('[role="listbox"], [role="menu"]').forEach(list => {
    const items = list.querySelectorAll('[role="option"], [role="menuitem"]');
    let currentIndex = 0;
    
    list.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        currentIndex = 0;
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        currentIndex = items.length - 1;
        items[items.length - 1].focus();
      }
    });
  });
}

// Améliorer les modals
function enhanceModals() {
  let lastFocusedElement = null;
  
  // Observer les modals
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.target.querySelectorAll('.modal-overlay').forEach((modal) => {
        if (modal.classList.contains('show')) {
          // Sauvegarder l'élément focusé
          lastFocusedElement = document.activeElement;
          
          // Piéger le focus dans la modal
          trapFocus(modal);
          
          // Annoncer l'ouverture
          const title = modal.querySelector('.modal-title')?.textContent || 'Modal ouverte';
          announce(title);
          
          // Focus sur le premier élément focusable
          setTimeout(() => {
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
          }, 100);
        } else {
          // Restaurer le focus
          if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
}

// Piéger le focus dans un élément
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
}

// Vérifier le contraste des couleurs
function checkContrast(foreground, background) {
  // Convertir les couleurs en RGB
  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  
  if (!rgb1 || !rgb2) return null;
  
  // Calculer la luminance relative
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  
  // Calculer le ratio de contraste
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: ratio >= 3,
    AAALarge: ratio >= 4.5
  };
}

// Convertir hex en RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculer la luminance relative
function relativeLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Styles CSS pour l'accessibilité
const a11yStyles = document.createElement('style');
a11yStyles.textContent = `
  /* Skip link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--brand-1);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 var(--r-md) 0;
    z-index: 10000;
    font-weight: 600;
  }
  
  .skip-link:focus {
    top: 0;
  }
  
  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  /* Focus visible amélioré */
  .using-keyboard *:focus {
    outline: 3px solid ${A11Y_CONFIG.focusOutlineColor};
    outline-offset: 2px;
  }
  
  .using-mouse *:focus {
    outline: none;
  }
  
  .keyboard-focus {
    outline: 3px solid ${A11Y_CONFIG.focusOutlineColor} !important;
    outline-offset: 2px !important;
  }
  
  /* Améliorer la visibilité du focus sur les boutons */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid ${A11Y_CONFIG.focusOutlineColor};
    outline-offset: 2px;
  }
  
  /* Indicateur de focus pour les cards cliquables */
  [role="article"]:focus-within {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  /* Améliorer la visibilité des liens */
  a:not(.btn) {
    text-decoration-skip-ink: auto;
  }
  
  a:not(.btn):hover {
    text-decoration: underline;
  }
  
  /* Indicateur de chargement accessible */
  [aria-busy="true"] {
    cursor: wait;
  }
  
  /* Mode contraste élevé */
  @media (prefers-contrast: high) {
    * {
      border-width: 2px !important;
    }
    
    button, .btn {
      border: 2px solid currentColor !important;
    }
  }
  
  /* Réduire les animations si préféré */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
document.head.appendChild(a11yStyles);

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Exporter les fonctions
export {
  initAccessibility,
  announce,
  checkContrast,
  trapFocus
};
