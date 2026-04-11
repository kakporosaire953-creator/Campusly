// ============================================================
// CAMPUSLY — Theme Switcher (Light/Dark Mode)
// ============================================================

const THEME_KEY = 'campusly_theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// Détecter la préférence système
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK;
  }
  return THEME_LIGHT;
}

// Récupérer le thème sauvegardé ou système
function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved || getSystemTheme();
}

// Appliquer le thème
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  
  // Mettre à jour l'icône du bouton
  updateThemeButton(theme);
  
  // Émettre un événement personnalisé
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// Basculer entre les thèmes
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
  const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme(next);
  
  // Animation de transition
  document.body.style.transition = 'background-color 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

// Mettre à jour l'icône du bouton
function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  
  const icon = theme === THEME_DARK ? '☀️' : '🌙';
  const title = theme === THEME_DARK ? 'Mode clair' : 'Mode sombre';
  
  btn.innerHTML = icon;
  btn.setAttribute('title', title);
  btn.setAttribute('aria-label', title);
}

// Créer le bouton de changement de thème
function createThemeButton() {
  const currentTheme = getSavedTheme();
  
  const button = document.createElement('button');
  button.id = 'themeToggle';
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', currentTheme === THEME_DARK ? 'Mode clair' : 'Mode sombre');
  button.onclick = toggleTheme;
  
  updateThemeButton(currentTheme);
  
  return button;
}

// Injecter le bouton dans la navbar
function injectThemeButton() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;
  
  // Vérifier si le bouton existe déjà
  if (document.getElementById('themeToggle')) return;
  
  const button = createThemeButton();
  
  // Insérer avant les actions de navigation
  const navActions = document.getElementById('navActions');
  if (navActions) {
    navRight.insertBefore(button, navActions);
  } else {
    navRight.insertBefore(button, navRight.firstChild);
  }
}

// Écouter les changements de préférence système
function watchSystemTheme() {
  if (!window.matchMedia) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    // Ne changer que si l'utilisateur n'a pas de préférence sauvegardée
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
    }
  });
}

// Initialiser le thème au chargement
function initTheme() {
  const theme = getSavedTheme();
  applyTheme(theme);
  
  // Injecter le bouton après un court délai pour s'assurer que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(injectThemeButton, 100);
    });
  } else {
    setTimeout(injectThemeButton, 100);
  }
  
  // Écouter les changements système
  watchSystemTheme();
}

// Styles CSS pour le bouton
const themeButtonStyles = document.createElement('style');
themeButtonStyles.textContent = `
  .theme-toggle {
    width: 40px;
    height: 40px;
    border-radius: var(--r-full);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-1);
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-right: 8px;
  }
  
  .theme-toggle:hover {
    background: var(--surface-2);
    border-color: var(--brand-1);
    transform: rotate(20deg) scale(1.1);
  }
  
  .theme-toggle:active {
    transform: rotate(20deg) scale(0.95);
  }
  
  @media (max-width: 768px) {
    .theme-toggle {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
  }
`;
document.head.appendChild(themeButtonStyles);

// Initialiser immédiatement
initTheme();

// Exporter les fonctions
export { toggleTheme, applyTheme, getSavedTheme, initTheme };
