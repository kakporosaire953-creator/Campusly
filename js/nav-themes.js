// ============================================================
// CAMPUSLY — js/nav-themes.js
// Personnalisation des styles de navigation & Thèmes
// ============================================================

export class NavThemeManager {
  constructor() {
    this.navStyleKey = 'campusly_nav_style';
    this.themeKey = 'campusly_theme_mode';
    this.init();
  }

  init() {
    const savedNav = localStorage.getItem(this.navStyleKey) || 'carte';
    this.applyNavStyle(savedNav);

    const savedTheme = localStorage.getItem('campusly_theme') || 'light';
    this.applyTheme(savedTheme);
  }

  applyNavStyle(styleName) {
    localStorage.setItem(this.navStyleKey, styleName);
    const nav = document.querySelector('header, .site-header, .navbar');
    if (!nav) return;

    nav.classList.remove('nav-style-transparente', 'nav-style-inversee', 'nav-style-carte', 'nav-style-vibrante');
    nav.classList.add(`nav-style-${styleName}`);
  }

  applyTheme(theme) {
    localStorage.setItem(this.themeKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export const navThemeManager = new NavThemeManager();
window.navThemeManager = navThemeManager;
